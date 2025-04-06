import React, { useEffect, useState } from "react";
import Mobile from "../Components/Mobile";
import IconButton from "@mui/material/IconButton";
import SmsIcon from "@mui/icons-material/Sms";
import DownloadIcon from "@mui/icons-material/Download";
import ArrowDropDownIcon from "@mui/icons-material/ArrowDropDown";
import {
  Typography,
  Grid,
  Box,
  Drawer,
  TextField,
  InputAdornment,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useNavigate } from "react-router-dom";
import DatePickerHeader from "./DatePickerHeader";
import DatePickerBody from "./DatePickerBody";
import { domain } from "./config";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";

const getDaysInMonth = (year, month) => {
  return Array.from(
    { length: new Date(year, month, 0).getDate() },
    (_, i) => i + 1
  );
};

const CommisionDetailsMain = () => {
  const today = new Date();
  const navigate = useNavigate();
  const [searchDate, setSearchDate] = useState("");
  const [datePickerOpen, setDatePickerOpen] = useState(false);
  const [year, setYear] = useState(today.getFullYear());
  const [month, setMonth] = useState(today.getMonth() + 1);
  const [day, setDay] = useState(today.getDate());
  const [daysInMonth, setDaysInMonth] = useState(getDaysInMonth(2023, 1));
  const [selectedDate, setSelectedDate] = useState("");
  const [allCommissionData, setAllCommissionData] = useState([]);
  const [filteredCommissionData, setFilteredCommissionData] = useState([]);
  const [commissionCount, setCommissionCount] = useState(0); // State for count
  const [investorAmount, setInvestorAmount] = useState(0); // New state for investor amount
  const [totalCommission, setTotalCommission] = useState(0); // State to store total commission
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  useEffect(() => {
    const fetchAllCommissionData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/commission-history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        console.log("All Commission Data:", response.data);
        // console.log("All Commission Data:", response.data);
        setAllCommissionData(response.data.commissionHistories);
      } catch (err) {
        console.error("Error fetching commission data:", err);
        setAllCommissionData([]);
      }
    };

    fetchAllCommissionData();
  }, []);

  useEffect(() => {
    const filterData = () => {
      const filtered = allCommissionData.filter((item) => {
        const itemDate = item.date.split("T")[0];
        return itemDate === searchDate;
      });
  
      console.log("data is--->", filtered);
  
      setFilteredCommissionData(filtered);
      
      // Count unique UIDs
      const uniqueUids = new Set(
        filtered.map(item => item.commissionFromUserDetails.uid)
      );
      setCommissionCount(uniqueUids.size); // Set count of unique UIDs
  
      const total = filtered.reduce((sum, item) => sum + (item.amount || 0), 0);
      setTotalCommission(total);
  
      const totalInvestorAmount = filtered.reduce(
        (total, item) =>
          total + (item.depositAmountOfUser || 0) + (item.betAmount || 0),
        0
      );
      setInvestorAmount(totalInvestorAmount);
    };
  
    if (searchDate && allCommissionData.length > 0) {
      filterData();
    } else {
      // Reset states if there's no searchDate or no data
      setFilteredCommissionData([]);
      setCommissionCount(0);
      setTotalCommission(0);
      setInvestorAmount(0);
    }
  }, [searchDate, allCommissionData]);

  useEffect(() => {
    const currentDate = new Date().toISOString().split("T")[0];
    setSelectedDate(currentDate);
    setSearchDate(currentDate); // Set initial searchDate to today's date
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

  useEffect(() => {
    setDaysInMonth(getDaysInMonth(year, month));
    if (day > daysInMonth.length) {
      setDay(daysInMonth[daysInMonth.length - 1]);
    }
  }, [year, month, day]);

  const handleDateDrawerToggle = () => {
    setDatePickerOpen(!datePickerOpen);
  };

  const handleDateChange = () => {
    const formattedDate = `${year}-${month < 10 ? `0${month}` : month}-${
      day < 10 ? `0${day}` : day
    }`;
    setSearchDate(formattedDate); // Update the search date
    setSelectedDate(formattedDate);
    setDatePickerOpen(false);
  };

  // Handle card click
  const handleCardClick = (path, date) => {
    navigate(path, { state: { date } });
  };

  const handleRedirect = () => {
    navigate(-1);
  };

  return (
    <div>
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
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)", // Green background color
    padding: "4px 8px",
    color: "white", // White text color
  }}
>
  <Grid item container alignItems="center" justifyContent="center">
    <Grid item xs={2}>
      <IconButton
        sx={{ color: "white", ml: -5 }} // White icon color
        onClick={handleRedirect}
      >
        <ArrowBackIosNewIcon />
      </IconButton>
    </Grid>
    <Grid item xs={10}>
      <Typography
        variant="h6"
        sx={{
          color: "white", // White text color
          flexGrow: 1,
          textAlign: "center",
          mr: 8,
        }}
      >
        Commission Details
      </Typography>
    </Grid>
  </Grid>
</Grid>


            <Grid
              container
              sx={{
                padding: "8px 16px",
                marginBottom: "20px",
                marginTop: "10px",
              }}
            >
              <TextField
                type="text"
                value={selectedDate}
                fullWidth
                onClick={handleDateDrawerToggle}
                InputProps={{
                  readOnly: true,
                  endAdornment: (
                    <InputAdornment position="end">
                      <IconButton onClick={handleDateDrawerToggle}>
                        <ArrowDropDownIcon sx={{ color: "black" }} />
                      </IconButton>
                    </InputAdornment>
                  ),
                  sx: {
                    padding: "2px 8px",
                  },
                }}
                sx={{
                  backgroundColor: "#ffffff",
                  borderRadius: 2,
                  color: "black",
                  input: { color: "black", padding: "8px" },
                }}
              />
            </Grid>

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

            {/* Gray Box Section with Cards */}
            <Box
              sx={{
                backgroundColor: "#ffffff",
                padding: "16px",
                borderRadius: "8px",
                color: "grey",
                width: "83%",
                margin: "0 auto", // Center the box
              }}
            >
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                Settlement successful
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                {selectedDate}
              </Typography>
              <Typography
                variant="body2"
                sx={{ marginBottom: "4px", textAlign: "start" }}
              >
                The commission has been automatically credited to your balance
              </Typography>

              {/* Commission Details Cards */}
              <Box sx={{ marginTop: "16px" }}>
                {[
                  {
                    label: "Number of bettors",
                    value: `${commissionCount} People`, // Display the count
                    path: "/details",
                  },
                  {
                    label: "Investor Amount",
                    value: investorAmount, // Display the investor amount
                    path: "/details",
                  },
                  {
                    label: "Commission payout",
                    value: `${totalCommission}`,
                    path: "/details",
                    valueColor: "#f39c12",
                  },
                  {
                    label: "Date",
                    value: `${selectedDate}`,
                    path: "/details",
                  },
                ].map((item, index) => (
                  <Box
                    key={index}
                    sx={{
                      backgroundColor: "#f6f6f6",
                      padding: "10px",
                      marginBottom: "8px",
                      borderRadius: "3px",
                      cursor: "pointer",
                      display: "flex",
                      justifyContent: "space-between",
                      alignItems: "center",
                    }}
                    onClick={() => handleCardClick(item.path, selectedDate)}
                  >
                    <Typography variant="body2">{item.label}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: item.valueColor || "black" }}
                    >
                      {item.value}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </Box>
      </Mobile>
    </div>
  );
};

export default CommisionDetailsMain;