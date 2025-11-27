import React, { useState } from "react";
import {
    Accordion,
    AccordionSummary,
    AccordionDetails,
    Typography,
    Box,
    Grid,
    Container,
    useTheme,
} from "@mui/material";
import { styled } from "@mui/system";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

// Styled component for the introductory section
const IntroBox = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#2c2f34" : "#f5f5f5",
    padding: theme.spacing(4),
    borderRadius: "12px",
    textAlign: "center",
    boxShadow:
        theme.palette.mode === "dark"
            ? "0px 4px 10px rgba(0,0,0,0.4)"
            : "0px 4px 10px rgba(0,0,0,0.1)",
    marginBottom: theme.spacing(3),
    "& h1": {
        color: theme.palette.mode === "dark" ? "#61c258" : "#4ba046",
        fontFamily: "Poppins",
        fontWeight: "bold",
        "& span": {
            color: theme.palette.mode === "dark" ? "#b0e3ae" : "#c4ecc2",
        },
    },
    "& p": {
        color: theme.palette.text.primary,
        fontFamily: "Poppins",
        textAlign: "left",
        fontSize: "1rem",
        lineHeight: 1.6,
    },
}));

// Styled component for the accordion container
const AccordionContainer = styled(Box)(({ theme }) => ({
    backgroundColor: theme.palette.mode === "dark" ? "#1a1d21" : "#ffffff",
    padding: theme.spacing(2),
    borderRadius: "12px",
}));

function UseCases() {
    const [expanded, setExpanded] = useState("panel1");
    const theme = useTheme();

    const handleChange = (panel) => (_, isExpanded) => {
        setExpanded(isExpanded ? panel : false);
    };

    return (
        <Box
            sx={{
                paddingTop: "50px",
                textAlign: "center",
                minHeight: "100vh", // Changed to minHeight for better scrolling behavior
                overflow: "auto",
                bgcolor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff",
            }}
        >
            <Container maxWidth="xl">
                <Container maxWidth="md">
                    <Box className="AboutSectionCase" sx={{
                        p: 2,
                    }}>
                        <h1 style={{
                            color: theme.palette.text.primary,
                        }}>
                            Use Cases of <span>ACASA </span>
                        </h1>
                        <p style={{
                            color: theme.palette.text.primary,
                        }}>
                            ACASA is a unique platform that provides an integrated assessment of commodity-specific granular climate risk profiles and information on adaptation
                            options for South Asian agriculture. This is done for region’s major agricultural and livestock commodities at a 5 km resolution. In addition,
                            it also identifies regions where adaptation benefits would emerge through gender-friendly technology adoption and would curtail maladaptation.
                        </p>
                        <p style={{
                            color: theme.palette.text.primary,
                        }}>Our adaptation options are rigorously formulated from the relevant literature and validated stakeholder consultations across South Asia.
                            Therefore, ACASA provides a unique opportunity for various stakeholders to meet their potential needs in broader areas of climate risk management
                            and adaptation in agriculture. The open-access nature of the Atlas promotes knowledge dissemination and unrestricted use for desired purposes.
                            ACASA data can be freely downloaded in a tabular, user-friendly format with geographic information system (GIS) datasets for specific applications.</p>
                        <p style={{
                            color: theme.palette.text.primary,
                        }}>We conducted a dedicated ‘Use Case Workshop’ on Oct 1-3, 2024, in Colombo, Sri Lanka, for potential stakeholders who will put the Atlas into use.
                            Upon the stakeholder consultation, the following use cases were identified.</p>
                    </Box>
                </Container>


                <AccordionContainer>
                    {[
                        {
                            panel: "panel1",
                            title: "Government",
                            image: `${process.env.PUBLIC_URL}/images/govt.png`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA can be useful for climate risk profiling and regional adaptation prioritisation. Insights from ACASA would help government agencies determine future investment requirements for climate risk mitigation and regional scaling opportunities.
                                    </Typography>
                                    <Typography variant="h5" component="h5" sx={{ fontSize: '18px', textAlign: 'left', fontWeight: '500' }}>
                                        Evidence-based policymaking:
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        The Atlas provides data and analysis to support policymaking for climate-resilient agriculture and strategic resource allocation. The Atlas identifies sustainable practices and resilient farming methods to support rural climate-resilient infrastructure and finance requirements.
                                    </Typography>
                                    <Typography variant="h5" component="h5" sx={{ fontSize: '18px', textAlign: 'left', fontWeight: '500' }}>
                                        National Adaptation Plan:
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas could provide relevant stakeholder-validated adaptation options to be integrated into the National Adaptation Plans of respective countries.
                                    </Typography>
                                    <Typography variant="h5" component="h5" sx={{ fontSize: '18px', textAlign: 'left', fontWeight: '500' }}>
                                        Climate-Smart Villages:
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas will support scaling climate-resilient agriculture and villages by providing granular information on select implementation sites.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel2",
                            title: "Research",
                            image: `${process.env.PUBLIC_URL}/images/research1.jpg`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Empowering researchers with high-resolution, multi-dimensional data for robust climate agriculture analysis in South Asia.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Agricultural research
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas provides a comprehensive platform for climate-related data products for agricultural research. Commodity-specific hazard and adaptation identification methodology and tools can be used for interdisciplinary research on various aspects of climate risk management.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Impact evaluation and assessment
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas can enable hotspot identification and gendered vulnerability assessments at granular levels, ideal for targeted fieldwork or impact evaluation. ACASA’s repository of evidence on climate-smart agriculture practices allows researchers to validate hypotheses and derive regionally relevant findings.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel3",
                            title: "Civil Society",
                            image: `${process.env.PUBLIC_URL}/images/civil.jpg`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA provides open-access and freely downloadable products on climate risk management in agriculture.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Strengthen climate action
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA can help civil societies prioritize the interventions for climate action and promote climate-resilient agricultural practices and technologies as an adaptation measure to climate change.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Climate-related proposal
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA can provide detailed insights and information in developing climate context for new project proposals.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel4",
                            title: "Credit and Finance",
                            image: `${process.env.PUBLIC_URL}/images/credit.jpg`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Enabling credit and financial institutions to leverage climate-agriculture data for risk-informed lending and climate-smart investment products.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Credit re-assessment
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas to enable policy advocacy for facilitating the use of climate risk database for agricultural credit risk assessment, risk pricing, and asset quality.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Development of Agri-financing products
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Banks and MFIs can use ACASA to de-risk loans by aligning credit products with low-risk, high-solvency regions. Data on cost-benefit and scalability supports the design of climate-smart loan products and blended finance schemes.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Gender-sensitive credit scheme
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Gendered insights allow financial institutions to design women-focused credit solutions, encouraging inclusive lending.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel5",
                            title: "Multi-lateral Agencies",
                            image: `${process.env.PUBLIC_URL}/images/multi.jpg`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA will provide multi-lateral agencies with strategic data insights and directions for adaptation investments in South Asia and facilitate more effective project design and planning.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Climate finance
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Agencies can systematically integrate ACASA adaptation recommendations in their climate finance planning process to align with the Paris Agreement and sustainable development goals. Data will support agencies in focusing on targeted investments such as climate-resilient food systems, landscapes, and livelihoods, especially in regions with high adaptation benefits.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Targeted high-impact investments
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Donors can utilize ACASA to prioritize high-impact locations for climate-smart agriculture projects benefiting small-scale farmers and promote adaptation strategies.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Gender-intentional adaptations
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        The Atlas includes information on gender-intentional adaptations, guiding donors to promote equity in climate adaptation projects.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Monitoring and evaluation
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA is an innovative tool for agencies as they constantly seek information and expertise in improving the effectiveness and impact of their initiative. Atlas provides accessible and actionable data through open-access, user-friendly tables and maps for informed resource allocation and structured interventions.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel6",
                            title: "Insurance Industry",
                            image: `${process.env.PUBLIC_URL}/images/insurance.png`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Atlas can support Agri-insurance agencies in developing satisfactory crop insurance products for dynamic small-scale producers, providing sufficient resolution at the village level.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Methodology Improvement
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        A granular risk assessment of Atlas can aid in improving the existing methodology for insurance product design and payout mechanism. Implementing a parametric mechanism for insurance claims could improve efficiency, triggered only by specific conditions rather than random samples.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Premium set-up
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Enhancing risk quantification and identification to boost insurance penetration from current levels and premium set-up.
                                    </Typography>
                                </>
                            ),
                        },
                        {
                            panel: "panel7",
                            title: "Agri-food Industry",
                            image: `${process.env.PUBLIC_URL}/images/agri.jpg`,
                            content: (
                                <>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        ACASA is committed to ensuring a sustainable agri-food industry and inclusive supply chains.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Climate-friendly supply chains
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Collaboration with farmers for sustainable and climate-resilient practices and equitable climate-friendly supply chains, ensuring an uninterrupted supply.
                                    </Typography>
                                    <Typography variant="h5" component="h5">
                                        Capacity development
                                    </Typography>
                                    <Typography component="p" sx={{ fontSize: '12px', textAlign: 'left' }}>
                                        Enhancing the capacity of the farming community for the adaptation to climatic hazards for livestock production.
                                    </Typography>
                                </>
                            ),
                        },
                    ].map(({ panel, title, image, content }) => (
                        <Accordion
                            key={panel}
                            expanded={expanded === panel}
                            onChange={handleChange(panel)}
                            sx={{
                                mb: 1,
                                border: "1px solid rgba(0, 0, 0, 0.12)",
                                borderRadius: "12px",
                                bgcolor: theme.palette.mode === "dark" ? "#25292e" : "#ffffff",
                                boxShadow: "none",
                                "&.Mui-expanded": {
                                    bgcolor: theme.palette.mode === "dark" ? "#2c2f34" : "#f2f4f3",
                                    boxShadow: "none",
                                    borderRadius: "12px",
                                },
                            }}
                        >
                            <AccordionSummary
                                expandIcon={<ExpandMoreIcon />}
                                sx={{
                                    bgcolor:
                                        expanded === panel
                                            ? theme.palette.mode === "dark"
                                                ? "#61c258"
                                                : "#4C9E46"
                                            : theme.palette.mode === "dark"
                                                ? "#33373e"
                                                : "#f0f0f0",
                                    color:
                                        expanded === panel
                                            ? "#ffffff"
                                            : theme.palette.mode === "dark"
                                                ? "#cccccc"
                                                : "#00000080",
                                    borderRadius: "12px",
                                    "&.Mui-expanded": {
                                        borderRadius: "12px 12px 0 0",
                                        border: "1px solid rgba(0, 0, 0, 0.12)",
                                        boxShadow: "none",
                                    },
                                }}
                            >
                                <Typography
                                    sx={{
                                        fontSize: "18px",
                                        fontFamily: "Poppins",
                                        fontWeight: 500,
                                        textAlign: 'left'
                                    }}
                                >
                                    {title}
                                </Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Box sx={{ p: 2 }}>
                                    <Grid container spacing={2}>
                                        <Grid item xs={12} md={5}>
                                            <Box sx={{ width: "100%", height: "100%", p: 0 }}>
                                                <Box
                                                    component="img"
                                                    src={image}
                                                    alt={title}
                                                    sx={{
                                                        width: "100%",
                                                        minHeight: "500px",
                                                        objectFit: "cover",
                                                        display: "block",
                                                        borderRadius: "8px",
                                                    }}
                                                />
                                            </Box>
                                        </Grid>
                                        <Grid item xs={12} md={7}>
                                            <Box
                                                sx={{
                                                    p: 3,
                                                    pt: 0,
                                                    color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                                    "& p": {
                                                        fontFamily: "Poppins",
                                                        fontSize: "18px",
                                                        lineHeight: 1.6,
                                                        textAlign: 'left'
                                                    },
                                                    "& h5": {
                                                         fontFamily: "Poppins",
                                                        color: theme.palette.mode === "dark" ? "#fff" : "#000",
                                                        margin: theme.spacing(2, 0, 1),
                                                        fontSize: "24px",
                                                        textAlign: 'left',
                                                        fontWeight:'600',
                                                    },
                                                }}
                                            >
                                                {content}
                                            </Box>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </AccordionDetails>
                        </Accordion>
                    ))}
                </AccordionContainer>
            </Container>
        </Box>

    );
}

export default UseCases;