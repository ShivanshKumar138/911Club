import React, { useEffect, useState } from "react";
import { Typography, Grid, IconButton, Box } from "@mui/material";
import { useLocation } from "react-router-dom";
import axios from "axios";
import Mobile from "./Mobile";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import { domain } from "./config";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";

const DetailsMain = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const selectedDate = location.state?.date;
  const [levels, setLevels] = useState([]);
  const [commissionData, setCommissionData] = useState({
    commissionCount: 0,
    investorAmount: 0,
    totalCommission: 0,
    depositAmount: 0,
    betAmount: 0,
    totalLotteryBetAmount: 0,
    totalGameGeneratedCommission: 0,
    levelCommissions: {},
    levelBetTotals: {},
    gameLevelCommission: {},
  });

  useEffect(() => {
    const fetchCommissionData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const { data } = await axios.get(`${domain}/commission-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Commission data:", data);
        // Check if data is available for the selectedDate
        const dateData = data.groupedByDate[selectedDate];
  
        if (!dateData) {
          // If no data is found for the selected date, set default values
          setCommissionData({
            commissionCount: 0,
            investorAmount: 0,
            totalCommission: 0,
            depositAmount: 0,
            betAmount: 0,
            totalLotteryBetAmount: 0,
            totalGameGeneratedCommission: 0,
            levelCommissions: {},
            levelBetTotals: {},
            gameLevelCommission: {},
          });
          return;
        }
  
        // Extract data for the selected date
        const {
          commissionHistories,
          levelCommissionTotals,
          levelBetTotals,
          levelCommissionGames,
          totalGameGeneratedCommission,
        } = dateData;
  
         // Count unique UIDs instead of total records
    const uniqueUids = new Set(
      commissionHistories.map(item => item.commissionFromUserDetails.uid)
    );
    let commissionCount = uniqueUids.size;

        let investorAmount = 0;
        let totalCommission = 0;
        let depositAmount = 0;
        let betAmount = 0;
        let totalLotteryBetAmount = 0;
        let gameLevelCommission = {};
        const levelCommissions = {};
        const levelBetTotalsData = {};
  
        commissionHistories.forEach((item) => {
          totalCommission += item.amount;
          betAmount += item.betAmount;
          depositAmount += item.depositAmount;
          investorAmount += item.betAmount + item.depositAmountOfUser;
  
          // Calculate totalLotteryBetAmount
          totalLotteryBetAmount += item.betAmount;
  
          // Update levelCommissions and levelBetTotals
          const level = `l${item.commissionLevel}`;
          if (!levelCommissions[level])
            levelCommissions[level] = { amount: 0, dates: [], uids: [] };
          if (!levelBetTotalsData[level])
            levelBetTotalsData[level] = { amount: 0, dates: [] };
  
          levelCommissions[level].amount += item.amount;
          levelCommissions[level].dates.push(item.date);
          levelCommissions[level].uids.push(item.commissionFromUserDetails.uid);
          levelBetTotalsData[level].amount += item.betAmount;
          levelBetTotalsData[level].dates.push(item.date);
        });
  
        // Use the totalGameGeneratedCommission from API response
        console.log(
          "Total Game Generated Commission:",
          totalGameGeneratedCommission
        );
  
        // Process gameLevelCommission
        Object.entries(levelCommissionGames).forEach(
          ([level, commissionData]) => {
            gameLevelCommission[level] = commissionData.amount || 0;
          }
        );
  
        setCommissionData({
          commissionCount,
          investorAmount,
          totalCommission,
          depositAmount,
          betAmount,
          totalLotteryBetAmount,
          totalGameGeneratedCommission,
          levelCommissions,
          levelBetTotals: levelBetTotalsData,
          gameLevelCommission,
        });
      } catch (err) {
        console.error("Error fetching commission data:", err);
        // Set default values in case of error
        setCommissionData({
          commissionCount: 0,
          investorAmount: 0,
          totalCommission: 0,
          depositAmount: 0,
          betAmount: 0,
          totalLotteryBetAmount: 0,
          totalGameGeneratedCommission: 0,
          levelCommissions: {},
          levelBetTotals: {},
          gameLevelCommission: {},
        });
      }
    };
  
    const fetchLevelsData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const { data } = await axios.get(`${domain}/levels`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        console.log("Levels data:", data);
        // Assuming data.data[0].levels contains the levels data
        const levelsResponse = data.data[0].levels || {};
  
        // Map response to the desired format
        const levelsData = [
          { level: "1", ratio: levelsResponse.level1 || "0.0%" },
          { level: "2", ratio: levelsResponse.level2 || "0.0%" },
          { level: "3", ratio: levelsResponse.level3 || "0.0%" },
          { level: "4", ratio: levelsResponse.level4 || "0.0%" },
          { level: "5", ratio: levelsResponse.level5 || "0.0%" },
          { level: "6", ratio: levelsResponse.level6 || "0.0%" },
        ];
  
        setLevels(levelsData);
      } catch (err) {
        console.error("Error fetching levels data:", err);
  
        // Set default levels in case of an error
        const defaultLevels = [
          { level: "1", ratio: "0.0%" },
          { level: "2", ratio: "0.0%" },
          { level: "3", ratio: "0.0%" },
          { level: "4", ratio: "0.0%" },
          { level: "5", ratio: "0.0%" },
          { level: "6", ratio: "0.0%" },
        ];
  
        setLevels(defaultLevels);
      }
    };
  
    fetchLevelsData();
    fetchCommissionData();
  }, [selectedDate]);

  const handleRedirect = () => {
    navigate(-1);
  };
  return (
    <Mobile>
      <Box
        display="flex"
        flexDirection="column"
        height="calc(var(--vh, 1vh) * 100)"
        position="relative"
        backgroundColor="#f2f2f1"
      >
        <Box flexGrow={1}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)", // Updated background color
              padding: "4px 8px",
              color: "white", // Updated text color
            }}
          >
            <Grid item container alignItems="center" justifyContent="center">
              <Grid item xs={2}>
                <IconButton
                  sx={{ color: "white", ml: -5 }} // Updated icon color
                  onClick={handleRedirect}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
              <Grid item xs={10}>
                <Typography
                  variant="h6"
                  sx={{
                    color: "white", // Updated text color
                    flexGrow: 1,
                    textAlign: "center",
                    mr: 8,
                  }}
                >
                  Details
                </Typography>
              </Grid>
            </Grid>
          </Grid>

          <Box sx={{ padding: "16px", color: "white" }}>
            <DetailsBox
              selectedDate={selectedDate}
              commissionData={commissionData}
            />

            <CommissionDetailsBox
              commissionData={commissionData}
              levels={levels}
            />
          </Box>
        </Box>
      </Box>
    </Mobile>
  );
};

const DetailsBox = ({ selectedDate, commissionData }) => (
  <Box
    sx={{
      border: "1px solid #E0E0E0",
      borderRadius: "8px",
      padding: "16px",
      backgroundColor: "#FFFFFF",
      color: "#000000",
      maxWidth: "400px",
      margin: "16px auto",
      boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
    }}
  >
    <Typography
      variant="body2"
      sx={{
        color: "#000000",
        marginBottom: "8px",
        textAlign: "start",
      }}
    >
      {selectedDate || "No date selected"}
    </Typography>
    <Box
      sx={{
        borderBottom: "1px solid #E0E0E0",
        marginBottom: "16px",
      }}
    ></Box>
    <Grid container spacing={1}>
      <Grid item xs={12} container justifyContent="space-between">
        <Typography variant="body2">Total number of bettors</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          {commissionData.commissionCount} People
        </Typography>
      </Grid>

      <Grid item xs={12} container justifyContent="space-between">
        <Typography variant="body2">Total Invested amount</Typography>
        <Typography
          variant="body2"
          sx={{ color: "#FF5722", fontWeight: "bold" }}
        >
          ₹{commissionData.investorAmount.toFixed(2)}
        </Typography>
      </Grid>

      <Grid item xs={12} container justifyContent="space-between">
        <Typography variant="body2">Total commission settlement</Typography>
        <Typography variant="body2" sx={{ fontWeight: "bold" }}>
          ₹{commissionData.totalCommission.toFixed(2)}
        </Typography>
      </Grid>
    </Grid>

    <Box
      sx={{
        marginTop: "16px",
        textAlign: "center",
        padding: "8px 16px",
        borderRadius: "24px",
        border: "1px solid #F95959",
        color: "#F95959",
        fontWeight: "bold",
        cursor: "pointer",
        "&:hover": {
          background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
          color: "white",
        },
      }}
    >
      Rebate level rules
    </Box>
  </Box>
);

const CommissionDetailsBox = ({ commissionData, levels }) => {
  return (
    <Box
      sx={{
        border: "1px solid #E0E0E0",
        borderRadius: "8px",
        // padding: "16px",
        backgroundColor: "#FFFFFF",
        color: "#000000",
        maxWidth: "400px",
        margin: "16px auto",
        boxShadow: "0px 2px 10px rgba(0, 0, 0, 0.1)",
      }}
    >
      <Box sx={{ paddingX: "0.75rem", marginTop: "1rem" }}>
        <Typography
          variant="h6"
          sx={{
            marginBottom: "16px",
            fontSize: "14px",
            textAlign: "start",
          }}
        >
          Lottery Commission
        </Typography>

        <Grid container spacing={1}>
          <CommissionDetailRow
            label="Number of bettors"
            value={`${commissionData.commissionCount} People`}
          />
          <CommissionDetailRow
            label="Rebate level"
            value="LV0"
            color="#F95959"
          />
          <CommissionDetailRow
            label="Bet amount"
            value={`₹${commissionData.totalLotteryBetAmount.toFixed(2)}`}
            color="#FF5722"
          />
          <CommissionDetailRow
            label="Commission payout"
            value={`₹${commissionData.totalGameGeneratedCommission.toFixed(2)}`}
            color="#FF5722"
          />
        </Grid>
      </Box>

      <Typography
        variant="h6"
        sx={{
          backgroundColor: " #F95959",
          padding: "8px 16px",
          // borderRadius: "4px",
          color: "white",
          textAlign: "center",
          marginBottom: "16px",
          marginTop: "18px",
        }}
      >
        Lottery Commission
      </Typography>
      <Grid container sx={{ marginBottom: 1 }}>
        <Grid item xs={3}>
          <Typography
            sx={{ fontWeight: "bold", color: " #F95959", fontSize: "13px" }}
          >
            Lower level
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Bet amount
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Rebate ratio
          </Typography>
        </Grid>
        <Grid item xs={3}>
          <Typography sx={{ fontWeight: "bold", fontSize: "13px" }}>
            Total
          </Typography>
        </Grid>
      </Grid>

      {levels.map((level, index) => {
        const levelKey = `l${level.level}`;
        return (
          <Grid
            container
            key={index}
            sx={{
              padding: "8px 0",
              backgroundColor: index % 2 === 0 ? "#f0f0ef" : "inherit",
            }}
          >
            <Grid item xs={3}>
              <Box
                sx={{
                  position: "relative",
                  display: "inline-block",
                  width: "100%",
                }}
              >
                <img
                  src={`../../games/assets/lv-450d4246.png`}
                  alt={level.level}
                  style={{ width: "60%", borderRadius: "8px" }} // Optional: Add border-radius for rounded corners
                />
                <Typography
                  sx={{
                    position: "absolute",
                    top: "60%",
                    left: "65%",
                    transform: "translate(-50%, -50%)",
                    color: "#fff670",
                    // fontWeight: "bold",
                    fontSize: "0.6rem",
                    // textShadow: "2px 2px 4px rgba(0, 0, 0, 0.5)", // Optional: Add shadow for better readability
                  }}
                >
                  LV{level.level}
                </Typography>
              </Box>
            </Grid>

            <Grid item xs={3}>
              <Typography>
                ₹
                {(commissionData.levelBetTotals[levelKey]?.amount || 0).toFixed(
                  2
                )}
              </Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography>{level.ratio}%</Typography>
            </Grid>
            <Grid item xs={3}>
              <Typography variant="body2">
                ₹
                {(commissionData.gameLevelCommission[levelKey] || 0).toFixed(2)}
              </Typography>
            </Grid>
          </Grid>
        );
      })}
    </Box>
  );
};

const CommissionDetailRow = ({ label, value, color = "inherit" }) => (
  <Grid item xs={12} container justifyContent="space-between">
    <Typography variant="body2">{label}</Typography>
    <Typography variant="body2" sx={{ fontWeight: "bold", color }}>
      {value}
    </Typography>
  </Grid>
);

export default DetailsMain;
