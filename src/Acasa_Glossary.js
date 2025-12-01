import React from "react";
import { useLocation } from "react-router-dom";
import { Typography, Box, Button, TextField, Paper, Link } from "@mui/material";
import { defined } from "cesium";

const glossaryData = {
  A: [
    {
      term: "ACASA",
      definition: "Atlas of Climate Adaptation in South Asian Agriculture",
      image: "acasa.PNG",
    },
    {
      term: "Alternate wetting and drying",
      definition:
        "The AWD practices in rice involves intermittent flooding (alternate cycles of saturated and unsaturated conditions) of a rice field, typically to a water depth of around 5 cm, and allowing the field to dry until the water level drops to a certain threshold moisture level i.e., around 10-15 cm below the soil surface, and then reflooding the field. It saves se irrigation water use and reduces greenhouse gas (GHG) emissions while maintaining or improving grain yields.",
    },
    {
      term: "Adaptation benefits",
      definition: "Yield benefits because of the adoption of technology options over conventional/farmers' practice.",
    },
    {
      term: "Additional energy supplementation",
      definition: "Additional energy supplementation during climatic stress period",
    },
    {
      term: "Ad lib cool drinking water",
      definition: "Provision of cold drinking water without restriction",
    },
    {
      term: "Adoption of climate resilient breeds",
      definition: "Selective breeding and upgrading to climate-resilient breeds",
    },
    {
      term: "ART Tools",
      definition: "Use of assisted reproductive technologies for improved fertility, genetics, labour, and herd health of pigs measure",
    },
  ],
  B: [
    {
      term: "Baseline",
      definition:
        "The 30-year period from 1984 to 2013 representing current climate conditions. It serves as the benchmark against which future climate projections and scenario-driven changes are assessed.",
    },
    {
      term: "Barley",
      definition: "The analysis for barley is done for 'Rabi'/winter season in all countries except Afghanistan where Barley is sown predominantly in April (spring Barley).",
    },
    {
      term: "Broadbed and furrow",
      definition:
        "Broadbed and furrow (BBF), a water-saving and soil conservation technique used in field crop cultivation. It involves creating broad raised beds separated by furrows, allowing for better water infiltration, reduced waterlogging, and improved root aeration",
    },
    /*{
      term: "Buffalo",
      definition: "The analysis is done for milk production"
    }*/
  ],
  C: [
    {
      term: "Crop insurance",
      definition:
        "Crop insurance service refers to the provision of insurance coverage to farmers against losses incurred due to crop failure, damage, or yield reductions caused by weather-related events such as droughts, floods, storms, and pests",
    },
    {
      term: "Crop water deficit index",
      definition: "It is an agricultural drought indicator that quantifies the water deficit experienced by crops by integrating the balance between crop water supply and demand.",
    },
    {
      term: "Commodity specific analysis",
      definition: "The analysis is done separately for each commodity",
    },
    {
      term: "Cold stress",
      definition:
        "Cold stress refers to the negative impact of low temperatures on plant growth and development. It is defined using both the intensity and frequency of extreme cold during the entire crop duration. Intensity refers to the number of days falling below a threshold of minimum temperature (Tmin), while frequency is the number of years (out of 30) in which such cold events occur.",
    },
    {
      term: "Cyclone",
      definition: "Cyclone hazard in terms of classes, which were developed using the cyclone-prone district information for India sourced from the NDMA report, and Abdul Awal 2015 for Bangladesh.",
    },
    {
      term: "Chickpea",
      definition: "Here the analysis is done only for winter season",
    },
    {
      term: "Cotton",
      definition: "Cotton is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India).",
    },
    {
      term: "Cattle",
      definition: "The analysis is done for milk production",
    },
    {
      term: "Chicken",
      definition: "Chicken refers to chicken and analysis is done for meat production",
    },
    {
      term: "Control of ectoparasites and other vectors",
      definition: "Physical and chemical controls of ectoparasites and other vectors",
    },
    {
      term: "Climate information services (including insurance)",
      definition: "Protects against financial loss from climate impacts",
    },
    {
      term: "Climatology",
      definition: "The long-term average of temperature and precipitation patterns, used to characterize current and project future climate conditions under climate change scenarios.",
    },
  ],
  D: [
    {
      term: "District level",
      definition: "Visualisation is at district scale",
    },
    {
      term: "Dry - Direct seeded rice",
      definition:
        "A rice establishment method where dry seeds are sown directly following broadcasting, drilling and dibbling on unsaturated dry soil without prior puddling and/or raising seedling in nurseries and transplanting of rice seedling to puddle soils.",
    },
    {
      term: "Days of frost",
      definition:
        "Frost is defined using intensity and frequency. Intensity refers to the number of days with temperatures below the frost threshold, during entire crop duration. Frequency is the number of years (out of 30) in which such frost events occur at a given location.",
    },
    {
      term: "Delayed monsoon",
      definition:
        "Delayed monsoon is defined using intensity and frequency. Intensity is the number of days the monsoon onset is delayed from the mean onset date, and frequency is the number of years (out of 30) in which the delay was 7 days or more.",
    },
    {
      term: "Dry spell",
      definition:
        "Dry spell is defined using intensity and frequency. Intensity is measured by a Dry Spell (DS) score derived from Dharma Rao et al., 2019, while frequency is the number of years (out of 30) with at least one 14-day long dry spell, corresponding to a DS score above 2.71.",
    },
    {
      term: "Deworming",
      definition: "Control of endoparasites",
    },
  ],
  E: [
    {
      term: "Early sowing/changing planting dates",
      definition: "A tactical farming practice to synchronize crop planting with the optimal climatic conditions essential for key growth stages of crop",
    },
    {
      term: "Economic viability",
      definition: "Economic viability is determined through profitability using benefit-cost ratios",
    },
    {
      term: "Excess rainfall",
      definition:
        "Excess rainfall for livestock is defined using intensity and frequency. Intensity refers to events with more than 100 mm of rainfall in a particular day, while frequency is the number of years (out of 30) in which such events occurred.",
    },
    {
      term: "Excess rainfall and waterlogging",
      definition:
        "Excess rainfall accounts the amount of rain that exceeds the optimal levels needed for healthy crop growth. This can lead to waterlogging, nutrient leaching, increased pest and diseases, and physical damage to crops. It is defined using intensity and frequency. Intensity refers to rainfall events of 100 mm or more over two consecutive days, while frequency is the number of years (out of 30) in which such events occurred during the crop season.",
    },
    {
      term: "Exposure index",
      definition: "This includes the mapping of commodity specific density layer and development of an integrated index through Z-score normalization.",
    },
    {
      term: "Estrous confirmation and synchronisation",
      definition: "A process that uses hormones to bring female mammals into heat at a predetermined time",
    },
  ],
  F: [
    {
      term: "Flood",
      definition:
        "Flood refers to the  excessive overflow and/or stagnation of water onto the crop field, causing waterlogging over an extended period which can significantly impact crop growth and yield.",
    },
    {
      term: "Fodder conservation",
      definition: "Preserving fodder to meet the demand during climatic stress period",
    },
    {
      term: "Fat supplementation",
      definition:
        "To increase the overall energy density of the feed, improve nutrient absorption, enhance palatability, and sometimes to help manage heat stress, all while providing essential fatty acids necessary for the bird's health",
    },
    {
      term: "Feed/fodder",
      definition: "Crop residue for animal usage in tons per grid. We used Global Dataset (for the year 2021) for the Production and Usage of cereal residues derived from Smerald et al., 2023.",
    },
  ],
  G: [
    {
      term: "Gender suitability",
      definition: "It refers to the degree of suitability of each adaptation option to women farmers",
    },
    {
      term: "Groundnut",
      definition: "Groundnut is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India) and Maha in Sri Lanka.",
    },
    {
      term: "Goat",
      definition: "The analysis is done for meat production",
    },
    {
      term: "Grassland and Silvi-pasture management",
      definition:
        "Maintain and optimize the productivity of grasslands, often by integrating trees or shrubs (silvipasture) into the grazing area, aiming to improve forage production, soil health, and biodiversity while supporting livestock grazing simultaneously",
    },
  ],
  H: [
    {
      term: "Hazard index",
      definition:
        "The index was built by enlisting hazards through literature review and stakeholder validation. This composite index was formulated through Z-score normalization, principal component analysis, and stakeholders' inputs.",
    },
    {
      term: "Hazard",
      definition: "Hazard is an event or circumstance that can harm the commodity. In this Atlas we are considering climate induced hazards.",
    },
    {
      term: "Heating management",
      definition: "Preferably mechanical heating",
    },
    {
      term: "Heat stress",
      definition:
        "Heat stress is defined using both the intensity and frequency of extreme heat during the entire crop duration. Intensity refers to the number of days exceeding a threshold of maximum temperature (Tmax), while frequency is the number of years (out of 30) in which such extreme heat occurred at a given location. Severity refers to the extent of impact or gravity of an event, and used in contexts involving conequences.",
    },
    {
      term: "High temperature induced pollen sterility",
      definition:
        "High temperature induced pollen sterility is defined using both the intensity and frequency of extreme heat during the pollination period. Intensity refers to the number of days exceeding a threshold of maximum temperature (Tmax), while frequency is the number of years (out of 30) in which such extreme heat occurred at a given location.",
    },
    {
      term: "Hazard proof shelters",
      definition: "Appropriate shelter to protect animals from natural hazards",
    },
  ],
  I: [
    {
      term: "ICT linked input management",
      definition:
        "ICT linked input management technology is a type of modern agricultural management that comprehensively integrates information technology comprised of current data and information requires from crop growth conditions, soil physical and chemical properties, weather factors; weather based forecast products  for agricultural production by quantitative  and timing of application of nutrients, water and other operation management systems in accordance with geographical locations",
    },
    {
      term: "Income",
      definition: "Agricultural gross domestic product data from https://datacatalog.worldbank.org/search/dataset/0061507/Global-Gridded-Agricultural-Gross-Domestic-Product--AgGDP-",
    },
    {
      term: "Irrigation",
      definition: "Crop area under irrigation in percentage derived from FAO’s Global Map of Irrigation Areas (GMIA), version 5.",
    },
    {
      term: "Increased proportion of green fodder",
      definition: "Provision for perennial grass, pasture legume, fodder trees, cultivated grasses",
    },
  ],
  J: [
    {
      term: "Jute",
      definition: "Jute is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India).",
    },
  ],
  K: [],
  L: [
    {
      term: "Land-climate suitability",
      definition: "Suitability of adaptation options in a particular pixel based on the heuristic model of several indicators. For detailed methodology refer to the document",
    },
    {
      term: "Low temperature induced pollen sterility",
      definition:
        "Low temperature induced pollen sterility is defined using both the intensity and frequency of extreme cold during the pollination period. Intensity refers to the number of days falling below a threshold of minimum temperature (Tmin), while frequency is the number of years (out of 30) in which such cold events occurred at a given location.",
    },
  ],
  M: [
    {
      term: "Maize",
      definition: "Maize is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India and Nepal and 'Maha' in Sri Lanka).",
    },
    {
      term: "Millets",
      definition: "Millet is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India and Nepal).",
    },
    {
      term: "Micro-irrigation",
      definition:
        "A low-pressure, low-flow-rate type of irrigation that can reduce the likelihood of overwatering a landscape. Drip irrigation or trickle irrigation is an irrigation method that allows water to drip slowly to the roots of plants, either onto the soil surface or directly onto the root zone, through a network of valves, pipes, tubing, and emitters",
    },
    {
      term: "Modification of shed, ventilation and cooling",
      definition: "Microclimate modification by modifying shelter, improved ventilation and by adjusting roof heights",
    },
    {
      term: "Modify shelters for cold stress",
      definition: "Microclimate modification by modifying shelters for protection against cold stress",
    },
    {
      term: "Micro-climate modification",
      definition: "Microclimate modification by modifying shelter, improved ventilation and by adjusting roof heights",
    },
    {
      term: "Mechanical cooling",
      definition: "Cooling using misting, fogging, sprinklers, fans, exhaust",
    },
    {
      term: "Micronutrient and probiotics",
      definition: "Micronutrient and probiotics for health and nutritional needs during climatic stress period",
    },
    {
      term: "Modification in feeding practices",
      definition: "Adjust feeding times and grazing patterns to minimize climate stress",
    },
    {
      term: "Mineral mixture supplementation",
      definition: "Blend of essential minerals to correct mineral deficiencies during climatic stress period and also  to improve productivity",
    },
    {
      term: "Micro-nutrient and amino acid supplementation",
      definition: "Micro-nutrient and amino acid supplementation to optimize growth, egg production, and overall health during climatic stress period",
    },
    {
      term: "Maximum temperature",
      definition:
        "Maximum temperature observed during a specific period, averaged over the crop duration for crops and over the entire year for livestock. For both, this value is calculated for a 30-year baseline period and projected for future climate scenarios.",
    },
    {
      term: "Minimum temperature",
      definition:
        "Minimum temperature observed during a specific period, averaged over the crop duration for crops and over the entire year for livestock. For both, this value is calculated for a 30-year baseline period and projected for future climate scenarios.",
    },
  ],
  N: [
    {
      term: "Number of animals per grid",
      definition: "Number of animals per grid from https://data.amerigeoss.org/dataset/9d1e149b-d63f-4213-978b-317a8eb42d02",
    },
  ],
  O: [
    /*{
      term: "Onion",
      definition: "Onion is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif' in India) and Maha in Sri Lanka."
    }*/
  ],
  P: [
    {
      term: "Productivity",
      definition:
        "Productivity refers to crop yield in t/ha. The baseline yield was calculated using remote sensing derived gross primary productivity and district crop statistics.  The climate change impact in 2050s is reflected in percent change in yield in the adjacent figure.",
    },
    {
      term: "Planting technology",
      definition: "",
    },
    {
      term: "Precision land levelling",
      definition:
        "Precision Land Levelling (PLL) is a farming technique that involves the mechanical process of grading and smoothing land to achieve a uniform and precise. It may employ advanced laser-guided equipment to precisely contour the land surface, creating a uniform smooth surface (± 2 cm from its average elevation) and eliminating undulations that ensures every inch of your field gets the water it needs",
    },
    {
      term: "Precision water management",
      definition:
        "Precision water management technology is a new type of irrigation management that comprehensively integrates information technology (sensor based) included of data and information requires from crop growth conditions, soil physical and chemical properties, weather factors and agricultural production by positioning, timing, and quantitative application of water and operation management systems in accordance with spatial variation of the field",
    },
    {
      term: "Precision fertilizer management",
      definition:
        "Precision fertilization management technology is a new type of agriculture that comprehensively integrates information technology and agricultural production by positioning, timing, and quantitative application of fertilizer management and operation systems in accordance with spatial variation of the field",
    },
    {
      term: "Pixel level",
      definition: "Visualisation is at 0.05 degree x 0.05 degree grid level.",
    },
    {
      term: "Planting of trees",
      definition: "Provide a way for shade, food, and a way to increase the production",
    },
    {
      term: "Pigeonpea",
      definition: "Pigeonpea is planted in in multiple seasons in different countries. This analysis is for monsoon season (also known as 'Kharif' in India).",
    },
    {
      term: "Potato",
      definition: "Analysis done for Rabi/winter season or Maha season.",
    },
    {
      term: "Pig",
      definition: "The analysis is done for meat production",
    },
    {
      term: "Planting trees",
      definition: "Provide a way for shade, food, and a way to increase the production",
    },
    {
      term: "Parasite control",
      definition: "Preventing and treating parasites that affect chickens and other birds",
    },
  ],
  Q: [],
  R: [
    {
      term: "Regional analysis",
      definition: "The analysis is for a region from a general agriculture perspective and is independent of specific commodities.",
    },
    {
      term: "Rural infrastructure",
      definition: "Rural infrastucture is proxied by nightlight luminosity data from https://www.mdpi.com/2072-4292/13/5/922",
    },
    {
      term: "Rainfall deficit",
      definition:
        "Rainfall deficit refers to a condition where the amount of rainfall received over a specific period is significantly less than the normal or long-term average rainfall expected for that region and period.",
    },
    {
      term: "Risk index",
      definition: "The Risk Index is a composite measure that combines hazard, vulnerability, and exposure indices to assess the overall risk of climate  impacts on a particular commodity.",
    },
    {
      term: "Resilience",
      definition: "Resilience is stability of the yield across the years. It is denoted by coefficient of variance.",
    },
    {
      term: "Rice",
      definition:
        "Rice is planted in multiple seasons in different countries. Here this analysis is only for monsoon season (also known as 'Kharif' in India and Nepal, 'Aman' in Bangladesh,and 'Maha' in Sri Lanka).",
    },
    {
      term: "Rapeseed/Mustard",
      definition: "Here this analysis is done only for winter season",
    },
  ],
  S: [
    {
      term: "SSP 2-4.5",
      definition:
        "A moderate climate change scenario combining the middle-of-the-road shared socioeconomic pathway (SSP2) with a radiative forcing level of 4.5 W/m² by 2100. It assumes intermediate challenges to mitigation and adaptation, with moderate emissions reductions over time.",
    },
    {
      term: "SSP 5-8.5",
      definition:
        "A high-emission scenario combining the fossil-fueled development pathway (SSP5) with a radiative forcing level of 8.5 W/m² by 2100. It assumes rapid economic growth driven by heavy reliance on fossil fuels and limited climate policies.",
    },
    {
      term: "Socio-economic development indicator",
      definition: "Socio-economic development indicator represented by the Human Development Index from https://www.mosaiks.org/hdi",
    },
    {
      term: "Stress-tolerant varieties",
      definition:
        "Cultivars specifically bred or selected to tolerate or adapt to the changing climatic conditions. These varieties possess traits that enable them to withstand heat stress, drought, floods, and other environmental stresses",
    },
    {
      term: "System of Rice Intensification (SRI)",
      definition: "SRI involves transplanting young rice seedlings at wider spacing, intermittent irrigation, and organic soil enrichment to promote sustainable and efficient farming practices",
    },
    {
      term: "Supplemental irrigation",
      definition:
        "Addition of limited amount of water to plants under insufficient water supply by rainfall to overcome the adverse effects of drought, when rainfall fails to provide sufficient moisture for normal plant growth",
    },
    {
      term: "Scalability",
      definition: "Scalability is indicated by using a composite indicator of credit availability, input access, social network, education, and information access",
    },
    {
      term: "Smart fertilizer management",
      definition:
        "Fertilizer to be adjusted to meet the nutrient demands of crop growth and avoid nutrient loss when crop biomass decreases due to water and temperature stress over time under climate change",
    },
    {
      term: "Sorghum",
      definition: "Sorghum is planted in multiple seasons in different countries. This analysis is for the winter season (also known as 'rabi').",
    },
    {
      term: "Soybean",
      definition: "Soybean is planted in multiple seasons in different countries. Here this analysis is for monsoon season (also known as 'Kharif') and Maha in Sri Lanka.",
    },
    {
      term: "Sheep",
      definition: "The analysis is done for meat production",
    },
    {
      term: "Seasonal rainfall",
      definition:
        "For crops, seasonal rainfall refers to the total precipitation occurring during the specific crop duration, which varies by commodity depending on their growing season. For livestock, seasonal rainfall is defined as the total annual sum of precipitation.",
    },
  ],
  T: [
    {
      term: "Temperature-humidity index",
      definition:
        "Temperature Humidity Index (THI) is a measure that combines air temperature and relative humidity to assess heat stress in animals. Higher THI values indicate greater thermal discomfort and potential stress for livestock. Intensity is defined as the number of days when THI exceeds a critical threshold, while frequency refers to the number of years (out of 30) in which such high-THI events occurred.",
    },
    {
      term: "Terminal heat",
      definition:
        "Terminal heat for wheat refers to high temperatures during the late growth stages, particularly during grain filling.  It was calculated by assessing the number of days exceeding a temperature threshold (intensity) and the number of years such events occurred out of 30 (frequency).",
    },
    {
      term: "Thinning of flock",
      definition: "Removing a portion of a group of chickens/birds from a shed so that the remaining birds have more space",
    },
  ],
  U: [
    {
      term: "Untimely rainfall",
      definition:
        "Untimely rainfall accounts the rain that occurs at a time when it is not beneficial for crop often disrupting their growth stages and economic yield. It is defined using intensity and frequency. Intensity refers to events with 100 mm or more rainfall occurring over two consecutive days, while frequency is the number of years (out of 30) in which such events occurred.",
    },
  ],
  V: [
    {
      term: "Vulnerability index",
      definition:
        "This represents combined effect of vulnerability layers. These layers were then mapped and an integrated vulnerability index was formulated through Z-score normalization, principal component analysis, and stakeholders' inputs.",
    },
    {
      term: "Vaccination",
      definition: "Vaccination programme against contagious diseases as a prophylactic measure",
    },
    {
      term: "Value of production",
      definition: "Total value of production of a specific commodity in USD per hectare at 2019 prices.",
    },
    {
      term: "Volumetric soil water",
      definition: "Volumetric Soil Water (VWC) is defined as the ratio of the volume of water contained in a soil of a grid to the total volume of that soil in that grid.",
    },
  ],
  W: [
    {
      term: "Wet - Direct seeded rice",
      definition: "A rice establishment technique where pre-germinated seeds are sown directly into  saturated soil (puddled or unpuddled), usually under wet conditions.",
    },
    {
      term: "Wheat",
      definition: "The analysis for wheat is done for Rabi/winter season in all countries except Afghanistan where wheat is sown predominantly in April.",
    },
  ],
  X: [],
  Y: [],
  Z: [
    {
      term: "Zero tillage with residue",
      definition:
        "Zero-Till, also known as no-till or direct seed/drilling, farming method where crops are planted directly into untilled soil, without/minimal disturbing the soil structure, with or without residue retention. With irrigation facilities available, non-puddled transplanted rice can be cultivated in wet as well as dry season depending on the choice of crop rotation",
    },
  ],
};

export default function Glossary() {
  const [selectedLetter, setSelectedLetter] = React.useState(""); // Default to show all terms
  const [searchTerm, setSearchTerm] = React.useState("");
  const [showOverlay, setShowOverlay] = React.useState(true);

  const Ref = React.useRef(null);

  const handleCloseOverlay = () => {
    setShowOverlay(false);
  };

  const filteredTerms =
    glossaryData[selectedLetter]?.filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase())) ||
    Object.values(glossaryData)
      .flat()
      .filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase()));

  // Sort filtered terms alphabetically
  const sortedFilteredTerms = filteredTerms.sort((a, b) => a.term.localeCompare(b.term));

  React.useEffect(() => {
    const term = new URLSearchParams(window.location.hash.replace("#", "?")).get("term");

    if (term) {
      // Find the term in the glossary and scroll into view
      const termElement = Ref.current.querySelector(`[data-term="${term}"]`);
      if (termElement) {
        const yOffset = -110;
        const y = termElement.getBoundingClientRect().top + window.scrollY + yOffset;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [filteredTerms]);

  return (
    <Box sx={{ display: "flex", flexDirection: { xs: "column", md: "row" }, gap: 3, padding: 3 }}>
      {showOverlay && (
        <Box
          sx={{
            position: "fixed",
            top: 0,
            left: 0,
            width: "100vw",
            height: "100vh",
            backgroundColor: "rgba(0, 0, 0, 0.7)",
            color: "white",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            zIndex: 1000,
          }}
        >
          <Typography variant="h5" sx={{ marginBottom: 2, fontFamily: "Poppins", fontSize:'18px' }}>
            Some definitions are still being updated. This is a work in progress and subject to refinement.
          </Typography>
          <Button
            variant="contained"
            onClick={() => setShowOverlay(false)}
            sx={(theme) => ({
              "backgroundColor": theme.palette.mode === "dark" ? "#61c258" : "#4ba046",
              "color": "white",
              "fontWeight": "bold",
              "textTransform": "none",
              "paddingX": 3,
              "fontFamily": "Poppins",
              "&:hover": {
                backgroundColor: theme.palette.mode === "dark" ? "#57ad4f" : "#43953e",
              },
            })}
          >
            GOT IT
          </Button>
        </Box>
      )}
      {/* Left Side - Alphabet & Glossary List */}
      <Box
        sx={(theme) => ({
          position: "sticky",
          left: 0,
          top: { xs: "auto", md: 175 },
          width: { xs: "100%", md: "27%" }, // full width on mobile
          height: { xs: "auto", md: "100vh" }, // height auto on mobile
          padding: 3,
          backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "#f9f9f9",
          borderRadius: 2,
          boxShadow: theme.palette.mode === "dark" ? "2px 0px 10px rgba(0,0,0,0.3)" : "2px 0px 10px rgba(0,0,0,0.1)",
        })}
      >
        {/* Search Bar */}
        <TextField
          variant="outlined"
          placeholder="Search"
          fullWidth
          sx={(theme) => ({
            "marginBottom": 2,
            "fontFamily": "Poppins",
            "& .MuiOutlinedInput-root": {
              "backgroundColor": theme.palette.mode === "dark" ? theme.palette.background.paper : "white",
              "borderRadius": 1,
              "& fieldset": {
                borderColor: theme.palette.mode === "dark" ? "#666" : "#ccc",
                fontFamily: "Poppins",
              },
              "&:hover fieldset": {
                borderColor: theme.palette.mode === "dark" ? "#81c784" : "#4ba046",
              },
              "&.Mui-focused fieldset": {
                borderColor: theme.palette.mode === "dark" ? "#81c784" : "#4ba046",
                borderWidth: 2,
                fontFamily: "Poppins",
              },
            },
          })}
          onChange={(e) => setSearchTerm(e.target.value)}
        />

        {/* Alphabet Buttons */}
        <Box
          sx={{
            display: "flex",
            flexWrap: "wrap",
            gap: 1,
            marginBottom: 2,
            justifyContent: "center",
            fontFamily: "Poppins",
          }}
        >
          {"ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("").map((letter) => (
            <Button
              key={letter}
              variant={selectedLetter === letter ? "contained" : "outlined"}
              onClick={() => setSelectedLetter(selectedLetter === letter ? "" : letter)}
              sx={(theme) => ({
                "width": { xs: "28px", sm: "32px", md: "min(8vw, 35px)" },
                "height": { xs: "28px", sm: "32px", md: "min(8vw, 35px)" },
                "minWidth": { xs: "28px", sm: "32px", md: "min(8vw, 35px)" },
                "fontSize": { xs: "0.7rem", sm: "0.85rem", md: "1rem" },
                "fontWeight": "bold",
                "textTransform": "none",
                "display": "flex",
                "alignItems": "center",
                "justifyContent": "center",
                "transition": "0.2s",
                "fontFamily": "Poppins",

                "color": selectedLetter === letter ? (theme.palette.mode === "dark" ? theme.palette.text.primary : "white") : theme.palette.mode === "dark" ? "#aaa" : "#666",

                "borderColor": selectedLetter === letter ? (theme.palette.mode === "dark" ? theme.palette.text.primary : "white") : theme.palette.mode === "dark" ? "#555" : "#999",

                "backgroundColor": selectedLetter === letter ? (theme.palette.mode === "dark" ? "#3b8c3b" : "#4ba046") : "transparent",

                "&:hover": {
                  backgroundColor: selectedLetter === letter ? (theme.palette.mode === "dark" ? "#3b8c3b" : "#4ba046") : theme.palette.mode === "dark" ? "#333" : "#e0e0e0",

                  borderColor: selectedLetter === letter ? (theme.palette.mode === "dark" ? theme.palette.text.primary : "white") : theme.palette.mode === "dark" ? "#666" : "#999",
                },
              })}
            >
              {letter}
            </Button>
          ))}
        </Box>

        {/* Glossary List */}
        <Paper
          sx={(theme) => ({
            "padding": 3,
            "marginTop": 3,
            "maxHeight": "65vh",
            "overflowY": "auto",
            "borderRadius": 2,
            "boxShadow": "0 4px 10px rgba(0, 0, 0, 0.1)",
            "scrollPaddingBottom": "60px",
            "fontFamily": "Poppins",

            "backgroundColor":
              theme.palette.mode === "dark"
                ? theme.palette.background.paper // Dark mode background
                : "#fafafa", // Light mode background

            "scrollbarWidth": "thin",
            "msOverflowStyle": "none",

            "&::-webkit-scrollbar": {
              width: "10px",
            },

            "&::-webkit-scrollbar-thumb": {
              backgroundColor: theme.palette.mode === "dark" ? "#4ba046" : "#8BC34A",
              borderRadius: "10px",
              transition: "background-color 0.3s ease",
            },

            "&::-webkit-scrollbar-thumb:hover": {
              backgroundColor: theme.palette.mode === "dark" ? "#3d8b3d" : "#7CB342",
            },

            "&::-webkit-scrollbar-track": {
              background: theme.palette.mode === "dark" ? "#333" : "#e0e0e0",
              borderRadius: "10px",
            },
          })}
        >
          {Object.entries(glossaryData).map(([letter, terms]) => {
            // Sort terms alphabetically within each letter group
            const sortedTerms = terms.sort((a, b) => a.term.localeCompare(b.term));

            const filteredTerms = sortedTerms.filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase()));

            if ((selectedLetter && letter !== selectedLetter) || filteredTerms.length === 0) {
              return null;
            }

            return (
              <Box key={letter} sx={{ marginBottom: 2 }}>
                <Typography
                  variant="h6"
                  align="left"
                  sx={(theme) => ({
                    fontWeight: "600",
                    fontFamily: "Poppins",
                    color: theme.palette.mode === "dark" ? theme.palette.primary.main : "#4ba046",
                    marginBottom: 1,
                    fontSize: "24px", // Set to a smaller font size for a cleaner look
                  })}
                >
                  {letter}
                </Typography>
                {filteredTerms.map((item, index) => (
                  <Typography
                    key={index}
                    id={item.term.toLowerCase()}
                    align="left"
                    sx={(theme) => ({
                      marginLeft: 2,
                      fontFamily: "Poppins",
                      color: theme.palette.mode === "dark" ? theme.palette.text.primary : "#333",
                      fontSize: "0.95rem",
                    })}
                  >
                    {item.term}
                  </Typography>
                ))}
              </Box>
            );
          })}

          {/* No results found message */}
          {Object.values(glossaryData)
            .flat()
            .filter((item) => item.term.toLowerCase().includes(searchTerm.toLowerCase())).length === 0 && (
              <Typography sx={(theme) => ({ fontFamily: "Poppins", textAlign: "center", color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "#777" })}>No results found.</Typography>
            )}
        </Paper>
      </Box>

      {/* Right Side - Glossary Descriptions */}
      <Box
        ref={Ref}
        sx={{
          marginLeft: { xs: 0, md: "1%" },
          width: { xs: "100%", md: "67%" }, // full width on mobile
          paddingBottom: "100px",
          fontFamily: "Poppins",
          marginTop: { xs: 3, md: 0 }, // add spacing on mobile
        }}
      >
        {console.log("Number of terms displayed:", sortedFilteredTerms.length)}
        {sortedFilteredTerms.length > 0 ? (
          sortedFilteredTerms.map((item, index) => (
            <Box
              key={index}
              sx={(theme) => ({
                padding: 2,
                fontFamily: "Poppins",
                borderLeft: `4px solid ${theme.palette.mode === "dark" ? theme.palette.primary.main : "#4ba046"}`,
                backgroundColor: theme.palette.mode === "dark" ? theme.palette.background.paper : "white",
                borderRadius: 1,
                boxShadow: theme.palette.mode === "dark" ? "0 2px 4px rgba(0,0,0,0.3)" : "0 2px 4px rgba(0,0,0,0.1)",
                marginBottom: 3,
              })}
              data-term={item.term.toLowerCase()}
            >
              <Typography variant="h6" align="left" sx={(theme) => ({ fontFamily: "Poppins", fontWeight: "600", color: theme.palette.mode === "dark" ? theme.palette.text.primary : "#333" })}>
                {item.term}
              </Typography>
              <Typography
                variant="body1"
                align="left"
                sx={(theme) => ({
                  color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "#555",
                  marginTop: 1,
                  fontFamily:'Poppins',
                })}
              >
                {(item.definition || "").split(" ").map((word, i) =>
                  word.startsWith("http") ? (
                    <Link key={i} href={word} target="_blank" rel="noopener noreferrer" sx={(theme) => ({ fontSize:'18px', fontFamily:'Poppins', color: theme.palette.text.secondary, textDecoration: "underline" })}>
                      {word}
                    </Link>
                  ) : (
                    word + " "
                  )
                )}
              </Typography>

              {item.image ? <img src={`${process.env.PUBLIC_URL}/${item.image}`} alt={item.term} style={{ width: "5rem", height: "auto" }} loading="lazy" /> : null}
            </Box>
          ))
        ) : (
          <Typography variant="body1" sx={(theme) => ({ fontFamily: "Poppins", color: theme.palette.mode === "dark" ? theme.palette.text.disabled : "#777" })}>
            No definitions found.
          </Typography>
        )}
      </Box>
    </Box>
  );
}