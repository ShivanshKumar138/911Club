import React from "react";
import { Box, Button, Typography } from "@mui/material";

const DatePickerHeader = ({ onCancel, onConfirm }) => (
  <Box
    sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "center",
      padding: "7px 16px", // Adjusted padding for better spacing
      backgroundColor: "#fff",
      borderRadius: "8px 8px 0 0", // Add a rounded corner for the top
    }}
  >
    <Button
      onClick={onCancel}
      sx={{
        color: "grey",
        textTransform: "none",
        fontWeight: "normal",
      }}
    >
      Cancel
    </Button>

    <Typography
      variant="subtitle1"
      sx={{
        fontWeight: "bold",
        color: "black",
      }}
    >
      Choose a date
    </Typography>

    <Button
      onClick={onConfirm}
      sx={{
        color: "#F95959",
        textTransform: "none",
        fontWeight: "normal",
      }}
    >
      Confirm
    </Button>
  </Box>
);

export default DatePickerHeader;
