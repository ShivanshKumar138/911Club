import React, { useState, useEffect } from "react";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Grid,
  Box,
  Button,
  Drawer,
  Typography,
  Card,
  CardContent,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import CalendarDrawer from "./CalendarDrawer";
import axios from "axios";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import "./TransactionCard.css";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";

const FilterDrawer = ({ isOpen, onClose, onConfirm }) => {
  const options = [
    "All",
    "Bet",
    "VIP Level Reward",
    "VIP Monthly Reward",
    "Invitation Bonus",
    "Agent Commission",
    "Deposit",
    "First Deposit Bonus",
    "Attendance Bonus",
    "Daily Reward",
    "Withdraw",
    "Bonus",
    "Salary",
    "Sign Up Bonus",
    "Envelop",
    "Rebate Bonus",
  ];
  const [selectedOption, setSelectedOption] = useState(null);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleOptionClick = (option) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    onConfirm(selectedOption);
    onClose();
  };

  return (
    <Drawer
      anchor="bottom"
      open={isOpen}
      onClose={onClose}
      sx={{
        "& .MuiDrawer-paper": {
          width: "100%",
          height: "auto",
          maxHeight: "60vh",
          margin: "0 auto",
          maxWidth: isSmallScreen ? "100%" : "396px",
          backgroundColor: "white",
          color: "black",
          borderTopLeftRadius: "16px",
          borderTopRightRadius: "16px",
          display: "flex",
          flexDirection: "column",
        },
      }}
    >
      <Box
        sx={{
          padding: "16px",
          backgroundColor: "#f5f5f5",
          borderBottom: "1px solid #e0e0e0",
        }}
      >
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
          }}
        >
          <Typography
            sx={{ color: "#888", cursor: "pointer", fontWeight: "bold" }}
            onClick={onClose}
          >
            Cancel
          </Typography>
          <Typography
            sx={{ color: "#F95959", fontWeight: "bold", cursor: "pointer" }}
            onClick={handleConfirm}
          >
            Confirm
          </Typography>
        </Box>
      </Box>
      <Box
        sx={{
          flexGrow: 1,
          overflowY: "scroll",
          "&::-webkit-scrollbar": {
            display: "none",
          },
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        {options.map((option, index) => (
          <Button
            key={index}
            sx={{
              padding: "12px",
              width: "100%",
              textAlign: "left",
              borderRadius: "0",
              borderBottom: "1px solid #e0e0e0",
              backgroundColor:
                selectedOption === option ? "#f2f2f1" : "transparent",
              color: selectedOption === option ? "#333" : "#888",
              "&:hover": {
                backgroundColor: "#f8f8f8",
              },
            }}
            onClick={() => handleOptionClick(option)}
          >
            {option}
          </Button>
        ))}
      </Box>
    </Drawer>
  );
};
const formatDateTime = (dateTimeString) => {
  const date = new Date(dateTimeString);
  const formattedDate = date.toLocaleDateString();
  const formattedTime = date.toLocaleTimeString();

  return `${formattedDate} ${formattedTime}`;
};

const TransactionCard = ({ transaction }) => {
  let headerStyle = {};
  let headerText = "";
  let amountStyle = {};

  switch (true) {
    case transaction.type === "Invitation Bonus":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Invitation Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "DailyReward":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Daily Reward";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "RebateBonus":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Rebate Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "Salary":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Salary";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "AdvancedSalary":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Advanced Salary";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "WinstreakBonus":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Winstreak Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "commission":
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Agent Commission/Bonus";
      amountStyle = { color: "#008000" };
      break;
    case ["WingoBet", "K3Bet", "TRXBet", "5DBet"].includes(transaction.type):
      headerStyle = { background: "#F95959", color: "white" }; // Light Blue
      headerText = "Bet";
      amountStyle = { color: "#FF0000" };
      break;
    case transaction.type === "deposit":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Deposit";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "withdraw":
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "Withdraw";
      amountStyle = { color: "#FF0000" };
      break;
    case transaction.type === "DepositBonus":
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "First Deposit Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type.startsWith("SecondDepositBonus"):
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "Second Deposit Bonus";
      amountStyle = { color: "#008000" };
      break; // Add this break statement
    case transaction.type.startsWith("Coupon"):
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Envelop";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "Sign Up Bonus":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Sign Up Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "AttendanceBonus":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Attendance Bonus";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "VIPLevelReward":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "VIP Level Reward";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "VIPMonthlyReward":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "VIP Monthly Reward";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "WalletIncrease":
      headerStyle = { background: "#F95959", color: "white" }; // Green
      headerText = "Wallet Update";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "WalletDecrease":
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "Wallet Deduction";
      amountStyle = { color: "#FF0000" };
      break;
    case transaction.type === "Game Moved In":
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "Game Moved In";
      amountStyle = { color: "#008000" };
      break;
    case transaction.type === "Game Moved Out":
      headerStyle = { background: "#F95959", color: "white" }; // Red
      headerText = "Game Moved Out";
      amountStyle = { color: "#FF0000" };
      break;
    default:
      headerStyle = { background: "#F95959", color: "white" };
      headerText = "Transaction";
  }

  const formattedDateTime = formatDateTime(transaction.date);

  return (
    <div className="transaction-card">
      <div className="transaction-header" style={headerStyle}>
        {headerText}
      </div>
      <div className="transaction-body">
        <div
          className="transaction-detail"
          style={{ backgroundColor: "#F2F2F1" }}
        >
          <span className="transaction-label">Detail</span>
          <span className="transaction-value">{headerText}</span>
        </div>
        <div
          className="transaction-time"
          style={{ backgroundColor: "#F2F2F1" }}
        >
          <span className="transaction-label">Date & Time</span>
          <span className="transaction-value">{formattedDateTime}</span>
        </div>
        <div
          className="transaction-balance"
          style={{ backgroundColor: "#F2F2F1" }}
        >
          <span className="transaction-label">Balance</span>
          <span className="transaction-value" style={amountStyle}>
            ₹{transaction.amount}
          </span>
        </div>
      </div>
    </div>
  );
};

const TransactionHistoryMain = () => {
  const navigate = useNavigate();
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState("All");
  const [transactions, setTransactions] = useState([]);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: null,
    end: null,
  });

  const categoryMap = {
    All: "All",
    Bet: "Bet",
    "Agent Commission": "AgentCommission",
    Deposit: "Deposit",
    Withdraw: "Withdraw",
    "Sign Up Bonus": "SignUpBonus",
    Envelop: "Envelop",
    "Attendance Bonus": "AttendanceBonus",
    "VIP Level Reward": "VIPLevelReward",
    "VIP Monthly Reward": "VIPMonthlyReward",
    Salary: "Salary",
    "First Deposit Bonus": "DepositBonus",
    "Daily Reward": "DailyReward",
    "Rebate Bonus": "RebateBonus",
    "Invitation Bonus": "InvitationBonus",
  };

  useEffect(() => {
    fetchTransactions(categoryMap[selectedFilter], selectedDateRange);
  }, [selectedFilter, selectedDateRange]);

  const fetchTransactions = async (category, dateRange) => {
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in localStorage
      const response = await axios.get(`${domain}/transaction-history`, {
        params: {
          category: category,
          startDate: dateRange.start,
          endDate: dateRange.end,
        },
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // Assuming response.data is an array of transactions
      let filteredTransactions = response.data;

      // Apply date range filter if dates are selected
      if (dateRange.start && dateRange.end) {
        filteredTransactions = response.data.filter((transaction) => {
          const transactionDate = new Date(transaction.date);
          const startDate = new Date(dateRange.start);
          const endDate = new Date(dateRange.end);

          return transactionDate >= startDate && transactionDate <= endDate;
        });
      }

      console.log("Filtered transactions:", filteredTransactions);
      setTransactions(filteredTransactions);
    } catch (error) {
      console.error("Error fetching transactions:", error);
      setTransactions([]); // Ensure the transactions array is reset on error
    }
  };

  const handleBackClick = () => {
    navigate(-1);
  };

  const toggleCalendarDrawer = (open) => {
    setCalendarDrawerOpen(open);
  };

  const toggleFilterDrawer = (open) => {
    setFilterDrawerOpen(open);
  };

  const handleFilterConfirm = (filter) => {
    if (filter !== null) {
      console.log(`Filter selected: ${filter}`);
      setSelectedFilter(filter);
    }
  };

  const handleDateRangeSelect = (dateRange) => {
    console.log("Date range selected:", dateRange);
    setSelectedDateRange(dateRange);
  };

  const formatDateRangeDisplay = () => {
    const { start, end } = selectedDateRange;
    if (start && end) {
      return `${new Date(start).toLocaleDateString()} - ${new Date(
        end
      ).toLocaleDateString()}`;
    } else if (start) {
      return new Date(start).toLocaleDateString();
    }
    return "Choose a date";
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
          <Box>
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
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    onClick={handleBackClick}
                    sx={{ color: "white", ml: -5 }}
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
                    Transaction History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box
              sx={{
                padding: "16px",
                display: "flex",
                gap: "12px",
                backgroundColor: "#F7F8FF",
              }}
            >
              <Button
                variant="outlined"
                onClick={() => toggleFilterDrawer(true)}
                sx={{
                  flex: 1,
                  width: "48%",
                  height: "2.8rem",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  fontSize: "0.68rem",
                  justifyContent: "space-between",
                  padding: "0 10px",
                  color: "#80849c",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                {selectedFilter}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => toggleCalendarDrawer(true)}
                sx={{
                  flex: 1,
                  justifyContent: "space-between",
                  backgroundColor: "#ffffff",
                  textTransform: "none",
                  display: "flex",
                  fontSize: "0.68rem",
                  padding: "0 10px",
                  color: "#80849c",
                  fontWeight: "bold",
                  borderRadius: "5px",
                }}
              >
                {formatDateRangeDisplay()}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Box>
          </Box>

          <Box
            flexGrow={1}
            sx={{ padding: "16px", backgroundColor: "#F7F8FF" }}
          >
            {transactions.length > 0 ? (
              transactions.map((transaction, index) => (
                <TransactionCard key={index} transaction={transaction} />
              ))
            ) : (
              <Typography>No data available.</Typography>
            )}
          </Box>
        </Box>
      </Mobile>

      {/* Filter Drawer */}
      <FilterDrawer
        isOpen={filterDrawerOpen}
        onClose={() => toggleFilterDrawer(false)}
        onConfirm={handleFilterConfirm}
      />

      {/* Calendar Drawer */}
      <CalendarDrawer
        isOpen={calendarDrawerOpen}
        onClose={() => toggleCalendarDrawer(false)}
        onRangeSelect={handleDateRangeSelect}
      />
    </div>
  );
};

export default TransactionHistoryMain;
