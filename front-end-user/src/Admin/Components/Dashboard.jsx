import React, { useState, useEffect } from "react";
import {
  Grid,
  Paper,
  Typography,
  Switch,
  FormControlLabel,
  Snackbar,
  Alert,
  Box,
  CircularProgress,
} from "@mui/material";
import axios from "axios";
import { domain } from "../../Components/config";
import {
  PersonAdd,
  AttachMoney,
  MoneyOff,
  AccountBalance,
  People,
  Pending,
  CheckCircle,
  MonetizationOn,
  WebAsset,
  SupportAgent,
  AccountBalanceWallet,
  Casino,
  Settings
} from "@mui/icons-material";

import Payment from "../Payment";

const Dashboard = () => {
  const [data, setData] = useState(0);
  const [userBalance, setUserBalance] = useState(0);
  const [todayrecharge, setTodayrecharge] = useState(0);
  const [todayWithdrawal, setTodayWithdrawal] = useState(0);
  const [totalUser, setTotalUser] = useState(0);
  const [pendingRecharge, setPendingRecharge] = useState(0);
  const [successRecharge, setSuccessRecharge] = useState(0);
  const [totalWithdrawal, setTotalWithdrawal] = useState(0);
  const [maintenanceMode, setMaintenanceMode] = useState(false);
  const [withdrawalRequests, setWithdrawalRequests] = useState(0);
  const [pendingComplaints, setPendingComplaints] = useState(0);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  // New state variables for game winning type
  const [isRandomWinning, setIsRandomWinning] = useState(false);
  const [isGameWinningLoading, setIsGameWinningLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    severity: "info",
  });

  useEffect(() => {
    fetchDashboardData();
    fetchGameWinningType();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const responses = await Promise.all([
        axios.get(`${domain}/todays-registrations`, { withCredentials: true }),
        axios.get(`${domain}/admin/normal-users-wallet-summary`, {
          withCredentials: true,
        }),
        axios.get(`${domain}/recharge-today`, { withCredentials: true }),
        axios.get(`${domain}/total-withdraw-amount-last-24-hours`, {
          withCredentials: true,
        }),
        axios.get(`${domain}/total-registrations`, { withCredentials: true }),
        axios.get(`${domain}/pending-recharge`, { withCredentials: true }),
        axios.get(`${domain}/success-recharge`, { withCredentials: true }),
        axios.get(`${domain}/total-withdrawl-amount`, {
          withCredentials: true,
        }),
        axios.get(`${domain}/maintenance-mode`, { withCredentials: true }),
        axios.get(`${domain}/pending-withdrawals-count`, {
          withCredentials: true,
        }),
        axios.get(`${domain}/pending-complaints-count`, {
          withCredentials: true,
        }),
        axios.get(`${domain}/need-to-deposit-first`, { withCredentials: true }),
      ]);

      setData(responses[0].data.countOfDailyUsers || 0);
      setUserBalance(responses[1].data.totalWalletAmount || 0);
      setTodayrecharge(responses[2].data.totalRechargeAmount || 0);
      setTodayWithdrawal(responses[3].data.totalWithdrawAmount || 0);
      setTotalUser(responses[4].data.count || 0);
      setPendingRecharge(responses[5].data.pendingAmount || 0);
      setSuccessRecharge(responses[6].data.successAmount || 0);
      setTotalWithdrawal(responses[7].data.completeWithdrawAmount || 0);
      setMaintenanceMode(responses[8].data.maintenanceMode || false);
      setWithdrawalRequests(responses[9].data.pendingWithdrawCount || 0);
      setPendingComplaints(responses[10].data.pendingComplaintsCount || 0);
      setNeedToDepositFirst(
        responses[11].data.data.needToDepositFirst || false
      );
    } catch (error) {
      console.error("Error fetching dashboard data:", error);
      setSnackbar({
        open: true,
        message: "Error fetching dashboard data",
        severity: "error",
      });
      // Set default values in case of error
      setData(0);
      setUserBalance(0);
      setTodayrecharge(0);
      setTodayWithdrawal(0);
      setTotalUser(0);
      setPendingRecharge(0);
      setSuccessRecharge(0);
      setTotalWithdrawal(0);
      setMaintenanceMode(false);
      setWithdrawalRequests(0);
      setPendingComplaints(0);
      setNeedToDepositFirst(false);
    }
  };

  // Add new function to fetch game winning type
  const fetchGameWinningType = async () => {
    try {
      const response = await axios.get(`${domain}/game-winning-type`, {
        withCredentials: true,
      });
      setIsRandomWinning(response.data.data.isRandomWinning);
    } catch (error) {
      console.error("Error fetching game winning type:", error);
      setSnackbar({
        open: true,
        message: "Error fetching game winning type settings",
        severity: "error",
      });
    }
  };

  // Add new function to handle game winning type toggle
  const handleToggleGameWinningType = async () => {
    setIsGameWinningLoading(true);
    try {
      const response = await axios.put(
        `${domain}/game-winning-type`,
        { isRandomWinning: !isRandomWinning },
        { withCredentials: true }
      );

      if (response.data.success) {
        setIsRandomWinning(response.data.data.isRandomWinning);
        setSnackbar({
          open: true,
          message: "Game winning type updated successfully",
          severity: "success",
        });
      } else {
        throw new Error(
          response.data.message || "Failed to update game winning type"
        );
      }
    } catch (error) {
      console.error("Error while toggling game winning type:", error);
      setSnackbar({
        open: true,
        message: "Failed to update game winning type",
        severity: "error",
      });
    } finally {
      setIsGameWinningLoading(false);
    }
  };

  const handleToggleDepositFirst = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post(
        `${domain}/update-need-to-deposit-first`,
        {},
        { withCredentials: true }
      );

      if (response.data.success) {
        setNeedToDepositFirst(response.data.data.needToDepositFirst);
        setSnackbar({
          open: true,
          message: "Setting updated successfully",
          severity: "success",
        });
      } else {
        throw new Error(response.data.message || "Failed to update setting");
      }
    } catch (error) {
      console.error("Error while toggling needToDepositFirst:", error);
      setSnackbar({
        open: true,
        message: "Failed to update setting",
        severity: "error",
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbar({ ...snackbar, open: false });
  };

  const dashboardData = [
    { heading: "Today User Join", value: data, icon: <PersonAdd /> },
    {
      heading: "Today's Recharge",
      value: todayrecharge,
      icon: <AttachMoney />,
    },
    {
      heading: "Today's Withdrawal",
      value: todayWithdrawal,
      icon: <MoneyOff />,
    },
    { heading: "User Balance", value: userBalance, icon: <AccountBalance /> },
    { heading: "Total User", value: totalUser, icon: <People /> },
    { heading: "Pending Recharges", value: pendingRecharge, icon: <Pending /> },
    {
      heading: "Success Recharge",
      value: successRecharge,
      icon: <CheckCircle />,
    },
    {
      heading: "Total Withdrawal",
      value: totalWithdrawal,
      icon: <MonetizationOn />,
    },
    {
      heading: "Withdrawal Requests",
      value: withdrawalRequests,
      icon: <AccountBalanceWallet />,
    },
    {
      heading: "Website Mode",
      value: maintenanceMode ? "On" : "Off",
      icon: <WebAsset />,
    },
    {
      heading: "Pending Complaints",
      value: pendingComplaints,
      icon: <SupportAgent />,
    },
  ];

  return (
    <Box
      sx={{ minHeight: "85vh", padding: "20px", backgroundColor: "#f5f5f5" }}
    >
      <Typography
        variant="h4"
        gutterBottom
        sx={{ marginBottom: 4, color: "#4782ff", fontWeight: "bold" }}
      >
        Dashboard Overview
      </Typography>

      {/* Dashboard Grid */}
      <Grid container spacing={3}>
        {dashboardData.map((item, index) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={index}>
            <Paper
              elevation={3}
              sx={{
                padding: "25px",
                borderRadius: "15px",
                background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                transition: "transform 0.3s, box-shadow 0.3s",
                "&:hover": {
                  transform: "translateY(-5px)",
                  boxShadow: "0 10px 20px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{ display: "flex", alignItems: "center", marginBottom: 2 }}
              >
                <Box
                  sx={{
                    backgroundColor: "#ffffff",
                    borderRadius: "50%",
                    padding: "10px",
                    marginRight: 2,
                    width: "50px",
                    height: "50px",
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                  }}
                >
                  {React.cloneElement(item.icon, {
                    style: { fontSize: 30, color: "#4782ff" },
                  })}
                </Box>
                <Typography
                  variant="h6"
                  sx={{ color: "#ffffff", fontWeight: "medium" }}
                >
                  {item.heading}
                </Typography>
              </Box>
              <Typography
                variant="h4"
                sx={{ color: "#ffffff", fontWeight: "bold" }}
              >
                {item.value}
              </Typography>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* Settings Section - Both Toggles in Same Row */}
      <Paper
        elevation={3}
        sx={{
          padding: "20px",
          borderRadius: "15px",
          backgroundColor: "#ffffff",
          marginBottom: 4,
          marginTop:4
        }}
      >
        <Box
          sx={{
            display: "flex",
            alignItems: "center",
            marginBottom: 3,
            borderBottom: "2px solid #4782ff",
            paddingBottom: 2,
          }}
        >
          <Settings sx={{ color: "#4782ff", fontSize: 30, marginRight: 1 }} />
          <Typography
            variant="h5"
            sx={{ color: "#4782ff", fontWeight: "bold" }}
          >
            Game Settings
          </Typography>
        </Box>

        <Grid container spacing={4}>
          {/* Game Winning Type Toggle */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <Casino sx={{ color: "#4782ff", fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#4782ff", fontWeight: "bold" }}
                  >
                    Game Winning Type
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={isRandomWinning}
                        onChange={handleToggleGameWinningType}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#4782ff",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                            },
                        }}
                        disabled={isGameWinningLoading}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: "#333",
                          fontWeight: "medium",
                          minWidth: "120px",
                        }}
                      >
                        {isRandomWinning ? "Random Winning" : "Least Bet"}
                      </Typography>
                    }
                  />
                  {isGameWinningLoading && (
                    <CircularProgress size={24} sx={{ color: "#4782ff" }} />
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>

          {/* Need to Deposit First Toggle */}
          <Grid item xs={12} md={6}>
            <Paper
              elevation={2}
              sx={{
                padding: "20px",
                borderRadius: "12px",
                backgroundColor: "#f8f9fa",
                height: "100%",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: "0 8px 16px rgba(0,0,0,0.1)",
                },
              }}
            >
              <Box
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  flexWrap: "wrap",
                  gap: 2,
                }}
              >
                <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                  <AccountBalance sx={{ color: "#4782ff", fontSize: 24 }} />
                  <Typography
                    variant="h6"
                    sx={{ color: "#4782ff", fontWeight: "bold" }}
                  >
                    Need to Deposit First
                  </Typography>
                </Box>
                <Box sx={{ display: "flex", alignItems: "center", gap: 2 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={needToDepositFirst}
                        onChange={handleToggleDepositFirst}
                        sx={{
                          "& .MuiSwitch-switchBase.Mui-checked": {
                            color: "#4782ff",
                          },
                          "& .MuiSwitch-switchBase.Mui-checked + .MuiSwitch-track":
                            {
                              background: "linear-gradient(90deg, #4782ff 0%, #59adff 100%)",
                            },
                        }}
                        disabled={isLoading}
                      />
                    }
                    label={
                      <Typography
                        sx={{
                          color: "#333",
                          fontWeight: "medium",
                          minWidth: "120px",
                        }}
                      >
                        {needToDepositFirst ? "Required" : "Optional"}
                      </Typography>
                    }
                  />
                  {isLoading && (
                    <CircularProgress size={24} sx={{ color: "#4782ff" }} />
                  )}
                </Box>
              </Box>
            </Paper>
          </Grid>
        </Grid>
      </Paper>
<Payment />
      {/* Snackbar for notifications */}
      <Snackbar
        open={snackbar.open}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "right" }}
      >
        <Alert
          onClose={handleCloseSnackbar}
          severity={snackbar.severity}
          sx={{ width: "100%" }}
          elevation={6}
          variant="filled"
        >
          {snackbar.message}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default Dashboard;
