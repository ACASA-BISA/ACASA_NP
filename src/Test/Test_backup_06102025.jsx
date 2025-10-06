import React, { useState, useEffect, useCallback } from "react";
import { useParams } from "react-router-dom";
import { Button, Grid, Toolbar, IconButton, Drawer, Switch, Typography, FormGroup, List, Box, Tooltip, ListItemButton, ListItemIcon, ListItemText, Collapse, FormControlLabel, FormControl, FormLabel, MenuItem, Select, ListSubheader } from "@mui/material";
import { ExpandLess, ExpandMore, InfoOutlined as InfoIcon, ArrowDropDown as ArrowDropDownIcon } from "@mui/icons-material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import Swal from "sweetalert2";
import MapViewer from "./MapViewer";

const drawerWidth = 254;

function Test() {
    useEffect(() => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";
    }, []);

    const { country } = useParams();
    const [open, setOpen] = useState(true);
    const [countries, setCountries] = useState([]);
    const [selectedCountryId, setSelectedCountryId] = useState(0);
    const [showCountrySelect, setShowCountrySelect] = useState(true);
    const [states, setStates] = useState([]);
    const [selectedStateId, setSelectedStateId] = useState(0);
    const [disabledStateFilter, setDisableStateFilter] = useState(true);
    const [commodityTypes, setCommodityTypes] = useState([]);
    const [selectedCommodityTypeId, setSelectedCommodityTypeId] = useState(1); // Default to Crops
    const [commodities, setCommodities] = useState([]);
    const [filteredCommodities, setFilteredCommodities] = useState([]);
    const [selectedCommodityId, setSelectedCommodityId] = useState("");
    const [analysisScopes, setAnalysisScopes] = useState([]);
    const [selectedScopeId, setSelectedScopeId] = useState("");
    const [visualizationScales, setVisualizationScales] = useState([]);
    const [selectedScaleId, setSelectedScaleId] = useState("");
    const [climateScenarios, setClimateScenarios] = useState([]);
    const [selectedScenarioId, setSelectedScenarioId] = useState("");
    const [dataSources, setDataSources] = useState([]);
    const [selectedDataSourceId, setSelectedDataSourceId] = useState("");
    const [risks, setRisks] = useState([]);
    const [selectedRiskId, setSelectedRiskId] = useState("");
    const [impacts, setImpacts] = useState([]);
    const [selectedImpactId, setSelectedImpactId] = useState("");
    const [adaptations, setAdaptations] = useState([]);
    const [selectedAdaptationId, setSelectedAdaptationId] = useState("");
    const [appliedFilters, setAppliedFilters] = useState(null);
    const [geojsonData, setGeojsonData] = useState(null);
    const [isSidebarOpen, setIsSidebarOpen] = useState({
        region: true,
        dataType: false,
        analysis: false,
        commodity: false,
        scenario: false,
        risk: false,
        impact: false,
        adaptation: false,
    });
    const [isLoading, setIsLoading] = useState(false);
    const [mapLoading, setMapLoading] = useState(false);

    const apiUrl = process.env.REACT_APP_API_URL;

    const toggleDrawer = () => {
        setOpen((prevOpen) => {
            const newOpen = !prevOpen;
            if (!newOpen) {
                setIsSidebarOpen({
                    region: false,
                    dataType: false,
                    analysis: false,
                    commodity: false,
                    scenario: false,
                    risk: false,
                    impact: false,
                    adaptation: false,
                });
            }
            return newOpen;
        });
    };

    const handleSidebarToggle = (sidebar) => {
        setOpen(true);
        setIsSidebarOpen((prev) => {
            const newState = {
                region: false,
                dataType: false,
                analysis: false,
                commodity: false,
                scenario: false,
                risk: false,
                impact: false,
                adaptation: false,
            };
            newState[sidebar] = !prev[sidebar];
            return newState;
        });
    };

    const fetchData = useCallback(
        async (endpoint, setter, params = "") => {
            setIsLoading(true);
            try {
                const response = await fetch(`${apiUrl}/${endpoint}${params}`, {
                    method: "GET",
                    headers: { "Content-Type": "application/json" },
                });
                if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
                const { success, data } = await response.json();
                if (!success) throw new Error(`API error: ${endpoint}`);
                setter(data || []);
            } catch (err) {
                console.error(err);
                Swal.fire({
                    icon: "error",
                    title: "Error",
                    text: err.message || `Error loading ${endpoint}`,
                });
                setter([]);
            } finally {
                setIsLoading(false);
            }
        },
        [apiUrl]
    );

    const fetchGeojson = useCallback(
        async (admin_level, admin_level_id) => {
            setIsLoading(true);
            try {
                const geojsonRes = await fetch(`${apiUrl}/layers/geojson`, {
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
            }
        },
        [apiUrl]
    );

    useEffect(() => {
        fetchData("lkp/locations/countries", setCountries);
        fetchData("lkp/common/commodity_types", setCommodityTypes);
        fetchData("lkp/common/commodities", setCommodities);
        fetchData("lkp/common/analysis_scopes", setAnalysisScopes);
        fetchData("lkp/common/visualization_scales", setVisualizationScales);
        fetchData("lkp/common/climate_scenarios", setClimateScenarios);
        fetchData("lkp/common/data_sources", setDataSources);
        fetchData("lkp/specific/impacts", setImpacts);
    }, [fetchData]);

    useEffect(() => {
        if (selectedCommodityId) {
            fetchData(
                `lkp/specific/adaptations?commodity_id=${selectedCommodityId}&commodity_type_id=1`,
                setAdaptations
            );
            fetchData(`lkp/specific/risks?commodity_id=${selectedCommodityId}`, setRisks);
        } else {
            setAdaptations([]);
            setSelectedAdaptationId("");
            setRisks([]);
            setSelectedRiskId("");
            setSelectedImpactId("");
        }
    }, [selectedCommodityId, selectedCommodityTypeId, fetchData]);

    useEffect(() => {
        if (countries.length > 0) {
            let countryId = 0;
            let admin_level = "total";
            let admin_level_id = null;
            let showSelect = true;

            if (country) {
                const countryName = country.toLowerCase().replace(/[-_]/g, " ");
                const matchedCountry = countries.find(
                    (c) =>
                        c.country.toLowerCase().replace(/\s+/g, "") ===
                        countryName.replace(/\s+/g, "") && c.status
                );
                if (matchedCountry) {
                    countryId = matchedCountry.country_id;
                    admin_level = "country";
                    admin_level_id = matchedCountry.country_id;
                    setSelectedCountryId(countryId);
                    getStates(countryId);
                    setDisableStateFilter(false);
                    showSelect = false;
                } else {
                    Swal.fire({
                        icon: "warning",
                        title: "Invalid Country",
                        text: `Country "${country}" not found or inactive. Defaulting to South Asia.`,
                    });
                    setSelectedCountryId(0);
                    setDisableStateFilter(true);
                    setStates([]);
                    showSelect = true;
                }
            } else {
                setSelectedCountryId(0);
                setDisableStateFilter(false);
            }
            setShowCountrySelect(showSelect);
            fetchGeojson(admin_level, admin_level_id);
        }
    }, [countries, country, fetchGeojson]);

    useEffect(() => {
        if (commodityTypes.length > 0 && !selectedCommodityTypeId) {
            setSelectedCommodityTypeId(commodityTypes[0].commodity_type_id);
        }
    }, [commodityTypes, selectedCommodityTypeId]);

    useEffect(() => {
        if (analysisScopes.length > 0 && !selectedScopeId) {
            setSelectedScopeId(analysisScopes[0].scope_id);
        }
    }, [analysisScopes, selectedScopeId]);

    useEffect(() => {
        if (visualizationScales.length > 0 && !selectedScaleId) {
            setSelectedScaleId(visualizationScales[0].scale_id);
        }
    }, [visualizationScales, selectedScaleId]);

    useEffect(() => {
        if (dataSources.length > 0 && !selectedDataSourceId) {
            setSelectedDataSourceId(dataSources[0].data_source_id);
        }
    }, [dataSources, selectedDataSourceId]);

    useEffect(() => {
        if (climateScenarios.length > 0 && !selectedScenarioId) {
            setSelectedScenarioId(climateScenarios[climateScenarios.length - 1].scenario_id);
        }
    }, [climateScenarios, selectedScenarioId]);

    useEffect(() => {
        if (commodities.length > 0) {
            const groupOrder = [];
            const groupedCommodities = commodities.reduce((acc, commodity) => {
                if (!acc[commodity.commodity_group]) {
                    acc[commodity.commodity_group] = { name: commodity.commodity_group, items: [] };
                    groupOrder.push(commodity.commodity_group);
                }
                acc[commodity.commodity_group].items.push(commodity);
                return acc;
            }, {});

            Object.values(groupedCommodities).forEach((group) => {
                group.items.sort((a, b) => a.commodity_id - b.commodity_id);
            });

            const filtered = groupOrder
                .map((groupName) => groupedCommodities[groupName])
                .flatMap((group) =>
                    group.items.filter((commodity) =>
                        selectedCommodityTypeId ? commodity.commodity_type_id === selectedCommodityTypeId : true
                    )
                );

            setFilteredCommodities(filtered);

            if (filtered.length > 0 && (!selectedCommodityId || !filtered.some((c) => c.commodity_id === selectedCommodityId))) {
                let index = +selectedCommodityTypeId === 1 ? 1 : 0;
                setSelectedCommodityId(filtered[index]?.commodity_id || "");
            }
        }
    }, [selectedCommodityTypeId, commodities, selectedCommodityId]);

    const areMandatoryFiltersSelected = () => {
        return (
            selectedScopeId &&
            selectedScaleId &&
            selectedDataSourceId &&
            selectedScenarioId &&
            selectedCommodityId &&
            geojsonData &&
            !isLoading &&
            countries.length > 0 &&
            commodityTypes.length > 0 &&
            commodities.length > 0 &&
            analysisScopes.length > 0 &&
            visualizationScales.length > 0 &&
            climateScenarios.length > 0 &&
            dataSources.length > 0 &&
            impacts.length > 0
        );
    };

    const updateFilters = useCallback(() => {
        if (!areMandatoryFiltersSelected()) {
            console.warn("Required data not fully loaded, skipping filter update.");
            return;
        }

        if (!selectedCommodityId) {
            Swal.fire({
                icon: "error",
                title: "Missing Commodity",
                text: "Please select a commodity before applying filters.",
            });
            return;
        }

        // Ensure mutual exclusivity
        const selections = [selectedRiskId, selectedImpactId, selectedAdaptationId].filter(Boolean);
        if (selections.length > 1) {
            console.warn("Mutual exclusivity violation detected:", {
                selectedRiskId,
                selectedImpactId,
                selectedAdaptationId,
            });
            // Reset all selections to enforce commodity layer
            setSelectedRiskId("");
            setSelectedImpactId("");
            setSelectedAdaptationId("");
            return;
        }

        let layer_type = "commodity";
        let risk_id = null;
        let impact_id = null;
        let adaptation_id = null;

        if (selectedRiskId) {
            layer_type = "risk";
            risk_id = selectedRiskId;
        } else if (selectedImpactId) {
            layer_type = "impact";
            impact_id = selectedImpactId;
        } else if (selectedAdaptationId) {
            layer_type = "adaptation";
            adaptation_id = selectedAdaptationId;
        }

        const admin_level = selectedStateId !== 0 ? "state" : selectedCountryId !== 0 ? "country" : "total";
        const admin_level_id = selectedStateId !== 0 ? selectedStateId : selectedCountryId !== 0 ? selectedCountryId : null;

        const newFilters = {
            analysis_scope_id: selectedScopeId || null,
            visualization_scale_id: selectedScaleId || null,
            commodity_id: selectedCommodityId || null,
            commodity_type_id: selectedCommodityTypeId || null,
            data_source_id: selectedDataSourceId || null,
            climate_scenario_id: selectedScenarioId || null,
            layer_type,
            risk_id,
            impact_id,
            adaptation_id,
            admin_level,
            admin_level_id,
            geojson: geojsonData?.geojson,
            bbox: geojsonData?.bbox,
            region: geojsonData?.region,
            countries: countries || [],
            commodityTypes: commodityTypes || [],
            commodities: commodities || [],
            analysisScopes: analysisScopes || [],
            visualizationScales: visualizationScales || [],
            climateScenarios: climateScenarios || [],
            dataSources: dataSources || [],
            impacts: impacts || [],
            adaptations: adaptations || [],
            states: states || [],
            risks: risks || [],
            country_id: selectedCountryId,
            state_id: selectedStateId,
        };

        setAppliedFilters(newFilters);
    }, [
        selectedScopeId,
        selectedScaleId,
        selectedDataSourceId,
        selectedScenarioId,
        selectedCountryId,
        selectedStateId,
        selectedCommodityTypeId,
        selectedCommodityId,
        selectedRiskId,
        selectedImpactId,
        selectedAdaptationId,
        geojsonData,
        isLoading,
        countries,
        commodityTypes,
        commodities,
        analysisScopes,
        visualizationScales,
        climateScenarios,
        dataSources,
        impacts,
        adaptations,
        states,
        risks,
    ]);

    useEffect(() => {
        if (areMandatoryFiltersSelected() && !isLoading) {
            updateFilters();
        }
    }, [
        selectedScopeId,
        selectedScaleId,
        selectedDataSourceId,
        selectedScenarioId,
        selectedCountryId,
        selectedStateId,
        selectedCommodityTypeId,
        selectedCommodityId,
        selectedRiskId,
        selectedImpactId,
        selectedAdaptationId,
        geojsonData,
        isLoading,
        updateFilters,
    ]);

    const getStates = async (countryId) => {
        setIsLoading(true);
        try {
            const response = await fetch(`${apiUrl}/lkp/locations/states?country_id=${countryId}`, {
                method: "GET",
                headers: { "Content-Type": "application/json" },
            });
            if (!response.ok) throw new Error(`HTTP error! Status: ${response.status}`);
            const { success, data } = await response.json();
            if (!success) throw new Error("Error loading states");
            setStates(data || []);
        } catch (err) {
            console.error(err);
            Swal.fire({
                icon: "error",
                title: "Error",
                text: err.message || "Error loading states",
            });
            setStates([]);
        } finally {
            setIsLoading(false);
        }
    };

    const handleCountryChange = (event) => {
        const countryId = event.target.value;
        setSelectedCountryId(countryId);
        setSelectedStateId(0);
        if (countryId !== 0) {
            getStates(countryId);
            setDisableStateFilter(false);
            fetchGeojson("country", countryId);
        } else {
            setStates([]);
            setDisableStateFilter(true);
            fetchGeojson("total", null);
        }
    };

    const handleStateChange = (event) => {
        const stateId = event.target.value;
        setSelectedStateId(stateId);
        if (stateId !== 0) {
            fetchGeojson("state", stateId);
        } else {
            fetchGeojson("country", selectedCountryId);
        }
    };

    const handleCommodityTypeChange = (event) => {
        const newCommodityTypeId = event.target.value;
        setSelectedCommodityTypeId(newCommodityTypeId);
        setSelectedCommodityId("");
        setSelectedRiskId("");
        setSelectedImpactId("");
        setSelectedAdaptationId("");
    };

    const handleCommodityChange = (event) => {
        const newCommodityId = event.target.value;
        setSelectedCommodityId(newCommodityId);
        setSelectedRiskId("");
        setSelectedImpactId("");
        setSelectedAdaptationId("");
    };

    const handleScopeChange = (event) => {
        setSelectedScopeId(event.target.value);
    };

    const handleScaleChange = (event) => {
        setSelectedScaleId(event.target.value);
    };

    const handleScenarioChange = (event) => {
        setSelectedScenarioId(event.target.value);
    };

    const handleDataSourceChange = (event) => {
        setSelectedDataSourceId(event.target.value);
    };

    const handleRiskChange = (riskId) => {
        setSelectedRiskId(prev => prev === riskId ? "" : riskId);
        setSelectedImpactId("");
        setSelectedAdaptationId("");
    };

    const handleImpactChange = (impactId) => {
        setSelectedImpactId(prev => prev === impactId ? "" : impactId);
        setSelectedRiskId("");
        setSelectedAdaptationId("");
    };

    const handleAdaptationChange = (adaptationId) => {
        setSelectedAdaptationId(prev => prev === adaptationId ? "" : adaptationId);
        setSelectedRiskId("");
        setSelectedImpactId("");
    };

    const groupedRisks = risks.reduce((acc, risk) => {
        if (risk.status === true) {
            if (risk.ipcc_id && risk.ipcc) {
                if (!acc[risk.ipcc_id]) acc[risk.ipcc_id] = { name: risk.ipcc, items: [] };
                acc[risk.ipcc_id].items.push(risk);
            } else {
                acc[risk.risk_id] = { name: risk.risk, items: [risk] };
            }
        }
        return acc;
    }, {});

    Object.values(groupedRisks).forEach((group) => {
        group.items.sort((a, b) => a.risk_id - b.risk_id);
    });

    const sortedGroupedRisks = Object.keys(groupedRisks)
        .sort((a, b) => parseInt(a) - parseInt(b))
        .reduce((acc, key) => {
            acc[key] = groupedRisks[key];
            return acc;
        }, {});

    const groupedAdaptations = [];
    let currentGroup = null;
    let currentItems = []; adaptations.forEach((adaptation, index) => {
        const isLast = index === adaptations.length - 1;
        const groupId = adaptation.group_id;
        const groupName = adaptation.group || adaptation.adaptation;

        if (groupId === null) {
            if (currentGroup !== null) {
                groupedAdaptations.push({ groupId: currentGroup.groupId, name: currentGroup.name, items: currentItems });
                currentItems = [];
            }
            groupedAdaptations.push({
                groupId: adaptation.adaptation_id,
                name: adaptation.adaptation,
                items: [adaptation],
            });
            currentGroup = null;
        } else {
            if (currentGroup === null || currentGroup.groupId !== groupId) {
                if (currentGroup !== null) {
                    groupedAdaptations.push({ groupId: currentGroup.groupId, name: currentGroup.name, items: currentItems });
                    currentItems = [];
                }
                currentGroup = { groupId, name: groupName };
                currentItems.push(adaptation);
            } else {
                currentItems.push(adaptation);
            }
        }

        if (isLast && currentGroup !== null) {
            groupedAdaptations.push({ groupId: currentGroup.groupId, name: currentGroup.name, items: currentItems });
        }
    });

    const getListItemStyle = (category) => ({
        backgroundColor:
            (category === "risk" && selectedRiskId) ||
                (category === "impact" && selectedImpactId) ||
                (category === "adaptation" && selectedAdaptationId)
                ? "#e3f2fd"
                : "inherit",
    });

    return (
        <div>
            <Box sx={{ display: "flex", marginTop: "86px" }}>
                <Drawer
                    variant="permanent"
                    open={open}
                    sx={{
                        width: open ? drawerWidth : 50,
                        flexShrink: 0,
                        "& .MuiDrawer-paper": {
                            width: open ? drawerWidth : 50,
                            transition: "width 0.3s",
                            overflowX: "hidden",
                            overflowY: "hidden",
                        },
                    }}
                >
                    <Toolbar />
                    <List style={{ marginTop: "14px" }}>
                        <Box sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
                            <Box>
                                <IconButton
                                    color="inherit"
                                    edge="start"
                                    onClick={toggleDrawer}
                                    sx={{ ml: 2 }}
                                >
                                    {open ? <ChevronLeftIcon /> : <ChevronRightIcon />}
                                </IconButton>
                            </Box>
                        </Box>
                        <div
                            className="card"
                            style={{
                                height: "72.4vh",
                                overflowY: "scroll",
                                overflowX: "hidden",
                                border: "0px",
                                scrollbarWidth: "none",
                            }}
                        >
                            <div className="card-body p-0">
                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("region")}
                                        disabled={isLoading || mapLoading}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/location.svg" alt="" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormLabel style={{ textAlign: "left" }} className="formLabel">Region</FormLabel>}
                                        />
                                        {isSidebarOpen.region ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.region} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding>
                                            <div className="card w-100 bg-transparent border-0 text-start">
                                                <div className="card-body">
                                                    <FormControl style={{ textAlign: "left" }}>
                                                        {showCountrySelect ? (
                                                            <>
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
                                                                        fontSize: "13px",
                                                                        height: "26px",
                                                                        backgroundColor:
                                                                            theme.palette.mode === "dark"
                                                                                ? "rgba(60, 75, 60, 1)"
                                                                                : "rgba(235, 247, 233, 1)",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                        margin: "10px 20px",
                                                                        textAlign: "left",
                                                                        padding: "15px 0 15px 15px",
                                                                        width: "220px"
                                                                    })}
                                                                    disabled={isLoading || mapLoading}
                                                                >
                                                                    <MenuItem
                                                                        value={0}
                                                                        sx={{ fontSize: "13px", paddingY: "2px" }}
                                                                    >
                                                                        South Asia
                                                                    </MenuItem>
                                                                    {countries.map((a) => (
                                                                        <MenuItem
                                                                            key={a.country_id}
                                                                            value={a.country_id}
                                                                            disabled={!a.status}
                                                                            sx={{
                                                                                fontSize: "13px",
                                                                                paddingY: "2px",
                                                                                overflow: "hidden",
                                                                                textOverflow: "ellipsis",
                                                                                whiteSpace: "nowrap",
                                                                            }}
                                                                        >
                                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                                <span>{a.country}</span>
                                                                                {a.description && (
                                                                                    <Tooltip title={a.description} arrow>
                                                                                        <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </Box>
                                                                        </MenuItem>
                                                                    ))}
                                                                </Select>
                                                            </>
                                                        ) : (
                                                            <Typography variant="subtitle2" sx={{ mb: 1 }} style={{ textAlign: "center" }}>
                                                                <FormLabel style={{ textAlign: "center" }} className="formLabel">
                                                                    Country:{" "}
                                                                    {countries.find((c) => c.country_id === selectedCountryId)?.country ||
                                                                        "South Asia"}
                                                                </FormLabel>
                                                            </Typography>
                                                        )}
                                                        <Select
                                                            disableUnderline
                                                            variant="standard"
                                                            value={selectedStateId}
                                                            onChange={handleStateChange}
                                                            displayEmpty
                                                            inputProps={{ "aria-label": "State" }}
                                                            IconComponent={ArrowDropDownIcon}
                                                            MenuProps={{
                                                                disableScrollLock: true,
                                                                PaperProps: { sx: { maxHeight: 300 } },
                                                                PopperProps: { modifiers: [{ name: "flip", enabled: false }] },
                                                            }}
                                                            sx={(theme) => ({
                                                                fontSize: "13px",
                                                                height: "26px",
                                                                backgroundColor:
                                                                    theme.palette.mode === "dark"
                                                                        ? "rgba(60, 75, 60, 1)"
                                                                        : "rgba(235, 247, 233, 1)",
                                                                overflow: "hidden",
                                                                textOverflow: "ellipsis",
                                                                whiteSpace: "nowrap",
                                                                margin: "0 20px 10px",
                                                                textAlign: "left",
                                                                padding: "15px 0 15px 15px",
                                                                width: "220px"
                                                            })}
                                                            disabled={disabledStateFilter || isLoading || mapLoading}
                                                        >
                                                            <MenuItem
                                                                value={0}
                                                                sx={{ fontSize: "13px", paddingY: "2px" }}
                                                            >
                                                                State/Province
                                                            </MenuItem>
                                                            {states.map((a) => (
                                                                <MenuItem
                                                                    key={a.state_id}
                                                                    value={a.state_id}
                                                                    sx={{
                                                                        fontSize: "13px",
                                                                        paddingY: "2px",
                                                                        overflow: "hidden",
                                                                        textOverflow: "ellipsis",
                                                                        whiteSpace: "nowrap",
                                                                    }}
                                                                >
                                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                                        <span>{a.state}</span>
                                                                        {a.description && (
                                                                            <Tooltip title={a.description} arrow>
                                                                                <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                </MenuItem>
                                                            ))}
                                                        </Select>
                                                    </FormControl>
                                                </div>
                                            </div>
                                        </List>
                                    </Collapse>
                                </List>

                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader1"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader1"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("dataType")}
                                        disabled={isLoading || mapLoading}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/datatype.svg" alt="Data Type" />
                                        </ListItemIcon>
                                        {/*<ListItemText
                                            primary={<FormLabel style={{ textAlign: "left" }} className="formLabel">Data Type</FormLabel>}
                                        />*/}
                                        <ListItemText
                                            primary={
                                                <FormLabel style={{ textAlign: "left" }} className="formLabel">
                                                    {selectedCommodityTypeId === 1
                                                        ? "Switch to Livestock"
                                                        : "Switch to Crops"}
                                                </FormLabel>
                                            }
                                        />
                                        {isSidebarOpen.dataType ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.dataType} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ px: 2 }}>
                                            <FormGroup row sx={{ flexWrap: "nowrap", gap: 2 }}>
                                                {commodityTypes.map((type) => (
                                                    <FormControlLabel
                                                        key={type.commodity_type_id}
                                                        control={
                                                            <Switch
                                                                checked={selectedCommodityTypeId === type.commodity_type_id}
                                                                onChange={() =>
                                                                    handleCommodityTypeChange({
                                                                        target: { value: type.commodity_type_id },
                                                                    })
                                                                }
                                                                disabled={!type.status || isLoading || mapLoading}
                                                                color="primary"
                                                                style={{ textAlign: "left!important" }}
                                                            />
                                                        }
                                                        label={
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <FormLabel className="label-list" style={{ textAlign: "left" }}>
                                                                    {type.commodity_type}
                                                                </FormLabel>
                                                                {type.description && (
                                                                    <Tooltip title={type.description} arrow>
                                                                        <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </FormGroup>
                                        </List>
                                    </Collapse>
                                </List>

                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader2"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader2"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("analysis")}
                                        disabled={isLoading || mapLoading}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/analysis.svg" alt="Analysis & Scale" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormLabel style={{ textAlign: "left" }} className="formLabel">Analysis & Scale</FormLabel>}
                                        />
                                        {isSidebarOpen.analysis ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.analysis} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ px: 2 }}>
                                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                                                <FormLabel style={{ textAlign: "left!important" }} className="formLabel">Select analysis scope</FormLabel>
                                            </Typography>
                                            <FormGroup style={{ textAlign: "left!important" }}>
                                                {analysisScopes.map((scope) => (
                                                    <FormControlLabel
                                                        key={scope.scope_id}
                                                        control={
                                                            <Switch
                                                                checked={selectedScopeId === scope.scope_id}
                                                                onChange={() =>
                                                                    handleScopeChange({
                                                                        target: { value: scope.scope_id },
                                                                    })
                                                                }
                                                                disabled={!scope.status || isLoading || mapLoading}
                                                                color="primary"
                                                                style={{ textAlign: "left!important" }}
                                                            />
                                                        }
                                                        label={
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <span
                                                                    style={{
                                                                        fontFamily: "Poppins",
                                                                        fontSize: "10px",
                                                                        fontStyle: "normal",
                                                                        fontWeight: 500,
                                                                        lineHeight: "normal",
                                                                        textAlign: "left",
                                                                    }}
                                                                >
                                                                    {scope.scope}
                                                                </span>
                                                                {scope.description && (
                                                                    <Tooltip title={scope.description} arrow>
                                                                        <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </FormGroup>

                                            <Typography variant="subtitle2" sx={{ mt: 3, mb: 1 }} style={{ textAlign: "left" }}>
                                                <FormLabel style={{ textAlign: "left" }} className="formLabel">Select visualization scale</FormLabel>
                                            </Typography>
                                            <FormGroup>
                                                {visualizationScales.map((scale) => (
                                                    <FormControlLabel
                                                        key={scale.scale_id}
                                                        control={
                                                            <Switch
                                                                checked={selectedScaleId === scale.scale_id}
                                                                onChange={() =>
                                                                    handleScaleChange({
                                                                        target: { value: scale.scale_id },
                                                                    })
                                                                }
                                                                disabled={!scale.status || isLoading || mapLoading}
                                                                color="primary"
                                                                style={{ textAlign: "left!important" }}
                                                            />
                                                        }
                                                        label={
                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                <span
                                                                    style={{
                                                                        fontFamily: "Poppins",
                                                                        fontSize: "10px",
                                                                        fontStyle: "normal",
                                                                        fontWeight: 500,
                                                                        lineHeight: "normal",
                                                                        textAlign: "left!important",
                                                                    }}
                                                                >
                                                                    {scale.scale}
                                                                </span>
                                                                {scale.description && (
                                                                    <Tooltip title={scale.description} arrow>
                                                                        <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                    </Tooltip>
                                                                )}
                                                            </Box>
                                                        }
                                                    />
                                                ))}
                                            </FormGroup>
                                        </List>
                                    </Collapse>
                                </List>

                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader3"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader3"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("commodity")}
                                        disabled={isLoading || mapLoading}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/commodity.svg" alt="Commodity" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormLabel style={{ textAlign: "left" }} className="formLabel">Commodity</FormLabel>}
                                        />
                                        {isSidebarOpen.commodity ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.commodity} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ px: 2 }}>
                                            {(() => {
                                                const groupOrder = [];
                                                const groupedCommodities = commodities.reduce((acc, commodity) => {
                                                    if (!acc[commodity.commodity_group]) {
                                                        acc[commodity.commodity_group] = { name: commodity.commodity_group, items: [] };
                                                        groupOrder.push(commodity.commodity_group);
                                                    }
                                                    acc[commodity.commodity_group].items.push(commodity);
                                                    return acc;
                                                }, {});

                                                Object.values(groupedCommodities).forEach((group) => {
                                                    group.items.sort((a, b) => a.commodity_id - b.commodity_id);
                                                });

                                                return groupOrder.map((groupName) => {
                                                    const group = groupedCommodities[groupName];
                                                    const filteredItems = group.items.filter((commodity) =>
                                                        selectedCommodityTypeId ? commodity.commodity_type_id === selectedCommodityTypeId : true
                                                    );
                                                    return filteredItems.length > 0 ? (
                                                        <div key={group.name}>
                                                            <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                                                                <FormLabel style={{ textAlign: "left" }} className="formLabel">{group.name}</FormLabel>
                                                            </Typography>
                                                            <FormGroup>
                                                                {filteredItems.map((commodity) => (
                                                                    <FormControlLabel
                                                                        key={commodity.commodity_id}
                                                                        control={
                                                                            <Switch
                                                                                checked={selectedCommodityId === commodity.commodity_id}
                                                                                onChange={() =>
                                                                                    handleCommodityChange({
                                                                                        target: { value: commodity.commodity_id },
                                                                                    })
                                                                                }
                                                                                disabled={!commodity.status || isLoading || mapLoading}
                                                                                color="primary"
                                                                                style={{ textAlign: "left!important" }}
                                                                            />
                                                                        }
                                                                        label={
                                                                            <Box display="flex" alignItems="center" gap={0.5}>
                                                                                <span
                                                                                    style={{
                                                                                        fontFamily: "Poppins",
                                                                                        fontSize: "10px",
                                                                                        fontStyle: "normal",
                                                                                        fontWeight: 500,
                                                                                        lineHeight: "normal",
                                                                                        textAlign: "left",
                                                                                    }}
                                                                                >
                                                                                    {commodity.commodity}
                                                                                </span>
                                                                                {commodity.description && (
                                                                                    <Tooltip title={commodity.description} arrow>
                                                                                        <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                                    </Tooltip>
                                                                                )}
                                                                            </Box>
                                                                        }
                                                                    />
                                                                ))}
                                                            </FormGroup>
                                                        </div>
                                                    ) : null;
                                                });
                                            })()}
                                        </List>
                                    </Collapse>
                                </List>

                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader5"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader5"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("risk")}
                                        disabled={isLoading || mapLoading || !selectedCommodityId}
                                        sx={getListItemStyle("risk")}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/risk.svg" alt="Risk" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormLabel style={{ textAlign: "left" }} className="formLabel">Climate risk</FormLabel>}
                                        />
                                        {isSidebarOpen.risk ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.risk} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ px: 2 }}>
                                            {Object.entries(sortedGroupedRisks).map(([groupId, group]) => (
                                                <div key={groupId}>
                                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1 }} style={{ textAlign: "left" }}>
                                                        <FormLabel style={{ textAlign: "left!important" }} className="formLabel">{group.name}</FormLabel>
                                                    </Typography>
                                                    <FormGroup>
                                                        {group.items.map((risk) => (
                                                            <FormControlLabel
                                                                key={risk.risk_id}
                                                                control={
                                                                    <Switch
                                                                        checked={selectedRiskId === risk.risk_id}
                                                                        onChange={() => handleRiskChange(risk.risk_id)}
                                                                        disabled={!risk.status || isLoading || mapLoading}
                                                                        color="primary"
                                                                        style={{ textAlign: "left!important" }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                                        <span
                                                                            style={{
                                                                                fontFamily: "Poppins",
                                                                                fontSize: "10px",
                                                                                fontStyle: "normal",
                                                                                fontWeight: 500,
                                                                                lineHeight: "normal",
                                                                                textAlign: "left",
                                                                            }}
                                                                        >
                                                                            {risk.risk}
                                                                        </span>
                                                                        {risk.description && (
                                                                            <Tooltip title={risk.description} arrow>
                                                                                <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                }
                                                            />
                                                        ))}
                                                    </FormGroup>
                                                </div>
                                            ))}
                                        </List>
                                    </Collapse>
                                </List>

                                {selectedCommodityTypeId !== 2 && (
                                    <List
                                        className="listMenu"
                                        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                        component="nav"
                                        aria-labelledby="nested-list-subheader6"
                                    >
                                        <ListSubheader component="div" id="nested-list-subheader6"></ListSubheader>
                                        <ListItemButton
                                            onClick={() => handleSidebarToggle("impact")}
                                            disabled={isLoading || mapLoading || !selectedCommodityId}
                                            sx={getListItemStyle("impact")}
                                        >
                                            <ListItemIcon
                                                sx={{
                                                    minWidth: 35,
                                                    color: "rgba(0, 0, 0, 0.54)",
                                                    flexShrink: 0,
                                                    display: "inline-flex",
                                                }}
                                            >
                                                <img src="/images/impact.svg" alt="Impact" />
                                            </ListItemIcon>
                                            <ListItemText
                                                primary={<FormLabel style={{ textAlign: "left!important" }} className="formLabel">Climate change impact</FormLabel>}
                                            />
                                            {isSidebarOpen.impact ? <ExpandLess /> : <ExpandMore />}
                                        </ListItemButton>
                                        <Collapse in={isSidebarOpen.impact} timeout="auto" unmountOnExit>
                                            <List component="div" disablePadding sx={{ px: 2 }}>
                                                <FormGroup>
                                                    {impacts.map((impact) => (
                                                        <FormControlLabel
                                                            key={impact.impact_id}
                                                            control={
                                                                <Switch
                                                                    checked={selectedImpactId === impact.impact_id}
                                                                    onChange={() => handleImpactChange(impact.impact_id)}
                                                                    disabled={!impact.status || isLoading || mapLoading}
                                                                    color="primary"
                                                                    style={{ textAlign: "left!important" }}
                                                                />
                                                            }
                                                            label={
                                                                <Box display="flex" alignItems="center" gap={0.5}>
                                                                    <span
                                                                        style={{
                                                                            fontFamily: "Poppins",
                                                                            fontSize: "10px",
                                                                            fontStyle: "normal",
                                                                            fontWeight: 500,
                                                                            lineHeight: "normal",
                                                                            textAlign: "left",
                                                                        }}
                                                                    >
                                                                        {impact.impact}
                                                                    </span>
                                                                    {impact.description && (
                                                                        <Tooltip title={impact.description} arrow>
                                                                            <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                        </Tooltip>
                                                                    )}
                                                                </Box>
                                                            }
                                                        />
                                                    ))}
                                                </FormGroup>
                                            </List>
                                        </Collapse>
                                    </List>
                                )}

                                <List
                                    className="listMenu"
                                    sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
                                    component="nav"
                                    aria-labelledby="nested-list-subheader7"
                                >
                                    <ListSubheader component="div" id="nested-list-subheader7"></ListSubheader>
                                    <ListItemButton
                                        onClick={() => handleSidebarToggle("adaptation")}
                                        disabled={isLoading || mapLoading || !selectedCommodityId}
                                        sx={getListItemStyle("adaptation")}
                                    >
                                        <ListItemIcon
                                            sx={{
                                                minWidth: 35,
                                                color: "rgba(0, 0, 0, 0.54)",
                                                flexShrink: 0,
                                                display: "inline-flex",
                                            }}
                                        >
                                            <img src="/images/option.svg" alt="Adaptation" />
                                        </ListItemIcon>
                                        <ListItemText
                                            primary={<FormLabel style={{ textAlign: "left!important" }} className="formLabel">Adaptation</FormLabel>}
                                        />
                                        {isSidebarOpen.adaptation ? <ExpandLess /> : <ExpandMore />}
                                    </ListItemButton>
                                    <Collapse in={isSidebarOpen.adaptation} timeout="auto" unmountOnExit>
                                        <List component="div" disablePadding sx={{ px: 2, textAlign: "left" }}>
                                            <Typography variant="subtitle3" sx={{ mt: 2, mb: 1, textAlign: "left!important" }}>
                                                <FormLabel style={{ textAlign: "left!important" }} className="formLabel">Select intervention for adaptation potential</FormLabel>
                                            </Typography>
                                            {groupedAdaptations.map((group) => (
                                                <div key={group.groupId}>
                                                    <Typography variant="subtitle2" sx={{ mt: 2, mb: 1, textAlign: "left!important" }}>
                                                        <FormLabel style={{ textAlign: "left!important" }} className="formLabel">{group.name}</FormLabel>
                                                    </Typography>
                                                    <FormGroup style={{ textAlign: "left!important" }}>
                                                        {group.items.map((adaptation) => (
                                                            <FormControlLabel
                                                                key={adaptation.adaptation_id}
                                                                control={
                                                                    <Switch
                                                                        checked={selectedAdaptationId === adaptation.adaptation_id}
                                                                        onChange={() => handleAdaptationChange(adaptation.adaptation_id)}
                                                                        disabled={!adaptation.status || isLoading || mapLoading}
                                                                        color="primary"
                                                                        style={{ textAlign: "left!important" }}
                                                                    />
                                                                }
                                                                label={
                                                                    <Box display="flex" alignItems="center" gap={0.5}>
                                                                        <span
                                                                            style={{
                                                                                fontFamily: "Poppins",
                                                                                fontSize: "10px",
                                                                                fontStyle: "normal",
                                                                                fontWeight: 500,
                                                                                lineHeight: "normal",
                                                                                textAlign: "left",
                                                                                display: "flex",
                                                                            }}
                                                                        >
                                                                            {adaptation.adaptation}
                                                                        </span>
                                                                        {adaptation.description && (
                                                                            <Tooltip title={adaptation.description} arrow>
                                                                                <InfoIcon fontSize="small" sx={{ color: "rgba(0, 0, 0, 0.54)" }} />
                                                                            </Tooltip>
                                                                        )}
                                                                    </Box>
                                                                }
                                                            />
                                                        ))}
                                                    </FormGroup>
                                                </div>
                                            ))}
                                        </List>
                                    </Collapse>
                                </List>
                            </div>
                        </div>
                    </List>
                </Drawer>
                <Box
                    component="main"
                    className="main"
                    sx={{ flexGrow: 1, height: "calc(100vh - 88px)" }}
                >
                    <Grid container sx={{ height: "100%" }}>
                        <Grid item xs={12}>
                            <MapViewer
                                drawerOpen={open}
                                filters={appliedFilters}
                                adaptations={adaptations}
                                mapLoading={mapLoading}
                                setMapLoading={setMapLoading}
                                climateScenarios={climateScenarios}
                            />
                        </Grid>
                    </Grid>
                </Box>
            </Box>
        </div>
    );
}

export default Test;