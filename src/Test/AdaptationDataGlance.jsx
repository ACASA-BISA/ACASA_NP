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
        downloadButton.style.cursor = "pointer";
        downloadButton.style.padding = "5px";
        downloadButton.style.display = "flex";
        downloadButton.style.alignItems = "center";
        downloadButton.style.justifyContent = "center";
        downloadButton.style.width = "30px";
        downloadButton.style.height = "30px";
        downloadButton.style.backgroundColor = "#fff";
        downloadButton.style.borderRadius = "4px";
        L.DomEvent.on(downloadButton, "click", (e) => {
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
        const zoomContainer = L.DomUtil.create(
            "div",
            "ol-zoom-compact ol-unselectable ol-control"
        );
        zoomContainer.style.pointerEvents = "auto";
        const zoomInButton = L.DomUtil.create("button", "ol-zoom-compact-in", zoomContainer);
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
        const zoomOutButton = L.DomUtil.create("button", "ol-zoom-compact-out", zoomContainer);
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
    const [adaptationCropTabs, setAdaptationCropTabs] = useState([]);
    const [adaptations, setAdaptations] = useState([]);
    const [geojsonData, setGeojsonData] = useState(null);
    const [selectedCountryId, setSelectedCountryId] = useState(7); // Nepal
    const [selectedCommodityId, setSelectedCommodityId] = useState("");
    const [selectedScenarioId, setSelectedScenarioId] = useState("");
    const [selectedVisualizationScaleId, setSelectedVisualizationScaleId] = useState("");
    const [selectedIntensityMetricId, setSelectedIntensityMetricId] = useState(2);
    const [selectedChangeMetricId, setSelectedChangeMetricId] = useState(1);
    const [selectedYear, setSelectedYear] = useState(null);
    const [selectedAdaptationCropTabId, setSelectedAdaptationCropTabId] = useState("");
    const [selectedAdaptations, setSelectedAdaptations] = useState(new Array(8).fill(""));
    const [isOptionLoading, setIsOptionLoading] = useState(false);
    const [showCountrySelect, setShowCountrySelect] = useState(true);
    const [isLoading, setIsLoading] = useState(false);
    const [hazardData, setHazardData] = useState(null);
    const [tiffData, setTiffData] = useState([]);
    const [allDataReady, setAllDataReady] = useState(false);
    const [renderedMaps, setRenderedMaps] = useState(new Array(8).fill(false));
    const [isFullscreen, setIsFullscreen] = useState(new Array(8).fill(false));
    const [noGeoTiffAvailable, setNoGeoTiffAvailable] = useState(new Array(8).fill(false)); // New state for tracking no GeoTIFF
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
            adaptation_croptab_id: selectedAdaptationCropTabId || null,
            geojson: geojsonData?.geojson || null,
            bbox: geojsonData?.bbox || null,
            region: geojsonData?.region || null,
        }),
        [commodities, selectedCommodityId, selectedCountryId, selectedScenarioId, selectedVisualizationScaleId, selectedIntensityMetricId, selectedChangeMetricId, selectedAdaptationCropTabId, geojsonData]
    );
    const memoizedHazardData = useMemo(() => hazardData, [hazardData]);
    const memoizedGeojsonData = useMemo(() => geojsonData, [geojsonData]);
    const isAdaptationChangeRef = useRef(false);
    const getTileLayerUrl = () => {
        return theme.palette.mode === "dark"
            ? "http://services.arcgisonline.com/ArcGIS/rest/services/Canvas/World_Dark_Gray_Base/MapServer/tile/{z}/{y}/{x}"
            : "https://server.arcgisonline.com/ArcGIS/rest/services/World_Topo_Map/MapServer/tile/{z}/{y}/{x}";
    };
    const makeTiffCacheKey = useCallback(
        (file, gridSequence, adaptationId) => {
            const isBaseline = parseInt(selectedScenarioId) === 1;
            const year = isBaseline ? "baseline" : selectedYear ?? "no-year";
            return `${file.source_file}-${selectedCountryId || "total"}-${adaptationId ?? "no-adaptation"}-${selectedScenarioId}-${selectedVisualizationScaleId}-${year}`;
        },
        [
            selectedCountryId,
            selectedScenarioId,
            selectedVisualizationScaleId,
            selectedYear,
        ]
    );
    const getBaselineLayerId = (hazardData) => {
        // grid_sequence === 0 is always the reference map
        const baselineGrid = hazardData?.raster_grids?.find(
            (g) => g.grid_sequence === 0
        );
        if (!baselineGrid) return null;
        // Crops → impact, Livestock → risk (you can extend this mapping)
        const isLivestock = selectedCommodityId
            ? commodities.find((c) => c.commodity_id === selectedCommodityId)
                ?.commodity_group?.toLowerCase()
                .includes("livestock")
            : false;
        return isLivestock ? baselineGrid.risk_layer_id : baselineGrid.layer_id;
    };
    const selectRasterFile = useCallback(
        (grid, adaptationId) => {
            const rasterFiles = grid.raster_files || [];
            const isBaseline = parseInt(selectedScenarioId) === 1;
            const expectedYear = isBaseline ? null : selectedYear;
            // 1. sort → existing files first
            const sorted = [...rasterFiles].sort((a, b) => {
                if (a.exists && !b.exists) return -1;
                if (!a.exists && b.exists) return 1;
                return 0;
            });
            const targetAdaptationId = adaptationId ? parseInt(adaptationId) : 0;
            return sorted.find((file) => {
                const fileAdaptationId = parseInt(file.layer_id) || 0; // <-- correct field
                const matchesScenario =
                    !file.climate_scenario_id ||
                    +file.climate_scenario_id === parseInt(selectedScenarioId);
                const matchesYear =
                    isBaseline || !file.year || +file.year === +expectedYear;
                const matchesScale =
                    !file.visualization_scale_id ||
                    +file.visualization_scale_id === parseInt(selectedVisualizationScaleId);
                const matchesAdaptation = fileAdaptationId === targetAdaptationId;
                const exists = !!file.exists;
                return exists && matchesScenario && matchesYear && matchesScale && matchesAdaptation;
            });
        },
        [
            selectedScenarioId,
            selectedYear,
            selectedVisualizationScaleId,
        ]
    );
    const fetchGeoTiff = useCallback(
        async (file, gridSequence, layerId, grid) => {
            const adaptationIdFromParam = layerId ?? file.adaptation_id ?? "";
            const cacheKey = makeTiffCacheKey(file, gridSequence, adaptationIdFromParam);
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
                    if (!geotiffRes.ok) {
                        const responseData = await geotiffRes.json().catch(() => ({}));
                        if (responseData.success === 0 && responseData.message?.includes("No data available")) {
                            console.warn(`No GeoTIFF data available for ${file.source_file}`);
                            setNoGeoTiffAvailable((prev) => {
                                const newState = [...prev];
                                newState[gridSequence] = true;
                                return newState;
                            });
                            return null;
                        }
                        throw new Error(`Failed to fetch GeoTIFF: ${geotiffRes.status} ${geotiffRes.statusText}`);
                    }
                    const arrayBuffer = await geotiffRes.arrayBuffer();
                    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                        throw new Error(`Empty arrayBuffer for ${file.source_file}`);
                    }
                    const view = new DataView(arrayBuffer);
                    const byteOrder = view.getUint16(0, false);
                    if (byteOrder !== 0x4949 && byteOrder !== 0x4D4D) {
                        throw new Error(`Invalid GeoTIFF byte order for ${file.source_file}: ${byteOrder.toString(16)}`);
                    }
                    const modifiedColorRamp = file.ramp.map((color) =>
                        color.toLowerCase() === "#00ff00" ? "#7FFF00" : color
                    );
                    setNoGeoTiffAvailable((prev) => {
                        const newState = [...prev];
                        newState[gridSequence] = false;
                        return newState;
                    });
                    console.log(grid.layer_id, { layerId });
                    return {
                        arrayBuffer,
                        metadata: {
                            source_file: file.source_file,
                            color_ramp: modifiedColorRamp,
                            layer_name: file.grid_sequence_title || `Grid ${gridSequence}`,
                            grid_sequence: gridSequence,
                            layer_id: layerId ?? grid.layer_id ?? file.layer_id ?? null,
                            layer_type: grid.layer_type,
                            year: file.year || null,
                            climate_scenario_id: file.climate_scenario_id || null,
                            adaptation_id: adaptationIdFromParam || null,
                        },
                    };
                })
                .catch((err) => {
                    console.error(`Error fetching GeoTIFF for ${file.source_file}:`, err);
                    if (!err.message.includes("No data available")) {
                        Swal.fire({
                            icon: "error",
                            title: "Error",
                            text: `Failed to load GeoTIFF for ${file.grid_sequence_title || "grid"}`,
                        });
                    }
                    geotiffPromiseCache.current.delete(cacheKey);
                    return null;
                });
            geotiffPromiseCache.current.set(cacheKey, promise);
            return promise;
        },
        [apiUrl, selectedCountryId, makeTiffCacheKey]
    );
    const fetchGeoTiffShared = useCallback(
        async (file, gridSequence, adaptationId, grid) => {
            if (!file || !file.exists) return null;
            const cacheKey = makeTiffCacheKey(file, gridSequence, adaptationId);
            if (geotiffPromiseCache.current.has(cacheKey)) {
                return geotiffPromiseCache.current.get(cacheKey);
            }
            const promise = fetchGeoTiff(file, gridSequence, adaptationId || grid.layer_id, grid);
            geotiffPromiseCache.current.set(cacheKey, promise);
            return promise;
        },
        [fetchGeoTiff, makeTiffCacheKey]
    );
    const fetchTiffs = useCallback(
        debounce(
            async (
                hazardData,
                geojsonData,
                countryId,
                commodityId,
                adaptationCropTabId,
                selectedAdaptations
            ) => {
                if (isFetchingRef.current || !hazardData?.raster_grids || !geojsonData) return;
                isFetchingRef.current = true;
                setIsLoading(true);
                setNoGeoTiffAvailable(new Array(8).fill(false));
                setTiffData([]);
                setRenderedMaps(new Array(8).fill(false));
                try {
                    const sortedGrids = [...hazardData.raster_grids]
                        .sort((a, b) => (a, b) => (a.grid_sequence || 0) - (b.grid_sequence || 0))
                        .slice(0, 7); // 0-6 → 7 maps
                    const tiffResults = [];
                    for (const grid of sortedGrids) {
                        const gridSeq = grid.grid_sequence;
                        const isBaselineGrid = gridSeq === 0;
                        const adaptationId = isBaselineGrid
                            ? undefined
                            : selectedAdaptations[gridSeq] || "";
                        let file = null;
                        // ---------- 1. Baseline (grid 0) ----------
                        if (isBaselineGrid) {
                            file = selectRasterFile(grid); // no adaptationId
                        }
                        // ---------- 2. Adaptation (grid 1-6) ----------
                        else {
                            const pickerRes = await fetchWithRetry(
                                `${apiUrl}/layers/tif_picker`,
                                {
                                    method: "POST",
                                    headers: { "Content-Type": "application/json" },
                                    body: JSON.stringify({
                                        analysis_scope_id: 1,
                                        visualization_scale_id: parseInt(selectedVisualizationScaleId) || 1,
                                        commodity_id: parseInt(commodityId),
                                        layer_type: "adaptation",
                                        adaptation_id: parseInt(adaptationId),
                                        adaptation_croptab_id: parseInt(adaptationCropTabId),
                                    }),
                                }
                            );
                            const pickerJson = await pickerRes.json();
                            if (pickerJson.success && pickerJson.data?.raster_files) {
                                file = selectRasterFile(pickerJson.data, adaptationId);
                            }
                        }
                        // ---------- 3. No file at all → mark as unavailable ----------
                        if (!file?.exists) {
                            setNoGeoTiffAvailable((prev) => {
                                const n = [...prev];
                                n[gridSeq] = true;
                                return n;
                            });
                            continue;
                        }
                        // ---------- 4. Fetch the GeoTIFF (shared cache) ----------
                        const tiff = await fetchGeoTiffShared(
                            { ...file, grid_sequence_title: grid.grid_sequence_title },
                            gridSeq,
                            adaptationId,
                            grid
                        );
                        if (!tiff?.arrayBuffer) {
                            setNoGeoTiffAvailable((prev) => {
                                const n = [...prev];
                                n[gridSeq] = true;
                                return n;
                            });
                            continue;
                        }
                        // share the same arrayBuffer with every grid that uses the same adaptation
                        const sharedMetadata = {
                            ...tiff.metadata,
                            grid_sequence: gridSeq,
                            layer_name: grid.grid_sequence_title || `Grid ${gridSeq}`,
                            layer_id: grid.layer_id,
                            layer_type: grid.layer_type,
                        };
                        tiffResults.push({
                            arrayBuffer: tiff.arrayBuffer.slice(0),
                            metadata: sharedMetadata,
                        });
                        setNoGeoTiffAvailable((prev) => {
                            const n = [...prev];
                            n[gridSeq] = false;
                            return n;
                        });
                    }
                    setTiffData(tiffResults);
                    setAllDataReady(true);
                } catch (e) {
                    console.error("fetchTiffs error:", e);
                    Swal.fire({ icon: "error", title: "Error", text: "Failed to load map data." });
                    setAllDataReady(true);
                } finally {
                    setIsLoading(false);
                    isFetchingRef.current = false;
                }
            },
            500
        ),
        [
            apiUrl,
            selectedVisualizationScaleId,
            selectRasterFile,
            fetchGeoTiffShared,
        ]
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
    const fetchAdaptations = useCallback(
        async (commodityId) => {
            if (!commodityId) {
                return [];
            }
            setIsOptionLoading(true);
            try {
                const data = await fetchData(`lkp/specific/adaptations?commodity_id=${commodityId}`);
                setAdaptations(data);
                const activeAdaptations = data.filter((a) => a.status);
                const newSelectedAdaptations = new Array(8).fill("");
                if (data.length > 0) {
                    for (let i = 1; i <= 6; i++) {
                        const adaptation = activeAdaptations[i - 1] || activeAdaptations[0] || { adaptation_id: "" };
                        newSelectedAdaptations[i] = adaptation.adaptation_id || "";
                    }
                }
                setSelectedAdaptations(newSelectedAdaptations);
                return newSelectedAdaptations; // Return the new selected adaptations
            } catch (err) {
                console.error("Error fetching adaptations:", err);
                setAdaptations([]);
                setSelectedAdaptations(new Array(8).fill(""));
                return new Array(8).fill("");
            } finally {
                setIsOptionLoading(false);
            }
        },
        [fetchData]
    );
    const setSelectedAdaptationsAsync = (updater) => {
        return new Promise((resolve) => {
            setSelectedAdaptations((prev) => {
                const newState = typeof updater === "function" ? updater(prev) : updater;
                resolve(newState);
                return newState;
            });
        });
    };
    const fetchHazardData = useCallback(
        debounce(async (commodityId, adaptationCropTabId) => {
            if (!commodityId || !adaptationCropTabId) {
                return;
            }
            isFetchingRef.current = true;
            setIsLoading(true);
            try {
                // Fetch adaptations
                const newSelectedAdaptations = await fetchAdaptations(commodityId);
                // Wait for React state update to complete
                await setSelectedAdaptationsAsync(newSelectedAdaptations);
                // ✅ Now state is guaranteed updated
                const admin_level = selectedCountryId !== 0 ? "country" : "total";
                const admin_level_id = selectedCountryId || null;
                const response = await fetchWithRetry(`${apiUrl}/layers/adaptations_glance`, {
                    method: "POST",
                    headers: { "Content-Type": "application/json" },
                    body: JSON.stringify({
                        commodity_id: commodityId,
                        adaptation_croptab_id: adaptationCropTabId,
                        admin_level,
                        admin_level_id,
                    }),
                });
                const { success, data } = await response.json();
                if (!success) throw new Error("API error: /layers/adaptations_glance");
                lastFetchKeyRef.current = null;
                setHazardData(data);
                // Trigger fetchTiffs with updated selectedAdaptations
                if (geojsonData) {
                    fetchTiffs(
                        data,
                        geojsonData,
                        selectedCountryId,
                        commodityId,
                        adaptationCropTabId,
                        newSelectedAdaptations // ← Use the fresh value
                    );
                }
            } catch (err) {
                console.error("Error fetching adaptations data:", err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || "Error loading adaptations data",
                });
                setHazardData(null);
            } finally {
                setIsLoading(false);
                isFetchingRef.current = false;
            }
        }, 500),
        [apiUrl, selectedCountryId, fetchAdaptations, geojsonData, fetchTiffs]
    );
    const handleDownloadGeoTIFF = useCallback((arrayBuffer, gridSequence) => {
        if (!arrayBuffer || arrayBuffer.byteLength === 0) {
            console.error("Cannot download GeoTIFF: arrayBuffer is empty or invalid", { gridSequence, byteLength: arrayBuffer?.byteLength });
            Swal.fire({
                icon: "error",
                title: "Download Failed",
                text: "No valid GeoTIFF data available to download.",
            });
            return;
        }
        try {
            const countryName = selectedCountryId === 0
                ? "SouthAsia"
                : countries.find((c) => c.country_id === selectedCountryId)?.country?.replace(/\s+/g, "") || "UnknownCountry";
            const commodityName = selectedCommodityId && commodities.length
                ? commodities.find((c) => c.commodity_id === selectedCommodityId)?.commodity?.replace(/\s+/g, "") || "UnknownCommodity"
                : "NoCommoditySelected";
            const scenario = selectedScenarioId && climateScenarios.length
                ? climateScenarios.find((s) => s.scenario_id === parseInt(selectedScenarioId))
                : null;
            const scenarioName = scenario
                ? scenario.scenario?.replace(/\s+/g, "") || "UnknownScenario"
                : "NoScenarioSelected";
            const scaleName = selectedVisualizationScaleId && visualizationScales.length
                ? visualizationScales.find((s) => s.scale_id === parseInt(selectedVisualizationScaleId))?.scale?.replace(/\s+/g, "") || "UnknownScale"
                : "NoScaleSelected";
            const intensityName = selectedIntensityMetricId === 1 ? "Intensity" : "IntensityFrequency";
            const changeName = selectedChangeMetricId === 1 ? "Absolute" : "Delta";
            const isBaseline = parseInt(selectedScenarioId) === 1;
            const year = isBaseline ? "" : (selectedYear || "UnknownYear");
            const adaptationCropTabName = selectedAdaptationCropTabId && adaptationCropTabs.length
                ? adaptationCropTabs.find((t) => t.tab_id === selectedAdaptationCropTabId)?.tab_name?.replace(/\s+/g, "") || "UnknownTab"
                : "NoTabSelected";
            let adaptationName;
            if (gridSequence === 0) {
                adaptationName = "Reference";
            } else {
                const adaptationId = selectedAdaptations[gridSequence];
                adaptationName = adaptationId && adaptations.length
                    ? adaptations.find((a) => a.adaptation_id === adaptationId)?.adaptation?.replace(/\s+/g, "") || "UnknownAdaptation"
                    : "NoAdaptation";
            }
            let file_name = `${countryName}_${commodityName}_${intensityName}_${changeName}_${scaleName}_${scenarioName}_${adaptationCropTabName}_${adaptationName}${year ? `_${year}` : ""}`;
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
    }, [selectedCountryId, selectedCommodityId, selectedScenarioId, selectedVisualizationScaleId, selectedIntensityMetricId, selectedChangeMetricId, selectedYear, selectedAdaptationCropTabId, selectedAdaptations, countries, commodities, climateScenarios, visualizationScales, adaptations, adaptationCropTabs]);
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
        setAllDataReady(false);
        setNoGeoTiffAvailable(new Array(8).fill(false));
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
    const updateGeoTiffLayer = useCallback(
        async (tiff, index) => {
            if (!mapInstances.current[index] || !mapRefs.current[index] || !tiff) {
                console.warn(`Skipping updateGeoTiffLayer for index ${index}: missing dependencies`, {
                    mapInstance: !!mapInstances.current[index],
                    mapRef: !!mapRefs.current[index],
                    tiff: !!tiff,
                });
                return;
            }
            const map = mapInstances.current[index];
            layerRefs.current[index].forEach((layer) => {
                if (layer && map.hasLayer(layer)) {
                    map.removeLayer(layer);
                }
            });
            layerRefs.current[index] = [];
            if (geojsonLayerRefs.current[index] && map.hasLayer(geojsonLayerRefs.current[index])) {
                map.removeLayer(geojsonLayerRefs.current[index]);
                geojsonLayerRefs.current[index] = null;
            }
            if (mapControlRefs.current[index]) {
                map.removeControl(mapControlRefs.current[index]);
                mapControlRefs.current[index] = null;
            }
            if (downloadControlRefs.current[index]) {
                map.removeControl(downloadControlRefs.current[index]);
                downloadControlRefs.current[index] = null;
            }
            controlsInitialized.current[index] = false;
            const { arrayBuffer, metadata } = tiff;
            const cacheKey = `${metadata.source_file}-${metadata.adaptation_id || "no-adaptation"}`;
            let georaster = georasterCache.current.get(cacheKey);
            if (!georaster) {
                try {
                    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
                        throw new Error(`Invalid arrayBuffer for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}`);
                    }
                    const arrayBufferCopy = arrayBuffer.slice(0);
                    georaster = await parseGeoraster(arrayBufferCopy, { useWorker: false });
                    georasterCache.current.set(cacheKey, georaster);
                } catch (err) {
                    console.error(`GeoRaster parsing error for map ${index}, grid_sequence: ${metadata.grid_sequence}, source_file: ${metadata.source_file}:`, err);
                    Swal.fire({
                        icon: "error",
                        title: "Error",
                        text: `Failed to parse GeoTIFF for map ${index} (${metadata.layer_name || "unknown"})`,
                    });
                    return;
                }
            }
            const geotiffLayer = new GeoRasterLayer({
                georaster,
                opacity: 0,
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
                    geotiffLayer.setOpacity(0.8);
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
                        onDownload: () => {
                            if (!allDataReady || !selectedCommodityId || !selectedScenarioId || !selectedVisualizationScaleId) {
                                console.warn("Download attempted before data is ready", {
                                    allDataReady,
                                    selectedCommodityId,
                                    selectedScenarioId,
                                    selectedVisualizationScaleId,
                                });
                                Swal.fire({
                                    icon: "warning",
                                    title: "Data Not Ready",
                                    text: "Please wait until all data is loaded before downloading.",
                                });
                                return;
                            }
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
                                    adaptation_id: tiffForDownload.metadata.adaptation_id,
                                });
                                Swal.fire({
                                    icon: "error",
                                    title: "Download Failed",
                                    text: `No valid GeoTIFF data available for ${tiffForDownload.metadata.layer_name || `map ${index}`}.`,
                                });
                                return;
                            }
                            handleDownloadGeoTIFF(tiffForDownload.arrayBuffer, gridSequence);
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
        [memoizedGeojsonData, isFullscreen, updateFullscreenButton, handleDownloadGeoTIFF, theme.palette.mode, tiffData]
    );
    const handleAdaptationChange = useCallback(
        async (gridSequence, adaptationId) => {
            const newSelectedAdaptations = [...selectedAdaptations];
            newSelectedAdaptations[gridSequence] = adaptationId;
            setSelectedAdaptations(newSelectedAdaptations);
            if (!memoizedHazardData || !memoizedGeojsonData) return;
            const grid = memoizedHazardData.raster_grids.find(g => g.grid_sequence === gridSequence);
            if (!grid) return;
            setIsLoading(true);
            try {
                const pickerRes = await fetchWithRetry(
                    `${apiUrl}/layers/tif_picker`,
                    {
                        method: "POST",
                        headers: { "Content-Type": "application/json" },
                        body: JSON.stringify({
                            analysis_scope_id: 1,
                            visualization_scale_id: parseInt(selectedVisualizationScaleId) || 1,
                            commodity_id: parseInt(selectedCommodityId),
                            layer_type: "adaptation",
                            adaptation_id: parseInt(adaptationId),
                            adaptation_croptab_id: parseInt(selectedAdaptationCropTabId),
                        }),
                    }
                );
                const pickerJson = await pickerRes.json();
                let file = null;
                if (pickerJson.success && pickerJson.data?.raster_files) {
                    file = selectRasterFile(pickerJson.data, adaptationId);
                }
                if (!file?.exists) {
                    setNoGeoTiffAvailable(prev => {
                        const newState = [...prev];
                        newState[gridSequence] = true;
                        return newState;
                    });
                    return;
                }
                const tiffResult = await fetchGeoTiffShared(
                    { ...file, grid_sequence_title: grid.grid_sequence_title },
                    gridSequence,
                    adaptationId,
                    grid
                );
                if (!tiffResult?.arrayBuffer) {
                    setNoGeoTiffAvailable(prev => {
                        const newState = [...prev];
                        newState[gridSequence] = true;
                        return newState;
                    });
                    return;
                }
                // Collect all grids to update
                const otherGrids = memoizedHazardData.raster_grids.filter(
                    g => g.grid_sequence !== gridSequence && newSelectedAdaptations[g.grid_sequence] === adaptationId
                );
                const gridsToUpdate = [grid, ...otherGrids];
                const updatedTiffs = gridsToUpdate.map(g => {
                    const metadata = {
                        ...tiffResult.metadata,
                        grid_sequence: g.grid_sequence,
                        layer_name: g.grid_sequence_title || `Grid ${g.grid_sequence}`,
                    };
                    return { arrayBuffer: tiffResult.arrayBuffer.slice(0), metadata };
                });
                // Update tiffData in one go
                setTiffData(prev => {
                    const gridsToUpdateSeq = gridsToUpdate.map(g => g.grid_sequence);
                    const filtered = prev.filter(t => !gridsToUpdateSeq.includes(t.metadata.grid_sequence));
                    return [...filtered, ...updatedTiffs].sort((a, b) => a.metadata.grid_sequence - b.metadata.grid_sequence);
                });
                // Update noGeoTiffAvailable and render maps
                setNoGeoTiffAvailable(prev => {
                    const newState = [...prev];
                    gridsToUpdate.forEach(g => {
                        newState[g.grid_sequence] = false;
                    });
                    return newState;
                });
                // Update layers
                gridsToUpdate.forEach(g => {
                    const updatedTiff = updatedTiffs.find(ut => ut.metadata.grid_sequence === g.grid_sequence);
                    updateGeoTiffLayer(updatedTiff, g.grid_sequence);
                });
                // Set rendered
                setRenderedMaps(prev => {
                    const newState = [...prev];
                    gridsToUpdate.forEach(g => {
                        newState[g.grid_sequence] = true;
                    });
                    return newState;
                });
            } catch (err) {
                console.error(err);
            } finally {
                setIsLoading(false);
            }
        },
        [memoizedHazardData, memoizedGeojsonData, updateGeoTiffLayer, fetchGeoTiffShared, selectRasterFile, selectedVisualizationScaleId, selectedCommodityId, selectedAdaptationCropTabId, apiUrl, selectedAdaptations]
    );
    useEffect(() => {
        if (!countries.length) {
            return;
        }

        let countryId = 7;                    // DEFAULT = Nepal
        let admin_level = "country";          // Always start at country level
        let admin_level_id = 7;
        let showSelect = true;
        if (country) {
            const countryName = country.toLowerCase().replace(/[-_]/g, " ");
            const matchedCountry = countries.find(
                (c) =>
                    c.country.toLowerCase().replace(/\s+/g, "") === countryName.replace(/\s+/g, "") && c.status
            );
            if (matchedCountry) {
                countryId = matchedCountry.country_id;
                admin_level = "country";
                admin_level_id = matchedCountry.country_id;
                showSelect = false;
            } else {
                console.warn(`Country "${country}" not found or inactive, defaulting to South Asia`);
                Swal.fire({
                    icon: "warning",
                    title: "Invalid Country",
                    text: `Country "${country}" not found or inactive. Defaulting to South Asia.`,
                });
            }
        }
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
        geotiffPromiseCache.current.clear();
        georasterCache.current.clear();
    }, [
        selectedCountryId,
        selectedCommodityId,
        selectedScenarioId,
        selectedVisualizationScaleId,
        selectedYear,
        selectedAdaptationCropTabId,
        // Do NOT clear on selectedAdaptations change
    ]);
    useEffect(() => {
        if (hasInitializedRef.current) return;
        hasInitializedRef.current = true;
        const initializeData = async () => {
            setIsLoading(true);
            try {
                const [fetchedCountries, fetchedCommodities, fetchedScenarios, fetchedScales, fetchedAdaptationCropTabs] = await Promise.all([
                    fetchData("lkp/locations/countries"),
                    fetchData("lkp/common/commodities"),
                    fetchData("lkp/common/climate_scenarios"),
                    fetchData("lkp/common/visualization_scales"),
                    fetchData("lkp/specific/adaptation_croptabs"),
                ]);
                setCountries(fetchedCountries);
                setCommodities(fetchedCommodities);
                setClimateScenarios(fetchedScenarios);
                setVisualizationScales(fetchedScales);
                setAdaptationCropTabs(fetchedAdaptationCropTabs);
                let commodityId = "";
                if (fetchedCommodities.length > 0) {
                    const activeCommodities = fetchedCommodities.filter((c) => c.status);
                    if (activeCommodities.length > 0) {
                        commodityId = activeCommodities[0]?.commodity_id;
                        setSelectedCommodityId(commodityId);
                        await fetchAdaptations(commodityId); // This now sets selectedAdaptations internally
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
                if (fetchedScenarios.length > 0 && !selectedScenarioId) {
                    const scenarioId = fetchedScenarios[0]?.scenario_id || "";
                    setSelectedScenarioId(scenarioId);
                }
                if (fetchedScales.length > 0 && !selectedVisualizationScaleId) {
                    const scaleId = fetchedScales[0]?.scale_id || "";
                    setSelectedVisualizationScaleId(scaleId);
                }
                if (fetchedAdaptationCropTabs.length > 0 && !selectedAdaptationCropTabId) {
                    const tabId = fetchedAdaptationCropTabs[0]?.tab_id || "";
                    setSelectedAdaptationCropTabId(tabId);
                }
                if (!country) {
                    fetchGeojson("country", 7);
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
    }, [fetchData, fetchGeojson, fetchAdaptations, country]);
    useEffect(() => {
        if (!hasInitializedRef.current || !selectedCommodityId || !selectedAdaptationCropTabId) {
            return;
        }
        fetchHazardData(selectedCommodityId, selectedAdaptationCropTabId);
    }, [selectedCommodityId, selectedAdaptationCropTabId, fetchHazardData]);
    useEffect(() => {
        if (!memoizedHazardData || !memoizedHazardData.raster_grids || !memoizedGeojsonData) {
            return;
        }
        const fetchKey = `${selectedCountryId}-${selectedCommodityId}-${selectedScenarioId}-${selectedVisualizationScaleId}-${selectedIntensityMetricId}-${selectedChangeMetricId}-${selectedAdaptationCropTabId}-${selectedYear}`;
        if (lastFetchKeyRef.current === fetchKey) {
            return;
        }
        setTiffData([]);
        setRenderedMaps(new Array(8).fill(false));
        setNoGeoTiffAvailable(new Array(8).fill(false));
        geotiffPromiseCache.current.clear();
        georasterCache.current.clear();
        fetchTiffs(
            memoizedHazardData,
            memoizedGeojsonData,
            selectedCountryId,
            selectedCommodityId,
            selectedAdaptationCropTabId,
            selectedAdaptations
        );
        lastFetchKeyRef.current = fetchKey;
        return () => {
            fetchTiffs.cancel();
        };
    }, [
        memoizedHazardData,
        memoizedGeojsonData,
        selectedCountryId,
        selectedCommodityId,
        selectedAdaptationCropTabId,
        selectedScenarioId,
        selectedVisualizationScaleId,
        selectedIntensityMetricId,
        selectedChangeMetricId,
        selectedYear,
        selectedAdaptations,
        fetchTiffs,
    ]);
    const renderMaps = useCallback(() => {
        if (!allDataReady) {
            return;
        }
        const sortedGrids = memoizedHazardData?.raster_grids
            ? [...memoizedHazardData.raster_grids].sort((a, b) => (a.grid_sequence || 0) - (b.grid_sequence || 0))
            : [];
        sortedGrids.slice(0, 7).forEach((grid) => {
            const gridSequence = grid.grid_sequence;
            const mapIndex = gridSequence === 0 ? 0 : gridSequence;
            const tiff = tiffData.find((t) => t.metadata.grid_sequence === gridSequence);
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
                geojsonLayerRefs.current[mapIndex] = geojsonLayer;
                if (memoizedGeojsonData.bbox) {
                    map.fitBounds([
                        [memoizedGeojsonData.bbox[1], memoizedGeojsonData.bbox[0]],
                        [memoizedGeojsonData.bbox[3], memoizedGeojsonData.bbox[2]],
                    ]);
                }
            }
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
                            console.warn(`Error processing geometry for feature in map ${mapIndex}:`, e);
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
                        console.error(`Error creating mask polygon for map ${mapIndex}:`, e);
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
                layerRefs.current[mapIndex].push(maskPolygon);
            }
            setTimeout(() => {
                if (mapInstances.current[mapIndex]) {
                    mapInstances.current[mapIndex].invalidateSize();
                }
            }, 100);
        });
        tiffData.forEach((tiff) => {
            const gridSequence = tiff.metadata.grid_sequence;
            const mapIndex = gridSequence === 0 ? 0 : gridSequence;
            if (mapRefs.current[mapIndex] && mapInstances.current[mapIndex]) {
                updateGeoTiffLayer(tiff, mapIndex);
            } else {
                console.warn(`Map ref or instance missing for grid_sequence: ${gridSequence}, map index: ${mapIndex}`);
            }
        });
    }, [allDataReady, tiffData, updateGeoTiffLayer, memoizedGeojsonData, theme.palette.mode]);
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
            // Remove fetchHazardData call; let useEffect handle it
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
    const handleSelectedYear = useCallback(
        (event) => {
            const year = event.target.value;
            if (+year === +selectedYear) {
                return;
            }
            setSelectedYear(+year);
            cleanupMaps();
        },
        [selectedYear, cleanupMaps]
    );
    const handleAdaptationCropTabChange = useCallback(
        (event) => {
            const tabId = event.target.value;
            if (tabId === selectedAdaptationCropTabId) {
                return;
            }
            setSelectedAdaptationCropTabId(tabId);
            cleanupMaps();
            // Remove fetchHazardData call; let useEffect handle it
        },
        [selectedAdaptationCropTabId, cleanupMaps]
    );
    useEffect(() => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";
    }, []);
    const box1 = React.useRef(null);
    const canShowLegend = useCallback((tiff, gridSequence) => {
        if (!tiff?.metadata) return false;
        const isBaseline = parseInt(selectedScenarioId) === 1;
        const hasYear = !!selectedYear;
        // Baseline → year not required
        if (isBaseline) return true;
        // Future scenario → year must be selected
        return hasYear;
    }, [selectedScenarioId, selectedYear]);
    const mainTiff = tiffData.find(t => t.metadata.grid_sequence === 0);
    const showMainLegend = mainTiff && renderedMaps[0] && !noGeoTiffAvailable[0] && canShowLegend(mainTiff, 0);
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
                                Adaptations at a Glance
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
                            <Box
                                sx={{
                                    display: "flex",
                                    alignItems: "center",
                                    gap: 0.625,
                                    flex: 1,
                                    marginRight: "5px",
                                    overflow: "hidden",
                                    flexWrap: "nowrap",
                                    minWidth: 'auto',
                                    fontFamily: "Poppins",
                                }}
                            >
                                <Typography sx={{ fontSize: 13, fontWeight: "500", whiteSpace: "nowrap", fontFamily: "Poppins", }}>
                                    Location:
                                </Typography>
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
                                        <Typography
                                            variant="body1"
                                            sx={{
                                                fontSize: "12px",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis",
                                                whiteSpace: "nowrap",
                                                fontFamily: "Poppins",
                                            }}
                                        >
                                            {countries.find((c) => c.country_id === selectedCountryId)?.country ||
                                                "South Asia"}
                                        </Typography>
                                    )}
                                </FormControl>
                            </Box>
                            {/* Commodity Box */}
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
                                            fontFamily: "Poppins",
                                            backgroundColor:
                                                theme.palette.mode === "dark"
                                                    ? "rgba(60, 75, 60, 1)"
                                                    : "rgba(235, 247, 233, 1)",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis",
                                            whiteSpace: "nowrap",
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
                                                        fontWeight: "500",
                                                        fontFamily: "Poppins",
                                                        backgroundColor: (theme) =>
                                                            theme.palette.mode === "dark" ? "#4a4a4a" : "#e0e0e0",
                                                        paddingY: "2px",
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
                        <Box sx={(theme) => ({
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
                        })}>
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
                                overflow: "hidden",
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
                                        {visualizationScales.length === 0 ? (
                                            <MenuItem value="" sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                No scales available
                                            </MenuItem>
                                        ) : (
                                            visualizationScales.map((scale) => (
                                                <MenuItem
                                                    key={scale.scale_id}
                                                    value={scale.scale_id}
                                                    disabled={!scale.status}
                                                    sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}
                                                >
                                                    {scale.scale}
                                                </MenuItem>
                                            ))
                                        )}
                                    </Select>
                                </FormControl>
                            </Box>
                        </Box>
                        <Box sx={(theme) => ({
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
                                overflow: "hidden",
                                minWidth: 'auto',
                                fontFamily: "Poppins",
                            }}>
                                {parseInt(selectedScenarioId) !== 1 && (
                                    <Box sx={{
                                        display: "flex",
                                        alignItems: "center",
                                        gap: 0.625,
                                        flex: 1,
                                        marginRight: "5px",
                                        overflow: "hidden",
                                        flexWrap: "nowrap",
                                        overflow: "hidden",
                                        minWidth: 'auto',
                                        fontFamily: "Poppins",
                                    }}>
                                        <Typography sx={{ fontSize: 13, fontWeight: "500", fontFamily: "Poppins", }}>Year: </Typography>
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
                                                <MenuItem value={2050} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins",  }}>
                                                    2050
                                                </MenuItem>
                                                <MenuItem value={2080} sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                    2080
                                                </MenuItem>
                                            </Select>
                                        </FormControl>
                                    </Box>
                                )}
                                <Box sx={(theme) => ({
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
                                        justifyContent: "center",
                                        gap: 0.625,
                                        flex: 1,
                                        overflow: "hidden",
                                        flexWrap: "nowrap",
                                        minWidth: 'auto',
                                        fontFamily: "Poppins",
                                    }}>
                                        <Typography sx={{ display: 'flex', fontSize: 13, fontWeight: "500", flexWrap: 'nowrap', fontFamily:'Poppins' }}>Indicator: </Typography>
                                        <FormControl fullWidth>
                                            <Select
                                                disableUnderline
                                                variant="standard"
                                                value={selectedAdaptationCropTabId}
                                                onChange={handleAdaptationCropTabChange}
                                                displayEmpty
                                                inputProps={{ "aria-label": "Adaptation Crop Tabs" }}
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
                                                disabled={isLoading || isOptionLoading || adaptationCropTabs.length === 0}
                                            >
                                                {adaptationCropTabs.length === 0 ? (
                                                    <MenuItem value="" sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                        No tabs available
                                                    </MenuItem>
                                                ) : (
                                                    adaptationCropTabs.map((tab) => (
                                                        <MenuItem
                                                            key={tab.tab_id}
                                                            value={tab.tab_id}
                                                            disabled={!tab.status}
                                                            sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}
                                                        >
                                                            {tab.tab_name}
                                                        </MenuItem>
                                                    ))
                                                )}
                                            </Select>
                                        </FormControl>
                                    </Box>
                                </Box>
                            </Box>
                        </Box>
                        <Box sx={{ position: "relative" }}>
                            <div
                                ref={(el) => (mapRefs.current[0] = el)}
                                className="map-container"
                                style={{ height: "calc(-204px + 100vh)", width: "100%" }}
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
                            {noGeoTiffAvailable[0] && !isLoading && (
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
                            )}
                            {tiffData.find((tiff) => tiff.metadata.grid_sequence === 0) && renderedMaps[0] && !noGeoTiffAvailable[0] && (
                                <>
                                    {console.log({ tiffData })}
                                    <MapLegend
                                        key={`${tiffData.find((tiff) => tiff.metadata.grid_sequence === 0).metadata.source_file}-${tiffData.find((tiff) => tiff.metadata.grid_sequence === 0).metadata.adaptation_id || "no-adaptation"}`}
                                        tiff={tiffData.find((tiff) => tiff.metadata.grid_sequence === 0)}
                                        breadcrumbData={breadcrumbData}
                                        layerType={tiffData.find((tiff) => tiff.metadata.grid_sequence === 0).metadata?.layer_type || "impact"}
                                        apiUrl={apiUrl}
                                        mapWidth={mapWidths.current[0]}
                                        sourceFile={tiffData.find((tiff) => tiff.metadata.grid_sequence === 0)?.metadata.source_file}
                                        legendType="Large"
                                    />
                                </>
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
                                    <Paper elevation={1} sx={{ borderRadius: 1 }}>
                                        <Box sx={{ display: "flex", alignItems: "center", justifyContent: "center", padding: "3px 8px" }}>
                                            <Typography
                                                sx={{
                                                    fontSize: 14,
                                                    fontWeight: "500",
                                                    fontFamily: "Poppins",
                                                }}
                                            >
                                                {grid?.grid_sequence_title || "Adaptation"}:&nbsp;
                                            </Typography>
                                            <FormControl sx={{ minWidth: "150px" }}>
                                                <Select
                                                    disableUnderline
                                                    variant="standard"
                                                    value={selectedAdaptations[gridSequence] || ""}
                                                    onChange={(e) => handleAdaptationChange(gridSequence, e.target.value)}
                                                    displayEmpty
                                                    inputProps={{ "aria-label": "Adaptation" }}
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
                                                    disabled={isLoading || isOptionLoading || adaptations.length === 0}
                                                >
                                                    {adaptations.length === 0 ? (
                                                        <MenuItem value="" sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}>
                                                            No adaptations available
                                                        </MenuItem>
                                                    ) : (
                                                        adaptations.map((adaptation) => (
                                                            <MenuItem
                                                                key={adaptation.adaptation_id}
                                                                value={adaptation.adaptation_id}
                                                                disabled={!adaptation.status}
                                                                sx={{ fontSize: "12px", paddingY: "2px", fontFamily: "Poppins", }}
                                                            >
                                                                {adaptation.adaptation}
                                                            </MenuItem>
                                                        ))
                                                    )}
                                                </Select>
                                            </FormControl>
                                        </Box>
                                        <Box sx={{ position: "relative" }}>
                                            <div
                                                ref={(el) => (mapRefs.current[gridSequence] = el)}
                                                className="map-container"
                                                style={{ height: "calc(-82px + 50vh)", width: "100%" }}
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
                                            {noGeoTiffAvailable[gridSequence] && !isLoading && (
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
                                            )}
                                            {tiff && renderedMaps[gridSequence] && !noGeoTiffAvailable[gridSequence] && (
                                                // In the return statement of DataGlance, for each MapLegend
                                                <MapLegend
                                                    key={`${tiff?.metadata?.source_file}-${tiff?.metadata?.grid_sequence}-${tiff?.metadata?.adaptation_id || "no-adaptation"}-${selectedScenarioId}-${selectedYear}-${selectedVisualizationScaleId}-${selectedIntensityMetricId}-${selectedChangeMetricId}`}
                                                    tiff={tiff}
                                                    breadcrumbData={breadcrumbData}
                                                    layerType={grid?.layer_type || "adaptation"}
                                                    apiUrl={apiUrl}
                                                    mapWidth={mapWidths.current[gridSequence]}
                                                    sourceFile={tiff?.metadata?.source_file}
                                                    showHeader={false}
                                                    padding="2px"
                                                    glance={true}
                                                    hazards={true}
                                                    legendType="Small"
                                                />
                                            )}
                                        </Box>
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