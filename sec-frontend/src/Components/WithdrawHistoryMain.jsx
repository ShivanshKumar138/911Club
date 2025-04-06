import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import Mobile from "./Mobile";
import {
  Box,
  Typography,
  Button,
  Grid,
  Card,
  CardContent,
  Drawer,
  List,
  ListItem,
  ListItemText,
  IconButton,
  Chip,
  TextField,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import CloseIcon from "@mui/icons-material/Close";
import axios from "axios";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CalendarDrawer from "./CalendarDrawer";
import ContentCopyIcon from '@mui/icons-material/ContentCopy';
import Snackbar from '@mui/material/Snackbar';
import { Alert } from '@mui/material';

const WithdrawHistoryMain = () => {
  const navigate = useNavigate();
  const [withdrawals, setWithdrawals] = useState([]);
  const [filteredWithdrawals, setFilteredWithdrawals] = useState([]);
  const [selectedType, setSelectedType] = useState("All");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [statusDrawerOpen, setStatusDrawerOpen] = useState(false);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [snackbarOpen, setSnackbarOpen] = useState(false);

  useEffect(() => {
    fetchWithdrawals();
  }, []);

  const handleCopyOrderNo = (orderNo) => {
    navigator.clipboard.writeText(orderNo);
    setSnackbarOpen(true);
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
  };
  const handleDrawerClose = () => {
    setStatusDrawerOpen(false);
  };

  const handleOpenCalendarDrawer = () => {
    setCalendarDrawerOpen(true);
  };

  const handleCloseCalendarDrawer = () => {
    setCalendarDrawerOpen(false);
  };

  useEffect(() => {
    applyFilters();
  }, [withdrawals, selectedType, selectedStatus, startDate, endDate]);

  const fetchWithdrawals = async () => {
    console.log("Fetching withdrawal history...");

    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in localStorage
      const response = await axios.get(`${domain}/all-withdraw-history`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      console.log("Response received:", response);

      if (response.data.success) {
        console.log(
          "Withdrawal history fetch successful:",
          response.data.userWithdrawals
        );
        setWithdrawals(response.data.userWithdrawals);
        setFilteredWithdrawals(response.data.userWithdrawals);
      } else {
        console.warn(
          "Failed to fetch withdrawal history:",
          response.data.message
        );
      }
    } catch (error) {
      console.error("Error fetching withdrawal history:", error);
    }
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  const applyFilters = () => {
    let filtered = withdrawals;

    if (selectedType !== "All") {
      filtered = filtered.filter((w) => w.withdrawMethod === selectedType);
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((w) => w.status === selectedStatus);
    }

    if (startDate && endDate) {
      const start = new Date(startDate);
      const end = new Date(endDate);
      end.setHours(23, 59, 59, 999);

      filtered = filtered.filter((w) => {
        const createdAt = new Date(w.createdAt);
        return createdAt >= start && createdAt <= end;
      });
    }

    setFilteredWithdrawals(filtered);
  };

  const handleTypeChange = (type) => setSelectedType(type);

  const handleStatusChange = (status) => {
    setSelectedStatus(status);
    setStatusDrawerOpen(false);
  };

  const handleDateRangeSelect = (range) => {
    setStartDate(range.start.toISOString().split("T")[0]);
    setEndDate(range.end.toISOString().split("T")[0]);
    setCalendarDrawerOpen(false);
    applyFilters();
  };

  const handleBackClick = () => navigate(-1);

  return (
    <Mobile>
      <Box sx={{ backgroundColor: "#F7F8FF", minHeight: "100vh" }}>
        {/* Top Bar */}
        <Grid
          container
          alignItems="center"
          justifyContent="space-between"
          sx={{
            position: "sticky",
            top: 0,
            zIndex: 1000,
            backgroundColor: "#F95959",
            padding: "4px 8px",
            color: "black",
          }}
        >
          <Grid item container alignItems="center" justifyContent="center">
            <Grid item xs={2}>
              <IconButton
                sx={{ color: "white", ml: -5 }}
                onClick={handleRedirect}
              >
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={10}>
              <Typography
                variant="h6"
                sx={{
                  color: "white",
                  flexGrow: 1,
                  textAlign: "center",
                  mr: 8,
                }}
              >
                Withdrawal History
              </Typography>
            </Grid>
          </Grid>
        </Grid>

        {/* Filter Buttons */}
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-around",
            padding: 0,
            marginBottom: 1,
            borderRadius: 2,
            marginTop: 2,
          }}
        >
          {[
            { label: "All", icon: "/assets/homet.png" },
            { label: "Bank Card", icon: "/assets/bankcard2.png" },
            { label: "USDT", icon: "/assets/usdt2.png" },
          ].map(({ label, icon }) => (
            <Button
              key={label}
              variant={selectedType === label ? "contained" : "outlined"}
              onClick={() => handleTypeChange(label)}
              sx={{
                display: "flex",
                alignItems: "center",
                backgroundColor: selectedType === label ? "#F95959" : "white",
                color: selectedType === label ? "black" : "#333",
                borderColor: selectedType === label ? "transparent" : "#E0E0E0",
                borderRadius: 2,
                boxShadow:
                  selectedType === label
                    ? "0px 4px 10px rgba(0, 0, 0, 0.1)"
                    : "none",
                padding: "6px 10px",
                minWidth: "100px",
                textTransform: "none",
                "&:hover": {
                  backgroundColor:
                    selectedType === label ? "#F95959" : "#FFFFFF",
                  borderColor:
                    selectedType === label ? "transparent" : "#E0E0E0",
                },
              }}
            >
              <Box
                component="img"
                src={icon}
                alt={label}
                sx={{
                  width: 24,
                  height: 24,
                  marginRight: 1,
                }}
              />
              {label}
            </Button>
          ))}
        </Box>

        {/* Filters */}
        <Grid
          container
          justifyContent="space-between"
          sx={{ marginTop: 2, paddingLeft: "3%", paddingRight: "3%" }}
        >
          <Button
            onClick={() => setStatusDrawerOpen(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
              textTransform: "none",
              color: "#80849c",
              padding: "0 16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {selectedStatus}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
          <Button
            onClick={() => handleOpenCalendarDrawer(true)}
            sx={{
              width: "48%",
              height: "2.8rem",
              backgroundColor: "#ffffff",
              justifyContent: "space-between",
              textTransform: "none",
              color: "#80849c",
              padding: "0 16px",
              fontWeight: "bold",
              borderRadius: "5px",
            }}
          >
            {startDate && endDate
              ? `${startDate} - ${endDate}`
              : "Choose a date"}
            <KeyboardArrowDownOutlinedIcon />
          </Button>
        </Grid>

        {/* Withdrawal History */}
        <Box sx={{ padding: 2 }}>
          {filteredWithdrawals.map((withdrawal) => (
            <Card
              key={withdrawal._id}
              sx={{
                marginBottom: 2,
                borderRadius: 2,
                overflow: "hidden",
                boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                
              }}
            >
              <CardContent sx={{ padding: 0, mb: -2, backgroundColor: "#FFFFFF" }}>
                <Box sx={{ padding: 1, borderBottom: "1px solid #e0e0e0" , }}>
                  <Grid container alignItems="center">
                    <Grid item xs={6} sx={{ textAlign: "left" }}>
                      <Chip
                        label="Withdraw"
                        sx={{
                          
                          color: "white",
                          fontWeight: "bold",
                          height: "24px", // Adjusting height to match the image
                          fontSize: "14px",
                          borderRadius: "4px",
                          backgroundColor: "#F95959",
                        }}
                      />
                    </Grid>
                    <Grid item xs={6} sx={{ textAlign: "right" }}>
                      <Typography
                        sx={{
                          color:
                            withdrawal.status === "Completed"
                              ? "#27ae60"
                              : withdrawal.status === "Pending"
                              ? "#f39c12"
                              : "#e74c3c",
                          fontWeight: "bold",
                          fontSize: "14px",
                        }}
                      >
                        {withdrawal.status}
                      </Typography>
                    </Grid>
                  </Grid>
                </Box>
                <Box sx={{ padding: 1.5 }}>
                  <Grid container spacing={1} sx={{ textAlign: "left", }}>
                    {[
                     // ...existing code...
{
  label: "Balance",
  value:
    withdrawal.withdrawMethod === "USDT"
      ? `$${(withdrawal.balance / 93).toFixed(2)}`
      : `₹${withdrawal.balance}`,
  color: "#27ae60",
  fontSize: "14px",
  fontWeight: "bold",
},
// ...existing code...
                      {
                        label: "Type",
                        value: withdrawal.withdrawMethod,
                        fontSize: "12px",
                      },
                      {
                        label: "Time",
                        value: new Date(withdrawal.createdAt).toLocaleString(),
                        fontSize: "12px",
                      },
                      {
                        label: "Order number",
                        value: (
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'flex-end' }}>
                            <Typography
                              sx={{
                                fontSize: "12px",
                                marginRight: 1,
                              }}
                            >
                              {withdrawal._id}
                            </Typography>
                            <IconButton
                              size="small"
                              onClick={() => handleCopyOrderNo(withdrawal._id)}
                              sx={{ 
                                padding: 0.5,
                                '&:hover': {
                                  backgroundColor: 'rgba(249, 89, 89, 0.1)'
                                }
                              }}
                            >
                              <ContentCopyIcon fontSize="small" sx={{ color: "#F95959" }} />
                            </IconButton>
                          </Box>
                        ),
                        fontSize: "12px",
                      },
                      {
                        label: "Remark",
                        value: withdrawal.remark,
                        fontSize: "12px",
                      },
                    ].map(({ label, value, color, fontSize, fontWeight }) => (
                      <React.Fragment key={label}>
                        <Grid item xs={6}>
                          <Typography
                            sx={{
                              color: "black",
                              fontSize: "13px",
                              lineHeight: "20px",
                            }}
                          >
                            {label}
                          </Typography>
                        </Grid>
                        <Grid item xs={6} sx={{ textAlign: "right" }}>
                          <Typography
                            sx={{
                              fontSize,
                              fontWeight: fontWeight || "medium",
                              color: color || "black",
                              lineHeight: "20px",
                            }}
                          >
                            {value}
                          </Typography>
                        </Grid>
                      </React.Fragment>
                    ))}
                  </Grid>
                </Box>
              </CardContent>
            </Card>
          ))}
        </Box>

       

        <CalendarDrawer
          isOpen={calendarDrawerOpen}
          onClose={handleCloseCalendarDrawer}
          onRangeSelect={handleDateRangeSelect}
        />

       
        <Drawer
          anchor="bottom"
          open={statusDrawerOpen}
          onClose={() => setStatusDrawerOpen(false)}
          sx={{
            "& .MuiDrawer-paper": {
              width: "100%",
              height: "auto",
              margin: "0 auto",
              maxWidth: isSmallScreen ? "600px" : "396px",
              backgroundColor: "white",
              color: "black",
              borderTopLeftRadius: "16px",
              borderTopRightRadius: "16px",
            },
          }}
        >
          <Box sx={{ padding: 3 }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "16px",
              }}
            >
              <Typography
                sx={{ color: "#888", cursor: "pointer", fontWeight: "bold" }}
                onClick={handleDrawerClose}
              >
                Cancel
              </Typography>
              <Typography
                sx={{ color: "#F95959", fontWeight: "bold", cursor: "pointer" }}
              >
                Confirm
              </Typography>
            </Box>
            <List>
              {["All", "Pending", "Completed", "Rejected"].map((status) => (
                <ListItem
                  key={status}
                  label={status}
                  onClick={() => handleStatusChange(status)}
                  sx={{
                    color: "#000",
                    fontWeight: "normal",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={status} />
                </ListItem>
              ))}
            </List>
          </Box>
        </Drawer>
      </Box>
      <Snackbar
  open={snackbarOpen}
  autoHideDuration={500}
  onClose={handleCloseSnackbar}
  style={{
    position: "fixed",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
  }}
>
  <Alert
    onClose={handleCloseSnackbar}
    severity="success"
    sx={{
      width: "100%",
      backgroundColor: "rgba(0, 0, 0, 0.7)",
      color: "white",
      "& .MuiAlert-message": {
        opacity: 1,
        color: "white",
      },
      "& .MuiAlert-icon": {
        opacity: 1,
        color: "white",
      },
    }}
  >
    Copied Successfully 
  </Alert>
</Snackbar>
    </Mobile>
  );
};

export default WithdrawHistoryMain;
