// Imports necessary libraries and components from Material UI for styling and functionality:
// React for building the component
// ChevronRightRounded icon for the "Find Out More" button
// Button, Card, CardContent, CardMedia, CardHeader, Typography components for layout and content
// Box component for managing layout with flexbox
// KeyboardArrowDownIcon icon (conditionally rendered)

import React from "react";
import ChevronRightRounded from "@mui/icons-material/ChevronRightRounded";
import Button from "@mui/material/Button";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import CardHeader from "@mui/material/CardHeader";
import { Typography } from "@mui/material";
import Box from "@mui/material/Box";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
import { BlogCard } from "./Blog_Card/Blog_Card";
import { motion } from "framer-motion";
import ColorThief from "color-thief-browser";

function createData(imgSrc, imgAlt, title, author, link, keywords = [], date) {
  return { imgSrc, imgAlt, title, author, link, keywords, date };
}

const data = [
  createData(
    `${process.env.PUBLIC_URL}/Blog-14.jpeg`,
    "Blog 1",
    "Finding resilience in the rains of Nawalapitiya, Kandy",
    "Riya Gupta, Communications Officer, BISA",
    "https://bisa.org/finding-resilience-in-the-rains-of-nawalapitiya-kandy/",
    ["Women farmers,", "climate,", "resilience"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-15.jpg`,
    "Blog 2",
    "Driving agricultural transformation through digital innovation",
    "Prasun Gangopadhyay, Borlaug Institute for South Asia (BISA)",
    "https://bisa.org/driving-agricultural-transformation-through-digital-innovation/",
    ["Digital agriculture,", "remote sensing"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-10.jpg`,
    "Blog 3",
    "Building capabilities of medium and large-scale Sri Lankan maize growers in agricultural risk management",
    "ASM Roshan, Agribusiness Development Centre, Department of Agriculture, Sri Lanka, and WMUK Rathnayake, Natural Resources Management Centre (NRMC), Department of Agriculture, Sri Lanka",
    "https://bisa.org/building-capabilities-of-medium-and-large-scale-sri-lankan-maize-growers-in-agricultural-risk-management/",
    ["Maize,", "agribusiness"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-11.jpg`,
    "Blog 4",
    "ACASA for empowering women-led social entrepreneurs in Nepal: Building climate-resilient forage for a sustainable livestock ecosystem",
    "Bhola Shrestha, Heifer International, Nepal, and Sunita Sanjyal, Nepal Agricultural Research Council, Nepal",
    "https://bisa.org/acasa-for-empowering-women-led-social-entrepreneurs-in-nepal-building-climate-resilient-forage-for-a-sustainable-livestock-ecosystem/",
    ["Capacity building,", "women"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-13.jpg`,
    "Blog 5",
    "Strengthening the model of “Adaptation Clinic” through data-driven local level adaptation planning in Bangladesh",
    "Tausif Ahmed Qurashi, BRAC, Bangladesh, and Md. Abdus Salam, Bangladesh Agricultural Research Council (BARC), Bangladesh",
    "https://bisa.org/strengthening-the-model-of-adaptation-clinic-through-data-driven-local-level-adaptation-planning-in-bangladesh/",
    ["Adaptation,", "local-level planning"]
  ),
  createData(`${process.env.PUBLIC_URL}/blognew1.png`, "Blog 6", "Greater successes through NARS partnerships", "Tess Russo, BMGF, Seattle, USA", "https://bisa.org/greater-successes-through-nars-partnerships/", [
    "Partnership,",
    "NARS,",
    "ACASA,",
    "BISA",
  ]),
  createData(
    `${process.env.PUBLIC_URL}/blognew2.jpeg`,
    "Blog 7",
    "Gridded crop modelling to simulate impacts of climate change and adaptation benefits in ACASA",
    "Anooja Thomas, University of Florida, USA; Apurbo K Chaki, BARI, Bangladesh; Gerrit Hoogenboom, University of Florida, USA; and S Naresh Kumar, ICAR-IARI, India",
    "https://bisa.org/gridded-crop-modelling-to-simulate-impacts-of-climate-change-and-adaptation-benefits-in-acasa/",
    ["Crop models,", "simulations,", "adaptation"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/blognew3.png`,
    "Blog 8",
    "Harnessing econometric and statistical tools to support climate-resilient agriculture",
    "Kaushik Bora, BISA-CIMMYT, India and Prem Chand, ICAR-NIAP, India",
    "https://bisa.org/harnessing-econometric-and-statistical-tools-to-support-climate-resilient-agriculture/",
    ["Econometrics,", "profitability,", "statistical models,", "adaptation"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/blognew4.png`,
    "Blog 9",
    "Unlocking insights from literature: Exploring adaptation options in ACASA",
    "Aniket Deo, BISA-CIMMYT, India; Niveta Jain, ICAR-IARI, India; Roshan B Ojha, NARC, Nepal; and Sayla Khandoker, Bangladesh",
    "https://bisa.org/unlocking-insights-from-literature-exploring-adaptation-options-in-acasa/",
    ["SLR,", "adaptation options"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-5.jpg`,
    "Blog 10",
    "A new Climate Adaptation Atlas to safeguard South Asian agriculture",
    "Bram Govaerts, DG, CIMMYT & BISA and Arun Kumar Joshi, CIMMYT Asia Regional Representative and MD BISA",
    "https://www.cimmyt.org/blogs/a-new-climate-adaptation-atlas-to-safeguard-south-asian-agriculture/",
    ["ACASA,", "BISA,", "CIMMYT"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-1.jpg`,
    "Blog 11",
    "Adaptation Atlas is a positive step towards climate resilient agriculture",
    "Himanshu Pathak, Secretary (DARE) and Director General - ICAR, India",
    "https://www.cimmyt.org/blogs/adaptation-atlas-is-a-positive-step-towards-climate-resilient-agriculture/",
    ["ACASA,", "BISA,", "ICAR"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-2.jpg`,
    "Blog 12",
    "Bangladesh to improve risk characterization at a granular level with Atlas",
    "Shaikh Mohammad Bokhtiar, Executive Chairman, BARC, Bangladesh",
    "https://www.cimmyt.org/blogs/bangladesh-to-improve-risk-characterization-at-a-granular-level-with-atlas/",
    ["ACASA,", "BISA,", "BARC"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-3.jpg`,
    "Blog 13",
    "Atlas crucial to strengthen Nepal’s capacity to cope with climate change",
    "Dhruba Raj Bhattarai, Executive Director, NARC, Nepal",
    "https://www.cimmyt.org/blogs/atlas-crucial-to-strengthen-nepals-capacity-to-cope-with-climate-change/",
    ["ACASA,", "BISA,", "NARC"]
  ),
  createData(
    `${process.env.PUBLIC_URL}/Blog-4.jpg`,
    "Blog 14",
    "Climate Adaptation Atlas will support evidence-based solutions in Sri Lanka",
    "P. Malathy, DG-Agriculture, Sri Lanka",
    "https://www.cimmyt.org/news/climate-adaptation-atlas-will-support-evidence-based-solutions-in-sri-lanka/",
    ["ACASA,", "BISA,", "NRMC,", "Department of Agriculture"]
  ),
];

//Defines styles using Javascript objects for various image sizes used in the component.

export default function Card_Posts() {
  const [isPaused, setIsPaused] = React.useState(false);

  //This is the main component that returns JSX code for the blog posts section.
  //It uses a useState hook from React to manage the state of blogs (initially set to false). This state controls whether to show additional blog posts.

  return (
    <>
      <div
        style={{
          marginLeft: "0px", // Mobile default
          marginTop: "15px",
          marginBottom: "15px",
        }}
      >
        <Box
          sx={{
            marginLeft: { xs: 0, md: "70px" }, // 70px only for desktop
          }}
        >
          <div
            className="full-width-container"
            style={{
              position: "relative",
              width: "95%",
              minHeight: "400px",
              overflow: "hidden",
            }}
          >
            {/* Background Layer with Blur & Mask */}
            <div
              style={{
                position: "absolute",
                inset: 0,
                backgroundImage: `url(${process.env.PUBLIC_URL}/acasa_post_banner3.jpg)`,
                backgroundSize: "cover",
                backgroundPosition: "center",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,1) 50%, rgba(0,0,0,0) 100%)",
                zIndex: 0, // Keeps it behind the text
              }}
            />

            <Typography
              sx={(theme) => ({
                position: "absolute",
                bottom: "1px",
                right: "1px",
                fontSize: "18px",
                fontFamily: "Poppins",
                color: theme.palette.mode === "dark" ? "#e0e0e0" : "#1b1f23",
              })}
            >
              ©ACASA-BISA
            </Typography>

            {/* Image */}

            <Typography
              className="banner-title"
              sx={(theme) => ({
                color: theme.palette.mode === "dark" ? "#000" : "#fff",
                fontSize: { xs: "28px", sm: "40px" },
                fontWeight: "bold",
                fontFamily: "Poppins",
                WebkitMaskImage: "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
                maskImage: "linear-gradient(to right, rgba(0,0,0,1) 20%, rgba(0,0,0,0) 100%)",
                paddingLeft: "10px",
              })}
            >
              ACASA Posts
            </Typography>

            {/* Animated Shape & Slogan */}
            <div className="slogan-wrapper">
              <motion.div
                className="animated-shape"
                style={{ transform: "translateY(-60px)" }}
                animate={{
                  scale: [1, 2, 2, 1, 1],
                  rotate: [0, 0, 180, 180, 0],
                  borderRadius: ["0%", "0%", "50%", "50%", "0%"],
                }}
                transition={{
                  duration: 4,
                  ease: "easeInOut",
                  times: [0, 0.2, 0.5, 0.8, 1],
                  repeat: Infinity,
                  repeatDelay: 1,
                }}
              />

              {/* Slogan Text */}
              <motion.div className="slogan-text" style={{ transform: "translateY(-60px)" }} initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1, duration: 1 }}>
                <Typography
                  sx={(theme) => ({
                    fontFamily: "Poppins",
                    fontSize: { xs: "32px", sm: "50px" },
                    fontWeight: "bold",
                    color: theme.palette.mode === "dark" ? "#e0e0e0" : "#222529", // Main text color
                    textShadow: theme.palette.mode === "dark" ? "8px 0px 6px rgba(30, 30, 30, 0.8)" : "8px 0px 6px rgba(30, 30, 30, 0.4)",
                  })}
                >
                  Insights
                </Typography>
                <Typography sx={(theme) => ({ fontFamily: "Poppins", fontSize: { xs: "18px", sm: "24px" }, fontWeight: "bold", color: theme.palette.mode === "dark" ? "#e0e0e0" : "#222529" })}>
                  from our global experts on
                </Typography>
                <Typography
                  sx={(theme) => ({ fontFamily: "Poppins", fontSize: { xs: "18px", sm: "24px" }, fontWeight: "bold", color: theme.palette.mode === "dark" ? "#00C853" : "#4d7553", display: "inline" })}
                >
                  climate
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontFamily: "Poppins",
                    fontSize: { xs: "18px", sm: "24px" },
                    fontWeight: "bold",
                    color: theme.palette.mode === "dark" ? "#e0e0e0" : "#222529",
                    display: "inline",
                    marginLeft: 1,
                  })}
                >
                  and
                </Typography>
                <Typography
                  sx={(theme) => ({
                    fontFamily: "Poppins",
                    fontSize: { xs: "18px", sm: "24px" },
                    fontWeight: "bold",
                    color: theme.palette.mode === "dark" ? "#00C853" : "#4d7553",
                    display: "inline",
                    marginLeft: 1,
                  })}
                >
                  South Asian agriculture
                </Typography>
              </motion.div>
            </div>
          </div>
        </Box>
      </div>

      <Box
        sx={(theme) => ({
          width: "100%",
          display: "flex",
          flexDirection: "column",
          gap: "15px",
          backgroundColor: theme.palette.mode === "dark" ? "#2f6742" : "rgba(75, 160, 70, 0.8)",
        })}
      >
        <Box
          className="blog-container"
          sx={(theme) => ({
            /*backgroundColor: theme.palette.mode === "dark" ? "#2f6742" : "#e0e0e0"*/
          })}
        >
          {data.map((item, index) => (
            <BlogCard key={index} imgSrc={item.imgSrc} imgAlt={item.imgAlt} title={item.title} link={item.link} keywords={item.keywords} date={item.date} />
          ))}
        </Box>
      </Box>
    </>
  );
}

{
  /*
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/blognew1.png`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="Greater successes through NARS partnerships"
            subheader="By Tess Russo, BMGF, Seattle, USA"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              BISA has been an exemplary partner in building and supporting a strong ACASA team and establishing strong, financially supported partnerships with NARS.
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://bisa.org/greater-successes-through-nars-partnerships/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
        {/* The component uses a div with styles for margin. */
}
{
  /* Inner content is wrapped in a Box component with flexbox for responsive layout (different screen sizes). */
}

{
  /*
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/blognew2.jpeg`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="Gridded crop modelling to simulate impacts of climate change and adaptation benefits in ACASA"
            subheader="By Anooja Thomas, University of Florida, USA; Apurbo K Chaki, BARI, Bangladesh; Gerrit Hoogenboom, University of Florida, USA; and S Naresh Kumar, ICAR-IARI, India"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              Gridded crop modelling builds an understanding of how climate change impacts crops, helping researchers to adapt agricultural methods and combat food insecurity.
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://bisa.org/gridded-crop-modelling-to-simulate-impacts-of-climate-change-and-adaptation-benefits-in-acasa/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
        {/* More Blogs" Button (Conditional):
A Box component is conditionally rendered based on the blogs state.
If blogs is false, it displays a button "More Blogs" with a down arrow icon.
Clicking the button triggers a function using onClick that sets blogs to true (showing more posts). */
}
{
  /*
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/blognew3.png`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="Harnessing econometric and statistical tools to support climate-resilient agriculture"
            subheader="By Kaushik Bora, BISA-CIMMYT, India and Prem Chand, ICAR-NIAP, India"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              Econometric and statistical methods lead to informed decision-making and safeguards agricultural productivity in the face of climatic hazards in South Asia{" "}
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://bisa.org/harnessing-econometric-and-statistical-tools-to-support-climate-resilient-agriculture/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
      </Box>
      <Box
        sx={{
          width: "100%",
          display: "flex",
          flexDirection: "row",
          gap: "15px",
          marginTop: "20px",
        }}
      >
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/blognew4.png`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="Unlocking insights from literature: Exploring adaptation options in ACASA"
            subheader="By Aniket Deo, BISA-CIMMYT, India; Niveta Jain, ICAR-IARI, India; Roshan B Ojha, NARC, Nepal; and Sayla Khandoker, Bangladesh"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              Using systematic literature review, ACASA has identified key climate adaptation options and assessed their effectiveness.
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://bisa.org/unlocking-insights-from-literature-exploring-adaptation-options-in-acasa/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/Blog-5.jpg`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="A new Climate Adaptation Atlas to safeguard South Asian agriculture"
            subheader="By Bram Govaerts, DG, CIMMYT & BISA and Arun Kumar Joshi, CIMMYT Asia Regional Representative and MD BISA"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              Climate change is no longer a distant threat but a reality that profoundly affects our lives. Among the most vulnerable regions to climate change, South Asia stands out because it is...
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://www.cimmyt.org/blogs/a-new-climate-adaptation-atlas-to-safeguard-south-asian-agriculture/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
        <Card
          sx={(theme) => ({
            "maxWidth": "30%",
            "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
            "borderRadius": 0,
            "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
            "&:hover": {
              boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
              transform: "scale(1.04)",
            },
          })}
        >
          <CardMedia
            image={`${process.env.PUBLIC_URL}/Blog-1.jpg`
            sx={(theme) => ({
              width: "100%",
              height: 0,
              paddingBottom: "56.25%",
              backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
            })}
          />
          <CardHeader
            titleTypographyProps={{
              sx: { fontSize: "16px", fontWeight: "bold" },
              marginTop: 2,
            }}
            subheaderTypographyProps={{
              color: (theme) => (theme.palette.mode === "dark" ? "#81c784" : "#52911f"),
              marginTop: 1,
              sx: { fontSize: "12px" },
            }}
            title="Adaptation Atlas is a Positive Step Towards Climate Resilient Agriculture"
            subheader="By Himanshu Pathak, Secretary (DARE) and Director General - ICAR, India"
            sx={{ marginTop: -1, marginBottom: -1 }}
          />
          <CardContent sx={{ marginBottom: -4 }}>
            <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
              India holds an impressive record in agricultural production. We are among the largest producers of milk, pulses, tea, spices, cashew, jute, and bananas.{" "}
            </Typography>
          </CardContent>
          <CardContent>
            <a href="https://www.cimmyt.org/blogs/adaptation-atlas-is-a-positive-step-towards-climate-resilient-agriculture/" target="_blank" rel="noopener noreferrer">
              <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                Find Out More <ChevronRightRounded />
              </Button>
            </a>
          </CardContent>
        </Card>
      </Box>
      {blogs === false && (
        <Box sx={{ marginTop: "20px", marginRight: "85px" }}>
          <Button color={"success"} fullWidth sx={{ textTransform: "initial" }} onClick={() => setBlogs(true)}>
            <Typography sx={(theme) => ({ color: (theme) => (theme.palette.mode === "dark" ? "#e0e0e0" : "#222") })}>More Blogs </Typography>
            <KeyboardArrowDownIcon sx={(theme) => ({ color: (theme) => (theme.palette.mode === "dark" ? "#e0e0e0" : "#222") })} />
          </Button>
        </Box>
      )}
      {blogs && (
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "row",
            gap: "15px",
            marginTop: "20px",
          }}
        >
          <Card
            sx={(theme) => ({
              "maxWidth": "30%",
              "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
              "borderRadius": 0,
              "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:hover": {
                boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
                transform: "scale(1.04)",
              },
            })}
          >
            <CardMedia
              image={`${process.env.PUBLIC_URL}/Blog-2.jpg`
              sx={(theme) => ({
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
              })}
            />
            <CardHeader
              titleTypographyProps={{
                sx: { fontSize: "16px", fontWeight: "bold" },
                marginTop: 2,
              }}
              subheaderTypographyProps={{
                color: "#52911f",
                marginTop: 1,
                sx: { fontSize: "12px" },
              }}
              title="Bangladesh to improve risk characterization at a granular level with Atlas"
              subheader="By Shaikh Mohammad Bokhtiar, Executive Chairman, BARC, Bangladesh"
              sx={{ marginTop: -1, marginBottom: -1 }}
            />
            <CardContent sx={{ marginBottom: -4 }}>
              <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
                Bangladesh is one of the most climate-vulnerable countries in the world. The climate risks are impacting the country’s agricultural sector, which constitutes nearly 12% of the
                country’s GDP.{" "}
              </Typography>
            </CardContent>
            <CardContent>
              <a href="https://www.cimmyt.org/blogs/bangladesh-to-improve-risk-characterization-at-a-granular-level-with-atlas/" target="_blank" rel="noopener noreferrer">
                <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                  Find Out More <ChevronRightRounded />
                </Button>
              </a>
            </CardContent>
          </Card>
          <Card
            sx={(theme) => ({
              "maxWidth": "30%",
              "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
              "borderRadius": 0,
              "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:hover": {
                boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
                transform: "scale(1.04)",
              },
            })}
          >
            <CardMedia
              image={`${process.env.PUBLIC_URL}/Blog-3.jpg`
              sx={(theme) => ({
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
              })}
            />
            <CardHeader
              titleTypographyProps={{
                sx: { fontSize: "16px", fontWeight: "bold" },
                marginTop: 2,
              }}
              subheaderTypographyProps={{
                color: "#52911f",
                marginTop: 1,
                sx: { fontSize: "12px" },
              }}
              title="Atlas crucial to strengthen Nepal’s capacity to cope with climate change"
              subheader="By Dhruba Raj Bhattarai, Executive Director, NARC, Nepal"
              sx={{ marginTop: -1, marginBottom: -1 }}
            />
            <CardContent sx={{ marginBottom: -4 }}>
              <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
                Nepal, like other South Asian nations, faces significant environmental challenges, including climate change and air pollution. The impacts of climate change in Nepal are profound...{" "}
              </Typography>
            </CardContent>
            <CardContent>
              <a href="https://www.cimmyt.org/blogs/atlas-crucial-to-strengthen-nepals-capacity-to-cope-with-climate-change/" target="_blank" rel="noopener noreferrer">
                <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                  Find Out More <ChevronRightRounded />
                </Button>
              </a>
            </CardContent>
          </Card>
          <Card
            sx={(theme) => ({
              "maxWidth": "30%",
              "boxShadow": theme.palette.mode === "dark" ? "0 0 4px rgba(255,255,255,0.2)" : "0 0 2px rgba(0,0,0,0.12)",
              "borderRadius": 0,
              "transition": "0.3s cubic-bezier(.47,1.64,.41,.8)",
              "&:hover": {
                boxShadow: theme.palette.mode === "dark" ? "0 4px 20px rgba(255,255,255,0.2)" : "0 4px 20px rgba(0,0,0,0.12)",
                transform: "scale(1.04)",
              },
            })}
          >
            <CardMedia
              image={`${process.env.PUBLIC_URL}/Blog-4.jpg`
              sx={(theme) => ({
                width: "100%",
                height: 0,
                paddingBottom: "56.25%",
                backgroundColor: theme.palette.mode === "dark" ? "rgba(255, 255, 255, 0.12)" : "rgba(0, 0, 0, 0.08)",
              })}
            />
            <CardHeader
              titleTypographyProps={{
                sx: { fontSize: "16px", fontWeight: "bold" },
                marginTop: 2,
              }}
              subheaderTypographyProps={{
                color: "#52911f",
                marginTop: 1,
                sx: { fontSize: "12px" },
              }}
              title="Climate Adaptation Atlas will support evidence-based solutions in Sri Lanka"
              subheader="By P. Malathy, DG-Agriculture, Sri Lanka"
              sx={{ marginTop: -1, marginBottom: -1 }}
            />
            <CardContent sx={{ marginBottom: -4 }}>
              <Typography sx={{ textAlign: "justify", fontSize: "14px" }}>
                We are all aware the immense challenges countries face due to climate change, particularly its impacts on vital sectors like agriculture, forestry and livestock.{" "}
              </Typography>
            </CardContent>
            <CardContent>
              <a href="https://www.cimmyt.org/news/climate-adaptation-atlas-will-support-evidence-based-solutions-in-sri-lanka/" target="_blank" rel="noopener noreferrer">
                <Button color={"success"} fullWidth sx={{ mt: 3, textTransform: "initial" }}>
                  Find Out More <ChevronRightRounded />
                </Button>
              </a>
            </CardContent>
          </Card> */
}

// First Row of Blog Posts:

// Renders three Card components in a row using a Box with flexbox.
// Each Card has styles for width, box shadow, hover effect, and responsiveness.
// CardMedia component displays the blog post image with a placeholder aspect ratio.
// CardHeader displays the title, subheader (author information), and custom styles for margins.
// CardContent holds the blog post description and a "Find Out More" button.
// Typography component displays the blog description text with justification and font size styles.
// Button component with "success" color, full width, custom styles, and hover effect.
// The button links to the blog post using an anchor tag with:
// href attribute for the blog post URL.
// target="_blank" to open the link in a new tab.
// rel="noopener noreferrer" for security reasons.

// Second Row of Blog Posts (Conditional):
// Another Box component with flexbox is conditionally rendered based on the blogs state.
// If blogs is true, it displays three more Card components in a similar structure as the first row.