import React, { useEffect, useState } from "react";
import axios from "axios";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Grid,
  Box,
  CircularProgress,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { domain } from "./config";

// Your existing rewards data
const rewards = [
  {
    image: "https://www.66lottery9.com/static/activity/activity.png",
    label: "Activity Award",
    link: "/activityaward",
  },
  {
    image: "../assets/invitationBonus.png",
    label: "Invitation Bonus",
    link: "/invitation-bonus",
  },
  {
    image: "../assets/BettingRebate-17d35455.png",
    label: "Betting Rebate",
    link: "/rebate",
  },
  {
    image: "../assets/superJackpot-ecb648b4.png",
    label: "Super Jackpot",
    link: "/superjackpot",
  },
];

// Title to URL mapping
const bannerUrlMap = {
  "1ST_DEPOSIT": "/activity/FirstRecharge",
  INVITATION_BONUS: "/activity/lucky-spin",
  TEAM_COMMISSION: "/activity/ActivityDetail",
  WINNING_STREAK_BONUS: "/activity/WinstreakBonus",
  ATTENDANCE_BONUS: "/activity/USDTBonus",
  DAILY_SALARY_BONUS: "/activity/ActivityDetail",
  ADS_FUND: "/activity/YouTubeCreative",
  HOLD_ADVANCE: "/activity/AviatorBonus",
  OFFICIAL_PREDICTION_CHANNEL: "https://t.me/OFFICIAL747LOTTERYUSA",
  LOOKING_FOR_AGENT: "https://telegram.me/OFFICIAL747LOTTERY",
};

const ActivityMain = ({ children }) => {
  const [banners, setBanners] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Fetch banners from API
  useEffect(() => {
    const fetchBanners = async () => {
      try {
        const response = await axios.get(domain + "/banner");

        // Map the server response to the format needed by your component
        const mappedBanners = response.data.data
          .filter((banner) => banner.active) // Only show active banners
          .sort((a, b) => a.order - b.order) // Sort by order field
          .map((banner) => ({
            id: banner._id,
            image: `${domain}/${banner.imagePath}`, // Adjust path based on your server setup
            text: banner.description,
            url: bannerUrlMap[banner.title] || "/activity/ActivityDetail", // Default URL if not mapped
          }));

        setBanners(mappedBanners);
        setLoading(false);
      } catch (err) {
        console.error("Error fetching banners:", err);
        setError("Failed to load banners");
        setLoading(false);
      }
    };

    fetchBanners();
  }, []);

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);

  const navigateToPage = () => {
    navigate("/home");
  };

  const navigateToPage2 = () => {
    navigate("/coupen-user");
  };

  const navigateToPage3 = () => {
    navigate("/attendance");
  };

  const handleCardClick = (url) => {
    if (url.startsWith("http")) {
      window.open(url, "_blank");
    } else {
      navigate(url);
    }
  };

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="calc(var(--vh, 1vh) * 100)"
          position="relative"
        >
          <Box flexGrow={1} sx={{ backgroundColor: "#F7F8FF" }}>
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 5000,
                background:
                  "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
                padding: "8px 16px",
                color: "white",
                height: "60px",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-start",
                }}
              >
                <IconButton
                  style={{
                    color: "white",
                    padding: "8px",
                  }}
                  onClick={navigateToPage}
                >
                  <ArrowBackIosNewIcon />
                </IconButton>
              </Grid>
              <Grid
                item
                xs={6}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src="/assets/genzwinlogo.png"
                  alt="logo"
                  style={{
                    width: "120px",
                    height: "40px",
                    objectFit: "contain",
                  }}
                />
              </Grid>
              <Grid
                item
                xs={3}
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "flex-end",
                }}
              ></Grid>
            </Grid>
            <br />

            {/* Rewards section */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "row",
                justifyContent: "center",
                alignItems: "flex-start",
                gap: { xs: 2, sm: 3, md: 4 },
                mt: 2,
                overflowX: "auto",
                pb: 1,
                width: "100%",
                "&::-webkit-scrollbar": {
                  height: "4px",
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "4px",
                },
              }}
            >
              {rewards.map((reward, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    flexShrink: 0,
                    cursor: "pointer",
                    px: 1,
                  }}
                  onClick={() => navigate(reward.link)}
                >
                  <img
                    src={reward.image}
                    alt={reward.label}
                    style={{
                      width: "40px",
                      height: "40px",
                      minWidth: "40px",
                    }}
                  />
                  <Typography
                    sx={{
                      color: "#768096",
                      fontSize: "11px",
                      textAlign: "center",
                      width: "max-content",
                      maxWidth: "80px",
                    }}
                  >
                    {reward.label.split(" ").map((word, i) => (
                      <span key={i}>
                        {word}
                        <br />
                      </span>
                    ))}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Cards section */}
            <Grid
              mt={0.5}
              container
              spacing={1}
              sx={{ marginLeft: "0px", marginRight: "auto", width: "98%" }}
            >
              <Grid item xs={6}>
                <Card onClick={navigateToPage2} sx={{ boxShadow: "none" }}>
                  <CardMedia
                    component="img"
                    height="110"
                    image="../assets/images/signInBanner-33f86d3f.png"
                    alt="Image 1"
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#FFFFFF",
                      textAlign: "left",
                      height: "50px",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "black",
                        fontWeight: 700,
                        fontFamily: "helvetica",
                        fontSize: "15px",
                      }}
                    >
                      Gifts
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{ color: "#80849c", fontSize: "12px" }}
                    >
                      Enter the redemption code to receive gift rewards
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
              <Grid item xs={6}>
                <Card onClick={navigateToPage3} sx={{ boxShadow: "none" }}>
                  <CardMedia
                    component="img"
                    height="110"
                    image="../../assets/images/giftRedeem-45917887.png"
                    alt="Image 2"
                  />
                  <CardContent
                    sx={{
                      backgroundColor: "#FFFFFF",
                      textAlign: "left",
                      height: "50px",
                    }}
                  >
                    <Typography
                      component="div"
                      sx={{
                        color: "black",
                        fontWeight: 700,
                        fontFamily: "helvetica",
                        fontSize: "15px",
                      }}
                    >
                      Attendance bonus
                    </Typography>
                    <Typography
                      variant="h1"
                      color="text.secondary"
                      sx={{ color: "#80849c", fontSize: "12px" }}
                    >
                      The more consecutive days you sign in, the higher the
                      reward will
                    </Typography>
                  </CardContent>
                </Card>
              </Grid>
            </Grid>

            {/* Banners section */}
            <Grid
              mt={1}
              container
              spacing={1}
              sx={{
                marginLeft: "1px",
                marginRight: "auto",
                width: "98%",
                marginBottom: "150px",
              }}
            >
              {loading ? (
                <Grid item xs={12} sx={{ textAlign: "center", py: 5 }}>
                  <CircularProgress />
                </Grid>
              ) : error ? (
                <Grid item xs={12} sx={{ textAlign: "center", py: 3 }}>
                  <Typography color="error">{error}</Typography>
                </Grid>
              ) : (
                banners.map((banner, index) => (
                  <Grid item xs={12} key={banner.id || index}>
                    <Card
                      sx={{
                        borderRadius: "10px",
                        mt: 1,
                        cursor: "pointer",
                        boxShadow: "none",
                      }}
                      onClick={() => handleCardClick(banner.url)}
                    >
                      <CardMedia
                        component="img"
                        height="auto"
                        image={banner.image}
                        alt={`Banner ${index + 1}`}
                      />
                      <CardContent
                        sx={{
                          backgroundColor: "#ffffff",
                          height: "10px",
                          textAlign: "left",
                        }}
                      >
                        <Typography
                          variant="body2"
                          component="div"
                          sx={{ color: "black", fontWeight: "bold" }}
                        >
                          {banner.text}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                ))
              )}
            </Grid>
          </Box>
          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityMain;
