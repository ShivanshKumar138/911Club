
import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../Components/Mobile";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import { Checkbox, FormControlLabel, Radio } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import {
  Typography,
  Grid,
  Box,
  TableBody,
  TableCell,
  TableRow,
  TextField,
  Table,
  Accordion,
  AccordionSummary,
  AccordionDetails,
  TableContainer,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import { margin, styled } from "@mui/system";
import NoteIcon from "@mui/icons-material/Note";
import { domain } from "../Components/config";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button } from "@mui/material";
import { ExpandMore as ExpandMoreIcon } from "@mui/icons-material";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import K3popup from "./K3popup"
import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
import MusicOffIcon from "@material-ui/icons/MusicOff";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import {
  Tabs,
  Tab,
  Divider,
  Pagination,
  Card,
  CardHeader,
  CardContent,
} from "@mui/material";
import { Drawer } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import DialogActions from "@mui/material/DialogActions";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";

import "../App.css";
import "./style.css";
import CheckIcon from "@mui/icons-material/Check";
import { Paper } from "@mui/material";
import axios from "axios";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import { wssdomain } from "../Components/config";
import { CheckCircleIcon } from "lucide-react";
import Alert from '@mui/material/Alert';
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 1,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "https://www.66lottery9.com/static/games/time_a.png",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "https://www.66lottery9.com/static/games/time_a.png",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "https://www.66lottery9.com/static/games/time_a.png",
    subtitle: "5Min",
  },
  {
    id: 4,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "https://www.66lottery9.com/static/games/time_a.png",
    subtitle: "10Min",
  },
];

const columns = [
  { id: "period", label: "Period" },
  { id: "sum", label: "Sum" },
  { id: "diceOutcome", label: "Results" },
];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && <Box p={0}>{children}</Box>}
    </div>
  );
};


const CustomPagination = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    color: "#A8A5A1",
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    color: "#A8A5A1",
  },
  "& .MuiPaginationItem-ellipsis": {
    color: "#F95959",
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
  },
  "& .MuiPaginationItem-previousNext": {
    background: "linear-gradient(90deg, #F95959 0%, #F95959 100%)",
    color: "#ffffff",
    padding: "3px",
    width: "auto", // Ensure it doesn't stretch
    height: "auto", // Ensure it doesn't stretch
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiPaginationItem-icon": {
    width: "70px", // Adjust the size to make it square
    height: "40px", // Adjust the size to make it square
  },
});

const CustomTable = ({ data }) => {
  const pageSize = 10;
  const [page, setPage] = useState(0);
  const totalPages = Math.ceil(data.length / pageSize);
  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const paginatedData = data.slice(page * pageSize, (page + 1) * pageSize);

  return (
    <Grid
      container
      direction="column"
      justifyContent="space-evenly"
      borderRadius="25px"
      color="white"
    >
      <Grid
        container
        item
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#F95959"
      >
        {columns.map((column) => (
          <Grid
            item
            xs={column.id === "diceOutcome" ? 2 : 4}
            key={column.id}
            sx={{
              color: "white",
              height: 50,
              fontWeight: "bold",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: "100%",
              borderRadius: "5px",
              fontSize: "1rem",
              bgcolor:"#F95959"
            }}
          >
            {column.label}
          </Grid>
        ))}
      </Grid>
      <Divider />
      <Grid
        container
        direction="row"
        justifyContent="space-evenly"
        backgroundColor="#ffffff"
      >
        {paginatedData.map((row) => (
          <Grid
            container
            item
            direction="row"
            alignItems="center"
            justifyContent="center"
            color="black"
            key={row.id}
            fontSize="0.8rem"
            fontWeight="bold"
            borderBottom="1px solid #ccc"
            padding="8px"
          >
            <Grid item xs={4}>
              {row.periodId}
            </Grid>
            <Grid item xs={1}>
              {row.totalSum}
            </Grid>
            <Grid item xs={2}>
              {row.size}
            </Grid>
            <Grid item xs={2}>
              {row.parity}
            </Grid>
            <Grid item xs={3}>
              <Grid
                container
                direction="row"
                alignItems="center"
                justifyContent="center"
              >
                {row.diceOutcome.map((outcome, index) => {
                  const src = `../../games/assets/num${outcome}-tiranga.png`;
                  // console.log(src);
                  return (
                    <img
                      key={index}
                      src={src}
                      alt={`Dice ${outcome}`}
                      width="20"
                      height="20"
                      style={{ margin: "3px" }}
                    />
                  );
                })}
              </Grid>
            </Grid>
          </Grid>
        ))}
      </Grid>
      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "#ffffff",
          color: "grey",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <CustomPagination
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
        />
      </Grid>
    </Grid>
  );
};

const CustomPage = styled(Pagination)({
  "& .MuiPaginationItem-root": {
    color: "white",
  },
  "& .MuiPaginationItem-page.Mui-selected": {
    color: "white",
  },
  "& .MuiPaginationItem-ellipsis": {
    color: "white",
    backgroundColor: "skyblue",
  },
  "& .MuiPaginationItem-previousNext": {
    backgroundColor: "skyblue",
    color: "white",
    padding: "3px",
    width: "auto", // Ensure it doesn't stretch
    height: "auto", // Ensure it doesn't stretch
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
  "& .MuiPaginationItem-icon": {
    width: "70px", // Adjust the size to make it square
    height: "40px", // Adjust the size to make it square
  },
});

const RowVisualization = ({ data }) => {
  const getOutcomeDescription = (outcome) => {
    const uniqueNumbers = [...new Set(outcome)];
    if (uniqueNumbers.length === 1) {
      return "3 same numbers";
    } else if (uniqueNumbers.length === 2) {
      return "2 same numbers";
    } else if (uniqueNumbers.length === 3) {
      const sortedOutcome = [...outcome].sort();
      if (
        sortedOutcome[2] - sortedOutcome[1] === 1 &&
        sortedOutcome[1] - sortedOutcome[0] === 1
      ) {
        return "3 consecutive numbers";
      } else {
        return "3 different numbers";
      }
    }
  };

  const [page, setPage] = useState(0);
  const rowsPerPage = 10;
  const totalPages = Math.ceil(data.length / rowsPerPage);

  const handleChangePage = (event, newPage) => {
    setPage(newPage - 1);
  };

  const paginatedData = data.slice(
    page * rowsPerPage,
    (page + 1) * rowsPerPage
  );
  return (
    <div
      style={{
        backgroundColor: "#ffffff",
        borderRadius: "10px",
        color: "black",
        padding: "1px",
      }}
    >
      {/* Header Row */}
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          fontWeight: "bold",
          backgroundColor: "#E42B2C",
          color: "white",
          height: "40px",
          alignItems: "center",
          padding: "0 5px",
        }}
      >
        <div style={{ width: "150px", fontSize: "16px" }}>Period</div>
        <div style={{ width: "150px", fontSize: "16px" }}>Results</div>
        <div style={{ width: "200px", fontSize: "16px" }}>Number</div>
      </div>
      {/* Render Data Rows */}
      {paginatedData.map((row) => (
        <div
          key={row.id}
          style={{
            display: "flex",
            flexDirection: "row",
            margin: "20px 0",
            alignItems: "center",
            padding: "0 10px",
          }}
        >
          <div style={{ width: "100px", fontSize: "14px" }}>{row.periodId}</div>
          <div style={{ width: "200px", fontSize: "14px" }}>
            {row.diceOutcome.map((outcome, index) => {
              const src = `../../games/assets/num${outcome}-tiranga.png`;
              return (
                <img
                  key={index}
                  src={src}
                  alt={`Dice ${outcome}`}
                  width="20"
                  height="20"
                  style={{ marginRight: "5px" }}
                />
              );
            })}
          </div>
          <div style={{ width: "200px", fontSize: "13px" }}>
            {getOutcomeDescription(row.diceOutcome)}
          </div>
        </div>
      ))}
      {/* Load More Pagination */}
      <Grid
        item
        xs={12}
        sx={{
          backgroundColor: "#ffffff",
          color: "black",
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          padding: "10px",
        }}
      >
        <CustomPagination
          count={totalPages}
          page={page + 1}
          onChange={handleChangePage}
        />
      </Grid>
    </div>
  );
};

// // Overlay with a dark background
// const Overlay = styled(Box)(({ theme }) => ({
//   position: "absolute",
//   top: 0,
//   left: 0,
//   right: 0,
//   bottom: 0,
//   backgroundColor: "rgba(0, 0, 0, 0.6)", // Slightly darker dark background
//   display: "flex",
//   alignItems: "center",
//   justifyContent: "center",
//   borderRadius: "15px",
//   zIndex: 1000,
// }));

// // Container for digits
// const OverlayContent = styled(Box)(({ theme }) => ({
//   fontSize: "150px", // Larger text size
//   fontWeight: "bold",
//   display: "flex",
//   gap: "10px", // Space between digits
// }));

// // Styled component for individual digits
// const Digit = styled(Box)(({ theme }) => ({
//   backgroundColor: "white", // White background for digits
//   color: "#F95959", // Text color
//   padding: "0 20px",
//   borderRadius: "8px",
//   display: "flex",
//   alignItems: "center", // Center text vertically
//   justifyContent: "center", // Center text horizontally
//   // width: '100px',
//   // height: '100px',
//   textAlign: "center",
// }));

// // Main component rendering the overlay
// const TimerOverlay = ({ overlayContent }) => {
//   // Split the content into individual characters
//   const digits = overlayContent ? overlayContent.split("") : [];

//   return (
//     <Overlay>
//       <OverlayContent>
//         {digits.map((digit, index) => (
//           <Digit key={index}>{digit}</Digit>
//         ))}
//       </OverlayContent>
//     </Overlay>
//   );
// };

const LotteryAppk = ({ timerKey }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Store message here
    const [agree, setAgree] = useState(false);
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("1Min");
  const [selectedItem, setselectedItem] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [timer, setTimer] = useState(60); // 60 seconds = 1 minute
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [winner, setWinner] = useState(null);
  const [betPlaced, setBetPlaced] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [wallet, setWallet] = useState([]);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const navigate = useNavigate();
  const theme = useTheme();
  const [popupQueue, setPopupQueue] = useState([]);
  const [currentBetIndex, setCurrentBetIndex] = useState(0);
  // const [showOverlay, setShowOverlay] = useState(false);
  // const [overlayContent, setOverlayContent] = useState("");
const [isChecked, setIsChecked] = useState(false);
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));

  const handleRefresh = () => {
    // Handle refresh logic
    // fetchUserData();
    setSnackbarMessage("Wallet refreshed"); // Set message
    setSnackbarOpen(true);  // Open snackbar

    setTimeout(() => {
      setSnackbarOpen(false);
    }, 1000)
  };
  
  const handleSnackbarCloser = (event, reason) => {
    if (reason === "clickaway") {
        return;
    }
    setSnackbarOpen(false);
  };

  useEffect(() => {
    if (timerKey) {
      console.log("Timer key received:", timerKey); // Console log the timerKey

      // Map timerKey to corresponding timer details
      const timerMap = {
        "1min": { id: 1, subtitle: "1min" },
        "3min": { id: 2, subtitle: "3min" },
        "5min": { id: 3, subtitle: "5min" },
        "10min": { id: 4, subtitle: "10min" },
      };

      if (timerMap[timerKey]) {
        setActiveId(timerMap[timerKey].id);
        setSelectedTimer(timerMap[timerKey].subtitle);
        navigate(`/k3/${timerKey}`);
      }
    }
  }, [timerKey, navigate]); // Include navigate in the dependency array

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth < 600) {
        setIsSmall(true);
        setIsBig(false);
      } else {
        setIsSmall(false);
        setIsBig(true);
      }
    };
    window.addEventListener("resize", handleResize);
    handleResize(); // Set the initial state
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleDialog = () => {
    setOpen1(!open1);
  };

  useEffect(() => {
    axios
      .get("user-balance", {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem('token')}`,
        },
      })
      .then((response) => {
        setWallet(response.data.walletAmount);
      })
      .catch((error) => {
        console.error("Error fetching Wallet:", error);
        setError("Error fetching Wallet");
      });
  }, []);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}`); // Connect to WebSocket server

    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };

    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setPeriodId(data.timers[selectedTimer].periodId); // Set the periodId
        setRemainingTime(data.timers[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };

    return () => socket.close(); // Cleanup WebSocket connection
  }, [selectedTimer]);

  const handleTimerChange = (id, subtitle) => {
    setActiveId(id);
    const newTimerKey = subtitle.toLowerCase().replace("min", "min");
    setSelectedTimer(subtitle);
    navigate(`/k3/${newTimerKey}`);
  };

  const handleClick = (id) => {
    // Only handle clicks if there's no timerKey prop
    if (!timerKey) {
      let newTimerKey;
      switch (id) {
        case 1:
          newTimerKey = "1min";
          break;
        case 2:
          newTimerKey = "3min";
          break;
        case 3:
          newTimerKey = "5min";
          break;
        case 4:
          newTimerKey = "10min";
          break;
        default:
          newTimerKey = "1min";
      }
      navigate(`/k3/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle);
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to 747 Lottery , where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 747 Lottery . Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on 747 Lottery ",
    "747 Lottery welcomes you here !!",
  ];

  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);

  React.useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 1000); // This should be equal to the exit duration below
    }, 5000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  //   table
  const [value, setValue] = useState(0);

  const tabData = [
    { label: "Game History" },
    { label: "Chart" },
    { label: "My History" },
  ];

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const [drawerOpen, setDrawerOpen] = useState(false);
  const [totalSum, settotalSum] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [bets, setBets] = useState([]);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(1);

  const [betPeriodId, setBetPeriodId] = useState(null);

  const [open, setOpen] = useState(false);
  const [open1, setOpen1] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState("");
// Add this with other state declarations at the top
const [currentHoldAmount, setCurrentHoldAmount] = useState(0);
  const handleClose = () => {
    setBetPlaced(false);
    setOpen(false);
  };
  const handleOpenDrawer = (item) => {
    settotalSum(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(amount);
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };
  const [lastBetPeriodId, setLastBetPeriodId] = useState(null);


// Then modify the handlePlaceBet function to include the check
const handlePlaceBet = async () => {
  // Check if user has already placed a bet for this period
  if (lastBetPeriodId === periodId) {
    setSnackbarMessage("Only one bet allowed per period");
    setSnackbarOpen(true);
    return;
  }

  console.log("handlePlaceBet triggered");
  const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
  const randomString = randomNumber.toString();
  let currentWalletAmount;
  
  try {
    // Fetch user balance and log the response
    const response = await axios.get(`${domain}/user`, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    console.log("Fetched Wallet Response:", response.data);
    currentWalletAmount = response.data.user.walletAmount;
    setWallet(currentWalletAmount);
  } catch (error) {
    console.error("Error fetching Wallet:", error);
    setError("Error fetching wallet balance. Please try again.");
    setOpenSnackbar(true);
    return;
  }
  
  const totalBet = betAmount * multiplier;
  console.log("Total Bet Calculated:", totalBet);
  console.log("Current Wallet Balance:", currentWalletAmount);
  
  // Calculate available balance by subtracting holdAmount
  const availableBalance = user.walletAmount - (user.holdAmount || 0);
  
  // Check if user has enough available balance
  if (availableBalance < totalBet) {
    setSnackbarMessage("Insufficient available balance. Some funds are on hold.");
    setSnackbarOpen(true);
    return;
  }

  const betData = {
    [selectedItem]: totalSum,
    betAmount: betAmount,
    multiplier: multiplier,
    totalBet: totalBet,
    selectedTimer: selectedTimer,
    periodId: periodId,
    selectedItem: selectedItem,
    status: " ",
    winLoss: "",
    userType: accountType,
    orderId: randomString
  };

  try {
    const postResponse = await axios.post(`${domain}/K3betgame`, betData, {
      withCredentials: true,
      headers: {
        Authorization: `Bearer ${sessionStorage.getItem('token')}`,
      },
    });
    console.log(postResponse.data);
    console.log("Bet Placement Response:", postResponse.data);

    // Update the last bet period ID after successful bet placement
    setLastBetPeriodId(periodId);
    
    setBetPlaced(true);
    setBetPeriodId(periodId);
    handleCloseDrawer();
    setError(null);
    setOpenSnackbar(true);
  } catch (error) {
    console.error("Error placing bet:", error);
    if (error.response) {
      console.error("Error data:", error.response.data);
      console.error("Error status:", error.response.status);
      console.error("Error headers:", error.response.headers);
      setError(`Error placing bet: ${error.response.data.message || 'Unknown error occurred'}`);
    } else if (error.request) {
      console.error("Error request:", error.request);
      setError("No response received from server. Please try again.");
    } else {
      console.error("Error message:", error.message);
      setError(`Error placing bet: ${error.message}`);
    }
    setOpenSnackbar(true);
    setDrawerOpen(false);
  }
};

  const handleCancelBet = () => {
    settotalSum("");
    setBetAmount(1);
    setMultiplier(1);
    setTotalBet(1);
    handleCloseDrawer();
  };
  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }

    setOpenSnackbar(false);
  };

  useEffect(() => {
    handleClick(images[0].id);
  }, []);

  // Inside your Head component

  const countdownSound = new Audio("/path/to/sound.mp3"); // Replace with your sound file path
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sdata, setSdata] = useState([]);
  const [sdata1, setSdata1] = useState([]);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [filteredData1, setFilteredData1] = useState([]);
  const [filteredData, setFilteredData] = useState([]);
  const [user, setUser] = useState(null);
  const [winloss, setWinLoss] = useState(0);
  const [popupperiod, setPopupPeriod] = useState(0);
  const [pop, setpop] = useState(0);
  const [popupperiodid, setPopupPeriodId] = useState("");
  const [popupTimer, setPopupTimer] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [accountType,setAccountType] = useState('Normal')

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        setUser(response.data.user);
        setAccountType(response.data.user.accountType);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchAndSortData = async () => {
      try {
        // console.log("Fetching data based on selectedTimer...");
  
        // Fetch the data based on selectedTimer
        const response = await axios.get(`${domain}/k3gameresult`, {
          params: { selectedTimer }, // Pass selectedTimer as a query parameter
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
  
        // console.log("Fetched data:", response.data.results);
  
        // Filter data based on selectedTimer
        const filtered = response.data.results.filter(
          (item) => item.timerName === selectedTimer
        );
  
        // Ensure data is sorted by timestamp in descending order
        const sortedData = filtered.sort((a, b) => b.timestamp - a.timestamp);
        console.log(sortedData)
        // Update states with sorted data
        setSdata(sortedData);
        setSdata1(sortedData); // Assuming sdata1 should be the same as sdata in this context
        setFilteredData(sortedData);
        setFilteredData1(sortedData);
  
        // console.log("Data sorted and state updated:", sortedData);
      } catch (err) {
        console.error("Error fetching or processing data:", err);
      }
    };
  
    fetchAndSortData();
  
    // Set an interval to fetch and process data every 10 seconds
    const intervalId = setInterval(fetchAndSortData, 1000); // 1 seconds
  
    // Cleanup interval on component unmount
    return () => {
      console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, [selectedTimer, domain]); // Depend on selectedTimer and domain

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setPeriodId(data.timers[selectedTimer].periodId); // Set the periodId
        setRemainingTime(data.timers[selectedTimer].remainingTime); // Set the remainingTime
      } else {
        console.error("Unexpected data structure", data);
      }
    };
    return () => socket.close(); // Cleanup WebSocket connection
  }, [selectedTimer]);

  const [res, setRes] = useState([]);

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  // useEffect(() => {
  //   if (["00:05", "00:04", "00:03", "00:02", "00:01"].includes(remainingTime)) {
  //     setOpenDialog(true);
  //     if (isSoundOn && remainingTime !== lastPlayedTime) {
  //       countdownSound.play();
  //       setLastPlayedTime(remainingTime);
  //       setTimeout(() => {
  //         countdownSound.pause();
  //         countdownSound.currentTime = 0;
  //       }, 1000 - countdownSound.duration * 1000);
  //     }
  //   } else if (remainingTime === "00:00") {
  //     setOpenDialog(false);
  //     if (isSoundOn) {
  //       countdownSound.pause();
  //       countdownSound.currentTime = 0;
  //       setLastPlayedTime(null);
  //     }
  //   }
  // }, [remainingTime, isSoundOn]);

  useEffect(() => {
    if (remainingTime >= "00:01" && remainingTime <= "00:05") {
      setDrawerOpen(false)
      setOpenDialog(true);
      if (isSoundOn && remainingTime !== lastPlayedTime) {
        countdownSound.play();
        setLastPlayedTime(remainingTime);
        setTimeout(() => {
          countdownSound.pause();
          countdownSound.currentTime = 0;
        }, 1000 - countdownSound.duration * 1000);
      }
    } else {
      setOpenDialog(false);
      if (isSoundOn) {
        countdownSound.pause();
        countdownSound.currentTime = 0;
        setLastPlayedTime(null);
      }
    }
    // console.log("popupRemaningTime:", popupRemaningTime)
  }, [remainingTime, isSoundOn]);

  useEffect(() => {
    const fetchBets = async () => {
      try {
        // console.log("Fetching K3 bets...");
        const response = await axios.get(`${domain}/user/K3history`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
  
        const filteredBets = response.data.filter(
          (bet) => bet.selectedTimer === selectedTimer
        );
        setBets(filteredBets);
  
        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);
  
        console.log(
          `Current Period ID: ${currentPeriodId}, Last Alerted Period ID: ${previousAlertedPeriodId}`
        );
  
        if (
          currentPeriodId !== previousAlertedPeriodId &&
          currentPeriodId !== "Loading..."
        ) {
          // console.log("Period ID has changed. Processing new bets...");
  
          const newBets = response.data.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              (bet.status === "Failed" || bet.status === "Succeed")
          );
  
          // console.log(
          //   `Found ${newBets.length} new bets for popup queue:`,
          //   newBets
          // );
  
          if (newBets.length > 0) {
            console.log("Adding new bets to popup queue...");
            setPopupQueue((prevQueue) => [...prevQueue, ...newBets]);
            setCurrentBetIndex((prevIndex) =>
              prevIndex === -1 ? 0 : prevIndex
            );
            setLastAlertedPeriodId(currentPeriodId);
          } else {
            // console.log("No new bets to add to the popup queue.");
          }
        } else {
          // console.log(
          //   "No change in period ID or still loading. Skipping popup queue update."
          // );
        }
      } catch (err) {
        console.error("Error fetching K3 bet history:", err);
      }
    };
  
    fetchBets();
    const intervalId = setInterval(fetchBets, 1000);
  
    return () => {
      console.log("Clearing K3 bet fetch interval");
      clearInterval(intervalId);
    };
  }, [periodId, lastAlertedPeriodId, domain]);

  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
      console.log(
        `Processing popup ${currentBetIndex + 1} of ${popupQueue.length}`
      );
      const currentBet = popupQueue[currentBetIndex];

      console.log("Current bet for popup:", currentBet);

      if (currentBet.status === "Failed" || currentBet.status === "Succeed") {
        setOpen(true);
        setPopupPeriod(currentBet.selectedItem);
        setRes(currentBet.diceOutcome);
        setpop(currentBet.selectedItem);
        setPopupPeriodId(String(currentBet.periodId));
        setPopupTimer(currentBet.selectedTimer);

        if (currentBet.status === "Failed") {
          setDialogContent("You lost the bet");
          setGameResult("Failed");
        } else {
          setDialogContent("Congratulations!");
          setGameResult("Succeed");
        }
        setWinLoss(currentBet.winLoss);

        console.log(
          `Displaying popup for bet: ${currentBet.periodId}, Status: ${currentBet.status}`
        );

        const timer = setTimeout(() => {
          // setOpen(false);
          console.log("Closing popup and moving to next");
          setTimeout(() => {
            setCurrentBetIndex((prevIndex) => prevIndex + 1);
          }, 500);
        }, 2500);

        return () => clearTimeout(timer);
      } else {
        // console.log(`Skipping bet with status: ${currentBet.status}`);
        setCurrentBetIndex((prevIndex) => prevIndex + 1);
      }
    } else if (currentBetIndex >= popupQueue.length && popupQueue.length > 0) {
      // console.log("All popups in queue have been displayed. Resetting queue.");
      setPopupQueue([]);
      setCurrentBetIndex(-1);
    } else {
      console.log("No popups to display or invalid index.");
    }
  }, [popupQueue, currentBetIndex]);

  const seconds1 = remainingTime ? remainingTime.split(":")[1] : "00";
  const handleCheckboxChange = (event) => {
    const newCheckedState = event.target.checked;
    setIsChecked(newCheckedState);
    
    // Trigger your function here based on checkbox state
    if (newCheckedState) {
      console.log('Auto-close enabled');
            const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
        }, 2000);
      }, 4000);
      // Your function logic here
    } else {
      console.log('Auto-close disabled');
      // Your alternative function logic here
    }
  };
  // Determine the length of the seconds string
  const length = seconds1.length;

  const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const secondHalf = seconds1.slice(Math.ceil(length / 2));

  const [selectedColor, setSelectedColor] = useState(" RGB(71,129,255)");
  const handleEventSelection = (event) => {
    // ... your existing code ...

    switch (event) {
      case "Total":
        setSelectedColor("#67D99C"); // Half green, half red
        break;
      case "2 same":
        setSelectedColor("#e4b7ff");
        break;
      case "3 same":
        setSelectedColor("#ffafae");
        break;
      case "Different":
        setSelectedColor(" #9B48DB");
        break;
      default:
        setSelectedColor(" RGB(71,129,255)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");
  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };
  const [values, setValues] = useState(0);
  const handleChanges = (event, newValue) => {
    setValues(newValue);
  };

  const navigateToPage = () => {
    navigate("/home"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage1 = () => {
    navigate("/recharge"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage2 = () => {
    navigate("/withdraw"); // Replace '/path-to-page' with the actual path
  };

  const renderTab1Content = () => {
    const redImage = "../../games/assets/redBall-fd34b99e.png";
    const greenImage = "../../games/assets/greenBall-b7685130.png";
    const images = [
      { src: greenImage, label: "3", factor: "207.36X", color: "green" },
      { src: redImage, label: "4", factor: "69.12X", color: "red" },
      { src: greenImage, label: "5", factor: "34.56X", color: "green" },
      { src: redImage, label: "6", factor: "20.74X", color: "red" },
      { src: greenImage, label: "7", factor: "13.83X", color: "green" },
      { src: redImage, label: "8", factor: "9.88X", color: "red" },
      { src: greenImage, label: "9", factor: "8.3X", color: "green" },
      { src: redImage, label: "10", factor: "7.68X", color: "red" },
      { src: greenImage, label: "11", factor: "7.682X", color: "green" },
      { src: redImage, label: "12", factor: "8.3X", color: "red" },
      { src: greenImage, label: "13", factor: "9.88X", color: "green" },
      { src: redImage, label: "14", factor: "13.83X", color: "red" },
      { src: greenImage, label: "15", factor: "20.74X", color: "green" },
      { src: redImage, label: "16", factor: "34.56X", color: "red" },
      { src: greenImage, label: "17", factor: "69.12X", color: "green" },
      { src: redImage, label: "18", factor: "207.36X", color: "red" },
      // ...
    ];

    return (
      <Grid
        container
        spacing={4.5}
        mt={-1}
        sx={{ justifyContent: "center", alignItems: "center" }}
      >
        
        {images.map((image, index) => (
  <Grid 
    item 
    key={index} 
    mt={-3}
    sx={{
      // Make grid items shrink proportionally
      display: 'flex',
      flexDirection: 'column',
      alignItems: 'center',
      justifyContent: 'center',
      // Responsive sizing
      width: { xs: '33%', sm: '25%', md: 'auto' },
      maxWidth: { xs: 70, sm: 100, md: 120 },
      px: { xs: 0.5, sm: 1, md: 2 }
    }}
  >
    <Box
      position="relative"
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: { xs: 40, sm: 50 },
        width: '100%',
        cursor: "pointer",
        transform: 'scale(0.95)',
        transition: 'transform 0.2s',
        '&:hover': {
          transform: 'scale(1.05)',
        }
      }}
      onClick={() => {
        handleOpenDrawer(image.label);
        handleEventSelection("Total");
        setselectedItem("totalSum");
      }}
    >
      <Box
        component="img"
        src={image.color === "green" ? greenImage : redImage}
        alt={`Image ${index + 1}`}
        sx={{
          width: { xs: 40, sm: 50, md: 55 },
          height: { xs: 40, sm: 50, md: 55 },
          objectFit: 'contain',
        }}
      />
      <Box
        sx={{
          position: "absolute",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          color: image.color,
          fontSize: { xs: '1.2rem', sm: '1.3rem', md: '1.5rem' },
          fontWeight: "bold",
        }}
      >
        {image.label}
      </Box>
    </Box>
    <Typography
      variant="body2"
      sx={{
        fontSize: { xs: 10, sm: 12, md: 13 },
        textAlign: "center",
        color: "#927992",
        // Handle text overflow
        width: '100%',
        overflow: 'hidden',
        textOverflow: 'ellipsis',
        whiteSpace: 'nowrap',
      }}
    >
      {image.factor}
    </Typography>
  </Grid>
))}

        <Grid
          container
          ml={3}
          mt={1}
          justifyContent="center"
          alignItems="center"
          spacing={3} // Ensure no additional spacing from Grid container
        >
          {[
            {
              label: "Big",
              multiplier: "1.92X",
              bgColor: "#feaa57",
              height: 50,
              action: "size",
            },
            {
              label: "Small",
              multiplier: "1.92X",
              bgColor: "#6ea8f4",
              height: 50,
              action: "size",
            },
            {
              label: "Odd",
              multiplier: "1.92X",
              bgColor: "#fb5b5b",
              height: 50,
              action: "parity",
            },
            {
              label: "Even",
              multiplier: "1.92X",
              bgColor: "#19b660",
              height: 50,
              action: "parity",
            },
          ].map((item, index) => (
            <Grid
              key={index}
              item
              xs={2}
              sm={3}
              md={3}
              lg={3}
              onClick={() => {
                handleOpenDrawer(item.label);
                handleEventSelection("Total");
                setselectedItem(item.action);
              }}
              style={{
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
                height: item.height,
                backgroundColor: item.bgColor,
                color: "white",
                borderRadius: 4,
                overflow: "hidden", // Prevents content from overflowing
                margin: "3px", // Consistent margin around each item
                padding: "20px" // This applies directly on the grid item if needed
            }}
            >    <Box
            style={{
                padding: "50px", 
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                margin:"30px"
            }}
        >
                 <Typography variant="body1" fontSize={15}>
                {item.label}
              </Typography>
              <Typography variant="body2" style={{ marginTop: 0.5 }}>
                {item.multiplier}
              </Typography>
              </Box>
             
            </Grid>
          ))}
        </Grid>
      </Grid>
    );
  };

  const renderTab2Content = () => {
    const data = [
      {
        label: "2 matching numbers: odds(13.83)",
        values: [
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
        ],
      },
      {
        label: "A pair of unique numbers: odds(69.12)",
        values: [
          [1, 1],
          [2, 2],
          [3, 3],
          [4, 4],
          [5, 5],
          [6, 6],
        ],
      },
      { label: "", values: [1, 2, 3, 4, 5, 6] },
    ];
    return (
      <>
        {data.map((item, index) => (
          <div key={index} sx={{ marginTop: "5px" }}>
            <Typography
              variant="body1"
              color="black"
              align="left"
              fontSize={12}
            >
              {item.label}
            </Typography>
            <Grid container spacing={1} justifyContent="center">
              {item.values.map((value, valueIndex) => (
                <Grid item key={valueIndex}>
                  <Box
                    elevation={3}
                    sx={{
                      bgcolor:
                        index === 0
                          ? "#e4b7ff"
                          : index === 1
                          ? "#ffafae"
                          : "#9ddbb1",
                      p: 1,
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      borderRadius: "4px",
                      minWidth: "34px",
                      color: "#ffffff",
                      marginTop: "5px",
                    }}
                    onClick={() => {
                      handleOpenDrawer(value);
                      handleEventSelection("2 same");
                      setselectedItem("twoSameOneDifferent");
                    }}
                  >
                    <Typography variant="body1">{value}</Typography>
                  </Box>
                </Grid>
              ))}
            </Grid>
          </div>
        ))}
      </>
    );
  };

  const renderTab3Content = () => {
    const data = [
      {
        label: "3 of the same number: odds(207.36)",
        values: [
          [1, 1, 1],
          [2, 2, 2],
          [3, 3, 3],
          [4, 4, 4],
          [5, 5, 5],
          [6, 6, 6],
        ],
      },
      {
        label: "Any 3 of the same number: odds(34.56)",
        value: "Any 3 of the same number: odds",
      },
    ];
    return (
      <>
        {data.map((item, index) => (
          <div key={index} sx={{ mt: 2 }}>
            <Typography
              variant="body1"
              align="left"
              color="black"
              fontSize={12}
            >
              {item.label}
            </Typography>
            {Array.isArray(item.values) ? (
              <Grid container spacing={1} justifyContent="center">
                {item.values.map((value, valueIndex) => (
                  <Grid item key={valueIndex}>
                    <Box
                      elevation={3}
                      sx={{
                        bgcolor: selectedNumbers1.includes(value)
                          ? "#9B48DB"
                          : "#e4b7ff",
                        p: 1,
                        display: "flex",
                        justifyContent: "center",
                        borderRadius: "4px",
                        minWidth: "34px",
                        alignItems: "center",
                        position: "relative",
                        color: selectedNumbers1.includes(value)
                          ? "white"
                          : "#ffffff",
                        marginTop: "5px",
                        marginBottom: "8px",
                      }}
                      onClick={() => {
                        handleOpenDrawer(value);
                        handleEventSelection("3 same");
                        setselectedItem("threeSame");
                      }}
                    >
                      <Typography variant="body1">{value}</Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>
            ) : (
              <Box
                elevation={3}
                sx={{
                  bgcolor: "#ffafae",
                  p: 1,
                  display: "flex",
                  justifyContent: "center",
                  borderRadius: "4px",
                  alignItems: "center",
                  color: "#ffffff",
                  marginTop: "5px",
                }}
                onClick={() => {
                  handleOpenDrawer(item.value);
                  handleEventSelection("3 same");
                  setselectedItem("threeSame");
                }}
              >
                <Typography variant="body1">{item.value}</Typography>
              </Box>
            )}
          </div>
        ))}
      </>
    );
  };

  const renderTab4Content = () => {
    const values = [1, 2, 3, 4, 5, 6];
    return (
      <>
        <Typography
          variant="body1"
          align="left"
          color="black"
          fontSize={12}
          gutterBottom
        >
          3 different numbers: odds(34.56)
        </Typography>
        <Grid container spacing={1}>
          {values.map((value, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  bgcolor: selectedNumbers1.includes(value)
                    ? "#9B48DB"
                    : "#e4b7ff",
                  borderRadius: "4px",
                  p: 1,
                  color: selectedNumbers1.includes(value) ? "black" : "#ffffff",
                  minWidth: "32px",
                  textAlign: "center",
                  position: "relative",
                }}
                onClick={() => handleNumberClick(value)}
              >
                {value}
                {selectedNumbers1.includes(value) && (
                  <CheckIcon
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "#9B48DB",
                      backgroundColor: "white",
                      borderRadius: "50%",
                      fontSize: "12px",
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>

        <Box my={1}>
          <Typography
            variant="body1"
            align="left"
            color="black"
            fontSize={12}
            gutterBottom
          >
            3 continuous numbers: odds(8.64)
          </Typography>
          <Box
            sx={{
              bgcolor: "#ffafae",
              borderRadius: "4px",
              // mt: "2px",
              p: 1,
              textAlign: "center",
              color: "#ffffff",
            }}
            onClick={() => {
              handleOpenDrawer("3 continuous numbers");
              handleEventSelection("Different");
              setselectedItem("threeDifferentNumbers");
            }}
          >
            3 continuous numbers
          </Box>
        </Box>

        <Typography
          variant="body1"
          align="left"
          color="black"
          fontSize={12}
          gutterBottom
        >
          2 different numbers: odds(6.91)
        </Typography>
        <Grid container spacing={1}>
          {values.map((value, index) => (
            <Grid item key={index}>
              <Box
                sx={{
                  bgcolor: selectedNumbers2.includes(value)
                    ? "#9B48DB"
                    : "#e4b7ff",
                  borderRadius: "4px",
                  p: 1,
                  color: selectedNumbers2.includes(value) ? "white" : "#ffffff",
                  minWidth: "32px",
                  textAlign: "center",
                  position: "relative",
                }}
                onClick={() => handleNumberClick2(value)}
              >
                {value}
                {selectedNumbers2.includes(value) && (
                  <CheckIcon
                    sx={{
                      position: "absolute",
                      bottom: 0,
                      right: 0,
                      color: "#9B48DB",
                      backgroundColor: "white",
                      borderRadius: "50%",
                    }}
                  />
                )}
              </Box>
            </Grid>
          ))}
        </Grid>
      </>
    );
  };

  const diceOne = "../../games/assets/num1-tiranga.png";
  const diceTwo = "../../games/assets/num2-tiranga.png";
  const diceThree = "../../games/assets/num3-tiranga.png";
  const diceFour = "../../games/assets/num4-tiranga.png";
  const diceFive = "../../games/assets/num5-tiranga.png";
  const diceSix = "../../games/assets/num6-tiranga.png";

  // Array of dice face images
  const diceImages = [diceOne, diceTwo, diceThree, diceFour, diceFive, diceSix];
  const diceMap={1:diceOne,2:diceTwo,3:diceThree,4:diceFour,5:diceFive,6:diceSix};
  const [rolling, setRolling] = useState(false);
  const [diceFaces, setDiceFaces] = useState([1, 1, 1]);
  const rollInterval = useRef(null);
  const [currentPeriodId, setCurrentPeriodId] = useState(null);

  const rollDice = () => {
    setRolling(true);
    if (rollInterval.current) {
      clearInterval(rollInterval.current);
    }

    rollInterval.current = setInterval(() => {
      setDiceFaces([
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
        Math.ceil(Math.random() * 6),
      ]);
    }, 50);

    setTimeout(() => {
      clearInterval(rollInterval.current);
      const latestData = filteredData[0];
      console.log("Latest dice outcome:", latestData?.diceOutcome);
      if (latestData?.diceOutcome) {
        setDiceFaces(latestData.diceOutcome);
      }
      setRolling(false);
    }, 1000);
  };

  useEffect(() => {
    if (filteredData.length > 0) {
      const latestPeriodId = filteredData[0].periodId;
      if (latestPeriodId !== currentPeriodId) {
        console.log("Period ID changed. New ID:", latestPeriodId);
        setCurrentPeriodId(latestPeriodId);
        rollDice();
      }
    }
  }, [filteredData]);

  useEffect(() => {
    if (remainingTime === "00:01") {
      rollDice();
    }
  }, [remainingTime]);

  const [selectedNumbers1, setSelectedNumbers1] = useState([]);
  const [selectedNumbers2, setSelectedNumbers2] = useState([]);

  const handleNumberClick = (value) => {
    if (selectedNumbers1.length < 3) {
      setSelectedNumbers1([...selectedNumbers1, value]);
    } else {
      handleOpenDrawer(selectedNumbers1.join(""));
      handleEventSelection("Different");
      setselectedItem("threeDifferentNumbers");
      setSelectedNumbers1([]);
    }
  };

  const handleNumberClick2 = (value) => {
    if (selectedNumbers2.length < 2) {
      setSelectedNumbers2([...selectedNumbers2, value]);
    } else {
      handleOpenDrawer(selectedNumbers2.join(""));
      handleEventSelection("Different");
      setselectedItem("threeDifferentNumbers");
      setSelectedNumbers2([]);
    }
  };

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  // const dice = {
  //   1: "/assets/num1-tiranga.png",
  //   2: "/assets/num2-tiranga.png",
  //   3: "/assets/num3-tiranga.png",
  //   4: "/assets/num4-tiranga.png",
  //   5: "/assets/num5-tiranga.png",
  //   6: "/assets/num6-tiranga.png",
  // };

  const dice1 = "../../games/assets/num1-tiranga.png";
  const dice2 = "../../games/assets/num2-tiranga.png";
  const dice3 = "../../games/assets/num3-tiranga.png";
  const dice4 = "../../games/assets/num4-tiranga.png";
  const dice5 = "../../games/assets/num5-tiranga.png";
  const dice6 = "../../games/assets/num6-tiranga.png";

  const diceImg = [dice1, dice2, dice3, dice4, dice5, dice6];

  return (
    <div>
      <Mobile>
        <div style={{ backgroundColor: "#f2f2f1" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 1000,
              background: "#E42B2C",
              padding: "8px 16px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton color="inherit" onClick={navigateToPage}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>

            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/genzwinlogo.png"
                alt="logo"
                style={{ width: "140px", height: "40px" }}
              />
            </Grid>

            <Grid item xs={3} textAlign="right">
              <IconButton color="inherit">
              <SupportAgentIcon onClick={()=>navigate("/service")}/>
              </IconButton>

              <IconButton
                color="inherit"
                onClick={() => setIsSoundOn(!isSoundOn)}
              >
                {isSoundOn ? <MusicNoteIcon /> : <MusicOffIcon />}
              </IconButton>
            </Grid>
          </Grid>

          <Grid
            container
            direction="column"
            sx={{
              height: "300px",
              background: "#E42B2C",
              borderRadius: "0 0 70px 70px",
              textAlign: "center",
            }}
          >
            <Grid
              sx={{
                backgroundImage: `url("../../games/assets/walletbg.png")`,
                backgroundSize: "cover",
                backgroundColor: "#ffffff",
                backgroundPosition: "center",
                margin: "0 20px 20px 20px",
                borderRadius: "30px",
                padding: "10px",
                marginTop: "10px",
              }}
            >
              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <Typography variant="h6" sx={{ fontWeight: "bold" }}>
                  {user ? user.walletAmount.toFixed(2) : " Loading"}
                </Typography>
                <IconButton sx={{ color: "black" }}>
                  <Refresh onClick={handleRefresh} />
                </IconButton>

                   {snackbarOpen && (
                                    <Box
                                        sx={{
                                            position: "fixed",
                                            top: "50%",
                                            left: "50%",
                                            transform: "translate(-50%, -50%)",
                                            zIndex: 1500,
                                            display: "flex",
                                            justifyContent: "center",
                                            alignItems: "center",
                                            width: "100%",
                                            height: "100%"
                                        }}
                                    >
                                         <Alert
                                           severity={snackbarMessage.includes("Failed") ? "error" : "success"}
                                           onClose={handleSnackbarCloser}
                                           sx={{ 
                                               width: "fit-content",
                                               maxWidth: "90%",
                                               padding: "10px 20px",
                                               fontSize: "1rem",
                                               "& .MuiAlert-message": {
                                                   opacity: 1, // Keep message fully opaque
                                                   color: "white"
                                               },
                                               "& .MuiAlert-icon": {
                                                   opacity: 1 // Keep icon fully opaque
                                               },
                                               backgroundColor: "rgba(0, 0, 0, 0.7)" // Only background gets opacity
                                           }}
                                       >
                                           {snackbarMessage}
                                       </Alert>
                                    </Box>
                                )}
              </Grid>

              <Grid
                sm={12}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  color: "black",
                }}
              >
                <AccountBalanceWallet
                  sx={{ marginRight: "10px", color: "#F95959" }}
                />
                <Typography variant="subtitle2">Wallet Balance</Typography>
              </Grid>
              <Grid
                sm={12}
                mt={3}
                item
                sx={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <Button
                  variant="filled"
                  onClick={navigateToPage2}
                  fullWidth
                  sx={{
                    marginLeft: "10px",
                    color: "white",
                    backgroundColor: "#D23838",
                    "&:hover": {
                      backgroundColor: "#D23838",
                    },
                    borderColor: "#D23838",
                    borderRadius: "50px",
                  }}
                >
                  Withdraw
                </Button>
                <Button
                  variant="contained"
                  onClick={navigateToPage1}
                  fullWidth
                  sx={{
                    marginLeft: "10px",
                    backgroundColor: "#F95959",
                    "&:hover": {
                      backgroundColor: "#F95959",
                    },
                    borderRadius: "50px",
                  }}
                >
                  Deposit
                </Button>
              </Grid>
            </Grid>

            <Grid
              item
              sx={{
                backgroundColor: "#ffffff",
                borderRadius: "12px",
                width: "90%",
                padding: "0 5px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                overflow: "hidden",
                margin: "0 20px 20px 20px",
              }}
            >
              <IconButton>
                <VolumeUpIcon sx={{ color: "#F95959" }} />
              </IconButton>

              <Box sx={{ flex: 1, overflow: "hidden", padding: "0 10px" }}>
                <CSSTransition
                  in={inProp}
                  timeout={500}
                  classNames="message"
                  unmountOnExit
                >
                  <Typography
                    sx={{
                      color: "#8c90a6",
                      fontSize: "12.8px",
                      display: "-webkit-box",
                      WebkitBoxOrient: "vertical",
                      textAlign: "left",
                      overflow: "hidden",
                      WebkitLineClamp: 2, // Limits the text to 2 lines
                      lineClamp: 2, // Fallback for non-WebKit browsers
                      textOverflow: "ellipsis", // Adds "..." at the end of overflowed text
                    }}
                  >
                    {textArray[index]}
                  </Typography>
                </CSSTransition>
              </Box>

              <Button
                variant="contained"
                sx={{
                  background: "#E42B2C",
                  "&:hover": {
                    background: "#E42B2C",
                  },
                  borderRadius: "50px",
                  fontSize: "11px",
                  textTransform: "initial",
                  padding: "4px 12px", // Adjust padding for a more balanced look
                  color: "#ffffff",
                }}
              >
                Details
              </Button>
            </Grid>
          </Grid>

          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "-65px",
              backgroundColor: "#ffffff",
              borderRadius: "10px",
              color: "black",
            }}
          >
            {images.map((image) => (
              <Grid
                item
                xs={3}
                key={image.id}
                onClick={() => handleTimerChange(image.id, image.subtitle)}
                style={{
                  cursor: "pointer",
                  background:
                    activeId === image.id
                      ? "linear-gradient(180deg, #FFB2B2 0%, #FFF 90.5%)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center", // Align items horizontally
                  justifyContent: "center", // Align items vertically
                }}
              >
                <img
                  src={activeId === image.id ? image.altSrc : image.src}
                  alt={image.subtitle}
                  style={{ width: "60%" }}
                />
                <div
                  style={{
                    textAlign: "center",
                    color: activeId === image.id ? "black" : "grey",
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                >
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1",
                      margin: 0,
                      padding: 0,
                    }}
                  >
                    K3 Lotre
                  </Typography>
                  <Typography
                    variant="caption"
                    style={{
                      fontSize: "0.75rem",
                      lineHeight: "1.5",
                      marginBottom: "2px",
                    }}
                  >
                    {image.subtitle}
                  </Typography>
                </div>
              </Grid>
            ))}
          </Grid>

          <Box
            mt={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "90%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              p: 1,
              backgroundColor: "#ffffff",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={2}>
                <Typography
                  variant="body1"
                  color="#9DA5A1"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Period
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="outlined"
                  sx={{
                    border: "1px solid #F95959",
                    borderRadius: "15px",
                    padding: "1.5px 17px",
                    fontSize: "0.6rem",
                    textTransform: "initial",
                    display: "inline-flex", // Use inline-flex to align items in a line
                    alignItems: "center", // Center items vertically
                    color: "#F95959",
                  }}
                  startIcon={<NoteIcon />}
                  onClick={handleOpenPopup}
                >
                  How to play
                </Button>
                <K3popup isOpen={isPopupOpen} onClose={handleClosePopup} />
              </Grid>
              <Grid item xs={5} sx={{ paddingLeft: "10px" }}>
                <Typography variant="body5" color="#9DA5A1">
                  Time Remaining
                </Typography>
              </Grid>
            </Grid>
            <Grid container spacing={1} alignItems="center">
              <Grid item xs={8}>
                <Typography
                  variant="h6"
                  sx={{
                    fontWeight: "bold",
                    color: "black",
                    textAlign: "left",
                    pl: "5%",
                  }}
                >
                  {periodId ? periodId : ""}
                </Typography>
              </Grid>
              <Grid item xs={4}>
                <Typography
                  variant="h6"
                  sx={{ display: "flex", alignItems: "center" }}
                >
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "12px",
                      backgroundColor: "#f2f2f1",
                      color: "#F95959",
                      textAlign: "center",
                      fontWeight: "bold",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {minutes[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      marginTop: "8px",
                      backgroundColor: "#f2f2f1",
                      color: "#F95959",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {minutes[1]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#F95959",
                      marginTop: "8px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "20px",
                      margin: "0 2px",
                    }}
                  >
                    :
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#F95959",
                      marginTop: "10px",
                      fontWeight: "bold",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "0 2px",
                    }}
                  >
                    {seconds[0]}
                  </Box>
                  <Box
                    sx={{
                      display: "inline-block",
                      width: "16px",
                      height: "22px",
                      backgroundColor: "#f2f2f1",
                      color: "#F95959",
                      fontWeight: "bold",
                      marginTop: "8px",
                      textAlign: "center",
                      lineHeight: "25px",
                      margin: "2px 2px",
                    }}
                  >
                    {seconds[1]}
                  </Box>
                </Typography>
              </Grid>
            </Grid>

            <>
              <div className="fullbox">
                <div id="leftbox"></div>
                <div className="outerbox">
                  <div className="diebox">
                    <div className="dice-container">
                      {diceFaces.map((face, index) => (
                        <div key={index} className="dice-wrapper">
                          <img
                            src={diceImages[face - 1]}
                            alt={`Dice ${index + 1}`}
                            className={`dice-image ${rolling ? "rolling" : ""}`}
                          />
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
                <div id="rightbox"></div>
              </div>
            </>
            <Box
              mt={1}
              sx={{
                position: "relative",
                pointerEvents: openDialog ? "none" : "auto",
              }}
            >
              <div
                className="overlay"
                style={{
                  backgroundColor: "rgba(0, 0, 0, 0.5)",
                  borderRadius: "20px",
                  position: "absolute",
                  inset: 0,
                  pointerEvents: "none",
                  zIndex: 100,
                  display: openDialog ? "inline-block" : "none",
                  cursor: "not-allowed",
                }}
              ></div>

              <div
                style={{
                  display: "flex",
                  width: "300px",
                  height: "200px",
                  display: openDialog ? "flex" : "none",
                  alignItems: "center",
                  justifyContent: "center",
                  overflow: "hidden",
                  color: "#F95959",
                  fontWeight: "bold",
                  textAlign: "center",
                  position: "absolute",
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)",
                  zIndex: 900,
                }}
              >
                <div style={{ display: "flex", gap: "10px" }}>
                  <p
                    style={{
                      textAlign: "center",
                      paddingLeft: "20px",
                      borderRadius: "20px",
                      fontSize: "130px",
                      paddingRight: "20px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {firstHalf}
                  </p>
                  <p
                    style={{
                      textAlign: "center",
                      paddingLeft: "20px",
                      borderRadius: "20px",
                      fontSize: "130px",
                      paddingRight: "20px",
                      backgroundColor: "#ffffff",
                    }}
                  >
                    {secondHalf}
                  </p>
                </div>
              </div>
              <Box mt={1}>
                <Tabs
                  value={values}
                  onChange={handleChanges}
                  TabIndicatorProps={{ style: { display: "none" } }}
                  variant="fullWidth"
                  style={{
                    marginBottom: "10px",
                    paddingTop: "10px",
                  }}
                >
                  <Tab
                    label="Total"
                    style={{
                      backgroundColor: values === 0 ? "#F95959" : "#f2f2f1",
                      color: values === 0 ? "#ffffff" : "grey",
                      borderBottom: values === 0 ? "none" : "",
                      borderRadius: "5px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                    }}
                  />
                  <Tab
                    label="2 same"
                    style={{
                      backgroundColor: values === 1 ? "#F95959" : "#f2f2f1",
                      color: values === 1 ? "#ffffff" : "grey",
                      borderBottom: values === 1 ? "none" : "",
                      borderRadius: "5px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                    }}
                  />
                  <Tab
                    label="3 same"
                    style={{
                      backgroundColor: values === 2 ? "#F95959" : "#f2f2f1",
                      color: values === 2 ? "#ffffff" : "grey",
                      borderBottom: values === 2 ? "none" : "",
                      borderRadius: "5px",
                      minWidth: "auto",
                      marginRight: "5px",
                      fontSize: "12px", // Space between tabs
                    }}
                  />
                  <Tab
                    label="Different"
                    style={{
                      backgroundColor: values === 3 ? "#F95959" : "#f2f2f1",
                      color: values === 3 ? "#ffffff" : "grey",
                      borderBottom: values === 3 ? "none" : "",
                      borderRadius: "5px",
                      minWidth: "auto",
                      fontSize: "12px",
                    }}
                  />
                </Tabs>
              </Box>
              <Box sx={{ mt: 2 }}>
                {values === 0 && renderTab1Content()}
                {values === 1 && renderTab2Content()}
                {values === 2 && renderTab3Content()}
                {values === 3 && renderTab4Content()}
              </Box>
            </Box>
          </Box>

          {/* <Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
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
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "black",
                backgroundColor: "#ffffff",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  position: "relative",
                  marginBottom: "-5px",
                  height: "90px",
                  color: "black",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "80%",
                    background: selectedColor,
                    clipPath: "polygon(0 0, 100% 0, 100% 75%, 50% 100%, 0 75%)",
                  }}
                >
                  <div style={{ position: "relative", color: "white" }}>
                    <Typography variant="h6">{`K3 ${selectedTimer}`}</Typography>
                    <Typography variant="h6">
                      {selectedItem === "totalSum"
                        ? "Total"
                        : selectedItem === "threeDifferentNumbers"
                        ? "Different"
                        : selectedItem === "twoSameOneDifferent"
                        ? "2 Same"
                        : selectedItem === "size"
                        ? "Total"
                        : selectedItem === "parity"
                        ? "Total"
                        : "3 Same"}
                      : {`${totalSum} is selected`}
                    </Typography>
                  </div>
                </div>
              </Grid>
              <Grid padding={1}>
                <Grid item xs={12}>
                  <Grid container justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: "black", fontSize: "1rem" }}
                    >
                      Balance
                    </Typography>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor:
                          activeBetAmount === 1 ? "#F95959" : "#f2f2f1",
                        color: activeBetAmount === 1 ? "#ffffff" : "black",
                      }}
                      onClick={() => {
                        handleBetAmount(1);
                        setActiveBetAmount(1);
                      }}
                    >
                      {"\u20B9" + "1"}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor:
                          activeBetAmount === 10 ? "#F95959" : "#f2f2f1",
                        color: activeBetAmount === 10 ? "#ffffff" : "black",
                      }}
                      onClick={() => {
                        handleBetAmount(10);
                        setActiveBetAmount(10);
                      }}
                    >
                      {"\u20B9" + "10"}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor:
                          activeBetAmount === 100 ? "#F95959" : "#f2f2f1",
                        color: activeBetAmount === 100 ? "#ffffff" : "black",
                      }}
                      onClick={() => {
                        handleBetAmount(100);
                        setActiveBetAmount(100);
                      }}
                    >
                      {"\u20B9" + "100"}
                    </Button>
                    <Button
                      variant="contained"
                      style={{
                        backgroundColor:
                          activeBetAmount === 1000 ? "#F95959" : "#f2f2f1",
                        color: activeBetAmount === 1000 ? "#ffffff" : "black",
                      }}
                      onClick={() => {
                        handleBetAmount(1000);
                        setActiveBetAmount(1000);
                      }}
                    >
                      {"\u20B9" + "1000"}
                    </Button>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid container>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      align="center"
                      alignItems="center"
                      sx={{ color: "black" }}
                    >
                      <Typography variant="h6" sx={{ fontSize: "1rem" }}>
                        Add your money
                      </Typography>
                      <Grid justifyContent="flex-end">
                        <TextField
                          label="Add Custom Amount"
                          variant="outlined"
                          value={customBetAmount}
                          onChange={handleCustomBetChange}
                          style={{
                            borderRadius: 15,
                            height: 50,
                            backgroundColor: "#f2f2f1",
                            color: "black",
                          }}
                          InputProps={{
                            style: {
                              color: "black",
                              borderRadius: 15,
                              height: 50,
                            },
                          }}
                          InputLabelProps={{
                            style: { color: "black" },
                          }}
                        />
                      </Grid>
                      <Typography
                        variant="h6"
                        sx={{ color: "black", fontSize: "1rem" }}
                      >
                        Quantity
                      </Typography>
                      <div
                        className="button1"
                        onClick={() =>
                          setMultiplier(multiplier > 1 ? multiplier - 1 : 1)
                        }
                        style={{ background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "#ffffff" }}
                      >
                        -
                      </div>

                      <Typography
                        variant="body1"
                        style={{
                          border: "1px solid #F95959",
                          width: "50px",
                          background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)",
                          color: "white",
                        }}
                      >
                        {multiplier}
                      </Typography>
                      <div
                        className="button1"
                        onClick={() => setMultiplier(multiplier + 1)}
                        style={{ background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "#ffffff" }}
                      >
                        +
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} mt={2}>
                  <Grid container justifyContent="flex-end">
                    <div
                      className={`button ${activeButton === 1 ? "active" : ""}`}
                      onClick={() => {
                        handleMultiplier(1);
                        setActiveButton(1);
                      }}
                      style={
                        activeButton === 1
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X1
                    </div>
                    <div
                      className={`button ${activeButton === 5 ? "active" : ""}`}
                      onClick={() => {
                        handleMultiplier(5);
                        setActiveButton(5);
                      }}
                      style={
                        activeButton === 5
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X5
                    </div>
                    <div
                      className={`button ${
                        activeButton === 10 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(10);
                        setActiveButton(10);
                      }}
                      style={
                        activeButton === 10
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X10
                    </div>
                    <div
                      className={`button ${
                        activeButton === 20 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(20);
                        setActiveButton(20);
                      }}
                      style={
                        activeButton === 20
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X20
                    </div>
                    <div
                      className={`button ${
                        activeButton === 50 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(50);
                        setActiveButton(50);
                      }}
                      style={
                        activeButton === 50
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X50
                    </div>
                    <div
                      className={`button ${
                        activeButton === 100 ? "active" : ""
                      }`}
                      onClick={() => {
                        handleMultiplier(100);
                        setActiveButton(100);
                      }}
                      style={
                        activeButton === 100
                          ? { background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "white" }
                          : { backgroundColor: "#f2f2f1", color: "black" }
                      }
                    >
                      X100
                    </div>
                  </Grid>
                </Grid>
              </Grid>

              <Grid item xs={12} mt={2}>
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{ backgroundColor: "#f2f2f1", color: "#817F7C" }}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      style={{ background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)", color: "#ffffff" }}
                      variant="contained"
                    >{`Total Bet: ${betAmount * multiplier}`}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Drawer> */}

<Drawer
            anchor="bottom"
            open={drawerOpen}
            onClose={handleCloseDrawer}
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
            <Grid
              container
              alignItems="center"
              style={{
                position: "relative",
                color: "black",
                backgroundColor: "#ffffff",
              }}
            >
              <Grid
                item
                xs={12}
                align="center"
                style={{
                  position: "relative",
                  marginBottom: "-5px",
                  height: "90px",
                  color: "white",
                  backgroundColor: "#ffffff",
                }}
              >
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    left: 0,
                    width: "100%",
                    height: "70%",
                    background: "#E42B2C",
                    clipPath: "polygon(50.7% 100.3%, 100.1% 61%, 100.1% 0%, 0% 0%, 0.1% 71.3%)",
                  }}
                >
                   <Typography variant="h6">{`K3 ${selectedTimer}`}</Typography>
                   <Typography variant="body1">{`${selectedItem} is selected`}</Typography>
                </div>
                
              </Grid>
              <Grid container padding={1}>
  {/* Balance Section */}
  <Grid item xs={6}>
    <Typography
      variant="h6"
      sx={{
        color: "#666",
        fontSize: "1rem",
        marginTop: "5px",
      }}
    >
      Balance
    </Typography>
  </Grid>

  {/* Bet Amount Buttons */}
  <Grid item xs={6} sx={{ display: "flex", justifyContent: "flex-end" }}>
    <Box sx={{ display: "flex", gap: "5px" }}>
      {[1, 10, 100, 1000].map((amount) => (
        <Button
          key={amount}
          sx={{
            minWidth: "40px",
            height: "25px",
            padding: "2px 4px",
            fontSize: "0.75rem",
            backgroundColor: activeBetAmount === amount ? "orange": "#f2f2f1",
            color: activeBetAmount === amount ? "white" : "#666",
            "&:hover": {
              backgroundColor: activeBetAmount === amount ? "orange" : "#f2f2f1",
            },
          }}
          onClick={() => {
            handleBetAmount(amount);
            setActiveBetAmount(amount);
          }}
        >
          {amount}
        </Button>
      ))}
    </Box>
  </Grid>

  {/* Quantity Section */}
  <Grid item xs={6} mt={2}>
    <Typography
      variant="h6"
      sx={{ color: "#666", fontSize: "1rem" }}
    >
      Quantity
    </Typography>
  </Grid>

  {/* Quantity Controls */}
  <Grid item xs={6} mt={2} sx={{ display: "flex", justifyContent: "flex-end", alignItems: "center" }}>
    <IconButton onClick={() => setMultiplier(multiplier > 1 ? multiplier - 1 : 1)}>
      <RemoveIcon fontSize="small" sx={{ color: "orange", fontSize: 30 }} />
    </IconButton>

    <TextField
      value={multiplier}
      onChange={(e) => {
        const value = e.target.value;
        if (/^\d*$/.test(value)) {
          setMultiplier(value === "" ? "" : Math.max(1, Number(value)));
        }
      }}
      sx={{
        width: "50px",
        textAlign: "center",
        "& .MuiOutlinedInput-root": {
          borderRadius: "4px",
          backgroundColor: "white",
          color: "#666",
          textAlign: "center",
          fontSize: "1rem",
          "& input": {
            textAlign: "center",
            padding: "4px 8px",
          },
        },
      }}
      variant="outlined"
      inputProps={{ min: 1, style: { textAlign: "center" } }}
    />

    <IconButton onClick={() => setMultiplier(multiplier + 1)}>
      <AddIcon fontSize="small" sx={{ color: "orange", fontSize: 30 }} />
    </IconButton>
  </Grid>

  {/* Multiplier Buttons */}
  <Grid item xs={12} mt={2}>
    <Grid container justifyContent="flex-end" sx={{ color: "#666" }}>
      {[1, 5, 10, 20, 50, 100].map((mult) => (
        <div
          key={mult}
          className={`button ${activeButton === mult ? "active" : ""}`}
          onClick={() => {
            handleMultiplier(mult);
            setActiveButton(mult);
          }}
          style={
            activeButton === mult
              ? { backgroundColor: "orange", color: "white" }
              : { backgroundColor: "#f2f2f1", color: "#666" }
          }
        >
          X{mult}
        </div>
      ))}
    </Grid>
  </Grid>
</Grid>


<FormControlLabel
      control={
        <Radio
          checked={agree}
          onChange={() => setAgree(!agree)}
          icon={<RadioButtonUncheckedIcon />}
          checkedIcon={<CheckCircleIcon sx={{ color: "#4caf50" }} />} // Green check when selected
        />
      }
      label="I Agree"
      sx={{ color: "#666", fontSize: "1rem",marginLeft:1}}
    />



              <Grid item xs={12} mt={2}>
                <Grid container justifyContent="space-around" spacing={0}>
                  <Grid item xs={3}>
                    <Button
                      onClick={handleCancelBet}
                      fullWidth
                      style={{ backgroundColor: "#f2f2f1", color: "grey" }}
                      variant="contained"
                    >
                      Cancel
                    </Button>
                  </Grid>
                  <Grid item xs={9}>
                    <Button
                      onClick={handlePlaceBet}
                      fullWidth
                      style={{ background: "orange" }}
                      variant="contained"
                    >{`Total Amount: ${betAmount * multiplier}`}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Drawer>
          <Snackbar
            open={openSnackbar}
            autoHideDuration={1000}
            onClose={handleCloseSnackbar}
            style={{
              position: "fixed",
              top: "50%",
              left: "50%",
              transform: "translate(-50%, -50%)",
            }}
          >
            <MuiAlert
              onClose={handleCloseSnackbar}
              severity="success"
              style={{ backgroundColor: "rgba(0, 0, 0, 0.7)", color: "white" }}
            >
              Bet placed successfully!
            </MuiAlert>
          </Snackbar>

          <Grid mt={1} sx={{ marginBottom: "15%" }}>
            <Box
              sx={{
                width: "100%",
                maxWidth: "95%",
                margin: "0 auto",
              }}
            >
              <Grid container spacing={1} sx={{ mb: 1.5 }}>
                {tabData.map((tab, index) => (
                  <Grid item xs={4} key={index}>
                    <Box
                      onClick={() => setActiveTab(index)}
                      sx={{
                        height: "40px",
                        backgroundColor:
                          activeTab === index ? "#F95959" : "#ffffff",
                        color: activeTab === index ? "#ffffff" : "grey",
                        borderRadius: 1,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        cursor: "pointer",
                        transition: "all 0.3s",
                        "&:hover": {
                          backgroundColor:
                            activeTab === index ? "#F95959" : "#f5f5f5",
                        },
                      }}
                    >
                      <Typography
                        variant="body2"
                        sx={{
                          fontSize: "12px",
                          textTransform: "none",
                          fontWeight: "bold",
                        }}
                      >
                        {tab.label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Box sx={{ mt: 2 }}>
                {activeTab === 0 && (
                  <TabPanel>
                    <CustomTable data={filteredData} />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <RowVisualization data={filteredData1} />
                  </TabPanel>
                )}
                {activeTab === 2 && (
                  <TabPanel>
                    <Grid container sx={{ justifyContent: "center" }}>
                      {bets
                        .slice()
                        .sort((a, b) =>
                          b.timestamp && a.timestamp
                            ? b.timestamp.seconds - a.timestamp.seconds
                            : -1
                        )
                        .map((bet, index) => (
                          <Accordion
                            key={index}
                            sx={{
                              backgroundColor: "#ffffff",
                              width: "100%",
                            }}
                          >
                            <AccordionSummary
                              aria-controls={`panel${index}-content`}
                              id={`panel${index}-header`}
                              sx={{
                                flexDirection: "row",
                                padding: 0,
                                "& .MuiAccordionSummary-content": {
                                  margin: 0,
                                },
                              }}
                            >
                              <Box
                                sx={{
                                  width: "100%",
                                  p: 1,
                                  display: "flex",
                                  justifyContent: "space-between",
                                  alignItems: "center",
                                  mb: 1,
                                }}
                              >
                                <Box
                                  sx={{ display: "flex", alignItems: "center" }}
                                >
                                  <Box
                                    sx={{
                                      width: 40,
                                      height: 40,
                                      borderRadius: "15%",
                                      backgroundColor: (() => {
                                        const item = bet.selectedItem;
                                        if (
                                          [3, 5, 7, 9, 11, 13, 15, 17].includes(
                                            item
                                          )
                                        )
                                          return "green";
                                        if (
                                          [
                                            4, 6, 8, 10, 12, 14, 16, 18,
                                          ].includes(item)
                                        )
                                          return "green";
                                        if (item === "Big") return "#feaa57";
                                        if (item === "Small") return "#6ea8f4";
                                        if (item === "Odd") return "#fb5b5b";
                                        if (item === "Even") return "#19b660";
                                        return "#F95959"; // Default color if none of the conditions match
                                      })(),
                                      display: "flex",
                                      justifyContent: "center",
                                      alignItems: "center",
                                      mr: 2,
                                    }}
                                  >
                                    <Typography
                                      variant="body5"
                                      sx={{
                                        color: "white",
                                        fontSize: "0.6rem",
                                        textTransform: "initial",
                                      }}
                                    >
                                      {bet.selectedItem === "totalSum"
                                        ? "Total"
                                        : bet.selectedItem ===
                                          "threeDifferentNumbers"
                                        ? "Diff"
                                        : bet.selectedItem ===
                                          "twoSameOneDifferent"
                                        ? "2 Same"
                                        : bet.selectedItem === "size"
                                        ? bet[bet.selectedItem] === "Big"
                                          ? "Big"
                                          : "Small"
                                        : bet.selectedItem === "parity"
                                        ? bet[bet.selectedItem] === "Odd"
                                          ? "Odd"
                                          : "Even"
                                        : "3 Same"}
                                    </Typography>
                                  </Box>

                                  <Box>
                                    <Typography
                                      sx={{
                                        fontSize: "1rem",
                                        color: "black",
                                      }}
                                    >
                                      {String(bet.periodId)}
                                    </Typography>
                                    <Typography
                                      sx={{
                                        color: "text.secondary",
                                        fontSize: "0.75rem",
                                      }}
                                    >
                                      {bet.timestamp
                                        ? new Date(
                                            bet.timestamp
                                          ).toLocaleString("en-GB", {
                                            year: "numeric",
                                            month: "2-digit",
                                            day: "2-digit",
                                            hour: "2-digit",
                                            minute: "2-digit",
                                            second: "2-digit",
                                          })
                                        : "N/A"}
                                    </Typography>
                                  </Box>
                                </Box>
                                <Box sx={{ textAlign: "right" }}>
                                  <Box
                                    sx={{
                                      border: 1,
                                      borderColor:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : bet.status === "Succeed"
                                          ? "success.main"
                                          : "text.primary",
                                      borderRadius: 1,
                                      pt: 0.1,
                                      pb: 0.1,
                                      pl: 1,
                                      pr: 1,
                                      display: "inline-block",
                                      mb: 0.5,
                                    }}
                                  >
                                    <Typography
                                      variant="caption"
                                      sx={{
                                        color:
                                          bet.status === "Pending"
                                            ? "orange" // Color for Pending status
                                            : bet.winLoss >= 0
                                            ? "green"
                                            : "red",
                                      }}
                                    >
                                      {bet.status==="Failed"||bet.status==="Succeed" ?bet.status:"Pending"}
                                    </Typography>
                                  </Box>
                                  {bet.status !== "Pending" && (
                                    <Typography
                                      variant="body2"
                                      sx={{
                                        color:
                                          bet.winLoss >= 0
                                            ? "success.main"
                                            : "error.main",
                                        fontWeight: "bold",
                                      }}
                                    >
                                   {bet.status === "Failed"
                                      ? `-₹${Math.abs(bet.winLoss)}`
                                      : bet.status === "Succeed"
                                      ? `+₹${bet.winLoss}`:""}
                                    </Typography>
                                  )}
                                </Box>
                              </Box>
                            </AccordionSummary>
                            <AccordionDetails sx={{ p: 0 }}>
                              <Typography
                                sx={{
                                  fontWeight: "bold",
                                  mb: 1,
                                  textAlign: "left",
                                  marginLeft: 2,
                                }}
                              >
                                Details
                              </Typography>
                              <TableContainer>
                                <Table size="small">
                                  <TableBody sx>
                                    {[
                                      {
                                        label: "Order number",
                                        value: `${bet.orderId}`,
                                      },
                                      { label: "Period", value: bet.periodId },
                                      {
                                        label: "Purchase amount",
                                        value: `₹${bet.betAmount.toFixed(2)}`,
                                      },
                                      {
                                        label: "Quantity",
                                        value: bet.multiplier,
                                      },
                                      {
                                        label: "Amount after tax",
                                        value: `₹${(
                                          bet.totalBet - bet.tax
                                        ).toFixed(2)}`,
                                        color: "red", // Specify color for this value
                                      },
                                      {
                                        label: "Tax",
                                        value: `₹${bet.tax.toFixed(2)}`,
                                      },
                                      {
                                        label: "Result",
                                        value: Array.isArray(
                                          bet.diceOutcome
                                        ) ? (
                                          bet.diceOutcome.map(
                                            (outcome, index) => (
                                              <img
                                                key={index}
                                                src={diceImg[outcome - 1]} // Use the correct index based on the dice outcome
                                                alt={`Dice ${outcome}`}
                                                style={{
                                                  width: 30,
                                                  height: 30,
                                                  margin: "0 2px",
                                                }}
                                              />
                                            )
                                          )
                                        ) : (
                                          <img
                                            src={diceImg[bet.diceOutcome - 1]} // Also use the correct index here
                                            alt={`Dice ${bet.diceOutcome}`}
                                            style={{ width: 30, height: 30 }}
                                          />
                                        ),
                                      },

                                      {
                                        label: "Select",
                                        value: `${
                                          bet.selectedItem === "totalSum"
                                            ? "Total"
                                            : bet.selectedItem ===
                                              "threeDifferentNumbers"
                                            ? "Diff"
                                            : bet.selectedItem ===
                                              "twoSameOneDifferent"
                                            ? "2 Same"
                                            : bet.selectedItem === "size"
                                            ? "Total"
                                            : bet.selectedItem === "parity"
                                            ? "Total"
                                            : "3 Same"
                                        }: ${
                                          Array.isArray(bet[bet.selectedItem])
                                            ? bet[bet.selectedItem].join(", ")
                                            : bet[bet.selectedItem]
                                        }`,
                                      },
                                      {
                                        label: "Status",
                                        value: (
                                          <Typography
                                            variant="body1"
                                            style={{
                                              color:
                                                bet.winLoss > 0
                                                  ? "green"
                                                  : "red",
                                            }}
                                          >
                                            {bet.status}
                                          </Typography>
                                        ),
                                      },
                                      {
                                        label: "Win/lose",
                                        value:
                                          bet.winLoss > 0
                                            ? `+₹${bet.winLoss}`
                                            : `₹${bet.winLoss}`,
                                      },
                                      {
                                        label: "Order time",
                                        value: bet.timestamp
                                          ? new Date(
                                              bet.timestamp
                                            ).toLocaleString("en-GB", {
                                              year: "numeric",
                                              month: "2-digit",
                                              day: "2-digit",
                                              hour: "2-digit",
                                              minute: "2-digit",
                                              second: "2-digit",
                                            })
                                          : "N/A",
                                      },
                                    ].map((row, index) => (
                                      <TableRow
                                        key={index}
                                        sx={{ border: "0.4rem solid #ffffff" }}
                                      >
                                        <TableCell
                                          component="th"
                                          scope="row"
                                          sx={{
                                            color: "text.secondary",
                                            border: "none",
                                            backgroundColor: "#f6f6f6",
                                            py: 0.5,
                                          }}
                                        >
                                          {row.label}
                                        </TableCell>
                                        <TableCell
                                          align="right"
                                          sx={{
                                            border: "none",
                                            backgroundColor: "#f6f6f6",
                                            py: 0.5,
                                          }}
                                        >
                                          <Typography
                                            sx={{
                                              color:
                                                row.label === "Amount after tax"
                                                  ? "red"
                                                  : row.label === "Win/lose"
                                                  ? Number(
                                                      row.value.replace(
                                                        /[^0-9.-]+/g,
                                                        ""
                                                      )
                                                    ) >= 0
                                                    ? "green"
                                                    : "red"
                                                  : "text.primary", // Apply color based on the condition or default to primary text color
                                            }}
                                          >
                                            {row.value}
                                          </Typography>
                                        </TableCell>
                                      </TableRow>
                                    ))}
                                  </TableBody>
                                </Table>
                              </TableContainer>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Grid>
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>
          <>{/* ...rest of the code... */}</>

          {/* <div
            style={{
              display: open ? "block" : "none",
              position: "absolute", // changed from fixed to absolute
              zIndex: 1,
              left: isSmall ? 20 : 10,
              top: "120px",
              width: isSmall ? "90%" : "95%",
              height: isSmall ? "98%" : "95%",
              overflow: "auto",
              border: "none",
            }}
          >
            <div
              style={{
                backgroundColor: "transparent",
                margin: "15% auto",
                width: "75%",
                height: "62%",
                backgroundImage: `url(${
                  gameResult === "Failed"
                    ? "../../assets/images/missningLBg-73e02111.png"
                    : "../../assets/images/missningBg-6f17b242.png"
                })`,
                backgroundSize: "100% 100%",
                backgroundRepeat: "no-repeat",
                backgroundPosition: "center",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                justifyContent: "center",
                alignItems: "center",
              }}
            >
              <Typography
                variant="h4"
                style={{
                  textAlign: "center",
                  fontWeight: "bold",
                  position: "absolute",
                  marginTop: "-100px",
                  color: "white",
                }}
              >
                {gameResult === "Failed" ? "Sorry" : "Congratulations"}
              </Typography>
              <br />
              <Typography
                variant="h6"
                style={{
                  textAlign: "center",
                  position: "absolute",
                  marginTop: "-30px",
                  color: "white",
                }}
              >
                Lottery results {Array.isArray(res) ? res.join(", ") : res}
              </Typography>

              <Typography
                sx={{
                  marginTop: "150px",
                  marginLeft: "50px",
                  marginRight: "50px",
                  fontWeight: "bold",
                }}
                variant="h6"
                color="text.secondary"
              >
                {dialogContent}
                <br />
                <span
                  style={{ color: gameResult === "Failed" ? "red" : "green" }}
                >
                  ₹{winloss}
                </span>
                <br />
                <span style={{ fontSize: "14px" }}>
                  Period: {popupperiodid}
                </span>
              </Typography>

              <Button
                sx={{
                  marginTop: isSmall ? "350px" : "370px",
                  marginLeft: "50px",
                  marginRight: "50px",
                  position: "absolute",
                }}
                onClick={() => setOpen(false)}
              >
                Close
              </Button>
            </div>
          </div> */}


<div
  style={{
    display: open ? "flex" : "none",
    position: "fixed",
    zIndex: 2000,
    left: 0,
    top: 0,
    width: "100%",
    height: "100%",
    overflow: "auto",
    border: "none",
    backgroundColor: "rgba(59, 53, 53, 0.6)", // Backdrop effect
    // display: "flex",
    justifyContent: "center",
    alignItems: "center", // Centers vertically in the viewport
  }}
>
  <div
    style={{
      position: "relative",
      width: "min(90%, 400px)", // More width on smaller screens with reasonable max
      height: "min(80vh, 400px)", // Set a minimum height that works on all screens
      aspectRatio: "6/3", // Maintain aspect ratio
      backgroundImage: `url(${
        gameResult === "Succeed"
          ? "../../assets/images/missningBg-6f17b242.png"
          : "../../assets/images/missningLBg-73e02111.png"
      })`,
      backgroundSize: "contain",
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      display: "flex",
      flexDirection: "column",
      justifyContent: "center",
      alignItems: "center",
      padding: "2%",
      maxHeight: "100vh", // Prevent overflow on very small screens
    }}
  >
    {/* Main Title */}
    <Typography
      variant="h5"
      style={{
        color: gameResult === "Succeed" ? "red" : "rgb(104,136,176)",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "clamp(14px, 3vw, 20px)", // Responsive font size
        marginTop: "110px",
        marginBottom: "0"
      }}
    >
      {gameResult === "Succeed" ? "Congratulations" : "Sorry"}
    </Typography>

    {/* Lottery Results Section */}
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: "clamp(1px, 0.2vw, 2px)",
        marginTop: "0px",
      }}
    >
      {/* Dice Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(4px, 0.8vw, 8px)",
          padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px)",
        }}
      >
        {filteredData1[0]?.diceOutcome.map((num) => (
          <div
            key={num}
            style={{
              width: "clamp(20px, 4vw, 30px)",
              height: "clamp(20px, 4vw, 30px)",
              backgroundColor: "transparent",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
            }}
          >
            <img src={diceMap[num]} style={{ width: "clamp(12px, 2.4vw, 20px)" }} />
          </div>
        ))}
      </div>

      {/* "Red 8 Big" Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(4px, 0.8vw, 8px)",
          padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px)",
        }}
      >
        {/* "Red" Tag */}
        <div
          style={{
            background: "transparent",
            border: "2px solid white",
            padding: "clamp(2px, 0.8vw, 4px) clamp(6px, 1.2vw, 12px)",
            borderRadius: "20px",
            color: "#fff",
            fontWeight: "normal",
            fontSize: "clamp(8px, 1.6vw, 10px)",
            textAlign: "center",
            minWidth: "20px",
          }}
        >
          {filteredData1[0]?.parity}
        </div>

        {/* Number Circle */}
        <div
          style={{
            background: "transparent",
            border: "2px solid white",
            padding: "clamp(1px, 0.4vw, 2px) clamp(3.5px, 0.7vw, 7px)",
            borderRadius: "50%",
            color: "#fff",
            fontWeight: "normal",
            fontSize: "clamp(10px, 2vw, 14px)",
            textAlign: "center",
            minWidth: "5px",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            width: "clamp(20px, 4vw, 28px)",
            height: "clamp(20px, 4vw, 28px)",
          }}
        >
          {filteredData1[0]?.totalSum}
        </div>

        {/* "Big" Tag */}
        <div
          style={{
            background: "transparent",
            border: "2px solid white",
            padding: "clamp(2px, 0.8vw, 4px) clamp(6px, 1.2vw, 12px)",
            borderRadius: "20px",
            color: "#fff",
            fontWeight: "normal",
            fontSize: "clamp(8px, 1.6vw, 10px)",
            textAlign: "center",
            minWidth: "20px",
          }}
        >
          {filteredData1[0]?.size}
        </div>
      </div>
    </div>

    {/* Bonus/Lose Section */}
    <div
      style={{
        marginTop: "clamp(20px, 4vw, 40px)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h7"
        style={{
          color: gameResult === "Succeed" ? "#28a745" : "rgb(153, 158, 165)",
          fontWeight: "bold",
          fontSize: "clamp(14px, 2.8vw, 18px)",
          marginTop:"-5px"
        }}
      >
        {gameResult === "Succeed" ? "Bonus" : "Lose"}
      </Typography>

      <Typography
        variant="h7"
        style={{
          color: gameResult === "Succeed" ? "#28a745" : "#dc3545",
          fontWeight: "bold",
          fontSize: "clamp(14px, 2.8vw, 18px)",
          margin: "0px 0",
          display: "block",
        }}
      >
        ₹{parseFloat(winloss).toFixed(2)}
      </Typography>

      <Typography
        variant="body2"
        style={{
          fontSize: "clamp(10px, 2vw, 12px)",
          fontWeight: "normal",
          marginTop: "5px",
        }}
      >
        Period: {popupTimer} {popupperiodid}
      </Typography>
    </div>

    {/* Checkbox Section */}
    <div
      style={{
        backgroundColor: "transparent",
        color: "white",
        marginTop: "clamp(10px, 2vw, 20px)",
        display: "flex",
        alignItems: "center",
        gap: "6px",
        padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px)",
      }}
    >
      <Checkbox
        checked={isChecked}
        onChange={handleCheckboxChange}
        size="small"
        sx={{
          color: "#fff",
          "&.Mui-checked": {
            color: "#fff",
          },
          "& .MuiSvgIcon-root": {
            fontSize: "clamp(16px, 3.2vw, 20px)",
          },
        }}
      />
      <Typography
        variant="body2"
        style={{
          fontSize: "clamp(8px, 1.6vw, 10px)",
          fontWeight: "bold",
          color: "#ffffff",
        }}
      >
        Auto close in 3 sec
      </Typography>
    </div>
  </div>

  {/* Close button - centered below the modal */}

  <Button
    onClick={() => setOpen(false)}
    style={{
      position: "absolute",
      backgroundColor: "black",
      color: "white",
      padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px)",
      fontSize: "clamp(12px, 2.4vw, 16px)",
      opacity: "0.2",
      borderRadius: "70px",
      bottom: "calc(50% - min(40vh, 200px) - 50px)", // Position below the modal
      zIndex: 2001,
    }}
  >
    <CloseIcon style={{ fontSize: "clamp(16px, 3.2vw, 24px)" }} />
  </Button>
</div>
        </div>
        <br />
        <br />
        <br />
      </Mobile>
    </div>
  );
};

export default LotteryAppk;
//updated k3
//updated order id 
