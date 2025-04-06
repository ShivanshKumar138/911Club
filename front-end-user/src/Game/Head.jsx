import React, { useState, useEffect } from "react";
import IconButton from "@mui/material/IconButton";
import Mobile from "../Components/Mobile";
import { Typography, Grid, Box, TextField, Checkbox} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import SupportAgentIcon from "@mui/icons-material/SupportAgent";
import MusicNoteIcon from "@mui/icons-material/MusicNote";
import { Button } from "@mui/material";
import { Refresh, AccountBalanceWallet, VolumeUp } from "@mui/icons-material";
import WhatshotIcon from "@mui/icons-material/Whatshot";
import NoteIcon from "@mui/icons-material/Note";
import { Tabs, Tab } from "@mui/material";
import { Drawer } from "@mui/material";
import Dialog from "@mui/material/Dialog";
import DialogContent from "@mui/material/DialogContent";
import DialogContentText from "@mui/material/DialogContentText";
import { CSSTransition } from "react-transition-group";
import { useNavigate } from "react-router-dom";
import VolumeUpIcon from "@mui/icons-material/VolumeUp";
import { FormControlLabel, Radio } from "@mui/material";
// import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import RadioButtonUncheckedIcon from "@mui/icons-material/RadioButtonUnchecked";
import { DialogActions} from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
import { 

  DialogTitle, 

} from '@mui/material';


import "../App.css";
import axios from "axios";
import {
  Table,
  TableCell,
  TableRow,
  TableBody,
  TableContainer,
} from "@mui/material";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import RowVisualization from "./Row";
import CustomTable from "./Visualize";
import { Snackbar } from "@mui/material";
import MuiAlert from "@mui/material/Alert";
import { ButtonGroup, styled } from "@mui/material";
import { domain } from "../Components/config";
import { wssdomain } from "../Components/config";
import MusicOffIcon from "@material-ui/icons/MusicOff";
import Play from "./Play";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useTheme } from "@mui/material/styles";
// import icon from "../../public/games/assets/Clock.png"
import RemoveIcon from "@mui/icons-material/IndeterminateCheckBox";
import AddIcon from "@mui/icons-material/AddBox";
import { CheckCircleIcon } from "lucide-react";
import { useCallback } from "react";
import Alert from '@mui/material/Alert';
const countdownSound = new Audio("/assets/sound.mp3");
countdownSound.loop = true;

const images = [
  {
    id: 4,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "30Sec", // Updated subtitle for 30 seconds
  },
  {
    id: 1,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "1Min",
  },
  {
    id: 2,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "3Min",
  },
  {
    id: 3,
    src: "../../games/assets/time-5d4e96a3.png",
    altSrc: "/assets/blueclock.png",
    subtitle: "5Min",
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

const StyledButtonGroup = styled(ButtonGroup)(({ theme }) => ({
  borderRadius: "5px",
  padding: "3px 0px",
  gap: "5.5px",
}));
const StyledButton = styled(Button)(({ theme, active, isRandom }) => ({
  backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
  color: isRandom ? "#D23838" : active ? "#ffffff" : "#000000",
  fontSize: "0.8rem",
  padding: "3px 8px",
  border: isRandom ? "1px solid #D23838" : "none",
  "&:hover": {
    backgroundColor: isRandom ? "#ffffff" : active ? "#17B15E" : "#f2f2f1",
    border: isRandom ? "1px solid #D23838" : "none",
  },
}));

const multipliers = [
  { label: "Random", value: "random", isRandom: true },
  { label: "X1", value: 1 },
  { label: "X5", value: 5 },
  { label: "X10", value: 10 },
  { label: "X20", value: 20 },
  { label: "X50", value: 50 },
  { label: "X100", value: 100 },
];


const GameRulesModal = ({ open, handleClose }) => {
  // Prevent unnecessary re-renders
  const onClose = useCallback((event, reason) => {
    if (reason !== 'backdropClick') {
      handleClose();
    }
  }, [handleClose]);

  return (
    <Mobile>
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="sm" // Changed from "md" to "sm" for smaller width
      fullWidth={false} // Set to false to prevent taking full width
      keepMounted={false}
      disableEscapeKeyDown={false}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.7)',
        },
        '& .MuiPaper-root': {
          width: '350px', // Explicitly set width
          maxHeight: '80vh' // Prevent modal from being too tall
        }
      }}
    >
      <DialogTitle
        sx={{
          backgroundColor: '#F95959',
          color: 'white',
          fontWeight: 'bold',
          py: 1, // Reduced padding
          fontSize: '1rem' // Smaller font size
        }}
      >
        Game Rules
      </DialogTitle>
<DialogContent sx={{ px: 2, py: 2 }}>
  {/* Game Overview */}
  <Typography variant="subtitle1" sx={{ color: '#333', mb: 2 }}>
    🕒 Game Schedule
  </Typography>
  
  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
    • 1 issue every minute
    • 55 seconds for placing orders
    • 5 seconds waiting period for draw
    • Open 24/7 with 1440 daily trades
  </Typography>

  {/* Betting Example */}
  <Typography variant="subtitle1" sx={{ color: '#333', mb: 1 }}>
    💰 Betting Example
  </Typography>
  
  <Typography variant="body2" sx={{ mb: 2, color: '#666' }}>
    Initial bet: ₹100
    Service fee: 2.5%
    Contract amount after fees: ₹97.5
  </Typography>

  {/* Winning Rules */}
  <Typography variant="subtitle1" sx={{ color: '#333', mb: 1 }}>
    🎯 Winning Rules
  </Typography>

  <Box sx={{ pl: 2 }}>
    {/* Green Selection */}
    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong style={{ color: '#17B15E' }}>1. Green:</strong>
      • Numbers 1,3,7,9: Win ₹195 (2x)
      • Number 5: Win ₹146.25 (1.5x)
    </Typography>

    {/* Red Selection */}
    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong style={{ color: '#F95959' }}>2. Red:</strong>
      • Numbers 2,4,6,8: Win ₹195 (2x)
      • Number 0: Win ₹146.25 (1.5x)
    </Typography>

    {/* Violet Selection */}
    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong style={{ color: '#9B48DB' }}>3. Violet:</strong>
      • Numbers 0 or 5: Win ₹438.75 (4.5x)
    </Typography>

    {/* Number Selection */}
    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong>4. Number:</strong>
      • Exact match: Win ₹877.5 (9x)
    </Typography>

    {/* Size Selections */}
    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong style={{ color: '#6ea8f4' }}>5. Small:</strong>
      • Numbers 0,1,2,3,4: Win ₹195 (2x)
    </Typography>

    <Typography variant="body2" sx={{ mb: 1, color: '#666' }}>
      <strong style={{ color: '#ffa82e' }}>6. Big:</strong>
      • Numbers 5,6,7,8,9: Win ₹195 (2x)
    </Typography>
  </Box>
</DialogContent>
      <DialogActions sx={{ px: 2, pb: 1, pt: 0 }}> {/* Reduced padding */}
        <Button 
          onClick={handleClose} 
          variant="contained"
          size="small" // Smaller button
          sx={{
            backgroundColor: '#F95959',
            '&:hover': {
              backgroundColor: 'rgb(230, 150, 70)',
            },
            fontSize: '0.8rem' // Smaller font
          }}
        >
          Close
        </Button>
      </DialogActions>
    </Dialog>
    </Mobile>
  );
};


const Head = ({ timerKey }) => {

  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState(""); // Store message here
  const [snackbarSeverity, setSnackbarSeverity] = useState("success"); // Add severity state
  const [resultColor,setResultColor]=useState();
  const [currentPeriodBets, setCurrentPeriodBets] = useState([]);
  const [agree, setAgree] = useState(false);
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
  const [gameResult, setGameResult] = useState();
  console.log("Game result is:",gameResult);
  const [value, setValue] = useState(0);
  const [bets, setBets] = useState([]);
  const [selectedColor, setSelectedColor] = useState("rgb(242, 167, 92)");
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
  const [accountType, setAccountType] = useState("Normal");
  // State for tracking animation and selection
  const [animatedIndex, setAnimatedIndex] = useState(null);
  const [isRandomizing, setIsRandomizing] = useState(false);
  const [selectedMultiplier, setSelectedMultiplier] = useState(1);
  const backgroundImage = gameResult === "Succeed"
    ? "../../assets/images/missningBg-6f17b242.png"
    : "../../assets/images/missningLBg-73e02111.png";

    let currentBet; 
  const text=gameResult==="Succeed"?"Congratulations":"Sorry"
  const navigate = useNavigate();
const [isChecked, setIsChecked] = useState(false);
  const handleClose=()=>{
    setOpen(false);
  }


  const checkIllegalBetting = (newBet) => {
    // If no previous bets for this period, it's always legal
    if (currentPeriodBets.length === 0) return { isIllegal: false };
    
    const existingBets = [...currentPeriodBets];
    const currentSelection = newBet.toLowerCase();
    
    // Helper function to check if bet is a number
    const isNumber = (bet) => !isNaN(Number(bet));
    
    // Get all number bets
    const numberBets = existingBets.filter(bet => isNumber(bet));
    
    // Illegal combination checks
    const illegalCombinations = [
      // Basic color combinations
      {
        condition: () => 
          (existingBets.includes("red") && currentSelection === "green") ||
          (existingBets.includes("green") && currentSelection === "red"),
        message: "Cannot bet on both Red and Green in the same period"
      },
      
      // Size + Number combinations
      {
        condition: () => {
          const smallNumbers = ["0", "1", "2", "3", "4"];
          const bigNumbers = ["5", "6", "7", "8", "9"];
          return (
            (existingBets.includes("big") && smallNumbers.includes(currentSelection)) ||
            (existingBets.includes("small") && bigNumbers.includes(currentSelection)) ||
            (currentSelection === "big" && numberBets.some(num => smallNumbers.includes(num))) ||
            (currentSelection === "small" && numberBets.some(num => bigNumbers.includes(num)))
          );
        },
        message: "Cannot combine Big/Small with opposing numbers"
      },
      
      // Color + Number combinations
      {
        condition: () => {
          const redNumbers = ["2", "4", "6", "8", "0"];
          const greenNumbers = ["1", "3", "7", "9", "5"];
          return (
            (existingBets.includes("red") && greenNumbers.includes(currentSelection)) ||
            (existingBets.includes("green") && redNumbers.includes(currentSelection)) ||
            (currentSelection === "red" && numberBets.some(num => greenNumbers.includes(num))) ||
            (currentSelection === "green" && numberBets.some(num => redNumbers.includes(num)))
          );
        },
        message: "Cannot combine colors with opposing numbers"
      },
      
      // Size + Color combinations
      {
        condition: () => 
          (existingBets.includes("big") && currentSelection === "small") ||
          (existingBets.includes("small") && currentSelection === "big"),
        message: "Cannot bet on both Big and Small in the same period"
      },
        // Red + Big combination
    {
      condition: () =>
        (existingBets.includes("red") && currentSelection === "big") ||
        (existingBets.includes("big") && currentSelection === "red"),
      message: "Cannot combine Red with Big"
    },

    // Green + Small combination
    {
      condition: () =>
        (existingBets.includes("green") && currentSelection === "small") ||
        (existingBets.includes("small") && currentSelection === "green"),
      message: "Cannot combine Green with Small"
    },
      // Red + Small combination
      {
        condition: () =>
          (existingBets.includes("red") && currentSelection === "small") ||
          (existingBets.includes("small") && currentSelection === "red"),
        message: "Cannot combine Red with Small"
      },
      
      // Green + Big combination
      {
        condition: () =>
          (existingBets.includes("green") && currentSelection === "big") ||
          (existingBets.includes("big") && currentSelection === "green"),
        message: "Cannot combine Green with Big"
      }
    ];
    
    // Check each illegal combination
    for (const combo of illegalCombinations) {
      if (combo.condition()) {
        return {
          isIllegal: true,
          message: combo.message
        };
      }
    }
    
    // Additional check for maximum number of color bets
    const colorBets = existingBets.filter(bet => ["red", "green", "violet"].includes(bet));
    if (["red", "green", "violet"].includes(currentSelection) && colorBets.length >= 2) {
      return {
        isIllegal: true,
        message: "Cannot bet on more than 2 colors in the same period"
      };
    }
    
    return { isIllegal: false };
  };


  // Handles the random selection animation
  const handleRandomSelection = () => {
    setIsRandomizing(true);
    let currentIndex = 0;
    const totalItems = 10;
    const intervalSpeed = 100; // Slower animation
    const animationDuration = 2000; // Longer duration for smoother feel
    const iterations = Math.floor(animationDuration / intervalSpeed);
    let count = 0;

    const animationInterval = setInterval(() => {
      setAnimatedIndex(currentIndex);
      currentIndex = (currentIndex + 1) % totalItems;
      count++;

      if (count >= iterations) {
        clearInterval(animationInterval);
        const finalIndex = Math.floor(Math.random() * totalItems);
        setAnimatedIndex(finalIndex);
        const eventType =
          finalIndex === 0
            ? "mix1"
            : finalIndex === 5
            ? "mix2"
            : finalIndex % 2 === 1
            ? "green"
            : "red";
        handleEventSelection(eventType);
        handleOpenDrawer(finalIndex.toString());
        setTimeout(() => {
          setIsRandomizing(false);
          setAnimatedIndex(null);
        }, 1000); // Longer delay before resetting
      }
    }, intervalSpeed);
  };

  useEffect(() => {
    if (timerKey) {
      console.log("Timer key received:", timerKey); // Console log the timerKey

      // Map timerKey to corresponding timer details
      const timerMap = {
        "30sec": { id: 4, subtitle: "30sec" }, // New timer entry
        "1min": { id: 1, subtitle: "1min" },
        "3min": { id: 2, subtitle: "3min" },
        "5min": { id: 3, subtitle: "5min" },
      };

      if (timerMap[timerKey]) {
        setActiveId(timerMap[timerKey].id);
        setSelectedTimer(timerMap[timerKey].subtitle);
        navigate(`/timer/${timerKey}`);
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

  const fetchUserData = async () => {
    
    try {
      const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
      const response = await axios.get(`${domain}/user`, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      // console.log("User is----->",response.data.user)
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
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/wingoresult`, {
          params: { timer: selectedTimer },
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        // console.log(response.data);
        // Filter the data based on the selectedTimer
        const filteredData = response.data.Result.filter(
          (item) => item.timer === selectedTimer
        );
        // console.log("This is filter",filteredData);
        setRows(filteredData);
      } catch (err) {
        console.error(err);
      }
    };
    fetchUserData();
    const intervalId = setInterval(fetchUserData, 1000);
    return () => clearInterval(intervalId);
  }, [selectedTimer]);

  useEffect(() => {
    const socket = new WebSocket(`${wssdomain}/`);
    socket.onopen = () => {
      console.log("Connected to WebSocket server");
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
    navigate(`/timer/${newTimerKey}`);
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
      navigate(`/timer/${newTimerKey}`);
      setSelectedTimer(images.find((img) => img.id === id).subtitle);
      setActiveId(id);
    }
  };

  const textArray = [
    "We are excited to welcome you to 747 Lottery , where you can enjoy a wide range of games. But that's not all - there are also plenty of bonuses waiting for you to claim! Join us now and start play your game with 747 Lottery . Get ready for non-stop fun and rewards. Welcome aboard!  Stay tuned for more updates and promotions.",
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
    navigate("/home"); // Replace '/path-to-page' with the actual path
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

  const handleOpenDrawer = (item) => {
    setSelectedItem(item);
    setDrawerOpen(true);
  };

  const handleCloseDrawer = () => {
    setDrawerOpen(false);
  };

  const handleBetAmount = (amount) => {
    setBetAmount(parseFloat(amount).toFixed(2));
  };

  const handleMultiplier = (multiplier) => {
    setMultiplier(multiplier);
  };

  const handleTotalBet = () => {
    setTotalBet(betAmount * multiplier);
  };
  const handlePlaceBet = async () => {
    const totalBet = betAmount * multiplier;
    const randomNumber = Math.floor(1000000000 + Math.random() * 9000000000);
    const randomString = randomNumber.toString();
    
    // Check if user's wallet balance is less than the total bet amount
    if (betAmount === 0) {
      alert("You can't place a bet with 0 amount.");
      return;
    }

    // Calculate available balance by subtracting holdAmount
  const availableBalance = user.walletAmount - (user.holdAmount || 0);
  
  // Check if user has enough available balance
  if (availableBalance < totalBet) {
    setSnackbarSeverity("error");
    setSnackbarMessage("Insufficient available balance. Some funds are on hold.");
    setSnackbarOpen(true);
    return;
  }
    
 
    
    if (["00:06", "00:05", "00:04", "00:03", "00:02", "00:01"].includes(remainingTime)) {
      alert("You can't place a bet in the last 5 seconds.");
      return;
    }
    
    // Check for illegal betting patterns
// In handlePlaceBet function
const illegalCheck = checkIllegalBetting(selectedItem);
if (illegalCheck.isIllegal) {
  setSnackbarSeverity("error");
  setSnackbarMessage(illegalCheck.message);
  setSnackbarOpen(true);
  handleCloseDrawer();
  return;
}
    
    const betData = {
      selectedItem: selectedItem,
      betAmount: betAmount,
      multiplier: multiplier,
      totalBet: totalBet,
      selectedTimer: selectedTimer,
      periodId: periodId,
      result: " ",
      status: " ",
      winLoss: "",
      userType: accountType,
      orderId: randomString
    };
    
    setLastAlertedPeriodId(periodId);
    
    // Send a POST request to the backend API endpoint
    try {
      const token = sessionStorage.getItem('token');
      const response = await axios.post(`${domain}/wingobet/`, betData, {
        withCredentials: true,
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      
      // Add this bet to currentPeriodBets for tracking
      setCurrentPeriodBets([...currentPeriodBets, selectedItem.toLowerCase()]);
      
      console.log(response);
    } catch (err) {
      console.error(err);
    }

    setBetPlaced(true);
    setBetPeriodId(periodId);
    handleCloseDrawer();
    
    // Show success message
    setSnackbarSeverity("success");
    setSnackbarMessage("Bet Succeed!");
    setOpenSnackbar(true);
  };
  useEffect(() => {
    setCurrentPeriodBets([]);
  }, [periodId]);

  const handleCloseSnackbar = (event, reason) => {
    if (reason === "clickaway") {
      return;
    }
    setOpenSnackbar(false);
  };
  const handleCancelBet = () => {
    setSelectedItem("");
    setBetAmount(1);
    setMultiplier(1);
    setTotalBet(0);
    handleCloseDrawer();
  };
  console.log("Game Result is:",gameResult)

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
      setOpenDialog(true);
      setDrawerOpen(false)
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
      case "violet":
        setSelectedColor("#9B48DB");
        setResultColor("Violet");
        break;
      case "green":
        setSelectedColor("RGB(64,173,114)");
        setResultColor("Green");
        break;
      case "red":
        setSelectedColor("RGB(253,86,92)");
        setResultColor("Red");
        break;
      case "yellow":
        setSelectedColor("RGB(71,129,255)");
        setResultColor("Yellow");
        break;
      case "blue":
        setSelectedColor("RGB(71,129,255)");
        setResultColor("Blue");
        break;
      case "big":
        setSelectedColor("rgb(255,168,46)");
        setResultColor("Orange")
        break;
      case "mix1":
        setSelectedColor(
          "linear-gradient(to right, rgb(253,86,92) 50%, rgb(182,89,254) 50%)"
        );
        setResultColor("Purple")
        break;
      case "mix2":
        setSelectedColor(
          "linear-gradient(to right, rgb(64,173,114) 50%, rgb(182,89,254) 50%)"
        );
        setResultColor("Purple")
        break;
      default:
        setSelectedColor("RGB(71,129,255)");
    }
  };

  const [activeButton, setActiveButton] = useState(1);
  const [activeBetAmount, setActiveBetAmount] = useState(1);
  const [customBetAmount, setCustomBetAmount] = useState("");

  const handleCustomBetChange = (event) => {
    const betAmount = parseFloat(event.target.value).toFixed(2);
    setCustomBetAmount(event.target.value);
    if (!isNaN(betAmount) && betAmount > 0) {
      handleBetAmount(betAmount);
      setActiveBetAmount(betAmount);
    }
  };

  let number;
  let resSize;
  let chosedColor;
  const getColorAndSize = (popupresult) => {
    popupresult = Number(popupresult);
    number=popupresult;
    let color = "unknown";
    let size= "";

    if ([1, 3, 7, 9].includes(popupresult)) {
      color = "green";
      chosedColor="green";
    } else if ([2, 4, 6, 8].includes(popupresult)) {
      color = "red";
      chosedColor="red";
    } else if (popupresult === 0) {
      color = "red and violet";
      chosedColor="red and violet"
    } else if (popupresult === 5) {
      color = "green and violet";
      chosedColor="green and violet"
    }

    if (popupresult > 5) {
      size = "big";
      resSize="big"
    } else {
      size = "small";
      resSize="small"
    }

    return `${color} ${popupresult} ${size}`;
  };

  useEffect(() => {
    setTotalBet(betAmount * multiplier);
  }, [betAmount, multiplier]);

  const firstFiveRows = rows.slice(0, 5);

  // Handle multiplier button clicks
  const handleMultiplierChange = (multiplier) => {
    if (multiplier.isRandom && !isRandomizing) {
      handleRandomSelection();
    } else {
      setSelectedMultiplier(multiplier.value);
    }
  };
  useEffect(() => {
    const fetchBets = async () => {
      try {
        const token = sessionStorage.getItem('token'); // Assuming the token is stored in sessionStorage
        const response = await axios.get(`${domain}/user/betshistory`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
  
        const filteredBets = response.data.filter(
          (bet) => bet.selectedTimer === selectedTimer
        );
        console.log(filteredBets);
        setBets(filteredBets);
        console.log("bets is :",bets);
        // console.log(filteredBets)
  
        const currentPeriodId = String(periodId);
        const previousAlertedPeriodId = String(lastAlertedPeriodId);
  
        if (currentPeriodId &&currentPeriodId !== "Loading..."&&currentPeriodId !== previousAlertedPeriodId) {
          const completedBets = response.data.filter(
            (bet) =>
              String(bet.periodId) === previousAlertedPeriodId &&
              bet.status !== " " &&
              bet.result !== " " &&
              bet.winLoss !== ""
          );
  
          if (completedBets.length > 0) {
            console.log("Adding completed bets to popup queue...");
            setPopupQueue(completedBets);
            setCurrentBetIndex(0);
            setLastAlertedPeriodId(currentPeriodId);
            console.log("Popup queue updated:", completedBets);
          }
        }
      } catch (err) {
        console.error("Error fetching user data:", err);
      }
    };
  
    if (periodId && periodId !== "Loading...") {
      fetchBets();
      const intervalId = setInterval(fetchBets, 1000);
  
      return () => clearInterval(intervalId);
    }
  }, [periodId, lastAlertedPeriodId, domain]);
  

  useEffect(() => {
    if (popupQueue.length > 0 && currentBetIndex < popupQueue.length) {
      console.log("popupQueue:", popupQueue);
      console.log("currentBetIndex:", currentBetIndex);

      currentBet= popupQueue[currentBetIndex];

      if (!currentBet) {
        console.error("currentBet is undefined or null.");
        return;
      }

      console.log("Current Bet Object:", currentBet);

      const announceBetResult = async () => {
        console.log(`Announcing bet status: ${currentBet.status}`);
        // console.log(currentBet.status)
        // console.log(currentBet.winLoss)
        // console.log(currentBet.periodId)
        // console.log(currentBet.result)
        // console.log(currentBet.selectedTimer)
        console.log(currentBet);
        setGameResult(currentBet.status);
        setWinLoss(currentBet.winLoss);
        setPopupPeriodId(currentBet.periodId);
        setPopupResult(currentBet.result);
        setPopupTimer(currentBet.selectedTimer);
        setDialogContent(
          currentBet.status === "Succeed" ? "Bonus" : "You lost the bet"
        );

        setOpen(true);
        // console.log("currentBet:", currentBet)
      };

      announceBetResult();

      const timer = setTimeout(() => {
        // setOpen(false);
        setTimeout(() => {
          setCurrentBetIndex((prevIndex) => prevIndex + 1);
        }, 500);
      }, 2000);

      return () => clearTimeout(timer);
    } else {
      console.log(
        "No popup to show, either popupQueue is empty or currentBetIndex exceeds queue length."
      );
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
          setIsChecked(false)
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

  // Split the seconds into two halves
  const firstHalf = seconds1.slice(0, Math.ceil(length / 2));
  const secondHalf = seconds1.slice(Math.ceil(length / 2));
  const [modalOpen, setModalOpen] = useState(false);
  
  // Use useCallback to prevent recreation of these functions on each render
  const handleOpenModal = useCallback(() => {
    setModalOpen(true);
  }, []);
  
  const handleCloseModal = useCallback(() => {
    setModalOpen(false);
  }, []);
  

  
  

  const renderImage = (num) => (
    <div
      key={num}
      style={{
        width: "18%",
        aspectRatio: "1",
        overflow: "hidden",
        borderRadius: "10px",
        
        transition: "all 0.3s ease-in-out",
        transform: animatedIndex === num ? "scale(1.25)" : "scale(1)",
      }}
    >
      <img
        src={`../../games/assets/games/${num}.png`}
        alt={num.toString()}
        style={{
          width: "100%",
          height: "100%",
          objectFit: "cover",
          transition: "transform 0.3s ease-in-out",
        }}
        onClick={() => {
          if (!isRandomizing) {
            handleOpenDrawer(num.toString());
            handleEventSelection(
              num === 0
                ? "mix1"
                : num === 5
                ? "mix2"
                : num % 2 === 1
                ? "green"
                : "red"
            );
          }
        }}
      />
    </div>
  );

  return (
    <div>
      <Mobile>
        <div style={{ backgroundColor: "#F7F8FF" }}>
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
    height: { xs: "auto", sm: "300px" }, // Adjust height responsively
    maxWidth: { xs: "100%", sm: "500px", md: "600px" }, // Control maximum width at different breakpoints
    width: "100%", // Use full available width
    margin: "0 auto", // Center the grid horizontally
    background: "#F95959",
    borderRadius: { xs: "0 0 40px 40px", sm: "0 0 70px 70px" }, // Smaller radius on mobile
    textAlign: "center",
  }}
>
  <Grid
    sx={{
      backgroundImage: `url("../../games/assets/walletbg.png")`,
      backgroundSize: "cover",
      backgroundColor: "#ffffff",
      backgroundPosition: "center",
      margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
      borderRadius: { xs: "20px", sm: "30px" }, // Smaller radius on mobile
      padding: { xs: "8px", sm: "10px" }, // Smaller padding on mobile
      marginTop: { xs: "8px", sm: "10px" }, // Smaller margin on mobile
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
      <Typography variant="h6" sx={{ fontWeight: "bold", fontSize: { xs: "1rem", sm: "1.25rem" } }}>
        {user ? user.walletAmount.toFixed(2) : " Loading"}
      </Typography>
      <IconButton sx={{ color: "black", padding: { xs: "6px", sm: "8px" } }}>
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
        sx={{ marginRight: "10px", color: "#F95959", fontSize: { xs: "1rem", sm: "1.25rem" } }}
      />
      <Typography variant="subtitle2" sx={{ fontSize: { xs: "0.75rem", sm: "0.875rem" } }}>
        Wallet Balance
      </Typography>
    </Grid>
    <Grid
      sm={12}
      mt={{ xs: 2, sm: 3 }}
      item
      sx={{
        display: "flex",
        alignItems: "center",
        justifyContent: "space-between",
      }}
    >
      <Button
        variant="filled"
        onClick={navigateToPage2}
        sx={{
          width: { xs: "110px", sm: "130px" }, // Smaller on mobile
          marginLeft: { xs: "5px", sm: "10px" },
          color: "white",
          backgroundColor: "rgb(250,90,91)",
          "&:hover": {
            backgroundColor: "#D23838",
          },
          borderColor: "#D23838",
          borderRadius: "50px",
          fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
          padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
        }}
      >
        Withdraw
      </Button>
      <Button
        variant="contained"
        onClick={navigateToPage1}
        sx={{
          width: { xs: "110px", sm: "130px" }, // Smaller on mobile
          marginLeft: { xs: "5px", sm: "10px" },
          backgroundColor: "rgb(24,183,97)",
          "&:hover": {
            backgroundColor: "#17B15E",
          },
          borderRadius: "50px",
          fontSize: { xs: "0.75rem", sm: "0.875rem" }, // Smaller font on mobile
          padding: { xs: "6px 12px", sm: "8px 16px" }, // Adjust padding for mobile
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
      borderRadius: { xs: "15px", sm: "20px" }, // Smaller radius on mobile
      width: { xs: "calc(100% - 20px)", sm: "90%" }, // Calculate width based on available space
      padding: { xs: "0 3px", sm: "0 5px" }, // Less padding on mobile
      display: "flex",
      alignItems: "center",
      justifyContent: "space-between",
      overflow: "hidden",
      margin: { xs: "0 10px 15px 10px", sm: "0 20px 20px 20px" }, // Smaller margins on mobile
    }}
  >
    <IconButton sx={{ padding: { xs: "6px", sm: "8px" } }}>
      <VolumeUpIcon sx={{ color: "#F95959", fontSize: { xs: "1rem", sm: "1.25rem" } }} />
    </IconButton>

    <Box sx={{ flex: 1, overflow: "hidden", padding: { xs: "0 6px", sm: "0 10px" } }}>
      <CSSTransition
        in={inProp}
        timeout={500}
        classNames="message"
        unmountOnExit
      >
        <Typography
          sx={{
            color: "#8c90a6",
            fontSize: { xs: "11px", sm: "12.8px" }, // Smaller text on mobile
            display: "-webkit-box",
            WebkitBoxOrient: "vertical",
            textAlign: "left",
            overflow: "hidden",
            WebkitLineClamp: 2,
            lineClamp: 2,
            textOverflow: "ellipsis",
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
        fontSize: { xs: "10px", sm: "11px" }, // Smaller text on mobile
        textTransform: "initial",
        padding: { xs: "3px 10px", sm: "4px 12px" }, // Smaller padding on mobile
        color: "#ffffff",
      }}
    >
      Details
    </Button>
  </Grid>
</Grid>
         
<Box 
  sx={{ 
    display: { xs: 'block', sm: 'none' } // Show on xs (mobile) screens, hide on sm (600px+) and above
  }}
>
  <br/>
  <br/>
  <br/>
  <br/>
</Box>
          <Grid
            container
            spacing={1}
            sx={{
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "93%",
            
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
                      ? "linear-gradient(180deg, #FFB2B2 0%, #FFF 90.5%)"
                      : "transparent",
                  borderRadius: "10px",
                  display: "flex",
                  flexDirection: "column",
                  alignItems: "center",
                  justifyContent: "center",
                }}
              >
                <img
                  src={activeId === image.id ? "https://www.66lottery9.com/static/games/time_a.png" : image.src}
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
                    Win Go
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


         <br/> 
      <Grid
      container
      spacing={0}
      mt={3}
      sx={{
        height:"105px",
        maxWidth: "90%",
        margin: "auto",
        background: "#F95959",
        borderRadius: "15px",
        padding: "3px",
        display: "flex",
        alignItems: "center",
        position: "relative",
  
      }}
    >
      {/* Top Cut-Out Circle */}
      <Box
        sx={{
          position: "absolute",
          top: "-10px",
          left: "50%",
          width: "20px",
          height: "20px",
          backgroundColor: "rgb(242,242,241)",
          borderRadius: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Bottom Cut-Out Circle */}
      <Box
        sx={{
          position: "absolute",
          bottom: "-10px",
          left: "50%",
          width: "20px",
          height: "20px",
          backgroundColor: "rgb(242,242,241)",
          borderRadius: "50%",
          transform: "translateX(-50%)",
        }}
      />

      {/* Left Side - How to Play & Winning Numbers */}
      <Grid
        item
        xs={6}
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-start",
          paddingLeft: "2%",
        }}
      >
        {/* "How to Play" Button */}
        <>
      <Button
        variant="outlined"
        size="small"
        sx={{
          width: "150px",
          color: "white",
          borderColor: "white",
          padding: "2px 8px",
          textTransform: "initial",
          borderRadius: "20px",
          fontSize: "10px",
          display: "flex",
          alignItems: "center",
        }}
        startIcon={<NoteIcon />}
        onClick={handleOpenModal}
        disableRipple={false}
        disableTouchRipple={false}
      >
        How to play
      </Button>
      
      {/* Only render the modal when it's actually open */}
      {modalOpen && (
        <GameRulesModal open={modalOpen} handleClose={handleCloseModal} />
      )}
    </>
        {/* Win Timer Text */}
        <Typography variant="caption" sx={{ color: "white", mt: 0 }}>
          {`Win Go ${selectedTimer}`}
        </Typography>

        {/* Winning Numbers */}
        <Box sx={{ display: "flex", mt: 0}}>
          {firstFiveRows.map((row, index) => (
            <img
              key={index}
              src={`../../games/assets/games/${row.numberOutcome.trim()}.png`}
              alt={`Image ${index + 1}`}
              style={{
                width: "25px",
                height: "25px",
                marginRight: index !== firstFiveRows.length - 6 ? "6px" : "0",
              }}
            />
          ))}
        </Box>
      </Grid>

      {/* Dashed Divider */}
      <Box
        sx={{
          position: "absolute",
          height: "80%",
          width: "0px",
          // background: "white",
          left: "50%",
          transform: "translateX(-50%)",
          borderLeft: "3px dotted rgba(243, 227, 227, 0.86)",
          marginLeft: "1px",
        }}
      />

      {/* Right Side - Timer */}
      <Grid
  item
  xs={6}
  sx={{
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    paddingLeft:"15%",
    paddingRight: "4%",
    width: "100%", // Ensure full width
  }}
>
  {/* "Time Remaining" Label */}
  <Typography variant="caption" sx={{ color: "white",fontWeight:"300px" }}>
    Time remaining
  </Typography>

  {/* Countdown Timer */}
  <Box sx={{ display: "flex", mt: 0, justifyContent: "flex-end", width: "100%",paddingLeft:4 }}>
    {[minutes[0], minutes[1], ":", seconds[0], seconds[1]].map((char, index) => (
      <Box
        key={index}
        sx={{
          width: "22px",
          height: "30px",
          backgroundColor: char === ":" ? "#f2f2f1" : "#f2f2f1",
          color: "#000",
          fontWeight: "bold",
          textAlign: "center",
          lineHeight: "30px",
          margin: "0 2px",
          fontSize: "18px",
        }}
      >
        {char}
      </Box>
    ))}
  </Box>

  {/* Period ID */}
  <Typography variant="caption" sx={{ color: "white", fontSize: "14px", mt: 1 }}>
    {periodId ? periodId : ""}
  </Typography>
</Grid>
    </Grid>
          <Grid
            container
            mt={2}
            spacing={2}
            sx={{
              // boxShadow: "0px 4px 8px #f2f2f1",
              marginLeft: "auto",
              marginRight: "auto",
              maxWidth: "95%",
              borderRadius: "15px",
              backgroundColor: "#ffffff",
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
            {/* First Row */}
            <Grid 
  item 
  xs={12} 
  container 
  justifyContent="space-evenly" 
  sx={{
    boxShadow: "none",
    flexWrap: "nowrap",
    px: 1 // Add padding to avoid buttons touching screen edges
  }}
>
  <Button
    onClick={() => {
      handleOpenDrawer("green");
      handleEventSelection("green");
    }}
    variant="contained"
    sx={{
      backgroundColor: "rgb(24,183,97)",
      "&:hover": {
        backgroundColor: "RGB(64,173,114)",
      },
      width: { xs: "30%", md: "100px" }, // 30% on small screens, 100px on medium+
      minWidth: "min-content",
      borderRadius: "0 10px 0 10px",
      px: { xs: 1, sm: 2 }, // Reduce padding on small screens
      fontSize: { xs: "0.7rem", sm: "0.875rem" }, // Smaller font on xs screens
      mx: 0.5 // Small margin between buttons
    }}
  >
    Green
  </Button>
  <Button
    onClick={() => {
      handleOpenDrawer("violet");
      handleEventSelection("violet");
    }}
    variant="contained"
    sx={{
      backgroundColor: "rgb(200,111,254)",
      "&:hover": {
        backgroundColor: "#9B48DB",
      },
      width: { xs: "30%", md: "100px" }, // 30% on small screens, 100px on medium+
      minWidth: "min-content",
      borderRadius: "10px",
      color: "white",
      px: { xs: 1, sm: 2 }, // Reduce padding on small screens
      fontSize: { xs: "0.7rem", sm: "0.875rem" }, // Smaller font on xs screens
      mx: 0.5 // Small margin between buttons
    }}
  >
    Violet
  </Button>
  <Button
    onClick={() => {
      handleOpenDrawer("red");
      handleEventSelection("red");
    }}
    variant="contained"
    sx={{
      backgroundColor: "rgb(250,90,91)",
      "&:hover": {
        backgroundColor: "RGB(253,86,92)",
      },
      width: { xs: "30%", md: "100px" }, // 30% on small screens, 100px on medium+
      minWidth: "min-content",
      borderRadius: "10px 0 10px 0",
      px: { xs: 1, sm: 2 }, // Reduce padding on small screens
      fontSize: { xs: "0.7rem", sm: "0.875rem" }, // Smaller font on xs screens
      mx: 0.5 // Small margin between buttons
    }}
  >
    Red
  </Button>
</Grid>
            {/* Second Row */}
            <Grid
              container
              mt={2}
              sx={{
                backgroundColor: "#f2f2f1",
                marginLeft: "auto",
                marginRight: "auto",
                maxWidth: "95%",
                borderRadius: "20px",
                padding: "20px",
              }}
            >
              <Grid
                item
                xs={12}
                mb={2}
                container
                justifyContent="space-between"
              >
                {[0, 1, 2, 3, 4].map(renderImage)}
              </Grid>
              <Grid item xs={12} container justifyContent="space-between">
                {[5, 6, 7, 8, 9].map(renderImage)}
              </Grid>
            </Grid>

<Box
  sx={{
    mt:2,
    width: "100%",
    marginX: "auto",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    gap: 0.3, // Reduced gap for a compact look
    p: 0.5, // Less padding
  }}
>
  {/* Random Button - Fully Rounded */}
  <StyledButton
    onClick={() => handleMultiplierChange(multipliers[0])}
    disabled={isRandomizing}
    sx={{
      borderRadius: "9px", // Fully rounded
      border: "1px solid red",
      color: "red",
      background: selectedMultiplier === multipliers[0].value ? "rgba(255, 0, 0, 0.1)" : "transparent",
      px: 2,
      py: 1, // Smaller padding
      minWidth: "45px", // Reduced size
      fontSize: "12px", // Smaller text
      fontWeight: "bold",
    }}
  >
    RANDOM
  </StyledButton>

  {multipliers.slice(1).map((multiplier) => (
    <StyledButton
      key={multiplier.label}
      onClick={() => handleMultiplierChange(multiplier)}
      disabled={isRandomizing}
      sx={{
        borderRadius: "8px", // Slightly rounded
        color: selectedMultiplier === multiplier.value ? "white" : "black",
        background: selectedMultiplier === multiplier.value ? "rgb(24,183,97)" : "rgb(247,248,255)", // Change when selected
        px: 1.2,
        py: 1, // Smaller padding
        minWidth: "35px", // Smaller button width
        fontSize: "12px", // Smaller text
        fontWeight: selectedMultiplier === multiplier.value ? "bold" : "normal",
        transition: "0.2s ease-in-out", // Smooth transition
      }}
    >
      {multiplier.label}
    </StyledButton>
  ))}
</Box>


            {/* Fourth Row */}
            <Grid
  container
  item
  xs={12}
  justifyContent="center"
  sx={{ marginBottom: "10px", marginLeft: 0 }}
>
  <Grid 
    container 
    item 
    justifyContent="center"
    sx={{
      flexWrap: "nowrap",
      maxWidth: "100%"
    }}
  >
    <Grid item sx={{ flex: 1 }}>
      <Button
        onClick={() => {
          handleOpenDrawer("big");
          handleEventSelection("big");
        }}
        variant="contained"
        fullWidth
        sx={{
          maxWidth: "170px",
          minWidth: "85px",
          borderRadius: "20px 0 0 20px",
          margin: "0",
          backgroundColor: "#F95959",
          "&:hover": {
            backgroundColor: "rgb(255,168,46)",
          },
        }}
      >
        Big
      </Button>
    </Grid>
    <Grid item sx={{ flex: 1 }}>
      <Button
        onClick={() => {
          handleOpenDrawer("small");
          handleEventSelection("small");
        }}
        variant="contained"
        fullWidth
        sx={{
          maxWidth: "170px",
          minWidth: "85px",
          borderRadius: "0 20px 20px 0",
          margin: "0",
          backgroundColor: "rgb(110,169,245)",
        }}
      >
        Small
      </Button>
    </Grid>
  </Grid>
</Grid>
          </Grid>

          <Snackbar
            open={openSnackbar}
            autoHideDuration={500}
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
              Bet Succeed !
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
                    background: selectedColor,
                    clipPath: "polygon(50.7% 100.3%, 100.1% 61%, 100.1% 0%, 0% 0%, 0.1% 71.3%)",
                  }}
                >
                   <Typography variant="h6">{`Win Go ${selectedTimer}`}</Typography>
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
            backgroundColor: activeBetAmount === amount ? selectedColor : "#f2f2f1",
            color: activeBetAmount === amount ? "white" : "#666",
            "&:hover": {
              backgroundColor: activeBetAmount === amount ? selectedColor : "#f2f2f1",
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
      <RemoveIcon fontSize="small" sx={{ color: selectedColor, fontSize: 30 }} />
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
      <AddIcon fontSize="small" sx={{ color: selectedColor, fontSize: 30 }} />
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
              ? { backgroundColor: selectedColor, color: "white" }
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
                      style={{ background: selectedColor }}
                      variant="contained"
                    >{`Total Amount: ${betAmount * multiplier}`}</Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Drawer>

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
                    <CustomTable data={rows} />
                  </TabPanel>
                )}
                {activeTab === 1 && (
                  <TabPanel>
                    <RowVisualization data={rows} />
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
                                        bet.selectedItem.toLowerCase() ===
                                          "green" ||
                                        [1, 3, 7, 9].includes(
                                          Number(bet.selectedItem)
                                        )
                                          ? "RGB(64,173,114)"
                                          : bet.selectedItem.toLowerCase() ===
                                              "red" ||
                                            [2, 4, 6, 8].includes(
                                              Number(bet.selectedItem)
                                            )
                                          ? "RGB(253,86,92)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "violet"
                                          ? "RGB(182,89,254)"
                                          : bet.selectedItem.toLowerCase() ===
                                            "big"
                                          ? "#ffa82e" // Background color for "big"
                                          : bet.selectedItem.toLowerCase() ===
                                            "small"
                                          ? "#1876d2" // Background color for "small"
                                          : Number(bet.selectedItem) === 0
                                          ? "#F95959"
                                          : Number(bet.selectedItem) === 5
                                          ? "#F95959"
                                          : "#F95959",
                                      color: "white",
                                      height: "40px",
                                      width: "40px",
                                      display: "flex",
                                      border: "none",
                                      justifyContent: "center",
                                      alignItems: "center",
                                    }}
                                  >
                                    <Typography sx={{ fontSize: "10px" }}>
                                      {bet.selectedItem.toUpperCase()}
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
                                          : bet.status === "Suceed"
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
                                            bet.status === "Failed"
                                             ? "orange" // Color for Pending status
                                            : bet.winLoss >= 0
                                            ? "green"
                                            : "red",
                                          }}
                                        >
                                            {bet.status==="Failed"||bet.status==="Succeed"?bet.status:"Pending"}
                                        </Typography>
                                      </Box>
                                  <Typography
                                    variant="body2"
                                    sx={{
                                      color:
                                        bet.status === "Failed"
                                          ? "error.main"
                                          : "success.main",
                                      fontWeight: "bold",
                                    }}
                                  >
                                  {bet.status === "Failed"
    ? `-₹${Math.abs(bet.winLoss).toFixed(2)}`
    : bet.status === "Succeed"
        ? `+₹${Math.abs(bet.winLoss).toFixed(2)}`
        : ``
}
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
                                      value: `₹${parseFloat(
                                        bet.betAmount
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Quantity",
                                      value: bet.multiplier,
                                    },
                                    {
                                      label: "Amount after tax",
                                      value: `₹${parseFloat(
                                        bet.totalBet
                                      ).toFixed(2)}`,
                                    },
                                    {
                                      label: "Tax",
                                      value: `₹${parseFloat(bet.tax).toFixed(
                                        2
                                      )}`,
                                    },
                                    { label: "Result", value: bet.result },
                                    {
                                      label: "Select",
                                      value: bet.selectedItem,
                                    },
                                    { label: "Status", value: bet.status },
                                    {
                                      label: "Win/lose",
                                      value:
                                        bet.winLoss > 0
                                          ? `+₹${parseFloat(
                                              bet.winLoss
                                            ).toFixed(2)}`
                                          : `₹${parseFloat(bet.winLoss).toFixed(
                                              2
                                            )}`,
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
                                        ) : row.label === "Result" ? (
                                          <Typography
                                            sx={{
                                              color: "black",
                                              fontSize:
                                                Number(row.value) >= 0 &&
                                                Number(row.value) <= 4
                                                  ? "16px"
                                                  : "16px",
                                            }}
                                          >
                                            {row.value}{" "}
                                            {Number(row.value) >= 0 &&
                                            Number(row.value) <= 4 ? (
                                              <span
                                                style={{ color: "#6ea8f4" }}
                                              >
                                                Small
                                              </span>
                                            ) : (
                                              <span
                                                style={{ color: "#feaa57" }}
                                              >
                                                Big
                                              </span>
                                            )}{" "}
                                            {Number(row.value) === 0 ? (
                                              <span >
                                               <span style={{ color: "violet" }}>Violet</span> | <span style={{ color: "red" }}>Red</span>
                                              </span>
                                              
                                            ) : [1, 3, 7, 9].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "green" }}>
                                                Green
                                              </span>
                                            ) : [2, 4, 6, 8].includes(
                                                Number(row.value)
                                              ) ? (
                                              <span style={{ color: "red" }}>
                                                Red
                                              </span>
                                            ) : Number(row.value) === 5 ? (
                                              <span >
                                               <span style={{ color: "violet" }}>Violet</span> | <span style={{ color: "green" }}>Green</span>
                                              </span>
                                            ) : (
                                              <span style={{ color: "black" }}>
                                                Unknown
                                              </span>
                                            )}
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
                                            {row.value}
                                          </Typography>
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
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(59, 53, 53, 0.6)", // Backdrop effect
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
        color: "#fff",
        fontWeight: "bold",
        textAlign: "center",
        fontSize: "clamp(16px, 4vw, 24px)", // Responsive font size
        marginTop: "70px"
      }}
    >
      {gameResult === "Succeed" ? "Congratulations" : "Sorry"}
    </Typography>

    {/* Lottery Results Section */}
    <div
      style={{
        display: "flex",
        gap: "clamp(5px, 1vw, 10px)",
        alignItems: "center",
        justifyContent: "center",
        width: "100%",
      }}
    >
      {/* Lottery Result Tags */}
      <div
        style={{
          display: "flex",
          alignItems: "center",
          gap: "clamp(4px, 0.8vw, 8px)",
          background: "transparent",
          padding: "clamp(2px, 0.8vw, 4px) clamp(5px, 1vw, 10px)",
          borderRadius: "20px",
          flexWrap: "wrap",
          justifyContent: "center",
        }}
      >
        <Typography
          variant="body1"
          style={{
            color: "#fff",
            fontWeight: "normal",
            fontSize: "clamp(12px, 2.5vw, 15px)",
          }}
        >
          Lottery results
        </Typography>

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
          {rows[0]?.colorOutcome?.length > 1
            ? `${rows[0]?.colorOutcome[0]} and ${rows[0]?.colorOutcome[1]}`
            : rows[0]?.colorOutcome[0]}
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
          {rows[0]?.numberOutcome}
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
          {rows[0]?.sizeOutcome}
        </div>
      </div>
    </div>

    {/* Bonus/Lose Section */}
    <div
      style={{
        marginTop: "clamp(60px, 4vw, 40px)",
        textAlign: "center",
      }}
    >
      <Typography
        variant="h7"
        style={{
          color: gameResult === "Succeed" ? "#28a745" : "#dc3545",
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

  {/* Close button */}
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
      top: "50%",
      transform: "translateY(-50%)",
      zIndex: 2001,
      marginTop:"220px"
    }}
  >
    <CloseIcon style={{ fontSize: "clamp(16px, 3.2vw, 24px)" }} />
  </Button>
</div>
        </div>
        <br />
        <br />
        <br />
        <Snackbar
          open={openSnackbar}
          autoHideDuration={snackbarSeverity === "error" ? 5000 : 500}
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
            severity={snackbarSeverity}
            style={{ 
              backgroundColor: snackbarSeverity === "error" ? "rgba(211, 47, 47, 0.9)" : "rgba(0, 0, 0, 0.7)",
              color: "white" 
            }}
          >
            {snackbarMessage}
          </MuiAlert>
        </Snackbar>
      </Mobile>
    </div>
  );
};

export default Head;
//order id updated
