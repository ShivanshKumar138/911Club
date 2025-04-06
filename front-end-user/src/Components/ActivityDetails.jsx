import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Grid,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import EventNoteIcon from "@mui/icons-material/EventNote";
import InfoOutlinedIcon from "@mui/icons-material/InfoOutlined";
import Mobile from "./Mobile";
import { useNavigate } from "react-router-dom";

const ActivityDetails = () => {
  const navigate = useNavigate();
  const handleRedirect = () => {
    navigate("/activity");
  };

  return (
    <div>
      <Mobile>
        <Box
          sx={{
            bgcolor: "#f5f5f5",
            minHeight: "100vh",
            p: 0,
            maxWidth: "600px",
            mx: "auto",
          }}
        >
          {/* Header with Back Button */}
          <Grid
            item
            container
            alignItems="center"
            justifyContent="center"
            sx={{ bgcolor: "#4782ff", py: 1 }} // Background color for the header
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
                }}
              >
                Activity Details
              </Typography>
            </Grid>
          </Grid>

          <Paper
            sx={{
              p: 2,
              mb: 2,
              backgroundImage: `url("../../assets/box-5efaaed8.png"), linear-gradient(45deg, #F95959, #FF6347)`,
              backgroundPosition: "center",
              backgroundSize: "cover", // Ensures the image covers the entire Paper
              color: "white",
              position: "relative",
              overflow: "hidden",
              textAlign: "left",
            }}
          >
            <Typography variant="h6" gutterBottom sx={{ fontWeight: "bold" }}>
              New member gift package
            </Typography>
            <Typography paragraph sx={{ fontSize: "13px" }}>
              There are two types of new member gift package rewards:
            </Typography>
            <Typography variant="body2" paragraph>
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  lineHeight: "20px",
                  textAlign: "center",
                  backgroundColor: "white",
                  color: "#F95959", // Color matching the gradient for contrast
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                1
              </span>
              Bonus bonus for first deposit negative profit
            </Typography>
            <Typography variant="body2">
              <span
                style={{
                  display: "inline-block",
                  width: "20px",
                  height: "20px",
                  lineHeight: "20px",
                  textAlign: "center",
                  backgroundColor: "white",
                  color: "#F95959", // Color matching the gradient for contrast
                  borderRadius: "50%",
                  marginRight: "8px",
                }}
              >
                2
              </span>
              Play games and get bonuses only for new members
            </Typography>
            <Button
              variant="outlined"
              sx={{
                color: "white",
                borderColor: "white",
                fontSize: "10px",
                borderRadius: "15px",
                height: "30px",
                width: "130px",
                marginTop: "16px",
                "&:hover": {
                  borderColor: "white",
                  backgroundColor: "rgba(255, 255, 255, 0.1)",
                },
              }}
            >
              Activity Details
            </Button>
          </Paper>

          <Paper
            sx={{ mb: 2, overflow: "hidden", borderRadius: "9px", margin: 1 }}
          >
            <Box
              sx={{
                bgcolor: "#4782ff",
                py: 0.5,
                maxWidth: 200,
                margin: "0 auto",
                px: 2,
                textAlign: "center",
                borderBottomLeftRadius: "50px",
                borderBottomRightRadius: "50px",
              }}
            >
              <Typography
                variant="subtitle1"
                sx={{ fontWeight: "bold", color: "white" }}
              >
                Event start time
              </Typography>
            </Box>
            <Box
              sx={{
                bgcolor: "white",
                py: 1,
                textAlign: "center",
                color: "red",
                
              }}
            >
              <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                2024-06-08 00:00:00
              </Typography>
            </Box>
          </Paper>

          <Paper sx={{ mb: 2, margin: 1, borderRadius: "10px" }}>
            <Grid container>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  color: "white",
                  bgcolor: "#4782ff",
                }}
              >
                <Typography variant="body2">
                  Conditions of participation
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  color: "white",
                  bgcolor: "#4782ff",
                }}
              >
                <Typography variant="body2">Get bonus the next day</Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  color: "white",
                  bgcolor: "#4782ff",
                }}
              >
                <Typography variant="body2">Bonus limit</Typography>
              </Grid>
            </Grid>
            <Grid container sx={{ borderTop: "1px solid #e0e0e0" }}>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2">
                  First deposit for new users
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body2">
                  Total negative profit rebate for the day
                </Typography>
                <Typography variant="body1" color="error">
                  30%
                </Typography>
              </Grid>
              <Grid
                item
                xs={4}
                sx={{
                  p: 1,
                  textAlign: "center",
                  borderRight: "1px solid #e0e0e0",
                }}
              >
                <Typography variant="body1" color="error">
                  ₹200.00
                </Typography>
              </Grid>
            </Grid>
          </Paper>

          <Box
            sx={{
              display: "flex",
              alignItems: "left",
              p: 1,
              bgcolor: "white",
              margin: 1,
              borderRadius: "50px",
              textAlign: "left",
              color: "red",
            }}
          >
            <InfoOutlinedIcon sx={{ mr: 1, color: "red" }} />
            <Typography variant="caption">
              The membership system that meets the standard automatically
              distributes bonuses
            </Typography>
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityDetails;
