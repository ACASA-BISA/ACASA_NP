import * as React from "react"; // Import React for building UI components
import TryIcon from "@mui/icons-material/Try"; // Import an icon from Material-UI icons library
import { AppBar, Toolbar, Typography, Link, Box, Button, Container, ImageList, ImageListItem, TextField } from "@mui/material"; // Import Material-UI components
import { styled } from "@mui/system"; // Import styled function from Material-UI for custom styling
import WavingHandIcon from "@mui/icons-material/WavingHand";
import emailjs from "@emailjs/browser";

// Styled AppBar component with custom styles
const AppBarStyled = styled(AppBar)(({ theme }) => ({
  backgroundColor: theme.palette.mode === "dark" ? "#61c258" : "#4c9c44", // Green background color
  color: theme.palette.mode === "dark" ? "#000" : "#fff", // White text color
  height: "40px", // Set height
  justifyContent: "center", // Center content vertically
}));

// Styled Link component with custom styles
const LinkStyled = styled(Link)(({ theme }) => ({
  marginLeft: theme.spacing(1), // Add margin to the left
  color: theme.palette.mode === "dark" ? "#000" : "#fff", // White text color
}));

// Styled Typography component for heading
const Heading = styled(Typography)(({ theme }) => ({
  fontSize: "30px", // Set font size
  fontWeight: "bold", // Bold font weight
  textAlign: "left", // Left align text
  marginBottom: theme.spacing(2), // Add bottom margin
}));

// Styled Typography component for body text
const BodyText = styled(Typography)(({ theme }) => ({
  fontSize: "14px", // Set font size
  textAlign: "left", // Left align text
  marginBottom: theme.spacing(2), // Add bottom margin
}));

// Styled Button component with custom styles
const ButtonStyled = styled(Button)(({ theme }) => ({
  "backgroundColor": theme.palette.mode === "dark" ? "#61c258" : "#4c9c44", // Green background color to match AppBar
  "color": theme.palette.mode === "dark" ? "#000" : "#fff", // White text color
  "textTransform": "none", // Disable text transformation
  "height": "40px", // Set height
  "marginTop": theme.spacing(2), // Add top margin
  "fontSize": "16px", // Set font size
  "padding": theme.spacing(1.5), // Add padding
  "&:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#4f4c45" : "#f5f3ed", // Change background color on hover
    boxShadow: "none", // Remove box shadow on hover
    color: theme.palette.mode === "dark" ? "#fff" : "#000", // Change text color on hover
  },
  "&.Mui-selected, &.Mui-selected:hover": {
    boxShadow: "none", // Remove box shadow when selected
    backgroundColor: theme.palette.mode === "dark" ? "#c9a227" : "#fece2f", // Change background color when selected
  },
}));

// Styled Container component with custom styles for layout
const CenteredContainer = styled(Container)(({ theme }) => ({
  display: "flex", // Set display to flex
  justifyContent: "space-between", // Space between items
  alignItems: "center", // Center items vertically
  flexDirection: "row", // Set flex direction to row
  padding: 0, // Remove padding
  height: "calc(100vh - 190px)", // Set height to 100% of viewport height minus 190px
  width: "100vw", // Set width to 100% of viewport width
  position: "relative", // Set position to relative
  top: 0, // Set top position
  left: 0, // Set left position
  // backgroundColor: "blue", // Uncomment to see the blue background
}));

// Styled Box component for content box with custom styles
const ContentBox = styled(Box)(({ theme }) => ({
  display: "flex", // Set display to flex
  alignItems: "center", // Center items vertically
  maxWidth: "500px", // Set max width
  height: "100%", // Take full height of the container
  padding: theme.spacing(2), // Add padding inside the box
  marginRight: theme.spacing(2), // Add margin to the right
}));

// Array of image data for the image list
const itemData = [
  { img: "buff1.jpg", title: "buffalo" },
  { img: "buff2.jpg", title: "Tea" },
  { img: "buff3.jpg", title: "Sink" },
  { img: "buff4.jpg", title: "Kitchen" },
  { img: "buff5.jpg", title: "Blinds" },
  { img: "buff6.jpg", title: "Chairs" },
  { img: "buff7.jpg", title: "Laptop" },
  { img: "buff8.jpg", title: "Doors" },
  { img: "buff9.jpg", title: "Coffee" },
];

// Functional component to render a masonry image list
function MasonryImageList() {
  return (
    <Box
      sx={{
        width: "calc(100vw - 820px)", // Set width
        height: "auto", // Auto height
        overflowY: "hidden", // Hide vertical overflow
        marginTop: "70px", // Add top margin
      }}
    >
      <ImageList variant="woven" cols={3} gap={7}>
        {" "}
        {/* Image list with woven variant, 3 columns, and gap */}
        {itemData.map((item) => (
          <ImageListItem key={item.img}>
            {" "}
            {/* Iterate over itemData to create ImageListItems */}
            <img
              srcSet={`${item.img}?w=248&fit=crop&auto=format&dpr=2 2x`} // Set image source for different resolutions
              src={`${item.img}?w=248&fit=crop&auto=format`} // Set image source
              alt={item.title} // Set image alt text
              loading="lazy" // Lazy load images
            />
          </ImageListItem>
        ))}
      </ImageList>
      {/* Credit Line */}
      <Typography
        variant="body2"
        sx={(theme) => ({
          marginTop: 2,
          textAlign: "center",
          color: theme.palette.mode === "dark" ? theme.palette.text.secondary : "#555",
          fontStyle: "italic",
        })}
      >
        Photo credits: CIMMYT; ACASA-BISA
      </Typography>
    </Box>
  );
}

// Main functional component for Feedback1
function Feedback1() {
  const [feedback, setFeedback] = React.useState("");
  const [email, setEmail] = React.useState(""); // User email
  const [status, setStatus] = React.useState("");

  const handleSendFeedback = async () => {
    if (!email || !feedback) {
      setStatus("Please enter both your email and feedback.");
      return;
    }

    const templateParams = {
      email: email, // User's email
      message: feedback, // Feedback message
      time: new Date().toLocaleString(),
    };

    try {
      await emailjs.send(
        "service_myrqyfj", // EmailJS Service ID
        "template_awkgclo", // EmailJS Template Id
        templateParams,
        "gftnbV5-h7bxkgqP-" // EmailJS Public key
      );
      setStatus("Feedback sent successfully!");
      setFeedback("");
      setEmail("");
      window.alert("Feedback sent successfully! Thank you for your input.");
    } catch (error) {
      setStatus("Failed to send feedback. Please try again.");
      console.error("EmailJS Error:", error);
    }
  };

  return (
    <Box sx={(theme) => ({ flexGrow: 1, marginTop: "80px", backgroundColor: theme.palette.background.paper, height: "100vh" })}>
      {" "}
      {/* Main container box */}
      <AppBarStyled position="static">
        {" "}
        {/* Styled AppBar component */}
        <Typography fontSize={16} sx={{ fontStyle: "italic", justifyItems: "center" }}>
          {" "}
          {/* Typography for AppBar text */}
          Hey
          <WavingHandIcon sx={{ fontSize: "1rem", display: "inline", justifyItems: "center", marginLeft: "0.5rem" }} /> {/*👋 */} Your feedback means the world to us. Share your opinion.
        </Typography>
      </AppBarStyled>
      <CenteredContainer>
        {" "}
        {/* Centered container for layout */}
        <ContentBox>
          {" "}
          {/* Content box for text and button */}
          <Box sx={(theme) => ({ marginTop: 15, position: "relative", color: theme.palette.mode === "dark" ? "#fff" : "#000" })}>
            <Heading>
              Feedback <TryIcon fontSize="11px" /> {/* Heading with icon */}
            </Heading>
            <BodyText>
              {/*Thank you for visiting the test version of the Atlas of Climate Adaptation in South Asian Agriculture (ACASA). We value your feedback on this test version, which will help us improve our
              data analytics and content before the official release of the first version. Please take a moment to complete this quick feedback and share your thoughts with us.*/}
              Thank you for exploring the Atlas of Climate Adaptation in South Asian Agriculture (ACASA). This is our first official version or Version 1.0. We appreciate your feedback to help us
              refine and enhance the platform. Your insights will contribute to improving our data, analytics, content, and overall user experience. Please take a moment to share your overall thought
              and tab-specific insights with us, if any.
            </BodyText>
            {/*<ButtonStyled
              variant="contained"
              component="a"
              href="https://docs.google.com/forms/d/e/1FAIpQLSe7C-wqIeJ2myFs-7bBfzf5RvrZTFec17nLVQsawNRj4vftdw/viewform" // Feedback form URL
              target="_blank" // Open in a new tab
              rel="noopener noreferrer" // Prevents security vulnerabilities
            >
              Feedback Form
            </ButtonStyled>*/}

            {/*}
            <TextField label="Your Feedback" multiline rows={4} variant="outlined" fullWidth value={feedback} onChange={(e) => setFeedback(e.target.value)} sx={{ marginTop: 2 }} />

            <ButtonStyled onClick={handleSendFeedback}>Submit Feedback</ButtonStyled>
            */}
            {/* Email Input */}
            <TextField label="Your Email" type="email" variant="outlined" fullWidth value={email} onChange={(e) => setEmail(e.target.value)} sx={{ marginTop: 1 }} />

            {/* Feedback Input */}
            <TextField label="Your Feedback" multiline rows={4} variant="outlined" fullWidth value={feedback} onChange={(e) => setFeedback(e.target.value)} sx={{ marginTop: 2 }} />

            {/* Submit Button */}
            <ButtonStyled variant="contained" onClick={handleSendFeedback} sx={{ marginTop: 2 }}>
              Submit Feedback
            </ButtonStyled>
          </Box>
        </ContentBox>
        <MasonryImageList /> {/* Render masonry image list */}
      </CenteredContainer>
    </Box>
  );
}

export default Feedback1; // Export Feedback1 component as default export
