import React, { useEffect } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
// import { useNavigate } from "react-router-dom";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import {
  Typography,
  Card,
  CardMedia,
  CardContent,
  Button,
  Grid,
  Box,
} from "@mui/material";
import { useNavigate } from "react-router-dom";

const cardData = [
  {
    image: "../assets/banners/fd1.jpg",
    text: "1st & 2nd DEPOSIT ",
    url: "/activity/FirstRecharge",
  },
  {
    image: "../assets/banners/ab1.jpg",
    text: "747 INVITATION BONUS",
    url: "/activity/lucky-spin",
  },
  {
    image: "../assets/banners/as1.jpg",
    text: "747 BIGGEST & HIGHER 6TH LEVEL TEAM COMMISSION ",
    url: "/activity/ActivityDetail",
  },
  {
    image: "../assets/banners/b4.jpg",
    text: "747 WINNING STREAK BONUS BANNER ",
    url: "/activity/WinstreakBonus",
  },
  {
    image: "../assets/banners/ab2.jpg",
    text: "Attendance Bonus",
    url: "/activity/USDTBonus",
  },
  {
    image: "../banners/5.jpg",
    text: "747 DAILY SALARY BONUS BANNER ",
    url: "/activity/ActivityDetail",
  },
  {
    image: "../banners/3.jpg",
    text: "747 ADS FUND BANNER",
    url: "/activity/YouTubeCreative",
  },
  {
    image: "../banners/4.jpg",
    text: "Hold Advance",
    url: "/activity/AviatorBonus",
  },
  {
    image: "../banners/1.jpg",
    text: "747 OFFICIAL PREDICTION CHANNEL",
    url: "https://t.me/OFFICIAL747LOTTERYUSA",
  },
  {
    image: "../banners/2.jpg",
    text: "747 LOOKING FOR TRUSTED & LOYAL AGENT EARN WITH US 300₹ DAILY SALARY TO 1LAKH PER DAY",
    url: "https://telegram.me/OFFICIAL747LOTTERY",
  },
];

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

const ActivityMain = ({ children }) => {

  useEffect(() => {
    const setVh = () => {
      const vh = window.innerHeight * 0.01;
      document.documentElement.style.setProperty("--vh", `${vh}px`);
    };

    window.addEventListener("resize", setVh);
    setVh();

    return () => window.removeEventListener("resize", setVh);
  }, []);
  const navigate = useNavigate();
  const navigateToPage = () => {
    navigate("/home"); // Replace '/path-to-page' with the actual path
  };
  const navigateToPage2 = () => {
    navigate("/coupen-user"); // Replace '/path-to-page' with the actual path
  };
  const navigateToPage3 = () => {
    navigate("/attendance"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage4 = () => {
    navigate("/activity/YouTubeCreative"); // Replace '/path-to-page' with the actual path
  };
  const handleDownload = () => {
    // Programmatically click the hidden anchor tag
    const link = document.createElement("a");
    link.href = `https://111club.online/abclottery.apk`; // Change this to the actual path of the APK file on your server
    link.download = "abclottery.apk";
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
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
            {/* <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#F95959 ",
                padding: "8px 16px",
                color: "white",
                mb: 2,
              }}
            >
              <Grid item xs={12} textAlign="center">
                <img
                  src="/assets/genzwinlogo.png"
                  alt="logo"
                  style={{ width: "140px", height: "50px" }}
                />
              </Grid>
              <Grid
                item
                xs={6}
                textAlign="left"
                sx={{ fontSize: "18px", mt: 2 }}
              >
                <span style={{ fontWeight: "bold" }}>Activity</span>
              </Grid>
              <Grid item xs={12} textAlign="Left" sx={{ mt: 1 }}>
                <Typography sx={{ fontSize: "12px" }}>
                  Please remember to follow the event page
                  <br />
                  We will launch user feedback activities from time to time
                </Typography>
              </Grid>
            </Grid> */}

<Grid
  container
  alignItems="center"
  justifyContent="space-between"
  sx={{
    position: "sticky",
    top: 0,
    zIndex: 5000,
    background: "linear-gradient(to right, rgba(250, 91, 91, 1) 0%, rgba(250, 91, 91, 0.5) 100%)",
    padding: "8px 16px",
    color: "white",
    height: "60px", // Increased height slightly
    display: "flex",
    alignItems: "center" // Ensure vertical alignment
  }}
>
  <Grid 
    item 
    xs={3} 
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-start"
    }}
  >
    <IconButton 
      style={{ 
        color: "white",
        padding: "8px"
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
      justifyContent: "center"
    }}
  >
    <img
      src="/assets/genzwinlogo.png"
      alt="logo"
      style={{ 
        width: "120px",
        height: "40px",
        objectFit: "contain"
      }}
    />
  </Grid>
  <Grid 
    item 
    xs={3} 
    sx={{
      display: "flex",
      alignItems: "center",
      justifyContent: "flex-end"
    }}
  >
  </Grid>
</Grid>
          <br/>

            {/* //content */}

            <Box
      sx={{
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'flex-start',
        gap: { xs: 2, sm: 3, md: 4 },
        mt: 2,
        overflowX: 'auto',  // Enable horizontal scrolling if needed
        pb: 1,              // Add padding bottom for scrollbar
        width: '100%',
        '&::-webkit-scrollbar': {
          height: '4px',
        },
        '&::-webkit-scrollbar-thumb': {
          backgroundColor: 'rgba(0,0,0,0.2)',
          borderRadius: '4px',
        }
      }}
    >
      {rewards.map((reward, index) => (
        <Box
          key={index}
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            flexShrink: 0,      // Prevent items from shrinking
            cursor: 'pointer',
            px: 1
          }}
          onClick={() => navigate(reward.link)}
        >
          <img
            src={reward.image}
            alt={reward.label}
            style={{ 
              width: "40px", 
              height: "40px",
              minWidth: "40px"  // Ensure image doesn't shrink
            }}
          />
          <Typography
            sx={{
              color: "#768096",
              fontSize: "11px",
              textAlign: "center",
              width: 'max-content',
              maxWidth: '80px'
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
          fontFamily:"helvetica",
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
         fontFamily:"helvetica",
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
        The more consecutive days you sign in, the higher the reward will
      </Typography>
    </CardContent>
  </Card>
</Grid>


            </Grid>

            {/* Banner */}

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
              {cardData.map((card, index) => (
                <Grid item xs={12} key={index}>
                  <Card
                    sx={{ borderRadius: "10px", mt: 1, cursor: "pointer",boxShadow: "none"  }}
                    onClick={() => handleCardClick(card.url)} >
                    <CardMedia
                      component="img"
                      height="auto"
                      image={card.image}
                      alt={`Image ${index + 1}`}
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
                        {card.text}
                      </Typography>
                    </CardContent>
                  </Card>
                </Grid>
              ))}
            </Grid>

            {/* content end */}
          </Box>

          {children}
        </Box>
      </Mobile>
    </div>
  );
};

export default ActivityMain;

//back icon added
