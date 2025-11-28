import React, { useState, useEffect, useContext, useMemo } from "react";
import Carousel from "react-material-ui-carousel";
import { Paper, Button } from "@mui/material";
import StickyFooter from "./StickyFooter";
import Box from "@mui/material/Box";
import { styled } from "@mui/material/styles";
import Typography from "@mui/material/Typography";
import { Tooltip, tooltipClasses } from "@mui/material";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import ReactPlayer from "react-player";
import Slide from "@mui/material/Slide";
import { SelectMinimal } from "./Minimal_Select";
import { SelectMinimal2 } from "./Minimal_Select2";
import { useNavigate } from "react-router-dom";
import VideoPlayer from "./VideoPlayer";
import LoadingPage from "./LoadingPage"; // Import the LoadingPage component
import OpenInNewIcon from "@mui/icons-material/OpenInNew";
import { Popper } from "@mui/material";
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import Summary_Statistics from "./Summary_Statistics";
import { ThemeContext } from "./ThemeContext";
import SleekTooltip from "./SleekTooltip";

const logoStyle3 = {
  width: "77vw",
  minHeight: "90vh",
  margin: "auto",
  marginTop: 20,
};
const logoStyle4 = {
  height: "40px",
  marginLeft: 6,
  marginRight: 6,
  marginTop: 10,
  marginBottom: 10,
};
const thumbstyle = {
  width: "100vw",
};
const logoStyle6 = { height: "88%", margin: "auto" };
const logoStyle8 = { height: "55%", margin: "auto" };
const logoStyle7 = { width: "90%", margin: "auto" };

const paperHoverStyle = {
  "m": 1,
  "width": "220px",
  "height": 90,
  "alignContent": "center",
  "transition": "transform 0.2s ease, box-shadow 0.2s ease",
  ":hover": {
    boxShadow: 3,
    transform: "scale(1.03)",
    cursor: "pointer",
  },
};

/* Increase the resilience of small-scale producers to climate variability and change
Increase the quality, availability, and utility of data and evidence
Improve climate adaptive capacity of agricultural systems
*/

var items = [
  {
    video: "./Home_imgs/Nepal CG.jpg",
    videothumb: "./Home_imgs/Nepal CG.jpg",
    id: 1,
  },
  {
    video: "./vid31.mp4",
    videothumb: "./thumb31.jpg",
    id: 2,
  },
  {
    video: "./Home_imgs/India.jpg",
    videothumb: "./Home_imgs/India.jpg",
    id: 3,
  },
  {
    video: "./vid5.mp4",
    videothumb: "./thumb5.jpg",
    id: 4,
  },
  {
    video: "./Home_imgs/IMG_3188.jpg",
    videothumb: "./Home_imgs/IMG_3188.jpg",
    id: 5,
  },
  {
    video: "./vid41.mp4",
    videothumb: "./thumb41.jpg",
    id: 6,
  },
  {
    video: "./Home_imgs/CIMMYT (7).jpg",
    videothumb: "./Home_imgs/CIMMYT (7).jpg",
    id: 7,
  },
  {
    video: "./Home_imgs/43425798842_884ba83b08_o.jpg",
    videothumb: "./Home_imgs/43425798842_884ba83b08_o.jpg",
    id: 8,
  },
  {
    video: "./Home_imgs/CGIAR (1).jpg",
    videothumb: "./Home_imgs/CGIAR (1).jpg",
    id: 9,
  },
  {
    video: "./Home_imgs/CIMMYT (8).jpg",
    videothumb: "./Home_imgs/CIMMYT (8).jpg",
    id: 10,
  },
  {
    video: "./Home_imgs/Fertilizer application.jpg",
    videothumb: "./Home_imgs/Fertilizer application.jpg",
    id: 11,
  },
  {
    video: "./Home_imgs/CIMMYT (3).jpg",
    videothumb: "./Home_imgs/CIMMYT (3).jpg",
    id: 12,
  },
  {
    video: "./Home_imgs/28474558493_9ac0292ca6_o.jpg",
    videothumb: "./Home_imgs/28474558493_9ac0292ca6_o.jpg",
    id: 13,
  },
  {
    video: "./Home_imgs/CGIAR (2).jpg",
    videothumb: "./Home_imgs/CGIAR (2).jpg",
    id: 14,
  },
  {
    video: "./Home_imgs/CGIAR (3).jpg",
    videothumb: "./Home_imgs/CGIAR (3).jpg",
    id: 15,
  },
];

const types = [
  "Enhance adaptive capacity of agricultural systems through granular climate risk assessment and targeted adaptation options.",
  "Strengthen the quality, accessibility, and usability of data and evidence to support climate-informed decision-making in agriculture.",
  "Build resilience of small-scale producers to climate variability and change through data-driven climate adaptation options.",
];

const ImageOverlay = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "flex-start",
  justifyContent: "flex-start",
  color: theme.palette.common.white,
}));

const Home = (props) => {
  const randomStartIndex = useMemo(() => Math.floor(Math.random() * items.length), []);
  const [curr, setCurr] = useState(randomStartIndex);
  const [reg, Setreg] = useState("South Asia");
  const [comm, Setcomm] = useState("rice");
  const [loading, setLoading] = useState(true); // State to manage loading screen

  useEffect(() => {
    const timer = setTimeout(() => {
      setLoading(false); // Hide loading screen after 10 seconds
    }, 1000);

    return () => clearTimeout(timer);
  }, []);

  const handleChange = (index) => {
    setCurr(index);
  };

  const handlecountrychange = (name) => {
    Setreg(name);
  };

  const handlecommoditychange = (name) => {
    Setcomm(name);
  };

  const navigate = useNavigate();

  const toComponentB = () => {
    navigate("/exploredata", { state: { Region: reg, Commodity: comm } });
  };

  const mediaItems = useMemo(() => {
    const copy = [...items];
    const picked = [];
    for (let i = 0; i < 3; i++) {
      const idx = Math.floor(Math.random() * copy.length);
      picked.push(copy.splice(idx, 1)[0]);
    }
    return picked;
  }, []);

  // cycle through those 3
  const [mediaIdx, setMediaIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setMediaIdx((i) => (i + 1) % mediaItems.length);
    }, 4000); // change every 3.5s
    return () => clearInterval(id);
  }, [mediaItems.length]);

  // slide through the 3 types
  const [typeIdx, setTypeIdx] = useState(0);
  useEffect(() => {
    const id = setInterval(() => {
      setTypeIdx((i) => (i + 1) % types.length);
    }, 4000); // change every 3.5s
    return () => clearInterval(id);
  }, []);

  const currentMedia = mediaItems[mediaIdx];

  const { mode } = useContext(ThemeContext);

  if (loading) {
    return <LoadingPage />; // Show loading screen while loading is true
  }
  const PopperMessage = () => (
    <Box
      sx={{
        position: "absolute",
        top: 10,
        right: 20,
        backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.7)"),
        color: mode === "dark" ? "#e0e0e0" : "#ffffff",
        padding: "10px",
        borderRadius: "5px",
        width: "250px",
        textAlign: "center",
        zIndex: 1000,
      }}
    >
      <Typography variant="body2" fontStyle={"italic"}>
        {" "}
        <GppMaybeIcon fontSize="11px" sx={{ marginX: "2px", marginY: 0 }} />
        Disclaimer: This is an internal test version of ACASA. Please do not cite or quote the data.
      </Typography>
    </Box>
  );

  return (
    <div style={{ backgroundColor: mode === "dark" ? "#25292e" : "#ffffff" }}>
      <Box sx={{ marginTop: "80px", display: { xs: "none", md: "block" } }}>
        {/*<Carousel
          sx={{ margin: 0, padding: 0, zIndex: 100 }}
          indicatorContainerProps={{
            style: {
              zIndex: 1,
              marginTop: "-120px",
              marginBottom: "80px",
              position: "relative",
            },
          }}
          index={curr}
          onChange={handleChange}
          interval={2500}
          stopAutoPlayOnHover={false}
        >
          {items.map((item, i) => (
            <React.Fragment key={i}>
              <Item key={i} item={item} sts={curr} />
              <PopperMessage />
            </React.Fragment>
          ))}
        </Carousel>*/}

        <Paper sx={{ position: "relative", width: "100vw", height: "100vh", overflow: "hidden" }}>
          {/* Optional loading logic with thumbnail, if needed */}
          {loading && (
            <Box
              sx={{
                width: "100vw",
                height: "100vh",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                backgroundColor: "#ffffff",
                position: "absolute",
                top: 0,
                left: 0,
                zIndex: 10,
              }}
            >
              <img src={props.item.videothumb} alt="Loading" style={thumbstyle} />
            </Box>
          )}

          {/* Background video or image */}
          {currentMedia.video.match(/\.(mp4|webm)$/) ? (
            <ReactPlayer
              url={currentMedia.video}
              playing
              loop
              muted
              width="100vw"
              height="100vh"
              style={{
                position: "absolute",
                top: 0,
                left: 0,
                objectFit: "cover",
                display: loading ? "none" : "block",
              }}
              config={{
                file: {
                  attributes: {
                    style: {
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                    },
                  },
                },
              }}
            />
          ) : (
            <Box
              component="img"
              src={currentMedia.video}
              alt=""
              sx={{
                width: "100%",
                height: "100%",
                objectFit: "cover",
                position: "absolute",
                top: 0,
                left: 0,
                display: loading ? "none" : "block",
              }}
            />
          )}

          {/* Overlay */}
          <Box
            sx={{
              backgroundColor: "#111111",
              opacity: 0.3,
              position: "absolute",
              top: 0,
              bottom: 0,
              left: 0,
              right: 0,
              zIndex: 1,
            }}
          />

          {/* Foreground content */}
          <Box
            sx={{
              position: "relative",
              zIndex: 2,
              display: "flex",
              m: 1,
              ml: 7,
              mt: 5,
              p: 2,
              width: "35vw",
              flexDirection: "column",
              textAlign: { sm: "left", md: "left" },
            }}
          >
            <Typography
              variant="h4"
              sx={(theme) => ({
                color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
                fontWeight: "bold",
                textShadow: theme.palette.mode === "dark" ? "2px 2px 5px rgba(0, 0, 0, 0.6)" : "2px 2px 5px rgba(0, 0, 0, 0.25), -2px -2px 5px rgba(0, 0, 0, 0.25)",
              })}
            >
              Atlas of Climate Adaptation in South Asian Agriculture
            </Typography>
            <Typography
              variant="subtitle1"
              sx={(theme) => ({
                fontWeight: "bold",
                mt: 2,
                color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              })}
            >
              Interconnections between climate risks, practices, technologies, and policies
            </Typography>

            <Box
              sx={(theme) => ({
                background:
                  theme.palette.mode === "dark"
                    ? "linear-gradient(to right, rgba(99, 99, 99, 0.7), rgba(240, 240, 240, 0.7))"
                    : "linear-gradient(to right, rgba(255, 254, 227,0.4), rgba(0, 0, 0, 0.3))",
                mt: "90px",
                ml: -9,
                mr: -3,
              })}
            >
              <Slide key={typeIdx} direction="right" in={true} timeout={500} mountOnEnter unmountOnExit>
                <Typography
                  variant="h6"
                  sx={(theme) => ({
                    ml: 9,
                    mr: 3,
                    color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
                  })}
                >
                  {types[typeIdx]}
                </Typography>
              </Slide>
            </Box>

            <Button
              variant="contained"
              href="/#/exploredata"
              sx={(theme) => ({
                "width": "160px",
                "mt": 6,
                "mb": 2,
                "fontSize": "18px",
                "flexShrink": 0,
                "color": theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                "fontWeight": "bold",
                "backgroundColor": theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f",
                "&:hover": {
                  backgroundColor: theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f",
                },
              })}
            >
              Explore
            </Button>
          </Box>

          <PopperMessage />
        </Paper>

        <Box
          sx={{
            position: "relative",
            display: "flex",
            flexDirection: "row",
            width: "95vw",
            margin: "auto",
            boxShadow: mode === "dark" ? "0px 1px 5px rgba(0, 0, 0, 0.5)" : "0px 1px 5px #aaa",
            border: `9px solid ${mode === "dark" ? "#2d3238" : "#f8faf0"}`,
            borderRadius: "10px",
            backgroundColor: mode === "dark" ? "#2d3238" : "#f8faf0",
            height: "auto",
            marginTop: -5,
            zIndex: 200,
          }}
        >
          <Box sx={{ width: "100%" }}>
            <img src={"afghanistan.svg"} style={logoStyle4} alt="afghanistan" loading="lazy" />
            <img src={"bangladesh.png"} style={logoStyle4} alt="bangladesh" loading="lazy" />
            <img src={"bhutan.svg"} style={logoStyle4} alt="bhutan" loading="lazy" />
            <img src={"india.png"} style={logoStyle4} alt="india" loading="lazy" />
            <img src={"maldives.svg"} style={logoStyle4} alt="maldives" loading="lazy" />
            <img src={"nepal.svg"} style={logoStyle4} alt="nepal" loading="lazy" />
            <img src={"pakistan.svg"} style={logoStyle4} alt="pakistan" loading="lazy" />
            <img src={"srilanka.png"} style={logoStyle4} alt="srilanka" loading="lazy" />
          </Box>

          {/*<Box
            sx={{
              marginRight: 2,
              marginLeft: 2,
              color: mode === "dark" ? "#fff" : "000",
            }}
          >
            <Typography>Region of Interest:</Typography>
            <SelectMinimal2 changeReg={handlecountrychange}></SelectMinimal2>
          </Box>

          <Box
            sx={{
              marginRight: 2,
              marginLeft: 2,
              color: mode === "dark" ? "#fff" : "000",
            }}
          >
            <Typography>Commodity:</Typography>
            <SelectMinimal changeComm={handlecommoditychange}></SelectMinimal>
          </Box>

          <Button
            variant="contained"
            sx={{
              "width": "140px",
              "height": "32px",
              "margin": 2,
              "fontSize": "16px",
              "color": mode === "dark" ? "#000" : "#fff",
              "textTransform": "none",
              "backgroundColor": mode === "dark" ? "#388e3c" : "#4b9e44",
              "&:hover": {
                backgroundColor: mode === "dark" ? "#2e7d32" : "#4b9e44",
              },
            }}
          >
            <a
              href="/#/exploredata"
              onClick={() => {
                toComponentB();
              }}
              style={{ textDecoration: "none", color: "inherit" }}
            >
              {" "}
              <Typography>Explore</Typography>{" "}
            </a>
          </Button>*/}
        </Box>

        {/* <Summary_Statistics></Summary_Statistics> */}

        <Box sx={{ mt: "20px" }}>
          <img
            src="Approach (1)-cropped.svg"
            style={{
              ...logoStyle3,
              filter: mode === "dark" ? "invert(93%) sepia(5%) saturate(166%) hue-rotate(202deg) brightness(100%) contrast(91%)" : "none",
            }}
            alt="approach"
            loading="lazy"
          />
        </Box>
        {/*invert(86%) sepia(16%) saturate(174%) hue-rotate(195deg) brightness(83%) contrast(89%)
         */}

        {/*<Box
          sx={{
            mt: "20px",
            backgroundImage:
              mode === "dark"
                ? "linear-gradient(rgba(27, 31, 35, 0.1), rgba(27, 31, 35, 0.1)), url('world-map.png')"
                : "linear-gradient(rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0.5)), url('world-map.png')",
            backgroundSize: "cover",
            backgroundRepeat: "no-repeat",
            display: "flex",
            flexDirection: "row",
            padding: 7,
            boxShadow: mode === "dark" ? "0px 0px 4px rgba(0,0,0,0.6)" : "0px 0px 2px #aaa",
          }}
        >
          <Box
            sx={{
              width: "37%",
              display: "flex",
              flexDirection: "column",
              marginLeft: 7,
              marginRight: 7,
              textAlign: { sm: "center", md: "left" },
            }}
          >
            <Typography
              sx={{
                color: "#4b9e44",
                fontWeight: "normal",
                fontSize: "40px",
                fontFamily: "Poppins",
              }}
            >
              How to use this Atlas?{" "}
              <a href="/#/guide" style={{ pointerEvents: "none", textDecoration: "none" }}>
                <OpenInNewIcon sx={{ fontSize: 30, color: "#4b9e44" }} />
              </a>
            </Typography>
            <Typography
              sx={{
                color: mode === "dark" ? "#e0e0e0" : "#444444",
                fontSize: "17px",
                fontFamily: "Poppins",
                marginTop: 2,
              }}
            >
              The functionalities of the Atlas can be best utilized in the following order: start by visualizing the data layers in detail in the Explore Data tab. The Data at a glance tab is then
              used to look at multiple data layers at once. The Data Access tab gives information about the data and their download links. The Use Cases tab discusses several possible uses of the
              ACASA Atlas. Additionally, visit the Resources and About Us tab to know more about us, ACASA team, data briefs, newsletter updates, expert opinions, and media coverage.
            </Typography>
          </Box>
          <Box sx={{ width: "63%", margin: "auto" }}>
            <VideoPlayer></VideoPlayer>
          </Box>
        </Box>*/}
        {/*  */}
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            width: { xs: "100%", sm: "100%" },
            paddingBottom: 10,
            paddinTop: 5,
            backgroundColor: mode === "dark" ? "#1b1f23" : "#f7f7f7",
          }}
        >
          <Box sx={{ marginLeft: 7, marginRight: 7, marginTop: 4 }}>
            <Typography
              sx={{
                color: mode === "dark" ? "#e0e0e0" : "#111111",
                fontWeight: "bold",
                fontSize: "30px",
                fontFamily: "Poppins",
                marginBottom: "4px",
              }}
            >
              Our Partners
            </Typography>
            {/*  */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                width: { xs: "100%", sm: "100%" },
              }}
              gap="0.5vw"
            >
              <SleekTooltip title="Bangladesh Agricultural Research Council (BARC)" arrow placement="top">
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"barc.png"} style={logoStyle6} alt="barc" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Indian Council of Agricultural Research" arrow placement="top">
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"icar.png"} style={logoStyle6} alt="icar" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Nepal Agricultural Research Council" arrow placement="top">
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"narc.png"} style={logoStyle6} alt="narc" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Natural Resources Management Center (NRMC)" arrow placement="top">
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"nrmc.png"} style={logoStyle6} alt="nrmc" loading="lazy" />
                </Paper>
              </SleekTooltip>
            </Box>
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                width: { xs: "100%", sm: "100%" },
                justifyContent: "center",
              }}
              gap="0.5vw"
            >
              {/*<SleekTooltip title="Bill & Melinda Gates Foundation" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"bmgf-new.svg"} style={logoStyle7} alt="bmgf" />
                </Paper>
              </SleekTooltip>*/}
              <SleekTooltip title="International Maize and Wheat Improvement Center" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"cimmyt-cgiar.png"} style={logoStyle7} alt="cimmyt" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Gates Foundation" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={mode === "dark" ? "GF PRIMARY LOGO_light.png" : "GF PRIMARY LOGO_Dark.png"} style={logoStyle7} alt="gates" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="University of Florida" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"south-asia-11.svg"} style={logoStyle7} alt="florida" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Columbia University" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"columbia-university.png"} style={logoStyle6} alt="columbia" loading="lazy" />
                </Paper>
              </SleekTooltip>
              <SleekTooltip title="Evans School Policy Analysis and Research (EPAR), University of Washington" arrow>
                <Paper sx={paperHoverStyle} elevation={0}>
                  <img src={"Univ of Washington.png"} alt="washington" style={{ width: "90%", height: "auto", objectFit: "contain", display: "block", margin: "0 auto" }} loading="lazy" />
                </Paper>
              </SleekTooltip>
            </Box>
          </Box>
        </Box>
        <StickyFooter></StickyFooter>
      </Box>

      <Box
        sx={{
          marginTop: "80px",
          width: "100%",
          height: "calc(100vh - 80px)",
          alignItems: "center",
          justifyContent: "center",
          display: { xs: "flex", md: "none" },
        }}
      >
        <Typography
          style={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            color: mode === "dark" ? "#e0e0e0" : "#333333",
          }}
        >
          <PersonalVideoIcon style={{ fontSize: 40 }} /> This website is designed for desktop. Please view in a bigger screen.
        </Typography>
      </Box>
    </div>
  );
};

function Item(props) {
  const [loading, setLoading] = React.useState(true);
  const handleReady = () => {
    setLoading(false);
  };

  /*return (
    <Paper>
      {loading && (
        <Box
          sx={{
            width: "100vw",
            height: "100vh",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "#ffffff",
          }}
        >
          <img src={props.item.videothumb} alt="Loading" style={thumbstyle} />
        </Box>
      )}
      <ReactPlayer url={props.item.video} muted width="100vw" height="auto" playing={true} loop={true} onReady={handleReady} style={{ display: loading ? "none" : "block" }} />
      <Image sx={{ backgroundColor: "#111111", opacity: 0.3 }}></Image>
      <Image>
        <Box
          component="span"
          sx={{
            display: "flex",
            m: 1,
            ml: 7,
            mt: 5,
            padding: 2,
            width: "35vw",
            flexDirection: "column",
            textAlign: { sm: "left", md: "left" },
          }}
        >
          <Typography
            variant="h4"
            sx={(theme) => ({
              color: theme.palette.mode === "dark" ? "#000000" : "#ffffff",
              fontWeight: "bold",
              textShadow:
                theme.palette.mode === "dark"
                  ? "2px 2px 5px rgba(0, 0, 0, 0.6)" // Stronger shadow in dark mode for depth
                  : "2px 2px 5px rgba(0, 0, 0, 0.25), -2px -2px 5px rgba(0, 0, 0, 0.25)",
            })}
          >
            {props.item.name}
          </Typography>
          <Typography variant="subtitle1" sx={(theme) => ({ fontWeight: "bold", mt: 2, color: theme.palette.mode === "dark" ? "#000000" : "#ffffff" })}>
            {props.item.description}
          </Typography>
          <Box
            sx={(theme) => ({
              background:
                theme.palette.mode === "dark"
                  ? "linear-gradient(to right, rgba(99, 99, 99, 0.7), rgba(240, 240, 240, 0.7))" // Light gradient for dark mode
                  : "linear-gradient(to right, rgba(255, 254, 227,0.4), rgba(0, 0, 0, 0.3))",
              mt: "90px",
              ml: -9,
              mr: -3,
            })}
          >
            <Slide direction="right" in={true} timeout={500} mountOnEnter unmountOnExit>
              <Typography variant="h6" sx={(theme) => ({ ml: 9, mr: 3, color: theme.palette.mode === "dark" ? "#000000" : "#ffffff" })}>
                {props.item.type}
              </Typography>
            </Slide>
          </Box>
          <Button
            variant="contained"
            href="/#/exploredata"
            sx={(theme) => ({
              "width": "160px",
              "mt": 6,
              "mb": 2,
              "fontSize": "18px",
              "flexShrink": 0,
              "color": theme.palette.mode === "dark" ? "#ffffff" : "#000000",
              "fontWeight": "bold",
              "backgroundColor": theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f",
              "&:hover": { backgroundColor: theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f" },
            })}
          >
            Explore
          </Button>
        </Box>
      </Image>
    </Paper>
  );*/
}

const Image = styled("span")(({ theme }) => ({
  position: "absolute",
  left: 0,
  right: 0,
  top: 0,
  bottom: 0,
  display: "flex",
  alignItems: "left",
  justifyContent: "left",
  color: theme.palette.common.white,
}));

export default Home;
