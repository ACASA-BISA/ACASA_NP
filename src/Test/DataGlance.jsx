import React, { useState, useEffect, useRef, useCallback, useMemo } from "react";
import { useParams } from "react-router-dom";
import { Grid, Paper, Typography, Box, FormControl, Select, MenuItem, CircularProgress, useTheme } from "@mui/material";
import { ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import parseGeoraster from "georaster";
import GeoRasterLayer from "georaster-layer-for-leaflet";
import Swal from "sweetalert2";
import MapLegend from "./MapLegend";
import "./Test.css";
import { debounce } from "lodash";

// Leaflet control for Download (top-left, below zoom)
L.Control.DownloadControl = L.Control.extend({
    options: {
        position: "topleft",
        onDownload: () => { },
        disabled: false,
    },
    onAdd: function (map) {
        const container = L.DomUtil.create(
            "div",
            "ol-control custom-download-control download-button"
        );
        container.style.pointerEvents = "auto";
        container.style.top = "65px";
        container.style.left = "0";

        const downloadButton = L.DomUtil.create("button", "", container);
        downloadButton.type = "button";
        downloadButton.title = "Download GeoTIFF Layer";
        downloadButton.innerHTML = `
            <svg class="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-vubbuv" focusable="false" aria-hidden="true" viewBox="0 0 24 24" data-testid="DownloadIcon" style="font-size:16px;vertical-align:middle">
                <path d="M5 20h14v-2H5zM19 9h-4V3H9v6H5l7 7z"></path>
            </svg>
        `;
        downloadButton.style.border = "none";
        downloadButton.style.background = "none";
        downloadButton.style.cursor = this.options.disabled ? "not-allowed" : "pointer";
        downloadButton.style.padding = "5px";
        downloadButton.style.display = "flex";
        downloadButton.style.alignItems = "center";
        downloadButton.style.justifyContent = "center";
        downloadButton.style.width = "30px";
        downloadButton.style.height = "30px";
        downloadButton.style.backgroundColor = this.options.disabled ? "#ccc" : "#fff";
        downloadButton.style.borderRadius = "4px";
        downloadButton.disabled = this.options.disabled;

        L.DomEvent.on(downloadButton, "click", (e) => {
            if (this.options.disabled) return;
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            this.options.onDownload();
        });

        return container;
    },
    onRemove: function () { },
});

L.control.downloadControl = function (opts) {
    return new L.Control.DownloadControl(opts);
};

// Leaflet control for Zoom, Fullscreen, and Fit to Extent (top-right)
L.Control.MapControls = L.Control.extend({
    options: {
        position: "topright",
        isFullscreen: false,
        onFullscreen: () => { },
        onFitExtent: () => { },
        updateFullscreenButton: () => { },
    },
    onAdd: function (map) {
        const container = L.DomUtil.create("div", "");
        container.style.display = "flex";
        container.style.flexDirection = "column";
        container.style.gap = "4px";

        // Zoom controls
        const zoomContainer = L.DomUtil.create(
            "div",
            "ol-zoom-comp ol-unselectable ol-control"
        );
        zoomContainer.style.pointerEvents = "auto";

        const zoomInButton = L.DomUtil.create("button", "ol-zoom-comp-in", zoomContainer);
        zoomInButton.type = "button";
        zoomInButton.title = "Zoom in";
        zoomInButton.innerHTML = "+";
        zoomInButton.style.width = "30px";
        zoomInButton.style.height = "30px";
        zoomInButton.style.backgroundColor = "#fff";
        zoomInButton.style.borderRadius = "4px 4px 0 0";
        zoomInButton.style.cursor = "pointer";
        zoomInButton.style.fontSize = "18px";
        zoomInButton.style.textAlign = "center";
        zoomInButton.style.lineHeight = "26px";

        const zoomOutButton = L.DomUtil.create("button", "ol-zoom-comp-out", zoomContainer);
        zoomOutButton.type = "button";
        zoomOutButton.title = "Zoom out";
        zoomOutButton.innerHTML = "–";
        zoomOutButton.style.width = "30px";
        zoomOutButton.style.height = "30px";
        zoomOutButton.style.backgroundColor = "#fff";
        zoomOutButton.style.borderRadius = "0 0 4px 4px";
        zoomOutButton.style.borderTop = "none";
        zoomOutButton.style.cursor = "pointer";
        zoomOutButton.style.fontSize = "18px";
        zoomOutButton.style.textAlign = "center";
        zoomOutButton.style.lineHeight = "26px";

        L.DomEvent.on(zoomInButton, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            map.zoomIn();
        });

        L.DomEvent.on(zoomOutButton, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            map.zoomOut();
        });

        // Fullscreen control
        const fullscreenContainer = L.DomUtil.create(
            "div",
            "ol-fullscreeny ol-unselectable ol-control"
        );
        fullscreenContainer.style.pointerEvents = "auto";

        const fullscreenButton = L.DomUtil.create(
            "button",
            `ol-fullscreeny-${this.options.isFullscreen}`,
            fullscreenContainer
        );
        fullscreenButton.type = "button";
        fullscreenButton.title = this.options.isFullscreen
            ? "Exit Fullscreen"
            : "Toggle Full-screen";
        fullscreenButton.innerHTML = this.options.isFullscreen ? "⤡" : "⤢";
        fullscreenButton.style.width = "30px";
        fullscreenButton.style.height = "30px";
        fullscreenButton.style.backgroundColor = "#fff";
        fullscreenButton.style.borderRadius = "4px";
        fullscreenButton.style.cursor = "pointer";
        fullscreenButton.style.fontSize = "18px";
        fullscreenButton.style.textAlign = "center";
        fullscreenButton.style.lineHeight = "26px";

        L.DomEvent.on(fullscreenButton, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            this.options.onFullscreen(fullscreenButton);
        });

        // Fit to Extent control
        const fitExtentContainer = L.DomUtil.create(
            "div",
            "ol-zoomtoextenty ol-unselectable ol-control"
        );
        fitExtentContainer.style.pointerEvents = "auto";
        fitExtentContainer.style.top = "-1px";

        const fitExtentButton = L.DomUtil.create("button", "", fitExtentContainer);
        fitExtentButton.type = "button";
        fitExtentButton.title = "Fit to extent";
        fitExtentButton.innerHTML = "";
        fitExtentButton.style.width = "30px";
        fitExtentButton.style.height = "30px";
        fitExtentButton.style.backgroundColor = "#fff";
        fitExtentButton.style.borderRadius = "4px";
        fitExtentButton.style.cursor = "pointer";
        fitExtentButton.style.fontSize = "16px";
        fitExtentButton.style.textAlign = "center";
        fitExtentButton.style.lineHeight = "26px";
        fitExtentButton.style.fontWeight = "bold";

        L.DomEvent.on(fitExtentButton, "click", (e) => {
            L.DomEvent.stopPropagation(e);
            L.DomEvent.preventDefault(e);
            this.options.onFitExtent();
        });

        container.appendChild(zoomContainer);
        container.appendChild(fullscreenContainer);
        container.appendChild(fitExtentContainer);

        return container;
    },
    onRemove: function () { },
});

L.control.mapControls = function (opts) {
    return new L.Control.MapControls(opts);
};

const DataGlance = () => {
    const theme = useTheme();
    const [countries, setCountries] = useState([]);
    const [commodities, setCommodities] = useState([]);
    const [climateScenarios, setClimateScenarios] = useState([]);
    const [visualizationScales, setVisualizationScales] = useState([]);
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedCountryId, setSelectedCountryId] = useState(5); // Sri Lanka
    const [selectedCommodityId, setSelectedCommodityId] = useState("");
    const [selectedScenarioId, setSelectedScenarioId] = useState("");
    const [selectedVisualizationScaleId, setSelectedVisualizationScaleId] = useState("");
    const [selectedIntensityMetricId, setSelectedIntensityMetricId] = useState(2);
    const [selectedChangeMetricId, setSelectedChangeMetricId] = useState(1);
    const [selectedYear, setSelectedYear] = useState(null);
    const [isOptionLoading, setIsOptionLoading] = useState(false);
    const [showCountrySelect, setShowCountrySelect] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hazardData, setHazardData] = useState(null);
    const [tiffData, setTiffData] = useState([]);
    const [allDataReady, setAllDataReady] = useState(false);
    const [renderedMaps, setRenderedMaps] = useState(new Array(8).fill(false));
    const [isFullscreen, setIsFullscreen] = useState(new Array(8).fill(false));
    const [noGeoTiffAvailable, setNoGeoTiffAvailable] = useState(new Array(8).fill(false));

    const mapRefs = useRef(new Array(8).fill(null));
    const mapInstances = useRef(new Array(8).fill(null));
    const layerRefs = useRef(new Array(8).fill([]));
    const tileLayerRefs = useRef(new Array(8).fill(null));
    const geojsonLayerRefs = useRef(new Array(8).fill(null));
    const mapControlRefs = useRef(new Array(8).fill(null));
    const downloadControlRefs = useRef(new Array(8).fill(null));
    const georasterCache = useRef(new Map());
    const isFetchingRef = useRef(false);
    const mapWidths = useRef(new Array(8).fill(300));
    const hasInitializedRef = useRef(false);
    const lastFetchKeyRef = useRef(null);
    const geotiffPromiseCache = useRef(new Map());
    const controlsInitialized = useRef(new Array(8).fill(false));

    const apiUrl = process.env.REACT_APP_API_URL;
    const { country } = useParams();

    const breadcrumbData = useMemo(
        () => ({
            commodity: commodities.find((c) => c.commodity_id === selectedCommodityId)?.commodity || null,
            commodity_id: selectedCommodityId || null,
            country_id: selectedCountryId || null,
            state_id: null,
            climate_scenario_id: selectedScenarioId || null,
            visualization_scale_id: selectedVisualizationScaleId || null,
            intensity_metric_id: selectedIntensityMetricId || null,
            change_metric_id: selectedChangeMetricId || null,
            geojson: geojsonData?.geojson || null,
            bbox: geojsonData?.bbox || null,
            region: geojsonData?.region || null,
            year: selectedYear || null,
        }),
        [commodities, selectedCommodityId, selectedCountryId, selectedScenarioId, selectedVisualizationScaleId, selectedIntensityMetricId, selectedChangeMetricId, geojsonData, selectedYear]
    );

    const memoizedHazardData = useMemo(() => hazardData, [hazardData]);
    const memoizedGeojsonData = useMemo(() => geojsonData, [geojsonData]);

    const getTileLayerUrl = () => {
        return theme.palette.mode === "dark"
            ? "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
    };

    const fetchTiffs = useCallback(
        debounce(async (hazardData, geojsonData, countryId, commodityId, selectRasterFile, fetchGeoTiff) => {
            if (isFetchingRef.current) {
                return;
            }

            if (!hazardData || !hazardData.raster_grids || !geojsonData) {
                return;
            }

            const fetchKey = `${countryId}-${commodityId}-${selectedScenarioId}-${selectedVisualizationScaleId}-${selectedIntensityMetricId}-${selectedChangeMetricId}-${JSON.stringify(
                hazardData.raster_grids.map((g) => g.grid_sequence)
            )}`;

            const hasValidTiffData = tiffData.length > 0 && hazardData.raster_grids.every((grid) => {
                const tiff = tiffData.find((t) => t.metadata.grid_sequence === grid.grid_sequence);
                return tiff && tiff.arrayBuffer && tiff.arrayBuffer.byteLength > 0;
            });

            if (lastFetchKeyRef.current === fetchKey && hasValidTiffData) {
                return;
            }

            isFetchingRef.current = true;
            setIsLoading(true);
            try {
                geotiffPromiseCache.current.clear();

                const sortedGrids = [...hazardData.raster_grids].sort(
                    (a, b) => (a.grid_sequence || 0) - (b.grid_sequence || 0)
                );

                const fetchedSourceFiles = new Set();
                const tiffPromises = sortedGrids.slice(0, 7).map(async (grid) => {
                    const file = selectRasterFile(grid.raster_files, grid.grid_sequence);
                    if (!file || !file.exists) {
                        console.warn(`No matching raster file for hazard ${grid.hazard_title || grid.grid_sequence}`);
                        return { metadata: { grid_sequence: grid.grid_sequence, layer_name: grid.hazard_title || `Hazard ${grid.grid_sequence}`, source_file: null } };
                    }
                    if (fetchedSourceFiles.has(file.source_file)) {
                        return null;
                    }
                    fetchedSourceFiles.add(file.source_file);
                    return await fetchGeoTiff(
                        { ...file, hazard_title: grid.hazard_title },
                        grid.grid_sequence,
                        grid.layer_id
                    );
                });

                const tiffResults = await Promise.all(tiffPromises);
                const validTiffResults = tiffResults.filter((result) => {
                    if (result === null) return false;
                    if (!result.arrayBuffer || result.arrayBuffer.byteLength === 0) {
                        console.warn(`No GeoTIFF data for grid_sequence ${result?.metadata?.grid_sequence || "unknown"}`, {
                            resultExists: !!result,
                            arrayBufferExists: !!result?.arrayBuffer,
                            byteLength: result?.arrayBuffer?.byteLength || 0,
                        });
                        return true; // Include even if no arrayBuffer to render GeoJSON
                    }
                    const arrayBufferCopy = result.arrayBuffer.slice(0);
                    return {
                        arrayBuffer: arrayBufferCopy,
                        metadata: { ...result.metadata },
                    };
                });

                if (validTiffResults.length === 0) {
                    console.warn("No valid GeoTIFFs fetched");
                    setTiffData([]);
                    setNoGeoTiffAvailable(new Array(8).fill(true));
                    setAllDataReady(true);
                    setRenderedMaps(new Array(8).fill(false));
                    lastFetchKeyRef.current = fetchKey;
                    return;
                }

                georasterCache.current.clear();
                setRenderedMaps(new Array(8).fill(false));
                setTiffData(validTiffResults);
                const newNoGeoTiffAvailable = new Array(8).fill(true);
                validTiffResults.forEach((tiff) => {
                    const index = tiff.metadata.grid_sequence === 0 ? 0 : tiff.metadata.grid_sequence;
                    newNoGeoTiffAvailable[index] = !tiff.arrayBuffer || tiff.arrayBuffer.byteLength === 0;
                });
                setNoGeoTiffAvailable(newNoGeoTiffAvailable);
                setAllDataReady(true);
                lastFetchKeyRef.current = fetchKey;
            } catch (err) {
                console.error("Error fetching TIFF data:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Failed to load map data.",
                });
                setTiffData([]);
                setNoGeoTiffAvailable(new Array(8).fill(true));
                setAllDataReady(true);
                setRenderedMaps(new Array(8).fill(false));
                lastFetchKeyRef.current = fetchKey;
            } finally {
                setIsLoading(false);
                isFetchingRef.current = false;
                geotiffPromiseCache.current.clear();
            }
        }, 500),
        [selectedScenarioId, selectedVisualizationScaleId, selectedIntensityMetricId, selectedChangeMetricId, selectedYear]
    );

    useEffect(() => {
        const observer = new ResizeObserver((entries) => {
            entries.forEach((entry) => {
                const index = mapRefs.current.indexOf(entry.target);
                if (index !== -1) {
                    mapWidths.current[index] = entry.contentRect.width;
                    if (mapInstances.current[index]) {
                        mapInstances.current[index].invalidateSize();
                    }
                }
            });
        });

        mapRefs.current.forEach((ref, index) => {
            if (ref) {
                observer.observe(ref);
                mapWidths.current[index] = ref.offsetWidth || 300;
            }
        });

        return () => observer.disconnect();
    }, []);

    const fetchWithRetry = async (url, options, retries = 3, backoff = 300) => {
        for (let i = 0; i < retries; i++) {
            try {
                const response = await fetch(url, options);
                if (response.ok) return response;
                throw new Error(`HTTP error! Status: ${response.status}`);
            } catch (err) {
                if (i === retries - 1) throw err;
                console.warn(`Retry ${i + 1}/${retries} for ${url}:`, err);
                await new Promise((resolve) => setTimeout(resolve, backoff * Math.pow(2, i)));
            }
        }
    };

    const fetchData = useCallback(
        async (endpoint, params = "") => {
            setIsOptionLoading(true);
            try {
                const response = await fetchWithRetry(`${apiUrl}/${endpoint}${params}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                const { success, data } = await response.json();
                if (!success) throw new Error(`API error: ${endpoint}`);
                return data || [];
            } catch (err) {
                console.error(`Error fetching ${endpoint}:`, err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || `Error loading ${endpoint}`,
                });
                return [];
            } finally {
                setIsOptionLoading(false);
            }
        },
        [apiUrl]
    );

    const fetchGeojson = useCallback(
        async (admin_level, admin_level_id) => {
            if (isFetchingRef.current) {
                return;
            }
            isFetchingRef.current = true;
            setIsLoading(true);
            try {
                const geojsonRes = await fetchWithRetry(`${apiUrl}/layers/geojson`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        admin_level,
                        admin_level_id,
                    }),
                });
                if (!geojsonRes.ok) throw new Error(`GeoJSON error! Status: ${geojsonRes.status}`);
                const geojsonData = await geojsonRes.json();
                if (!geojsonData.success || !geojsonData.data) {
                    throw new Error("No valid GeoJSON data returned");
                }
                setGeojsonData(geojsonData.data);
            } catch (err) {
                console.error("Error fetching GeoJSON:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Failed to load GeoJSON data.",
                });
                setGeojsonData(null);
            } finally {
                setIsLoading(false);
                isFetchingRef.current = false;
            }
        },
        [apiUrl]
    );

    const fetchHazardData = useCallback(
        async (commodityId) => {
            if (!commodityId) {
                return;
            }
            isFetchingRef.current = true;
            setIsLoading(true);
            try {
                const admin_level = selectedCountryId !== 0 ? "country" : "total";
                const admin_level_id = selectedCountryId || null;
                const response = await fetchWithRetry(`${apiUrl}/layers/hazards_glance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        commodity_id: commodityId,
                        admin_level,
                        admin_level_id,
                    }),
                });
                const { success, data } = await response.json();
                if (!success) throw new Error("API error: /layers/hazards_glance");
                setHazardData(data);
            } catch (err) {
                console.error("Error fetching hazard data:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Error loading hazard data",
                });
                setHazardData(null);
            } finally {
                setIsLoading(false);
                isFetchingRef.current = false;
            }
        },
        [apiUrl, selectedCountryId]
    );

    const selectRasterFile = useCallback(
        (rasterFiles, gridSequence) => {
            const scenario = climateScenarios.find((s) => s.scenario_id === parseInt(selectedScenarioId));
            const scenarioName = scenario?.scenario || "";
            const isBaseline = parseInt(selectedScenarioId) === 1;
            const expectedYear = isBaseline ? null : selectedYear;

            const matchedFile = rasterFiles.find((file) => {
                const matchesScenario =
                    !selectedScenarioId ||
                    file.climate_scenario_id === parseInt(selectedScenarioId);
                const matchesYear = +file.year === +expectedYear;
                const matchesIntensity =
                    !selectedIntensityMetricId ||
                    file.intensity_metric_id === parseInt(selectedIntensityMetricId || 2);
                const matchesChange =
                    !selectedChangeMetricId ||
                    file.change_metric_id === parseInt(gridSequence === 0 ? 1 : selectedChangeMetricId || 1);
                const matchesScale =
                    !selectedVisualizationScaleId ||
                    file.visualization_scale_id === parseInt(selectedVisualizationScaleId || 1);
                return matchesScenario && matchesYear && matchesIntensity && matchesChange && matchesScale;
            });

            if (!matchedFile && rasterFiles.length > 0) {
                console.warn("No matching raster file found, falling back to first available file");
                return rasterFiles[0];
            }
            return matchedFile;
        },
        [selectedScenarioId, selectedIntensityMetricId, selectedChangeMetricId, selectedVisualizationScaleId, selectedYear, climateScenarios]
    );

    const fetchGeoTiff = useCallback(
        async (file, gridSequence, layerId) => {
            const cacheKey = `${file.source_file}-${selectedCountryId || "total"}-${gridSequence}`;
            if (geotiffPromiseCache.current.has(cacheKey)) {
                return geotiffPromiseCache.current.get(cacheKey);
            }
            const admin_level = selectedCountryId !== 0 ? "country" : "total";
            const admin_level_id = selectedCountryId || null;
            const promise = fetchWithRetry(`${apiUrl}/layers/geotiff`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    admin_level,
                    admin_level_id,
                    source_file: file.source_file,
                    color_ramp: file.ramp,
                }),
            })
                .then(async (geotiffRes) => {
                    // Check if the response is JSON (indicating an error like success: 0)
                    const contentType = geotiffRes.headers.get("content-type");
                    if (contentType && contentType.includes("application/json")) {
                        const jsonResponse = await geotiffRes.json();
                        if (!jsonResponse.success && jsonResponse.message.includes("No data available")) {
                            console.warn(`No GeoTIFF data available for ${file.hazard_title || "hazard"}: ${jsonResponse.message}`);
                            return {
                                arrayBuffer: null,
                                metadata: {
                                    source_file: file.source_file,
                                    color_ramp: file.ramp.map((color) =>
                                        color.toLowerCase() === "#00ff00" ? "#7FFF00" : color
                                    ),
                                    layer_name: file.hazard_title || `Hazard ${gridSequence}`,
                                    grid_sequence: gridSequence,
                                    layer_id: layerId,
                                    year: file.year || null,
                                    climate_scenario_id: file.climate_scenario_id || null,
                                },
                            };
                        }
                        throw new Error(`Unexpected JSON response: ${jsonResponse.message || "Unknown error"}`);
                    }

                    if (!geotiffRes.ok) {
                        throw new Error(`Failed to fetch GeoTIFF: ${geotiffRes.status}`);
                    }

                    const arrayBuffer = await geotiffRes.arrayBuffer();
                    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                        throw new Error(`Empty or invalid arrayBuffer for ${file.source_file}`);
                    }
                    const firstBytes = Array.from(new Uint8Array(arrayBuffer).slice(0, 8))
                        .map((b) => b.toString(16).padStart(2, "0"))
                        .join(" ");
                    const modifiedColorRamp = file.ramp.map((color) =>
                        color.toLowerCase() === "#00ff00" ? "#7FFF00" : color
                    );
                    return {
                        arrayBuffer,
                        metadata: {
                            source_file: file.source_file,
                            color_ramp: modifiedColorRamp,
                            layer_name: file.hazard_title || `Hazard ${gridSequence}`,
                            grid_sequence: gridSequence,
                            layer_id: layerId,
                            year: file.year || null,
                            climate_scenario_id: file.climate_scenario_id || null,
                        },
                    };
                })
                .catch((err) => {
                    console.error(`Error fetching GeoTIFF for ${file.hazard_title || "hazard"}:`, err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Failed to load GeoTIFF for ${file.hazard_title || "hazard"}: ${err.message}`,
                    });
                    geotiffPromiseCache.current.delete(cacheKey);
                    return null;
                });

            geotiffPromiseCache.current.set(cacheKey, promise);
            return promise;
        },
        [apiUrl, selectedCountryId]
    );

    const handleDownloadGeoTIFF = useCallback((arrayBuffer, filename) => {

        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            console.error("Cannot download GeoTIFF: arrayBuffer is empty or invalid", { filename, byteLength: arrayBuffer?.byteLength });
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "No valid GeoTIFF data available to download.",
            });
            return;
        }

        try {
            // Retrieve names from lookup data with fallback checks
            const countryName = selectedCountryId === 0
                ? "SouthAsia"
                : countries.find((c) => +c.country_id === +selectedCountryId)?.country?.replace(/\s+/g, "") || "UnknownCountry";
            const commodityName = selectedCommodityId && commodities.length
                ? commodities.find((c) => +c.commodity_id === +selectedCommodityId)?.commodity?.replace(/\s+/g, "") || "UnknownCommodity"
                : "NoCommoditySelected";
            const scenario = selectedScenarioId && climateScenarios.length
                ? climateScenarios.find((s) => +s.scenario_id === parseInt(selectedScenarioId))
                : null;
            const scenarioName = scenario
                ? scenario.scenario?.replace(/\s+/g, "") || "UnknownScenario"
                : "NoScenarioSelected";
            const scaleName = selectedVisualizationScaleId && visualizationScales.length
                ? visualizationScales.find((s) => +s.scale_id === parseInt(selectedVisualizationScaleId))?.scale?.replace(/\s+/g, "") || "UnknownScale"
                : "NoScaleSelected";
            const intensityName = +selectedIntensityMetricId === 1 ? "Intensity" : "IntensityFrequency";
            const changeName = +selectedChangeMetricId === 1 ? "Absolute" : "Delta";
            const isBaseline = parseInt(selectedScenarioId) === 1;
            const year = isBaseline ? "" : (selectedYear || "UnknownYear");

            // Construct filename using names, omitting year for baseline scenarios
            let file_name = `${countryName}_${commodityName}_${intensityName}_${changeName}_${scaleName}_${scenarioName}${year ? `_${year}` : ""}`;

            const firstBytes = Array.from(new Uint8Array(arrayBuffer).slice(0, 8))
                .map((b) => b.toString(16).padStart(2, "0"))
                .join(" ");
            const blob = new Blob([arrayBuffer], { type: "image/tiff" });
            const url = URL.createObjectURL(blob);
            const a = document.createElement("a");
            a.href = url;
            a.download = `${file_name}.tif`;
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
        commodities,
        climateScenarios,
        visualizationScales,
        selectedCommodityId,
        selectedScenarioId,
        selectedVisualizationScaleId,
        selectedYear,
    ]);

    const cleanupMaps = useCallback(() => {
        mapInstances.current.forEach((map, index) => {
            if (map) {
                layerRefs.current[index].forEach((layer) => {
                    if (layer && map.hasLayer(layer)) {
                        map.removeLayer(layer);
                    }
                });
                if (tileLayerRefs.current[index] && map.hasLayer(tileLayerRefs.current[index])) {
                    map.removeLayer(tileLayerRefs.current[index]);
                }
                if (geojsonLayerRefs.current[index] && map.hasLayer(geojsonLayerRefs.current[index])) {
                    map.removeLayer(geojsonLayerRefs.current[index]);
                }
                if (mapControlRefs.current[index]) {
                    map.removeControl(mapControlRefs.current[index]);
                }
                if (downloadControlRefs.current[index]) {
                    map.removeControl(downloadControlRefs.current[index]);
                }
                map.off();
                map.remove();
                mapInstances.current[index] = null;
                layerRefs.current[index] = [];
                tileLayerRefs.current[index] = null;
                geojsonLayerRefs.current[index] = null;
                mapControlRefs.current[index] = null;
                downloadControlRefs.current[index] = null;
                controlsInitialized.current[index] = false;
            }
        });
        georasterCache.current.clear();
        setRenderedMaps(new Array(8).fill(false));
        setIsFullscreen(new Array(8).fill(false));
        setTiffData([]);
        setNoGeoTiffAvailable(new Array(8).fill(false));
        setAllDataReady(false);
        geotiffPromiseCache.current.clear();
    }, []);

    const updateFullscreenButton = useCallback((button, isFull) => {
        if (button) {
            button.innerHTML = isFull ? "⤡" : "⤢";
            button.title = isFull ? "Exit Fullscreen" : "Toggle Full-screen";
            button.className = `ol-fullscreeny-${isFull}`;
        }
    }, []);

    useEffect(() => {
        mapInstances.current.forEach((map, index) => {
            if (map && tileLayerRefs.current[index] && mapRefs.current[index]) {
                tileLayerRefs.current[index].setOpacity(0);
                setTimeout(() => {
                    if (mapInstances.current[index] && tileLayerRefs.current[index]) {
                        map.removeLayer(tileLayerRefs.current[index]);
                        const newTileLayer = L.tileLayer(getTileLayerUrl(), {
                            attribution:
                                theme.palette.mode === "dark"
                                    ? 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors, and the GIS User Community'
                                    : 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                            opacity: 0.1,
                            errorTileUrl: "/images/fallback-tile.png",
                            preload: 1,
                        });
                        newTileLayer.addTo(map);
                        tileLayerRefs.current[index] = newTileLayer;
                        newTileLayer.on("load", () => {
                            newTileLayer.setOpacity(1);
                        });
                        setTimeout(() => {
                            if (mapInstances.current[index]) {
                                mapInstances.current[index].invalidateSize();
                            }
                        }, 200);
                    }
                }, 200);

                if (geojsonLayerRefs.current[index]) {
                    geojsonLayerRefs.current[index].setStyle({
                        color: theme.palette.mode === "dark" ? "white" : "black",
                        weight: 2,
                        opacity: 0.8,
                        fillOpacity: 0,
                        transition: "color 0.2s ease",
                    });
                }
            }
        });
    }, [theme.palette.mode]);

    useEffect(() => {
        if (!countries.length) {
            return;
        }

        let countryId = 5;                    // DEFAULT = Sri Lanka
        let admin_level = "country";          // Always start at country level
        let admin_level_id = 5;
        let showSelect = true;

        // If country comes from URL, override with that
        if (country) {
            const countryName = country.toLowerCase().replace(/[-_]/g, " ");
            const matchedCountry = countries.find(
                (c) =>
                    c.country.toLowerCase().replace(/\s+/g, "") === countryName.replace(/\s+/g, "") &&
                    c.status
            );

            if (matchedCountry) {
                countryId = matchedCountry.country_id;
                admin_level = "country";
                admin_level_id = matchedCountry.country_id;
                showSelect = false;
            } else {
                console.warn(`Country "${country}" not found or inactive. Defaulting to Sri Lanka.`);
                Swal.fire({
                    icon: "warning",
                    title: "Invalid Country",
                    text: `Country "${country}" not found or inactive. Defaulting to Sri Lanka.`,
                });
            }
        }

        // Only update state if needed
        if (countryId !== selectedCountryId || showCountrySelect !== showSelect) {
            setSelectedCountryId(countryId);
            setShowCountrySelect(showSelect);
            cleanupMaps();
            fetchGeojson(admin_level, admin_level_id);
        }

        return () => {
            isFetchingRef.current = false;
        };
    }, [country, countries, fetchGeojson, cleanupMaps]);

    useEffect(() => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;

        const initializeData = async () => {
            setIsLoading(true);
            try {
                const [fetchedCountries, fetchedCommodities, fetchedScenarios, fetchedScales] = await Promise.all([
                    fetchData("lkp/locations/countries"),
                    fetchData("lkp/common/commodities"),
                    fetchData("lkp/common/climate_scenarios"),
                    fetchData("lkp/common/visualization_scales"),
                ]);

                setCountries(fetchedCountries);
                setCommodities(fetchedCommodities);
                setClimateScenarios(fetchedScenarios);
                setVisualizationScales(fetchedScales);

                // Initialize commodity
                let commodityId = "";
                if (fetchedCommodities.length > 0) {
                    const activeCommodities = fetchedCommodities.filter((c) => c.status);
                    if (activeCommodities.length > 0) {
                        commodityId = activeCommodities[0]?.commodity_id; // Use the first active commodity
                        setSelectedCommodityId(commodityId);
                    } else {
                        console.error("No active commodities available");
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "No active commodities available. Please try again later.",
                        });
                    }
                } else {
                    console.error("No commodities fetched");
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to load commodities. Please try again later.",
                    });
                }

                // Initialize scenario
                if (fetchedScenarios.length > 0) {
                    const scenarioId = fetchedScenarios[0]?.scenario_id || "";
                    setSelectedScenarioId(scenarioId);
                } else {
                    console.error("No climate scenarios fetched");
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to load climate scenarios. Please try again later.",
                    });
                }

                // Initialize visualization scale
                if (fetchedScales.length > 0) {
                    const scaleId = fetchedScales[0]?.scale_id || "";
                    setSelectedVisualizationScaleId(scaleId);
                } else {
                    console.error("No visualization scales fetched");
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: "Failed to load visualization scales. Please try again later.",
                    });
                }

                // Initialize year based on scenario
                if (fetchedScenarios.length > 0 && fetchedScenarios[0]?.scenario_id !== 1) {
                    setSelectedYear(2050); // Default to 2050 for non-baseline scenarios
                }

                if (!country) {
                    fetchGeojson("country", 5);
                }
            } catch (err) {
                console.error("Initialization error:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: "Failed to initialize data.",
                });
            } finally {
                setIsLoading(false);
            }
        };

        initializeData();
    }, [fetchData, fetchGeojson, country]);

    useEffect(() => {
        if (!hasInitializedRef.current || !selectedCommodityId) {
            return;
        }
        fetchHazardData(selectedCommodityId);
    }, [selectedCommodityId, selectedCountryId, fetchHazardData]);

    useEffect(() => {
        if (!memoizedHazardData || !memoizedGeojsonData) {
            return;
        }

        fetchTiffs(memoizedHazardData, memoizedGeojsonData, selectedCountryId, selectedCommodityId, selectRasterFile, fetchGeoTiff);

        return () => {
            fetchTiffs.cancel();
        };
    }, [memoizedHazardData, memoizedGeojsonData, selectedCountryId, selectedCommodityId, selectRasterFile, fetchGeoTiff, fetchTiffs, selectedYear]);

    const updateGeoTiffLayer = useCallback(
        async (tiff, index) => {
            if (!mapInstances.current[index] || !mapRefs.current[index]) {
                console.warn(`Skipping updateGeoTiffLayer for index ${index}: missing dependencies`, {
                    mapInstance: !!mapInstances.current[index],
                    mapRef: !!mapRefs.current[index],
                });
                return;
            }

            const map = mapInstances.current[index];

            // Clear existing layers
            layerRefs.current[index].forEach((layer) => {
                if (layer && map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
            layerRefs.current[index] = [];

            // Remove existing GeoJSON layer
            if (geojsonLayerRefs.current[index] && map.hasLayer(geojsonLayerRefs.current[index])) {
                map.removeLayer(geojsonLayerRefs.current[index]);
                geojsonLayerRefs.current[index] = null;
            }

            // Remove existing controls
            if (mapControlRefs.current[index]) {
                map.removeControl(mapControlRefs.current[index]);
                mapControlRefs.current[index] = null;
            }
            if (downloadControlRefs.current[index]) {
                map.removeControl(downloadControlRefs.current[index]);
                downloadControlRefs.current[index] = null;
            }
            controlsInitialized.current[index] = false;

            // Check if all required data is available for download
            const isDownloadDisabled = !commodities.length || !climateScenarios.length || !visualizationScales.length || !selectedCommodityId || !selectedScenarioId || !selectedVisualizationScaleId;

            // Handle case where no valid TIFF data is available
            if (!tiff || !tiff.arrayBuffer || tiff.arrayBuffer.byteLength === 0) {
                setNoGeoTiffAvailable((prev) => {
                    const newNoGeoTiff = [...prev];
                    newNoGeoTiff[index] = true;
                    return newNoGeoTiff;
                });
                if (memoizedGeojsonData?.geojson) {
                    const geojsonLayer = L.geoJSON(memoizedGeojsonData.geojson, {
                        style: {
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            weight: 2,
                            opacity: 0.8,
                            fillOpacity: 0.2,
                            transition: "color 0.2s ease, opacity 0.2s ease",
                        },
                        onEachFeature: (feature, layer) => {
                            layer.bindPopup(
                                feature.properties.name ||
                                feature.properties.NAME ||
                                feature.properties.admin ||
                                "Region"
                            );
                        },
                    });
                    geojsonLayer.addTo(map);
                    geojsonLayerRefs.current[index] = geojsonLayer;
                    if (memoizedGeojsonData.bbox) {
                        map.fitBounds([
                            [memoizedGeojsonData.bbox[1], memoizedGeojsonData.bbox[0]],
                            [memoizedGeojsonData.bbox[3], memoizedGeojsonData.bbox[2]],
                        ]);
                    }
                }

                if (!controlsInitialized.current[index]) {
                    const mapControl = L.control.mapControls({
                        position: "topright",
                        isFullscreen: isFullscreen[index] || false,
                        onFullscreen: (button) => {
                            setIsFullscreen((prev) => {
                                const newFullscreen = [...prev];
                                newFullscreen[index] = !newFullscreen[index];
                                updateFullscreenButton(button, newFullscreen[index]);
                                return newFullscreen;
                            });
                            const mapContainer = mapRefs.current[index];
                            if (mapContainer) {
                                if (!isFullscreen[index]) {
                                    if (mapContainer.requestFullscreen) {
                                        mapContainer.requestFullscreen();
                                    }
                                } else {
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    }
                                }
                            }
                        },
                        onFitExtent: () => {
                            if (memoizedGeojsonData?.bbox && mapInstances.current[index]) {
                                mapInstances.current[index].fitBounds([
                                    [memoizedGeojsonData.bbox[1], memoizedGeojsonData.bbox[0]],
                                    [memoizedGeojsonData.bbox[3], memoizedGeojsonData.bbox[2]],
                                ], { padding: [50, 50] });
                            }
                        },
                        updateFullscreenButton: (button) => updateFullscreenButton(button, isFullscreen[index]),
                    });
                    mapControl.addTo(map);
                    mapControlRefs.current[index] = mapControl;

                    const downloadControl = L.control.downloadControl({
                        position: "topleft",
                        disabled: isDownloadDisabled || true, // Disable download when no TIFF data
                        onDownload: () => {
                            const gridSequence = index === 0 ? 0 : index;
                            const tiffForDownload = tiffData.find((t) => t.metadata.grid_sequence === gridSequence);
                            if (!tiffForDownload) {
                                console.error(`No TIFF data found for map ${index}, grid_sequence: ${gridSequence}`);
                                Swal.fire({
                                    icon: "error",
                                    title: "Download Failed",
                                    text: `No GeoTIFF data available for map ${index}.`,
                                });
                                return;
                            }
                            if (!tiffForDownload.arrayBuffer || tiffForDownload.arrayBuffer.byteLength === 0) {
                                console.error(`Invalid arrayBuffer for map ${index}, grid_sequence: ${gridSequence}`, {
                                    tiffExists: !!tiffForDownload,
                                    arrayBufferExists: !!tiffForDownload.arrayBuffer,
                                    byteLength: tiffForDownload.arrayBuffer?.byteLength || 0,
                                    sourceFile: tiffForDownload.metadata.source_file,
                                    layerName: tiffForDownload.metadata.layer_name,
                                });
                                Swal.fire({
                                    icon: "error",
                                    title: "Download Failed",
                                    text: `No valid GeoTIFF data available for ${tiffForDownload.metadata.layer_name || `map ${index}`}.`,
                                });
                                return;
                            }
                            handleDownloadGeoTIFF(tiffForDownload.arrayBuffer, `${tiffForDownload.metadata.layer_name}.tif`);
                        },
                    });
                    downloadControl.addTo(map);
                    downloadControlRefs.current[index] = downloadControl;

                    controlsInitialized.current[index] = true;
                }

                map.invalidateSize();
                setRenderedMaps((prev) => {
                    const newRenderedMaps = [...prev];
                    newRenderedMaps[index] = true;
                    return newRenderedMaps;
                });
                return;
            }

            // Handle valid TIFF data
            setNoGeoTiffAvailable((prev) => {
                const newNoGeoTiff = [...prev];
                newNoGeoTiff[index] = false;
                return newNoGeoTiff;
            });

            const { arrayBuffer, metadata } = tiff;
            const cacheKey = `${metadata.source_file}-${index}`;
            let georaster = georasterCache.current.get(cacheKey);

            if (!georaster) {
                try {
                    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                        throw new Error(`Invalid arrayBuffer for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}`);
                    }
                    const arrayBufferCopy = arrayBuffer.slice(0);
                    georaster = await parseGeoraster(arrayBufferCopy, { useWorker: false });
                    if (!georaster) {
                        throw new Error(`GeoRaster parsing returned undefined for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}`);
                    }
                    georasterCache.current.set(cacheKey, georaster);
                } catch (err) {
                    console.error(`GeoRaster parsing error for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}:`, err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Failed to parse GeoTIFF for map ${index} (${metadata.layer_name || "unknown"})`,
                    });
                    georasterCache.current.delete(cacheKey);
                    return;
                }
            }

            if (!georaster || !georaster.mins || !georaster.maxs) {
                console.error(`Invalid georaster for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}`);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Invalid GeoRaster data for map ${index} (${metadata.layer_name || "unknown"})`,
                });
                georasterCache.current.delete(cacheKey);
                return;
            }

            const geotiffLayer = new GeoRasterLayer({
                georaster,
                opacity: 0.8,
                pixelValuesToColorFn: (values) => {
                    if (!values || values.length === 0) return "rgba(255, 255, 255, 0)";
                    if (values.length >= 4) {
                        const [r, g, b, a] = values;
                        return `rgba(${r}, ${g}, ${b}, ${a / 255})`;
                    }
                    const value = values[0];
                    const min = georaster.mins[0] || 0;
                    const max = georaster.maxs[0] || 1;
                    if (max === min || value < min || value > max) return "rgba(255, 255, 255, 0)";
                    const colorIndex = Math.min(
                        Math.max(Math.floor(((value - min) / (max - min)) * (metadata.color_ramp.length - 1)), 0),
                        metadata.color_ramp.length - 1
                    );
                    const color = metadata.color_ramp[colorIndex];
                    return `rgba(${parseInt(color.slice(1, 3), 16)}, ${parseInt(color.slice(3, 5), 16)}, ${parseInt(color.slice(5, 7), 16)}, 0.8)`;
                },
                resolution: 256,
                pane: "overlayPane",
                noDataValue: georaster.noDataValue ?? null,
            });

            try {
                geotiffLayer.addTo(map);
                layerRefs.current[index].push(geotiffLayer);

                if (memoizedGeojsonData?.geojson) {
                    const worldBounds = [
                        [
                            [-90, -180],
                            [-90, 180],
                            [90, 180],
                            [90, -180],
                            [-90, -180],
                        ],
                    ];

                    const flipCoordinates = (coords) => {
                        if (!Array.isArray(coords)) return coords;
                        if (typeof coords[0] === "number" && typeof coords[1] === "number") {
                            return [coords[1], coords[0]];
                        }
                        return coords.map(flipCoordinates);
                    };

                    const geojsonCoords = memoizedGeojsonData.geojson.features
                        .filter(feature => feature.geometry && ["Polygon", "MultiPolygon"].includes(feature.geometry.type))
                        .map(feature => {
                            const { type, coordinates } = feature.geometry;
                            try {
                                return type === "Polygon" ? flipCoordinates(coordinates) : flipCoordinates(coordinates).flat(1);
                            } catch (e) {
                                console.warn(`Error processing geometry for feature in map ${index}:`, e);
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
                            console.error(`Error creating mask polygon for map ${index}:`, e);
                            maskPolygon = L.polygon(worldBounds, {
                                color: "transparent",
                                fillColor: "#ffffff",
                                fillOpacity: 0.8,
                                weight: 0,
                                interactive: false,
                                pane: "maskPane",
                            });
                        }
                    } else {
                        maskPolygon = L.polygon(worldBounds, {
                            color: "transparent",
                            fillColor: "#ffffff",
                            fillOpacity: 0.8,
                            weight: 0,
                            interactive: false,
                            pane: "maskPane",
                        });
                    }
                    maskPolygon.addTo(map);
                    layerRefs.current[index].push(maskPolygon);
                }

                if (memoizedGeojsonData?.geojson) {
                    const geojsonLayer = L.geoJSON(memoizedGeojsonData.geojson, {
                        style: {
                            color: theme.palette.mode === "dark" ? "white" : "black",
                            weight: 2,
                            opacity: 0.8,
                            fillOpacity: 0,
                            transition: "color 0.2s ease, opacity 0.2s ease",
                        },
                        onEachFeature: (feature, layer) => {
                            layer.bindPopup(
                                feature.properties.name ||
                                feature.properties.NAME ||
                                feature.properties.admin ||
                                "Region"
                            );
                        },
                    });
                    geojsonLayer.addTo(map);
                    geojsonLayerRefs.current[index] = geojsonLayer;
                    if (memoizedGeojsonData.bbox) {
                        map.fitBounds([
                            [memoizedGeojsonData.bbox[1], memoizedGeojsonData.bbox[0]],
                            [memoizedGeojsonData.bbox[3], memoizedGeojsonData.bbox[2]],
                        ]);
                    }
                }

                geotiffLayer.on("click", async (e) => {
                    const { lat, lng } = e.latlng;
                    try {
                        const value = await georaster.getValues([[lng, lat]])[0];
                        L.popup()
                            .setLatLng(e.latlng)
                            .setContent(`Value: ${value !== undefined ? value.toFixed(2) : "N/A"} at (${lat.toFixed(4)}, ${lng.toFixed(4)})`)
                            .openOn(map);
                    } catch (err) {
                        console.error("Error fetching GeoTIFF value:", err);
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: "Failed to retrieve raster value.",
                        });
                    }
                });

                geotiffLayer.on("load", () => {
                    map.invalidateSize();
                    setRenderedMaps((prev) => {
                        const newRenderedMaps = [...prev];
                        newRenderedMaps[index] = true;
                        return newRenderedMaps;
                    });
                });

                if (!controlsInitialized.current[index]) {
                    const downloadControl = L.control.downloadControl({
                        position: "topleft",
                        disabled: isDownloadDisabled || !tiff || !tiff.arrayBuffer || tiff.arrayBuffer.byteLength === 0,
                        onDownload: () => {
                            const gridSequence = index === 0 ? 0 : index;
                            const tiffForDownload = tiffData.find((t) => t.metadata.grid_sequence === gridSequence);
                            if (!tiffForDownload) {
                                console.error(`No TIFF data found for map ${index}, grid_sequence: ${gridSequence}`);
                                Swal.fire({
                                    icon: "error",
                                    title: "Download Failed",
                                    text: `No GeoTIFF data available for map ${index}.`,
                                });
                                return;
                            }
                            if (!tiffForDownload.arrayBuffer || tiffForDownload.arrayBuffer.byteLength === 0) {
                                console.error(`Invalid arrayBuffer for map ${index}, grid_sequence: ${gridSequence}`, {
                                    tiffExists: !!tiffForDownload,
                                    arrayBufferExists: !!tiffForDownload.arrayBuffer,
                                    byteLength: tiffForDownload.arrayBuffer?.byteLength || 0,
                                    sourceFile: tiffForDownload.metadata.source_file,
                                    layerName: tiffForDownload.metadata.layer_name,
                                });
                                Swal.fire({
                                    icon: "error",
                                    title: "Download Failed",
                                    text: `No valid GeoTIFF data available for ${tiffForDownload.metadata.layer_name || `map ${index}`}.`,
                                });
                                return;
                            }
                            handleDownloadGeoTIFF(tiffForDownload.arrayBuffer, `${tiffForDownload.metadata.layer_name}.tif`);
                        },
                    });
                    downloadControl.addTo(map);
                    downloadControlRefs.current[index] = downloadControl;

                    const mapControl = L.control.mapControls({
                        position: "topright",
                        isFullscreen: isFullscreen[index] || false,
                        onFullscreen: (button) => {
                            setIsFullscreen((prev) => {
                                const newFullscreen = [...prev];
                                newFullscreen[index] = !newFullscreen[index];
                                updateFullscreenButton(button, newFullscreen[index]);
                                return newFullscreen;
                            });
                            const mapContainer = mapRefs.current[index];
                            if (mapContainer) {
                                if (!isFullscreen[index]) {
                                    if (mapContainer.requestFullscreen) {
                                        mapContainer.requestFullscreen();
                                    }
                                } else {
                                    if (document.exitFullscreen) {
                                        document.exitFullscreen();
                                    }
                                }
                            }
                        },
                        onFitExtent: () => {
                            if (memoizedGeojsonData?.bbox && mapInstances.current[index]) {
                                mapInstances.current[index].fitBounds([
                                    [memoizedGeojsonData.bbox[1], memoizedGeojsonData.bbox[0]],
                                    [memoizedGeojsonData.bbox[3], memoizedGeojsonData.bbox[2]],
                                ], { padding: [50, 50] });
                            }
                        },
                        updateFullscreenButton: (button) => updateFullscreenButton(button, isFullscreen[index]),
                    });
                    mapControl.addTo(map);
                    mapControlRefs.current[index] = mapControl;

                    controlsInitialized.current[index] = true;
                }

                map.invalidateSize();
            } catch (err) {
                console.error(`Failed to add layers to map ${index}:`, err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: `Failed to add layers for map ${index}`,
                });
            }
        },
        [
            memoizedGeojsonData,
            isFullscreen,
            updateFullscreenButton,
            handleDownloadGeoTIFF,
            theme.palette.mode,
            tiffData,
            commodities,
            climateScenarios,
            visualizationScales,
            selectedCommodityId,
            selectedScenarioId,
            selectedVisualizationScaleId,
        ]
    );

    const renderMaps = useCallback(() => {
        if (!allDataReady) {
            return;
        }

        const sortedGrids = memoizedHazardData?.raster_grids?.sort((a, b) => (a.grid_sequence || 0) - (b.grid_sequence || 0)) || [];
        sortedGrids.forEach((grid) => {
            const gridSequence = grid.grid_sequence;
            const mapIndex = gridSequence === 0 ? 0 : gridSequence;
            if (!mapRefs.current[mapIndex] || mapInstances.current[mapIndex]) {
                console.warn(`Skipping map initialization for index ${mapIndex}:`, {
                    mapRef: !!mapRefs.current[mapIndex],
                    mapInstance: !!mapInstances.current[mapIndex],
                });
                return;
            }

            const map = L.map(mapRefs.current[mapIndex], {
                minZoom: 3,
                maxZoom: 18,
                zoom: 5,
                center: [20.5937, 78.9629],
                fadeAnimation: false,
                zoomAnimation: true,
                zoomSnap: 0.1,
                zoomDelta: 0.1,
            });

            map.createPane("maskPane");
            map.getPane("maskPane").style.zIndex = 450;
            map.getPane("maskPane").style.pointerEvents = "none";

            const tileLayer = L.tileLayer(getTileLayerUrl(), {
                attribution:
                    theme.palette.mode === "dark"
                        ? 'Tiles &copy; Esri &mdash; Esri, HERE, Garmin, FAO, NOAA, USGS, &copy; OpenStreetMap contributors, and the GIS User Community'
                        : 'Tiles &copy; Esri &mdash; Esri, DeLorme, NAVTEQ, TomTom, Intermap, iPC, USGS, FAO, NPS, NRCAN, GeoBase, Kadaster NL, Ordnance Survey, Esri Japan, METI, Esri China (Hong Kong), and the GIS User Community',
                opacity: 0.1,
                errorTileUrl: "/images/fallback-tile.png",
                preload: 1,
            });
            tileLayer.addTo(map);
            tileLayer.on("load", () => {
                tileLayer.setOpacity(1);
                map.invalidateSize();
            });
            mapInstances.current[mapIndex] = map;
            tileLayerRefs.current[mapIndex] = tileLayer;
            layerRefs.current[mapIndex] = [];

            setTimeout(() => {
                if (mapInstances.current[mapIndex]) {
                    mapInstances.current[mapIndex].invalidateSize();
                }
            }, 100);
        });

        sortedGrids.forEach((grid) => {
            const gridSequence = grid.grid_sequence;
            const mapIndex = gridSequence === 0 ? 0 : gridSequence;
            if (mapRefs.current[mapIndex] && mapInstances.current[mapIndex]) {
                const tiff = tiffData.find((t) => t.metadata.grid_sequence === gridSequence);
                updateGeoTiffLayer(tiff, mapIndex);
            } else {
                console.warn(`Map ref or instance missing for grid_sequence: ${gridSequence}, map index: ${mapIndex}`);
                setNoGeoTiffAvailable((prev) => {
                    const newNoGeoTiff = [...prev];
                    newNoGeoTiff[mapIndex] = true;
                    return newNoGeoTiff;
                });
            }
        });
    }, [allDataReady, tiffData, updateGeoTiffLayer, theme.palette.mode, memoizedHazardData]);

    useEffect(() => {
        if (allDataReady) {
            renderMaps();
        }
    }, [allDataReady, tiffData, renderMaps]);

    const handleCountryChange = useCallback(
        (event) => {
            const countryId = event.target.value;
            if (countryId === selectedCountryId) {
                return;
            }
            setSelectedCountryId(countryId);
            setShowCountrySelect(true);
            const admin_level = countryId !== 0 ? "country" : "total";
            const admin_level_id = countryId || null;
            cleanupMaps();
            fetchGeojson(admin_level, admin_level_id);
        },
        [fetchGeojson, cleanupMaps, selectedCountryId]
    );

    const handleCommodityChange = useCallback(
        (event) => {
            const commodityId = event.target.value;
            if (commodityId === selectedCommodityId) {
                return;
            }
            setSelectedCommodityId(commodityId);
            cleanupMaps();
        },
        [selectedCommodityId, cleanupMaps]
    );

    const handleScenarioChange = useCallback(
        (event) => {
            const scenarioId = event.target.value;
            if (scenarioId === selectedScenarioId) {
                return;
            }
            setSelectedScenarioId(scenarioId);
            if (parseInt(scenarioId) === 1) {
                setSelectedYear(null);
            } else if (selectedYear === null) {
                setSelectedYear(2050);
            }
            cleanupMaps();
        },
        [selectedScenarioId, selectedYear, cleanupMaps]
    );

    const handleVisualizationScaleChange = useCallback(
        (event) => {
            const scaleId = event.target.value;
            if (scaleId === selectedVisualizationScaleId) {
                return;
            }
            setSelectedVisualizationScaleId(scaleId);
            cleanupMaps();
        },
        [selectedVisualizationScaleId, cleanupMaps]
    );

    const handleIntensityMetricChange = useCallback(
        (event) => {
            const value = event.target.value;
            if (+value === +selectedIntensityMetricId) {
                return;
            }
            setSelectedIntensityMetricId(+value);
            cleanupMaps();
        },
        [selectedIntensityMetricId, cleanupMaps]
    );

    const handleChangeMetricChange = useCallback(
        (event) => {
            const value = event.target.value;
            if (+value === +selectedChangeMetricId) {
                return;
            }
            setSelectedChangeMetricId(+value);
            cleanupMaps();
        },
        [selectedChangeMetricId, cleanupMaps]
    );

    const handleSelectedYear = useCallback(
        (event) => {
            const value = event.target.value;
            if (+value === +selectedYear) {
                return;
            }
            setSelectedYear(+value);
            cleanupMaps();
        },
        [selectedYear, cleanupMaps]
    );

    useEffect(() => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";
    }, []);

    const box1 = React.useRef(null);

    return (
        <Paper sx={{ overflow: "hidden", height: "100vh", backgroundColor: theme.palette.mode === "dark" ? "black" : "white" }}>
            <Grid container spacing={1} sx={{ marginTop: "74px", p: 1 }}>
                <Grid item xs={3} key="side">
                    <Paper elevation={1} ref={box1} sx={{ borderRadius: 1 }}>
                        <Box
                            sx={(theme) => ({
                                width: "100%",
                                bgcolor: theme.palette.mode === "dark" ? "#387530" : "#C1E1C1",
                                height: "24px",
                                alignContent: "center",
                                justifyContent: "center",
                                alignItems: "center",
                                fontFamily: "Poppins",
                            })}
                        >
                            <Typography sx={{ fontSize: 14, fontWeight: "500", fontFamily: "Poppins" }}>
                                Hazard at a Glance
                            </Typography>
                        </Box>

                        <Box
                            sx={(theme) => ({
                                paddingX: "8px",
                                paddingY: "1.5px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "8px",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                overflow: "hidden",
                                backgroundColor: theme.palette.mode === "dark" ? "#2d3136" : "#F7F7F7",
                                border: "0px solid black",
                                fontFamily: "Poppins",
                            })}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.625,
                                flex: 1,
                                marginRight: "5px",
                                overflow: "hidden",
                                flexWrap: "nowrap",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Location: </Typography>
                                <FormControl fullWidth>
                                    {showCountrySelect ? (
                                        <Select
                                            disableUnderline
                                            variant="standard"
                                            value={selectedCountryId}
                                            onChange={handleCountryChange}
                                            displayEmpty
                                            inputProps={{ "aria-label": "Country" }}
                                            IconComponent={ArrowDropDownIcon}
                                            MenuProps={{
                                                disableScrollLock: true,
                                                PaperProps: { sx: { maxHeight: 300 } },
                                                PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                            }}
                                            sx={(theme) => ({
                                                fontSize: "12px",
                                                height: "24px",
                                                fontFamily: "Poppins",
                                                backgroundColor:
                                                    theme.palette.mode === "dark"
                                                        ? "rgba(60, 75, 60, 1)"
                                                        : "rgba(235, 247, 233, 1)",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                fontFamily: "Poppins",
                                            })}
                                            disabled={isLoading || isOptionLoading}
                                        >
                                            {/*<MenuItem value={0} sx={{ fontSize: "12px", paddingY: "2px" }}>
                                                South Asia
                                            </MenuItem>*/}
                                            {countries.map((country) => (
                                                <MenuItem
                                                    key={country.country_id}
                                                    value={country.country_id}
                                                    disabled={!country.status}
                                                    sx={{
                                                        fontSize: "12px",
                                                        paddingY: "2px",
                                                        overflow: "hidden",
                                                        textOverflow: "ellipsis",
                                                        whiteSpace: "nowrap",
                                                        maxWidth: "90px",
                                                        fontFamily: "Poppins",
                                                    }}
                                                >
                                                    {country.country}
                                                </MenuItem>
                                            ))}
                                        </Select>
                                    ) : (
                                        <Typography variant="body1" sx={{ fontSize: "12px", fontFamily: "Poppins", }}>
                                            {countries.find((c) => c.country_id === selectedCountryId)?.country || "South Asia"}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>

                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.625,
                                    flex: 1,
                                    marginRight: "5px",
                                    overflow: "hidden",
                                    flexWrap: "nowrap",
                                    minWidth: "auto",
                                    fontFamily: "Poppins",
                                }}
                            >
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Commodity: </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        disableUnderline
                                        variant="standard"
                                        value={selectedCommodityId}
                                        onChange={handleCommodityChange}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Commodity" }}
                                        IconComponent={ArrowDropDownIcon}
                                        MenuProps={{
                                            disableScrollLock: true,
                                            PaperProps: { sx: { maxHeight: 300 } },
                                            PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                        }}
                                        sx={(theme) => ({
                                            fontSize: "12px",
                                            height: "24px",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "rgba(60, 75, 60, 1)"
                                                    : "rgba(235, 247, 233, 1)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
                                            fontFamily: "Poppins",
                                        })}
                                        disabled={isLoading || isOptionLoading}
                                    >
                                        {Object.entries(
                                            commodities
                                                .filter((c) => c.status)
                                                .reduce((acc, commodity) => {
                                                    const group = commodity.commodity_group || "Others";
                                                    if (!acc[group]) {
                                                        acc[group] = [];
                                                    }
                                                    acc[group].push(commodity);
                                                    return acc;
                                                }, {})
                                        )
                                            .sort(([groupA], [groupB]) => groupA.localeCompare(groupB))
                                            .map(([group, items]) => [
                                                <MenuItem
                                                    key={`group-${group}`}
                                                    value=""
                                                    disabled
                                                    sx={{
                                                        fontSize: "12px",
                                                        fontWeight: "bold",
                                                        backgroundColor: (theme) =>
                                                            theme.palette.mode === "dark" ? "#4a4a4a" : "#e0e0e0",
                                                        paddingY: "2px",
                                                        fontFamily: "Poppins",
                                                        cursor: "default",
                                                        "&:hover": { backgroundColor: "inherit" },
                                                    }}
                                                >
                                                    {group}
                                                </MenuItem>,
                                                ...items
                                                    .sort((a, b) => a.commodity.localeCompare(b.commodity))
                                                    .map((commodity) => (
                                                        <MenuItem
                                                            key={commodity.commodity_id}
                                                            value={commodity.commodity_id}
                                                            sx={{
                                                                fontSize: "12px",
                                                                paddingY: "2px",
                                                                paddingLeft: "20px", // Indent commodities under group
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                maxWidth: "90px",
                                                                fontFamily: "Poppins",
                                                            }}
                                                        >
                                                            {commodity.commodity}
                                                        </MenuItem>
                                                    )),
                                            ])}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box
                            sx={(theme) => ({
                                paddingX: "8px",
                                paddingY: "1.5px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "8px",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                overflow: "hidden",
                                backgroundColor: theme.palette.mode === "dark" ? "#2d3136" : "#F7F7F7",
                                border: "0px solid black",
                                fontFamily: "Poppins",
                            })}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.625,
                                flex: 1,
                                marginRight: "5px",
                                overflow: "hidden",
                                flexWrap: "nowrap",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Scenario: </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        disableUnderline
                                        variant="standard"
                                        value={selectedScenarioId}
                                        onChange={handleScenarioChange}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Scenario" }}
                                        IconComponent={ArrowDropDownIcon}
                                        MenuProps={{
                                            disableScrollLock: true,
                                            PaperProps: { sx: { maxHeight: 300 } },
                                            PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                        }}
                                        sx={(theme) => ({
                                            fontSize: "12px",
                                            height: "24px",
                                            fontFamily: "Poppins",
                                            backgroundColor: theme.palette.mode === "dark" ? "rgba(60, 75, 60, 1)" : "rgba(235, 247, 233, 1)",
                                        })}
                                        disabled={isLoading || isOptionLoading}
                                    >
                                        {climateScenarios.map((scenario) => (
                                            <MenuItem
                                                key={scenario.scenario_id}
                                                value={scenario.scenario_id}
                                                disabled={!scenario.status}
                                                sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}
                                            >
                                                {scenario.scenario}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.625,
                                flex: 1,
                                marginRight: "5px",
                                overflow: "hidden",
                                flexWrap: "nowrap",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Scales: </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        disableUnderline
                                        variant="standard"
                                        value={selectedVisualizationScaleId}
                                        onChange={handleVisualizationScaleChange}
                                        displayEmpty
                                        inputProps={{ "aria-label": "Visualization Scales" }}
                                        IconComponent={ArrowDropDownIcon}
                                        MenuProps={{
                                            disableScrollLock: true,
                                            PaperProps: { sx: { maxHeight: 300 } },
                                            PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                        }}
                                        sx={(theme) => ({
                                            fontSize: "12px",
                                            height: "24px",
                                            fontFamily: "Poppins",
                                            backgroundColor: theme.palette.mode === "dark" ? "rgba(60, 75, 60, 1)" : "rgba(235, 247, 233, 1)",
                                        })}
                                        disabled={isLoading || isOptionLoading || visualizationScales.length === 0}
                                    >
                                        {visualizationScales.map((scale) => (
                                            <MenuItem
                                                key={scale.scale_id}
                                                value={scale.scale_id}
                                                disabled={!scale.status}
                                                sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}
                                            >
                                                {scale.scale}
                                            </MenuItem>
                                        ))}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box
                            sx={(theme) => ({
                                paddingX: "8px",
                                paddingY: "1.5px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "8px",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                overflow: "hidden",
                                backgroundColor: theme.palette.mode === "dark" ? "#2d3136" : "#F7F7F7",
                                border: "0px solid black",
                                fontFamily: "Poppins",
                            })}
                        >
                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.625,
                                flex: 1,
                                marginRight: "5px",
                                overflow: "hidden",
                                flexWrap: "nowrap",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Intensity: </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        disableUnderline
                                        variant="standard"
                                        value={selectedIntensityMetricId}
                                        onChange={handleIntensityMetricChange}
                                        MenuProps={{
                                            disableScrollLock: true,
                                            PaperProps: { sx: { maxHeight: 300 } },
                                            PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                        }}
                                        sx={(theme) => ({
                                            fontSize: "12px",
                                            height: "24px",
                                            fontFamily: "Poppins",
                                            backgroundColor: theme.palette.mode === "dark" ? "rgba(60, 75, 60, 1)" : "rgba(235, 247, 233, 1)",
                                        })}
                                        disabled={isLoading || isOptionLoading}
                                    >
                                        <MenuItem value={1} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                            Intensity
                                        </MenuItem>
                                        <MenuItem value={2} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                            Intensity Frequency
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>

                            <Box sx={{
                                display: "flex",
                                alignItems: "center",
                                gap: 0.625,
                                flex: 1,
                                marginRight: "5px",
                                overflow: "hidden",
                                flexWrap: "nowrap",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins",}}>Metric: </Typography>
                                <FormControl fullWidth>
                                    <Select
                                        disableUnderline
                                        variant="standard"
                                        value={selectedChangeMetricId}
                                        onChange={handleChangeMetricChange}
                                        MenuProps={{
                                            disableScrollLock: true,
                                            PaperProps: { sx: { maxHeight: 300 } },
                                            PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                        }}
                                        sx={(theme) => ({
                                            fontSize: "12px",
                                            height: "24px",
                                            fontFamily: "Poppins",
                                            backgroundColor: theme.palette.mode === "dark" ? "rgba(60, 75, 60, 1)" : "rgba(235, 247, 233, 1)",
                                        })}
                                        disabled={isLoading || isOptionLoading || +selectedScenarioId === 1}

                                    >
                                        <MenuItem value={1} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                            Absolute
                                        </MenuItem>
                                        <MenuItem value={2} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                            Delta
                                        </MenuItem>
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>

                        <Box
                            sx={(theme) => ({
                                paddingX: "8px",
                                paddingY: "1.5px",
                                display: "flex",
                                flexDirection: "row",
                                justifyContent: "space-between",
                                gap: "8px",
                                alignItems: "center",
                                flexWrap: "nowrap",
                                overflow: "hidden",
                                backgroundColor: theme.palette.mode === "dark" ? "#2d3136" : "#F7F7F7",
                                border: "0px solid black",
                                fontFamily: "Poppins",
                            })}
                        >
                            {parseInt(selectedScenarioId) !== 1 && (
                                <Box sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.625,
                                    flex: 1,
                                    marginRight: "5px",
                                    overflow: "hidden",
                                    flexWrap: "nowrap",
                                    minWidth: 'auto',
                                    fontFamily: "Poppins",
                                }}>
                                    <Typography sx={{ fontSize: 13, fontWeight: "bold" }}>Year: </Typography>
                                    <FormControl fullWidth>
                                        <Select
                                            disableUnderline
                                            variant="standard"
                                            value={selectedYear || 2050}
                                            onChange={handleSelectedYear}
                                            MenuProps={{
                                                disableScrollLock: true,
                                                PaperProps: { sx: { maxHeight: 300 } },
                                                PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                            }}
                                            sx={(theme) => ({
                                                fontSize: "12px",
                                                height: "24px",
                                                fontFamily: "Poppins",
                                                backgroundColor: theme.palette.mode === "dark" ? "rgba(60, 75, 60, 1)" : "rgba(235, 247, 233, 1)",
                                            })}
                                            disabled={isLoading || isOptionLoading}
                                        >
                                            <MenuItem value={2050} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                2050
                                            </MenuItem>
                                            <MenuItem value={2080} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                2080
                                            </MenuItem>
                                        </Select>
                                    </FormControl>
                                </Box>
                            )}
                        </Box>

                        <Box sx={{ position: "relative" }}>
                            <div
                                ref={(el) => (mapRefs.current[0] = el)}
                                className="map-container"
                                style={{ height: parseInt(selectedScenarioId) === 1 ? "calc(-203px + 100vh)" : "calc(-228px + 100vh)", width: "100%" }}
                            />
                            {isLoading && (
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
                                        fontFamily: "Poppins",
                                    }}
                                >
                                    <CircularProgress />
                                </Box>
                            )}
                            {noGeoTiffAvailable[0] && !isLoading ? (
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
                                        fontFamily: "Poppins",
                                    }}
                                >
                                    <Typography sx={{ fontSize: "16px", fontWeight: "500", textAlign: "center", fontFamily: "Poppins", }}>
                                        No GeoTIFF Available
                                    </Typography>
                                </Box>
                            ) : (
                                tiffData.find((tiff) => tiff.metadata.grid_sequence === 0) && renderedMaps[0] && (
                                    <MapLegend
                                        tiff={tiffData.find((tiff) => tiff?.metadata?.grid_sequence === 0) || null}
                                        breadcrumbData={{ ...breadcrumbData, change_metric_id: 1 }}
                                        layerType="risk"
                                        apiUrl={apiUrl}
                                        mapWidth={mapWidths.current[0] || 0}
                                        legendType="Large"
                                    />
                                )
                            )}
                        </Box>
                    </Paper>
                </Grid>

                <Grid item xs={9}>
                    <Grid container spacing={1}>
                        {Array.from({ length: 6 }, (_, index) => {
                            const gridSequence = index + 1;
                            const tiff = tiffData.find((t) => t.metadata.grid_sequence === gridSequence);
                            const grid = memoizedHazardData?.raster_grids?.find((g) => g.grid_sequence === gridSequence);
                            return (
                                <Grid item xs={4} key={`map-${gridSequence}`}>
                                    <Paper elevation={1} sx={{ borderRadius: 1, position: "relative" }}>
                                        <Typography
                                            sx={{
                                                fontSize: 14,
                                                fontWeight: "500",
                                                fontFamily: "Poppins",
                                            }}
                                        >
                                            {grid?.hazard_title || " "}
                                        </Typography>
                                        <div
                                            ref={(el) => (mapRefs.current[gridSequence] = el)}
                                            className="map-container"
                                            style={{ height: "calc(-71px + 50vh)", width: "100%" }}
                                        />
                                        {isLoading && (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 24,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    zIndex: 1200,
                                                    fontFamily: "Poppins",
                                                }}
                                            >
                                                <CircularProgress />
                                            </Box>
                                        )}
                                        {noGeoTiffAvailable[gridSequence] && !isLoading ? (
                                            <Box
                                                sx={{
                                                    position: "absolute",
                                                    top: 24,
                                                    left: 0,
                                                    right: 0,
                                                    bottom: 0,
                                                    display: "flex",
                                                    alignItems: "center",
                                                    justifyContent: "center",
                                                    backgroundColor: "rgba(255, 255, 255, 0.7)",
                                                    zIndex: 1100,
                                                }}
                                            >
                                                <Typography sx={{ fontSize: "14px", fontWeight: "500", textAlign: "center", fontFamily: "Poppins", }}>
                                                    No GeoTIFF Available
                                                </Typography>
                                            </Box>
                                        ) : (
                                            tiff && renderedMaps[gridSequence] && (
                                                <MapLegend
                                                    tiff={tiff}
                                                    breadcrumbData={{
                                                        commodity: commodities.find((c) => c.commodity_id === selectedCommodityId)?.commodity || null,
                                                        commodity_id: selectedCommodityId || null,
                                                        country_id: selectedCountryId || null,
                                                        state_id: null,
                                                        climate_scenario_id: selectedScenarioId || null,
                                                        visualization_scale_id: selectedVisualizationScaleId || null,
                                                        intensity_metric_id: selectedIntensityMetricId || null,
                                                        change_metric_id: selectedChangeMetricId || null,
                                                        year: selectedYear || null,
                                                        geojson: geojsonData?.geojson || null,
                                                        bbox: geojsonData?.bbox || null,
                                                        region: geojsonData?.region || null,
                                                    }}
                                                    layerType="risk"
                                                    apiUrl={apiUrl}
                                                    mapWidth={mapWidths.current[gridSequence]}
                                                    showHeader={false}
                                                    padding="2px"
                                                    glance={true}
                                                    hazards={true}
                                                    legendType="Small"
                                                />
                                            )
                                        )}
                                    </Paper>
                                </Grid>
                            );
                        })}
                    </Grid>
                </Grid>
            </Grid>
        </Paper>
    );
};

export default DataGlance;