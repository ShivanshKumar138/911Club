

import React, { useState, useEffect, useRef } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../Components/Mobile";
import CloseIcon from "@mui/icons-material/Close";
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import { FormControlLabel, Radio,Checkbox  } from "@mui/material";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { CheckCircleIcon } from "lucide-react";
import {
  Typography,
  Grid,
  Box,
  TextField,
  Paper,
  Button,
  Drawer,
  Tabs,
  Tab,
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
  Avatar,
} from "@mui/material";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
import NoteIcon from "@mui/icons-material/Note";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import "../App.css";
import axios from "axios";
import "./spinner.css";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import GameHistory from "./GameHistory";
import Chart5D from "./Chart5D";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ButtonGroup, styled } from "@mui/material";
import { domain } from "../Components/config";
import { wssdomain } from "../Components/config";
import MusicOffIcon from "@material-ui/icons/MusicOff";
import Htp from "./Htp";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
import Alert from '@mui/material/Alert';
// import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
// import AddIcon from "@mui/icons-material/AddBox";
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

const tabData = [
  { label: "Game History" },
  { label: "Chart" },
  { label: "My History" },
];

const TabPanel = ({ children, value, index }) => {
  return (
    <div hidden={value !== index}>
      {value === index && (
        <Box p={0} m={0}>
          {children}
        </Box>
      )}
    </div>
  );
};

const box = [];
const TopButton = styled(Tab)(({ theme, selected, index }) => ({
  minWidth: selected ? "52px" : "auto",
  padding: index === box.length - 1 ? "4px 6px" : "4px 16px",
  fontWeight: "bold",
  fontSize: "16px", // Default font size for larger screens
  color: selected ? "white !important" : "black !important",

  backgroundColor: selected ? "#F95959" : "grey",
  borderRadius: "10px 10px 0px 0px",
  margin: "0 2.5px",

  // Font size adjustment for screens smaller than 380px
  "@media (max-width: 380px)": {
    fontSize: "12px", // Decrease font size for small screens
    padding: "4px 14px",
  },
}));

const ResultCircle = styled(Box)({
  width: "30px",
  height: "30px",
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  boxShadow: "none",
  backgroundColor: "#f6f6f6",
  color: "black",
  fontSize: "1rem",
});

const SumCircle = styled(Box)({
  width: 35,
  height: 35,
  borderRadius: "50%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  background: "linear-gradient(90deg, #F95959 0%,#F95959 100%)",
  color: "#ffffff",
});

const data = [
  { number: 0, rate: 9 },
  { number: 1, rate: 9 },
  { number: 2, rate: 9 },
  { number: 3, rate: 9 },
  { number: 4, rate: 9 },
  { number: 5, rate: 9 },
  { number: 6, rate: 9 },
  { number: 7, rate: 9 },
  { number: 8, rate: 9 },
  { number: 9, rate: 9 },
];

const results = [
  { number: 3, letter: "A" },
  { number: 9, letter: "B" },
  { number: 6, letter: "C" },
  { number: 7, letter: "D" },
  { number: 4, letter: "E" },
];

const tabLabels = ["Big 1.98", "Small 1.98", "Odd 1.98", "Even 1.98"];

const FiveD = ({ timerKey }) => {
  const [snackbarOpen, setSnackbarOpen] = useState(false);
    const [snackbarMessage, setSnackbarMessage] = useState(""); // Store message here
    
  const [activeId, setActiveId] = useState(images[0].id);
  const [selectedTimer, setSelectedTimer] = useState("1Min");
  const [rows, setRows] = useState([]);
  const [openDialog, setOpenDialog] = useState(false);
  const [periodId, setPeriodId] = useState(null);
  const [remainingTime, setRemainingTime] = useState(null);
  const [user, setUser] = useState(null);
  const [index, setIndex] = React.useState(0);
  const [inProp, setInProp] = React.useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [selectedItem, setSelectedItem] = useState("");
  const [betAmount, setBetAmount] = useState(1);
  const [multiplier, setMultiplier] = useState(1);
  const [totalBet, setTotalBet] = useState(0);
  const [betPlaced, setBetPlaced] = useState(false);
  const [betPeriodId, setBetPeriodId] = useState(null);
  const [lastAlertedPeriodId, setLastAlertedPeriodId] = useState(null);
  const [open, setOpen] = useState(false);
  const [dialogContent, setDialogContent] = useState("");
  const [gameResult, setGameResult] = useState("");
  const [value, setValue] = useState(0);
  const [statisticsData, setStatisticsData] = useState([]);
  const [bets, setBets] = useState([]);
  const [selectedColor, setSelectedColor] = useState("#F95959");
  const [winloss, setWinLoss] = useState(0);
  const [popupperiod, setPopupPeriod] = useState(0);
  const [popupresult, setPopupResult] = useState(0);
  const [popupperiodid, setPopupPeriodId] = useState(0);
  const [popupTimer, setPopupTimer] = useState(0);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [activeTab, setActiveTab] = useState(0);
  const [isPopupOpen, setIsPopupOpen] = useState(false);
  const [isSmall, setIsSmall] = useState(false);
  const [isBig, setIsBig] = useState(true);
  const theme = useTheme();
  const isSmallScreen = useMediaQuery(theme.breakpoints.down("sm"));
  const [popupQueue, setPopupQueue] = useState([]); // new queue to manage sequential popups
  const [currentBetIndex, setCurrentBetIndex] = useState(0); // tracks current popup being shown
  const [tabValue, setTabValue] = React.useState(0);
  const [selectedValue, setSelectedValue] = useState(0);
  const [finalReels, setFinalReels] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [bettedPeriods, setBettedPeriods] = useState(new Set());
  const [reels, setReels] = useState([0, 0, 0, 0, 0]);
  const [manualOutcome, setManualOutcome] = useState([0, 0, 0, 0, 0]);
  const [results, setResults] = useState([]);
  const [sum, setSum] = useState(0);
  const [numberArray, setNumberArray] = useState([]);
  const [manualOutcomes, setManualOutcomes] = useState([]);
  const [activeTopButton, setActiveTopButton] = useState(0);
  const reelsRef = useRef([]);
  const [selectedNumbers, setSelectedNumbers] = useState([]);
  const [activeButton, setActiveButton] = useState(1);
  const [activeTopCategory, setActiveTopCategory] = useState("A");
  const [drawerSelectedIndex, setDrawerSelectedIndex] = useState(null); // To track the selected index inside the drawer
  const [selectedElement, setSelectedElement] = useState(null);
  const [accountType,setAccountType] = useState('Normal');
  const [isChecked, setIsChecked] = useState(false);

  const calculateTotalBet = () =>
    betAmount *
    multiplier *
    (data.reduce(
      (sum, item) =>
        selectedNumbers.includes(item.number) ? sum + item.number : sum,
      0
    ) || 1);
  useEffect(() => {
    if (selectedCategory || selectedNumbers.length > 0) {
      setActiveBetAmount(1);
      setBetAmount(1);
    }
  }, [selectedCategory, selectedNumbers]);

  const handleButtonClick = (event, newValue) => {
    setActiveTopButton(newValue);
    setActiveTopCategory(["A", "B", "C", "D", "E", "SUM"][newValue]);
  };

  const handleCategorySelection = (label, index) => {
    if (typeof label === "string") {
      // Existing logic for category labels
      if (selectedCategory === label) {
        setSelectedCategory(null);
        handleEventSelection(label.toLowerCase().split(" ")[0]);
      } else {
        setSelectedCategory(label);
        setSelectedNumbers([]);
        handleEventSelection(label.toLowerCase());
      }
    } else {
      // New logic for number selections
      setSelectedCategory(null);
      handleEventSelection("number");
    }
    console.log("Selected index:", index);
  };

  const handleNumberSelect = (number) => {
    // If a category is selected, deselect it when a number is selected
    if (selectedCategory !== null) {
      setSelectedCategory(null);
    }

    // Handle number selection/deselection
    if (selectedNumbers.includes(number)) {
      setSelectedNumbers(selectedNumbers.filter((n) => n !== number));
    } else {
      setSelectedNumbers([...selectedNumbers, number]);
    }
  };
  const initializeReels = () => {
    setReels([0, 0, 0, 0, 0]); // Initialize all reels to 0
  };

  // Function to spin the reels
  const startSpin = () => {
    reelsRef.current.forEach((reel, index) => {
      // Start animation
      reel.style.animation = `2.5s spin 1s linear infinite`;

      // Stop animation after 3 seconds and set the final outcome
      setTimeout(() => {
        reel.style.animation = "none"; // Stop animation
        const stopPosition = manualOutcomes[index + 1] * 63 + 15; // Adjust based on your item height
        reel.style.transition = "top 1.5s ease"; // Smooth stop
        reel.style.top = `-${stopPosition}px`; // Set final outcome position
      }, 2000 + index); // Stagger the stop time a bit
    });
  };

  useEffect(() => {
    // console.log("remainingTime:", remainingTime);
    if (remainingTime === "00:01") {
      startSpin();
    }
  }, [remainingTime, startSpin]);

  // Animate the reels based on the updated values
  useEffect(() => {
    // initializeReels();
    const reelElements = document.querySelectorAll(".reel-inner");
    reelElements.forEach((reel, index) => {
      const stopPosition = (10 + reels[index]) * 3.55; // Scroll down to outcome
      reel.style.top = `-${stopPosition}rem`;
      reel.style.transition = "top 2s cubic-bezier(0.5, 0, 0.5, 1)";
    });
  }, [reels]);

  useEffect(() => {
    initializeReels();
  }, []);

  const handleBoxChange = (index) => {
    setSelectedValue(index);
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const navigate = useNavigate();

  useEffect(() => {
    if (timerKey) {
      // console.log("Timer key received:", timerKey); // Console log the timerKey
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
        navigate(`/5d/${timerKey}`);
      }
    }
  }, [timerKey, navigate]);

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

  const handleOpenPopup = () => {
    setIsPopupOpen(true);
  };

  const handleClosePopup = () => {
    setIsPopupOpen(false);
  };

  const handleNumberSelection = (value) => {
    if (selectedNumbers.includes(value)) {
      setSelectedNumbers(selectedNumbers.filter((num) => num !== value));
    } else {
      setSelectedNumbers([...selectedNumbers, value]);
      setSelectedCategory(null);
    }
  };

  const fetchUserData = async () => {
    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setAccountType(response.data.user.accountType);
      setUser(response.data.user);
    } catch (err) {
      console.error(err);
    }
  };

  const handleRefresh = () => {
    // Handle refresh logic
    fetchUserData();
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
    fetchUserData();
  }, [user]);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(`${domain}/5dgameresult`, {
          params: { selectedTimer },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${sessionStorage.getItem('token')}`,
          },
        });
        console.log(response)
        // Filter the data based on the selectedTimer
        const filteredData = response.data.results.filter(
          (item) => item.timerName === selectedTimer
        );
        console.log("FIltered data is:",filteredData);
        if (filteredData.length > 0) {
          const fetchedData = filteredData[0]; // Use the first matching result
  
          // Map sectionOutcome data to results array (number and letter)
          const mappedResults = Object.keys(fetchedData.sectionOutcome).map(
            (key) => ({
              number: fetchedData.sectionOutcome[key].number,
              letter: key,
            })
          );
          
          setResults(mappedResults);
  
          // Set the total sum from the totalSum field
          setSum(fetchedData.totalSum.value);
  
          // Update rows (if needed)
          setRows(filteredData);
          const numbersArray = Object.values(fetchedData.sectionOutcome).map(
            (item) => item.number
          );
          setManualOutcomes(numbersArray);
          setFinalReels(numberArray);
          reelsRef.current.forEach((reel, index) => {
            const stopPosition = numbersArray[index] * 60 + 5;
            reel.style.transition = "none"; // No transition for initial set
            reel.style.top = `-${stopPosition}px`;
          });
  
          // console.log("numbersArray:", numbersArray);
        } else {
          console.warn("No data matching the selected timer");
          setResults([]);
          setSum(0);
        }
      } catch (err) {
        console.error(err);
      }
    };
  
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 1000);
  
    return () => clearInterval(intervalId);
  }, [selectedTimer, domain]);

  useEffect(() => {
    const generateRandomCols = (numCols, min, max) => {
      return Array.from(
        { length: numCols },
        () => Math.floor(Math.random() * (max - min + 1)) + min
      );
    };
    const generateStatisticsData = () => {
      const newStatisticsData = [
        { id: "A", label: "Missing", cols: generateRandomCols(10, 1, 50) },
        { id: "B", label: "Avg missing", cols: generateRandomCols(10, 1, 20) },
        { id: "C", label: "Frequency", cols: generateRandomCols(10, 0, 5) },
        {
          id: "D",
          label: "Max consecutive",
          cols: generateRandomCols(10, 0, 50),
        },
      ];
      setStatisticsData(newStatisticsData);
    };
    // Generate statistics data on mount and every interval
    generateStatisticsData();
    const intervalId = setInterval(fetchUserData, 1000);
    return () => clearInterval(intervalId);
  }, [periodId]); // Run once on mount

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      // console.log("Connected to WebSocket server");
    };
    socket.onmessage = (event) => {
      const data = JSON.parse(event.data);
      if (data && data.timers && data.timers[selectedTimer]) {
        setPeriodId(data.timers[selectedTimer].periodId); // Set the periodId
        // console.log("rem-->", data.timers[selectedTimer].remainingTime);
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
    navigate(`/5d/${newTimerKey}`);
  };

  const handleClick = (id) => {
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
          newTimerKey = "30sec"; // Handle 30-second timer
          break;
        default:
          newTimerKey = "30sec";
      }
      navigate(`/5d/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle);
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to 747 Lottery , where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game 747 Lottery . Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
    "24/7 Live support on 747 Lottery ",
    "747 Lottery welcomes you here !!",
  ];

  React.useEffect(() => {
    const timer = setInterval(() => {
      setInProp(false);

      setTimeout(() => {
        setIndex((oldIndex) => {
          return (oldIndex + 1) % textArray.length;
        });
        setInProp(true);
      }, 500); // This should be equal to the exit duration below
    }, 3000); // Duration between changing texts

    return () => clearInterval(timer);
  }, []);

  const navigateToPage = () => {
    navigate("/home");
  };

  const navigateToPage1 = () => {
    navigate("/recharge"); // Replace '/path-to-page' with the actual path
  };

  const navigateToPage2 = () => {
    navigate("/withdraw"); // Replace '/path-to-page' with the actual path
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  const handleOpenDrawer = (selectedIndex) => {
    setDrawerOpen(true);
    setDrawerSelectedIndex(selectedIndex);
    console.log("index------>", selectedIndex);
    // Set the selected index for the drawer
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setActiveBetAmount(amount);
    setBetAmount(amount);
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };

  const handlePlaceBet = async () => {
    // Check if user has already bet on this period
    if (bettedPeriods.has(periodId)) {
      setSnackbarMessage("You have already placed a bet for this period");
      setSnackbarOpen(true);
      return;
    }
  
    const totalNumbersBet = selectedNumbers.length;
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const randomString = randomNumber.toString();
    const totalBet = betAmount * multiplier * (totalNumbersBet || (selectedCategory ? 1 : 0));
  
    if (betAmount === 0) {
      setSnackbarMessage("You can't place a bet with 0 amount");
      setSnackbarOpen(true);
      return;
    }
  
    // Calculate available balance by subtracting holdAmount
    const availableBalance = user.walletAmount - (user.holdAmount || 0);
    
    // Check if user has enough available balance
    if (availableBalance < totalBet) {
      setSnackbarMessage("Insufficient available balance. Some funds are on hold.");
      setSnackbarOpen(true);
      return;
    }
  
    if (["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"].includes(remainingTime)) {
      setSnackbarMessage("You can't place a bet in the last 5 seconds");
      setSnackbarOpen(true);
      return;
    }
  
    const feePercentage = 2.5;
    const feeAmount = (totalBet * feePercentage) / 100;
    const taxAmount = feeAmount;
    const totalBetAfterTax = totalBet - feeAmount;
  
    let betData = {
      betAmount,
      multiplier,
      fee: `${feePercentage}%`,
      selectedTimer,
      periodId,
      sectionBets: {},
      totalSum: {},
      totalBet: totalBet,
      userType: accountType,
      orderId: randomString
    };
  
    // ... rest of your existing bet data setup code ...
  
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${domain}/place-bet`, betData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
    
      if (response.status === 201) {
        // Add this period to betted periods
        setBettedPeriods(prev => new Set(prev).add(periodId));
        
        setSelectedNumbers([]);
        setSelectedCategory(null);
        setBetAmount(0);
        setMultiplier(1);
        setSnackbarMessage("Bet placed successfully!");
        setOpenSnackbar(true);
        handleCloseDrawer();
      }
    } catch (err) {
      setSnackbarMessage(err.response?.data?.message || "Error placing bet");
      setSnackbarOpen(true);
    }
  };
  useEffect(() => {
    setBettedPeriods(new Set());
  }, [periodId]);
  const handleCancelBet = () => {
    // Reset the selected numbers
    setSelectedNumbers([]);

    // Reset the active bet amount
    setActiveBetAmount(null);

    // Reset any other relevant state here, if necessary
    setMultiplier(1); // Reset multiplier if you want
    setCustomBetAmount(""); // Clear custom bet amount input
    setSelectedValue(null); // Deselect the active  or value

    // Close the drawer
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

  const timeParts = (remainingTime || "00:00").split(":");
  const minutes = timeParts[0] || "00";
  const seconds = timeParts[1] || "00";
  const [lastPlayedTime, setLastPlayedTime] = useState(null);
  const [isSoundOn, setIsSoundOn] = useState(false);

  const toggleSound = () => {
    setIsSoundOn(!isSoundOn);
  };

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

  const handleEventSelection = (event) => {
    switch (event) {
      case "even":
        setSelectedColor("rgb(200,111,255)");
        break;
      case "odd":
        setSelectedColor("rgb(251,91,91)");
        break;
      case "small":
        setSelectedColor("rgb(110,168,244)");
        break;
      case "big":
        setSelectedColor("rgb(254,170,87)");
        break;
      default:
        setSelectedColor("#F95959");
    }
  };

  // const [activeButton, setActiveButton] = useState(1);
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

  const getColorAndSize = (popupresult) => {
    popupresult = Number(popupresult);

    let color = "unknown";
    let size = "";

    if ([1, 3, 7, 9].includes(popupresult)) {
      color = "green";
    } else if ([2, 4, 6, 8].includes(popupresult)) {
      color = "red";
    } else if (popupresult === 0) {
      color = "red and violet";
    } else if (popupresult === 5) {
      color = "green and violet";
    }

    if (popupresult > 5) {
      size = "big";
    } else {
      size = "small";
    }

    return `${color} ${popupresult} ${size}`;
  };

  useEffect(() => {
    setTotalBet(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const firstFiveRows = rows.slice(0, 5);

  const [selectedMultiplier, setSelectedMultiplier] = useState(1);

  const handleMultiplierChange = (multiplier) => {
    if (!multiplier.isRandom) {
      setSelectedMultiplier(multiplier.value);
    } else {
      // In a real app, you'd generate a random multiplier here
      const randomMultipliers = [1, 5, 10, 20, 50, 100];
      const randomIndex = Math.floor(Math.random() * randomMultipliers.length);
      setSelectedMultiplier(randomMultipliers[randomIndex]);
    }
  };

  // Fetch bets and monitor changes in periodId to queue popups
  useEffect(() => {
    const fetchBets = async () => {
      try {
        // console.log("Fetching bets..."); // Log fetching start
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/fiveD-bets`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        // Log fetched data to confirm it's being received correctly
        const filteredBets = response.data.data.filter(
          (bet) => bet.selectedTimer === selectedTimer
        );
        console.log(filteredBets);
        // console.log("Fetched bets data:", response.data.data);
        // console.log("Selected Timer:", selectedTimer);
        setBets(filteredBets);
  
        // Convert periodId and lastAlertedPeriodId to strings before comparison
        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);
  
        // console.log("Current Period ID (String):", currentPeriodId);
        // console.log(
        //   "Last Alerted Period ID (String):",
        //   previousAlertedPeriodId
        // );
  
        if (currentPeriodId !== previousAlertedPeriodId) {
          // console.log("Period ID has changed. Filtering bets...");
  
          // Filter the bets for the period matching the last alerted period ID
          const completedBets = response.data.data.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              bet.status !== "Pending" &&
              bet.result !== " " &&
              bet.winLoss !== ""
          );
  
          // console.log("completedBets",completedBets)
  
          // console.log("Filtered Period Bets:", periodBets); // Log filtered bets
  
          if (completedBets.length > 0) {
            // console.log("Adding completed bets to popup queue...");
  
            setPopupQueue(completedBets);
            setCurrentBetIndex(0);
            setLastAlertedPeriodId(currentPeriodId);
            // console.log("Popup queue updated:", completedBets);
          } else {
            // console.log("No bets found for the current period.");
          }
        } else {
          // console.log("Period ID has not changed. No new popups queued.");
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    fetchBets();
    const intervalId = setInterval(fetchBets, 1000);
  
    return () => {
      // console.log("Clearing interval...");
      clearInterval(intervalId);
    };
  }, [periodId, lastAlertedPeriodId, domain]);

  // Effect to handle sequential display of popups
  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
      console.log("popupQueue:", popupQueue);
      console.log("currentBetIndex:", currentBetIndex);

      const currentBet = popupQueue[currentBetIndex];

      if (!currentBet) {
        console.error("currentBet is undefined or null.");
        return;
      }

      console.log("Current Bet Object:", currentBet);

      const announceBetResult = async () => {
        console.log(`Announcing bet status: ${currentBet.status}`);

        setGameResult(currentBet.status);
        setWinLoss(currentBet.winLoss);
        setPopupPeriodId(currentBet.periodId);
        setPopupResult(currentBet.result);
        setPopupTimer(currentBet.selectedTimer);
        setDialogContent(
          currentBet.status === "Succeed" ? "Bonus" : "You lost the bet"
        );

       

        setOpen(true);
      };

      announceBetResult();

      const timer = setTimeout(() => {
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
        }, 500);
      }, 2500);

      return () => clearTimeout(timer);
    } else {
      console.log(
        "No popup to show, either popupQueue is empty or currentBetIndex exceeds queue length."
      );
    }
  }, [popupQueue, currentBetIndex]);
  const seconds1 = remainingTime ? remainingTime.split(":")[1] : "00";
  console.log("Game Result is:",gameResult);
  // Determine the length of the seconds string
  const length = seconds1.length;

  const handleCheckboxChange = (event) => {
    const newCheckedState = event.target.checked;
    console.log(newCheckedState)
    setIsChecked(newCheckedState);
    
    // Trigger your function here based on checkbox state
    if (newCheckedState) {
      console.log('Auto-close enabled');
 
            const timer = setTimeout(() => {
        setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
          setIsChecked(false);
        }, 2000);
      }, 4000);
      // Your function logic here
    } else {
      console.log('Auto-close disabled');
      // Your alternative function logic here
    }
  };

  // Split the seconds into two halves
  const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const secondHalf = seconds1.slice(Math.ceil(length / 2));
  const isSum = activeTopButton === 5;

  return (
    <div>
      <Mobile>
        <div style={{ backgroundColor: "#f2f2f1",overflowX:"hidden" }}>
          <Grid
            container
            alignItems="center"
            justifyContent="space-between"
            sx={{
              position: "sticky",
              top: 0,
              zIndex: 5000,
              background: "#F95959",
              padding: "8px 16px",
              color: "white",
            }}
          >
            <Grid item xs={3} textAlign="left">
              <IconButton style={{ color: "white" }} onClick={navigateToPage}>
                <ArrowBackIosNewIcon />
              </IconButton>
            </Grid>
            <Grid item xs={6} textAlign="center">
              <img
                src="/assets/genzwinlogo.png"
                alt="logo"
                style={{ width: "140px", height: "50px" }}
              />
            </Grid>
            <Grid item xs={3} textAlign="right">
              <IconButton style={{ color: "white" }}>
              <SupportAgentIcon onClick={()=>navigate("/service")}/>
              </IconButton>

              <IconButton
                style={{ color: "white" }}
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
              background: "#F95959",
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
                    backgroundColor: "#17B15E",
                    "&:hover": {
                      backgroundColor: "#17B15E",
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
                  background: "#F95959",
                  "&:hover": {
                    background: "#F95959",
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
              maxWidth: "93%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              marginTop: "-65px",
              backgroundColor: "#ffffff",
              borderRadius: "13px",
              color: "white",
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
                      ? "linear-gradient(180deg, #FFACAC 0%, #FFF 90.5%)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
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
                    5D
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
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-around",
              maxWidth: "100%",
              mt: 1.5,
              backgroundColor: "#ffffff",
              margin: 1.5,
              color: "#768096",
              borderRadius: "11px",
              padding: 1,
            }}
          >
            {/* Left Section (Lottery Label) */}
            <Box
              sx={{
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                mr: { xs: 1, sm: 1 },
              }}
            >
              <Typography
                variant="subtitle2"
                sx={{
                  lineHeight: 1,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                Lottery
              </Typography>
              <Typography
                variant="subtitle2"
                sx={{
                  lineHeight: 2.5,
                  fontSize: { xs: "0.8rem", sm: "1rem" },
                }}
              >
                results
              </Typography>
            </Box>

            {/* Results Section */}
            <Box
              sx={{
                display: "flex",
                justifyContent: "center",
                gap: { xs: "5px", sm: "15px" },
              }}
            >
              {results.map((result, index) => (
                <Box
                  key={index}
                  sx={{
                    display: "flex",
                    flexDirection: "column",
                    alignItems: "center",
                  }}
                >
                  <ResultCircle>
                    <Typography
                      variant="body2"
                      sx={{
                        fontSize: { xs: "0.7rem", sm: "0.9rem" },
                        color: "#000",
                      }}
                    >
                      {result.number}
                    </Typography>
                  </ResultCircle>
                  <Typography
                    variant="caption"
                    sx={{ mt: 0.25, fontSize: { xs: "0.6rem", sm: "0.7rem" } }}
                  >
                    {result.letter}
                  </Typography>
                </Box>
              ))}
            </Box>

            {/* Right Section (Sum) */}
            <Box
              sx={{
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                ml: { xs: 1, sm: 2 },
              }}
            >
              <Typography variant="body2" sx={{ fontWeight: "bold", mr: 1 }}>
                =
              </Typography>
              <SumCircle>
                <Typography
                  variant="body2"
                  sx={{
                    fontSize: { xs: "0.9rem", sm: "1rem" },
                  }}
                >
                  {sum}
                </Typography>
              </SumCircle>
            </Box>
          </Box>

          <Box
            mt={2}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "90%",
              boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.1)",
              p: 1,
              backgroundColor: "white",
              borderRadius: "10px",
            }}
          >
            <Grid container spacing={0} alignItems="center">
              <Grid item xs={2}>
                <Typography
                  variant="body1"
                  color="black"
                  sx={{ fontSize: "0.8rem" }}
                >
                  Period
                </Typography>
              </Grid>
              <Grid item xs={5}>
                <Button
                  variant="outlined"
                  sx={{
                    border: "#F95959",
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
                <Htp isOpen={isPopupOpen} onClose={handleClosePopup} />
              </Grid>
              <Grid item xs={5} sx={{ paddingLeft: "10px" }}>
                <Typography variant="body5" color="black">
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
                      color: "black",
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
                      color: "black",
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
                      color: "black",
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
                      color: "black",
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
                      color: "black",
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

            <div className="fullbox">
              <div id="leftbox"></div>
              <div className="outerbox">
                <img className="polygon-left" src="/assets/Polygon-left.svg" />
                <img
                  className="polygon-right"
                  src="/assets/Polygon-right.svg"
                />
                <div className="diebox">
                  <div className="slot-machine">
                    {[...Array(5)].map((_, index) => (
                      <div className="reel" key={index}>
                        <div
                          className="reel-inner"
                          ref={(el) => (reelsRef.current[index] = el)}
                        >
                          {/* <div className="numberElem placeholder-circle"></div> */}
                          {[...Array(20)].map((_, i) => (
                            <div
                              key={i}
                              className={`numberElem ${
                                index === 0 ? "green-background" : ""
                              }`}
                            >
                              {i % 10}
                            </div>
                          ))}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              <div id="rightbox"></div>
            </div>

            <Box sx={{ position: "relative" }}>
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
              <Box sx={{ mt: 2, mb: 2, borderBottom: "1px solid #ccc" }}>
              <Tabs
               value={activeTopButton}
               onChange={handleButtonClick}
               TabIndicatorProps={{ style: { display: "none" } }}
              >
  {["A", "B", "C", "D", "E", "SUM"].map((label, index) => (
    <TopButton
      key={index}
      label={label} // Always display the label
      selected={activeTopButton === index}
      index={index} // Always provide the index
    />
  ))}
</Tabs>

              </Box>

              <Grid
                container
                spacing={1}
                style={{
                  margin: "revert-layer",
                }}
              >
                {tabLabels.map((label, index) => (
                  <Grid item key={index} xs={3} sm={3}>
                    <Box
                      style={{
                        backgroundColor:
                          selectedElement === label ? selectedColor : "#cdcedc",
                        color:
                          selectedElement === label ? "#ffffff" : "#ffffff",
                        borderRadius: "5px",
                        textAlign: "center",
                        cursor: "pointer",
                        height: "2rem",
                        width: "5rem",
                        margin: "0 3px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        lineHeight: "00px",
                      }}
                      onClick={() => {
                        handleOpenDrawer(label, index); // Open drawer with the selected index
                        setDrawerSelectedIndex(index);
                        handleCategorySelection(label, index);
                        console.log("label", label.toLowerCase().split(" ")[0]);
                        handleEventSelection(label);
                        handleEventSelection(label.toLowerCase().split(" ")[0]);
                      }}
                    >
                      <Typography
                        variant="body2"
                        style={{ textTransform: "initial" }}
                      >
                        {label}
                      </Typography>
                    </Box>
                  </Grid>
                ))}
              </Grid>

              <Grid
                container
                spacing={2}
                justifyContent="center"
                sx={{ mt: 0.2 }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => (
                  <Grid item key={index} xs={2.2} sm={2.2} textAlign="center">
                    <Box
                      className="round"
                      sx={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: "1px solid #ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        fontSize: "0.8rem",
                        color: "#b6bcc8",
                        backgroundColor: "transparent",
                        cursor: "pointer",
                        "&:active": {
                          background: "linear-gradient(90deg, #F95959 0%, #59adff 100%)",
                        },
                        opacity: isSum ? 0 : 1,
                        pointerEvents: isSum ? "none" : "auto",
                      }}
                      onClick={() => {
                        if (!isSum) {
                          handleOpenDrawer(value); // Open drawer and pass value
                          handleCategorySelection(value.toString(), index);
                          handleEventSelection("default");

                          // Toggle selection of the number
                          setSelectedNumbers((prev) =>
                            prev.includes(value)
                              ? prev.filter((num) => num !== value)
                              : [...prev, value]
                          );
                        }
                      }}
                    >
                      {value}
                    </Box>

                    <Typography
                      className="rate"
                      variant="body2"
                      sx={{
                        marginTop: "2px",
                        color: "#768096",
                        fontSize: "0.75rem",
                        textAlign: "center",
                        opacity: isSum ? 0 : 1,
                      }}
                    >
                      9
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {isSum && (
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  style={{
                    position: "absolute",
                    top: "35%",
                    left: "50%",
                    transform: "translate(-50%, -50%)",
                    width: "100%",
                    backgroundColor: "white",
                  }}
                >
                  {tabLabels.map((label, index) => (
                    <Grid item key={index} xs={3} sm={3}>
                      <Box
                        style={{
                          backgroundColor:
                            selectedCategory === label
                              ? selectedColor
                              : "#cdcedc",
                          color: "#ffffff",
                          borderRadius: "5px",
                          textAlign: "center",
                          cursor: "pointer",
                          height: "2rem",
                          width: "5rem",
                          margin: "0 3px",
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          fontSize: "10px",
                          lineHeight: "00px",
                        }}
                        onClick={() => {
                          handleOpenDrawer(label, index);
                          setDrawerSelectedIndex(index);
                          handleCategorySelection(label, index);
                          handleEventSelection(
                            label.toLowerCase().split(" ")[0]
                          );
                        }}
                      >
                        <Typography
                          variant="body2"
                          style={{ textTransform: "initial" }}
                        >
                          {label}
                        </Typography>
                      </Box>
                    </Grid>
                  ))}
                </Grid>
              )}
            </Box>
          </Box>

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
              {/* Top Buttons and Categories */}
              <Box
                sx={{
                  mt: 2,
                  mb: 1.2,
                  marginX: 1.2,
                  borderBottom: "1px solid #ccc",
                  width: "100%",
                }}
              >
                <Tabs
                  value={activeTopButton}
                  onChange={handleButtonClick}
                  TabIndicatorProps={{ style: { display: "none" } }}
                >
                  {["A", "B", "C", "D", "E", "SUM"].map((label, index) => (
                    <TopButton
                      key={index}
                      label={label}
                      selected={activeTopButton === index}
                      index={activeTopButton === index ? index : ""}
                    />
                  ))}
                </Tabs>
              </Box>

              <Grid
                container
                spacing={1}
                style={{
                  margin: "0px auto 5px",
                }}
              >
                {tabLabels.map((label, index) => (
                  <Grid
                    item
                    xs={3}
                    sm={3}
                    key={index}
                    style={{
                      padding: "0 5px",
                      display: "flex",
                      justifyContent: "center",
                    }}
                  >
                    <Grid
                      style={{
                        backgroundColor:
                          selectedCategory === label
                            ? selectedColor
                            : "#cdcedc",
                        color: "#ffffff",
                        borderRadius: "5px",
                        textAlign: "center",
                        cursor: "pointer",
                        height: "2rem",
                        width: "5rem",
                        margin: "0 0px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: "10px",
                        lineHeight: "20px",
                      }}
                      onClick={() => {
                        handleCategorySelection(label, index);
                        console.log("categoryLabel", label, index);
                      }} // Update category and color
                    >
                      <Typography
                        variant="body2"
                        style={{ textTransform: "initial" }}
                      >
                        {label}
                      </Typography>
                    </Grid>
                  </Grid>
                ))}
              </Grid>

              {/* Selectable Number Boxes */}
              <Grid
                container
                spacing={2}
                justifyContent="center"
                style={{
                  opacity: isSum ? 0 : 1,
                  pointerEvents: isSum ? "none" : "auto",
                  height: isSum ? 0 : "auto",
                  overflow: "hidden",
                  transition: "opacity 0.3s, height 0.3s",
                }}
              >
                {[0, 1, 2, 3, 4, 5, 6, 7, 8, 9].map((value, index) => (
                  <Grid item key={index} xs={2.2} sm={2.2} textAlign="center">
                    <Box
                      className="round"
                      sx={{
                        width: "35px",
                        height: "35px",
                        borderRadius: "50%",
                        border: selectedNumbers.includes(value)
                          ? `2px solid ${selectedColor}`
                          : "1px solid #ccc",
                        display: "flex",
                        justifyContent: "center",
                        alignItems: "center",
                        margin: "0 auto",
                        fontSize: "0.8rem",
                        color: selectedNumbers.includes(value)
                          ? "#fff"
                          : "#b6bcc8",
                        backgroundColor: selectedNumbers.includes(value)
                          ? selectedColor
                          : "transparent",
                        cursor: "pointer",
                      }}
                      onClick={() => handleNumberSelection(value)}
                    >
                      {value}
                    </Box>

                    <Typography
                      className="rate"
                      variant="body2"
                      sx={{
                        marginTop: "2px",
                        color: "#768096",
                        fontSize: "0.75rem",
                        textAlign: "center",
                      }}
                    >
                      9
                    </Typography>
                  </Grid>
                ))}
              </Grid>

              {/* Bet Amount Selection */}
              <Grid padding={2}>
                <Grid item xs={12}>
                  <Grid container justifyContent="space-between">
                    <Typography
                      variant="h6"
                      sx={{ color: "black", fontSize: "1rem" }}
                    >
                      Balance
                    </Typography>
                    {[1, 10, 100, 1000].map((amount) => (
                      <Button
                        key={amount}
                        variant="contained"
                        style={{
                          ...(activeBetAmount === amount
                            ? { backgroundColor: selectedColor, color: "white" }
                            : { backgroundColor: "#f2f2f1", color: "black" }),
                          boxShadow: "none", // Add this to remove shadow
                          marginLeft:"5px"
                        }}
                        onClick={() => handleBetAmount(amount)}
                      >
                        {"\u20B9" + amount}
                      </Button>
                    ))}
                  </Grid>
                </Grid>

                {/* Quantity Selection */}
                <Grid item xs={12} mt={2}>
                  <Grid container>
                    <Grid
                      item
                      container
                      direction="row"
                      justifyContent="space-between"
                      alignItems="center"
                    >
                      {/* <Typography
                        variant="h6"
                        sx={{ color: "black", fontSize: "1rem" }}
                      >
                        Add your money
                      </Typography> */}
                      {/* <Grid justifyContent="flex-end">
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
                      </Grid> */}

                      {/* Multiplier Selection */}
                      <Grid item xs={12} mt={2}>
                        <Grid
                          container
                          alignItems="center"
                          justifyContent="space-between"
                        >
                          <Typography
                            variant="h6"
                            sx={{ color: "black", fontSize: "1rem" }}
                          >
                            Quantity
                          </Typography>
                          <Grid
                            item
                            container
                            xs={6}
                            justifyContent="flex-end"
                            alignItems="center"
                            spacing={1}
                          >
                            <Grid item>
                              <IconButton
                                onClick={() =>
                                  setMultiplier(
                                    multiplier > 1 ? multiplier - 1 : 1
                                  )
                                }
                                sx={{
                                  color: "white",
                                  padding: "4px",
                                }}
                              >
                                <RemoveIcon
                                  fontSize="small"
                                  sx={{ color: selectedColor, fontSize: 30 }}
                                />
                              </IconButton>
                            </Grid>
                            <Grid item>
                              <Typography
                                variant="body1"
                                sx={{
                                  border: `1px solid ${selectedColor}`,
                                  borderRadius: "4px",
                                  padding: "4px 12px",
                                  backgroundColor: "white",
                                  color: "black",
                                  minWidth: "40px",
                                  textAlign: "center",
                                }}
                              >
                                {multiplier}
                              </Typography>
                            </Grid>
                            <Grid item>
                              <IconButton
                                onClick={() => setMultiplier(multiplier + 1)}
                                sx={{
                                  color: "white",
                                  padding: "4px",
                                }}
                              >
                                <AddIcon
                                  fontSize="small"
                                  sx={{ color: selectedColor, fontSize: 30 }}
                                />
                              </IconButton>
                            </Grid>
                          </Grid>
                        </Grid>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>

                <Grid item xs={12} mt={2}>
                  <Grid
                    container
                    justifyContent="flex-end"
                    sx={{ color: "black" }}
                  >
                    {[1, 5, 10, 20, 50, 100].map((value) => (
                      <div
                        key={value}
                        className={`button ${
                          activeButton === value ? "active" : ""
                        }`}
                        onClick={() => handleMultiplier(value)}
                        style={
                          activeButton === value
                            ? { backgroundColor: selectedColor, color: "white" }
                            : { backgroundColor: "#f2f2f1", color: "black" }
                        }
                      >
                        X{value}
                      </div>
                    ))}
                  </Grid>
                </Grid>
              </Grid>

              {/* Total Bet Calculation */}
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
                      style={{ background: selectedColor }}
                      variant="contained"
                    >
                      {`Total Bet: ₹${
                        betAmount *
                        multiplier *
                        (selectedNumbers.length || (selectedCategory ? 1 : 0))
                      }`}
                    </Button>
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

          <Grid
            mt={2}
            container
            justifyContent="center"
            sx={{ marginBottom: "15%" }}
          >
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
                        height: "40px", // Adjust this value to change the tab height
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
                    <GameHistory data={rows} />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <Chart5D data={{ rows, statisticsData }} />
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
                            : 0
                        )
                        .map((bet, index) => (
                          <Accordion
                            key={index}
                            sx={{
                              backgroundColor: "#ffffff",
                              width: "100%",
                            }}
                          >
                            <AccordionSummary>
                              <Grid
                                container
                                sx={{
                                  alignItems: "center",
                                  p: 1,
                                  margin: "0px",
                                }}
                              >
                                <Grid item xs={2}>
                                  <Box
                                    border={1}
                                    borderRadius={2}
                                    style={{
                                      background:
                                        typeof bet.sectionBets !==
                                          "undefined" &&
                                        Object.entries(bet.sectionBets).some(
                                          ([, value]) =>
                                            value.size !== undefined ||
                                            value.parity !== undefined ||
                                            value.numberBet.length > 0
                                        )
                                          ? Object.entries(
                                              bet.sectionBets
                                            ).some(
                                              ([, value]) =>
                                                value.numberBet &&
                                                value.numberBet.length > 0
                                            )
                                            ? "#F95959" // Color for sectionBets with numberBet
                                            : Object.entries(bet.sectionBets)
                                                .map(
                                                  ([, value]) =>
                                                    value.size === "Small"
                                                      ? "rgb(110,168,244)" // Color for small
                                                      : value.size === "Big"
                                                      ? "rgb(254,170,87)" // Color for big
                                                      : value.parity === "Even"
                                                      ? "rgb(200,111,255)" // Color for even
                                                      : value.parity === "Odd"
                                                      ? "rgb(251,91,91)" // Color for odd
                                                      : "#F95959" // Default color for sectionBets without numberBet
                                                )
                                                .find(
                                                  (color) => color !== undefined
                                                ) || "#F95959" // Default fallback color
                                          : typeof bet.totalSum !==
                                              "undefined" &&
                                            typeof bet.totalSum === "object"
                                          ? bet.totalSum.size === "Big"
                                            ? "rgb(254,170,87)" // Color for Big
                                            : bet.totalSum.size === "Small"
                                            ? "rgb(110,168,244)" // Color for Small
                                            : bet.totalSum.parity === "Odd"
                                            ? "rgb(251,91,91)" // Color for Odd
                                            : bet.totalSum.parity === "Even"
                                            ? "rgb(200,111,255)" // Color for Even
                                            : "#F95959" // Default color for totalSum
                                          : "#F95959", // Default color
                                      color: "white",
                                      height: "40px",
                                      width: "40px",
                                      display: "flex",

                                      marginRight: "2px",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        fontWeight: "bold",
                                      }}
                                    >
                                      {typeof bet.sectionBets !== "undefined" &&
                                      Object.entries(bet.sectionBets).some(
                                        ([, value]) =>
                                          value.size !== undefined ||
                                          value.parity !== undefined ||
                                          value.numberBet.length > 0
                                      ) ? (
                                        // Handle section bets
                                        Object.entries(bet.sectionBets).map(
                                          ([section, value]) =>
                                            value.numberBet &&
                                            value.numberBet.length > 0 ? ( // Check if numberBet exists and has length
                                              <div
                                                key={section}
                                                style={{ fontSize: "14px" }}
                                              >
                                                {value.numberBet
                                                  .slice(0, 2)
                                                  .join("|")}{" "}
                                                {/* Display numberBet values */}
                                              </div>
                                            ) : // Display other properties only if numberBet is empty
                                            value.size !== undefined ||
                                              value.parity !== undefined ? (
                                              <div key={section}>
                                                {value.size !== undefined
                                                  ? `${value.size}`
                                                  : ""}
                                                {value.parity !== undefined
                                                  ? `${value.parity}`
                                                  : ""}
                                              </div>
                                            ) : null
                                        )
                                      ) : typeof bet.totalSum !== "undefined" &&
                                        typeof bet.totalSum === "object" ? (
                                        // Fallback to displaying totalSum
                                        <div>
                                          {Object.entries(bet.totalSum).map(
                                            ([key, value]) =>
                                              value !== undefined ? (
                                                <div key={key}>{value}</div>
                                              ) : null
                                          )}
                                        </div>
                                      ) : null}
                                    </Typography>
                                  </Box>
                                </Grid>
                                <Grid item xs={7} textAlign="left">
                                  <Typography variant="body2">
                                    {bet.periodId}
                                  </Typography>
                                  <Typography
                                    variant="caption"
                                    sx={{ color: "text.secondary" }}
                                  >
                                    {bet.timestamp
                                      ? new Date(bet.timestamp).toLocaleString(
                                          "en-GB"
                                        )
                                      : "N/A"}
                                  </Typography>
                                </Grid>
                                <Grid item xs={3} sx={{ textAlign: "right" }}>
                                  <Box
                                    sx={{
                                      border: 1,
                                      borderColor:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : bet.status === "Pending"
                                          ? "#F95959"
                                          : "success.main",
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
                                          bet.winLoss > 0
                                            ? "green"
                                            : bet.status === "PendingS"
                                            ? "#F95959"
                                            : "red",
                                      }}
                                    >
                                      {bet.status}
                                    </Typography>
                                  </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : bet.status === "Pending"
                                          ? "#F95959"
                                          : "success.main",
                                      fontWeight: "bold",
                                    }}
                                  >
                                    {bet.status === "Failed"
                                      ? `-₹${Math.abs(bet.winLoss)}`
                                      : bet.status === "Pending"
                                      ? ""
                                      : `+₹${bet.winLoss}`}
                                  </Typography>
                                </Grid>
                              </Grid>
                            </AccordionSummary>
                            <AccordionDetails sx={{ m: 0, p: 0 }}>
                              <Table size="small" style={{ padding: 2 }}>
                                <TableBody>
                                  {[
                                  
                                    {
                                      label: "Order number",
                                      value: `${bet.orderId}`,
                                    },
                                    { label: "Period", value: bet.periodId },
                                    {
                                      label: "Purchase amount",
                                      value: `₹${bet.betAmount}`,
                                    },
                                    {
                                      label: "Quantity",
                                      value: bet.multiplier,
                                    },
                                    {
                                      label: "Amount after tax",
                                      value: `₹${bet.totalBetAfterTax}`,
                                    },
                                    { label: "Tax", value: `${bet.fee}` },

                                    {
                                      label: "Result",
                                      value: bet.resultOutcome?.sectionOutcome,
                                    },
                                    {
                                      label: "Select",
                                      value: bet.sectionBets,
                                    },
                                    { label: "Status", value: bet.status },
                                    {
                                      label: "Win/lose",
                                      value:
                                        bet.winLoss > 0
                                          ? `+₹${bet.winLoss}`
                                          : `₹${bet.winLoss}`,
                                    },
                                    {
                                      label: "Order time",
                                      value: new Date(
                                        bet.timestamp
                                      ).toLocaleString("en-GB"),
                                    },
                                  ].map((row, index) => (
                                    <TableRow
                                      key={index}
                                      sx={{
                                        py: 2,
                                        px: 1,
                                        border: "0.4rem solid #ffffff",
                                        backgroundColor: "#f6f6f6",
                                      }}
                                    >
                                      <TableCell component="th" scope="row">
                                        {row.label}
                                      </TableCell>
                                      <TableCell align="right">
                                        {row.label === "Amount after tax" ? (
                                          <Typography sx={{ color: "red" }}>
                                            {row.value}
                                          </Typography>
                                        ) : row.label === "Win/lose" ? (
                                          <Typography
                                            sx={{
                                              color:
                                                Number(
                                                  row.value.replace(
                                                    /[^0-9.-]+/g,
                                                    ""
                                                  )
                                                ) >= 0
                                                  ? "green"
                                                  : "red",
                                            }}
                                          >
                                            {row.value !== "₹undefined"
                                              ? row.value
                                              : ""}
                                          </Typography>
                                        ) : row.label === "Select" ? (
                                          <div>
                                            {typeof row.value !== "undefined" &&
                                            Object.entries(row.value).some(
                                              ([, value]) =>
                                                value.size !== undefined ||
                                                value.parity !== undefined ||
                                                value.numberBet.length > 0
                                            ) ? (
                                              // Handle section bets
                                              Object.entries(row.value).map(
                                                ([section, value]) =>
                                                  value.numberBet &&
                                                  value.numberBet.length > 0 ? ( // Check if numberBet exists and has length
                                                    <div key={section}>
                                                      <strong>
                                                        {section}:
                                                      </strong>{" "}
                                                      {value.numberBet.join(
                                                        ", "
                                                      )}{" "}
                                                      {/* Display numberBet values */}
                                                    </div>
                                                  ) : // Display other properties only if numberBet is empty
                                                  value.size !== undefined ||
                                                    value.parity !==
                                                      undefined ? (
                                                    <div key={section}>
                                                      <strong>
                                                        {section}:
                                                      </strong>
                                                      {value.size !== undefined
                                                        ? ` Size: ${value.size}`
                                                        : ""}
                                                      {value.parity !==
                                                      undefined
                                                        ? ` Parity: ${value.parity}`
                                                        : ""}
                                                    </div>
                                                  ) : null
                                              )
                                            ) : typeof bet.totalSum !==
                                                "undefined" &&
                                              typeof bet.totalSum ===
                                                "object" ? (
                                              // Fallback to displaying totalSum
                                              <div>
                                                {Object.entries(
                                                  bet.totalSum
                                                ).map(([key, value]) =>
                                                  value !== undefined ? (
                                                    <div key={key}>
                                                      <strong>
                                                        {key
                                                          .charAt(0)
                                                          .toUpperCase() +
                                                          key.slice(1)}
                                                        :
                                                      </strong>{" "}
                                                      {value}
                                                    </div>
                                                  ) : null
                                                )}
                                              </div>
                                            ) : null}
                                          </div>
                                        ) : row.label === "Result" ? (
                                          typeof row.value === "object" &&
                                          row.value !== null ? (
                                            <div
                                              align="right"
                                              style={{
                                                display: "flex",
                                                flexDirection: "row",
                                                justifyContent: "flex-end",
                                              }}
                                            >
                                              {Object.entries(row.value).map(
                                                ([key, outcome]) => (
                                                  <div
                                                    key={key}
                                                    style={{
                                                      width: "auto",
                                                      height: "18px",
                                                      borderRadius: "50%",
                                                      border: "1px solid grey",
                                                      display: "flex", // Make sure this is included to center the conter
                                                      justifyContent: "center",
                                                      background: "transparent",
                                                      color: "black",
                                                      margin: "0 2px",
                                                      aspectRatio: "1 / 1", // This ensures a square aspect ratio, keeping it circular
                                                      fontSize: "15px",
                                                    }}
                                                  >
                                                    {outcome.number}
                                                  </div>
                                                )
                                              )}
                                            </div>
                                          ) : (
                                            ""
                                          )
                                        ) : (
                                          row.value
                                        )}
                                      </TableCell>
                                    </TableRow>
                                  ))}
                                </TableBody>
                              </Table>
                            </AccordionDetails>
                          </Accordion>
                        ))}
                    </Grid>
                  </TabPanel>
                )}
              </Box>
            </Box>
          </Grid>

          <>
            {/* ...rest of the code... */}

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
    backgroundColor: "rgba(59, 53, 53, 0.6)", // Added back the backdrop effect
    // display: "flex",
    justifyContent: "center",
    alignItems: "center",
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
        color: gameResult==="Succeed"? "Won":"rgb(104,136,176)",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "clamp(16px, 4vw, 24px)", // Responsive font size
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
      {/* Semi-circle Letters Section */}
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          gap: "clamp(2px, 0.4vw, 4px)",
          padding: "clamp(2px, 0.4vw, 4px) clamp(5px, 1vw, 10px)",
        }}
      >
        {Object.keys(rows[0]?.sectionOutcome ?? {}).map((letter, index) => (
          <div
            key={index}
            style={{
              width: "clamp(16px, 3.2vw, 20px)",
              height: "clamp(16px, 3.2vw, 20px)",
              backgroundColor: "#F95959",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "bold",
              fontSize: "clamp(10px, 2vw, 14px)",
              color: "#fff",
              textAlign: "center",
              border: "2px solid white",
              borderTopLeftRadius: "clamp(12px, 2.4vw, 15px)",
              borderTopRightRadius: "clamp(12px, 2.4vw, 15px)",
              borderBottom: "none",
              padding: "clamp(1px, 0.4vw, 2px) clamp(3.5px, 0.7vw, 7px)",
            }}
          >
            {letter}
          </div>
        ))}
      </div>

      {/* Numbers Section */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(4px, 0.8vw, 8px)",
          padding: "clamp(2px, 0.4vw, 4px) clamp(5px, 1vw, 10px)",
        }}
      >
        {Object.values(rows[0]?.sectionOutcome ?? {}).map((numberObject, index) => (
          <div
            key={index}
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
            {numberObject?.number}
          </div>
        ))}
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
        variant="h5"
        style={{
          color: gameResult === "Succeed" ? "#28a745" : "rgb(153, 158, 165)",
          fontWeight: "bold",
          fontSize: "clamp(14px, 2.8vw, 18px)",
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
          margin: "1px 0",
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
    onClick={(e) => setOpen(false)}
    style={{
      position: "absolute",
      backgroundColor: "black",
      color: "white",
      padding: "clamp(4px, 0.8vw, 8px) clamp(10px, 2vw, 20px)",
      fontSize: "clamp(12px, 2.4vw, 16px)",
      opacity: "0.2",
      borderRadius: "70px",
      bottom: "calc(50% - min(40vh, 200px) - 30px)", // Position below the modal
      zIndex: 2001,
    }}
  >
    <CloseIcon style={{ fontSize: "clamp(16px, 3.2vw, 24px)" }} />
  </Button>
</div>
          </>
        </div>
        <br />
        <br />
        <br />
      </Mobile>
    </div>
  );
};

export default FiveD;
//updated 5D
//updated order id
