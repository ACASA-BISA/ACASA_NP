import React from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { styled } from "@mui/material/styles";
import Tab, { tabClasses } from "@mui/material/Tab";
import Tabs, { tabsClasses } from "@mui/material/Tabs";
import { Snackbar } from "@mui/material";
import Card_Posts from "./Acasa_Post";
import News from "./Acasa_News";
import Info from "./Acasa_Info";
import Timeline2 from "./Acasa_timeline";
import Glossary from "./Acasa_Glossary";
import Methodology from "./Methodology";
import Publications from "./Acasa_Publication";
import StickyFooter from "./StickyFooter";
import { Box, Typography } from "@mui/material";

const TabItem = styled(Tab)(({ theme }) => ({
  "maxHeight": 15,
  "minWidth": 80,
  "textTransform": "none",
  "fontSize": "18px",
  "fontWeight": 700,
  "color": theme.palette.mode === "dark" ? "#000" : "#fff", // Black text in dark mode, white in light mode
  "opacity": 1,
  "backgroundColor": theme.palette.mode === "dark" ? "#61c258" : "#4ba046", // Green background for inactive buttons
  "margin": "0px 5px",
  "borderRadius": "7px",
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "rgba(97, 194, 88, 0.5)" : "rgba(232, 245, 213, 0.4)",
    color: theme.palette.mode === "dark" ? "#1b1f23" : "#4ba046",
  },
  [theme.breakpoints.up("md")]: {
    minWidth: 120,
  },
  [`&.${tabClasses.selected}`]: {
    color: theme.palette.mode === "dark" ? "#387530" : "#4ba046", // Darker green text for active button in dark mode
    backgroundColor: theme.palette.mode === "dark" ? "rgba(210, 235, 200, 1)" : "rgba(232, 245, 213, 1)", // Lighter green background for active button in dark mode
    borderRadius: "10px",
    marginBottom: "5px",
  },
}));

export default function ResTabsData() {
  const location = useLocation();
  const navigate = useNavigate();
  const params = new URLSearchParams(location.search);
  const tabFromURL = parseInt(params.get("tab"), 10);

  const [tabIndex, setTabIndex] = React.useState(tabFromURL || 0);
  const [openSnackbar, setOpenSnackbar] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);

  const handleMenuOpen = (event) => setAnchorEl(event.currentTarget);
  const handleMenuClose = () => setAnchorEl(null);

  const handleMenuSelect = (index) => {
    setTabIndex(index);
    navigate(`?tab=${index}`);
    handleMenuClose();
  };

  const mobileTabs = ["ACASA Posts", "Newsletter-Strides", "Glossary", "Methodology"];

  React.useEffect(() => {
    if (tabFromURL === 4 ||tabFromURL === 5 || tabFromURL === 6) {
      navigate(`?tab=0`); // Redirect to tab 0 if the user tries to access these tabs
    } else {
      setTabIndex(tabFromURL || 0);
    }
  }, [tabFromURL, navigate]);

  const handleTabChange = (e, index) => {
    /*if (index === 3) {
      setOpenSnackbar(true);
      return;
    }*/

    if (index === 4 ||index === 5 || index === 6) {
      return; // Prevent navigation to certain tabs
    }
    setTabIndex(index);
    navigate(`?tab=${index}`); // Update URL when user clicks a tab
  };

  return (
    <div>
      <Box
        sx={(theme) => ({
          display: { xs: "none", md: "block" },
          backgroundColor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff",
          paddingTop: "100px",
        })}
      >
        <Tabs
          textColor="inherit"
          value={tabIndex}
          onChange={handleTabChange}
          sx={(theme) => ({
            marginRight: "70px",
            marginLeft: "70px",
            width: "calc(100vw - 140px)",
            backgroundColor: "inherit",
            boxShadow: theme.palette.mode === "dark" ? "inset 0 0 0 0 #1b1f23" : "inset 0 0 0 0 #E6ECF0", // Adjusted shadow for dark mode
            [`& .${tabsClasses.indicator}`]: {
              backgroundColor: theme.palette.mode === "dark" ? "#387530" : "#4ba046",
            },
          })}
          centered
        >
          <TabItem disableRipple label={"ACASA Posts"} />
          <TabItem disableRipple label={"Newsletter-Strides"} />
          <TabItem disableRipple label={"Glossary"} />
          <TabItem disableRipple label={"Methodology"} />
          <TabItem disableRipple label={"Publications"} />
          {/*<TabItem disableRipple disabled={true} label={"ACASA Data Dive"} />
          <TabItem disableRipple disabled={true} label={"ACASA in News"} />*/}
        </Tabs>
        {tabIndex === 0 && <Card_Posts></Card_Posts>}
        {tabIndex === 1 && <News></News>}
        {tabIndex === 2 && <Glossary></Glossary>}
        {tabIndex === 3 && <Methodology></Methodology>}
        {tabIndex === 4 && <Publications></Publications>}
        {tabIndex === 5 && <Info></Info>}
        {tabIndex === 6 && <Timeline2></Timeline2>}
        <Snackbar
          open={openSnackbar}
          autoHideDuration={5000}
          onClose={() => setOpenSnackbar(false)}
          message={
            <Typography
              sx={(theme) => ({
                fontWeight: 600,
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
                fontSize: "18px",
                fontFamily: "Poppines",
              })}
            >
              To be updated soon.
            </Typography>
          }
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
          ContentProps={{
            sx: {
              backgroundColor: "grey", // Customize background if needed
            },
          }}
        />

        <StickyFooter></StickyFooter>
      </Box>
      <Box
        sx={(theme) => ({
          display: { xs: "flex", md: "none" },
          flexDirection: "column",
          alignItems: "center",
          backgroundColor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff",
          paddingTop: "100px",
        })}
      >
        <Tabs
          textColor="inherit"
          value={tabIndex}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          allowScrollButtonsMobile
          sx={(theme) => ({
            width: "100%",
            maxWidth: "95vw",
            [`& .${tabsClasses.indicator}`]: {
              backgroundColor: theme.palette.mode === "dark" ? "#387530" : "#4ba046",
            },
          })}
          centered={false}
        >
          <TabItem
            disableRipple
            label="ACASA Posts"
            sx={{
              fontSize: "18px !important",
              minWidth: "60px !important",
              padding: "4px 8px !important",
            }}
          />
          <TabItem
            disableRipple
            label="Newsletter-Strides"
            sx={{
              fontSize: "18px !important",
              minWidth: "80px !important",
              padding: "4px 8px !important",
            }}
          />
          <TabItem
            disableRipple
            label="Glossary"
            sx={{
              fontSize: "18px !important",
              minWidth: "60px !important",
              padding: "4px 8px !important",
            }}
          />
          <TabItem
            disableRipple
            label="Methodology"
            sx={{
              fontSize: "18px !important",
              minWidth: "80px !important",
              padding: "4px 8px !important",
            }}
          />
        </Tabs>

        {/* Tab content */}
        <Box sx={{ width: "100%", mt: 2 }} >
          {tabIndex === 0 && <Card_Posts />}
          {tabIndex === 1 && <News />}
          {tabIndex === 2 && <Glossary />}
          {tabIndex === 3 && <Methodology />}
          {tabIndex === 4 && <Publications />}
        </Box>
      </Box>
    </div>
  );
}
