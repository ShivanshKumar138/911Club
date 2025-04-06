import React from "react";
import { Box, Typography, TextField, Button, Container } from "@mui/material";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import Customer from "../assets/Customer.png";
import Mobile from "./Mobile";
import { useNavigate } from "react-router-dom";

const FeedbackPage = () => {
  const navigate = useNavigate();

  const handleBackClick = () => {
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth="xs"
        sx={{
          bgcolor: "#f5f5f5",
          height: "100vh",
          maxWidth: "100vw", // Set the maxWidth to 100vw to handle viewport width
          display: "flex",
          flexDirection: "column",
        }}
      >
        <Box
          sx={{
            bgcolor: "#F95959",
            padding: "8px 10px",
            display: "flex",
            alignItems: "center",
            color: "white",
          }}
        >
          <ChevronLeftIcon
            sx={{ fontSize: 30, cursor: "pointer" }}
            onClick={handleBackClick}
          />

          <Typography
            variant="h6"
            sx={{
              flexGrow: 1,
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "white",
            }}
          >
            Feedback
          </Typography>
        </Box>

        <Box sx={{ p: 2, flexGrow: 1 }}>
          <TextField
            fullWidth
            multiline
            rows={14}
            placeholder="Welcome to feedback, please give feedback - please describe the problem in detail when providing feedback, preferably attach a screenshot of the problem you encountered, we will immediately process your feedback!"
            variant="outlined"
            InputProps={{
              sx: {
                bgcolor: "white",
                borderRadius: 2,
                textAlign: "center",
                alignItems: "center",
                border: "none",
                "& textarea": {
                  textAlign: "center",
                },
                "& fieldset": {
                  border: "none",
                },
              },
            }}
            sx={{ mb: 4 }}
          />

          <Box sx={{ textAlign: "center", mb: 2 }}>
            <Typography variant="body1">Send helpful feedback</Typography>
            <Typography variant="body1">
              Chance to win Mystery Rewards
            </Typography>
          </Box>

          <Box sx={{ display: "flex", justifyContent: "center", mb: 2 }}>
            <Box
              component="img"
              src={Customer}
              alt="Feedback rewards"
              sx={{ width: "50%", height: "auto" }}
            />
          </Box>

          <Button
            fullWidth
            variant="contained"
            sx={{
              bgcolor: "#F95959",
              color: "white",
              borderRadius: "50px",
              border: "none",
              boxShadow: "none",
              padding: "10px 20px",
              "&:hover": {
                bgcolor: "#ffc700",
                border: "none",
              },
              "&:focus": {
                outline: "none",
                border: "none",
              },
              "&:active": {
                bgcolor: "#ffc700",
                border: "none",
                outline: "none",
              },
            }}
          >
            Submit
          </Button>
        </Box>
      </Container>
    </Mobile>
  );
};

export default FeedbackPage;
