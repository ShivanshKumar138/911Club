import React, { useEffect, useState, useMemo } from "react";
import { Tabs, Tab } from "@mui/material";
import Mobile from "./Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SearchIcon from "@mui/icons-material/Search";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import {
  Typography,
  Grid,
  Box,
  CardHeader,
  CardContent,
  Card,
  Button,
  Drawer,
} from "@mui/material";
import axios from "axios";
import VerticalPicker from "./VerticalPicker";
import DatePickerHeader from "./DatePickerHeader"; // Import the new header component
import DatePickerBody from "./DatePickerBody"; // Import the new body component
import LevelHeader from "./LevelHeader"; // Import the new level header component
import LevelBody from "./LevelBody"; // Import the new level body component
import { domain } from "./config";
import { Divider } from "@mui/material";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import { useNavigate } from "react-router-dom";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
};

const SubordinateDataMain = () => {
  const today = new Date();
  const [tabValue, setTabValue] = useState(0);
  const [dailyDeposits, setDailyDeposits] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [searchDate, setSearchDate] = useState("");
  const [user, setUser] = useState(null);
  const [commissionHistory, setCommissionHistory] = useState(null); // New state for commission history
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [levelDrawerOpen, setLevelDrawerOpen] = useState(false);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate() - 1);
  const [selectedLevel, setSelectedLevel] = useState("All");
  const [searchLevel, setSearchLevel] = useState("All");
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(2023, 1));
  const [subordinateDataSummary, setSubordinateDataSummary] = useState([]);
  const [filteredSummary, setFilteredSummary] = useState([]);
  const navigate = useNavigate();
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [summaryStats, setSummaryStats] = useState({
    depositNumber: 0,
    depositAmount: 0,
    bettorsCount: 0,
    totalBetAmount: 0,
    firstDepositCount: 0,
    firstDepositAmount: 0,
  });
  const [subordinateTurnOver, setSubordinateTurnOver] = useState({});

  useEffect(() => {
    // Define an asynchronous function to fetch the turnover data
    const fetchTurnOverData = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Replace with your actual token
        const response = await axios.get(
          `${domain}/api/subordinates/total-commission`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Add the Bearer token in the header
            },
          }
        );
        console.log("TURN OVER-->", response.data);
        setSubordinateTurnOver(response.data.totalCommissions || {});
      } catch (error) {
        console.log("ERROR", error);
      }
    };
  
    // Call the function to fetch data
    fetchTurnOverData();
  }, []); // Empty dependency array means this useEffect runs once after the initial render// Empty dependency array means this useEffect runs once after the initial render

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(year, month));
    if (day > daysInMonth.length) {
      setDay(daysInMonth[daysInMonth.length - 1]);
    }
  }, [year, month, day]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem('token');
    
        // Fetch user data
        const userResponse = await axios.get(`${domain}/user/subordinatedata`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("User Response:", userResponse.data);
        setUser(userResponse.data.referredUsers);
    
        // Fetch commission data
        const commissionResponse = await axios.get(
          `${domain}/commission-history`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
    
        // Group by commissionFromUser
        const groupedData = {};
        
        commissionResponse.data.commissionHistories.forEach(item => {
          const key = item.commissionFromUser;
          
          if (!groupedData[key]) {
            groupedData[key] = {
              // Keep original structure of the item
              ...item,
              // Reset numerical values
              amount: "0",
              betAmount: "0",
              depositAmount: "0",
              depositAmountOfUser: "0",
              // Add tracking fields
              count: 0,
              // Store numerical values separately for calculations
              _numAmount: 0,
              _numBetAmount: 0,
              _numDepositAmount: 0,
              _numDepositAmountOfUser: 0
            };
          }
          
          // Parse string values to numbers for addition
          const numAmount = parseFloat(item.amount) || 0;
          const numBetAmount = parseFloat(item.betAmount) || 0;
          const numDepositAmount = parseFloat(item.depositAmount) || 0;
          const numDepositAmountOfUser = parseFloat(item.depositAmountOfUser) || 0;
          
          // Add to running totals
          groupedData[key]._numAmount += numAmount;
          groupedData[key]._numBetAmount += numBetAmount;
          groupedData[key]._numDepositAmount += numDepositAmount;
          groupedData[key]._numDepositAmountOfUser += numDepositAmountOfUser;
          
          // Increment count
          groupedData[key].count += 1;
          
          // Update date if this is more recent
          if (new Date(item.date) > new Date(groupedData[key].date)) {
            groupedData[key].date = item.date;
          }
        });
        
        // Format the final outputs
        Object.values(groupedData).forEach(group => {
          // Convert numerical totals back to strings with 2 decimal places
          group.amount = group._numAmount.toFixed(2);
          group.betAmount = group._numBetAmount.toFixed(2);
          group.depositAmount = group._numDepositAmount.toFixed(2);
          group.depositAmountOfUser = group._numDepositAmountOfUser.toFixed(2);
          
          // Add a display name
          const uid = group.commissionFromUserDetails?.uid || 'unknown';
          group.displayName = `${uid} (${group.count} transactions)`;
          
          // Remove temporary calculation fields
          delete group._numAmount;
          delete group._numBetAmount;
          delete group._numDepositAmount;
          delete group._numDepositAmountOfUser;
        });
        
        // Convert to array for state update
        const result = Object.values(groupedData);
        
        setCommissionHistory(result);
        
      } catch (err) {
        console.error("Error fetching data:", err);
      }
    };
  
    fetchData();
  }, []); // Add dependencies if needed

  // Initialize searchDate with yesterday's date
  useEffect(() => {
    const initializeDate = () => {
      const today = new Date();
      today.setDate(today.getDate()); // Set to yesterday
      const formattedDate = today.toISOString().split("T")[0]; // Format YYYY-MM-DD
      setSearchDate(formattedDate);
    };

    initializeDate();
  }, []);

  // Fetch deposit summary and filter based on searchDate
  useEffect(() => {
    const fetchDepositsSummary = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Replace with your actual token
        const response = await axios.get(
          `${domain}/api/subordinates/subordinate-summary`,
          {
            withCredentials: true,
            headers: {
              Authorization: `Bearer ${token}`, // Add the Bearer token in the header
            },
          }
        );
        // console.log("Fetched Deposit Summary:", response.data);
        setSubordinateDataSummary(response.data);
  
        // Filter data based on searchDate if it's set
        const filteredData = searchDate
          ? response.data.filter((item) => item.date === searchDate)
          : response.data;
  
        // Extract statistics from filtered data
        const summary = filteredData.reduce(
          (acc, item) => {
            return {
              depositNumber: acc.depositNumber + item.totalDeposits,
              depositAmount: acc.depositAmount + item.totalDepositAmount,
              bettorsCount: acc.bettorsCount + item.usersWhoBetCount,
              totalBetAmount: acc.totalBetAmount + item.totalBetAmount,
              firstDepositCount:
                acc.firstDepositCount + item.firstTimeDepositorsCount,
              firstDepositAmount:
                acc.firstDepositAmount + item.totalFirstDepositAmount,
            };
          },
          {
            depositNumber: 0,
            depositAmount: 0,
            bettorsCount: 0,
            totalBetAmount: 0,
            firstDepositCount: 0,
            firstDepositAmount: 0,
          }
        );
  
        // Update filtered summary and statistics
        setFilteredSummary(filteredData);
        setSummaryStats(summary);
      } catch (error) {
        console.error("Error fetching deposit summary:", error.message);
      }
    };
  
    fetchDepositsSummary();
  }, [searchDate]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleDateChange = () => {
    setSearchDate(
      `${year}-${month < 10 ? `0${month}` : month}-${
        day < 10 ? `0${day}` : day
      }`
    );
    setDatePickerOpen(false);
  };

  const handleLevelConfirm = () => {
    setSearchLevel(selectedLevel === "All" ? "All" : selectedLevel.toString());
    setLevelDrawerOpen(false);
  };
  const filteredData = useMemo(() => {
    if (user) {
      // console.log("User data available:", user);
      // console.log("Filtering data...");

      const filtered = user.filter((deposit) => {
        const matchesUid = deposit.uid.toString().includes(searchTerm);
        const matchesDate = !searchDate || deposit.date.startsWith(searchDate);
        const matchesLevel =
          searchLevel === "All" || deposit.level.toString() === searchLevel;

        return matchesUid && matchesDate && matchesLevel;
      });

      // console.log("Filtered data:", filtered);
      return filtered;
    } else {
      console.log("No user data available");
      return [];
    }
  }, [user, searchTerm, searchDate, searchLevel]); // Dependencies array

  const filteredCommissionData = useMemo(() => {
    try {
      // Log the input data and filtering conditions
      console.log("Filtering Commission History");
      console.log("commissionHistory:", commissionHistory);
      console.log("searchDate:", searchDate);
      console.log("searchLevel:", searchLevel);
      console.log("searchTerm (UID or other):", searchTerm);

      return commissionHistory
        ? commissionHistory.filter((commission) => {
            // Log each commission item before filtering
            console.log("Checking commission:", commission);

            // Perform the filtering logic
            const matchesDate =
              !searchDate || commission.date.startsWith(searchDate);
            const matchesLevel =
              searchLevel === "All" ||
              commission.commissionLevel.toString() === searchLevel.toString();
            const matchesUid =
              !searchTerm ||
              (commission.commissionFromUserDetails &&
                commission.commissionFromUserDetails.uid.includes(searchTerm));

            // Log the result of filtering conditions
            console.log("matchesDate:", matchesDate);
            console.log("matchesLevel:", matchesLevel);
            console.log("matchesUid:", matchesUid);

            return matchesDate && matchesLevel && matchesUid;
          })
        : [];
    } catch (error) {
      console.error("Error filtering commissionHistory:", error);
      return [];
    }
  }, [commissionHistory, searchDate, searchLevel, searchTerm]); // Added searchTerm to dependencies

  return (
    <div>
      <Mobile>
        <Box
          display="flex"
          flexDirection="column"
          height="100vh"
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
                backgroundColor: "#ffffff",
                padding: "4px 8px",
                color: "black",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={2}>
                  <IconButton
                    onClick={() => navigate(-1)}
                    sx={{ color: "black", ml: -5 }}
                  >
                    <ArrowBackIosNewIcon />
                  </IconButton>
                </Grid>
                <Grid item xs={10}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: "black",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 8,
                    }}
                  >
                    Subordinate Data
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            {/* Content */}
            <Grid container spacing={2} sx={{ padding: "16px" }}>
              <Grid item xs={12}>
                <Box
                  sx={{
                    display: "flex",
                    alignItems: "center",
                    backgroundColor: "#ffffff",
                    borderRadius: "5px",
                    padding: "5px 10px",
                    border: "1px solid #fff",
                  }}
                >
                  <input
                    value={searchTerm}
                    onChange={(event) => setSearchTerm(event.target.value)}
                    placeholder="Search User ID"
                    style={{
                      flexGrow: 1,
                      border: "none",
                      backgroundColor: "transparent",
                      color: "black",
                      outline: "none",
                      padding: "10px",
                      fontSize: "16px",
                    }}
                  />
                  <IconButton
                    onClick={() => {
                      /* Trigger search action */
                    }}
                  >
                    <SearchIcon style={{ color: "black" }} />
                  </IconButton>
                </Box>
              </Grid>

              <Grid item xs={12} sx={{ display: "flex", gap: 2 }}>
                <Button
                  variant="outlined"
                  onClick={() => setLevelDrawerOpen(true)}
                  sx={{
                    width: "48%",
                    height: "2.8rem",
                    backgroundColor: "#ffffff",
                    textTransform: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    borderColor: "#fff",
                    color: "#000",
                    borderRadius: "5px",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "#ffffff",
                      },
                  }}
                >
                  {searchLevel === "All"
                    ? "All Levels"
                    : `Level ${searchLevel}`}
                  <KeyboardArrowDownOutlinedIcon />
                </Button>

                <Button
                  variant="outlined"
                  sx={{
                    width: "48%",
                    height: "2.8rem",
                    backgroundColor: "#ffffff",
                    textTransform: "none",
                    display: "flex",
                    justifyContent: "space-between",
                    padding: "0 16px",
                    borderColor: "#fff",
                    "&:hover": {
                      borderColor: "#fff",
                      backgroundColor: "#ffffff",
                      },
                    color: "#000",
                    borderRadius: "5px",
                  }}
                  onClick={() => setDatePickerOpen(true)}
                >
                  {searchDate || "Choose Date"}
                  <KeyboardArrowDownOutlinedIcon />
                </Button>
              </Grid>
            </Grid>

            <Grid container justifyContent="center" alignItems="center">
              <Box
                sx={{
                  padding: "25px",
                  background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
                  width: "78%",
                  borderRadius: "16px",
                  boxShadow: "0 8px 32px rgba(0, 0, 0, 0.2)",
                  color: "white",
                }}
              >
                <Grid container spacing={3}>
                  {/* Row 1 */}
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{ borderRight: "1px solid #fff" }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          {summaryStats.depositNumber}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Deposit number
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          ₹{summaryStats.depositAmount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Deposit amount
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Row 2 */}
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{ borderRight: "1px solid #fff" }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          {summaryStats.bettorsCount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Number of bettors
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          ₹{summaryStats.totalBetAmount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Total bet
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>

                  {/* Row 3 */}
                  <Grid container item xs={12} spacing={2}>
                    <Grid item xs={6} sx={{ borderRight: "1px solid #fff" }}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          {summaryStats.firstDepositCount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          Number of people making first deposit
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={6}>
                      <Box sx={{ textAlign: "center" }}>
                        <Typography variant="h7" fontWeight="bold">
                          ₹{summaryStats.firstDepositAmount}
                        </Typography>
                        <Typography variant="body2" sx={{ opacity: 0.7 }}>
                          First deposit amount
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>

            {/* tabBar  */}
            <Box
              sx={{
                width: "90%",
                margin: "15px auto",
                background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
                borderRadius: "25px",
              }}
            >
              <Tabs
                value={tabValue}
                onChange={handleTabChange}
                textColor="inherit"
                indicatorColor="primary"
                variant="fullWidth"
                sx={{
                  background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
                  borderRadius: "5px",
                  color: "white",
                  "& .MuiTabs-indicator": {
                    backgroundColor: "white", // Set the indicator color to white
                  },
                }}
              >
                <Tab
                  label="Subordinate Details"
                  sx={{
                    borderBottom: tabValue === 0 ? "1px solid white" : "none",
                    textTransform: "initial",
                  }}
                />
                <Tab
                  label="Commission Details"
                  sx={{
                    borderBottom: tabValue === 1 ? "1px solid white" : "none",
                    textTransform: "initial",
                  }}
                />
              </Tabs>
              <Box sx={{ padding: "1px", backgroundColor: "#ffffff" }}>
                {tabValue === 0 && (
                  // Subordinate Details Content
                  <div>{/* Your Subordinate Details content goes here */}</div>
                )}
                {tabValue === 1 && (
                  // Commission Details Content
                  <div>{/* Your Commission Details content goes here */}</div>
                )}
              </Box>
            </Box>

            {/* Display filtered data */}
            {/* Display No Data Available */}

            <Box sx={{ padding: "1px", backgroundColor: "#f2f2f1" }}>
              {tabValue === 0 ? (
                // Subordinate Details Content
                filteredData.length === 0 ? (
                  <Box
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      padding: "16px",
                      textAlign: "center",
                    }}
                  >
                    <img
                      src="/assets/No data-amico.png" // Replace with your dummy image path
                      alt="No Data Available"
                      style={{ width: "300px", height: "auto" }}
                    />
                    <Typography
                      variant="h6"
                      color="grey"
                      sx={{ marginTop: "16px" }}
                    >
                      No Data Available
                    </Typography>
                  </Box>
                ) : (
                  <Box
                    sx={{
                      display: "flex",
                      justifyContent: "center", // Center horizontally
                      alignItems: "center", // Center vertically
                      paddingLeft: "20px",
                      paddingRight: "20px",
                    }}
                  >
                    <Box
                      sx={{
                        backgroundColor: "#f5f5f5", // Slightly lighter gray background for the box
                        borderRadius: "5px", // More rounded corners for a softer look
                        paddingLeft: "5px",
                        paddingRight: "5px",
                        paddingBottom: "10px",
                        width: "100%", // Full width within the maxWidth constraint
                        maxWidth: "600px", // Maximum width for better readability
                      }}
                    >
                      {/* Header Row */}
                      <Box
                        sx={{
                          display: "grid",
                          gridTemplateColumns: "1fr 1.5fr 1fr 1fr",
                          padding: "12px",
                          borderRadius: "5px",
                        }}
                      >
                        <Typography
                          variant="body2"
                          sx={{
                            color: "black",
                          }}
                        >
                          UID
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "black",
                          }}
                        >
                          Joined
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "black",
                            textAlign: "center",
                          }}
                        >
                          Turn Over
                        </Typography>
                        <Typography
                          variant="body2"
                          sx={{
                            color: "black",
                            textAlign: "end",
                          }}
                        >
                          Level
                        </Typography>
                      </Box>

                      <Divider
                        sx={{
                          borderColor: "#eee", // Line color matching header background
                          borderWidth: "1px", // Thickness of the line
                          marginBottom: "16px", // Space below the divider
                        }}
                      />

                      {/* Data Rows */}
                      {filteredData.map((data, index) => (
                        <Box
                          key={index}
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr 2fr 1fr 1fr",
                            padding: "12px",
                            textAlign: "left",
                            backgroundColor: "#ffffff",
                            borderRadius: "8px",
                            marginBottom:
                              index !== filteredData.length - 1 ? "8px" : "0",
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                            }}
                          >
                            {data.uid}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              ml: 4,
                            }}
                          >
                            {new Date(data.date).toLocaleDateString()}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              textAlign: "center",
                            }}
                          >
                            {subordinateTurnOver[data.uid] !== undefined
                              ? subordinateTurnOver[data.uid]
                              : 0}
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#000",
                              textAlign: "end",
                            }}
                          >
                            {data.level}
                          </Typography>
                        </Box>
                      ))}
                    </Box>
                  </Box>
                )
              ) : // Commission Details Content
              filteredCommissionData.length === 0 ? (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                    padding: "16px",
                    textAlign: "center",
                    backgroundColor: "#f2f2f1",
                  }}
                >
                  <img
                    src="/assets/No data-amico.png" // Replace with your dummy image path
                    alt="No Data Available"
                    style={{ width: "300px", height: "auto" }}
                  />
                  <Typography
                    variant="h6"
                    color="grey"
                    sx={{ marginTop: "16px" }}
                  >
                    No Data Available
                  </Typography>
                </Box>
              ) : (
                <Box
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    padding: "16px",
                    gap: "16px",
                  }}
                >
                  {filteredCommissionData.map((commission, index) => (
                    <Card
                      key={index}
                      sx={{
                        backgroundColor: "#f9fafb", // Light background color
                        borderRadius: "8px",
                        paddingLeft: "10px",
                        paddingRight: "10px",
                        boxShadow: "0px 4px 12px rgba(0, 0, 0, 0.1)", // Softer shadow for a subtle effect
                        marginBottom: "10px", // Space between cards
                        maxWidth: "400px", // Optional: Set a max width for the card
                      }}
                    >
                      <CardContent>
                        {/* UID and Copy Icon */}
                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            marginBottom: "8px",
                            gap: "10px",
                            // justifyContent: "space-between", // Space out UID and Icon
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            sx={{
                              color: "#1e2022", // Darker text color for contrast
                              fontWeight: "bold",
                            }}
                          >
                            UID: {commission.commissionFromUserDetails.uid}
                          </Typography>
                          {/* Placeholder for copy icon */}
                          <IconButton
                            sx={{
                              padding: "0",
                              color: "#1e2022", // Same color as UID
                            }}
                          >
                            <ContentCopyIcon fontSize="small" />
                          </IconButton>
                        </Box>

                        {/* Divider under UID */}
                        <Divider
                          sx={{ marginBottom: "16px", borderColor: "#ccc" }}
                        />

                        {/* Details */}
                        <Box
                          sx={{
                            display: "grid",
                            gridTemplateColumns: "1fr auto", // Two columns, auto for fitting the content
                            gap: "8px 16px", // Space between rows and between label and value
                          }}
                        >
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888", // Light gray for labels
                              textAlign: "start",
                            }}
                          >
                            Level:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1e2022", // Darker color for values
                              textAlign: "end",
                            }}
                          >
                            {commission.commissionLevel}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888", // Light gray for labels
                              textAlign: "start",
                            }}
                          >
                            Deposit amount:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#F95959", // Highlighted value color
                              fontWeight: "bold",
                              textAlign: "end",
                            }}
                          >
                            {commission.depositAmountOfUser}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888", // Light gray for labels
                              textAlign: "start",
                            }}
                          >
                            Bet amount:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#F95959", // Highlighted value color
                              fontWeight: "bold",
                              textAlign: "end",
                            }}
                          >
                            {commission.betAmount}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888", // Light gray for labels
                              textAlign: "start",
                            }}
                          >
                            Commission:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#F95959", // Highlighted value color
                              fontWeight: "bold",
                              textAlign: "end",
                            }}
                          >
                            {commission.amount}
                          </Typography>

                          <Typography
                            variant="body2"
                            sx={{
                              color: "#888", // Light gray for labels
                              textAlign: "start",
                            }}
                          >
                            Time:
                          </Typography>
                          <Typography
                            variant="body2"
                            sx={{
                              color: "#1e2022", // Darker color for values
                              textAlign: "end",
                            }}
                          >
                            {new Date(commission.date).toLocaleDateString()}
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  ))}
                </Box>
              )}
            </Box>
          </Box>
          <br/>
          <br/>
          <br/>
        </Box>
       
      </Mobile>

      {/* Date Picker Drawer */}
      <Drawer
        anchor="bottom"
        open={datePickerOpen}
        onClose={() => setDatePickerOpen(false)}
        sx= {{
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
        <DatePickerHeader
          onCancel={() => setDatePickerOpen(false)}
          onConfirm={handleDateChange}
        />
        <DatePickerBody
          year={year}
          month={month}
          day={day}
          daysInMonth={daysInMonth}
          setYear={setYear}
          setMonth={setMonth}
          setDay={setDay}
        />
      </Drawer>

      {/* Level Drawer */}
      <Drawer
        anchor="bottom"
        open={levelDrawerOpen}
        onClose={() => setLevelDrawerOpen(false)}
        sx= {{
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
        <LevelHeader
          onCancel={() => setLevelDrawerOpen(false)}
          onConfirm={handleLevelConfirm}
        />
        <LevelBody
          selectedLevel={selectedLevel}
          setSelectedLevel={setSelectedLevel}
          options={["Dummy", "All", 1, 2, 3, 4, 5, 6]}
        />
      </Drawer>
    </div>
  );
};

export default SubordinateDataMain;