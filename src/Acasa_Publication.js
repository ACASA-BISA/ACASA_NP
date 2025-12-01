import React, { useState } from "react";
import {
  Box,
  Typography,
  TextField,
  InputAdornment,
  IconButton,
  Grid,
  Checkbox,
  FormControlLabel,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Button,
  MenuItem,
  Select,
  Divider,
  Card,
  CardContent,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import FilterListIcon from "@mui/icons-material/FilterList";
import { useTheme } from "@mui/material/styles";

const Publications = () => {
  const theme = useTheme();

  const [searchQuery, setSearchQuery] = useState("");
  const [sortBy, setSortBy] = useState("date");
  const [selectedTypes, setSelectedTypes] = useState([]);

  const publicationTypes = [
    "Blog Post",
    "Brief",
    "Brochure",
    "Conference Proceedings",
    "Data Paper",
    "Dataset",
    "Journal Article",
    "Opinion Piece",
    "Report",
    "Working Paper",
  ];

  const publications = [
    {
      title: "",
      year: "",
      type: "Dataset",
      institute: "",
      link: "#",
    },
    {
      title: "Climate Impacts on South Asian Agriculture",
      year: "2025",
      type: "Journal Article",
      institute: "ACASA Research Team",
      link: "#",
    },
  ];

  const handleTypeChange = (type) => {
    setSelectedTypes((prev) =>
      prev.includes(type) ? prev.filter((t) => t !== type) : [...prev, type]
    );
  };

  const filteredPublications = publications.filter((pub) => {
    const matchesSearch = pub.title
      .toLowerCase()
      .includes(searchQuery.toLowerCase());
    const matchesType =
      selectedTypes.length === 0 || selectedTypes.includes(pub.type);
    return matchesSearch && matchesType;
  });

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: { xs: "column", md: "row" },
        py: 6,
        px: { xs: 2, md: 8 },
        backgroundColor: theme.palette.background.default,
        color: theme.palette.text.primary,
      }}
    >
      {/* Sidebar Filters */}
      <Box
        sx={{
          flexBasis: { xs: "100%", md: "25%" },
          borderRight: { md: `1px solid ${theme.palette.divider}` },
          pr: { md: 4 },
          mb: { xs: 4, md: 0 },
        }}
      >
        <Typography variant="h6" sx={{ mb: 2 }}>
          Filters
        </Typography>

        {/* Type Filter */}
        <Accordion defaultExpanded>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Type</Typography>
          </AccordionSummary>
          <AccordionDetails>
            {publicationTypes.map((type) => (
              <FormControlLabel
                key={type}
                control={
                  <Checkbox
                    checked={selectedTypes.includes(type)}
                    onChange={() => handleTypeChange(type)}
                  />
                }
                label={type}
              />
            ))}
          </AccordionDetails>
        </Accordion>

        {/* Placeholder for future filters */}
        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Author</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              (Coming soon)
            </Typography>
          </AccordionDetails>
        </Accordion>

        <Accordion>
          <AccordionSummary expandIcon={<ExpandMoreIcon />}>
            <Typography>Keyword</Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Typography variant="body2" color="text.secondary">
              (Coming soon)
            </Typography>
          </AccordionDetails>
        </Accordion>
      </Box>

      {/* Main Content */}
      <Box sx={{ flex: 1, pl: { md: 4 } }}>
        {/* Search and Sort */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <TextField
            placeholder="Search all publications"
            variant="outlined"
            size="small"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            sx={{ width: { xs: "100%", sm: "300px" } }}
            InputProps={{
              endAdornment: (
                <InputAdornment position="end">
                  <IconButton>
                    <SearchIcon />
                  </IconButton>
                </InputAdornment>
              ),
            }}
          />

          <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
            <Typography variant="body2">Sort by:</Typography>
            <Select
              size="small"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
              startAdornment={
                <InputAdornment position="start">
                  <FilterListIcon fontSize="small" sx={{fontFamily:'Poppins'}} />
                </InputAdornment>
              }
            sx={{fontFamily:'Poppins',}}>
              <MenuItem value="date">Date</MenuItem>
              <MenuItem value="title">Title</MenuItem>
            </Select>
          </Box>
        </Box>

        {/* Total count and copy button */}
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            mb: 3,
            flexWrap: "wrap",
            gap: 2,
          }}
        >
          <Typography variant="body2">
            Total {filteredPublications.length} records
          </Typography>

          <Button
            variant="contained"
            sx={{
              backgroundColor: "#f9d857",
              color: "#000",
              fontWeight: 600,
              fontFamily:'Poppins',
              "&:hover": { backgroundColor: "#f5cf4f" },
            }}
          >
            + COPY ALL CITATIONS
          </Button>
        </Box>

        {/* Publications List */}
        <Grid container spacing={3}>
          {filteredPublications.map((pub, index) => (
            <Grid item xs={12} key={index}>
              <Card
                sx={{
                  backgroundColor: theme.palette.background.paper,
                  p: 2,
                  boxShadow: "none",
                  borderBottom: `1px solid ${theme.palette.divider}`,
                }}
              >
                <CardContent sx={{ p: 0 }}>
                  <Typography
                    variant="subtitle2"
                    color="text.secondary"
                    sx={{ mb: 1 }}
                  >
                    {pub.type}
                  </Typography>
                  <Typography
                    variant="h6"
                    sx={{ fontWeight: 600, fontFamily:'Poppins', mb: 0.5, color: theme.palette.text.primary }}
                  >
                    {pub.title}
                  </Typography>
                  <Typography variant="body2" sx={{ fontStyle: "italic" , fontFamily:'Poppins',}}>
                    {pub.year} | {pub.institute}
                  </Typography>
                  <Button
                    variant="contained"
                    href={pub.link}
                    target="_blank"
                    sx={{
                      mt: 2,
                      backgroundColor: "#f9d857",
                      color: "#000",
                      fontWeight: 600,
                      fontFamily:'Poppins',
                      "&:hover": { backgroundColor: "#f5cf4f" },
                    }}
                  >
                    DETAILS
                  </Button>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default Publications;
