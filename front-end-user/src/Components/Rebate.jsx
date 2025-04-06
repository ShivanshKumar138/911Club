import React, { useState, useEffect } from "react";
import {
  AppBar,
  Toolbar,
  IconButton,
  Typography,
  Box,
  Tabs,
  Tab,
  Card,
  CardContent,
  Button,
  Grid,
} from "@mui/material";
import ArrowBackIosOutlinedIcon from "@mui/icons-material/ArrowBackIosOutlined";
import VerifiedUserIcon from "@mui/icons-material/VerifiedUser";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { domain } from "./config";
import Mobile from "./Mobile";


const Rebate = () => {
  const navigate = useNavigate();
  const [tabValue, setTabValue] = useState(0);
  const [todayRebateAmount, setTodayRebateAmount] = useState(0);
  const [totalRebateAmount, setTotalRebateAmount] = useState(0);
  const [rebatePercentage, setRebatePercentage] = useState(0);
  const [rebateHistory, setRebateHistory] = useState([]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const tabsData = [
    {
      icon: "/assets/banners/re1.png",
      label: "All",
      title: "All-Total betting rebate",
    },
    {
      icon: "/assets/banners/re2.png",
      label: "Lottery",
      title: "Lottery-Total betting rebate",
    },
    {
      icon: "/assets/banners/re3.png",
      label: "Casino",
      title: "Casino-Total betting rebate",
    },
    {
      icon: "/assets/banners/re4.png",
      label: "Rummy",
      title: "Rummy-Total betting rebate",
    },
    {
      icon: "/assets/banners/re5.png",
      label: "Slots",
      title: "Slots-Total betting rebate",
    },
  ];

  useEffect(() => {
    const fetchRebateData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/rebate`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const {
          todayRebateAmount,
          totalRebateAmount,
          rebatePercentage,
          rebateHistory,
        } = response.data;
        setTodayRebateAmount(todayRebateAmount);
        setTotalRebateAmount(totalRebateAmount);
        setRebatePercentage(rebatePercentage);
        setRebateHistory(rebateHistory);
      } catch (error) {
        console.error("Error fetching rebate data:", error);
      }
    };
  
    fetchRebateData();
  }, []);

  return (
    <Mobile>
      <Box
        sx={{
          bgcolor: "#f6f6f6",
          minHeight: "100vh",
          maxWidth: "100%",
          margin: "0 auto",
        }}
      >
        <AppBar
          position="static"
          sx={{ bgcolor: "#F95959", color: "white" }}
          elevation={0}
        >
          <Toolbar>
            <IconButton
              edge="start"
              color="inherit"
              aria-label="back"
              onClick={() => navigate("/activity")}
            >
              <ArrowBackIosOutlinedIcon />
            </IconButton>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1, textAlign: "center", fontWeight: "bold" }}
            >
              Rebate
            </Typography>
          </Toolbar>
        </AppBar>

        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          variant="fullWidth"
          sx={{
            mt: 1,
            bgcolor: "#fff",
            "& .MuiTabs-flexContainer": {
              justifyContent: "space-between",
            },
          }}
        >
          {tabsData.map((tab, index) => (
            <Tab
              key={index}
              icon={
                <img
                  src={tab.icon}
                  alt={tab.label}
                  style={{ width: "24px", height: "24px" }}
                />
              }
              label={tab.label}
              sx={{
                fontSize: "0.7rem",
                color: tabValue === index ? "black" : "#888",
                bgcolor: tabValue === index ? "#F6F6F6" : "transparent",
                flex: 1,
                minWidth: 0,
                "&.Mui-selected": { color: "black" },
                "&:hover": {
                  bgcolor: tabValue === index ? "#F95959" : "#f0f0f0",
                  color: tabValue === index ? "#ffffff" : "#666",
                },
              }}
            />
          ))}
        </Tabs>

        <Box sx={{ mt: 2, px: 2 }}>
          <Card
            variant="outlined"
            sx={{
              p: 2,
              bgcolor: "#fff",
              borderRadius: "12px",
            }}
          >
            <Typography
              variant="h6"
              sx={{ fontWeight: "bold", mb: 2, color: "#F95959", textAlign: "left" }}
            >
              {tabsData[tabValue].title}
            </Typography>
            <CardContent sx={{ p: 0 }}>
              <Box display="flex" alignItems="center" sx={{ mb: 2 }}>
                <Box
                  component="span"
                  sx={{
                    border: "1px solid #F95959",
                    borderRadius: "5px",
                    px: 1,
                    py: 0.5,
                    mr: 1,
                    display: "flex",
                    alignItems: "center",
                  }}
                >
                  <VerifiedUserIcon sx={{ color: "#F95959", mr: 0.5 }} />
                  <Typography
                    variant="caption"
                    sx={{ color: "#F95959", fontWeight: "bold" }}
                  >
                    Real-time count
                  </Typography>
                </Box>
              </Box>
              <Typography
                variant="h5"
                sx={{ fontWeight: "bold", color: "#F95959", mb: 2, textAlign: "left"
                 }}
              >
                <AccountBalanceWalletOutlinedIcon
                  sx={{ fontSize: 32, verticalAlign: "middle", mr: 1 }}
                />
                {todayRebateAmount.toFixed(2)}
              </Typography>
              <Box
                sx={{ bgcolor: "#f6f6f6", borderRadius: "8px", p: 1, mb: 2 }}
              >
                <Typography variant="body2" sx={{ color: "#666" }}>
                  Upgrade VIP level to increase rebate rate
                </Typography>
              </Box>
              <Grid container spacing={2} sx={{ mb: 3 }}>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "#f6f6f6", borderRadius: "8px", p: 2, textAlign: "left" }}>
                    <Typography variant="body2" color="text.secondary">
                      Rebate rate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#FF4136",  }}
                    >
                      {rebatePercentage}%
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={6}>
                  <Box sx={{ bgcolor: "#f6f6f6", borderRadius: "8px", p: 2, textAlign: "left" }}>
                    <Typography variant="body2" color="text.secondary">
                      Total rebate
                    </Typography>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: "bold", color: "#FF851B" }}
                    >
                      {totalRebateAmount.toFixed(2)}
                    </Typography>
                  </Box>
                </Grid>
              </Grid>
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ mb: 2, fontStyle: "italic" }}
              >
                Automatic code washing at 01:00:00 every morning
              </Typography>
              <Button
                variant="contained"
                fullWidth
                sx={{
                  bgcolor: "#F95959",
                  color: "#fff",
                  borderRadius: "25px",
                  textTransform: "none",
                  height: "48px",
                  fontSize: "1rem",
                  fontWeight: "bold",
                  "&:hover": { bgcolor: "#0A4F12" },
                }}
              >
                One-Click Rebate
              </Button>
            </CardContent>
          </Card>

          <Typography
            variant="h6"
            sx={{
              textAlign: "left",
              fontWeight: "bold",
              mt: 4,
              mb: 2,
              color: "#333",
            }}
          >
            <Box
              component="span"
              sx={{
                bgcolor: "#F95959",
                mr: 1,
                borderRadius: "2px",
                width: "4px",
                height: "20px",
                display: "inline-block",
              }}
            ></Box>
            Rebate Record
          </Typography>

          <Box sx={{ mt: 1 }}>
            {rebateHistory.length > 0 ? (
              rebateHistory.map((record) => (
                <Card
                  key={record._id}
                  variant="outlined"
                  sx={{
                    mb: 2,
                    p: 2,
                    bgcolor: "#fff",
                    borderRadius: "12px",
                  }}
                >
                  <Grid container spacing={2}>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Rebate Amount
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#F95959" }}
                      >
                        {record.rebateAmount.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Wallet Amount After Rebate
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#F95959" }}
                      >
                        {record.walletAmountAfterRebate.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Level Awarded
                      </Typography>
                      <Typography
                        variant="h6"
                        sx={{ fontWeight: "bold", color: "#FF851B" }}
                      >
                        {record.levelAwarded}
                      </Typography>
                    </Grid>
                    <Grid item xs={6}>
                      <Typography variant="body2" color="text.secondary">
                        Date
                      </Typography>
                      <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                        {new Date(record.date).toLocaleDateString()}
                      </Typography>
                    </Grid>
                  </Grid>
                </Card>
              ))
            ) : (
              <Box sx={{ textAlign: "center", py: 4 }}>
  <img
    src="../../games/assets/No data-rafiki.png" // Replace with the correct path to your image
    alt="No data available"
    style={{width:"50%", marginBottom: "10px" }} // Adjust size and spacing as needed
  />
  <Typography variant="body1" color="text.secondary">
    No rebate records available
  </Typography>
</Box>

            )}
          </Box>
        </Box>
      </Box>
      <br/>
      <br/>
      <br/>
    </Mobile>
  );
};

export default Rebate;