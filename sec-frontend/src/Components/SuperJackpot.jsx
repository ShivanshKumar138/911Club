import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Button,
  Paper,
  Grid,
} from "@mui/material";
import RuleIcon from "@mui/icons-material/Rule";
import StarIcon from "@mui/icons-material/Star";
import Mobile from "./Mobile";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const SuperJackpot = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/activity");
  };

  const handleNavigate = () => {
    navigate("/rule");
  };

  const handleWinning = () => {
    navigate("/winningstar");
  };
  return (
    <div>
      <Mobile>
        <Box
          maxWidth="sm"
          sx={{ bgcolor: "#f5f5f5", minHeight: "100vh", p: 0, mx: "auto" }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#F95959", py: 1 }} // Background color for the header
          >
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "white", ml: -2 }} // White color for the icon
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "white", // White color for the text
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                  // fontWeight: "bold", // Make the text bold for prominence
                }}
              >
                Super Jackpot
              </Typography>
            </Grid>
          </Grid>

          {/* Super Jackpot Banner */}
          <Paper
            sx={{
              p: 2,
              mb: 2,
              backgroundImage: `url("../../assets/superJackpot-53463ffb.png")`,
              backgroundPosition: "center",
              backgroundSize: "cover",
              minHeight: 200, // Use minHeight instead of height
              width: "auto",
              color: "white",
              position: "relative",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            <Typography variant="h6" sx={{ fontWeight: "bold" }}>
              Super Jackpot
            </Typography>
            <Typography variant="body2" paragraph>
              When you get the Super Jackpot in 【Slots】, you can get 1
              additional bonus.
            </Typography>
            <Typography variant="caption">
              The reward is valid for 1 day, and you will not be able to claim
              it after it expires!
            </Typography>
            <Box
              component="img"
              src="/path/to/gift-image.png"
              alt="Gift"
              sx={{
                position: "absolute",
                right: 0,
                bottom: 0,
                width: 100,
                height: "auto", // Ensure the image height is auto
              }}
            />
          </Paper>

          <Button
            variant="contained"
            fullWidth
            sx={{
              mb: 2,
              maxWidth: 380,
              bgcolor: "#F95959",
              color: "#ffffff",
              fontWeight: "bold",
              py: 1,
              borderRadius: "20px",
              textTransform: "none",
              "&:hover": {
                bgcolor: "#0C4E13", // Hover background color
              },
            }}
          >
            Receive in batches
          </Button>

          {/* Rule and Winning Star Buttons */}
          <Grid container spacing={1} sx={{ mb: 2, p: 1 }}>
            <Grid item xs={6}>
              <Button
                fullWidth
                startIcon={<RuleIcon />}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: "black",
                  borderRadius: "10px",
                  py: 1.5,
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onClick={handleNavigate}
              >
                Rule
              </Button>
            </Grid>
            <Grid item xs={6}>
              <Button
                fullWidth
                startIcon={<StarIcon />}
                sx={{
                  bgcolor: "#FFFFFF",
                  color: "black",
                  borderRadius: "10px",
                  py: 1.5,
                  textTransform: "none",
                  display: "flex",
                  flexDirection: "column",
                  textAlign: "center",
                  fontWeight: "bold",
                }}
                onClick={handleWinning}
              >
                Winning star
              </Button>
            </Grid>
          </Grid>

          {/* No Jackpot Message */}
          <Box
            sx={{
              height: 150,
              display: "flex",
              flexDirection: "column",
              justifyContent: "center",
              alignItems: "center",
              bgcolor: "white",
              margin: 1,
              borderRadius: "10px",
              mb: 2,
              p: 2,
            }}
          >
            <Typography variant="body1" color="text.secondary">
              You don't have a big jackpot yet, let's bet
            </Typography>
          </Box>

          {/* Bet Button */}
          <Button
            variant="contained"
            fullWidth
            sx={{
              bgcolor: " #F95959",
              color: "white",
              fontWeight: "bold",
              maxWidth: 350,
              borderRadius: "24px",
              alignItem: "center",
              py: 1,
              "&:hover": { bgcolor: " #F95959" },
            }}
          >
            {" "}
            Go bet{" "}
          </Button>
        </Box>
      </Mobile>
    </div>
  );
};

export default SuperJackpot;
