import React, { useState, useEffect, useRef } from "react";
import AppBar from "@mui/material/AppBar";
import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import Avatar from "@mui/material/Avatar";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import { styled } from "@mui/material/styles";
import ToggleButton from "@mui/material/ToggleButton";
import ToggleButtonGroup from "@mui/material/ToggleButtonGroup";
import { ThemeContext } from "./ThemeContext";
import { IconButton } from "@mui/material";
import NightlightOutlinedIcon from "@mui/icons-material/NightlightOutlined";
import WbSunnyOutlinedIcon from "@mui/icons-material/WbSunnyOutlined";
import HomeOutlinedIcon from '@mui/icons-material/HomeOutlined';
import FeedbackOutlinedIcon from '@mui/icons-material/FeedbackOutlined';
import Translate from "./Translate";
import LightTooltip from "./LightTooltip";
import StyledTooltip from "./StyledTooltip";
import { useLocation, useNavigate, useParams, Link } from "react-router-dom";
import { Style } from "@mui/icons-material";

const pages = ["Home", "Explore Data", "Data at a glance", /*"Data Access",*/ "Use Cases", "Resources", "About Us"];
const pageid = ["home", "dashboard", "dataglance", /*"access",*/ "usecases", "resources", "about"];
const AppBarHeight = "85px";

const ToggleContainer = styled("div")(({ theme, mode }) => ({
  width: 60,
  height: 30,
  backgroundColor: mode === "dark" ? "#25292e" : "#ddd",
  borderRadius: 30,
  display: "flex",
  alignItems: "center",
  padding: "2px",
  cursor: "pointer",
  transition: "background-color 0.3s ease",
  position: "relative",
  marginLeft: "20px",
}));

const ToggleThumb = styled("div")(({ mode }) => ({
  width: 26,
  height: 26,
  backgroundColor: mode === "dark" ? "#f5c518" : "#333",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  position: "absolute",
  left: mode === "dark" ? "32px" : "2px",
  transition: "left 0.3s ease, background-color 0.3s ease",
}));

const MyButton = styled(ToggleButton)(({ theme }) => ({
  boxShadow: "none",
  textTransform: "none",
  fontSize: 15,
  fontWeight: "normal",
  color: theme.palette.text.primary,
  paddingRight: 2,
  paddingLeft: 2,
  borderRadius: 0,
  border: "0px solid",
  backgroundColor: theme.palette.mode === "dark" ? "#3a3d42" : "#ffffff",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#25292e" : "#f5f3ed",
    color: theme.palette.mode === "dark" ? "#fff" : "#000",
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    boxShadow: "none",
    backgroundColor: theme.palette.mode === "dark" ? "#4C9E46" : "#4C9E46",
    color: "#fff",
  },
  "&.Mui-disabled": {
    border: "0px solid",
    color: theme.palette.mode === "dark" ? "#eee" : "#888",
    backgroundColor: theme.palette.mode === "dark" ? "#3a3d42" : "#EFEFEF",
  },
}));

const ImgButton = styled(Button)(({ theme }) => ({
  boxShadow: "none",
  borderRadius: 0,
  border: "0px solid",
  backgroundColor: theme.palette.mode === "dark" ? "#3a3d42" : "#ffffff",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#3a3d42" : "#ffffff",
    boxShadow: "none",
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    boxShadow: "none",
    backgroundColor: theme.palette.mode === "dark" ? "#3a3d42" : "#ffffff",
  },
}));

function ResponsiveAppBar({ validCountries }) {
  const [flag, setFlag] = useState("home");
  const [persistentCountry, setPersistentCountry] = useState(null);
  const { mode, toggleTheme } = React.useContext(ThemeContext);
  const location = useLocation();
  const navigate = useNavigate();
  const { country } = useParams();
  const [isSkipTranslateHidden, setIsSkipTranslateHidden] = useState(false);
  const [language, setLanguage] = useState("en");
  const [anchorElGlance, setAnchorElGlance] = useState(null);
  const GlanceButtonRef = useRef(null); // Define GlanceButtonRef using useRef

  const handleChange = (event) => {
    setLanguage(event.target.value);
    // Add your i18n language change logic here
  };

  useEffect(() => {
    const checkSkipTranslate = () => {
      const skipTranslateDiv = document.querySelector("div.skiptranslate");
      if (skipTranslateDiv) {
        const style = window.getComputedStyle(skipTranslateDiv);
        setIsSkipTranslateHidden(style.display === "none");
      } else {
        setIsSkipTranslateHidden(true);
      }
    };

    checkSkipTranslate();
    const observer = new MutationObserver(checkSkipTranslate);
    observer.observe(document.body, { childList: true, subtree: true });

    return () => observer.disconnect();
  }, []);

  useEffect(() => {
    const path = location.hash ? location.hash.replace(/^#\/?/, "") : location.pathname.replace(/^\//, "");
    const pathSegments = path.split("/");
    const urlCountry = pathSegments[0] && !pageid.includes(pathSegments[0]) && !["hazardglance", "adaptationglance", "future", "comparison", "summary", "timeline", "adaptation", "adaptation2", "analytics", "adaptationataglance", "hazardataglance", "feedback"].includes(pathSegments[0]) ? pathSegments[0] : null;
    const activePageSegment = pathSegments[1] || pathSegments[0] || "home";

    let activePage = activePageSegment;
    if (["hazardglance", "adaptationglance", "analytics", "adaptationataglance", "hazardataglance"].includes(activePage)) {
      activePage = "dataglance";
    } else if (["future", "comparison", "summary", "timeline", "adaptation", "adaptation2"].includes(activePage)) {
      activePage = "dashboard";
    } else if (!pageid.includes(activePage) && activePage !== "feedback") {
      activePage = "home";
    }

    // Only update persistentCountry if the country is valid or if we're on dashboard (to allow Test.jsx to handle it)
    if (urlCountry && (validCountries.includes(urlCountry.toLowerCase().replace(/\s+/g, "")) || activePageSegment === "dashboard")) {
      setPersistentCountry(urlCountry);
    } else if (urlCountry && !validCountries.includes(urlCountry.toLowerCase().replace(/\s+/g, "")) && activePageSegment !== "dashboard") {
      setPersistentCountry(null);
      const newPath = pathSegments.slice(1).join("/") || "home";
      navigate(`/${newPath}`, { replace: true });
    } else if (!urlCountry && persistentCountry) {
      setPersistentCountry(null);
    }

    if (flag !== activePage) {
      setFlag(activePage);
    }
  }, [location.hash, location.pathname, country, validCountries, navigate]);

  const handleNavigation = (newValue) => {
    if (newValue && newValue !== "dataglance") {
      setFlag(newValue);
      const currentCountry = country || persistentCountry;
      const targetPath = currentCountry ? `/${currentCountry}/${newValue}` : `/${newValue}`;
      navigate(targetPath.replace("//", "/"), { replace: true });
    }
  };

  const handleFeedbackNavigation = () => {
    const currentCountry = country || persistentCountry;
    const targetPath = currentCountry ? `/${currentCountry}/feedback` : `/feedback`;
    navigate(targetPath.replace("//", "/"), { replace: true });
  };

  const handleOpenGlanceMenu = (event) => {
    setAnchorElGlance(GlanceButtonRef.current);
    setFlag("dataglance");
  };

  const handleCloseGlanceMenu = () => {
    setAnchorElGlance(null);
  };

  const handleGlanceMenuItemClick = (path) => {
    setFlag("dataglance");
    const currentCountry = country || persistentCountry;
    const targetPath = currentCountry ? `/${currentCountry}/${path}` : `/${path}`;
    navigate(targetPath.replace("//", "/"), { replace: true });
    handleCloseGlanceMenu();
  };

  const getHref = (path) => {
    const currentCountry = country || persistentCountry;
    return currentCountry ? `/${currentCountry}/${path}` : `/${path}`;
  };

  return (
    <div>
      <AppBar
        position="fixed"
        sx={{
          bgcolor: (theme) => theme.palette.background.paper,
          zIndex: (theme) => theme.zIndex.drawer + 1,
          height: AppBarHeight,
          boxShadow: (theme) => (theme.palette.mode === "dark" ? "0px 0px 4px #222" : "0px 0px 4px #aaa"),
        }}
      >
        <Box sx={{ display: "flex", flexDirection: "column", justifyContent: "center", paddingTop: isSkipTranslateHidden ? "12px" : "14px" }}>
          <Toolbar disableGutters sx={{ width: "100%", alignItems: "center" }}>
            <Box sx={{ display: "flex", flexGrow: 0, flexDirection: "column" }}>
              <Button
                size="small"
                color="inherit"
                key="DeptAgri"
                component="a"
                href="https://doa.gov.lk/home-page/"
                target="_blank"
                sx={{ padding: 0 }}
              >
                <Avatar variant="square" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka Logos/Agri Logo_New copy.png`} sx={{ width: "auto", height: "60px" }} />

              </Button>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
              }}
            >
              <ImgButton size="small" color="inherit" key="Agriplus">
                <Avatar variant="square" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka Logos/Agri Plus-01-2-2.png`} sx={{ width: "auto", height: "50px" }} />
              </ImgButton>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexGrow: 0,
                display: { xs: "none", md: "flex" },
                flexDirection: "column",
              }}
            >
              <Button
                size="small"
                color="inherit"
                key="NRMC"
                component="a"
                href="https://doa.gov.lk/nrmc-home/"
                target="_blank"
                sx={{ padding: 0 }}
              >
                <Avatar variant="square" alt="Remy Sharp" src={`${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka Logos/NRMC.png`} sx={{ width: "auto", height: "50px" }} />
              </Button>
            </Box>
            <Box sx={{ display: "flex", flexGrow: 0, flexDirection: "column" }}>
              <Button
                size="small"
                color="inherit"
                key="Acasa"
                component="a"
                href="https://acasa-bisa.org/#/home"
                target="_blank"
                sx={{ padding: 0 }}
              >
                <Avatar
                  variant="square"
                  alt="Remy Sharp"
                  src={mode === "dark" ? `${process.env.PUBLIC_URL}/Home_imgs/Acasa Logo white1.png` : `${process.env.PUBLIC_URL}/Home_imgs/Acasa1.png`}
                  sx={{ width: "auto", height: "60px" }}
                />
              </Button>
            </Box>
            <Box sx={{ flexGrow: 1, display: "flex", justifyContent: "center", alignItems: "center" }}>
              <ToggleButtonGroup value={flag} exclusive onChange={(e, newValue) => handleNavigation(newValue)}>
                {pages.map((page, index) => (
                  <Box key={pageid[index]}>
                    <LightTooltip title={page === "Guide" ? "To be updated soon" : ""}>
                      <span>
                        {page === "Data at a glance" ? (
                          <div ref={GlanceButtonRef}>
                            <MyButton
                              value={pageid[index]}
                              sx={{
                                paddingRight: 2,
                                paddingLeft: 2,
                                paddingTop: 1,
                                paddingBottom: 1,
                                backgroundColor: (theme) =>
                                  Boolean(anchorElGlance)
                                    ? theme.palette.mode === "dark"
                                      ? "#3a3d42"
                                      : "#f5f3ed"
                                    : theme.palette.mode === "dark"
                                      ? "#3a3d42"
                                      : "#ffffff",
                                "&.Mui-selected": {
                                  backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#4C9E46" : "#4C9E46"),
                                  color: "#fff",
                                },
                              }}
                              onClick={handleOpenGlanceMenu}
                              aria-owns={Boolean(anchorElGlance) ? "menu-glance" : undefined}
                              aria-haspopup="true"
                            >
                              <Typography
                                textAlign="center"
                                sx={{
                                  fontSize: "14px",
                                  fontWeight: 700,
                                  color: (theme) => (theme.palette.mode === "dark" ? "#fff" : "#000"),
                                  fontFamily: "Karla",
                                }}
                              >
                                {page}
                              </Typography>
                            </MyButton>
                            <Menu
                              id="menu-glance"
                              anchorEl={anchorElGlance}
                              open={Boolean(anchorElGlance)}
                              onClose={handleCloseGlanceMenu}
                              onClick={handleCloseGlanceMenu}
                              anchorOrigin={{
                                vertical: "bottom",
                                horizontal: "left",
                              }}
                              transformOrigin={{
                                vertical: "top",
                                horizontal: "left",
                              }}
                            >
                              <MenuItem onClick={() => handleGlanceMenuItemClick("hazardglance")}>
                                <Typography
                                  textAlign="center"
                                  fontSize={13}
                                  sx={{
                                    fontFamily: "Karla",
                                    fontWeight: 350,
                                    color: (theme) => (theme.palette.mode === "dark" ? "#dddddd" : "#222222"),
                                  }}
                                >
                                  Hazards at a glance
                                </Typography>
                              </MenuItem>
                              <MenuItem onClick={() => handleGlanceMenuItemClick("adaptationglance")}>
                                <Typography
                                  textAlign="center"
                                  fontSize={13}
                                  sx={{
                                    fontFamily: "Karla",
                                    fontWeight: 350,
                                    color: (theme) => (theme.palette.mode === "dark" ? "#dddddd" : "#222222"),
                                  }}
                                >
                                  Adaptation at a glance
                                </Typography>
                              </MenuItem>
                            </Menu>
                          </div>
                        ) : (
                          <MyButton
                            value={pageid[index]}
                            sx={{
                              px: 2,
                              py: 1,
                              "&.Mui-selected": {
                                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#4C9E46" : "#4C9E46"),
                                color: "#fff",
                              },
                              "&.Mui-disabled": {
                                backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#3a3f45" : "#e0e0e0"),
                                color: (theme) => (theme.palette.mode === "dark" ? "#7d848b" : "#9e9e9e"),
                                cursor: "not-allowed",
                              },
                            }}
                            disabled={page === "Guide"}
                          >
                            <Typography sx={{ fontSize: "14px", fontWeight: 700, fontFamily: "Karla" }}>
                              {page}
                            </Typography>
                          </MyButton>
                        )}
                      </span>
                    </LightTooltip>
                  </Box>
                ))}
              </ToggleButtonGroup>
            </Box>

            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "flex-end",
                maxWidth: 450,
                gap: 0.5,
              }}
            >
              <StyledTooltip title="Feedback" arrow>
                <IconButton
                  onClick={handleFeedbackNavigation}
                >
                  <FeedbackOutlinedIcon
                    sx={{
                      fontSize: 28, // increase icon size
                      color: mode === "dark" ? "#fff" : "#000"
                    }}
                  />
                </IconButton>
              </StyledTooltip>
              <StyledTooltip title={mode === "dark" ? "Switch to Light Mode" : "Switch to Dark Mode"} arrow enterDelay={100}>
                <ToggleContainer mode={mode} onClick={toggleTheme}>
                  <ToggleThumb mode={mode}>
                    {mode === "dark" ? (
                      <WbSunnyOutlinedIcon fontSize="small" sx={{ color: "#000" }} />
                    ) : (
                      <NightlightOutlinedIcon fontSize="small" sx={{ color: "#fff" }} />
                    )}
                  </ToggleThumb>
                </ToggleContainer>
              </StyledTooltip>

              <Translate />
              <ImgButton size="small" href="https://bisa.org/" target="_blank" color="inherit" key="Bisa">
                <Avatar variant="square" alt="Remy Sharp" src={mode === "dark" ? `${process.env.PUBLIC_URL}/BISA Logo in white color.png` : `${process.env.PUBLIC_URL}/BISA Logo in color.png`} sx={{ width: "auto", height: "50px" }} />
              </ImgButton>
            </Box>
          </Toolbar>
        </Box>
      </AppBar>
    </div>
  );
}

export default ResponsiveAppBar;