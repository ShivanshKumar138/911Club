import React from "react";
import {
  Box,
  Typography,
  IconButton,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  Grid,
  TableRow,
  Button,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import WarningIcon from "@mui/icons-material/Warning";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import HeadsetMicIcon from "@mui/icons-material/HeadsetMic";
import Mobile from "../Components/Mobile";

// Bonus data array
const bonusData = [
  { winningRate: "10X-19X", betAmount: "₹30-₹99999", bonus: "₹50.00" },
  { winningRate: "20X-29X", betAmount: "₹30-₹99999", bonus: "₹100.00" },
  { winningRate: "30X-39X", betAmount: "₹30-₹99999", bonus: "₹200.00" },
  { winningRate: "40X-59X", betAmount: "₹30-₹99999", bonus: "₹300.00" },
  { winningRate: "60X-999999X", betAmount: "₹30-₹99999", bonus: "₹500.00" },
];

const Rule = () => {
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
            maxWidth: "sm",
            mx: "auto",
          }}
        >
         <Box
  sx={{
    bgcolor: "#F95959", // Set the background color to match the theme
    p: 1,
    display: "flex",
    alignItems: "center",
  }}
>
  <IconButton
    edge="start"
    color="inherit"
    aria-label="back"
    sx={{ color: "white", ml: -1 }} // Set icon color to white
    onClick={handleRedirect}
  >
    <ArrowBackIosNewIcon />
  </IconButton>
  <Typography
    variant="h6"
    component="div"
    sx={{ flexGrow: 1, textAlign: "center", color: "white" }} // Set text color to white
  >
    Rule
  </Typography>
</Box>

          <Box
            sx={{
              p: 2,
              mb: 2,
              position: "relative",
              color: "white",
              overflow: "hidden",
            }}
          >
            {/* Background Image */}
            <Box
              component="img"
              src="../../assets/superJackpotRulebg-809c0012.png"
              alt="Super Jackpot Banner"
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "100%",
                height: "100%",
                zIndex: 0,
              }}
            />

            {/* Content */}
            <Box sx={{ position: "relative", zIndex: 2 }}>
              <Grid container spacing={2}>
                <Grid item xs={7} sx={{ textAlign: "left" }}>
                  <Typography variant="h6" sx={{ fontWeight: "bold", mb: 1 }}>
                    Super Jackpot
                  </Typography>
                  <Typography variant="caption" paragraph>
                    When you win the Super Jackpot in the game, you can get
                    additional platform bonuses, and the bonuses will be
                    distributed to you according to the multiple of the winning
                    prize.
                  </Typography>
                </Grid>
              </Grid>
              <Box
                sx={{
                  bgcolor: "rgba(252,69,0,0.4)",
                  p: 0.5,
                  borderRadius: 1,
                  display: "flex",
                  mb: -1,
                  alignItems: "center",
                }}
              >
                <WarningIcon sx={{ mr: 1 }} />
                <Typography variant="caption">
                  Warning: Please claim all bonuses before the event ends, after
                  the event ends, you will lose the chance to get the bonus.
                </Typography>
              </Box>
            </Box>
          </Box>

          <Box sx={{ p: 1.2, mb: 2 }}>
            <Typography
              variant="body1"
              gutterBottom
              sx={{ display: "flex", alignItems: "center", fontWeight: "bold" }}
            >
              <MonetizationOnIcon sx={{ mr: 1 }} /> Bonus
            </Typography>
            <TableContainer
              sx={{ backgroundColor: "#ffffff", borderRadius: "10px" }}
            >
              <Table>
                <TableHead>
                  <TableRow sx={{ bgcolor: "#F95959" }}>
                    <TableCell sx={{ color: "#ffffff" }}>
                      Winning rate
                    </TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Bet amount</TableCell>
                    <TableCell sx={{ color: "#ffffff" }}>Bonus</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {bonusData.map((row, index) => (
                    <TableRow
                      key={index}
                      sx={{ bgcolor: index % 2 === 0 ? "#ffffff" : "#f2f2f1" }}
                    >
                      <TableCell>{row.winningRate}</TableCell>
                      <TableCell>{row.betAmount}</TableCell>
                      <TableCell>{row.bonus}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          </Box>

          <Box sx={{ p: 1, mb: 2, bgcolor: "#ffffff", borderRadius: "10px", margin: 1 }}>
  <Typography
    variant="body2"
    sx={{ color: "#FF4500", display: "inline-flex", alignItems: "center", }}
  >
    <PlayArrowIcon sx={{ fontSize: "20px" }} />
    &nbsp;All event interpretation rights belong to the platform. If you have any questions, please contact customer service now.
  </Typography>
</Box>
          <Button
            variant="contained"
            
            // fullWidth
            startIcon={<HeadsetMicIcon />}
            sx={{
              width:"95%",
              bgcolor: "#F95959",
              p: 5,
              color: "white",
              fontWeight: "bold",
              "&:hover": {
                bgcolor: "#F95959",
              },
              py: 1,
              borderRadius: 10,
            }}
          >
            Contact customer service
          </Button>
        </Box>
        <br/>

      </Mobile>

    </div>
  );
};

export default Rule;
