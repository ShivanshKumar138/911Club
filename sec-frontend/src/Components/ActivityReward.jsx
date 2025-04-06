import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  Card,
  CardContent,
  CardMedia,
  Container,
  Divider,
  Grid,
  IconButton,
  LinearProgress,
  Typography,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import RestoreOutlinedIcon from "@mui/icons-material/RestoreOutlined";
import { domain } from "./config";
import Mobile from "./Mobile";

const ActivityAward = () => {
  const navigate = useNavigate();
  const [settings, setSettings] = useState([]);
  const [totalBetAmount, setTotalBetAmount] = useState(0);
  const [claimedRewards, setClaimedRewards] = useState([]);

  // Fetch total bets, activity reward settings, and claimed rewards from backend
  useEffect(() => {
    const fetchTotalBetsAndSettings = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const [betResponse, settingResponse, claimResponse] = await Promise.all([
          axios.get(`${domain}/user/todays/total-bets`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${domain}/api/activity-reward-settings`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
          axios.get(`${domain}/api/activity-reward-settings/user/claimed-rewards`, {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }),
        ]);
        setTotalBetAmount(betResponse.data.totalBetAmount);
        setSettings(settingResponse.data.data);
        setClaimedRewards(claimResponse.data.claimedRewards);
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchTotalBetsAndSettings();
  }, []);

  const handleRedirect = () => {
    navigate(-1);
  };

  const handleClaim = async (setting) => {
    const today = new Date().toISOString().split("T")[0];
    const hasClaimedToday = claimedRewards.some(
      (reward) => reward.cardId === setting._id && reward.date.startsWith(today)
    );
  
    if (totalBetAmount >= setting.minimumBettingAmount) {
      if (!hasClaimedToday) {
        try {
          const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
          const response = await axios.post(
            `${domain}/api/activity-reward-settings/activity-reward-claim`,
            {
              settingId: setting._id,
            },
            {
              withCredentials: true,
              headers: {
                Authorization: `Bearer ${token}`,
              },
            }
          );
          if (response.status === 200) {
            setClaimedRewards([
              ...claimedRewards,
              {
                cardId: setting._id,
                activityAward: setting.activityAward,
                date: new Date().toISOString(),
              },
            ]);
            alert("Award claimed successfully!");
          }
        } catch (error) {
          console.error("Error claiming award:", error);
          alert("Error claiming award. Please try again later.");
        }
      } else {
        alert("You have already claimed this reward today.");
      }
    } else {
      alert("You have not met the minimum betting amount for the reward.");
    }
  };

  const renderSettingCard = (setting, index) => {
    const progress = Math.min(
      (totalBetAmount / setting.minimumBettingAmount) * 100,
      100
    );
    const isCompleted = totalBetAmount >= setting.minimumBettingAmount;
    const isClaimed = claimedRewards.some(
      (reward) =>
        reward.cardId === setting._id &&
        new Date(reward.date).toISOString().split("T")[0] ===
          new Date().toISOString().split("T")[0]
    );

    const getButtonText = () => {
      if (isClaimed) return "Claimed";
      if (isCompleted) return "Tap to Claim";
      return "Complete Mission";
    };

    const getProgressText = () => {
      const achievedAmount = Math.min(
        totalBetAmount,
        setting.minimumBettingAmount
      );
      return `${achievedAmount}/${setting.minimumBettingAmount}`;
    };

    return (
      <Card
        key={index}
        sx={{
          backgroundColor: "#f2f2f1",
          color: "#80849c",
          borderRadius: 0,
          boxShadow: "none",
          overflow: "hidden",
        }}
      >
        <CardContent sx={{ padding: 2 }}>
          <Box
            sx={{
              padding: 2,
              backgroundColor: "#fff",
              borderRadius: "10px",
              boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
              position: "relative",
              minHeight: "130px",
            }}
          >
            <Box
              sx={{
                position: "absolute",
                top: 0,
                left: 0,
                width: "35%",
                height: "30px",
                backgroundColor: isClaimed ? "#F95959" : "#F95959",
                borderTopLeftRadius: "10px",
                borderBottomRightRadius: "10px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                paddingLeft: 1,
                zIndex: 1,
              }}
            >
              <Typography
                variant="body1"
                sx={{
                  color: "white",
                  fontWeight: "bold",
                  fontSize: "0.875rem",
                }}
              >
                {isClaimed ? "Claimed" : "Daily Mission"}
              </Typography>
            </Box>

            <Box sx={{ position: "absolute", top: "10px", right: "10px" }}>
              <Typography
                variant="subtitle2"
                sx={{ color: "#80849c", fontSize: "0.75rem" }}
              >
                {isClaimed
                  ? "Claimed"
                  : isCompleted
                  ? "Completed"
                  : "Unfinished"}
              </Typography>
            </Box>

            <Divider
              sx={{
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                marginBottom: 1,
                mt: "13px",
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
                paddingTop: "10px",
              }}
            >
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/banners/actr.png"
                  alt="Task Icon"
                  style={{
                    width: "28px",
                    height: "28px",
                    marginRight: "8px",
                  }}
                />
                <Typography
                  variant="body2"
                  sx={{ color: "#80849c", marginRight: "auto" }}
                >
                  Daily betting bonus
                </Typography>
              </Box>
              <Typography
                variant="body2"
                sx={{
                  color: "#ff4d4f",
                  fontWeight: "bold",
                  marginLeft: "8px",
                }}
              >
                {getProgressText()}
              </Typography>
            </Box>

            <LinearProgress
              variant="determinate"
              value={progress}
              sx={{
                height: 8,
                borderRadius: 1,
                backgroundColor: "#F95959",
                marginBottom: 1,
                "& .MuiLinearProgress-bar": {
                  backgroundColor: isClaimed ? "#F95959" : "#1a90ff",
                },
              }}
            />

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                marginBottom: 1,
              }}
            >
              <Typography variant="body2" sx={{ color: "#80849c" }}>
                Award amount
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center" }}>
                <img
                  src="/assets/wallet.png"
                  style={{
                    width: "20px",
                    height: "20px",
                    marginBottom: "3px",
                    paddingRight: "5px",
                  }}
                  alt="Wallet Icon"
                />
                <Typography
                  variant="h6"
                  sx={{ color: "#dd9138", fontSize: "1rem" }}
                >
                  ₹{setting.activityAward}
                </Typography>
              </Box>
            </Box>

            <Divider sx={{ background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)", marginBottom: 1 }} />

            <Button
              variant="outlined"
              sx={{
                width: "100%",
                color: isClaimed ? "#F95959" : "#4da6ff",
                borderColor: isClaimed ? "#F95959" : "#4da6ff",
                borderRadius: "20px",
                textTransform: "none",
                fontWeight: "bold",
                padding: "6px 12px",
              }}
              disabled={isClaimed || !isCompleted}
              onClick={() => handleClaim(setting)}
            >
              {getButtonText()}
            </Button>
          </Box>
        </CardContent>
      </Card>
    );
  };

  return (
    <Mobile>
      <Container
        disableGutters
        maxWidth={false}
        sx={{
          margin: 0,
          padding: 0,
          background: "linear-gradient(90deg, white 0%, white 100%)",
          minHeight: "100vh",
        }}
      >
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{ padding: "0 16px" }}
        >
          <Grid item>
            <IconButton sx={{ color: "black" }} onClick={handleRedirect}>
              <ArrowBackIosNewIcon sx={{ marginLeft: "-15px" }} />
            </IconButton>
          </Grid>

          <Grid item display="flex" alignItems="center">
            <RestoreOutlinedIcon
              sx={{ cursor: "pointer", color: "white", marginRight: "8px" }}
            />
            <Box
              component="div"
              onClick={() => navigate("/receive-history")}
              sx={{ cursor: "pointer", display: "flex", alignItems: "center" }}
            >
              <Typography sx={{ color: "black", fontSize: "0.8rem" }}>Collection record</Typography>
            </Box>
          </Grid>
        </Grid>

        <Card
          sx={{
            backgroundColor: "#fff",
            color: "#ACAFB3",
            borderRadius: 0,
            boxShadow: "none",
            overflow: "hidden",
          }}
        >
          {/* Image at the Top */}
          <Box
            sx={{
              position: "relative",
              textAlign: "center",
              backgroundColor: "#ffffff",
              height: "160",
            }}
          >
            <CardMedia
              component="img"
              alt="Activity Award"
              height="auto"
              image="../../assets/award_bg-00eaec82.png" // Replace with the correct image URL
              sx={{ objectFit: "contain", width: "100%" }}
            />
            <Box
              sx={{
                position: "absolute",
                top: "56%",
                left: "10px",
                transform: "translateY(-50%)", // Center vertically
                textAlign: "left", // Align text to the left within the Box
              }}
            >
              <Typography
                variant="h6"
                sx={{
                  color: "#fff",
                  fontWeight: "bold",
                }}
              >
                Activity Award
              </Typography>
              <Typography
                variant="body2"
                sx={{
                  color: "#fff",
                  marginTop: "5px",
                  fontSize: "11px", // Small font size
                  marginBottom: "20px",
                }}
              >
                Complete weekly/daily tasks to receive <br />
                rich rewards. <br />
                Weekly rewards cannot be accumulated <br />
                to the next week, and daily rewards <br />
                cannot be accumulated to the next day.
              </Typography>
            </Box>
          </Box>
          <CardContent sx={{ padding: 1.2 }}>
            <Typography
              variant="body1"
              sx={{ color: "#80849c", textAlign: "center" }}
            >
              Check your daily missions and claim your rewards!
            </Typography>
          </CardContent>
        </Card>

        <Box>
          {settings.map((setting, index) => renderSettingCard(setting, index))}
        </Box>
      </Container>
    </Mobile>
  );
};

export default ActivityAward;