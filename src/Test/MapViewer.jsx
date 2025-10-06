import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { Grid, Box, FormControl, Breadcrumbs, Typography, Button, CircularProgress, useTheme, Select, MenuItem, IconButton } from "@mui/material";
import BarChartIcon from "@mui/icons-material/BarChart";
import VisibilityIcon from '@mui/icons-material/Visibility';
import ViewModuleIcon from '@mui/icons-material/ViewModule';
import Swal from "sweetalert2";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import screenfull from "screenfull";
import _ from "lodash";
import domtoimage from "dom-to-image";
import html2canvas from "html2canvas";
import MapLegend from "./MapLegend";
import DownloadDropdown from "./DownloadDropdown";
import AnalyticsPage from "./AnalyticsPage";

// Leaflet control setup
L.Control.MapControls = L.Control.extend({
  options: {
    position: "topright",
    isFullscreen: false,
    onFullscreen: () => { },
    onFitExtent: () => { },
    updateFullscreenButton: () => { },
  },
  onAdd(map) {
    const container = L.DomUtil.create("div", "leaflet-bar leaflet-control leaflet-control-custom");
    const fullscreenButton = L.DomUtil.create("a", "leaflet-control-button", container);
    fullscreenButton.innerHTML = this.options.isFullscreen ? "⤡" : "⤢";
    fullscreenButton.href = "#";
    fullscreenButton.title = this.options.isFullscreen ? "Exit Fullscreen" : "Enter Fullscreen";
    fullscreenButton.style.fontSize = "20px";
    L.DomEvent.on(fullscreenButton, "click", (e) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this.options.onFullscreen();
      this.options.updateFullscreenButton(fullscreenButton);
    });
    const fitExtentButton = L.DomUtil.create("a", "leaflet-control-button", container);
    fitExtentButton.innerHTML = "<strong>E</strong>";
    fitExtentButton.href = "#";
    fitExtentButton.title = "Fit to Extent";
    fitExtentButton.style.fontSize = "16px";
    L.DomEvent.on(fitExtentButton, "click", (e) => {
      L.DomEvent.stopPropagation(e);
      L.DomEvent.preventDefault(e);
      this.options.onFitExtent();
    });
    container.style.backgroundColor = "#fff";
    container.style.border = "2px solid rgba(0,0,0,0.2)";
    container.style.borderRadius = "4px";
    const buttons = container.getElementsByTagName("a");
    for (let btn of buttons) {
      btn.style.display = "block";
      btn.style.padding = "4px";
      btn.style.textAlign = "center";
      btn.style.backgroundColor = "#fff";
      btn.style.borderBottom = "1px solid rgba(0,0,0,0.2)";
      btn.style.cursor = "pointer";
    }
    buttons[buttons.length - 1].style.borderBottom = "none";
    return container;
  },
  onRemove() { },
});
L.control.mapControls = function (mapControls) {
  return new L.Control.MapControls(mapControls);
};

function MapViewer({
  drawerOpen,
  filters,
  adaptations,
  mapLoading,
  setMapLoading,
  climateScenarios,
}) {
  const apiUrl = process.env.REACT_APP_API_URL;
  const theme = useTheme();
  const mapRefs = useRef([]);
  const mapInstances = useRef([]);
  const layerRefs = useRef([]);
  const boundsRefs = useRef([]);
  const fullscreenButtonRefs = useRef([]);
  const tileLayerRefs = useRef([]);
  const isZoomingRef = useRef([]);
  const [internalMapLoading, setInternalMapLoading] = useState([false, false, false]);
  const [tiffData, setTiffData] = useState([]);
  const [fileList, setFileList] = useState([]);
  const [allDataReady, setAllDataReady] = useState(false);
  const [breadcrumbData, setBreadcrumbData] = useState(null);
  const [isFullscreen, setIsFullscreen] = useState([false, false, false]);
  const [noGeoTiffAvailable, setNoGeoTiffAvailable] = useState([false, false, false]);
  const [adaptationTabs, setAdaptationTabs] = useState([]);
  const [selectedAdaptationTabId, setSelectedAdaptationTabId] = useState(1);
  const [isSyncing, setIsSyncing] = useState(false);
  const [selectedIntensityMetric, setSelectedIntensityMetric] = useState("Intensity Frequency");
  const [selectedScenario, setSelectedScenario] = useState(3);
  const [selectedChangeMetric, setSelectedChangeMetric] = useState("Absolute");
  const [isOptionLoading, setIsOptionLoading] = useState(false);
  const [showAnalytics, setShowAnalytics] = useState(false);
  const [viewMode, setViewMode] = useState("all");
  const [toggleChangeMetric, setToggleChangeMetric] = useState(true);
  const [toggleIntensityMetric, setToggleIntensityMetric] = useState(false);
  const isFetchingRef = useRef(false);
  const lastTiffDataRef = useRef([]);
  const lastViewModeRef = useRef("all");
  const mapsInitializedRef = useRef(false);
  const georasterCache = useRef(new Map());
  const hasRenderedRef = useRef([]);
  const firstTime = useRef(true);
  const throttledSyncRefs = useRef([]);

  // Memoize filters
  const memoizedFilters = useMemo(
    () => ({
      ...filters,
      geojson: filters?.geojson ? JSON.parse(JSON.stringify(filters.geojson)) : null,
      bbox: filters?.bbox ? [...filters.bbox] : null,
      districtGeojson: filters?.districtGeojson ? JSON.parse(JSON.stringify(filters.districtGeojson)) : null,
      districtBbox: filters?.districtBbox ? [...filters.districtBbox] : null,
    }),
    [filters]
  );

  useEffect(() => {
    setMapLoading(internalMapLoading.some(loading => loading));
  }, [internalMapLoading, setMapLoading]);

  useEffect(() => {
    if (
      +memoizedFilters?.commodity_type_id === 1 &&
      (memoizedFilters?.layer_type === "adaptation" ||
        memoizedFilters?.layer_type === "adaptation_croptab")
    ) {
      const fetchAdaptationTabs = async () => {
        try {
          const response = await fetch(
            `${apiUrl}/lkp/specific/adaptation_croptabs`,
            { method: "GET", headers: { "Content-Type": "application/json" } }
          );
          if (!response.ok) throw new Error(`HTTP error! Status: ${response.status} `);
          const { success, data } = await response.json();
          if (!success) throw new Error("Error loading adaptation tabs");
          const activeTabs = data.filter(tab => tab.status);
          const groupedTabs = [
            ...activeTabs.filter(tab => ![3, 4, 5].includes(tab.tab_id)),
            {
              tab_id: "gender_group",
              tab_name: "Gender Suitability",
              subTabs: activeTabs
                .filter(tab => [3, 4, 5].includes(tab.tab_id))
                .sort((a, b) => a.tab_id - b.tab_id),
            },
          ].filter(tab => tab.subTabs ? tab.subTabs.length > 0 : true);
          const sortedTabs = groupedTabs.sort((a, b) => {
            const order = [1, 2, "gender_group", 6, 7, 8];
            const aIndex = a.tab_id === "gender_group" ? "gender_group" : a.tab_id;
            const bIndex = b.tab_id === "gender_group" ? "gender_group" : b.tab_id;
            return order.indexOf(aIndex) - order.indexOf(bIndex);
          });
          setAdaptationTabs(sortedTabs || []);
          setSelectedAdaptationTabId(sortedTabs.length > 0 ? sortedTabs[0].tab_id : "");
        } catch (err) {
          console.error(err);
          setAdaptationTabs([]);
          setSelectedAdaptationTabId("");
          // Swal.fire({
          //   icon: "error",
          //   title: "Error",
          //   text: err.message || "Error loading adaptation tabs",
          // });
        }
      };
      fetchAdaptationTabs();
    } else {
      setAdaptationTabs([]);
      setSelectedAdaptationTabId("");
    }
  }, [memoizedFilters?.layer_type, apiUrl]);

  // Updated syncMaps with robust validation
  const syncMaps = useCallback(
    _.throttle((sourceMap, sourceIndex) => {
      if (
        isSyncing ||
        !sourceMap ||
        !mapInstances.current[sourceIndex] ||
        !sourceMap._leaflet_id ||
        !sourceMap.getContainer() ||
        !mapRefs.current[sourceIndex] ||
        mapRefs.current[sourceIndex].offsetParent === null
      ) {
        return;
      }
      setIsSyncing(true);
      try {
        const visibleIndices = viewMode === "single" ? [0] : [0, 1, 2];
        mapInstances.current.forEach((map, index) => {
          if (
            map &&
            map._leaflet_id &&
            map.getContainer() &&
            mapRefs.current[index] &&
            mapRefs.current[index].offsetParent !== null &&
            index !== sourceIndex &&
            visibleIndices.includes(index)
          ) {
            try {
              map.setView(sourceMap.getCenter(), sourceMap.getZoom(), { animate: true });
              _.debounce(() => {
                if (map && map._leaflet_id && map.getContainer()) {
                  map.invalidateSize();
                }
              }, 100)();
            } catch (err) {
              console.warn(`Failed to sync map ${index}: `, err);
            }
          }
        });
      } catch (err) {
        console.error("Error syncing maps:", err);
      } finally {
        setIsSyncing(false);
      }
    }, 50),
    [isSyncing, viewMode]
  );

  const cleanupMaps = useCallback(() => {
    // Cancel all throttled sync calls
    syncMaps.cancel();
    throttledSyncRefs.current.forEach(syncFn => syncFn.cancel());
    throttledSyncRefs.current = [];
    mapInstances.current.forEach((map, index) => {
      if (map) {
        // Remove all event listeners explicitly
        map.off('zoomstart');
        map.off('zoomend');
        map.off('move');
        if (layerRefs.current[index]) {
          layerRefs.current[index].forEach(layer => {
            if (map.hasLayer(layer)) map.removeLayer(layer);
          });
          layerRefs.current[index] = [];
        }
        if (tileLayerRefs.current[index] && map.hasLayer(tileLayerRefs.current[index])) {
          map.removeLayer(tileLayerRefs.current[index]);
        }
        map.off();
        map.remove();
        mapInstances.current[index] = null;
      }
    });
    mapRefs.current = [];
    mapInstances.current = [];
    layerRefs.current = [];
    boundsRefs.current = [];
    fullscreenButtonRefs.current = [];
    tileLayerRefs.current = [];
    isZoomingRef.current = [];
    setIsFullscreen([false, false, false]);
    setTiffData([]);
    setNoGeoTiffAvailable([false, false, false]);
    setAllDataReady(false);
    setBreadcrumbData(null);
    mapsInitializedRef.current = false;
    georasterCache.current.clear();
    hasRenderedRef.current = [];
  }, [syncMaps]);

  const updateFullscreenButton = (button, index) => {
    if (button) {
      const isFull = isFullscreen[index] || false;
      button.innerHTML = isFull ? "⤡" : "⤢";
      button.title = isFull ? "Exit Fullscreen" : "Enter Fullscreen";
    }
  };

  const getTileLayerUrl = () => {
    return theme.palette.mode === "dark"
      ? "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
      : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
  };

  const updateGeoTiffLayer = useCallback(async (tiff, index) => {
    if (!mapInstances.current[index] || !mapRefs.current[index] || !tiff || tiff.noGeoTiff || !tiff.arrayBuffer || !tiff.metadata) {
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
      return;
    }
    const map = mapInstances.current[index];
    const currentZoom = map.getZoom();
    const cacheKey = `${tiff.metadata.source_file} -${index} -${currentZoom} `;
    // Clear cache to ensure fresh rendering
    georasterCache.current.delete(cacheKey);
    setInternalMapLoading(prev => {
      const newLoading = [...prev];
      newLoading[index] = true;
      return newLoading;
    });
    let georaster;
    try {
      georaster = await parseGeoraster(tiff.arrayBuffer.slice(0)); // Fresh copy
      georasterCache.current.set(cacheKey, georaster);
    } catch (err) {
      console.error(`GeoRaster parsing error for index ${index}: `, err);
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
      return;
    }
    const resolution = currentZoom < 7 ? 128 : 256;
    const geotiffLayer = new GeoRasterLayer({
      georaster,
      opacity: 0.8,
      pixelValuesToColorFn: values => {
        if (!values || values.length === 0) return "rgba(255, 255, 255, 0)";
        if (values.length >= 4) {
          const [r, g, b, a] = values;
          return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
        }
        const value = values[0];
        if (!tiff.metadata.color_ramp) return "rgba(255, 255, 255, 0)";
        const min = georaster.mins[0] || 0;
        const max = georaster.maxs[0] || 1;
        if (max === min || value < min || value > max) return "rgba(255, 255, 255, 0)";
        const colorIndex = Math.min(
          Math.max(
            Math.floor(((value - min) / (max - min)) * (tiff.metadata.color_ramp.length - 1)),
            0
          ),
          tiff.metadata.color_ramp.length - 1
        );
        return `rgba(${parseInt(tiff.metadata.color_ramp[colorIndex].slice(1, 3), 16)}, ${parseInt(
          tiff.metadata.color_ramp[colorIndex].slice(3, 5), 16
        )
          }, ${parseInt(tiff.metadata.color_ramp[colorIndex].slice(5, 7), 16)}, 0.8)`;
      },
      resolution,
      pane: "overlayPane",
      fadeAnimation: true,
    });
    // Remove old GeoTIFF layer
    if (layerRefs.current[index]) {
      const oldLayer = layerRefs.current[index].find(layer => layer instanceof GeoRasterLayer);
      if (oldLayer && map.hasLayer(oldLayer)) {
        map.removeLayer(oldLayer);
      }
      layerRefs.current[index] = layerRefs.current[index].filter(layer => !(layer instanceof GeoRasterLayer));
    }
    try {
      geotiffLayer.addTo(map);
      layerRefs.current[index].push(geotiffLayer);
      geotiffLayer.on("click", async e => {
        const { lat, lng } = e.latlng;
        try {
          const value = await georaster.getValues([[lng, lat]])[0];
          L.popup()
            .setLatLng(e.latlng)
            .setContent(`Value: ${value !== undefined ? value.toFixed(2) : "N/A"} at(${lat.toFixed(4)}, ${lng.toFixed(4)})`)
            .openOn(map);
        } catch (err) {
          Swal.fire({
            icon: "error",
            title: "Error",
            text: "Failed to retrieve raster value.",
          });
        }
      });
      geotiffLayer.on("load", () => {
        _.debounce(() => map.invalidateSize(), 100)();
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
      });
      geotiffLayer.on("error", err => {
        console.error(`GeoTIFF layer error for map ${index}: `, err);
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
      });
      // Only update tiffData if necessary to avoid infinite loop
      setTiffData(prev => {
        const prevTiff = prev[index] || {};
        if (
          prevTiff.arrayBuffer === tiff.arrayBuffer &&
          JSON.stringify(prevTiff.metadata) === JSON.stringify(tiff.metadata)
        ) {
          return prev; // No update needed
        }
        const newTiffData = [...prev];
        newTiffData[index] = tiff;
        lastTiffDataRef.current[index] = tiff;
        return newTiffData;
      });
    } catch (err) {
      console.error(`Failed to add GeoTIFF layer to map ${index}: `, err);
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
    }
  }, []);

  const renderMapLayers = useCallback(
    (geoJson, bbox, districtGeoJson, districtBbox, tiff, index) => {
      const map = mapInstances.current[index];
      if (!map || !mapRefs.current[index]) {
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        return;
      }
      // Always render geojson + mask if data available
      if (!geoJson || !bbox) {
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        return;
      }
      const bounds = [[bbox[1], bbox[0]], [bbox[3], bbox[2]]];
      boundsRefs.current[index] = bounds;
      // Clean old layers
      if (layerRefs.current[index]) {
        layerRefs.current[index].forEach(layer => {
          if (map.hasLayer(layer)) map.removeLayer(layer);
        });
        layerRefs.current[index] = [];
      }
      // --- Country/State GeoJSON boundaries ---
      const geojsonFeatureGroup = L.featureGroup();
      const geojsonLayer = L.geoJSON(geoJson, {
        style: {
          color: theme.palette.mode === "dark" ? "white" : "black",
          weight: 2,
          fill: false,
        },
        onEachFeature: (feature, layer) => {
          const tooltipNameIndex = {
            total: "country",
            country: "state",
            state: "district",
          };
          const tooltipText = feature.properties[tooltipNameIndex[memoizedFilters.admin_level]];
          if (tooltipText) {
            layer.bindTooltip(tooltipText, {
              permanent: false,
              direction: "auto",
              className: "map-tooltip",
            });
          }
        },
      });
      geojsonFeatureGroup.addLayer(geojsonLayer);

      // --- District GeoJSON boundaries (only when admin_level is "country") ---
      if (districtGeoJson && memoizedFilters.admin_level === "country") {
        const districtFeatureGroup = L.featureGroup();
        const districtLayer = L.geoJSON(districtGeoJson, {
          style: {
            color: "gray",
            weight: 1,
            opacity: 0.5,
            fill: false,
          },
          onEachFeature: (feature, layer) => {
            const tooltipText = feature.properties.district;
            if (tooltipText) {
              layer.bindTooltip(tooltipText, {
                permanent: false,
                direction: "auto",
                className: "map-tooltip",
              });
            }
          },
        });
        districtFeatureGroup.addLayer(districtLayer);
        districtFeatureGroup.addTo(map);
        layerRefs.current[index].push(districtFeatureGroup);
      }

      // --- MASK outside geojson ---
      const worldBounds = [
        [
          [-90, -180],
          [-90, 180],
          [90, 180],
          [90, -180],
          [-90, -180],
        ],
      ];
      const flipCoordinates = coords => {
        if (!Array.isArray(coords)) return coords;
        if (typeof coords[0] === "number" && typeof coords[1] === "number") {
          return [coords[1], coords[0]];
        }
        return coords.map(flipCoordinates);
      };
      const geojsonCoords = geoJson.features
        .filter(f => f.geometry && ["Polygon", "MultiPolygon"].includes(f.geometry.type))
        .map(f => {
          const { type, coordinates } = f.geometry;
          try {
            return type === "Polygon"
              ? flipCoordinates(coordinates)
              : flipCoordinates(coordinates).flat(1);
          } catch (e) {
            console.warn(`Error processing geometry for feature`, e);
            return [];
          }
        })
        .filter(coords => coords.length > 0);
      let maskPolygon;
      if (geojsonCoords.length > 0) {
        try {
          maskPolygon = L.polygon(
            [worldBounds[0], ...geojsonCoords],
            {
              color: "transparent",
              fillColor: "#ffffff",
              fillOpacity: 0.8,
              weight: 0,
              interactive: false,
              pane: "maskPane",
            }
          );
        } catch (e) {
          console.error("Error creating mask polygon:", e);
          maskPolygon = L.polygon(worldBounds, {
            color: "transparent",
            fillColor: "#ffffff",
            fillOpacity: 0.8,
            weight: 0,
            interactive: false,
            pane: "maskPane",
          });
        }
      }
      if (!map.getPane("maskPane")) {
        map.createPane("maskPane");
        map.getPane("maskPane").style.zIndex = 350;
      }
      geojsonFeatureGroup.addTo(map);
      if (maskPolygon) {
        maskPolygon.addTo(map);
        layerRefs.current[index].push(maskPolygon);
      }
      layerRefs.current[index].push(geojsonFeatureGroup);
      // --- Always fit to extent after geojson ---
      map.fitBounds(bounds, { padding: [50, 50], animate: true });
      _.debounce(() => map.invalidateSize(), 100)();
      // --- GeoTIFF rendering (only if available) ---
      if (tiff && !tiff.noGeoTiff && tiff.arrayBuffer && tiff.metadata) {
        updateGeoTiffLayer(tiff, index).catch(err => {
          console.error(`Error updating GeoTIFF layer for index ${index}: `, err);
          setInternalMapLoading(prev => {
            const newLoading = [...prev];
            newLoading[index] = false;
            return newLoading;
          });
        });
      } else {
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
      }
    },
    [theme.palette.mode, memoizedFilters.admin_level, updateGeoTiffLayer]
  );

  // Ensure each map always gets geojson + masking when data changes
  useEffect(() => {
    const debouncedRender = _.debounce(() => {
      [0, 1, 2].forEach(index => {
        if (memoizedFilters?.geojson && memoizedFilters?.bbox) {
          // Render both GeoJSON and district GeoJSON if available
          renderMapLayers(
            memoizedFilters.geojson,
            memoizedFilters.bbox,
            memoizedFilters.districtGeojson,
            memoizedFilters.districtBbox,
            tiffData[index],
            index
          );
        } else {
          // Clear layers and set loading to false if no GeoJSON/bbox
          const map = mapInstances.current[index];
          if (map && layerRefs.current[index]) {
            layerRefs.current[index].forEach(layer => {
              if (map.hasLayer(layer)) map.removeLayer(layer);
            });
            layerRefs.current[index] = [];
          }
          setInternalMapLoading(prev => {
            const newLoading = [...prev];
            newLoading[index] = false;
            return newLoading;
          });
          setNoGeoTiffAvailable(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
        }
      });
    }, 150);
    debouncedRender();
    return () => debouncedRender.cancel();
  }, [memoizedFilters?.geojson, memoizedFilters?.bbox, memoizedFilters?.districtGeojson, memoizedFilters?.districtBbox, tiffData, renderMapLayers]);

  const initializeMaps = useCallback(() => {
    if (mapsInitializedRef.current) return;
    mapRefs.current = mapRefs.current.slice(0, 3);
    mapInstances.current = mapInstances.current.slice(0, 3);
    fullscreenButtonRefs.current = fullscreenButtonRefs.current.slice(0, 3);
    tileLayerRefs.current = tileLayerRefs.current.slice(0, 3);
    layerRefs.current = layerRefs.current.slice(0, 3);
    isZoomingRef.current = new Array(3).fill(false);
    hasRenderedRef.current = new Array(3).fill(false);
    throttledSyncRefs.current = new Array(3).fill(null);
    let initializedCount = 0;
    [0, 1, 2].forEach(index => {
      const mapRef = mapRefs.current[index];
      if (!mapRef || mapInstances.current[index]) return;
      if (mapRef.offsetParent !== null) {
        const map = L.map(mapRef, {
          minZoom: 3,
          maxZoom: 18,
          zoom: 3,
          fadeAnimation: true,
          zoomAnimation: true,
          zoomSnap: 0.25,
          zoomDelta: 0.25,
          center: [20, 80],
          renderer: L.canvas(),
        });
        const tileLayer = L.tileLayer(getTileLayerUrl(), {
          attribution:
            theme.palette.mode === "dark"
              ? 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors, and the GIS User Community'
              : 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
          opacity: 0,
          errorTileUrl: "/images/fallback-tile.png",
          preload: 1,
        });
        tileLayer.addTo(map);
        tileLayer.on("load", () => {
          tileLayer.setOpacity(1);
          _.debounce(() => {
            if (map && map._leaflet_id && map.getContainer()) {
              map.invalidateSize();
            }
          }, 100)();
        });
        tileLayer.on("error", err => {
          console.error(`Tile layer error for map ${index}: `, err);
        });
        mapInstances.current[index] = map;
        tileLayerRefs.current[index] = tileLayer;
        layerRefs.current[index] = [];
        const mapControl = L.control.mapControls({
          isFullscreen: isFullscreen[index] || false,
          onFullscreen: () => {
            if (screenfull.isEnabled) {
              screenfull.toggle(mapRef).then(() => {
                setIsFullscreen(prev => {
                  const newState = [...prev];
                  newState[index] = !newState[index];
                  return newState;
                });
                _.debounce(() => {
                  if (map && map._leaflet_id && map.getContainer()) {
                    map.invalidateSize();
                  }
                }, 100)();
              });
            } else {
              Swal.fire({
                icon: "warning",
                title: "Fullscreen Not Supported",
                text: "Your browser does not support the fullscreen API.",
              });
            }
          },
          onFitExtent: () => {
            if (boundsRefs.current[index] && mapInstances.current[index]) {
              mapInstances.current[index].fitBounds(boundsRefs.current[index], { padding: [50, 50], animate: true });
              if (mapInstances.current[index]._leaflet_id) {
                syncMaps(mapInstances.current[index], index);
              }
            }
          },
          updateFullscreenButton: button => {
            fullscreenButtonRefs.current[index] = button;
            updateFullscreenButton(button, index);
          },
        });
        mapControl.addTo(map);
        const throttledSync = _.throttle(() => {
          if (
            mapInstances.current[index] &&
            mapInstances.current[index]._leaflet_id &&
            mapInstances.current[index].getContainer() &&
            mapRefs.current[index]?.offsetParent !== null
          ) {
            syncMaps(mapInstances.current[index], index);
          }
        }, 50);
        throttledSyncRefs.current[index] = throttledSync;
        map.on("zoomstart", () => {
          isZoomingRef.current[index] = true;
        });
        map.on("zoomend", () => {
          isZoomingRef.current[index] = false;
          if (tiffData[index] && !tiffData[index].noGeoTiff && !hasRenderedRef.current[index]) {
            updateGeoTiffLayer(tiffData[index], index);
          }
          throttledSync();
        });
        map.on("move", throttledSync);
        delete L.Icon.Default.prototype._getIconUrl;
        L.Icon.Default.mergeOptions({
          iconRetinaUrl: "/images/leaflet/marker-icon-2x.png",
          iconUrl: "/images/leaflet/marker-icon.png",
          shadowUrl: "/images/leaflet/marker-shadow.png",
        });
        _.debounce(() => {
          if (map && map._leaflet_id && map.getContainer()) {
            map.invalidateSize();
          }
        }, 100)();
        initializedCount++;
      }
    });
    mapsInitializedRef.current = initializedCount > 0;
  }, [isFullscreen, syncMaps, theme.palette.mode, tiffData, updateGeoTiffLayer]);

  useEffect(() => {
    // Debounce initialization to ensure DOM is ready
    const initTimeout = setTimeout(() => {
      initializeMaps();
    }, 100);
    return () => clearTimeout(initTimeout);
  }, [initializeMaps]);

  useEffect(() => {
    if (lastViewModeRef.current === viewMode) return;
    lastViewModeRef.current = viewMode;
    const visibleIndices = viewMode === "single" ? [0] : [0, 1, 2];
    [0, 1, 2].forEach(index => {
      if (mapRefs.current[index]) {
        const mapContainer = mapRefs.current[index].parentElement;
        mapContainer.style.display = visibleIndices.includes(index) ? "block" : "none";
        if (visibleIndices.includes(index)) {
          // Reinitialize map if it was previously hidden
          if (!mapInstances.current[index]) {
            initializeMaps();
          } else if (mapInstances.current[index]._leaflet_id && mapRefs.current[index].offsetParent !== null) {
            if (!hasRenderedRef.current[index] && tiffData[index] && memoizedFilters.geojson && memoizedFilters.bbox) {
              renderMapLayers(
                memoizedFilters.geojson,
                memoizedFilters.bbox,
                memoizedFilters.districtGeojson,
                memoizedFilters.districtBbox,
                tiffData[index],
                index
              );
            }
            mapInstances.current[index].invalidateSize();
          }
        }
      }
    });
    // Debounce synchronization after view mode change
    const syncTimeout = setTimeout(() => {
      if (
        mapInstances.current[0] &&
        mapInstances.current[0]._leaflet_id &&
        mapInstances.current[0].getContainer() &&
        mapRefs.current[0]?.offsetParent !== null
      ) {
        syncMaps(mapInstances.current[0], 0);
      }
    }, 200);
    return () => clearTimeout(syncTimeout);
  }, [viewMode, tiffData, memoizedFilters.geojson, memoizedFilters.bbox, memoizedFilters.districtGeojson, memoizedFilters.districtBbox, renderMapLayers, syncMaps, initializeMaps]);

  useEffect(() => {
    mapInstances.current.forEach((map, index) => {
      if (map && tileLayerRefs.current[index] && mapRefs.current[index]) {
        tileLayerRefs.current[index].setOpacity(0);
        map.removeLayer(tileLayerRefs.current[index]);
        const newTileLayer = L.tileLayer(getTileLayerUrl(), {
          attribution:
            theme.palette.mode === "dark"
              ? 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors, and the GIS User Community'
              : 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
          opacity: 0,
          errorTileUrl: "/images/fallback-tile.png",
          preload: 1,
        });
        newTileLayer.addTo(map);
        tileLayerRefs.current[index] = newTileLayer;
        newTileLayer.on("load", () => {
          newTileLayer.setOpacity(1);
          map.invalidateSize();
        });
        if (layerRefs.current[index]) {
          layerRefs.current[index].forEach(layer => {
            if (layer instanceof L.GeoJSON) {
              layer.setStyle({
                color: theme.palette.mode === "dark" ? "white" : "black",
                weight: 2,
                fill: false,
              });
            }
          });
        }
        map.invalidateSize();
      }
    });
  }, [theme.palette.mode]);

  const fetchWithRetry = async (url, options, retries = 1, backoff = 300) => {
    for (let i = 0; i < retries; i++) {
      try {
        const response = await fetch(url, options);
        if (response.ok) return response;
        throw new Error(`HTTP error! Status: ${response.status} `);
      } catch (err) {
        if (i === retries - 1) throw err;
        await new Promise(resolve => setTimeout(resolve, backoff * Math.pow(2, i)));
      }
    }
  };

  const fetchTiffData = async () => {
    if (isFetchingRef.current) return;
    isFetchingRef.current = true;
    setInternalMapLoading([true, true, true]);
    setIsOptionLoading(true);
    setNoGeoTiffAvailable([false, false, false]); // Reset to false initially
    cleanupMaps();
    const tempGeoTiffStatus = [false, false, false]; // Track GeoTIFF availability temporarily
    try {
      const payload = {
        analysis_scope_id: +memoizedFilters.analysis_scope_id,
        visualization_scale_id: +memoizedFilters.visualization_scale_id,
        commodity_id: +memoizedFilters.commodity_id || null,
        data_source_id: +memoizedFilters.data_source_id,
        climate_scenario_id: +memoizedFilters.climate_scenario_id,
        layer_type: memoizedFilters.layer_type,
        layer_id: ({ commodity: memoizedFilters.commodity_id, risk: memoizedFilters.risk_id, adaptation: memoizedFilters.adaptation_id, impact: memoizedFilters.impact_id }[memoizedFilters.layer_type] ?? null),
        risk_id: memoizedFilters.risk_id,
        impact_id: memoizedFilters.impact_id || null,
        adaptation_id: memoizedFilters.adaptation_id || null,
        adaptation_croptab_id: selectedAdaptationTabId,
      };
      if (payload.layer_type !== "commodity") {
        const mandatoryFields = [
          "analysis_scope_id",
          "visualization_scale_id",
          "layer_type",
        ];
        if (
          +memoizedFilters.commodity_type_id === 1 &&
          (memoizedFilters.layer_type === "adaptation" ||
            memoizedFilters.layer_type === "adaptation_croptab")
        ) {
          mandatoryFields.push("adaptation_croptab_id");
        }
        const missingFields = mandatoryFields.filter(field => !payload[field]);
        if (missingFields.length > 0) {
          throw new Error(`Missing mandatory fields: ${missingFields.join(", ")} `);
        }
      }
      if (
        ["risk", "impact", "adaptation", "adaptation_croptab"].includes(payload.layer_type) &&
        !payload.commodity_id
      ) {
        throw new Error(`Commodity ID is required for ${payload.layer_type} layer type`);
      }
      const tifPickerRes = await fetchWithRetry(`${apiUrl}/layers/tif_picker`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const tifPickerData = await tifPickerRes.json();
      if (!tifPickerData.success || !tifPickerData.data) {
        throw new Error(`Invalid response from tif_picker: success = ${tifPickerData.success} `);
      }
      const { data } = tifPickerData;
      const fileList = data.raster_files || data.files || [];
      if (!fileList.length) {
        throw new Error("No raster files available for the selected filters");
      }
      setSelectedChangeMetric(+data.default_change_metric_id === 1 ? "Absolute" : "Delta");
      setSelectedIntensityMetric(+data.default_intensity_metric_id === 1 ? "Intensity" : "Intensity Frequency");
      setToggleChangeMetric(data.toggle_change_metric);
      setToggleIntensityMetric(data.toggle_intensity_metric);
      setFileList(fileList);
      const selectedCommodity = memoizedFilters.commodities?.find(
        item => item.commodity_id === memoizedFilters?.commodity_id
      );
      const commodityLabel = selectedCommodity ? selectedCommodity.commodity : null;
      setBreadcrumbData({
        mask: data.mask || null,
        commodityLabel: commodityLabel,
        commodity: data.commodity || null,
        level: data.level || null,
        model: data.model || null,
        scenario: data.scenario || null,
        country_id: memoizedFilters.country_id,
        state_id: memoizedFilters.state_id,
        commodity_id: memoizedFilters.commodity_id,
        climate_scenario_id: selectedScenario,
        data_source_id: memoizedFilters.data_source_id,
        visualization_scale_id: memoizedFilters.visualization_scale_id,
        adaptation_croptab_id: payload.layer_type === 'adaptation' && +memoizedFilters?.commodity_type_id === 1 ? selectedAdaptationTabId : null,
        intensity_metric_id: data.default_intensity_metric_id,
        change_metric_id: data.default_change_metric_id,
      });
      let tiffPromises;
      if (payload.layer_type === "commodity") {
        const baselineFile = fileList.find(file => file.exists && file.ramp && !file.year);
        if (!baselineFile || !baselineFile.exists || !baselineFile.ramp) {
          tempGeoTiffStatus.fill(true); // No valid baseline file
          throw new Error("No valid baseline file found for commodity");
        }
        const geotiffRes = await fetchWithRetry(`${apiUrl}/layers/geotiff`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            admin_level: memoizedFilters.admin_level,
            admin_level_id: memoizedFilters.admin_level_id,
            source_file: baselineFile.source_file,
            color_ramp: baselineFile.ramp,
          }),
        });
        const contentType = geotiffRes.headers.get("content-type");
        let arrayBuffer;
        if (contentType && contentType.includes("application/json")) {
          const responseData = await geotiffRes.json();
          if (!responseData.success) {
            tempGeoTiffStatus.fill(true); // API returned success: 0
            throw new Error(responseData.message || "No GeoTIFF data available for commodity");
          }
          arrayBuffer = await geotiffRes.arrayBuffer();
        } else {
          arrayBuffer = await geotiffRes.arrayBuffer();
        }
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
          tempGeoTiffStatus.fill(true); // Invalid arrayBuffer
          throw new Error(`Empty or invalid arrayBuffer for ${baselineFile.source_file}`);
        }
        tiffPromises = [0, 1, 2].map(async (_, index) => {
          const parseArrayBuffer = arrayBuffer.slice(0); // Fresh copy for parsing
          const downloadArrayBuffer = arrayBuffer.slice(0); // Fresh copy for downloading
          if (!parseArrayBuffer || parseArrayBuffer.byteLength === 0 || !downloadArrayBuffer || downloadArrayBuffer.byteLength === 0) {
            tempGeoTiffStatus[index] = true;
            return { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
          }
          return {
            arrayBuffer: parseArrayBuffer,
            downloadArrayBuffer,
            metadata: {
              source_file: baselineFile.source_file,
              color_ramp: baselineFile.ramp,
              layer_name: ["Baseline (2000s)", "2050s", "2080s"][index],
              layer_id: memoizedFilters.commodity_id,
              year: [null, 2050, 2080][index],
              intensity_metric: null,
              climate_scenario_id: baselineFile.climate_scenario_id,
              change_metric: null,
            },
          };
        });
      } else {
        const defaultFilters = [
          {
            climate_scenario_id: 1,
            year: null,
            intensity_metric_id: data.default_intensity_metric_id,
            change_metric_id: 1,
            metric: selectedIntensityMetric,
            changeMetric: "Absolute",
            label: "Baseline (2000s)",
          },
          {
            climate_scenario_id: selectedScenario,
            year: 2050,
            intensity_metric_id: data.default_intensity_metric_id,
            change_metric_id: data.default_change_metric_id,
            metric: selectedIntensityMetric,
            changeMetric: selectedChangeMetric,
            label: "2050s",
          },
          {
            climate_scenario_id: selectedScenario,
            year: 2080,
            intensity_metric_id: data.default_intensity_metric_id,
            change_metric_id: data.default_change_metric_id,
            metric: selectedIntensityMetric,
            changeMetric: selectedChangeMetric,
            label: "2080s",
          },
        ];
        tiffPromises = defaultFilters.map(async (filter, index) => {
          const file = fileList.find(
            f =>
              +f.climate_scenario_id === +filter.climate_scenario_id &&
              +f.year === +filter.year &&
              +f.intensity_metric_id === +filter.intensity_metric_id &&
              +f.change_metric_id === +filter.change_metric_id &&
              f.exists &&
              Array.isArray(f.ramp) && f.ramp.length > 0
          );
          if (!file) {
            tempGeoTiffStatus[index] = true;
            return { noGeoTiff: true, metadata: { layer_name: filter.label } };
          }
          const geotiffRes = await fetchWithRetry(`${apiUrl}/layers/geotiff`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              admin_level: memoizedFilters.admin_level,
              admin_level_id: memoizedFilters.admin_level_id,
              source_file: file.source_file,
              color_ramp: file.ramp,
            }),
          });
          const contentType = geotiffRes.headers.get("content-type");
          let arrayBuffer;
          if (contentType && contentType.includes("application/json")) {
            const responseData = await geotiffRes.json();
            if (!responseData.success) {
              tempGeoTiffStatus[index] = true; // API returned success: 0
              return { noGeoTiff: true, metadata: { layer_name: filter.label } };
            }
            arrayBuffer = await geotiffRes.arrayBuffer();
          } else {
            arrayBuffer = await geotiffRes.arrayBuffer();
          }
          if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            tempGeoTiffStatus[index] = true;
            return { noGeoTiff: true, metadata: { layer_name: filter.label } };
          }
          const parseArrayBuffer = arrayBuffer.slice(0); // Fresh copy for parsing
          const downloadArrayBuffer = arrayBuffer.slice(0); // Fresh copy for downloading
          if (!parseArrayBuffer || parseArrayBuffer.byteLength === 0 || !downloadArrayBuffer || downloadArrayBuffer.byteLength === 0) {
            tempGeoTiffStatus[index] = true;
            return { noGeoTiff: true, metadata: { layer_name: filter.label } };
          }
          return {
            arrayBuffer: parseArrayBuffer,
            downloadArrayBuffer,
            metadata: {
              source_file: file.source_file,
              color_ramp: file.ramp,
              layer_name: filter.label,
              layer_id: file.layer_id,
              layer_type: file.layer_type,
              year: filter.year,
              intensity_metric: filter.metric,
              climate_scenario_id: file.climate_scenario_id,
              change_metric: filter.changeMetric,
            },
          };
        });
      }
      const tiffResults = await Promise.all(tiffPromises);
      setTiffData(tiffResults);
      // Set noGeoTiffAvailable only after all rendering attempts
      setNoGeoTiffAvailable(tempGeoTiffStatus);
      lastTiffDataRef.current = tiffResults;
      setIsFullscreen(new Array(3).fill(false));
      if (memoizedFilters.geojson && memoizedFilters.bbox) {
        setAllDataReady(true);
      }
    } catch (err) {
      console.error("Error fetching TIFF data:", err);
      setTiffData([]);
      setNoGeoTiffAvailable([true, true, true]);
      setAllDataReady(false);
    } finally {
      setInternalMapLoading([false, false, false]);
      setIsOptionLoading(false);
      isFetchingRef.current = false;
    }
    firstTime.current = false;
  };

  useEffect(() => {
    if (
      !memoizedFilters ||
      (!memoizedFilters.layer_type && memoizedFilters.layer_type !== "commodity") ||
      !memoizedFilters.analysis_scope_id ||
      !memoizedFilters.visualization_scale_id ||
      !memoizedFilters.data_source_id ||
      (memoizedFilters.layer_type !== "commodity" && !memoizedFilters.climate_scenario_id)
    ) {
      setInternalMapLoading([false, false, false]);
      setIsOptionLoading(false);
      return;
    }
    const debouncedFetch = _.debounce(fetchTiffData, 500);
    debouncedFetch();
    return () => debouncedFetch.cancel();
  }, [memoizedFilters, selectedAdaptationTabId]);

  const memoizedTiffData = useMemo(() => tiffData, [tiffData]);

  const debouncedRenderMaps = useCallback(
    _.debounce(() => {
      if (memoizedTiffData.length && memoizedFilters?.geojson && memoizedFilters?.bbox && allDataReady) {
        const visibleIndices = viewMode === "single" ? [0] : [0, 1, 2];
        memoizedTiffData.forEach((tiff, index) => {
          if (
            mapRefs.current[index] &&
            mapInstances.current[index] &&
            visibleIndices.includes(index) &&
            !hasRenderedRef.current[index]
          ) {
            renderMapLayers(
              memoizedFilters.geojson,
              memoizedFilters.bbox,
              memoizedFilters.districtGeojson,
              memoizedFilters.districtBbox,
              tiff,
              index
            );
          }
        });
      }
    }, 150),
    [memoizedTiffData, memoizedFilters.geojson, memoizedFilters.bbox, memoizedFilters.districtGeojson, memoizedFilters.districtBbox, allDataReady, renderMapLayers, viewMode]
  );

  useEffect(() => {
    debouncedRenderMaps();
    return () => debouncedRenderMaps.cancel();
  }, [debouncedRenderMaps]);

  useEffect(() => {
    const observer = new MutationObserver(() => {
      const paths = document.querySelectorAll("path.leaflet-interactive");
      paths.forEach(path => {
        path.style.outline = "none";
      });
    });
    const mapContainers = document.querySelectorAll(".leaflet-container");
    mapContainers.forEach(container => {
      observer.observe(container, { childList: true, subtree: true });
    });
    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    if (import.meta.hot) {
      import.meta.hot.on("vite:beforeUpdate", () => {
        cleanupMaps();
        mapsInitializedRef.current = false;
        // Increased delay to ensure cleanup is complete
        setTimeout(() => {
          initializeMaps();
        }, 200);
      });
    }
  }, [cleanupMaps, initializeMaps]);

  const handleDownloadGeoTIFF = useCallback((arrayBuffer, layerName) => {
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      console.error("Cannot download GeoTIFF: arrayBuffer is empty or invalid", { layerName, byteLength: arrayBuffer?.byteLength });
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "No valid GeoTIFF data available to download.",
      });
      return;
    }
    try {
      // Retrieve names with fallback checks
      const countryName = memoizedFilters.country_id === 0
        ? "SouthAsia"
        : memoizedFilters.countries?.find(c => +c.country_id === +memoizedFilters.country_id)?.country?.replace(/\s+/g, "") || "UnknownCountry";
      const commodityName = memoizedFilters.commodity_id && memoizedFilters.commodities?.length
        ? memoizedFilters.commodities.find(c => +c.commodity_id === +memoizedFilters.commodity_id)?.commodity?.replace(/\s+/g, "") || "UnknownCommodity"
        : "NoCommoditySelected";
      const scenario = selectedScenario && climateScenarios.length
        ? climateScenarios.find(s => +s.scenario_id === parseInt(selectedScenario))
        : null;
      const scenarioName = scenario
        ? scenario.scenario?.replace(/\s+/g, "") || "UnknownScenario"
        : "NoScenarioSelected";
      const intensityName = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? "IntensityFrequency" : "Intensity";
      const changeName = selectedChangeMetric.toLowerCase() === "absolute" ? "Absolute" : "Delta";
      const isBaseline = layerName === "Baseline (2000s)";
      const year = isBaseline ? "" : (layerName === "2050s" ? "2050" : layerName === "2080s" ? "2080" : "UnknownYear");
      // Construct filename
      const fileName = `${countryName}_${commodityName}_${intensityName}_${changeName}_${scenarioName}${year ? `_${year}` : ""}.tif`;
      const blob = new Blob([arrayBuffer], { type: "image/tiff" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("GeoTIFF download error:", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: "Failed to download GeoTIFF file.",
      });
    }
  }, [
    memoizedFilters.country_id,
    memoizedFilters.countries,
    memoizedFilters.commodities,
    memoizedFilters.commodity_id,
    memoizedFilters.visualization_scale_id,
    memoizedFilters.visualizationScales,
    selectedIntensityMetric,
    selectedChangeMetric,
    selectedScenario,
    climateScenarios,
  ]);

  const handleDownloadTable = useCallback(async (layerName, tiffMetadata) => {
    try {
      // Retrieve names with fallback checks
      const countryName = memoizedFilters.country_id === 0
        ? "SouthAsia"
        : memoizedFilters.countries?.find(c => +c.country_id === +memoizedFilters.country_id)?.country?.replace(/\s+/g, "") || "UnknownCountry";
      const commodityName = memoizedFilters.commodity_id && memoizedFilters.commodities?.length
        ? memoizedFilters.commodities.find(c => +c.commodity_id === +memoizedFilters.commodity_id)?.commodity?.replace(/\s+/g, "") || "UnknownCommodity"
        : "NoCommoditySelected";
      const scenario = selectedScenario && climateScenarios.length
        ? climateScenarios.find(s => +s.scenario_id === parseInt(selectedScenario))
        : null;
      const scenarioName = scenario
        ? scenario.scenario?.replace(/\s+/g, "") || "UnknownScenario"
        : "NoScenarioSelected";
      const intensityName = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? "IntensityFrequency" : "Intensity";
      const changeName = selectedChangeMetric.toLowerCase() === "absolute" ? "Absolute" : "Delta";
      const isBaseline = layerName === "Baseline (2000s)";
      const year = isBaseline ? "" : (layerName === "2050s" ? "2050" : layerName === "2080s" ? "2080" : tiffMetadata.year || "UnknownYear");
      // Construct filename
      const fileName = `${countryName}_${commodityName}_${intensityName}_${changeName}_${scenarioName}${year ? `_${year}` : ""}.csv`;
      const payload = {
        layer_type: tiffMetadata.layer_type,
        country_id: breadcrumbData?.country_id || null,
        state_id: breadcrumbData?.state_id || null,
        commodity_id: breadcrumbData?.commodity_id || null,
        climate_scenario_id: tiffMetadata.year ? selectedScenario : 1,
        year: tiffMetadata.year || null,
        data_source_id: breadcrumbData?.data_source_id || null,
        visualization_scale_id: breadcrumbData?.visualization_scale_id || null,
        layer_id: tiffMetadata.layer_id,
        adaptation_croptab_id: breadcrumbData?.adaptation_croptab_id || null,
        intensity_metric_id: selectedIntensityMetric.toLowerCase() === "intensity frequency" ? 2 : 1,
        change_metric_id: selectedChangeMetric.toLowerCase() === "absolute" ? 1 : 2,
      };
      const response = await fetchWithRetry(`${apiUrl}/layers/table`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const blob = await response.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (err) {
      console.error("Table download error:", err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: `Failed to download table for ${layerName}: ${err.message} `,
      });
    }
  }, [
    memoizedFilters.country_id,
    memoizedFilters.countries,
    memoizedFilters.commodities,
    memoizedFilters.commodity_id,
    memoizedFilters.visualization_scale_id,
    memoizedFilters.visualizationScales,
    selectedIntensityMetric,
    selectedChangeMetric,
    selectedScenario,
    climateScenarios,
    breadcrumbData,
    apiUrl,
  ]);

  const handleDownloadImage = useCallback(async (layerName, mapIndex) => {
    try {
      // Retrieve names with fallback checks
      const countryName = memoizedFilters.country_id === 0
        ? "SouthAsia"
        : memoizedFilters.countries?.find(c => +c.country_id === +memoizedFilters.country_id)?.country?.replace(/\s+/g, "") || "UnknownCountry";
      const commodityName = memoizedFilters.commodity_id && memoizedFilters.commodities?.length
        ? memoizedFilters.commodities.find(c => +c.commodity_id === +memoizedFilters.commodity_id)?.commodity?.replace(/\s+/g, "") || "UnknownCommodity"
        : "NoCommoditySelected";
      const scenario = selectedScenario && climateScenarios.length
        ? climateScenarios.find(s => +s.scenario_id === parseInt(selectedScenario))
        : null;
      const scenarioName = scenario
        ? scenario.scenario?.replace(/\s+/g, "") || "UnknownScenario"
        : "NoScenarioSelected";
      const intensityName = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? "IntensityFrequency" : "Intensity";
      const changeName = selectedChangeMetric.toLowerCase() === "absolute" ? "Absolute" : "Delta";
      const isBaseline = layerName === "Baseline (2000s)";
      const year = isBaseline ? "" : (layerName === "2050s" ? "2050" : layerName === "2080s" ? "2080" : "UnknownYear");
      // Construct filename
      const fileName = `${countryName}_${commodityName}_${intensityName}_${changeName}_${scenarioName}${year ? `_${year}` : ""}.jpg`;
      const mapContainer = mapRefs.current[mapIndex];
      if (!mapContainer) throw new Error("Map container not found");
      if (mapInstances.current[mapIndex]) {
        mapInstances.current[mapIndex].invalidateSize();
        await new Promise(resolve => setTimeout(resolve, 300));
      }
      const mapAndLegendContainer = mapContainer.closest(".map-and-legend-container");
      if (!mapAndLegendContainer) throw new Error("Parent container for map and legend not found");
      let imgData;
      try {
        imgData = await domtoimage.toJpeg(mapAndLegendContainer, {
          bgcolor: "#fff",
          quality: 0.8,
          width: mapAndLegendContainer.offsetWidth,
          height: mapAndLegendContainer.offsetHeight,
        });
      } catch (error) {
        const canvas = await html2canvas(mapAndLegendContainer, {
          scale: 1,
          useCORS: true,
          backgroundColor: "#fff",
        });
        imgData = canvas.toDataURL("image/jpeg", 0.8);
      }
      if (!imgData) throw new Error("Failed to capture image data");
      const a = document.createElement("a");
      a.href = imgData;
      a.download = fileName;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
    } catch (err) {
      console.error(`Image download error for ${layerName}: `, err);
      Swal.fire({
        icon: "error",
        title: "Download Failed",
        text: `Failed to download image for ${layerName}: ${err.message} `,
      });
    }
  }, [
    memoizedFilters.country_id,
    memoizedFilters.countries,
    memoizedFilters.commodities,
    memoizedFilters.commodity_id,
    memoizedFilters.visualization_scale_id,
    memoizedFilters.visualizationScales,
    selectedIntensityMetric,
    selectedChangeMetric,
    selectedScenario,
    climateScenarios,
  ]);

  const handleIntensityMetricChange = value => {
    setSelectedIntensityMetric(value);
  };

  useEffect(() => {
    if (firstTime.current) {
      return;
    }
    setIsOptionLoading(true);
    const intensityMetricId = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? 2 : 1;
    const indicesToUpdate = [0, 1, 2];
    let pendingUpdates = indicesToUpdate.length;
    indicesToUpdate.forEach(index => {
      const year = index === 0 ? null : index === 1 ? 2050 : 2080;
      const climateScenarioId = index === 0 ? 1 : selectedScenario;
      const changeMetricId = index === 0 ? 1 : selectedChangeMetric.toLowerCase() === "absolute" ? 1 : 2;
      const file = fileList.find(
        f =>
          +f.climate_scenario_id === +climateScenarioId &&
          +f.year === +year &&
          +f.intensity_metric_id === +intensityMetricId &&
          +f.change_metric_id === +changeMetricId &&
          f.exists &&
          Array.isArray(f.ramp) && f.ramp.length > 0
      );
      if (file) {
        fetchGeoTiff(file, index, selectedIntensityMetric, index === 0 ? "Absolute" : selectedChangeMetric, () => {
          pendingUpdates--;
          if (pendingUpdates === 0) setIsOptionLoading(false);
        });
      } else {
        setNoGeoTiffAvailable(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        setTiffData(prev => {
          const newTiffData = [...prev];
          newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
          return newTiffData;
        });
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        pendingUpdates--;
        if (pendingUpdates === 0) setIsOptionLoading(false);
      }
    });
  }, [selectedIntensityMetric]);

  const handleScenarioChange = value => {
    setSelectedScenario(value);
  };

  useEffect(() => {
    if (firstTime.current) {
      return;
    }
    setIsOptionLoading(true);
    const indicesToUpdate = [1, 2];
    let pendingUpdates = indicesToUpdate.length;
    indicesToUpdate.forEach(index => {
      const year = index === 1 ? 2050 : 2080;
      const intensityMetricId = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? 2 : 1;
      const changeMetricId = selectedChangeMetric.toLowerCase() === "absolute" ? 1 : 2;
      const file = fileList.find(
        f =>
          +f.climate_scenario_id === +selectedScenario &&
          +f.year === +year &&
          +f.intensity_metric_id === +intensityMetricId &&
          +f.change_metric_id === +changeMetricId &&
          f.exists &&
          Array.isArray(f.ramp) && f.ramp.length > 0
      );
      if (file) {
        fetchGeoTiff(file, index, selectedIntensityMetric, selectedChangeMetric, () => {
          pendingUpdates--;
          if (pendingUpdates === 0) setIsOptionLoading(false);
        });
      } else {
        setNoGeoTiffAvailable(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        setTiffData(prev => {
          const newTiffData = [...prev];
          newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["2050s", "2080s"][index - 1] } };
          return newTiffData;
        });
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        pendingUpdates--;
        if (pendingUpdates === 0) setIsOptionLoading(false);
      }
    });
  }, [selectedScenario]);

  const handleChangeMetricChange = value => {
    setSelectedChangeMetric(value);
  };

  useEffect(() => {
    if (firstTime.current) {
      return;
    }
    setIsOptionLoading(true);
    const indicesToUpdate = [1, 2];
    let pendingUpdates = indicesToUpdate.length;
    indicesToUpdate.forEach(index => {
      const year = index === 1 ? 2050 : 2080;
      const intensityMetricId = selectedIntensityMetric.toLowerCase() === "intensity frequency" ? 2 : 1;
      const changeMetricId = selectedChangeMetric.toLowerCase() === "absolute" ? 1 : 2;
      const file = fileList.find(
        f =>
          +f.climate_scenario_id === +selectedScenario &&
          +f.year === +year &&
          +f.intensity_metric_id === +intensityMetricId &&
          +f.change_metric_id === +changeMetricId &&
          f.exists &&
          Array.isArray(f.ramp) && f.ramp.length > 0
      );
      if (file) {
        fetchGeoTiff(file, index, selectedIntensityMetric, selectedChangeMetric, () => {
          pendingUpdates--;
          if (pendingUpdates === 0) setIsOptionLoading(false);
        });
      } else {
        setNoGeoTiffAvailable(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        setTiffData(prev => {
          const newTiffData = [...prev];
          newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["2050s", "2080s"][index - 1] } };
          return newTiffData;
        });
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        pendingUpdates--;
        if (pendingUpdates === 0) setIsOptionLoading(false);
      }
    });
  }, [selectedChangeMetric]);

  const fetchGeoTiff = async (file, index, metric, changeMetric, onComplete) => {
    if (mapInstances.current[index] && layerRefs.current[index]) {
      const oldLayer = layerRefs.current[index].find(layer => layer instanceof GeoRasterLayer);
      if (oldLayer && mapInstances.current[index].hasLayer(oldLayer)) {
        mapInstances.current[index].removeLayer(oldLayer);
      }
      layerRefs.current[index] = layerRefs.current[index].filter(layer => !(layer instanceof GeoRasterLayer));
    }
    if (!file.exists || !file.ramp) {
      setTiffData(prev => {
        const newTiffData = [...prev];
        newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
        return newTiffData;
      });
      setNoGeoTiffAvailable(prev => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
      onComplete();
      return;
    }
    try {
      if (index !== 0) {
        setBreadcrumbData({
          ...breadcrumbData,
          climate_scenario_id: selectedScenario,
          change_metric_id: selectedChangeMetric.toLowerCase() === "absolute" ? 1 : 2,
          intensity_metric_id: selectedIntensityMetric.toLowerCase() === "intensity frequency" ? 2 : 1,
        });
      }
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = true;
        return newLoading;
      });
      const geotiffRes = await fetchWithRetry(`${apiUrl}/layers/geotiff`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          admin_level: memoizedFilters.admin_level,
          admin_level_id: memoizedFilters.admin_level_id,
          source_file: file.source_file,
          color_ramp: file.ramp,
        }),
      });
      const contentType = geotiffRes.headers.get("content-type");
      let arrayBuffer;
      if (contentType && contentType.includes("application/json")) {
        const responseData = await geotiffRes.json();
        if (!responseData.success) {
          setTiffData(prev => {
            const newTiffData = [...prev];
            newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
            return newTiffData;
          });
          setNoGeoTiffAvailable(prev => {
            const newState = [...prev];
            newState[index] = true;
            return newState;
          });
          setInternalMapLoading(prev => {
            const newLoading = [...prev];
            newLoading[index] = false;
            return newLoading;
          });
          onComplete();
          return;
        }
        arrayBuffer = await geotiffRes.arrayBuffer();
      } else {
        arrayBuffer = await geotiffRes.arrayBuffer();
      }
      if (!arrayBuffer || arrayBuffer.byteLength === 0) {
        setTiffData(prev => {
          const newTiffData = [...prev];
          newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
          return newTiffData;
        });
        setNoGeoTiffAvailable(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        onComplete();
        return;
      }
      const downloadArrayBuffer = arrayBuffer.slice(0);
      if (!downloadArrayBuffer || downloadArrayBuffer.byteLength === 0) {
        setTiffData(prev => {
          const newTiffData = [...prev];
          newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
          return newTiffData;
        });
        setNoGeoTiffAvailable(prev => {
          const newState = [...prev];
          newState[index] = true;
          return newState;
        });
        setInternalMapLoading(prev => {
          const newLoading = [...prev];
          newLoading[index] = false;
          return newLoading;
        });
        onComplete();
        return;
      }
      const newTiff = {
        arrayBuffer,
        downloadArrayBuffer,
        metadata: {
          source_file: file.source_file,
          color_ramp: file.ramp,
          layer_name: ["Baseline (2000s)", "2050s", "2080s"][index],
          layer_id: file.layer_id,
          layer_type: file.layer_type,
          year: index === 0 ? null : index === 1 ? 2050 : 2080,
          intensity_metric: metric,
          climate_scenario_id: file.climate_scenario_id,
          change_metric: changeMetric,
        },
      };
      georasterCache.current.delete(`${file.source_file} -${index} `);
      hasRenderedRef.current[index] = false;
      setTiffData(prev => {
        const newTiffData = [...prev];
        newTiffData[index] = newTiff;
        return newTiffData;
      });
      setNoGeoTiffAvailable(prev => {
        const newState = [...prev];
        newState[index] = false;
        return newState;
      });
      if (mapInstances.current[index]) {
        await updateGeoTiffLayer(newTiff, index);
      }
      onComplete();
    } catch (err) {
      console.error("Error fetching GeoTIFF:", err);
      // Swal.fire({
      //   icon: "error",
      //   title: "Error",
      //   text: err.message || "Failed to load GeoTIFF data.",
      // });
      setTiffData(prev => {
        const newTiffData = [...prev];
        newTiffData[index] = { noGeoTiff: true, metadata: { layer_name: ["Baseline (2000s)", "2050s", "2080s"][index] } };
        return newTiffData;
      });
      setNoGeoTiffAvailable(prev => {
        const newState = [...prev];
        newState[index] = true;
        return newState;
      });
      setInternalMapLoading(prev => {
        const newLoading = [...prev];
        newLoading[index] = false;
        return newLoading;
      });
      onComplete();
    }
  };

  useEffect(() => {
    const handlePopoverFocus = () => {
      const popovers = document.querySelectorAll(".MuiPopover-root[aria-hidden='true']");
      popovers.forEach(popover => {
        const focusedElement = popover.querySelector(":focus");
        if (focusedElement) popover.removeAttribute("aria-hidden");
      });
    };
    document.addEventListener("focusin", handlePopoverFocus);
    return () => document.removeEventListener("focusin", handlePopoverFocus);
  }, []);

  const getGridLayout = () => {
    return { xs: viewMode === "single" ? 12 : 4, height: "100%" };
  };

  const gridLayout = getGridLayout();

  const handleAdaptationTabChange = tabId => {
    const validTabIds = adaptationTabs.flatMap(tab =>
      tab.tab_id === "gender_group" ? tab.subTabs.map(subTab => subTab.tab_id) : [tab.tab_id]
    );
    if (validTabIds.includes(+tabId)) {
      setSelectedAdaptationTabId(tabId);
    } else {
      console.warn(`Invalid tabId: ${tabId}. Available tabIds: ${validTabIds} `);
      setSelectedAdaptationTabId(validTabIds[0] || "");
    }
  };

  const toggleAnalytics = () => {
    setShowAnalytics(prev => !prev);
  };

  const handleViewSingle = () => {
    setViewMode("single");
  };

  const handleViewAll = () => {
    setViewMode("all");
  };

  const defaultTiffData = Array(3).fill(null).map((_, index) => ({
    arrayBuffer: null,
    metadata: {
      layer_name: ["Baseline (2000s)", "2050s", "2080s"][index],
      source_file: null,
      color_ramp: null,
      layer_id: null,
      layer_type: null,
      year: [null, 2050, 2080][index],
      intensity_metric: null,
      climate_scenario_id: null,
      change_metric: null,
    },
  }));

  const selectStyles = {
    minWidth: "130px",
    height: "22px",
    color: "black",
    "& .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[700],
    },
    "&:hover .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.grey[900],
    },
    "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
      borderColor: theme.palette.primary.main,
    },
    "& .MuiSelect-icon": {
      color: theme.palette.grey[700],
    },
  };

  const checkLegend = (index) => {
    const params = {
      "adaptation_croptab_id": null,
      "layer_type": "risk",
      "country_id": null,
      "state_id": null,
      "commodity_id": 2,
      "climate_scenario_id": 1,
      "year": null,
      "data_source_id": 1,
      "visualization_scale_id": 1,
      "layer_id": 1,
      "intensity_metric_id": 2,
      "change_metric_id": 2
    };

    // Check if tiffData[index] exists, has noGeoTiff set to false, and has arrayBuffer
    if (!tiffData[index] || tiffData[index].noGeoTiff || !tiffData[index].arrayBuffer) {
      return false;
    }

    // Validate that all required fields in params are non-null (or valid where applicable)
    const requiredFields = [
      "layer_type",
      "commodity_id",
      "climate_scenario_id",
      "data_source_id",
      "visualization_scale_id",
      "layer_id",
      "intensity_metric_id",
      "change_metric_id"
    ];

    // Fields that can be null (optional)
    const optionalFields = ["adaptation_croptab_id", "country_id", "state_id", "year"];

    // Check if all required fields are non-null and valid
    for (const field of requiredFields) {
      if (params[field] === null || params[field] === undefined) {
        return false;
      }
    }

    // If all required fields are valid, return true
    return true;
  };

  return (
    <Box
      sx={{
        height: "100%",
        overflow: "hidden",
        padding: "0 0px",
        backgroundColor: theme.palette.background.paper,
        position: "relative",
      }}
    >
      <Box
        sx={{
          p: "0 16px",
          marginTop: "0px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
        }}
        className="breadTextFont"
      >
        <Box sx={{ flexGrow: 1 }}>
          {breadcrumbData && (
            <Breadcrumbs
              aria-label="breadcrumb"
              separator=">"
              sx={{ fontSize: "14px" }}
            >
              {memoizedFilters?.region && (
                <Typography
                  key="region"
                  color="text.primary"
                  sx={{ fontSize: "14px !important", fontWeight: "bold !important" }}
                >
                  {memoizedFilters.region.join(", ")}
                </Typography>
              )}
              {breadcrumbData.level && (
                <Typography
                  key="level"
                  color="text.primary"
                  sx={{ fontSize: "14px !important" }}
                >
                  {breadcrumbData.level}
                </Typography>
              )}
              <Typography
                key="layer"
                color="text.primary"
                sx={{ fontSize: "14px !important" }}
              >
                {breadcrumbData.commodity}
              </Typography>
              {/* {breadcrumbData.scenario && (
                <Typography
                  key="scenario"
                  color="text.primary"
                  sx={{ fontSize: "14px !important" }}
                >
                  Scenario: {selectedScenario}
                </Typography>
              )} */}
            </Breadcrumbs>
          )}
        </Box>
        <IconButton
          onClick={toggleAnalytics}
          title={showAnalytics ? "Hide climate projections" : "Show climate projections"}
          sx={{ ml: 2 }}
        >
          <BarChartIcon />
        </IconButton>
      </Box>
      {+memoizedFilters?.commodity_type_id === 1 &&
        (memoizedFilters?.layer_type === "adaptation" ||
          memoizedFilters?.layer_type === "adaptation_croptab") && (
          <Box
            sx={{
              p: "0 16px",
              display: "flex",
              gap: 0.5,
              alignItems: "center",
              justifyContent: "space-between",
              width: "100%-10px",
            }}
          >
            {adaptationTabs.map(tab =>
              tab.tab_id === "gender_group" ? (
                <FormControl
                  key={tab.tab_id}
                  sx={{ flex: 1 }}
                >
                  <Select
                    disableUnderline
                    value={selectedAdaptationTabId}
                    onChange={e => handleAdaptationTabChange(e.target.value)}
                    variant="standard"
                    disabled={internalMapLoading.some(loading => loading)}
                    renderValue={selected => {
                      const isSubTabSelected = tab.subTabs.some(
                        subTab => +subTab.tab_id === +selected
                      );
                      return isSubTabSelected
                        ? tab.subTabs.find(subTab => +subTab.tab_id === +selected)?.tab_name
                        : "Gender Suitability";
                    }}
                    sx={theme => ({
                      backgroundColor: tab.subTabs.some(
                        subTab => +subTab.tab_id === +selectedAdaptationTabId
                      )
                        ? "rgb(191, 215, 122)"
                        : theme.palette.mode === "dark"
                          ? "rgba(60, 75, 60, 1)"
                          : "rgba(235, 247, 233, 1)",
                      fontSize: 13,
                      paddingY: "3px",
                      "& .MuiSelect-select": {
                        paddingY: "3px",
                      },
                    })}
                    MenuProps={{
                      disableScrollLock: true,
                    }}
                  >
                    {tab.subTabs.map(subTab => (
                      <MenuItem
                        key={subTab.tab_id}
                        value={subTab.tab_id}
                        sx={{ fontSize: 13, paddingY: "2px" }}
                      >
                        {subTab.tab_name}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              ) : (
                <Button
                  key={tab.tab_id}
                  variant={+selectedAdaptationTabId === +tab.tab_id ? "contained" : "outlined"}
                  onClick={() => handleAdaptationTabChange(tab.tab_id)}
                  disabled={internalMapLoading.some(loading => loading)}
                  sx={{
                    flex: 1,
                    textTransform: "none",
                    fontSize: "13px",
                    padding: "2px 12px",
                    borderRadius: "4px",
                    backgroundColor: +selectedAdaptationTabId === +tab.tab_id
                      ? "rgb(191, 215, 122)"
                      : "transparent",
                    borderColor: theme =>
                      +selectedAdaptationTabId === +tab.tab_id
                        ? "rgb(191, 215, 122)"
                        : theme.palette.grey[500],
                    color: theme =>
                      +selectedAdaptationTabId === +tab.tab_id
                        ? theme.palette.primary.contrastText
                        : theme.palette.text.primary,
                  }}
                >
                  {tab.tab_name}
                </Button>
              )
            )}
          </Box>
        )
      }
      <Box
        sx={{
          position: "relative",
          height:
            +memoizedFilters?.commodity_type_id === 1 &&
              (memoizedFilters?.layer_type === "adaptation" ||
                memoizedFilters?.layer_type === "adaptation_croptab")
              ? "calc(100% - 52px)"
              : "calc(100% - 36px)",
          width: "100%",
        }}
      >
        <Grid
          container
          direction="row"
          sx={{
            height: "100%",
            width: "100%",
            padding: "0 10px 0 0",
          }}
        >
          {defaultTiffData.map((tiff, index) => (
            <Grid
              item
              xs={gridLayout.xs}
              key={`map-${index}`}
              sx={{
                height: gridLayout.height,
                position: "relative",
                padding: "10px 0 0 16px",
                display: viewMode === "all" || (viewMode === "single" && index === 0) ? "flex" : "none",
                flexDirection: "column",
                flexGrow: viewMode === "single" ? 1 : 0,
              }}
            >
              <Box
                sx={{
                  width: "100%",
                  bgcolor: "#C1E1C1",
                  height: "30px",
                  position: "relative",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Typography>
                    {tiffData[index]?.metadata.layer_name || defaultTiffData[index].metadata.layer_name}
                  </Typography>

                  {memoizedFilters.layer_type && memoizedFilters.layer_type !== "commodity" && index === 0 && toggleIntensityMetric && (
                    <Select
                      value={selectedIntensityMetric}
                      onChange={e => handleIntensityMetricChange(e.target.value)}
                      sx={selectStyles}
                      disabled={mapLoading}
                    >
                      <MenuItem value="Intensity">Intensity</MenuItem>
                      <MenuItem value="Intensity Frequency">Intensity Frequency</MenuItem>
                    </Select>
                  )}

                  {memoizedFilters.layer_type && memoizedFilters.layer_type !== "commodity" && index !== 0 && (
                    <>
                      <Select
                        value={selectedScenario}
                        onChange={e => handleScenarioChange(e.target.value)}
                        sx={selectStyles}
                        disabled={mapLoading}
                      >
                        {climateScenarios
                          .filter(scenario => scenario.scenario_id !== 1)
                          .map(scenario => (
                            <MenuItem key={scenario.scenario_id} value={scenario.scenario_id}>
                              {scenario.scenario}
                            </MenuItem>
                          ))}
                      </Select>

                      {toggleChangeMetric && (
                        <Select
                          value={selectedChangeMetric}
                          onChange={e => handleChangeMetricChange(e.target.value)}
                          sx={selectStyles}
                          disabled={mapLoading}
                        >
                          <MenuItem value="Absolute">Absolute</MenuItem>
                          <MenuItem value="Delta">Delta</MenuItem>
                        </Select>
                      )}
                    </>
                  )}
                </Box>

                {index === 0 && (
                  <Box
                    sx={{
                      position: "absolute",
                      right: 8,
                      display: "flex",
                      alignItems: "center",
                    }}
                  >
                    {viewMode === "all" ? (
                      <IconButton
                        onClick={handleViewSingle}
                        title="Show only Baseline (2000s) map"
                        sx={{ color: theme => theme.palette.text.secondary }}
                      >
                        <VisibilityIcon />
                      </IconButton>
                    ) : (
                      <IconButton
                        onClick={handleViewAll}
                        title="Show all maps"
                        sx={{ color: theme => theme.palette.text.secondary }}
                      >
                        <ViewModuleIcon />
                      </IconButton>
                    )}
                  </Box>
                )}
              </Box>
              <Box
                className="map-and-legend-container"
                sx={{
                  height:
                    +memoizedFilters?.commodity_type_id === 1 &&
                      (memoizedFilters?.layer_type === "adaptation" ||
                        memoizedFilters?.layer_type === "adaptation_croptab")
                      ? "calc(100% - 52px)"
                      : "calc(100% - 36px)",
                  width: "100%",
                  border: "1px solid #ededed",
                  position: "relative",
                  overflow: "hidden",
                  visibility: "visible",
                  opacity: 1,
                }}
              >
                <Box
                  ref={el => {
                    mapRefs.current[index] = el;
                  }}
                  sx={{
                    height: "100%",
                    width: "100%",
                    position: "relative",
                    zIndex: 1000,
                    display: "block",
                    visibility: "visible",
                    opacity: 1,
                  }}
                />
                {(internalMapLoading[index] || !tiffData || tiffData.length === 0) && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      zIndex: 1200,
                    }}
                  >
                    <CircularProgress />
                  </Box>
                )}
                {noGeoTiffAvailable[index] && !internalMapLoading[index] && tiffData?.length && (
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                      display: "flex",
                      alignItems: "center",
                      justifyContent: "center",
                      backgroundColor: "rgba(255, 255, 255, 0.7)",
                      zIndex: 1100,
                      color: theme.palette.text.primary,
                      fontSize: "16px",
                      fontWeight: "bold",
                      textAlign: "center",
                      padding: "20px",
                    }}
                  >
                    <Typography>No GeoTIFF available for this selection</Typography>
                  </Box>
                )}
                {tiffData[index] && !tiffData[index].noGeoTiff && tiffData[index].downloadArrayBuffer && (
                  <DownloadDropdown
                    layerName={tiffData[index].metadata.layer_name}
                    layerType={memoizedFilters?.layer_type}
                    mapIndex={index}
                    onDownloadGeoTIFF={() =>
                      handleDownloadGeoTIFF(tiffData[index].downloadArrayBuffer, `${tiffData[index].metadata.layer_name}.tif`)
                    }
                    onDownloadTable={() => handleDownloadTable(tiffData[index].metadata.layer_name, tiffData[index].metadata)}
                    onDownloadImage={() => handleDownloadImage(tiffData[index].metadata.layer_name, index)}
                  />
                )}
                {checkLegend(index) && (
                  <MapLegend
                    tiff={tiffData[index]}
                    breadcrumbData={breadcrumbData}
                    layerType={memoizedFilters?.layer_type}
                    apiUrl={apiUrl}
                    legendType="Large"
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
        <Box
          sx={{
            position: "absolute",
            top: "10px",
            right: 0,
            bottom: 0,
            backgroundColor: "lightblue",
            zIndex: 1500,
            padding: "16px 16px 0 16px",
            height: "500px",
            width: "500px",
            display: showAnalytics && !internalMapLoading.some(loading => loading) && breadcrumbData ? "block" : "none",
          }}
        >
          <AnalyticsPage filters={memoizedFilters} />
        </Box>
      </Box>
    </Box>
  );
}

export default MapViewer;