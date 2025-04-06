import React from "react";
import Mobile from "./Mobile";
import { Typography, Box, Button } from "@mui/material";
import { useNavigate } from "react-router-dom";

const MaintenancePage = () => {
  const navigate = useNavigate();

  const handleHomeClick = () => {
    navigate("/"); // Replace with your desired home route
  };

  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        // height="100vh" // Set height to 100vh
        sx={{
          // backgroundColor: "#ffffff", // Set background to white
          padding: "20px",
          textAlign: "center",
        }}
      >
        <Typography 
          variant="h4" 
          sx={{ color: "#333333", mb: 2, fontWeight: "bold" }} // Darker text color for better contrast
        >
          We're Currently Under Maintenance
        </Typography>
        <Typography 
          variant="body1" 
          sx={{ color: "#666666", mb: 4 }} // Subtle grey text for secondary message
        >
          Our server is currently undergoing maintenance. We apologize for the inconvenience and appreciate your patience.
          Please check back later.
        </Typography>
        <Button
          variant="contained"
          sx={{
            backgroundColor: "#1976d2", // Material-UI blue
            color: "#ffffff",
            "&:hover": { backgroundColor: "#1565c0" }, // Slightly darker blue on hover
            padding: "12px 24px",
            fontSize: "16px",
            borderRadius: "8px", // Slightly rounded button corners for a modern look
          }}
          onClick={handleHomeClick}
        >
          Return to Home
        </Button>
      </Box>
    </Mobile>
  );
};

export default MaintenancePage;
