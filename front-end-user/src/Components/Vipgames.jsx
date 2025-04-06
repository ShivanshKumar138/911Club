import React, { useState , useEffect,useCallback} from "react";
import { AppBar, Tabs, Tab, Grid, Box ,} from "@mui/material";
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { domain } from "../Components/config";
import axios from "axios";
import { styled } from "@mui/material/styles";
import jdb from "../../public/tabsIcon/JDB.svg";
import jilli from "../../public/tabsIcon/JILLI.svg";
import TopBet from "../../public/tabsIcon/TopBet.svg";
import {TextField, InputAdornment, Toolbar } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import ArrowBackIosNewIcon from "@mui/icons-material/ArrowBackIosNew";
import { useRef } from "react";
import { useNavigate } from "react-router-dom";
const TabPanel = ({ children, value, index }) => {
  return (
    <div role="tabpanel" hidden={value !== index}>
      {value === index && <Box p={3}>{children}</Box>}
    </div>
  );
};

const App = () => {

  const navigate=useNavigate();
  const navigateToPage = () => {
    navigate("/home"); // Replace '/path-to-page' with the actual path
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);


    // setTimeout(() => {
    //   setTabValue((prev) => (prev + 1));
    // }, 800); // Adjust delay as needed
  };
  const [tabValue, setTabValue] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState("");
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [accountType, setAccountType] = useState('');

  // const totalTabs = 10; // Change this to the actual number of tabs
  
 
  const tabsRef = useRef(null);

  const StyledDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialog-paper": {
      width: "70%",
      maxWidth: "330px",
      borderRadius: "15px",
      overflow: "hidden",
      boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
    },
  }));

  const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
    backgroundColor: "#4c8eff",
    color: "white",
    padding: theme.spacing(1.5),
  }));

  const StyledDialogContent = styled(DialogContent)(({ theme }) => ({
    padding: theme.spacing(2.5),
  }));

  const StyledDialogActions = styled(DialogActions)(({ theme }) => ({
    padding: theme.spacing(2, 3),
    backgroundColor: "#f5f5f5",
  }));

  const StyledButton = styled(Button)(({ theme }) => ({
    borderRadius: "10px",
    padding: theme.spacing(1, 2),
    textTransform: "none",
    // fontWeight: "bold",
  }));
const RechargeDialog = ({ open, onClose, onConfirm, selectedGame }) => {
  return (
    <StyledDialog open={open} onClose={onClose}>
      <StyledDialogTitle>
        <Typography variant="h6" component="div" fontWeight="bold">
          Recharge Required
        </Typography>
      </StyledDialogTitle>
      <StyledDialogContent>
        <Typography sx={{ marginTop: "0.5rem" }} variant="body1" gutterBottom>
          To enter{" "}
          <Box component="span" fontWeight="bold">
            {selectedGame?.game}
          </Box>
          , you need to make a deposit first.
        </Typography>
        <Typography variant="body2" color="text.secondary" mt={2}>
          Recharging your account will allow you to enjoy all the exciting
          features of our games!
        </Typography>
      </StyledDialogContent>
      <StyledDialogActions>
        <StyledButton onClick={onClose} color="inherit">
          Cancel
        </StyledButton>
        <StyledButton
          onClick={onConfirm}
          variant="contained"
          style={{ backgroundColor: "#4c8eff", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};



useEffect(() => {
    const checkDepositStatus = async () => {
      setIsDepositCheckLoading(true);
      try {
        const token = sessionStorage.getItem('token');
        const userResponse = await axios.get(`${domain}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const depositResponse = await axios.get(`${domain}/need-to-deposit-first`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        
        const hasFirstDeposit = userResponse?.data?.user?.firstDepositMade;
        const needsDeposit = depositResponse?.data?.data?.needToDepositFirst;
        const userAccountType = userResponse?.data?.user?.accountType;
  
        setFirstDepositMade(hasFirstDeposit);
        setNeedToDepositFirst(needsDeposit);
        setHasDeposit(!needsDeposit || hasFirstDeposit);
        setAccountType(userAccountType); // Store the account type
  
      } catch (error) {
        console.error("Error checking deposit status:", error);
        setHasDeposit(false);
      } finally {
        setIsDepositCheckLoading(false);
      }
    };
  
    checkDepositStatus();
  }, []);
  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  
  const flashGames = [
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortune-gems-2",
        "gameId": "223",
        "gameName": "Fortune Gems 2",
        "slug": "fgp",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/LGmOw0w4iklkLKXz81LfNjNFjDQw5IlZgRSULqy2.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortune-gems-3",
        "gameId": "300",
        "gameName": "Fortune Gems 3",
        "slug": "fg3",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/8lYBJBMzSLs2Rb6DTsHe4h8jmBfVeeUElsE8qbWa.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortune-gems",
        "gameId": "109",
        "gameName": "Fortune Gems",
        "slug": "fg",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/7hnsYn70DF8p9aAUBr9tPoqMjSDbBxzvNhXdrgle.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "crazy-seven",
        "gameId": "35",
        "gameName": "Crazy Seven",
        "slug": "ols2",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/W0rhf4hboBqVZVD8TMfV7TYULMgRZlVkIUXw1Fqp.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "charge-buffalo",
        "gameId": "47",
        "gameName": "Charge Buffalo",
        "slug": "bfs",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/MPtl94BJIgoZGkDzs7iNMHBnkQKKWRJfsxEAW8jl.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "mega-ace",
        "gameId": "134",
        "gameName": "Mega Ace",
        "slug": "mw4",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/KhQJkNq2D5g7XaZQcgmHokHLENlr5nHenQqghQIp.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "super-rich",
        "gameId": "100",
        "gameName": "Super Rich",
        "slug": "sr",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/tVWxwz3tQMKa3TPfMjq9GIm7pwiyEKHGWmDMlO0P.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "boxingking",
        "gameId": "77",
        "gameName": "BoxingKing",
        "slug": "bk",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/M5LoqW4yYYVmbMs8jrlBWppsFhMDSWqE9yqINrgc.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "golden-bank",
        "gameId": "45",
        "gameName": "Golden Bank",
        "slug": "cbt",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/CzjCNYAOnopzNiDJgdfg7I6ZqWoO2bwqxGRMV8t5.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "aztec-priestess",
        "gameId": "209",
        "gameName": "Aztec Priestess",
        "slug": "ap",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/a7vxY4coDk5pFrwsZZ2kY8NsM1Bnb1rNK8kLXWBo.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "ali-baba",
        "gameId": "110",
        "gameName": "Ali Baba",
        "slug": "ali",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/trieiElNLzrCM5dBtXg1yteriX4r8kQxru2xrtOO.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "lucky-coming",
        "gameId": "91",
        "gameName": "Lucky Coming",
        "slug": "ifff",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/84zKPNK3RzuNY5tJh9E2jwIV5kzpxZBv4QoRfx9E.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "crazy-fafafa",
        "gameId": "40",
        "gameName": "Crazy FaFaFa",
        "slug": "ols3",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/xMq0C95WRtknLJC8ISOjiLD3p79oeaw2dcUqjZcD.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortune-tree",
        "gameId": "6",
        "gameName": "Fortune Tree",
        "slug": "luckytree",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/1nJZS31DrT0NJqDfcfVDR5DGS12TiKniUahJ4efj.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "book-of-gold",
        "gameId": "87",
        "gameName": "Book of Gold",
        "slug": "bog",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/Qw37suZFMwVp2VJr5JwxD88mEAEln7oEtCkRQBLc.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "jungle-king",
        "gameId": "16",
        "gameName": "Jungle King",
        "slug": "kk2",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/znfDyGil7KHqljcKEyK5eaUAeA0l0A0DWSMeT2Ma.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "magic-lamp",
        "gameId": "108",
        "gameName": "Magic Lamp",
        "slug": "mw3",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/nLgQLeo2bdl3ZV33xKuWCq36m5IADrGXWjpnECcr.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "devil-fire-2",
        "gameId": "258",
        "gameName": "Devil Fire 2",
        "slug": "dl",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/3flwlSPsPtpqvPxZh2MKZuUNhGFvNzYO8YPucdi0.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "gold-rush",
        "gameId": "137",
        "gameName": "Gold Rush",
        "slug": "ge",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/SutNHWQCT0brUMPFoGtHWyhxDaV4faH5UJNQK2nF.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "twin-wins",
        "gameId": "106",
        "gameName": "TWIN WINS",
        "slug": "twinwins",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/fLafPjEM19jK7sdCoMJsXtzuRp4wDrvwg56vpGKn.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "bonus-hunter",
        "gameId": "142",
        "gameName": "Bonus Hunter",
        "slug": "bh",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/sGwnH7w0dmV98sYjXkGjH20zhziGYkiWqD3pvICz.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "world-cup",
        "gameId": "146",
        "gameName": "World Cup",
        "slug": "fb",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/RubvW163jBzIJIj7Ls8DseMYyS39cNnlbcwLqefX.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "pharaoh-treasure",
        "gameId": "85",
        "gameName": "Pharaoh Treasure",
        "slug": "mw",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/rwR2jADCmzvGxtGvgHkV1Dd9VC4ibn85Wa4vbrNq.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortune-monkey",
        "gameId": "303",
        "gameName": "Fortune Monkey",
        "slug": "mp2",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/1c09luDhnuarYPWmhNZGFLbKvMkksQblvHe5ekrM.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "golden-queen",
        "gameId": "58",
        "gameName": "Golden Queen",
        "slug": "gq",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/Aw9r80iVAeb4r93PrkruL8NskWqaEB4AKGCdGNsi.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "legacy-of-egypt",
        "gameId": "180",
        "gameName": "Legacy of Egypt",
        "slug": "loe",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/wmngGe7gHkKjth12VLoQy60S5E68qGD8SkZDrQW3.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fa-fa-fa",
        "gameId": "21",
        "gameName": "Fa Fa Fa",
        "slug": "ols",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/YVH4ILoaSoPVtFWrDHWR5M4xecy4SrL8m1OyNY6q.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "samba",
        "gameId": "136",
        "gameName": "Samba",
        "slug": "samba",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/uqju8fzqNHgGOzBMfGAk86UwV3iSRhh2dJ9Ig434.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "pirate-queen",
        "gameId": "164",
        "gameName": "Pirate Queen",
        "slug": "pirate",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/4ubG7KPOLQdHN5xdrX4gI8gWrY9ysIGlxZ5LcpmW.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "roma-x",
        "gameId": "102",
        "gameName": "Roma X",
        "slug": "rs2",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/BpFXjfHC5tyw1VgLnaD0ndSQR5HCTPL1t7g7Mpjj.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "bone-fortune",
        "gameId": "126",
        "gameName": "Bone Fortune",
        "slug": "dotd",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/0NMm5znugdsgOagdTNGinTDLOCWmBljNVyKBuccK.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "mayan-empire",
        "gameId": "135",
        "gameName": "Mayan Empire",
        "slug": "me",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/GRydicVLIcV1EliCXdwpTFUPStmb2tdOBusaYm9R.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "devil-fire",
        "gameId": "193",
        "gameName": "Devil Fire",
        "slug": "df",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/DxIOnb8tRRFzDYCRnNfDB96W1c5hW05FcJnYcQe3.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "god-of-martial",
        "gameId": "4",
        "gameName": "God Of Martial",
        "slug": "tks",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/9VNpMeB5LhtPyXMHAqUEIS2934BmdDwnfS5aork4.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "cricket-king-18",
        "gameId": "225",
        "gameName": "Cricket King 18",
        "slug": "ctk",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/Yc0iRAnTEZQ1z1zRIKTGNdRrHRX7IwlekGes8kAs.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "xiyangyang",
        "gameId": "43",
        "gameName": "XiYangYang",
        "slug": "xiyangyang",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/rv03MnyE113hguP39QJczWJ9aLo8KZuhXJAmtdSi.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "bao-boon-chin",
        "gameId": "36",
        "gameName": "Bao boon chin",
        "slug": "bbc",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/anLonuWIeJpa4dHWHFuPuPdvjgGTGuaqj9Yg5197.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fortunepig",
        "gameId": "33",
        "gameName": "Fortune Pig",
        "slug": "pp",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/qcHiZHhXxf3sS8tjqBIQmleM0dZP6Zd8aRoTTiRm.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "thor-x",
        "gameId": "130",
        "gameName": "Thor X",
        "slug": "thor",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/hIqrVrY2nxEAKQa7usmdsB5wzDau4xb8sj62Mncs.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "the-pig-house",
        "gameId": "263",
        "gameName": "The Pig House",
        "slug": "tph",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/PG6prYy7tSW1EJq6nhSxHwzoGJCyaUD5upKRus0E.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "agent-ace",
        "gameId": "115",
        "gameName": "Agent Ace",
        "slug": "aa",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/4iJOHHJMtF4wC89eaUiMLpQrTZWh7Ox15lgZSBV8.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "night-city",
        "gameId": "37",
        "gameName": "Night City",
        "slug": "sweetheart5",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/l9tglMO9cITw8GJGwWjGKfyGmMDFW3Y9muWnNsH8.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "fengshen",
        "gameId": "38",
        "gameName": "Fengshen",
        "slug": "fs",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/2zyjnzyHpfxBBLLSJpK79perLIQQklZHLBJ4tGf1.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "sin-city",
        "gameId": "171",
        "gameName": "Sin City",
        "slug": "sc",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/ucjaOJZCks4bkX8lXguqnCz90DSwMtCYyW2hnubj.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "chin-shi-huang",
        "gameId": "2",
        "gameName": "Chin Shi Huang",
        "slug": "csh",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/zzmyRGegMynQA2xjpexoeNtH7JHZPmIQJE2qzljd.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "witches-night",
        "gameId": "226",
        "gameName": "Witches Night",
        "slug": "witch",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/iVleim1PQh0ru4zigjdFheWL4okAc8869Nt3unkK.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "dabanggg",
        "gameId": "239",
        "gameName": "Dabanggg",
        "slug": "dbg",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/6783DU3wFo7b6LxkeDkOLOCLJ15XzCuLc8fNskGA.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "sweet-land",
        "gameId": "198",
        "gameName": "Sweet Land",
        "slug": "sl",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/6gjWT5M7ESdWCYcF1mF8zRxlffhin11stP3oZi2q.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "cricket-sah-75",
        "gameId": "230",
        "gameName": "Cricket Sah 75",
        "slug": "cts",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/r6H6rqMvIQavFhfFaX831OIUAjNFgSmollvgiY3l.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "zeus",
        "gameId": "252",
        "gameName": "Zeus",
        "slug": "zeus",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/ev52lnWrF6soryGTnt5qafnuPOdHzhDjXoPlTPqf.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "neko-fortune",
        "gameId": "145",
        "gameName": "Neko Fortune",
        "slug": "ln",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/VZRGHowsPgKVO4Wx1Cg1zaK6UBmN1MVjMHzBuHTA.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "king-arthur",
        "gameId": "214",
        "gameName": "King Arthur",
        "slug": "ka",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/U04cnvDwpBW97Okxz7KvZf7eOdlrB4i4gB3iLOce.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "happy-taxi",
        "gameId": "116",
        "gameName": "Happy Taxi",
        "slug": "taxi",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/d3jhadDsYzjki9GA6izGTr7fCV1XKU66NYo3OGk8.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "shanghai-beauty",
        "gameId": "17",
        "gameName": "Shanghai Beauty",
        "slug": "sweetheart",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/XJsWYaFhZtz4szT4NuPihSsPWts5Lw3aPuYdP2Un.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "party-night",
        "gameId": "76",
        "gameName": "Party Night",
        "slug": "nightclub",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/HUOfU0QDJ01vsAGZM01hPtA4el1bmefvZCPadPrs.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "super-ace-deluxe",
        "gameId": "403",
        "gameName": "Super Ace Deluxe",
        "slug": "fullhouse3",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/HskVGEVL6UgOWi8rabMgSoOviMD4pFZNuMU3pdvd.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "super-ace",
        "gameId": "49",
        "gameName": "Super Ace",
        "slug": "fullhouse",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/7ycivbeSFZ2FzMIi4UfVi4vfmALw2iwP3gEaCsmO.png",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "JILI",
        "vendorCode": "slot-jili",
        "gameCode": "bangla-beauty",
        "gameId": "238",
        "gameName": "Bangla Beauty",
        "slug": "bby",
        "imageSrc": "https://storage.googleapis.com/tada-cdn-asia/All-In-One/production/img/jiliPlusPlayer/games/3zYqXEykzJtrTLVBtLVQqHx2NIoy7BgzguIWiGwa.png",
        "isNew": false,
        "underMaintenance": false
    }
];
const slotGames= [
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14087",
      "gameId": "566",
      "gameName": "POP POP CANDY",
      "slug": "PopPopCandy_9be3ad2",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14087/14087_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14086",
      "gameId": "561",
      "gameName": "Open Sesame Mega",
      "slug": "OpenSesameMega_e3b9649",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14086/14086_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14042",
      "gameId": "112",
      "gameName": "TREASURE BOWL",
      "slug": "TreasureBowl_b07419e",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14042/14042_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14085",
      "gameId": "164",
      "gameName": "FRUITY BONANZA",
      "slug": "FruityBonanza_1d36867",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14085/14085_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14083",
      "gameId": "158",
      "gameName": "COOCOO FARM",
      "slug": "CooCooFarm_bb9986d",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14083/14083_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14082",
      "gameId": "157",
      "gameName": "Elemental Link Water",
      "slug": "ElementalLinkWater_3e0af95",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14082/14082_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14080",
      "gameId": "156",
      "gameName": "ELEMENTAL LINK FIRE",
      "slug": "ElementalLinkFire_7a66f5a",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14080/14080_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14077",
      "gameId": "151",
      "gameName": "TRUMPCARD",
      "slug": "TrumpCard_0360606",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14077/14077_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14075",
      "gameId": "150",
      "gameName": "FORTUNE NEKO",
      "slug": "FortuneNeko_b8c3d92",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14075/14075_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14070",
      "gameId": "148",
      "gameName": "BOOK OF MYSTERY",
      "slug": "BookOfMystery_e6a0bf0",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14070/14070_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14068",
      "gameId": "144",
      "gameName": "PROSPERITY TIGER",
      "slug": "ProsperityTiger_2148487",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14068/14068_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14065",
      "gameId": "141",
      "gameName": "BLOSSOM OF WEALTH",
      "slug": "BlossomOfWealth_5d19833",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14065/14065_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14064",
      "gameId": "140",
      "gameName": "BOOM FIESTA",
      "slug": "BoomFiesta_5812115",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14064/14064_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14063",
      "gameId": "139",
      "gameName": "CRAZYBIG THREE DRAGONS",
      "slug": "BigThreeDragons_7d8d7a1",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14063/14063_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14060",
      "gameId": "137",
      "gameName": "LANTERN WEALTH",
      "slug": "LanternWealth_d0a18b5",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14060/14060_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14061",
      "gameId": "136",
      "gameName": "MAYA GOLD",
      "slug": "MayaGoldCrazy_511bc8a",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14061/14061_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14059",
      "gameId": "135",
      "gameName": "MARVELOUS IV",
      "slug": "MarvelousIV_83eeaf2",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14059/14059_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14058",
      "gameId": "134",
      "gameName": "WONDER ELEPHANT",
      "slug": "WonderElephant_1475b76",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14058/14058_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14055",
      "gameId": "129",
      "gameName": "KONG",
      "slug": "Kong_8e754f7",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14055/14055_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14052",
      "gameId": "127",
      "gameName": "JUNGLE JUNGLE",
      "slug": "JungleJungle_a77eff7",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14052/14052_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14054",
      "gameId": "126",
      "gameName": "LUCKY DIAMOND",
      "slug": "LuckyDiamond_6100342",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14054/14054_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "8049",
      "gameId": "102",
      "gameName": "FLIRTING SCHOLAR TANG Ⅱ",
      "slug": "FlirtingScholarTangII_3694939",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/8049/8049_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "8047",
      "gameId": "84",
      "gameName": "WINNING MASK Ⅱ",
      "slug": "WinningMaskII_1acf769",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/8047/8047_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14048",
      "gameId": "121",
      "gameName": "DOUBLE WILDS",
      "slug": "DoubleWilds_da6cbc7",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14048/14048_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14047",
      "gameId": "119",
      "gameName": "MONEYBAGS MAN",
      "slug": "MoneybagsMan_6d11fb2",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14047/14047_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14043",
      "gameId": "116",
      "gameName": "GOLDEN DISCO",
      "slug": "GoldenDisco_3af6d08",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14043/14043_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14045",
      "gameId": "115",
      "gameName": "Super Niubi Deluxe",
      "slug": "SuperNiubiDeluxe_9b59afa",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14045/14045_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14044",
      "gameId": "114",
      "gameName": "FUNKY KING KONG",
      "slug": "FunkyKingKong_333ab98",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14044/14044_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14040",
      "gameId": "107",
      "gameName": "PIRATE TREASURE",
      "slug": "PirateTreasure_75e1ea5",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14040/14040_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14039",
      "gameId": "106",
      "gameName": "FORTUNE TREASURE",
      "slug": "FortuneTreasure_ee5cb6a",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14039/14039_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14038",
      "gameId": "105",
      "gameName": "EGYPT TREASURE",
      "slug": "EgyptTreasure_70c50ad",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14038/14038_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14034",
      "gameId": "100",
      "gameName": "GO LAI FU",
      "slug": "GoLaiFu_6eb505a",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14034/14034_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "8050",
      "gameId": "99",
      "gameName": "FORTUNE HORSE",
      "slug": "FortuneHorse_58f10d7",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/8050/8050_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "14027",
      "gameId": "94",
      "gameName": "777ORIENT",
      "slug": "LuckySeven_f11946f",
      "imageSrc": "https://dl.lfyanwei.com/jdb-assetsv3/games/14027/14027_en.png",
      "isNew": false,
      "underMaintenance": false
  },
  {
      "provider": "JDB",
      "vendorCode": "slot-jdb",
      "gameCode": "8048",
      "gameId": "83",
      "gameName": "OPEN SESAME Ⅱ",
      "slug": "OpenSesameII_274e1b5",
      "imageSrc": "https://i.ibb.co/zZXcGNV/Open-Sesame-II-250x203-en.jpg",
      "isNew": false,
      "underMaintenance": false
  }
];

const popularGames = [
{ imageSrc: "/assets/games/800.jpg", gameId: 800 },
{ imageSrc: "/assets/games/801.jpg", gameId: 801 },
{ imageSrc: "/assets/games/802.jpg", gameId: 802 },
{ imageSrc: "/assets/games/902.jpg", gameId: 902 },
{ imageSrc: "/assets/games/904.jpg", gameId: 904 },
{ imageSrc: "/assets/games/905.jpg", gameId: 905 },
{ imageSrc: "/assets/games/111.jpg", gameId: 111 },
{ imageSrc: "/assets/games/100.jpg", gameId: 100 },
{ imageSrc: "/assets/games/103.jpg", gameId: 103 },
{ imageSrc: "/assets/games/810.jpg", gameId: 810 },
{ imageSrc: "/assets/games/115.jpg", gameId: 115 },
{ imageSrc: "/assets/games/101.jpg", gameId: 101 },
{ imageSrc: "/assets/games/104.jpg", gameId: 104 },
{ imageSrc: "/assets/games/108.jpg", gameId: 108 },
{ imageSrc: "/assets/games/900.jpg", gameId: 900 },
{ imageSrc: "/assets/games/105.jpg", gameId: 105 },
{ imageSrc: "/assets/games/102.jpg", gameId: 102 },
{ imageSrc: "/assets/games/109.jpg", gameId: 109 },
{ imageSrc: "/assets/games/114.jpg", gameId: 114 },
{ imageSrc: "/assets/games/112.jpg", gameId: 112 },
{ imageSrc: "/assets/games/113.jpg", gameId: 113 },
];

    const ezugi =[
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "lobby",
          "gameId": "lobby",
          "gameName": "lobby",
          "slug": "lobby",
          "imageSrc": "https://play.thefanz.net/images/tables/lobby.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "100",
          "gameId": "100",
          "gameName": "Baccarat A",
          "slug": "100",
          "imageSrc": "https://play.thefanz.net/images/tables/baccarat_A.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "102",
          "gameId": "102",
          "gameName": "Baccarat B",
          "slug": "102",
          "imageSrc": "https://play.thefanz.net/images/tables/baccarat_B.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "105",
          "gameId": "105",
          "gameName": "Baccarat D",
          "slug": "105",
          "imageSrc": "https://play.thefanz.net/images/tables/baccarat_D.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "106",
          "gameId": "106",
          "gameName": "Baccarat C",
          "slug": "106",
          "imageSrc": "https://play.thefanz.net/images/tables/baccarat_C.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "108",
          "gameId": "108",
          "gameName": "Baccarat E",
          "slug": "108",
          "imageSrc": "https://play.thefanz.net/images/tables/baccarat_E.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "120",
          "gameId": "120",
          "gameName": "Knockout Baccarat",
          "slug": "120",
          "imageSrc": "https://play.thefanz.net/images/tables/knockout_baccarat.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "130",
          "gameId": "130",
          "gameName": "Super 6 Baccarat",
          "slug": "130",
          "imageSrc": "https://play.thefanz.net/images/tables/super6_baccarat.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "150",
          "gameId": "150",
          "gameName": "Dragon Tiger",
          "slug": "150",
          "imageSrc": "https://play.thefanz.net/images/tables/dragontiger.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "1000",
          "gameId": "1000",
          "gameName": "Italian Roulette",
          "slug": "1000",
          "imageSrc": "https://play.thefanz.net/images/tables/italian_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "5001",
          "gameId": "5001",
          "gameName": "Auto Roulette",
          "slug": "5001",
          "imageSrc": "https://play.thefanz.net/images/tables/cricket_auto_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "24150",
          "gameId": "24150",
          "gameName": "Dragon Tiger Da Sorte",
          "slug": "24150",
          "imageSrc": "https://play.thefanz.net/images/tables/dragontiger_DaSorte.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "32100",
          "gameId": "32100",
          "gameName": "Casino Marina Baccarat A",
          "slug": "32100",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_baccarat_A.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "32101",
          "gameId": "32101",
          "gameName": "Casino Marina Baccarat B",
          "slug": "32101",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_baccarat_B.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "32102",
          "gameId": "32102",
          "gameName": "Casino Marina Baccarat C",
          "slug": "32102",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_baccarat_C.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "32103",
          "gameId": "32103",
          "gameName": "Casino Marina Baccarat D",
          "slug": "32103",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_baccarat_D.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221000",
          "gameId": "221000",
          "gameName": "Speed Roulette",
          "slug": "221000",
          "imageSrc": "https://play.thefanz.net/images/tables/speed_auto_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221002",
          "gameId": "221002",
          "gameName": "Speed Auto Roulette",
          "slug": "221002",
          "imageSrc": "https://play.thefanz.net/images/tables/football_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221003",
          "gameId": "221003",
          "gameName": "Diamond Roulette",
          "slug": "221003",
          "imageSrc": "https://play.thefanz.net/images/tables/diamond_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221004",
          "gameId": "221004",
          "gameName": "Prestige Auto Roulette",
          "slug": "221004",
          "imageSrc": "https://play.thefanz.net/images/tables/prestige_auto_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221005",
          "gameId": "221005",
          "gameName": "Namaste Roulette",
          "slug": "221005",
          "imageSrc": "https://play.thefanz.net/images/tables/namaste_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221007",
          "gameId": "221007",
          "gameName": "Cricket Auto Roulette",
          "slug": "221007",
          "imageSrc": "https://play.thefanz.net/images/tables/auto_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221008",
          "gameId": "221008",
          "gameName": "Skyline Roulette",
          "slug": "221008",
          "imageSrc": "https://play.thefanz.net/images/tables/skyline_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "221009",
          "gameId": "221009",
          "gameName": "Football Auto Roulette",
          "slug": "221009",
          "imageSrc": "https://play.thefanz.net/images/tables/speed_auto_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "224000",
          "gameId": "224000",
          "gameName": "Sic Bo",
          "slug": "224000",
          "imageSrc": "https://play.thefanz.net/images/tables/sicbo.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "228000",
          "gameId": "228000",
          "gameName": "Andar Bahar",
          "slug": "228000",
          "imageSrc": "https://play.thefanz.net/images/tables/andarbahar.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "241000",
          "gameId": "241000",
          "gameName": "Roleta Da Sorte",
          "slug": "241000",
          "imageSrc": "https://play.thefanz.net/images/tables/roleta_da_sorte.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "321000",
          "gameId": "321000",
          "gameName": "Casino Marina Roulette 1",
          "slug": "321000",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_roulette1.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "321001",
          "gameId": "321001",
          "gameName": "Casino Marina Roulette 2",
          "slug": "321001",
          "imageSrc": "https://play.thefanz.net/images/tables/casino_marina_roulette2.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "411000",
          "gameId": "411000",
          "gameName": "Spanish Roulette",
          "slug": "411000",
          "imageSrc": "https://play.thefanz.net/images/tables/spanish_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "431000",
          "gameId": "431000",
          "gameName": "Ruleta Del Sol",
          "slug": "431000",
          "imageSrc": "https://play.thefanz.net/images/tables/ruleta_del_sol.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "501000",
          "gameId": "501000",
          "gameName": "Turkish Roulette",
          "slug": "501000",
          "imageSrc": "https://play.thefanz.net/images/tables/turkish_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "601000",
          "gameId": "601000",
          "gameName": "Russian Roulette",
          "slug": "601000",
          "imageSrc": "https://play.thefanz.net/images/tables/russian_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "611000",
          "gameId": "611000",
          "gameName": "Portomaso Roulette 2",
          "slug": "611000",
          "imageSrc": "https://play.thefanz.net/images/tables/portomaso_roulette2.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "611001",
          "gameId": "611001",
          "gameName": "Oracle Real Roulette",
          "slug": "611001",
          "imageSrc": "https://play.thefanz.net/images/tables/oracle_real_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "611003",
          "gameId": "611003",
          "gameName": "Oracle 360 Roulette",
          "slug": "611003",
          "imageSrc": "https://play.thefanz.net/images/tables/oracle_360_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "611007",
          "gameId": "611007",
          "gameName": "VIP Roulette",
          "slug": "611007",
          "imageSrc": "https://play.thefanz.net/images/tables/vip_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
      {
          "provider": "Ezugi",
          "vendorCode": "casino-ezugi",
          "gameCode": "541001",
          "gameId": "541001",
          "gameName": "Ultimate Auto Roulette",
          "slug": "541001",
          "imageSrc": "https://play.thefanz.net/images/tables/ultimate_roulette.jpg",
          "isNew": false,
          "underMaintenance": false
      },
     
  ];
  const Pragmatic = [
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "lobby",
        "gameId": "lobby",
        "gameName": "lobby",
        "slug": "lobby",
        "imageSrc": "https://m7rhjtz.thefanz.net/desktop/lobby.jpg",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "1hl323e1lxuqdrkr",
        "gameId": "1hl323e1lxuqdrkr",
        "gameName": "Auto Mega Roulette",
        "slug": "1hl323e1lxuqdrkr",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl323e1lxuqdrkr/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "1hl65ce1lxuqdrkr",
        "gameId": "1hl65ce1lxuqdrkr",
        "gameName": "Mega Roulette",
        "slug": "1hl65ce1lxuqdrkr",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl65ce1lxuqdrkr/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "381rwkr381korean",
        "gameId": "381rwkr381korean",
        "gameName": "Korean Roulette",
        "slug": "381rwkr381korean",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/381rwkr381korean/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "5bzl2835s5ruvweg",
        "gameId": "5bzl2835s5ruvweg",
        "gameName": "Auto Roulette",
        "slug": "5bzl2835s5ruvweg",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/5bzl2835s5ruvweg/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "5kvxlw4c1qm3xcyn",
        "gameId": "5kvxlw4c1qm3xcyn",
        "gameName": "Roulette Green",
        "slug": "5kvxlw4c1qm3xcyn",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/5kvxlw4c1qm3xcyn/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "ar25vipautorw251",
        "gameId": "ar25vipautorw251",
        "gameName": "VIP Auto Roulette",
        "slug": "ar25vipautorw251",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/ar25vipautorw251/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "autorwra311autor",
        "gameId": "autorwra311autor",
        "gameName": "Speed Auto Roulette",
        "slug": "autorwra311autor",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/autorwra311autor/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "chroma229rwltr22",
        "gameId": "chroma229rwltr22",
        "gameName": "Roulette Ruby",
        "slug": "chroma229rwltr22",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/chroma229rwltr22/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "g03y1t9vvuhrfytl",
        "gameId": "g03y1t9vvuhrfytl",
        "gameName": "Roulette Azure",
        "slug": "g03y1t9vvuhrfytl",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/g03y1t9vvuhrfytl/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "geogamingh2rw545",
        "gameId": "geogamingh2rw545",
        "gameName": "VIP Roulette - The Club",
        "slug": "geogamingh2rw545",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/geogamingh2rw545/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "r20speedrtwo201s",
        "gameId": "r20speedrtwo201s",
        "gameName": "Speed Roulette 2",
        "slug": "r20speedrtwo201s",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/r20speedrtwo201s/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "romania233rwl291",
        "gameId": "romania233rwl291",
        "gameName": "Romanian Roulette",
        "slug": "romania233rwl291",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/romania233rwl291/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "roulerw234rwl292",
        "gameId": "roulerw234rwl292",
        "gameName": "Spanish Roulette",
        "slug": "roulerw234rwl292",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/roulerw234rwl292/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "rwbrzportrwa16rg",
        "gameId": "rwbrzportrwa16rg",
        "gameName": "Brazilian Roulette",
        "slug": "rwbrzportrwa16rg",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/rwbrzportrwa16rg/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "s2x6b4jdeqza2ge2",
        "gameId": "s2x6b4jdeqza2ge2",
        "gameName": "German Roulette",
        "slug": "s2x6b4jdeqza2ge2",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/s2x6b4jdeqza2ge2/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "t4jzencinod6iqwi",
        "gameId": "t4jzencinod6iqwi",
        "gameName": "Russian Roulette",
        "slug": "t4jzencinod6iqwi",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/t4jzencinod6iqwi/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "v1c52fgw7yy02upz",
        "gameId": "v1c52fgw7yy02upz",
        "gameName": "Roulette Italia Tricolore",
        "slug": "v1c52fgw7yy02upz",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/v1c52fgw7yy02upz/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "vietnamr32genric",
        "gameId": "vietnamr32genric",
        "gameName": "Vietnamese Roulette",
        "slug": "vietnamr32genric",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/vietnamr32genric/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "yqpz3ichst2xg439",
        "gameId": "yqpz3ichst2xg439",
        "gameName": "Roulette Macao",
        "slug": "yqpz3ichst2xg439",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/yqpz3ichst2xg439/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "2q57e43m4ivqwaq3",
        "gameId": "2q57e43m4ivqwaq3",
        "gameName": "Speed Baccarat 6",
        "slug": "2q57e43m4ivqwaq3",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/2q57e43m4ivqwaq3/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "886ewimul28yw14j",
        "gameId": "886ewimul28yw14j",
        "gameName": "Speed Baccarat 5",
        "slug": "886ewimul28yw14j",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/886ewimul28yw14j/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "9j3eagurfwmml7z2",
        "gameId": "9j3eagurfwmml7z2",
        "gameName": "Baccarat 2",
        "slug": "9j3eagurfwmml7z2",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/9j3eagurfwmml7z2/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "b0jf7rlboleibnap",
        "gameId": "b0jf7rlboleibnap",
        "gameName": "Speed Baccarat 14",
        "slug": "b0jf7rlboleibnap",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/b0jf7rlboleibnap/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bc281koreanch281",
        "gameId": "bc281koreanch281",
        "gameName": "Korean Speed Baccarat 1",
        "slug": "bc281koreanch281",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bc281koreanch281/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bc392chromabc392",
        "gameId": "bc392chromabc392",
        "gameName": "Korean Speed Baccarat 2",
        "slug": "bc392chromabc392",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bc392chromabc392/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcapuntobanco001",
        "gameId": "bcapuntobanco001",
        "gameName": "Punto Banco Italia Tricolore",
        "slug": "bcapuntobanco001",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcapuntobanco001/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpebc1908",
        "gameId": "bcpirpmfpebc1908",
        "gameName": "Speed Baccarat 17",
        "slug": "bcpirpmfpebc1908",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpebc1908/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc191",
        "gameId": "bcpirpmfpeobc191",
        "gameName": "Baccarat 7",
        "slug": "bcpirpmfpeobc191",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc191/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc192",
        "gameId": "bcpirpmfpeobc192",
        "gameName": "Baccarat 8",
        "slug": "bcpirpmfpeobc192",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc192/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc193",
        "gameId": "bcpirpmfpeobc193",
        "gameName": "Speed Baccarat 15",
        "slug": "bcpirpmfpeobc193",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc193/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc194",
        "gameId": "bcpirpmfpeobc194",
        "gameName": "Speed Baccarat 10",
        "slug": "bcpirpmfpeobc194",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc194/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc196",
        "gameId": "bcpirpmfpeobc196",
        "gameName": "Speed Baccarat 9",
        "slug": "bcpirpmfpeobc196",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc196/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc197",
        "gameId": "bcpirpmfpeobc197",
        "gameName": "Speed Baccarat 7",
        "slug": "bcpirpmfpeobc197",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc197/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc198",
        "gameId": "bcpirpmfpeobc198",
        "gameName": "Speed Baccarat 8",
        "slug": "bcpirpmfpeobc198",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc198/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc199",
        "gameId": "bcpirpmfpeobc199",
        "gameName": "Super 8 Baccarat",
        "slug": "bcpirpmfpeobc199",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc199/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpobc1910",
        "gameId": "bcpirpmfpobc1910",
        "gameName": "Fortune 6 Baccarat",
        "slug": "bcpirpmfpobc1910",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpobc1910/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpobc1911",
        "gameId": "bcpirpmfpobc1911",
        "gameName": "Speed Baccarat 16",
        "slug": "bcpirpmfpobc1911",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpobc1911/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpobc1912",
        "gameId": "bcpirpmfpobc1912",
        "gameName": "Baccarat 9",
        "slug": "bcpirpmfpobc1912",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpobc1912/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "cbcf6qas8fscb221",
        "gameId": "cbcf6qas8fscb221",
        "gameName": "Speed Baccarat 12",
        "slug": "cbcf6qas8fscb221",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/cbcf6qas8fscb221/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "cbcf6qas8fscb222",
        "gameId": "cbcf6qas8fscb222",
        "gameName": "Baccarat 3",
        "slug": "cbcf6qas8fscb222",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/cbcf6qas8fscb222/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "cbcf6qas8fscb224",
        "gameId": "cbcf6qas8fscb224",
        "gameName": "Speed Baccarat 11",
        "slug": "cbcf6qas8fscb224",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/cbcf6qas8fscb224/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "h22z8qhp17sa0vkh",
        "gameId": "h22z8qhp17sa0vkh",
        "gameName": "Baccarat 1",
        "slug": "h22z8qhp17sa0vkh",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/h22z8qhp17sa0vkh/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "kkqnazmd8ttq7fgd",
        "gameId": "kkqnazmd8ttq7fgd",
        "gameName": "Speed Baccarat 2",
        "slug": "kkqnazmd8ttq7fgd",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/kkqnazmd8ttq7fgd/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "m88hicogrzeod202",
        "gameId": "m88hicogrzeod202",
        "gameName": "Speed Baccarat 13",
        "slug": "m88hicogrzeod202",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/m88hicogrzeod202/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "mbc371rpmfmbc371",
        "gameId": "mbc371rpmfmbc371",
        "gameName": "Mega Baccarat",
        "slug": "mbc371rpmfmbc371",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/mbc371rpmfmbc371/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "ne074fgn4bd1150i",
        "gameId": "ne074fgn4bd1150i",
        "gameName": "Baccarat 5",
        "slug": "ne074fgn4bd1150i",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/ne074fgn4bd1150i/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "oq808ojps709qqaf",
        "gameId": "oq808ojps709qqaf",
        "gameName": "Baccarat 6",
        "slug": "oq808ojps709qqaf",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/oq808ojps709qqaf/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "pwnhicogrzeodk79",
        "gameId": "pwnhicogrzeodk79",
        "gameName": "Speed Baccarat 1",
        "slug": "pwnhicogrzeodk79",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/pwnhicogrzeodk79/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "s8s9f0quk3ygiyb1",
        "gameId": "s8s9f0quk3ygiyb1",
        "gameName": "Speed Baccarat 3",
        "slug": "s8s9f0quk3ygiyb1",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/s8s9f0quk3ygiyb1/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "speedbca14gesbc1",
        "gameId": "speedbca14gesbc1",
        "gameName": "Thai Speed Baccarat 1",
        "slug": "speedbca14gesbc1",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/speedbca14gesbc1/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "speedbca18generi",
        "gameId": "speedbca18generi",
        "gameName": "Indonesian Speed Baccarat 1",
        "slug": "speedbca18generi",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/speedbca18generi/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spijbnsu408vmv71",
        "gameId": "spijbnsu408vmv71",
        "gameName": "Chinese Speed Baccarat 1",
        "slug": "spijbnsu408vmv71",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spijbnsu408vmv71/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spijbnsu408vmv72",
        "gameId": "spijbnsu408vmv72",
        "gameName": "Chinese Speed Baccarat 2",
        "slug": "spijbnsu408vmv72",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spijbnsu408vmv72/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spijbnsu408vmv73",
        "gameId": "spijbnsu408vmv73",
        "gameName": "Chinese Speed Baccarat 3",
        "slug": "spijbnsu408vmv73",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spijbnsu408vmv73/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto11bctorobc11",
        "gameId": "spto11bctorobc11",
        "gameName": "Vietnamese Speed Baccarat 1",
        "slug": "spto11bctorobc11",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto11bctorobc11/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto41bctorobc41",
        "gameId": "spto41bctorobc41",
        "gameName": "Japanese Speed Baccarat 1",
        "slug": "spto41bctorobc41",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto41bctorobc41/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto42bctorobc42",
        "gameId": "spto42bctorobc42",
        "gameName": "Japanese Speed Baccarat 2",
        "slug": "spto42bctorobc42",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto42bctorobc42/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto43bctorobc43",
        "gameId": "spto43bctorobc43",
        "gameName": "Japanese Speed Baccarat 3",
        "slug": "spto43bctorobc43",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto43bctorobc43/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "tobc51koreanto51",
        "gameId": "tobc51koreanto51",
        "gameName": "Korean Speed Baccarat 3",
        "slug": "tobc51koreanto51",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/tobc51koreanto51/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "tobc52koreanto52",
        "gameId": "tobc52koreanto52",
        "gameName": "Korean Speed Baccarat 4",
        "slug": "tobc52koreanto52",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/tobc52koreanto52/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "tobcspbaccarat61",
        "gameId": "tobcspbaccarat61",
        "gameName": "Korean Speed Baccarat 5",
        "slug": "tobcspbaccarat61",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/tobcspbaccarat61/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "tobcspbaccarat62",
        "gameId": "tobcspbaccarat62",
        "gameName": "Korean Speed Baccarat 6",
        "slug": "tobcspbaccarat62",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/tobcspbaccarat62/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "lc419kkmr2sxfpbk",
        "gameId": "lc419kkmr2sxfpbk",
        "gameName": "Mega Sic Bo",
        "slug": "lc419kkmr2sxfpbk",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/lc419kkmr2sxfpbk/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "sba71kkmr2ssba71",
        "gameId": "sba71kkmr2ssba71",
        "gameName": "Sic Bo",
        "slug": "sba71kkmr2ssba71",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/sba71kkmr2ssba71/ppcsr00000002258/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "md500q83g7cdefw1",
        "gameId": "md500q83g7cdefw1",
        "gameName": "Mega Wheel",
        "slug": "md500q83g7cdefw1",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/md500q83g7cdefw1/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "ge49e4os88bp4bi5",
        "gameId": "ge49e4os88bp4bi5",
        "gameName": "Dragon Tiger",
        "slug": "ge49e4os88bp4bi5",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/ge49e4os88bp4bi5/poster.jpg?v0.6583499167741359",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "speedbca14gesbc2",
        "gameId": "speedbca14gesbc2",
        "gameName": "Thai Speed Baccarat 2",
        "slug": "speedbca14gesbc2",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/speedbca14gesbc2/poster.jpg?v0.8179644373243502",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto12bctorobc12",
        "gameId": "spto12bctorobc12",
        "gameName": "Vietnamese Speed Baccarat 2",
        "slug": "spto12bctorobc12",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto12bctorobc12/poster.jpg?v0.27886123761910653",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "bcpirpmfpeobc192",
        "gameId": "bcpirpmfpeobc192",
        "gameName": "Baccarat 8",
        "slug": "bcpirpmfpeobc192",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/bcpirpmfpeobc192/ppcsr00000002258/poster.jpg?v0.02660952390648086",
        "isNew": false,
        "underMaintenance": false
    },
    {
        "provider": "Pragmatic Play",
        "vendorCode": "casino-pragmatic",
        "gameCode": "spto21bctorobc21",
        "gameId": "spto21bctorobc21",
        "gameName": "Vietnamese Speed Baccarat 3",
        "slug": "spto21bctorobc21",
        "imageSrc": "https://client.pragmaticplaylive.net/desktop/assets/snaps/spto21bctorobc21/poster.jpg?v0.02660952390648086",
        "isNew": false,
        "underMaintenance": false
    }
]


  const jili = useCallback(async (gameId) => {
    console.log('Jili game:', gameId);
    try {
      const token = sessionStorage.getItem("token"); // Get the token from session storage
      const response = await axios.post(
        `${domain}/jilireal-test-login/`,
        { GameId: gameId },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const { ErrorCode, Data } = response.data.responseData;
      console.log('Jili game response:', response.data.responseData);
      
      if (ErrorCode === 0) {
        window.location.href = Data;
      }
    } catch (error) {
      console.error('Jili game error:', error);
    }
  }, []);




  const jdbcall = async (app_id) => {
    setIsLoading(true);
    try {
        const token = sessionStorage.getItem('token'); // Changed to sessionStorage
        const response = await axios.post(`${domain}/game/launch/jdb/`, 
        { "gameCode": app_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const { status, data } = response.data;
       
        console.log(response.data);
  
        if (status === "SC_OK") {
            window.location.href = data.gameUrl;
        }
    } finally {
        setIsLoading(false);
    }
};


   async function launchGame(vendorCode, gameCode) {
    console.log('Launching game:', vendorCode, gameCode); 
    const token = sessionStorage.getItem('token');
    if (!token) {
        console.error('No auth token found in sessionStorage');
        return;
    }

    try {
        const response = await axios.post(
            `${domain}/game/launch-url`,
            { vendorCode, gameCode },
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                    'Content-Type': 'application/json'
                }
            }
        );

        if (response) {
            console.log('Game launch URL:', response.data);
            window.location.href = response.data.message;
        }
    } catch (error) {
        console.error('Failed to get launch URL:', error.response?.data || error.message);
    }
}
const topbet = async (app_id) => {
  console.log("--------->",app_id);
  setIsLoading(true);
  try {
      const token = sessionStorage.getItem("token"); // Get the token from session storage
      const response = await axios.post(
        `${domain}/topbetgaming-login/`,
        { app_id },
        {
          headers: {
            Authorization: `Bearer ${token}`, // Include the token in the Authorization header
          },
        }
      );
      const { code, url } = response.data;
      console.log(url);
      console.log(response.data);

      if (code === 0) {
          window.location.href = url;
      }
  } finally {
      setIsLoading(false);
  }
};

  const handleConfirmRecharge = () => {
    // Navigate to recharge page or trigger recharge process
    window.location.href = "/recharge"; // Adjust this path as needed
  };
// Update handleBoxClick with strict deposit check
const handleBoxClick = (type, vendorCode, gameCode, gameId) => {
    console.log(`Clicked gameId: ${gameId}`);
    
    if (isDepositCheckLoading) {
      return; // Prevent clicks while checking deposit status
    }
  
    // Check account type restriction
    if (accountType === 'Restricted') {
      alert('Your account is restricted. You cannot play games at this time.');
      return;
    }
  
    if (!hasDeposit) {
      setSelectedGame({ game: gameId });
      setGameType(type);
      setOpenDialog(true);
      return;
    }
  
    // Only proceed if deposit requirements are met and user is not restricted
    switch(type) {
      case "jili":
        launchGame(vendorCode, gameCode);
        break;
      case "topbet": 
        topbet(gameId);
        break;
      case "JDB":
        launchGame(vendorCode, gameCode);
        break;
      default:
        launchGame(vendorCode, gameCode);
    }
  };

const renderGames = (games, type) => {
  return games.map((game, index) => (
    <Grid
      item
      xs={4} // 3 boxes in a row (12/4 = 3)
      sm={4}
      md={4}
      key={index}
      sx={{
        opacity: isDepositCheckLoading ? 0.5 : 1,
        pointerEvents: isDepositCheckLoading ? 'none' : 'auto'
      }}
    >
     <Box
          onClick={() => handleBoxClick(type, game.vendorCode, game.gameCode,game.gameId, )}
          sx={{
            width: "100%",
            aspectRatio: "1", // Ensures the box is square
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            border: "1px solid #ddd",
            borderRadius: "8px",
            overflow: "hidden",
            backgroundColor: "#FFFFFF",
            cursor: "pointer",
            transition: "transform 0.2s ease-in-out",
            "&:hover": {
              transform: "scale(1.05)", // Add hover effect
            },
          }}
        >
          <img
            src={game.imageSrc}
            alt={`Game ${index + 1}`}
            style={{
              width: "100%",
              height: "100%",
            }}
          />
        </Box>
      </Grid>
    ));
  };

return (
  <>
  {/* Thin Header with Search Icon */}
  <AppBar position="sticky" sx={{ background: "#FFFFFF", height: 40, justifyContent: "center",  boxShadow: 'none'}}>
    <Toolbar sx={{ minHeight: "40px !important", display: "flex", justifyContent: "space-between", padding: "0 10px" }}>
    <IconButton style={{ color: "black" }} onClick={navigateToPage}>
                <ArrowBackIosNewIcon />
    </IconButton>
      <h6 style={{ margin: 0, fontSize: "16px", color: "black" }}>Game</h6>
      <IconButton color="black">
        <SearchIcon />
      </IconButton>
    </Toolbar>
  </AppBar>

  {/* Tabs with Images & No Chevron */}
  <Box sx={{ flexGrow: 1 }}>
  <AppBar position="static" color="default" sx={{ backgroundColor: 'transparent', boxShadow: 'none',marginLeft: '10px' }}>
  <Tabs
  value={tabValue}
  onChange={handleTabChange}
  variant="scrollable"
  scrollButtons="false"
  aria-label="game tabs"
  ref={tabsRef}
  sx={{
     boxShadow: 'none',
    '& .MuiTabs-flexContainer': {
      gap: '8px',
      padding: '8px',
    },
    '& .MuiTabs-indicator': {
      display: 'none'
    },
    '& .MuiTab-root': {
      backgroundColor: '#fff',
      borderRadius: '10px',
      minHeight: '65px',
      minWidth: '100px',
      padding: '6px',
      margin: '0',
      '&.Mui-selected': {
        backgroundColor: '#F95959',
        color: '#fff',
      },
    },
  }}
>
  {[
    { 
      label: "Jili Games", 
      activeImg: "/assets/banners/w2.png", // Active state image
      inactiveImg: "/assets/banners/b2.png" // Inactive state image
    },
    { 
      label: "JDB Games", 
      activeImg:" /assets/banners/w1.png",
      inactiveImg: "/assets/banners/b1.png"
    },
    { 
      label: "Top-bet", 
      activeImg: "/assets/banners/w3.png",
      inactiveImg: "/assets/banners/b3.png"
    },
    {
      label: "ezugi",
      activeImg: "/assets/banners/w4.png",
      inactiveImg: "/assets/banners/b4.png"
    },
    {
      label: "Pragmatic",
      activeImg: "/assets/banners/w5.png",
      inactiveImg: "/assets/banners/b5.png"
    }
    // ... repeat for other tabs
  ].map((tab, index) => (
    <Tab
      key={index}
      label={
        <Box sx={{ 
          display: "flex", 
          flexDirection: "column", 
          alignItems: "center",
          padding: '4px'
        }}>
          <img 
            src={tabValue === index ? tab.activeImg : tab.inactiveImg} 
            alt={tab.label} 
            width="45" 
            height="30"
          />
          <Typography sx={{ 
            fontSize: '14px', 
            marginTop: '2px',
            fontWeight:"400",
            fontFamily:"Helvetica",
            color: tabValue === index ? '#fff' : 'inherit'
          }}>
            {tab.label}
          </Typography>
        </Box>
      }
    />
  ))}
</Tabs>
</AppBar>

    {/* Tab Panels */}
    <TabPanel value={tabValue} index={0}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {renderGames(flashGames, "jili")}
      </Grid>
    </TabPanel>
    <TabPanel value={tabValue} index={1}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {renderGames(slotGames, "JDB")}
      </Grid>
    </TabPanel>
    <TabPanel value={tabValue} index={2}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {renderGames(popularGames, "topbet")}
      </Grid>
    </TabPanel>
    <TabPanel value={tabValue} index={3}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {renderGames(ezugi, "ezugi")}
      </Grid>
    </TabPanel>
    <TabPanel value={tabValue} index={4}>
      <Grid container spacing={2} justifyContent="center" alignItems="center">
        {renderGames(Pragmatic, "Pragmatic")}
      </Grid>
    </TabPanel>
  </Box>
</>
);

};

export default App;

//back icon functionality
