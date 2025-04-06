import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Typography,
  Grid,
  Box,
  AppBar,
  Toolbar,
  Button,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { domain } from "../Components/config";
// import icon from "../../games/assets/No data-rafiki.png"
import LotteryIcon from "../../public/GameHistory/LotteryUnlight.png"
const GameStatsItem = ({ stats }) => {
  if (!stats) return null; // No data to show if stats is undefined

  return (
    <Box
      className="gamestats-container-items"
      sx={{
        padding: "16px",
        borderRadius: "8px",
        boxShadow: 1,
        backgroundColor: "",
        mt: 2,
      }}
    >
      <Box className="gamestats-container-item">
        <Grid container alignItems="center">
          <Grid item>
            <img
              alt="Lottery"
              src={LotteryIcon}
              style={{ marginRight: "8px" }}
            />
          </Grid>
          <Grid item>
            <Typography
              variant="h6"
              component="span"
              sx={{ fontWeight: "bold" }}
            >
              Lottery
            </Typography>
          </Grid>
        </Grid>
        <Box
          className="gamestats-container-item-content"
          sx={{ marginTop: "16px" }}
        >
          <Box
            className="gamestats-container-item-content-list"
            sx={{
              display: "flex",
              flexDirection: "column",
              gap: "4px", // Reduced spacing between each item
            }}
          >
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {" "}
                {/* Smaller text */}
                Total bet
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "" }}>
                {" "}
                {/* Smaller text */}₹{stats.totalAmountBet.toFixed(2)}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {" "}
                {/* Smaller text */}
                Number of bets
              </Typography>
              <Typography variant="body2" sx={{ fontWeight: "" }}>
                {" "}
                {/* Smaller text */}
                {stats.totalBets}
              </Typography>
            </Box>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Typography variant="body2" color="textSecondary">
                {" "}
                {/* Smaller text */}
                Winning amount
              </Typography>
              <Typography variant="body2" sx={{ color: "#4782ff" }}>
                {" "}
                {/* Smaller text */}₹{stats.winningAmount.toFixed(2)}
              </Typography>
            </Box>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

function GameStatisticsMain({ children }) {
  const [activeButton, setActiveButton] = useState("Today");
  const [stats, setStats] = useState({
    totalBets: 0,
    totalAmountBet: 0,
    winningAmount: 0,
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const handleButtonClick = (buttonName) => {
    setActiveButton(buttonName);
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const fetchData = async () => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/bet-stats`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      console.log("Response data:", response.data); // Debugging statement
  
      // Map activeButton to response data key
      const keyMap = {
        Today: "today",
        Yesterday: "yesterday",
        "This week": "thisWeek",
        "This month": "thisMonth",
      };
  
      const key = keyMap[activeButton];
      console.log("Fetching stats for key:", key); // Debugging statement
  
      // Ensure the key exists in response data
      const newStats = response.data[key] || {
        totalBets: 0,
        totalAmountBet: 0,
        winningAmount: 0,
      };
  
      console.log("New stats data:", newStats); // Debugging statement
      setStats(newStats);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching data:", error); // Debugging statement
      setError("Failed to fetch data");
      setLoading(false);
    }
  };
  useEffect(() => {
    fetchData();
  }, [activeButton]);

  if (loading) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        height="100vh"
      >
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  const noDataAvailable =
    stats.totalBets === 0 &&
    stats.totalAmountBet === 0 &&
    stats.winningAmount === 0;

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
          sx={{ backgroundColor: "#F7F8FF" }}
        >
          <AppBar
            position="sticky"
            sx={{
              bgcolor: "#F95959", // Green background color
              boxShadow: "none",
              borderBottom: "1px solid #",
            }}
          >
            <Toolbar>
              <Grid
                container
                alignItems="center"
                justifyContent="space-between"
              >
                <Grid item xs={1} textAlign="left">
                  <IconButton color="inherit" onClick={handleBackClick}>
                    <ArrowBackIcon sx={{ color: "white" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={11} textAlign="center">
                  <Typography
                    variant="h6"
                    component="div"
                    sx={{ color: "white", fontWeight: "normal" }} // White text and normal font weight
                  >
                    Game Statistics
                  </Typography>
                </Grid>
              </Grid>
            </Toolbar>
          </AppBar>

          {/* Button Group */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "center",
              p: 2,
              backgroundColor: "380003",
            }}
          >
            {["Today", "Yesterday", "This week", "This month"].map((label) => (
              <Button
                key={label}
                onClick={() => handleButtonClick(label)}
                sx={{
                  flex: 1,
                  height: "30px",
                  bgcolor: activeButton === label ? "#F95959" : "white",
                  color: activeButton === label ? "white" : "black",

                  borderRadius: "20px",
                  marginRight: "10px",
                  fontSize: "12px",
                  padding: "5px 10px",
                  minWidth: "auto",
                  lineHeight: "1",
                  textTransform: "none",
                  border:
                    activeButton === label
                      ? "1px solid #ccc"
                      : "1px solid transparent",
                }}
              >
                {label}
              </Button>
            ))}
          </Box>

          {/* Box below the buttons */}
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              borderRadius: "10px",
              p: 2,
              mt: 2,
              mx: 2,
              border: "1px solid #e0e0e0", // Light gray border
              bgcolor: "#FFFFFF",
            }}
          >
            <Typography
              variant="h5"
              sx={{ color: "#F95959", fontWeight: "bold" }}
            >
              ₹{stats.totalAmountBet.toFixed(2)}
            </Typography>
            <Typography variant="subtitle1" sx={{ color: "black" }}>
              Total bet
            </Typography>
          </Box>

          {/* Box below the buttons */}
          {noDataAvailable ? (
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#F95959",
                borderRadius: "10px",
                p: 2,
                mt: 2,
                mx: 2,
                border: "1px solid #e0e0e0", // Light gray border
              }}
            >
              <Box
                component="img"
                src="../../games/assets/No data-rafiki.png" // Update with the correct image path
                alt="No data"
                sx={{ width: "100px", mt: 2, opacity: 0.5 }}
              />
              <Typography variant="body2" sx={{ color: "grey", mt: 1 }}>
                No data available
              </Typography>
            </Box>
          ) : (
            <Box sx={{ paddingX: "1.1rem" }}>
              {/* Game Stats Item Component */}
              <GameStatsItem stats={stats} />
            </Box>
          )}
        </Box>
      </Mobile>
    </div>
  );
}

export default GameStatisticsMain;
