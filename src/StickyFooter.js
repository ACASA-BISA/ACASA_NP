import * as React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Link from "@mui/material/Link";
import Button from "@mui/material/Button";
import Divider from "@mui/material/Divider";
import Stack from "@mui/material/Stack";
import TextField from "@mui/material/TextField";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableRow from "@mui/material/TableRow";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";

function Copyright() {
  return (
    <Typography sx={{ fontSize: 12, color: "#aaaaaa" }}>
      {"Copyright © ACASA-BISA, 2025. All rights reserved."}
      {/* <Link color="inherit" href="https://mui.com/">
        Your Website
      </Link> {' '}*/}
    </Typography>
  );
}

const logoStyle = {
  width: "auto",
  height: "13vh",
  padding: "5px",
};

export default function StickyFooter() {
  return (
    <Box
      sx={{
        display: { xs: "none", md: "flex" },
        flexDirection: "column",
        textAlign: { sm: "center", md: "left" },
      }}
    >
      <Box
        component="footer"
        sx={{
          position: "sticky",
          py: 3,
          px: 2,
          mt: 0,
          backgroundColor: "#111111",
        }}
      >
        <Box sx={{ width: { xs: "100%", sm: "100%" }, mb: 2 }}>
          <Box
            sx={{
              minHeight: "20vh",
              display: "flex",
              flexDirection: "row",
              margin: 6,
            }}
          >
            <img src={"acasa-white.svg"} style={logoStyle} alt="logo of acasa" loading="lazy" />
            <Divider textAlign="center" orientation="vertical" flexItem="true" sx={{ bgcolor: "#555555", borderRightWidth: 2, margin: 2 }} />
            <Box sx={{ width: "100%" }}>
              <Typography
                gutterBottom
                sx={{
                  color: "#ffffff",
                  fontWeight: "none",
                  marginLeft: "5px",
                  marginTop: "8px",
                  fontSize: "18px",
                  fontFamily: "revert",
                }}
              >
                To address the vulnerability of South Asian countries to climatic risks, the Borlaug Institute for South Asia (BISA) with support from Gates Foundation is working with national agriculture research systems of the region
                to develop ACASA.
              </Typography>
              <Button
                variant="contained"
                href="/#/about"
                sx={{
                  "flexShrink": 0,
                  "backgroundColor": "#111111",
                  "color": "#fece2f",
                  "padding": 0,
                  "fontWeight": "bold",
                  "fontSize": "16px",
                  "fontFamily": "inherit",
                  "&:hover": { backgroundColor: "#111111" },
                  "marginLeft": "5px",
                }}
              >
                Read More
              </Button>
            </Box>
          </Box>
          <Divider
            sx={{
              bgcolor: "#252525",
              borderBottomWidth: 2,
              marginLeft: 6,
              marginRight: 6,
            }}
          />
        </Box>
        <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: { xs: "100%", sm: "40%" }, margin: 6 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: "#ffffff" }}>
              Newsletter
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "#ffffff" }} mb={2}>
              Subscribe for regular newsletter and stay upto date with our latest news and updates.
            </Typography>
            <Stack direction="row" spacing={1} useFlexGap>
              <TextField
                id="outlined-basic"
                hiddenLabel
                size="small"
                variant="filled"
                fullWidth
                aria-label="Enter your email address"
                placeholder="Your email address"
                inputProps={{
                  autocomplete: "off",
                  ariaLabel: "Enter your email address",
                }}
                sx={{
                  backgroundColor: (theme) => (theme.palette.mode === "dark" ? "#2c2f33" : "#ffffff"),
                }}
              />
              <Button
                variant="contained"
                sx={{
                  "flexShrink": 0,
                  "backgroundColor": "#fece2f",
                  "&:hover": { backgroundColor: "#aaaaaa" },
                }}
              >
                Subscribe
              </Button>
            </Stack>
          </Box>
          <Box sx={{ display: "flex", flexDirection: "row" }}>
          <Box sx={{ width: { xs: "100%", sm: "40%" }, margin: 6 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: "#ffffff" }}>
              Contact NRMC
            </Typography>
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Name:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: "bold" }} ml={2}>
                      A.G.Chandrapala
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Address:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: "bold" }} ml={2}>
                      National Resources Management Centre (NRMC)
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="2" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                       Department of Agriculture
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="3" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                </TableRow>
                <TableRow key="4" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      Peradeniya - 20400, Sri Lanka
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            {/*<Divider
              sx={{
                bgcolor: "#252525",
                borderBottomWidth: 2,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Phone:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      +91-11-25842940
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="2" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      +91-11-2584 2938
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>*/}
            <Divider
              sx={{
                bgcolor: "#252525",
                borderBottomWidth: 2,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Email:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#fece2f" }} ml={2}>
                      <Link color="inherit" href="mailto:nrmcperadeniyadoa@gmail.com">
                        nrmcperadeniyadoa@gmail.com
                      </Link>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          <Box sx={{ width: { xs: "100%", sm: "40%" }, margin: 6 }}>
            <Typography variant="h5" fontWeight={600} gutterBottom sx={{ color: "#ffffff" }}>
              Contact BISA
            </Typography>
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Name:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: "bold" }} ml={2}>
                      Dr Pramod Aggarwal
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Address:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff", fontWeight: "bold" }} ml={2}>
                      Borlaug Institute for South Asia (BISA)
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="2" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      International Maize and Wheat Improvement Center
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="3" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      CIMMYT, CG Block B, NASC, DPS Marg, Pusa,
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="4" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      New Delhi - 110012, India
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Divider
              sx={{
                bgcolor: "#252525",
                borderBottomWidth: 2,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Phone:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      +91-11-25842940
                    </Typography>
                  </TableCell>
                </TableRow>
                <TableRow key="2" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left"></TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }} ml={2}>
                      +91-11-2584 2938
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
            <Divider
              sx={{
                bgcolor: "#252525",
                borderBottomWidth: 2,
                marginTop: 2,
                marginBottom: 2,
              }}
            />
            <Table size="small" aria-label="a dense table" padding="none">
              <TableBody>
                <TableRow key="1" sx={{ "& td": { border: 0 } }}>
                  <TableCell align="left" sx={{ width: "70px" }}>
                    <Typography variant="subtitle1" sx={{ color: "#ffffff" }}>
                      Email:
                    </Typography>
                  </TableCell>
                  <TableCell align="left">
                    <Typography variant="subtitle1" sx={{ color: "#fece2f" }} ml={2}>
                      <Link color="inherit" href="mailto:acasa@cgiar.org">
                        acasa@cgiar.org
                      </Link>
                    </Typography>
                  </TableCell>
                </TableRow>
              </TableBody>
            </Table>
          </Box>
          </Box>
        </Box>
        <Divider
          sx={{
            bgcolor: "#252525",
            borderBottomWidth: 2,
            marginTop: -4,
            marginLeft: 6,
            marginRight: 6,
          }}
        />
        <Box
          sx={{
            display: "flex",
            flexDirection: "row",
            width: "100%",
            justifyContent: "center",
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "row",
              margin: 1,
              marginTop: 0,
            }}
          >
            <ListItemButton sx={{ marginRight: -2 }} href="/">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Home"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "13px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
            {/* <ListItemButton sx={{ marginRight: -2 }} href="/#/guide">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Guide"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton> */}
            <ListItemButton sx={{ marginRight: -2 }} href="/#/exploredata">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Explore Data"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
            <ListItemButton sx={{ marginRight: -2 }} href="/#/hazardataglance">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Data at a glance"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
            {/*<ListItemButton sx={{ marginRight: -2 }} href="/#/access">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Data Access"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>*/}
            <ListItemButton sx={{ marginRight: -2 }} href="/#/usecase">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Use Cases"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
            <ListItemButton sx={{ marginRight: -2 }} href="/#/resources">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="Resources"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
            <ListItemButton sx={{ marginRight: -2 }} href="/#/about">
              <ListItemIcon sx={{ color: "#fece2f", fontSize: "15px" }}>&#9670;</ListItemIcon>
              <ListItemText
                primary="About Us"
                primaryTypographyProps={{
                  color: "#aaaaaa",
                  fontSize: "12px",
                  fontWeight: "normal",
                }}
                sx={{ marginLeft: -5, marginRight: -1 }}
              />
            </ListItemButton>
          </Box>
        </Box>
        <Box
          sx={{
            display: "flex",
            width: "100%",
            justifyContent: "center",
            marginBottom: "5x",
          }}
        >
          <Copyright />
        </Box>
      </Box>
    </Box>
  );
}
