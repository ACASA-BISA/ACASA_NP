import React, { useEffect, useState, useMemo, useContext } from "react";
import Slider from "react-slick";
import { Link } from "react-router-dom";
import {
    Box,
    Typography,
    Button,
    Stack,
    Card,
    CardContent,
    Container,
    Grid,
    Tabs,
    Tab,
    useTheme,
} from "@mui/material";
import { Paper } from "@mui/material";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import CardMedia from "@mui/material/CardMedia";
import StickyFooter from "../StickyFooter";
import { useParams } from "react-router-dom";
import { styled } from "@mui/material/styles";
import ReactPlayer from "react-player";
import Slide from "@mui/material/Slide";
import PersonalVideoIcon from "@mui/icons-material/PersonalVideo";
import SleekTooltip from "../SleekTooltip";
import { ThemeContext } from "../ThemeContext";
import LoadingPage from "../LoadingPage"; // Import the LoadingPage component
import GppMaybeIcon from "@mui/icons-material/GppMaybe";
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
// 🔹 Your resources with dynamic images
const resources = [
    {
        title: "Women farmers, climate, resilience",
        description:
            "Finding resilience in the rains of Nawalapitiya, Kandy",
        image: `${process.env.PUBLIC_URL}/Blog-14.jpeg`,
    },
    {
        title: "Digital agriculture, remote sensing",
        description:
            "Driving agricultural transformation through digital innovation",
        image: `${process.env.PUBLIC_URL}/Blog-15.jpg`,
    },
    {
        title: "Maize, Agribusiness",
        description:
            "Building Capabilities of Medium and Large-Scale Sri Lankan Maize Growers in Agricultural Risk Management",
        image: `${process.env.PUBLIC_URL}/Blog-10.jpg`, // place inside public/images/
    },
];
var items = [
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/2264406732_3cecc0db1d_o.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/2264406732_3cecc0db1d_o.jpg`,
        id: 1,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/BUDD 051.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/BUDD 051.jpg`,
        id: 2,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/BUDD 074.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/BUDD 074.jpg`,
        id: 3,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0011.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0011.jpg`,
        id: 4,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0028.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0028.jpg`,
        id: 5,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0064.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/DSC_0064.jpg`,
        id: 6,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/Farmer and lady.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/Farmer and lady.jpg`,
        id: 7,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/IMG_3379.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/IMG_3379.jpg`,
        id: 8,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/IMG_3391.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/IMG_3391.jpg`,
        id: 9,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/pexels-dinukagunawardana-17903073.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/pexels-dinukagunawardana-17903073.jpg`,
        id: 10,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/pexels-ramesh-nimsara-kariyawasam-623579687-17396316.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/pexels-ramesh-nimsara-kariyawasam-623579687-17396316.jpg`,
        id: 11,
    },
    {
        video: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/Sri Lanka.jpg`,
        videothumb: `${process.env.PUBLIC_URL}/Home_imgs/Sri Lanka/Sri Lanka.jpg`,
        id: 12,
    },
];
// const types = [
// "Enhance adaptive capacity of agricultural systems through granular climate risk assessment and targeted adaptation options.",
// "Strengthen the quality, accessibility, and usability of data and evidence to support climate-informed decision-making in agriculture.",
// "Build resilience of small-scale producers to climate variability and change through data-driven climate adaptation options.",
// ];
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
const slides = [
    {
        image: `${process.env.PUBLIC_URL}/images/banner.png`,
        title: "Atlas of Climate Adaptation in South Asian Agriculture",
        link: "/services",
        buttonText: "Explore the Atlas",
        secondaryLink: "/contact",
    },
    {
        image: `${process.env.PUBLIC_URL}/images/banner.png`,
        title: "Atlas of Climate Adaptation in South Asian Agriculture",
        link: "/monitoring",
        buttonText: "Explore the Atlas",
        secondaryLink: "/support",
    },
    {
        image: `${process.env.PUBLIC_URL}/images/banner.png`,
        title: "Atlas of Climate Adaptation in South Asian Agriculture",
        link: "/ai-solutions",
        buttonText: "Explore the Atlas",
        secondaryLink: "/learn",
    },
];
const rightCards = [
    {
        title: "Real-time Analytics",
        description:
            "Strengthen the quality, accessibility, and usability of data and evidence to support climate-informed decision-making in agriculture.",
        image: `${process.env.PUBLIC_URL}/images/v1.png`,
    },
    {
        title: "Smart Irrigation",
        description:
            "Enhance adaptive capacity of agricultural systems through granular climate risk assessment and targeted adaptation options.",
        image: `${process.env.PUBLIC_URL}/images/v2.png`,
    },
    {
        title: "Weather Forecast",
        description:
            "Build resilience of small-scale producers to climate variability and change through data-driven climate adaptation options.",
        image: `${process.env.PUBLIC_URL}/images/v3.png`,
    },
];
const useCases = [
    {
        title: "Government",
        image: `${process.env.PUBLIC_URL}/images/govt.png`,

        content: (
            <>
                <Typography component="p">
                    ACASA can be useful for climate risk profiling and regional adaptation
                    prioritisation. Insights from ACASA would help government agencies
                    determine future investment requirements for climate risk mitigation and
                    regional scaling opportunities.
                </Typography>
                <Typography variant="h5" component="h5">
                    Evidence-based policymaking:
                </Typography>
                <Typography component="p">
                    The Atlas provides data and analysis to support policymaking for
                    climate-resilient agriculture and strategic resource allocation. The
                    Atlas identifies sustainable practices and resilient farming methods to
                    support rural climate-resilient infrastructure and finance requirements.
                </Typography>
                <Typography variant="h5" component="h5">
                    National Adaptation Plan:
                </Typography>
                <Typography component="p">
                    Atlas could provide relevant stakeholder-validated adaptation options to
                    be integrated into the National Adaptation Plans of respective countries.
                </Typography>
                <Typography variant="h5" component="h5">
                    Climate-Smart Villages:
                </Typography>
                <Typography component="p">
                    Atlas will support scaling climate-resilient agriculture and villages by
                    providing granular information on select implementation sites.
                </Typography>
            </>
        ),
    },
    {
        title: "Research",
        image: `${process.env.PUBLIC_URL}/images/research1.jpg`,

        content: (
            <>

                <Typography component="p">
                    Empowering researchers with high-resolution, multi-dimensional data for
                    robust climate agriculture analysis in South Asia.
                </Typography>

                <Typography variant="h5" component="h5">
                    Agricultural research
                </Typography>
                <Typography component="p">
                    Atlas provides a comprehensive platform for climate-related data products
                    for agricultural research. Commodity-specific hazard and adaptation
                    identification methodology and tools can be used for interdisciplinary
                    research on various aspects of climate risk management.
                </Typography>
                <Typography variant="h5" component="h5">
                    Impact evaluation and assessment
                </Typography>
                <Typography component="p">
                    Atlas can enable hotspot identification and gendered vulnerability
                    assessments at granular levels, ideal for targeted fieldwork or impact
                    evaluation. ACASA’s repository of evidence on climate-smart agriculture
                    practices allows researchers to validate hypotheses and derive regionally
                    relevant findings.
                </Typography>
            </>
        ),
    },
    {
        title: "Civil Society",
        image: `${process.env.PUBLIC_URL}/images/civil.jpg`,

        content: (
            <>
                <Typography component="p">
                    ACASA provides open-access and freely downloadable products on climate
                    risk management in agriculture.
                </Typography>
                <Typography variant="h5" component="h5">
                    Strengthen climate action
                </Typography>
                <Typography component="p">
                    ACASA can help civil societies prioritize the interventions for climate
                    action and promote climate-resilient agricultural practices and
                    technologies as an adaptation measure to climate change.
                </Typography>
                <Typography variant="h5" component="h5">
                    Climate-related proposal
                </Typography>
                <Typography component="p">
                    ACASA can provide detailed insights and information in developing climate
                    context for new project proposals.
                </Typography>
            </>
        ),
    },
    {
        title: "Credit and Finance",
        image: `${process.env.PUBLIC_URL}/images/credit.jpg`,

        content: (
            <>
                <Typography component="p">
                    Enabling credit and financial institutions to leverage
                    climate-agriculture data for risk-informed lending and climate-smart
                    investment products.
                </Typography>

                <Typography variant="h5" component="h5">
                    Credit re-assessment
                </Typography>
                <Typography component="p">
                    Atlas to enable policy advocacy for facilitating the use of climate risk
                    database for agricultural credit risk assessment, risk pricing, and asset
                    quality.
                </Typography>
                <Typography variant="h5" component="h5">
                    Development of Agri-financing products
                </Typography>
                <Typography component="p">
                    Banks and MFIs can use ACASA to de-risk loans by aligning credit products
                    with low-risk, high-solvency regions. Data on cost-benefit and
                    scalability supports the design of climate-smart loan products and
                    blended finance schemes.
                </Typography>
                <Typography variant="h5" component="h5">
                    Gender-sensitive credit scheme
                </Typography>
                <Typography component="p">
                    Gendered insights allow financial institutions to design women-focused
                    credit solutions, encouraging inclusive lending.
                </Typography>
            </>
        ),
    },
    {
        title: "Multi-lateral Agencies",
        image: `${process.env.PUBLIC_URL}/images/multi.jpg`,

        content: (
            <>
                <Typography component="p">
                    ACASA will provide multi-lateral agencies with strategic data insights
                    and directions for adaptation investments in South Asia and facilitate
                    more effective project design and planning.
                </Typography>
                <Typography variant="h5" component="h5">
                    Climate finance
                </Typography>
                <Typography component="p">
                    Agencies can systematically integrate ACASA adaptation recommendations in
                    their climate finance planning process to align with the Paris Agreement
                    and sustainable development goals. Data will support agencies in
                    focusing on targeted investments such as climate-resilient food systems,
                    landscapes, and livelihoods, especially in regions with high adaptation
                    benefits.
                </Typography>
                <Typography variant="h5" component="h5">
                    Targeted high-impact investments
                </Typography>
                <Typography component="p">
                    Donors can utilize ACASA to prioritize high-impact locations for
                    climate-smart agriculture projects benefiting small-scale farmers and
                    promote adaptation strategies.
                </Typography>
                <Typography variant="h5" component="h5">
                    Gender-intentional adaptations
                </Typography>
                <Typography component="p">
                    The Atlas includes information on gender-intentional adaptations,
                    guiding donors to promote equity in climate adaptation projects.
                </Typography>
                <Typography variant="h5" component="h5">
                    Monitoring and evaluation
                </Typography>
                <Typography component="p">
                    ACASA is an innovative tool for agencies as they constantly seek
                    information and expertise in improving the effectiveness and impact of
                    their initiative. Atlas provides accessible and actionable data through
                    open-access, user-friendly tables and maps for informed resource
                    allocation and structured interventions.
                </Typography>
            </>
        ),
    },
    {
        title: "Insurance Industry",
        image: `${process.env.PUBLIC_URL}/images/insurance.png`,

        content: (
            <>
                <Typography component="p">
                    Atlas can support Agri-insurance agencies in developing satisfactory crop
                    insurance products for dynamic small-scale producers, providing
                    sufficient resolution at the village level.
                </Typography>
                <Typography variant="h5" component="h5">
                    Methodology Improvement
                </Typography>
                <Typography component="p">
                    A granular risk assessment of Atlas can aid in improving the existing
                    methodology for insurance product design and payout mechanism.
                    Implementing a parametric mechanism for insurance claims could improve
                    efficiency, triggered only by specific conditions rather than random
                    samples.
                </Typography>
                <Typography variant="h5" component="h5">
                    Premium set-up
                </Typography>
                <Typography component="p">
                    Enhancing risk quantification and identification to boost insurance
                    penetration from current levels and premium set-up.
                </Typography>
            </>
        ),
    },
    {
        title: "Agri-food Industry",
        image: `${process.env.PUBLIC_URL}/images/agri.jpg`,

        content: (
            <>
                <Typography component="p">
                    ACASA is committed to ensuring a sustainable agri-food industry and
                    inclusive supply chains.
                </Typography>
                <Typography variant="h5" component="h5">
                    Climate-friendly supply chains
                </Typography>
                <Typography component="p">
                    Collaboration with farmers for sustainable and climate-resilient
                    practices and equitable climate-friendly supply chains, ensuring an
                    uninterrupted supply.
                </Typography>
                <Typography variant="h5" component="h5">
                    Capacity development
                </Typography>
                <Typography component="p">
                    Enhancing the capacity of the farming community for the adaptation to
                    climatic hazards for livestock production.
                </Typography>
            </>
        ),
    },
];
const partnertooltip = {
    1: "Bangladesh Agricultural Research Council (BARC)",
    2: "Nepal Agricultural Research Council",
    3: "Natural Resources Management Center (NRMC)",
    4: "International Maize and Wheat Improvement Center",
    5: "Gates Foundation",
    6: "University of Florida",
    7: "Indian Council of Agricultural Research",
    8: "Columbia University",
    9: "Evans School Policy Analysis and Research (EPAR), University of Washington",
}
function TabPanel({ children, value, index }) {
    return (
        value === index && (
            <Box sx={{ p: 3 }}>
                <Typography>{children}</Typography>
            </Box>
        )
    );
}
function TestHome(props) {
    const { country } = useParams();
    const theme = useTheme();
    const [value, setValue] = useState(0);
    const [loading, setLoading] = useState(false);
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
    // const [typeIdx, setTypeIdx] = useState(0);
    // useEffect(() => {
    // const id = setInterval(() => {
    // setTypeIdx((i) => (i + 1) % types.length);
    // }, 4000); // change every 3.5s
    // return () => clearInterval(id);
    // }, []);
    const currentMedia = mediaItems[mediaIdx];
    useEffect(() => {
        document.documentElement.style.overflowX = "hidden";
        document.body.style.overflowX = "hidden";
    }, []);
    const handleChange = (event, newValue) => {
        setValue(newValue);
    };
    const settings = {
        dots: false,
        infinite: true,
        speed: 1400,
        slidesToShow: 1,
        slidesToScroll: 1,
        autoplay: true,
        autoplaySpeed: 8000,
        arrows: false,
    };
    const partnerLogos = [3];
    const contryLogos = [8];
    const { mode } = useContext(ThemeContext);
    if (loading) {
        return <LoadingPage />; // Show loading screen while loading is true
    }
    // const PopperMessage = () => (
    // <Box
    // sx={{
    // position: "absolute",
    // top: 10,
    // right: 20,
    // backgroundColor: (theme) => (theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.1)" : "rgba(0, 0, 0, 0.7)"),
    // color: mode === "dark" ? "#e0e0e0" : "#ffffff",
    // padding: "10px",
    // borderRadius: "5px",
    // width: "250px",
    // textAlign: "center",
    // zIndex: 1000,
    // }}
    // >
    // <Typography variant="body2" fontStyle={"italic"}>
    // {" "}
    // <GppMaybeIcon fontSize="11px" sx={{ marginX: "2px", marginY: 0 }} />
    // Disclaimer: This is an internal test version of ACASA. Please do not cite or quote the data.
    // </Typography>
    // </Box>
    // );
    return (
        <Box
            sx={{
                bgcolor: theme.palette.mode === "dark" ? "#2c2f34" : "#f5f5f5",
            }}>
            <div style={{ backgroundColor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff" }}>
                <Box sx={{ marginTop: "85px", display: "block" }}>
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
                                position: "absolute",
                                zIndex: 2,
                                display: "flex",
                                m: 1,
                                ml: 3,
                                mt: 5,
                                p: 2,
                                bottom: 50,
                                width: "55vw",
                                flexDirection: "column",
                                textAlign: { sm: "left", md: "left" },
                            }}
                        >
                            <Typography
                                variant="h4"
                                sx={(theme) => ({
                                    color: theme.palette.mode === "dark" ? "#fff" : "#ffffff",
                                    fontWeight: "bold",
                                    marginTop: '200px',
                                    fontSize: '48px',
                                    fontFamily: '"Poppins", sans-serif',
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
                                    fontFamily: '"Poppins", sans-serif',
                                    color: theme.palette.mode === "dark" ? "#fff" : "#ffffff",
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
                                    mt: "30px",
                                    ml: -9,
                                    mr: -3,
                                })}
                            >
                                {/* <Slide key={typeIdx} direction="right" in={true} timeout={500} mountOnEnter unmountOnExit>
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
                                </Slide> */}
                            </Box>
                            <Button
                                variant="contained"
                                href="/#/dashboard"
                                sx={(theme) => ({
                                    "width": "160px",
                                    "mt": 0,
                                    "mb": 2,
                                    "fontSize": "18px",
                                    "flexShrink": 0,
                                    "fontFamily":'Poppins',
                                    "color": theme.palette.mode === "dark" ? "#ffffff" : "#000000",
                                    "fontWeight": "600",
                                    "backgroundColor": theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f",
                                    "&:hover": {
                                        backgroundColor: theme.palette.mode === "dark" ? "#B88F1A" : "#fece2f",
                                    },
                                })}
                            >
                                Explore
                            </Button>
                        </Box>
                        {/* Overlay Right Cards */}
                        <Box
                            sx={{
                                position: "absolute",
                                top: "300px",
                                right: 20,
                                transform: "translateY(-50%)",
                                display: "flex",
                                flexDirection: "column",
                                gap: 2,
                                zIndex: 3,
                                width: { xs: "80%", sm: "300px" },
                            }}
                        >
                            {rightCards.map((card, idx) => (
                                <Card key={idx} className="cardImg"
                                    sx={{
                                        backgroundColor: theme.palette.mode === "dark" ? "#B88F1A" : "#4C9E46",
                                        color: theme.palette.mode === "dark" ? "#fff" : "#ffffff",
                                        borderRadius: "20px",
                                        fontFamily: '"Poppins", sans-serif',
                                        backdropFilter: "blur(25px)"
                                    }}>
                                    {card.image && (
                                        <CardMedia component="img" height="50px" width="50px" image={card.image} alt={card.title} />
                                    )}
                                    <CardContent>
                                        <Typography variant="body2" color="text.secondary" sx={{ fontFamily: '"Poppins", sans-serif',}}>
                                            {card.description}
                                        </Typography>
                                    </CardContent>
                                </Card>
                            ))}
                        </Box>
                        {/* <PopperMessage /> */}
                    </Paper>
                    {/* <Box
                        sx={{
                            position: "relative",
                            display: "flex",
                            flexDirection: "row",
                            width: "95vw",
                            margin: "auto",
                            boxShadow: theme.palette.mode === "dark" ? "0px 1px 5px rgba(0, 0, 0, 0.5)" : "0px 1px 5px #aaa",
                            border: `9px solid ${theme.palette.mode === "dark" ? "#2d3238" : "#f8faf0"}`,
                            borderRadius: "10px",
                            backgroundColor: theme.palette.mode === "dark" ? "#2d3238" : "#f8faf0",
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
                    </Box> */}
                    {/* <Box sx={{ mt: "20px" }}>
                        <Typography
                            variant="h2"
                            sx={{
                                color: theme.palette.mode === "dark" ? "#F2F4F3" : "#1a1d21",
                                fontFamily:'"Poppins", sans-serif',
                                textAlign: "center",
                            }}
                        >
                            ACASA Approach
                        </Typography>
                        <img
                            src="Approach (1)-cropped.svg"
                            style={{
                                ...logoStyle3,
                                filter: theme.palette.mode === "dark" ? "invert(93%) sepia(5%) saturate(166%) hue-rotate(202deg) brightness(100%) contrast(91%)" : "none",
                            }}
                            alt="approach"
                            loading="lazy"
                        />
                    </Box> */}
                    {/* <Box
                        sx={{
                            display: "flex",
                            flexDirection: "column",
                            width: { xs: "100%", sm: "100%" },
                            paddingBottom: 10,
                            paddinTop: 5,
                            backgroundColor: theme.palette.mode === "dark" ? "#1b1f23" : "#f7f7f7",
                        }}
                    >
                        <Box sx={{ marginLeft: 7, marginRight: 7, marginTop: 4 }}>
                            <Typography
                                sx={{
                                    color: theme.palette.mode === "dark" ? "#e0e0e0" : "#111111",
                                    fontWeight: "bold",
                                    fontSize: "30px",
                                    fontFamily: "revert",
                                    marginBottom: "4px",
                                }}
                            >
                                Our Partners
                            </Typography>
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
                                <SleekTooltip title="International Maize and Wheat Improvement Center" arrow>
                                    <Paper sx={paperHoverStyle} elevation={0}>
                                        <img src={"cimmyt-cgiar.png"} style={logoStyle7} alt="cimmyt" loading="lazy" />
                                    </Paper>
                                </SleekTooltip>
                                <SleekTooltip title="Gates Foundation" arrow>
                                    <Paper sx={paperHoverStyle} elevation={0}>
                                        <img src={theme.palette.mode === "dark" ? "GF PRIMARY LOGO_light.png" : "GF PRIMARY LOGO_Dark.png"} style={logoStyle7} alt="gates" loading="lazy" />
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
                    </Box> */}
                </Box>
                {/*<Box
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
                            color: theme.palette.mode === "dark" ? "#e0e0e0" : "#333333",
                        }}
                    >
                        <PersonalVideoIcon style={{ fontSize: 40 }} /> This website is designed for desktop. Please view in a bigger screen.
                    </Typography>
                </Box>*/}
            </div>
            <Container maxWidth="xl">
                <Box
                    className="AboutSection"
                    sx={{
                        p: 2,
                        bgcolor: theme.palette.mode === "dark" ? "#2c2f34" : "#f5f5f5",
                        borderRadius: "12px",
                        // boxShadow:
                        // theme.palette.mode === "dark"
                        // ? "0px 4px 10px rgba(0,0,0,0.4)"
                        // : "0px 4px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#f5f5f5" : "#000",
                            fontFamily: 'Poppins',
                            fontWeight: "500",
                            fontSize: '60px',
                            textAlign: 'center',
                            lineHeight: '70'
                        }}
                    >
                        <span sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#c4ecc2" }}>Tour</span> the <span sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#c4ecc2" }}>Atlas</span>
                    </Typography>
                    {/* <Typography
                        variant="h4"
                        sx={{
                            color: theme.palette.text.primary,
                            fontFamily:'"Poppins", sans-serif',
                            mt: 2,
                        }}
                    >
                        Aesthetics to be harmonised with Explore climate risks like never
                    </Typography> */}
                </Box>
                <Box
                    sx={{
                        position: "relative",
                        width: "100%",
                        height: 500, // 👈 custom height (px, vh, rem — up to you)
                        borderRadius: 2,
                        overflow: "hidden",
                        mt: 3
                    }}
                >
                    <Box
                        component="iframe"
                        src="https://www.youtube.com/embed/WlYTWGLso48?si=9-mZbkcPUTMCsEs6" // replace with your YouTube video link
                        title="YouTube video"
                        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                        allowFullScreen
                        sx={{
                            width: "100%",
                            height: "100%", // 👈 fills the custom height
                            border: 0,
                        }}
                    />
                </Box>
            </Container>
            <Container maxWidth="md">
                <Box
                    className="AboutSection"
                    sx={{
                        p: 2,
                        bgcolor: theme.palette.mode === "dark" ? "#2c2f34" : "#f5f5f5",
                        borderRadius: "12px",
                        // boxShadow:
                        // theme.palette.mode === "dark"
                        // ? "0px 4px 10px rgba(0,0,0,0.4)"
                        // : "0px 4px 10px rgba(0,0,0,0.1)",
                    }}
                >
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#f5f5f5" : "#000",
                            fontFamily: 'Poppins',
                            fontWeight: "500",
                            fontSize: '60px',
                            textAlign: 'center',
                            lineHeight: '70',
                        }}
                    >
                        Explore <span sx={{ color: theme.palette.mode === "dark" ? "#fff" : "#c4ecc2" }}>Climate Risk</span> <br /> Like Never Before
                    </Typography>
                    <Typography
                        variant="h4"
                        sx={{
                            color: theme.palette.text.primary,
                            fontFamily: '"Poppins", sans-serif',
                            mt: 2,
                            fontSize:'24px!important',
                            fontWeight:'500',
                        }}
                    >
                        Local-Level Maps to Inform the Real-World Action
                    </Typography>
                    <Typography
                        sx={{
                            color: theme.palette.text.primary,
                            fontFamily: '"Poppins", sans-serif',
                            mt: 2,
                            fontSize: "18px",
                            lineHeight: 1.6,
                        }}
                    >
                        Our interactive maps are designed to support government agencies, insurance providers, researchers, and service providers in aligned disciplines, agri-food industries, international and national donors, and organizations focused on climate adaptation. They can visualize climate-related risks and adaptation options at a high resolution, down to the sub-provincial level. Built on climate, crop, livestock, socioeconomic data, and adaptation options, our maps enable users to plan effectively and adapt quickly.
                    </Typography>
                </Box>
            </Container>
            <Container maxWidth="md">
                <Box sx={{ mt: 4, mb: 4 }}>
                    <Grid container spacing={2}>
                        {[
                            { emoji: "🔍", text: "Zoom in to view risks at the local / sub-provincial scale.", },
                            { emoji: "🌾", text: "Visualise climate hazards", },
                            { emoji: "🧑‍🌾", text: "Identify vulnerable regions for key crops and livestock", },
                            { emoji: "🛠", text: "Discover locally relevant adaptation options" },
                            { emoji: "📊", text: "Filter by country, crop and hazard type" },
                            { emoji: "🧭", text: "Support decision making through open access and granular data", },
                        ].map((item, idx) => (
                            <Grid item xs={12} sm={6} md={4} key={idx}>
                                <Card className="card1"
                                    sx={{
                                        bgcolor: theme.palette.mode === "dark" ? "#2c2f34" : "#ffffff",
                                        borderRadius: "12px",
                                        boxShadow: theme.palette.mode === "dark" ? "0px 4px 10px rgba(0,0,0,0.4)" : "0px 4px 10px rgba(0,0,0,0.1)",
                                    }} >
                                    <CardContent className="cardBody"
                                        sx={{
                                            color: theme.palette.text.primary,
                                            fontFamily: '"Poppins", sans-serif',
                                            textAlign: "center",
                                        }} >
                                        <Typography sx={{ fontSize: "1.5rem", mt: 1 }}>
                                            <div className="roundedBox">{item.emoji}</div>
                                        </Typography>
                                        <Typography
                                            sx={{ fontSize: "18px", lineHeight: 1.6, mt: 2 }}>
                                            {item.text} </Typography>
                                    </CardContent>
                                </Card> </Grid>))}
                    </Grid>
                </Box>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#1a1d21" : "#fff",
                }}
            >
                <Box className="aboutSectionApproach" sx={{ mt: 4, pb: 4, p: 5 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#F2F4F3" : "#1a1d21",
                            fontFamily: '"Poppins", sans-serif',
                            textAlign: "center!important",
                        }}
                    >
                        ACASA Approach
                    </Typography>
                    <Container maxWidth="lg">
                        <img
                            className="w-100"
                            src={`${process.env.PUBLIC_URL}/ACASA_Approach_SL.svg`}
                            style={{
                                filter: theme.palette.mode === "dark" ? "invert(93%) sepia(5%) saturate(166%) hue-rotate(180deg) brightness(100%) contrast(85%)" : "none",
                            }}
                            alt="approach"
                            loading="lazy"
                        />
                        {/* <img src="/images/approach.svg" alt="" /> */}
                        <Button
                            component={Link}
                            to="/about"
                            className="btn btnAbout"
                            sx={{
                                bgcolor: theme.palette.mode === "dark" ? "#61c258" : "#4C9E46",
                                color: "#ffffff",
                                mt: 2,
                                "&:hover": {
                                    bgcolor: theme.palette.mode === "dark" ? "#4ba046" : "#3d8b3a",
                                },
                            }}
                        >
                            More About Us
                        </Button>
                    </Container>
                </Box>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff",
                }}
            >
                <Box className="aboutSectionApproach" sx={{ mt: 0, pb: 0, pt: 4 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            fontFamily: '"Poppins", sans-serif',
                            textAlign: "center!important",
                            mt: 5,
                            mb: 2
                        }}
                    >
                        Use Cases
                    </Typography>
                    <Tabs
                        className="btnTabs"
                        value={value}
                        onChange={handleChange}
                        centered
                        sx={{
                            "& .MuiTab-root": {
                                color:
                                    theme.palette.mode === "dark" ? "#cccccc" : "#00000080",
                                fontFamily: '"Poppins", sans-serif',
                                fontWeight: 400,
                                fontSize: '18px'
                            },
                            "& .Mui-selected": {
                                color: "#ffffff",
                                bgcolor: theme.palette.mode === "dark" ? "#61c258" : "#4C9E46",
                                borderRadius: "12px",
                            },
                            "& .MuiTabs-indicator": {
                                display: "none",
                            },
                        }}
                    >
                        {useCases.map((useCase, index) => (
                            <Tab
                                key={index}
                                className="tabBtn"
                                label={useCase.title}
                                sx={{
                                    borderRadius: "12px",
                                    mx: 1,
                                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                    "&.Mui-selected": {
                                        bgcolor:
                                            theme.palette.mode === "dark" ? "#fff" : "#4C9E46",
                                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                    },
                                }}
                            />
                        ))}
                    </Tabs>
                    {useCases.map((useCase, index) => (
                        <TabPanel key={index} value={value} index={index}>
                            <Container maxWidth="xl">
                                <Card
                                    className=""
                                    sx={{
                                        maxWidth: "100%",
                                        m: 2,
                                        p: 4,
                                        bgcolor:
                                            theme.palette.mode === "dark" ? "#2c2f34" : "#f2f4f3",
                                        borderRadius: "12px",
                                        boxShadow:
                                            theme.palette.mode === "dark"
                                                ? "0px 4px 10px rgba(0,0,0,0.4)"
                                                : "0px 4px 10px rgba(0,0,0,0.1)",
                                    }}
                                >
                                    <CardContent>
                                        <Grid container spacing={2} justifyContent="space-between">
                                            <Grid container spacing={2} justifyContent="space-between">
                                                <Grid item xs={12} md={5}>
                                                    <Box sx={{ width: "100%", height: "100%", p: 0 }}>
                                                        <Box
                                                            component="img"
                                                            src={useCase.image}
                                                            alt={useCase.title}
                                                            sx={{
                                                                width: "100%",
                                                                height: "500px",
                                                                objectFit: "cover",
                                                                display: "block",
                                                                borderRadius: "8px",
                                                            }}
                                                        />


                                                    </Box>
                                                </Grid>
                                                <Grid item xs={12} md={7}
                                                    sx={{
                                                        p: 3,
                                                        pt: 0,
                                                        color: theme.palette.text.primary,
                                                        "& h1": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            color:
                                                                theme.palette.mode === "dark"
                                                                    ? "#fff"
                                                                    : "#000",
                                                            fontSize: "32px",
                                                            fontWeight: "500",
                                                            marginBottom:'0px',
                                                            paddingLeft:'20px'
                                                        },
                                                        "& p": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            fontSize: "18px",
                                                            lineHeight: 1.6,
                                                            fontWeight: "400",
                                                            paddingLeft: "0px",
                                                        },
                                                        "& h5": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            fontSize: "22px",
                                                            fontWeight: "600",
                                                            color:
                                                                theme.palette.mode === "dark"
                                                                    ? "#fff"
                                                                    : "#000",
                                                            margin: theme.spacing(2, 0, 1),
                                                        },
                                                    }}>
                                                    <Typography variant="h1">{useCase.title}</Typography>

                                                    <Box
                                                        sx={{
                                                            pt: 1,
                                                            p: 3,
                                                            color: theme.palette.text.primary,
                                                            "& h1": {
                                                                fontFamily: '"Poppins", sans-serif',
                                                                color:
                                                                    theme.palette.mode === "dark"
                                                                        ? "#fff"
                                                                        : "#000",
                                                                fontSize: "32px",
                                                                fontWeight: "500",
                                                                paddingLeft:'20px',
                                                            },
                                                            "& p": {
                                                                fontFamily: '"Poppins", sans-serif',
                                                                fontSize: "18px",
                                                                lineHeight: 1.6,
                                                                fontWeight: "400",
                                                                paddingLeft:'0px',
                                                            },
                                                            "& h5": {
                                                                fontFamily: '"Poppins", sans-serif',
                                                                fontSize: "22px",
                                                                fontWeight: "600",
                                                                color:
                                                                    theme.palette.mode === "dark"
                                                                        ? "#fff"
                                                                        : "#000",
                                                                margin: theme.spacing(2, 0, 1),
                                                            },
                                                        }}
                                                    >

                                                        {useCase.content}
                                                    </Box>
                                                </Grid>
                                            </Grid>
                                            {/* <Grid item xs={12} md={12}>
                                                <Box
                                                    sx={{
                                                        pt: 1,
                                                        color: theme.palette.text.primary,
                                                        "& h1": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            color:
                                                                theme.palette.mode === "dark"
                                                                    ? "#fff"
                                                                    : "#000",
                                                            fontSize: "32px",
                                                            fontWeight: "500",
                                                        },
                                                        "& p": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            fontSize: "18px",
                                                            lineHeight: 1.6,
                                                            fontWeight: "400",
                                                        },
                                                        "& h5": {
                                                            fontFamily: '"Poppins", sans-serif',
                                                            fontSize: "24px",
                                                            fontWeight: "500",
                                                            color:
                                                                theme.palette.mode === "dark"
                                                                    ? "#fff"
                                                                    : "#000",
                                                            margin: theme.spacing(2, 0, 1),
                                                        },
                                                    }}
                                                >

                                                    {useCase.content}
                                                </Box>
                                            </Grid> */}
                                        </Grid>
                                    </CardContent>
                                </Card>
                            </Container>
                        </TabPanel>
                    ))}
                    <Button
                        component={Link}
                        to="/usecases"
                        className="btn btnAbout"
                        sx={{
                            bgcolor: theme.palette.mode === "dark" ? "#61c258" : "#4C9E46",
                            color: "#ffffff",
                            mt: 2,
                            mb: 4,
                            fontFamily:'Poppins',
                            "&:hover": {
                                bgcolor: theme.palette.mode === "dark" ? "#4ba046" : "#3d8b3a",
                            },
                        }}
                    >
                        Explore the Atlas
                    </Button>
                </Box>
            </Container>
            {/* <Container
                maxWidth="xl"
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#25292e" : "#fff",
                }}
            >
                <Box className="aboutSectionApproach" sx={{ p: 5 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            fontFamily:'"Poppins", sans-serif',
                            textAlign: "center!important",
                        }}
                    >
                        Resources
                    </Typography>
                    <Container maxWidth="xl">
                        <Grid container spacing={3}>
                            {[
                                {
                                    title: "Maize, Agribusiness",
                                    description:
                                        "Building Capabilities of Medium and Large-Scale Sri Lankan Maize Growers in Agricultural Risk Management",
                                },
                                {
                                    title: "Capacity building, women",
                                    description:
                                        "ACASA for empowering women-led social entrepreneurs in Nepal: Building climate-resilient forage for a sustainable livestock ecosystem",
                                },
                                {
                                    title: "Adaptation, local-level planning",
                                    description:
                                        "Strengthening the model of “Adaptation Clinic” through data-driven local level adaptation planning in Bangladesh",
                                },
                            ].map((resource, idx) => (
                                <Grid item xs={12} sm={6} md={4} key={idx}>
                                    <Card
                                        className="resourceCard"
                                        sx={{
                                            bgcolor:
                                                theme.palette.mode === "dark" ? "#2c2f34" : "#f0f0f0",
                                            borderRadius: "12px",
                                            boxShadow:
                                                theme.palette.mode === "dark"
                                                    ? "0px 4px 10px rgba(0,0,0,0.4)"
                                                    : "0px 4px 10px rgba(0,0,0,0.1)",
                                        }}
                                    >
                                        <CardContent>
                                            <Box
                                                className="whiteBox"
                                                sx={{
                                                    bgcolor:
                                                        theme.palette.mode === "dark" ? "#4c9e461a" : "#fff",
                                                    height: "150px",
                                                    borderRadius: "8px",
                                                }}
                                            >
                                            </Box>
                                            <Box className="ContentBox">
                                                <Typography
                                                    variant="h4"
                                                    sx={{
                                                        color:
                                                            theme.palette.mode === "dark"
                                                                ? "#b0e3ae"
                                                                : "#4ba046",
                                                         fontFamily: '"Poppins", sans-serif',
                                                        mt: 2,
                                                    }}
                                                >
                                                    {resource.title}
                                                </Typography>
                                                <Typography
                                                    sx={{
                                                        color:
                                                            theme.palette.mode === "dark"
                                                                ? "#fff"
                                                                : "#4ba046",
                                                        fontSize: "12px",
                                                        lineHeight: 1.6,
                                                        mt: 2,
                                                    }}
                                                >
                                                    {resource.description}
                                                </Typography>
                                            </Box>
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                        <Button
                            className="btn btnAbout1"
                            sx={{
                                bgcolor: theme.palette.mode === "dark" ? "#61c258" : "#4C9E46",
                                color: "#ffffff",
                                mt: 2,
                                "&:hover": {
                                    bgcolor: theme.palette.mode === "dark" ? "#4ba046" : "#3d8b3a",
                                },
                            }}
                        >
                            Explore More
                        </Button>
                    </Container>
                </Box>
            </Container> */}
            <Container maxWidth="xl" sx={{
                bgcolor: theme.palette.mode === "dark" ? "#1a1d21" : "#fff",
            }} >
                <Box className="aboutSectionApproach" sx={{ p: 2 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            fontFamily: '"Poppins", sans-serif',
                            textAlign: "center!important",
                        }}
                    >
                        Resources
                    </Typography>
                </Box>
                <Grid container spacing={3} sx={{ px: 5 }}>
                    {resources.map((resource, idx) => (
                        <Grid item xs={12} sm={6} md={4} key={idx}>
                            <Card
                                className="resourceCard"
                                sx={{
                                    bgcolor:
                                        theme.palette.mode === "dark" ? "#2c2f34" : "#f0f0f0",
                                    borderRadius: "12px",
                                    boxShadow:
                                        theme.palette.mode === "dark"
                                            ? "0px 4px 10px rgba(0,0,0,0.4)"
                                            : "0px 4px 10px rgba(0,0,0,0.1)",
                                }}
                            >
                                <CardContent>
                                    {/* 🔹 Image instead of whiteBox */}
                                    <CardMedia
                                        component="img"
                                        image={resource.image}
                                        alt={resource.title}
                                        sx={{
                                            borderRadius: "8px",
                                            width: "100%", // ✅ makes it full width of Card
                                            height: "250px", // ✅ fixed height
                                            objectFit: "cover", // ✅ keeps aspect ratio & crops nicely
                                        }}
                                    />
                                    <Box className="ContentBox">
                                        <Typography
                                            variant="h4"
                                            sx={{
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#b0e3ae"
                                                        : "#4ba046",
                                                mt: 2,
                                            }}
                                        >
                                            {resource.title}
                                        </Typography>
                                        <Typography
                                            sx={{
                                                color:
                                                    theme.palette.mode === "dark"
                                                        ? "#fff"
                                                        : "#000",
                                                fontSize: "12px",
                                                lineHeight: 1.6,
                                                mt: 2,
                                            }}
                                        >
                                            {resource.description}
                                        </Typography>
                                    </Box>
                                </CardContent>
                            </Card>
                        </Grid>
                    ))}
                </Grid>
                <Button
                    component={Link}
                    to="/resources" // 👈 your route path
                    className="btn btnAbout1"
                    sx={{
                        bgcolor: theme.palette.mode === "dark" ? "#61c258" : "#4C9E46",
                        color: "#ffffff",
                        mt: 2,
                        mb: 5,
                        fontFamily:'Poppins',
                        "&:hover": {
                            bgcolor: theme.palette.mode === "dark" ? "#4ba046" : "#3d8b3a",
                        },
                    }}
                >
                    Explore More
                </Button>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#25292e" : "#fff",
                }}
            >
                <Box className="aboutSectionApproach" sx={{ p: 5 }}>
                    <Typography
                        variant="h1"
                        sx={{
                            color: theme.palette.mode === "dark" ? "#fff" : "#000",
                            textAlign: "center!important",
                        }}
                    >
                        Our Partners
                    </Typography>
                    <Container maxWidth="md">
                        <Typography
                            className="paraOne"
                            sx={{
                                color: theme.palette.text.primary,
                                fontSize: "18px",
                                lineHeight: 1.6,
                                marginBottom: '30px',
                                px: 5,
                                mb: 5
                            }}
                        >
                            ACASA is a collaborative initiative powered by global and regional
                            leaders in agricultural innovation and climate science. Our partners
                            provide critical expertise, data, tools, and regional insights to drive
                            climate-resilient agriculture across South Asia.
                        </Typography>
                    </Container>
                    <Container maxWidth="xl">
                        <Grid container spacing={3} justifyContent="center" alignItems="center">
                            {partnerLogos.map((num) => (
                                <Grid
                                    item
                                    xs={6}
                                    sm={4}
                                    md={2}
                                    key={num}
                                    display="flex"
                                    justifyContent="center"
                                >
                                    <Card
                                        className="resourceCardPartner"
                                        sx={{
                                            bgcolor:
                                                theme.palette.mode === "dark" ? "transparent" : "#FAFAFA",
                                            borderRadius: "12px",
                                            boxShadow:
                                                theme.palette.mode === "dark"
                                                    ? "0px 4px 10px rgba(0,0,0,0.4)"
                                                    : "0px 4px 10px rgba(0,0,0,0.1)",
                                            transition: "transform 0.2s ease, box-shadow 0.2s ease",
                                            "&:hover": {
                                                boxShadow:
                                                    theme.palette.mode === "dark"
                                                        ? "0px 6px 16px rgba(0,0,0,0.6)"
                                                        : "0px 6px 16px rgba(0,0,0,0.2)",
                                                bgcolor: theme.palette.mode === "dark" ? "transparent" : "#fff",
                                            },
                                        }}
                                    >
                                        <CardContent
                                            sx={{
                                                p: 0,
                                                height: "100%",
                                                display: "flex",
                                                alignItems: "center",
                                                justifyContent: "center",
                                            }}
                                        >
                                            <SleekTooltip title={partnertooltip[num] || `Partner ${num}`} arrow>
                                                <img
                                                    src={
                                                        theme.palette.mode === "dark" && num === 5
                                                            ? `${process.env.PUBLIC_URL}/images/partner-${num}-dark.png`
                                                            : `${process.env.PUBLIC_URL}/images/partner-${num}.png`
                                                    }
                                                    alt={`partner-${num}`}
                                                    className="partner-img"
                                                />
                                            </SleekTooltip>
                                            {/* Gate Foundation */}
                                            {/* <img
                                                src="/images/gateFoundation.png"
                                                alt=""
                                                className="partner-img"
                                            /> */}
                                        </CardContent>
                                    </Card>
                                </Grid>
                            ))}
                        </Grid>
                    </Container>
                </Box>
            </Container>
            <Container
                maxWidth="xl"
                sx={{
                    bgcolor: theme.palette.mode === "dark" ? "#1a1d21" : "#F2F4F3",
                    py: 4,
                }}
            >
                <Box className="aboutSectionApproach" sx={{ overflowX: "auto" }}>
                    <Box
                        sx={{
                            display: "flex",
                            justifyContent: "center",
                            gap: 3,
                            flexWrap: { xs: "nowrap", sm: "wrap" },
                            px: 0,
                        }}
                    >
                        {contryLogos.map((num) => (
                            <Card
                                key={num}
                                className="countryLogos"
                                sx={{
                                    bgcolor: theme.palette.mode === "dark" ? "#1a1d21" : "tranparent",
                                    border: "none",
                                    boxShadow: "none",
                                    flex: "0 0 auto",
                                    width: 70,
                                    height: 70,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                    borderRadius: 2,
                                    px: 2
                                }}
                            >
                                <img
                                    src={`${process.env.PUBLIC_URL}/images/country-${num}.png`}
                                    alt={`country-${num}`}
                                />
                            </Card>
                        ))}
                    </Box>
                </Box>
            </Container>
            <StickyFooter />
        </Box>
    );
}
export default TestHome;