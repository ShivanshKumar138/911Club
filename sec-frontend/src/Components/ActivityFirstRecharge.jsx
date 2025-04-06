import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import {
  Typography,
  Grid,
  Box,
  Paper,
  SvgIcon,
  LinearProgress,
  Button,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

import DiamondIcon from "@mui/icons-material/Diamond";
import Mobile from "./Mobile";

const RhombusIcon = (props) => (
  <SvgIcon {...props}>
    <path d="M12 2L22 12L12 22L2 12L12 2Z" />
  </SvgIcon>
);
// Card Component to be rendered dynamically
function DepositCard({ depositAmount, bonusAmount, minimumDeposit }) {
  const [currentDeposit, setCurrentDeposit] = useState(0);
  const navigate = useNavigate(); // Initialize useNavigate

  const handleDeposit = () => {
    setCurrentDeposit(currentDeposit + depositAmount); // Update this logic as needed
    navigate("/recharge"); // Redirect to /recharge route
  };

  const progressPercentage = (currentDeposit / minimumDeposit) * 100;

  return (
    <Box
      sx={{
        border: "1px solid #ccc",
        borderRadius: "8px",
        padding: "8px 10px",
        backgroundColor: "#f5f5f5",
        marginBottom: "16px",
      }}
    >
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography sx={{ textAlign: "left" }} variant="h6">
          <Box component="span" sx={{ fontSize: "0.875rem" }}>
            Deposit
          </Box>{" "}
          <Box component="span" sx={{ fontSize: "1rem", color: "#FB6F6B" }}>
            {minimumDeposit}
          </Box>
        </Typography>
        <Grid item xs={4} textAlign="right">
          <Typography sx={{ color: "#FB6F6B", fontSize: "1rem" }}>
            +{bonusAmount}.00
          </Typography>
        </Grid>
      </Box>

      <Grid container spacing={2}>
        <Grid item xs={12}>
          <Typography
            sx={{ textAlign: "left", fontSize: "0.7rem", fontWeight: "bold" }}
          >
            Deposit {minimumDeposit} for the first time and you will receive{" "}
            {bonusAmount} bonus
          </Typography>
        </Grid>
      </Grid>
      <Box
        mt={2}
        sx={{
          position: "relative",
          display: "flex",
          alignItems: "center",
        }}
      >
        <LinearProgress
          variant="determinate"
          value={progressPercentage}
          color={progressPercentage >= 100 ? "success" : "primary"}
          sx={{
            flexGrow: 1,
            height: 18,
            borderRadius: 3,
            backgroundColor: "#d8d8d8", // Set background color here
            "& .MuiLinearProgress-bar": {
              backgroundColor: "#f6f6f6", // Keeps the bar color unchanged
            },
          }}
        />

        <Typography
          variant="caption"
          sx={{
            position: "absolute",
            left: "30%",
            top: "50%",
            transform: "translate(-50%, -50%)",
            color: "#FB6F6B",
            fontWeight: "bold",
          }}
        >
          {currentDeposit.toFixed(2)}/{minimumDeposit}
        </Typography>

        <Button
          color={progressPercentage >= 100 ? "success" : "primary"}
          onClick={handleDeposit}
          variant="outlined"
          sx={{
            ml: 4,
            height: 30,
            textTransform: "none",
            borderColor: "#FB6F6B",
            color: "#FB6F6B",
            "&:hover": {
              backgroundColor: "transparent",
              borderColor: "#FB6F6B",
            },
          }}
        >
          Deposit
        </Button>
      </Box>
    </Box>
  );
}

// ActivityRules Component
function ActivityRules() {
  return (
    <Paper sx={{ mb: 2, overflow: "hidden", borderRadius: "5px", margin: 0 }}>
      <Box
        sx={{
          bgcolor: "#FB6F6B",
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
          Activity Rules
        </Typography>
      </Box>
      <Box sx={{ mt: 2 }}>
        {[
          "Exclusive for the first recharge of the account. There is only one chance. The more you recharge, the more rewards you will receive. The highest reward is ₹8,888.00;",
          "Activities cannot be participated in repeatedly;",
          "Rewards can only be claimed manually on IOS, Android, H5, and PC;",
          "The bonus (excluding the principal) given in this event requires 1.00 times the coding turnover (i.e. valid bets) before it can be withdrawn, and the coding does not limit the platform;",
          "This event is limited to normal human operations by the account owner. It is prohibited to rent, use plug-ins, robots, gamble with different accounts, brush each other, arbitrage, interfaces, protocols, exploit loopholes, group control or other technical means to participate, otherwise it will be canceled or Rewards will be deducted, frozen, or even blacklisted;",
          "In order to avoid differences in text understanding, the platform reserves the right of final interpretation of this event.",
        ].map((rule, index) => (
          <Box
            key={index}
            sx={{
              display: "flex",
              alignItems: "start",
              mt: index === 0 ? 0 : 0,
              paddingX: "5%",
            }}
          >
            <RhombusIcon
              sx={{ color: "#FB6F6B", mr: 1, mt: "4px", fontSize: 10 }}
            />
            <Typography
              variant="body2"
              paragraph
              sx={{ textAlign: "justify", fontSize: "0.8rem" }}
            >
              {rule}
            </Typography>
          </Box>
        ))}
      </Box>
    </Paper>
  );
}

// Main Component
function ActivityFirstRecharge({ children }) {
  const [depositBonuses, setDepositBonuses] = useState([]);

  useEffect(() => {
    // Fetch deposit bonuses from API
    const fetchDepositBonuses = async () => {
      try {
        const response = await axios.get(`${domain}/all-deposit-bonuses`);
        setDepositBonuses(response.data);
      } catch (error) {
        console.error("Error fetching deposit bonuses:", error);
      }
    };

    fetchDepositBonuses();
  }, []);

  const navigate = useNavigate(); // Hook for navigation

  const handleBackClick = () => {
    // log.info('Back button clicked'); // Log the action
    navigate(-1); // Navigate to the previous page
  };

  return (
    <Mobile>
      <div>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1}>
            <Grid
              container
              alignItems="center"
              justifyContent="center" // Centered horizontally
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                background: "linear-gradient(90deg, #FB6F6B 0%, #FB6F6B 100%)",
                padding: "10px 16px",
                color: "white",
              }}
            >
              <Grid
                item
                xs={12}
                container
                alignItems="center"
                justifyContent="center"
              >
                <IconButton
                  sx={{ color: "white", position: "absolute", left: 0 }} // Positioned to the left
                  onClick={handleBackClick}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white",
                    textAlign: "center", // Centered text
                  }}
                >
                  First Deposit Bonus
                </Typography>
              </Grid>
              <Grid
                item
                xs={12}
                textAlign="right"
                sx={{ position: "absolute", right: 16 }}
              >
                {/* <IconButton color="inherit">
                  <SmsIcon />
                </IconButton> */}
              </Grid>
            </Grid>
            {/* Content start */}
            <Box sx={{ padding: "1.1rem", paddingBottom: "4rem" }}>
              {depositBonuses.map((bonus) => (
                <DepositCard
                  key={bonus?._id}
                  depositAmount={bonus?.minimumDeposit}
                  bonusAmount={bonus?.bonus}
                  minimumDeposit={bonus?.minimumDeposit}
                />
              ))}
              <ActivityRules />
            </Box>
            {/* Content end */}
          </Box>
          {children}
        </Box>
      </div>
    </Mobile>
  );
}

export default ActivityFirstRecharge;