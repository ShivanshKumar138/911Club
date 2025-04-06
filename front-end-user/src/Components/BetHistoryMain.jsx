import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import {
  TextField,
  Box,
  IconButton,
  Typography,
  Grid,
  Drawer,
  List,
  ListItem,
  ListItemText,
  Button,
  Divider,
  CircularProgress,
} from "@mui/material";
import HomeIcon from "@mui/icons-material/Home";
import SportsEsportsIcon from "@mui/icons-material/SportsEsports";
import CasinoIcon from "@mui/icons-material/Casino";
import AttachMoneyIcon from "@mui/icons-material/AttachMoney";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SmsIcon from "@mui/icons-material/Sms";
import KeyboardArrowDownOutlinedIcon from "@mui/icons-material/KeyboardArrowDownOutlined";
import DownloadIcon from "@mui/icons-material/Download";
import { useNavigate } from "react-router-dom";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { DateRangePicker } from "@mui/x-date-pickers-pro/DateRangePicker";
import { LocalizationProvider } from "@mui/x-date-pickers";
import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import Mobile from "./Mobile";
import { domain } from "./config";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import CalendarDrawer from "./CalendarDrawer";
import "./BetHistoryStyles.css";
import LotteryIcon from "../../public/GameHistory/lottery.png";
import LotteryIconOF from "../../public/GameHistory/LotteryUnlight.png";
import CasinoIconON from "../../public/GameHistory/Casino.png";
import CasinoIconOF from "../../public/GameHistory/CasionUnLight.png";
import GameON from "../../public/GameHistory/gameON.png";
import GameOF from "../../public/GameHistory/gameOF.png";
const buttons = [
  {
    label: "Lottery",
    iconOn: LotteryIcon,
    backgroundColor: "#F95959",
    iconOf: LotteryIconOF,
  },
  {
    label: "Casino",
    iconOn: CasinoIconON,
    backgroundColor: "#F95959",
    iconOf: CasinoIconOF,
  },
  {
    label: "Fishing",
    iconOn: GameON,
    backgoundColor: "#F95959",
    iconOf: GameOF,
  },
  // { label: "Run", icon:iconOn: LotteryIcon , backgroundColor:"#F95959" ,iconOf:LotteryIconOF},
];

const filterOptions = {
  Lottery: ["All", "Wingo", "K3", "TRX", "5D"],
  Casino: ["Poker", "Blackjack", "Roulette"],
  Fishing: ["Game A", "Game B", "Game C"],
  Run: ["Deposits", "Withdrawals"],
};

const BetHistoryMain = () => {
  const [activeButton, setActiveButton] = useState("Lottery");
  const theme = useTheme();
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [calendarOpen, setCalendarOpen] = useState(false);
  const [selectedFilter, setSelectedFilter] = useState(null);
  const [selectedOption, setSelectedOption] = useState(
    filterOptions["Lottery"][0]
  );
  const today = new Date(); // Get today's date
  const [dateRange, setDateRange] = useState([today, today]); // Set today's date as the initial value

  const [bets, setBets] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const containerRef = useRef(null);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [calendarDrawerOpen, setCalendarDrawerOpen] = useState(false);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  // Set the end of today (23:59:59)
  const endOfDay = new Date(today.setHours(23, 59, 59, 999));

  // Set the start of yesterday (00:00:00)
  const startOfYesterday = new Date(today);
  startOfYesterday.setDate(today.getDate() - 1); // Go back one day
  startOfYesterday.setHours(0, 0, 0, 0); // Set to the start of the day (midnight)

  const [selectedDateRange, setSelectedDateRange] = useState({
    start: startOfYesterday.toISOString(), // Convert to ISO 8601 string format
    end: endOfDay.toISOString(),
  });

  const toggleCalendarDrawer = (open) => {
    setCalendarDrawerOpen(open);
  };

  const toggleFilterDrawer = (open) => {
    setFilterDrawerOpen(open);
  };

  const handleDateRangeSelect = (dateRange) => {
    if (dateRange.start && dateRange.end) {
      // Convert to ISO 8601 format, which is what MongoDB expects
      const formattedDateRange = {
        start: new Date(dateRange.start).toISOString(), // Converts start date to ISO format
        end: new Date(dateRange.end).toISOString(), // Converts end date to ISO format
      };

      console.log("Formatted date range selected:", formattedDateRange);
      setSelectedDateRange(formattedDateRange); // Set the formatted date range
    } else {
      console.log("Invalid date range:", dateRange);
    }
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

  const fetchBets = async () => {
    setLoading(true);
    setError("");
    try {
      if (activeButton !== "Lottery") {
        // If the activeButton is not "Lottery", show no data available
        setBets([]);
        setError("No data available");
      } else {
        // Log the selected option and active button before the API call
        console.log("Active Button:", activeButton);
        console.log("Selected Option:", selectedOption);
        console.log("Date Range:", dateRange);

        const params = {
          gameType:
            activeButton === "Lottery" && selectedOption !== "All"
              ? selectedOption
              : "All",
          startDate: selectedDateRange.start,
          endDate: selectedDateRange.end,
        };

        console.log("API Params:", params); // Log the params passed to the API

        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage

        const response = await axios.get(`${domain}/bet-history`, {
          params,
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        if (response.data && Array.isArray(response.data)) {
          if (selectedOption === "All") {
            // For "Lottery" with "All" option, handle the response directly
            console.log("response.data--->", response.data);
            setBets(response.data || []);
            console.log(response.data);
          } else {
            // Handle the case where specific gameType is selected
            if (response.data.length > 0) {
              // Set bets from response directly if there are bets
              console.log("response.data.bets---->", response.data);
              setBets(response.data);
            } else {
              // No bets or empty bets
              setBets([]);
              setError("No history available");
            }
          }
        } else {
          // Response data is not an array or is malformed
          setBets([]);
          setError("Invalid data format received");
        }
      }
    } catch (err) {
      setError("Failed to fetch data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBets(); // Fetch bets when component mounts or when filters change
  }, [activeButton, selectedOption, selectedDateRange]);

  const handleButtonClick = (label) => {
    setActiveButton(label);
    setSelectedFilter(null);
    // setSelectedOption(filterOptions[label][0]); // Automatically select the first option/
  };

  const handlePage = () => {
    navigate(-1);
  };

  const handleFilterClick = (filter) => {
    if (filter === "Date") {
      setCalendarOpen(true);
    } else {
      setSelectedFilter(filter);
      // setSelectedOption(filterOptions[activeButton][0]); // Automatically select the first option
      setDrawerOpen(true);
    }
  };

  const handleDrawerClose = () => {
    setDrawerOpen(false);
    setCalendarOpen(false);
  };

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
  };

  const handleConfirm = () => {
    console.log(selectedOption);
    setDrawerOpen(false);
    setCalendarOpen(false);
    fetchBets(); // Fetch bets after confirming selection
  };

  function capitalizeFirstLetter(str) {
    if (typeof str !== "string") return str;
    return str.charAt(0).toUpperCase() + str.slice(1);
  }

  function getK3SelectedItem(bet) {
    if (bet.twoSameOneDifferent && bet.twoSameOneDifferent.length) {
      return `2 Same: ${bet.twoSameOneDifferent.join(", ")}`;
    }

    if (bet.threeSame && bet.threeSame.length) {
      return `3 Same: ${bet.threeSame.join(", ")}`;
    }

    if (bet.threeDifferentNumbers && bet.threeDifferentNumbers.length) {
      return `All Different: ${bet.threeDifferentNumbers[0]
        .toString()
        .split("")
        .join(", ")}`;
    }

    return `Total Sum: ${bet.totalSum}`;
  }

  function calculateTotalBetAmount(bet) {
    const totalBet = parseFloat(bet.totalBet) || 0;
    const tax = parseFloat(bet.tax) || 0;
    return Math.round(totalBet + tax);
  }

  const selectedItemFilter = (bet) => {
    if (bet.gameType === "k3") {
      console.log("selectedItem:", bet);
      return getK3SelectedItem(bet);
    }
    if (bet.gameType === "5d") {
      let result = {};

      for (const section in bet.sectionBets) {
        if (
          bet.sectionBets[section].hasOwnProperty("size") &&
          bet.sectionBets[section].size
        ) {
          result[section] = bet.sectionBets[section].size;
        } else if (
          bet.sectionBets[section].hasOwnProperty("numberBet") &&
          bet.sectionBets[section].numberBet.length > 0
        ) {
          result[section] = bet.sectionBets[section].numberBet;
        }
      }

      return result;
    } else {
      return capitalizeFirstLetter(bet.selectedItem);
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
          <Box flexGrow={1} backgroundColor="#F7F8FF">
            <Grid
              container
              alignItems="center"
              justifyContent="space-between"
              sx={{
                position: "sticky",
                top: 0,
                zIndex: 1000,
                backgroundColor: "#F95959",
                padding: "7px 4px",
                color: "white",
              }}
            >
              <Grid item container alignItems="center" justifyContent="center">
                <Grid item xs={3}>
                  <IconButton
                    sx={{ color: "white", mr: 8 }}
                    onClick={() => navigate(-1)}
                  >
                    <ArrowBackIosNewIcon sx={{ fontSize: "20px" }} />
                  </IconButton>
                </Grid>
                <Grid item xs={9}>
                  <Typography
                    variant="h6"
                    sx={{
                      color: " white",
                      flexGrow: 1,
                      textAlign: "center",
                      mr: 10,
                    }}
                  >
                    Bet History
                  </Typography>
                </Grid>
              </Grid>
            </Grid>

            <Box
              ref={containerRef}
              sx={{
                display: "flex",
                overflowX: "auto",
                scrollSnapType: "x mandatory",
                WebkitOverflowScrolling: "touch",
                padding: "15px 0",
                margin: "0 16px",
                gap: "6px",
                scrollbarWidth: "none",
                "-ms-overflow-style": "none",
                "&::-webkit-scrollbar": {
                  display: "none",
                },
                transition: "scroll 0.3s ease-out",
              }}
            >
              {buttons.map((button) => (
                <Box
                  key={button.label}
                  sx={{
                    minWidth: "25%",
                    flex: "0 0 auto",
                    scrollSnapAlign: "start",
                    marginRight: "8px",
                  }}
                >
                  <IconButton
                    onClick={() => handleButtonClick(button.label)}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      justifyContent: "center",
                      width: "100%",
                      backgroundColor:
                        activeButton === button.label ? "#F95959" : "#ffffff",
                      color: activeButton === button.label ? "white" : "black",
                      borderRadius: 1,
                      padding: "2px 0",
                      transition: "background-color 0.3s ease",
                      "&:hover": {
                        backgroundColor:
                          activeButton === button.label ? "#F95959" : "#ffffff",
                      },
                    }}
                  >
                    {activeButton === button.label ? (
                      <img src={button.iconOn} style={{ width: 40 }} />
                    ) : (
                      <img src={button.iconOf} />
                    )}
                    <Typography variant="caption">{button.label}</Typography>
                  </IconButton>
                </Box>
              ))}
            </Box>

            <Box
              sx={{
                padding: "0 16px",
                display: "flex",
                justifyContent: "space-between",
                boxShadow: "none",
              }}
            >
              <Button
                variant="outlined"
                sx={{
                  backgroundColor: "#ffffff",
                  color: "black",
                  borderColor: "#ffffff",
                  borderRadius: 1,
                  padding: "10px 20px",
                  textTransform: "capitalize",
                  justifyContent: "space-between",
                  width: "100%",
                  "&:hover": {
                    backgroundColor:
                      selectedOption === selectedOption ? "#ffffff" : "#ffffff",
                    borderColor:
                      selectedOption === selectedOption ? "#ffffff" : "#ffffff",
                  },
                }}
                onClick={() => handleFilterClick("Game")}
              >
                {selectedOption === "All" ? "All Games" : selectedOption}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
              <Button
                variant="outlined"
                onClick={() => toggleCalendarDrawer("Date")}
                sx={{
                  color: "black",
                  borderColor: "#ffffff",
                  borderRadius: 1,
                  padding: "10px 20px",
                  textTransform: "capitalize",
                  width: "100%",
                  justifyContent: "space-between",
                  marginLeft: "8px",
                  backgroundColor: "#ffffff",
                  "&:hover": {
                    backgroundColor:
                      selectedOption === selectedOption ? "#ffffff" : "#ffffff",
                    borderColor:
                      selectedOption === selectedOption ? "#ffffff" : "#ffffff",
                  },
                }}
              >
                {/* If date is selected, show the month and day only, otherwise show "Select Date" */}
                {selectedDateRange.start && selectedDateRange.end
                  ? `${new Date(selectedDateRange.start).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )} - ${new Date(selectedDateRange.end).toLocaleDateString(
                      "en-US",
                      {
                        month: "short",
                        day: "numeric",
                      }
                    )}`
                  : "Select Date"}
                <KeyboardArrowDownOutlinedIcon />
              </Button>
            </Box>

            {loading ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="calc(100vh - 80px)"
              >
                <CircularProgress />
              </Box>
            ) : error ? (
              <Box
                display="flex"
                alignItems="center"
                justifyContent="center"
                height="calc(100vh - 80px)"
              >
                <Typography color="error">{error}</Typography>
              </Box>
            ) : (
              <Box padding="16px" style={{ boxShadow: "none" }}>
                {bets.length === 0 ? (
                  <Typography>No data available</Typography>
                ) : (
                  bets.map((bet, index) => (
                    <div key={index} className="Card">
                      <div className="card-header">
                        <div className="card-header-left">
                          <Typography
                            variant="h6"
                            fontWeight="bold"
                            textAlign="left"
                          >
                            {bet && bet.gameType
                              ? String(bet.gameType).charAt(0).toUpperCase() +
                                String(bet.gameType).slice(1)
                              : "N/A"}
                          </Typography>
                          <Typography variant="caption" color="textSecondary">
                            {new Date(bet.timestamp).toLocaleString()}
                          </Typography>
                        </div>
                        <div className="card-header-right">
                          <Typography
                            variant="body1"
                            style={{
                              color:
                                bet.status === "Succeed" ? "green" : "#40ad72",
                            }}
                          >
                            {bet.status === "Failed" || bet.status === "lost"
                              ? "Lose"
                              : bet.status}
                          </Typography>
                        </div>
                      </div>

                      <div className="card-content">
                        <div style={{ display: "flex" }}>
                          {/* Progress bar column (LHS) */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              marginRight: "10px",
                              marginTop: "5px",
                            }}
                          >
                            {[...Array(5)].map((_, index) => (
                              <React.Fragment key={index}>
                                <div
                                  style={{
                                    width: "10px",
                                    height: "10px",
                                    borderRadius: "50%",
                                    border: "2px solid green",
                                    backgroundColor: "rgb(8,203,128)",
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "center",
                                  }}
                                ></div>
                                {index < 4 && (
                                  <div
                                    style={{
                                      width: "1px",
                                      flexGrow: 1,
                                      borderLeft: "2px dashed green",
                                      minHeight: "20px",
                                    }}
                                  ></div>
                                )}
                              </React.Fragment>
                            ))}
                          </div>

                          {/* Data column (RHS) */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              gap: "5px",
                              flex: 1,
                            }}
                          >
                            <div
                              className="card-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span className="label">Type</span>
                              <span className="value">
                                {bet && bet.gameType
                                  ? `${
                                      String(bet.gameType)
                                        .charAt(0)
                                        .toUpperCase() +
                                      String(bet.gameType).slice(1)
                                    } 
              ${bet.selectedTimer}${
                                      bet.selectedTimer === "30sec"
                                        ? "ond"
                                        : "ute"
                                    }`
                                  : "N/A"}
                              </span>
                            </div>

                            <div
                              className="card-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span className="label">Period:</span>
                              <span className="value">{bet.periodId}</span>
                            </div>

                            <div
                              className="card-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span className="label">Order number</span>
                              <span className="value">
                                {bet.orderId || "N/A"}
                              </span>
                            </div>

                            <div
                              className="card-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span className="label">Select</span>
                              <span className="value">
                                {typeof selectedItemFilter(bet) === "object"
                                  ? Object.keys(selectedItemFilter(bet)).map(
                                      (section) => (
                                        <div key={section}>
                                          {`${section}: ${
                                            selectedItemFilter(bet)[section]
                                          }`}
                                        </div>
                                      )
                                    )
                                  : selectedItemFilter(bet)}
                              </span>
                            </div>

                            <div
                              className="card-row"
                              style={{
                                display: "flex",
                                justifyContent: "space-between",
                                width: "100%",
                              }}
                            >
                              <span className="label">Total bet</span>
                              <span className="value">
                                ₹
                                {bet.gameType === "5d"
                                  ? bet.totalBet
                                  : bet.betAmount}
                              </span>
                            </div>
                          </div>
                        </div>

                        <img
                          src="https://diuwin.bet/assets/png/moonBar-f80ac733.png"
                          alt="hr"
                          style={{ width: "100%", height: "auto" }}
                        />

                        <div style={{ display: "flex", alignItems: "center" }}>
                          {/* Timeline (left side) */}
                          <div
                            style={{
                              display: "flex",
                              flexDirection: "column",
                              alignItems: "center",
                              marginRight: "10px",
                            }}
                          >
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                border: "2px solid green",
                                backgroundColor: "rgb(8,203,128)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "1px",
                                height: "30px", // Adjust height to match your layout
                                borderLeft: "2px dashed green",
                              }}
                            ></div>
                            <div
                              style={{
                                width: "10px",
                                height: "10px",
                                borderRadius: "50%",
                                border: "2px solid green",
                                backgroundColor: "rgb(8,203,128)",
                                display: "flex",
                                alignItems: "center",
                                justifyContent: "center",
                              }}
                            ></div>
                          </div>

                          {/* Content (right side) */}
                          <div>
                            <div
                              className="lottery-results-heading"
                              style={{
                                textAlign: "left",
                                marginBottom: "10px",
                              }}
                            >
                              Lottery results
                            </div>
                            {bet.gameType === "wingo" && (
                              <div className="lottery-results">
                                <div
                                  className={`result-item 
                                             ${
                                               bet.result == 0
                                                 ? "color-mix-zero"
                                                 : bet.result == 5
                                                 ? "color-mix-five"
                                                 : bet.result % 2 === 0
                                                 ? "color-red"
                                                 : "color-green"
                                             }`}
                                >
                                  {bet.result}
                                </div>
                                <div
                                  className={`result-item ${
                                    bet.result >= 5 ? "big" : "small"
                                  }`}
                                >
                                  {bet.result >= 5 ? "Big" : "Small"}
                                </div>
                              </div>
                            )}

                            {bet.gameType === "k3" && (
                              <div className="lottery-results">
                                <span className="value">
                                  {bet.diceOutcome && bet.diceOutcome.length > 0
                                    ? bet.diceOutcome.map((dice, index) => (
                                        <img
                                          key={index}
                                          src={`../../games/assets/num${dice}-tiranga.png`}
                                          alt={`Dice outcome ${dice}`}
                                          width="20"
                                          height="20"
                                          style={{ margin: "3px" }}
                                        />
                                      ))
                                    : "N/A"}
                                </span>
                              </div>
                            )}
                            {bet.gameType === "5d" && (
                              <div className="lottery-results">
                                <span
                                  className="value"
                                  style={{ display: "flex" }}
                                >
                                  {bet.resultOutcome &&
                                  bet.resultOutcome.sectionOutcome &&
                                  Object.values(
                                    bet.resultOutcome.sectionOutcome
                                  ).length > 0
                                    ? Object.values(
                                        bet.resultOutcome.sectionOutcome
                                      ).map((outcome, index) => (
                                        <div
                                          key={index}
                                          style={{
                                            border: "1px solid black",
                                            borderRadius: "50%",
                                            aspectRatio: "1/1",
                                            padding: "1px",
                                            width: "20px",
                                            textAlign: "center",
                                            margin: "0px 2px",
                                          }}
                                        >
                                          {outcome.number}
                                        </div>
                                      ))
                                    : "N/A"}
                                </span>
                              </div>
                            )}
                            {bet.gameType === "trx" && (
                              <div className="lottery-results">
                                <span className="value">{bet.result}</span>
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="results-grid">
                          <div
                            className="grid-item"
                            style={{ backgroundColor: "rgb(247,247,246)" }}
                          >
                            <div className="value">
                              ₹
                              {bet.gameType === "5d"
                                ? bet.totalBetAfterTax
                                : (
                                    Math.round(bet.totalBet + bet.tax) - bet.tax
                                  ).toFixed(2)}
                            </div>
                            <div className="label">Actual amount</div>
                          </div>
                          <div
                            className="grid-item"
                            style={{ backgroundColor: "rgb(247,247,246)" }}
                          >
                            <div className="value">
                              ₹
                              {bet.status === "Succeed"
                                ? (
                                    parseFloat(bet.winLoss) +
                                    parseFloat(bet.betAmount)
                                  ).toFixed(2)
                                : "0.00"}
                            </div>
                            <div className="label">Winnings</div>
                          </div>
                          <div
                            className="grid-item"
                            style={{ backgroundColor: "rgb(247,247,246)" }}
                          >
                            <div className="value">
                              ₹
                              {bet.gameType === "5d"
                                ? parseFloat(
                                    bet.totalBet - bet.totalBetAfterTax
                                  ).toFixed(2)
                                : parseFloat(bet.tax).toFixed(2)}
                            </div>
                            <div className="label">Handling fee</div>
                          </div>
                          <div
                            className="grid-item"
                            style={{ backgroundColor: "rgb(247,247,246)" }}
                          >
                            <div
                              className="value"
                              style={{
                                color:
                                  bet.status === "Succeed" ? "green" : "red",
                              }}
                            >
                              {bet.status === "Succeed" ? "+" : "-"}₹
                              {isNaN(parseFloat(bet.winLoss))
                                ? "0.00"
                                : Math.abs(parseFloat(bet.winLoss)).toFixed(
                                    2
                                  )}{" "}
                            </div>
                            <div className="label">Profit/loss</div>
                          </div>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </Box>
            )}
          </Box>

          <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleDrawerClose}
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
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                marginBottom: "5px",
                marginTop: "10px",
              }}
            >
              <Button
                onClick={handleDrawerClose}
                sx={{ color: "#000", fontWeight: "normal" }}
              >
                Cancel
              </Button>
              <Button
                onClick={handleConfirm}
                sx={{
                  color: "#4782ff",
                  fontWeight: "bold",
                }}
              >
                Confirm
              </Button>
            </Box>
            <List sx={{ "& .MuiListItem-root": { padding: "5px 0" } }}>
              {filterOptions[activeButton].map((option) => (
                <ListItem
                  button
                  key={option}
                  onClick={() => handleOptionSelect(option)}
                  sx={{
                    color: option === selectedOption ? "#000" : "#888",
                    fontWeight: option === selectedOption ? "bold" : "normal",
                    borderBottom: "1px solid #e0e0e0",
                    textAlign: "center",
                  }}
                >
                  <ListItemText primary={option} />
                </ListItem>
              ))}
            </List>
          </Drawer>

          <CalendarDrawer
            isOpen={calendarDrawerOpen}
            onClose={() => toggleCalendarDrawer(false)}
            onRangeSelect={handleDateRangeSelect}
          />
        </Box>
      </Mobile>
    </div>
  );
};

export default BetHistoryMain;
