import React from "react";
import Mobile from "./Mobile";
import { CircularProgress, Box, Typography } from "@mui/material";

const LoadingScreen = () => {
  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        justifyContent="center"
        height="100vh" // Full viewport height
        sx={{ backgroundColor: "#ffffff", textAlign: "center", padding: "20px" }} // White background with padding
      >
        <CircularProgress 
          size={60} 
          thickness={5} 
          sx={{ color: "#1976d2", mb: 3 }} // Blue color for loader
        />
        <Typography 
          variant="h5" 
          sx={{ color: "#333333", fontWeight: 'bold' }} // Darker text for better contrast
        >
          Loading...
        </Typography>
        <Typography 
          variant="body2" 
          sx={{ color: "#666666", mt: 1 }} // Subtle grey text for secondary message
        >
          Please wait while we prepare everything for you.
        </Typography>
      </Box>
    </Mobile>
  );
};

export default LoadingScreen;
