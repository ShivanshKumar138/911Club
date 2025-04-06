import React, { useState, useEffect } from "react";
import {
  Box,
  Typography,
  IconButton,
  Grid,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import SwipeableViews from "react-swipeable-views";
import ArrowBackIosIcon from "@mui/icons-material/ArrowBackIos";
import ArrowForwardIosIcon from "@mui/icons-material/ArrowForwardIos";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Import Axios
import { domain } from "./config";
import { styled } from "@mui/material/styles";
import Goagameshome from "./Goagameshome";
import Rajaluckhome from "./Rajaluckhome";
const tabData = [
  { label: "All", image: "/assets/all-da76a7fc.png" },
  { label: "Lottery", image: "/assets/gamecategory_20240611172507k9pn.png" },
  { label: "Original", image: "/assets/gamecategory_20240611172824l19p.png" },
  { label: "Slots", image: "/assets/gamecategory_20240611172950bsx2.png" },
  { label: "Sports", image: "/assets/gamecategory_20240611172928bnqo.png" },
  { label: "Casino", image: "/assets/gamecategory_20240611172909nn2o.png" },
  { label: "PVC", image: "/assets/gamecategory_20240611172848skb1.png" },
  { label: "Fishing", image: "/assets/gamecategory_20240611172453o1n2.png" },
];


const Loteria = [
  {
    id: 1,
    imgSrc: "/assets/g1.png",
    game: "Win Go",
    path: "/timer/30sec",
  },
  {
    id: 2,
    imgSrc: "/assets/g3.png",
    game: "k3",
    path: "/k3/1min",
  },
  {
    id: 3,
    imgSrc: "/assets/g2.png",
    game: "5d", 
    path: "/5d/1min",
  },
  {
    id: 3,
    imgSrc: "/assets/g2.png",
    game: "5d", 
    path: "/trx/1min",
  },
  
];

const Characteristic = [
  {
    id: 1,
    imgSrc: "/assets/games/800.jpg",
    game: "Aviator",
    odds: 88.77,
  },
  {
    id: 2,
    imgSrc: "/assets/games/801.jpg",
    game: "boom",
    odds: 88.77
  },
  {
    id: 3,
    imgSrc: "/assets/games/802.jpg",
    game: "limbo",
    odds: 88.77
  },
  {
    id: 4,
    imgSrc: "/assets/games/902.jpg",
    game: "hotline",
    odds: 88.77
  },
  {
    id: 5,
    imgSrc: "/assets/games/904.jpg",
    game: "hilo",
    odds: 88.77
  },
  {
    id: 6,
    imgSrc: "/assets/games/905.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 7,
    imgSrc: "/assets/games/111.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 8,
    imgSrc: "/assets/games/100.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 9,
    imgSrc: "/assets/games/103.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 10,
    imgSrc: "/assets/games/810.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 11,
    imgSrc: "/assets/games/115.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 12,
    imgSrc: "/assets/games/101.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 13,
    imgSrc: "/assets/games/104.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 14,
    imgSrc: "/assets/games/108.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 15,
    imgSrc: "/assets/games/900.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 16,
    imgSrc: "/assets/games/105.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 17,
    imgSrc: "/assets/games/102.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 18,
    imgSrc: "/assets/games/109.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 19,
    imgSrc: "/assets/games/114.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 20,
    imgSrc: "/assets/games/112.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 21,
    imgSrc: "/assets/games/113.jpg",
    game: "plinko",
    odds: 88.77
  },

];

const Hotslot = [
  {
    id: 1,
    imgSrc: "/assets/games/jili/260x380_EN_GAMEID_261.png",
    game: "Win Go",
    odds: 88.77,
  },
  { id: 2, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_224.png", game: "Win Go", odds: 81.83 },
  { id: 3, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_241.png", game: "Win Go", odds: 88.84 },
  { id: 4, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_242.png", game: "Win Go", odds: 84.17 },
  { id: 5, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_235.png", game: "K3", odds: 80.04 },
  { id: 6, imgSrc: "/assets/games/jili/GAMEID_233_EN_260x380.png", game: "K3", odds: 91.46 },
  { id: 7, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_229.png", game: "K3", odds: 91.46 },
  { id: 8, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_232.png", game: "K3", odds: 91.46 },
  { id: 9, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_253.png", game: "K3", odds: 91.46 },



];

const Original = [
  {
    id: 1,
    imgSrc: "/assets/games/800.jpg",
    game: "Aviator",
    odds: 88.77,
  },
  {
    id: 2,
    imgSrc: "/assets/games/801.jpg",
    game: "boom",
    odds: 88.77
  },
  {
    id: 3,
    imgSrc: "/assets/games/802.jpg",
    game: "limbo",
    odds: 88.77
  },
  {
    id: 4,
    imgSrc: "/assets/games/902.jpg",
    game: "hotline",
    odds: 88.77
  },
  {
    id: 5,
    imgSrc: "/assets/games/904.jpg",
    game: "hilo",
    odds: 88.77
  },
  {
    id: 6,
    imgSrc: "/assets/games/905.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 7,
    imgSrc: "/assets/games/111.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 8,
    imgSrc: "/assets/games/100.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 9,
    imgSrc: "/assets/games/103.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 10,
    imgSrc: "/assets/games/810.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 11,
    imgSrc: "/assets/games/115.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 12,
    imgSrc: "/assets/games/101.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 13,
    imgSrc: "/assets/games/104.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 14,
    imgSrc: "/assets/games/108.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 15,
    imgSrc: "/assets/games/900.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 16,
    imgSrc: "/assets/games/105.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 17,
    imgSrc: "/assets/games/102.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 18,
    imgSrc: "/assets/games/109.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 19,
    imgSrc: "/assets/games/114.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 20,
    imgSrc: "/assets/games/112.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 21,
    imgSrc: "/assets/games/113.jpg",
    game: "plinko",
    odds: 88.77
  },
  {
    id: 22,
    imgSrc: "/assets/games/jili/260x380_EN_GAMEID_261.png",
    game: "Win Go",
    odds: 88.77,
  },
  { id: 23, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_224.png", game: "Win Go", odds: 81.83 },
  { id: 24, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_241.png", game: "Win Go", odds: 88.84 },
  { id: 25, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_242.png", game: "Win Go", odds: 84.17 },
  { id: 26, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_235.png", game: "K3", odds: 80.04 },
  { id: 27, imgSrc: "/assets/games/jili/GAMEID_233_EN_260x380.png", game: "K3", odds: 91.46 },
  { id: 28, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_229.png", game: "K3", odds: 91.46 },
  { id: 29, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_232.png", game: "K3", odds: 91.46 },
  { id: 30, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_253.png", game: "K3", odds: 91.46 },
];

const Slots = [
  {
    id: 1,
    imgSrc: "/assets/vendorlogo_202406081741318xaq.png",
    game: "jili",
  },
  { id: 2, imgSrc: "/assets/vendorlogo_2024060817401729ls.png", game: "pg" },
  { id: 3, imgSrc: "/assets/vendorlogo_20240608174232lg9w.png", game: "jdb" },
  { id: 4, imgSrc: "/assets/vendorlogo_20240608174248pilj.png", game: "cq" },
  { id: 5, imgSrc: "/assets/vendorlogo_20240608174309h9ns.png", game: "n" },
  {
    id: 6,
    imgSrc: "/assets/vendorlogo_20240608174102vuo1.png",
    game: "evolution",
  },
  { id: 7, imgSrc: "/assets/vendorlogo_202406081748253wsh.png", game: "mn" },
];

const Sports = [
  { id: 1, imgSrc: "/assets/gsports.png" }
];

const Casino = [
  { id: 1, imgSrc: "/assets/roulette1.png", game: "roulette1" },
  { id: 2, imgSrc: "/assets/dragontigar.png", game: "dragontigar" },
  { id: 3, imgSrc: "/assets/roulette3.png", game: "roulette3" },
  { id: 4, imgSrc: "/assets/baccarat.png", game: "baccarat" },
  { id: 5, imgSrc: "/assets/roulette4.png", game: "roulette4" },
  { id: 6, imgSrc: "/assets/sicbo2.png", game: "sicbo2" },
  { id: 7, imgSrc: "/assets/sicbo.png", game: "sicbo" },
  { id: 8, imgSrc: "/assets/redblueDuel.png", game: "redblueDuel" },
  { id: 9, imgSrc: "/assets/playboy.png", game: "playboy" },
];

const Pvc = [
  { id: 1, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_239.png" },
  { id: 2, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_114.png" },
  { id: 3, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_225.png" },
  { id: 4, imgSrc: "/assets/games/jili/GAMEID_94_EN.png" },
  { id: 5, imgSrc: "/assets/games/jili/GAMEID_72_EN.png" },
  { id: 6, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_91.png" },
  { id: 7, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_132.png" },
  { id: 8, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_66.png" },
  { id: 9, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_150.png" },
];

const Fishing = [
  { id: 1, imgSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png" },
  { id: 2, imgSrc: "/assets/games/jili/JL_260x380_GameID404_en-US.png" },
  { id: 3, imgSrc: "/assets/games/jili/JL_260x380_GameID259_en-US.png" },
  { id: 4, imgSrc: "/assets/games/jili/JL_260x380_GameID427_en-US.png" },
  { id: 5, imgSrc: "/assets/games/jili/JL_260x380_GameID441_en-US.png" },
  { id: 6, imgSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png" },
  { id: 7, imgSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png" },
  { id: 8, imgSrc: "/assets/games/jili/JL_260x380_GameID439_en-US.png" },
  { id: 9, imgSrc: "/assets/games/jili/JL_260x380_GameID372_en-US.png" },
  { id: 10, imgSrc: "/assets/games/jili/JL_260x380_GameID440_en-US.png" },
  { id: 11, imgSrc: "/assets/games/jili/JL_260x380_GameID302_en-US.png" },
  { id: 12, imgSrc: "/assets/games/jili/JL_260x380_GameID400_en-US.png" },
  { id: 13, imgSrc: "/assets/games/jili/JL_260x380_GameID407_en-US.png" },
  { id: 14, imgSrc: "/assets/games/jili/JL_260x380_GameID399_en-US.png" },
  { id: 15, imgSrc: "/assets/games/jili/JL_260x380_GameID301_en-US.png" },
  { id: 16, imgSrc: "/assets/games/jili/JL_260x380_GameID258_en-US.png" },
  { id: 17, imgSrc: "/assets/games/jili/JL_260x380_GameID420_en-US.png" },
  { id: 18, imgSrc: "/assets/games/jili/JL_260x380_GameID074_en-US.png" },
  { id: 19, imgSrc: "/assets/games/jili/JL_260x380_GameID223_en-US.png" },
  { id: 20, imgSrc: "/assets/games/jili/JL_260x380_GameID240_en-US.png" },
  { id: 21, imgSrc: "/assets/games/jili/JL_260x380_GameID180_en-US.png" },
  { id: 22, imgSrc: "/assets/games/jili/JL_260x380_GameID300_en-US.png" },
  { id: 23, imgSrc: "/assets/games/jili/JL_260x380_GameID262_en-US.png" },
  { id: 24, imgSrc: "/assets/games/jili/JL_260x380_GameID403_en-US.png" },
  { id: 25, imgSrc: "/assets/games/jili/JL_260x380_GameID389_en-US.png" },
  { id: 26, imgSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png" },
  { id: 27, imgSrc: "/assets/games/jili/JL_260x380_GameID397_en-US.png" },
  { id: 28, imgSrc: "/assets/games/jili/JL_260x380_GameID299_en-US.png" },
  { id: 29, imgSrc: "/assets/games/jili/JL_260x380_GameID464_en-US.png" },
  { id: 30, imgSrc: "/assets/games/jili/JL_260x380_GameID264_en-US.png" },
  { id: 31, imgSrc: "/assets/games/jili/JL_260x380_GameID263_en-US.png" },
  { id: 32, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_300.png" },
  { id: 33, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_252.png" },
  { id: 34, imgSrc: "/assets/games/jili/GAMEID_231_EN_260x380.png" },
  { id: 35, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_114.png" },
  { id: 36, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_153.png" },
  { id: 37, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_253.png" },
  { id: 38, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_259.png" },
  { id: 39, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_301.png" },
  { id: 40, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_220.png" },
  { id: 41, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_226.png" },
  { id: 42, imgSrc: "/assets/games/jili/GAMEID_132_EN_260x380.png" },
  { id: 43, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_298.png" },
  { id: 44, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_209.png" },
  { id: 45, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_238.png" },
  { id: 46, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_208.png" },
  { id: 47, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_254.png" },
  { id: 48, imgSrc: "/assets/games/jili/260x380_EN_GAMEID_211.png" },
];


const categoriesMap = {
  Characteristic: Characteristic,
  Hotslot: Hotslot,
  Original: Original,
  Slots: Slots,
  Sports: Sports,
  Casino: Casino,
  Pvc: Pvc,
  Fishing: Fishing,
};

const StyledDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialog-paper": {
    width: "100%",
    maxWidth: "530px",
    borderRadius: "40px",
    overflow: "hidden",
    boxShadow: "0 8px 32px rgba(0, 0, 0, 0.15)",
  },
}));

const StyledDialogTitle = styled(DialogTitle)(({ theme }) => ({
  backgroundColor: "#0f6518",
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
          style={{ backgroundColor: "#0f6518", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
};

const Games = () => {
  const numberOfOriginalItems = Original.length;
  const numberOfHotSlotItems = Hotslot.length;
  const numberOfcharacteristicItems = Characteristic.length;
  const numberOfSlotsItems = Slots.length;
  const numberOfSportsItems = Sports.length;
  const numberOfCasinoItems = Casino.length;
  const numberOfpvcItems = Pvc.length;
  const numberOfFishingItems = Fishing.length;
  const numberOfLoteriaItems = Loteria.length;
  const [tabValue, setTabValue] = useState(0);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
        const userResponse = await axios.get(`${domain}/user`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const userData = userResponse.data;
  
        if (userData && userData.user) {
          setFirstDepositMade(userData.user.firstDepositMade);
        }
  
        if (userData) {
          setPhoneUserUid(userData.user.mobile);
        }
        
        const depositResponse = await axios.get(`${domain}/need-to-deposit-first`, {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        const depositData = depositResponse.data;
  
        if (depositData && depositData.success) {
          setNeedToDepositFirst(depositData.data.needToDepositFirst);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      }
    };
  
    fetchData();
  }, []);

  const handleGameClick = (game) => {
    if (!firstDepositMade && needToDepositFirst) {
      setSelectedGame(game);
      setOpenDialog(true);
    } else {
      navigate(game.path);
    }
  };

  const handleCloseDialog = () => {
    setOpenDialog(false);
  };

  const handleConfirmRecharge = () => {
    // Navigate to recharge page or trigger recharge process
    navigate("/recharge"); // Adjust this path as needed
  };

  const topbet = async (app_id) => {
    setIsLoading(true); // Assuming you want to set loading state when the function is triggered
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/topbetgaming-login/`,
        { app_id },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
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


  const jili = async (gameId) => {
    setIsLoading(true); // Assuming you want to set loading state when the function is triggered
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/jilireal-test-login/`,
        { GameId: gameId },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { ErrorCode, Data } = response.data.responseData;
      console.log(response.data.responseData);
  
      if (ErrorCode === 0) {
        window.location.href = Data;
      }
    } finally {
      setIsLoading(false);
    }
  };

  const launchCasinoGame = async (game_uid) => {
    setIsLoading(true); // Assuming you want to set loading state when the function is triggered
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/casinoapi-request-game-url/`,
        { game_uid },
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { code, payload } = response.data;
      console.log(response.data);
  
      if (code === 0) {
        window.location.href = payload.game_launch_url;
      }
    } finally {
      setIsLoading(false);
    }
  };
  const dpsportcall = async (game_uid) => {
    setIsLoading(true); // Assuming you want to set loading state when the function is triggered
    try {
      const token = sessionStorage.getItem("token"); // Assuming the token is stored in sessionStorage
      const response = await axios.post(
        `${domain}/dpsport-auth/`,
        {},
        {
          withCredentials: true,
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { code, data } = response.data;
      const { h5, url } = data;
      console.log('Response data:', data);
  
      if (code === 0) {
        const userAgent = navigator.userAgent;
        console.log('User Agent:', userAgent);
        const isMobile = /iPhone|iPad|iPod|Android/i.test(userAgent);
        console.log('Is Mobile:', isMobile);
        const redirectUrl = isMobile ? h5 : url;
        console.log('Redirecting to:', redirectUrl);
        window.location.href = redirectUrl;
      } else {
        console.log('Non-zero response code:', code);
      }
  
    } catch (error) {
      console.error('Error during API call:', error);
    } finally {
      setIsLoading(false);
    }
  };
  const getClickHandler = (gameId) => {
    switch (gameId) {
    

      default: return () => { };
    }
  };
  

  const getClickHandler4 = (gameId) => {
    switch (gameId) {
     
      case 22: return () =>jili("261");
      case 23: return () =>jili("224");
      case 24: return () =>jili("241");
      case 25: return () =>jili("242");
      case 26: return () =>jili("235");
      case 27: return () =>jili("223");
      case 28: return () =>jili("229");
      case 29: return () =>jili("232");
      case 30: return () =>jili("253");

      default: return () => { };
    }
  };


  

  const getClickHandler5 = (gameId) => {
    switch (gameId) {
      case 1: return () => jili("239"); 
      case 2: return () => jili("114");
      case 3: return () => jili("225");
      case 4: return () => jili("94");
      case 5: return () => jili("72");
      case 6: return () => jili("91");
      case 7: return () => jili("132");
      case 8: return () => jili("66");
      case 9: return () => jili("150");
    

      default: return () => { };
    }
  };

  
  const getClickHandler6 = (gameId) => {
    switch (gameId) {
      case 1: return () => jili("464"); 
      case 2: return () => jili("404");
      case 3: return () => jili("259");
      case 4: return () => jili("427");
      case 5: return () => jili("441");
      case 6: return () => jili("439");
      case 7: return () => jili("439");
      case 8: return () => jili("439");
      case 9: return () => jili("372");
      case 10: return () => jili("440");
      case 11: return () => jili("302");
      case 12: return () => jili("400");
      case 13: return () => jili("407");
      case 14: return () => jili("399");
      case 15: return () => jili("301");
      case 16: return () => jili("258");
      case 17: return () => jili("420");
      case 18: return () => jili("074");
      case 19: return () => jili("223");
      case 20: return () => jili("240");
      case 21: return () => jili("180");
      case 22: return () => jili("300");
      case 23: return () => jili("262");
      case 24: return () => jili("403");
      case 25: return () => jili("389");
      case 26: return () => jili("464");
      case 27: return () => jili("397");
      case 28: return () => jili("299");
      case 29: return () => jili("464");
      case 30: return () => jili("264");
      case 31: return () => jili("263");
      case 32: return () => jili("300");
      case 33: return () => jili("252");
      case 34: return () => jili("231");
      case 35: return () => jili("114");
      case 36: return () => jili("153");
      case 37: return () => jili("253");
      case 38: return () => jili("259");
      case 39: return () => jili("301");
      case 40: return () => jili("220");
      case 41: return () => jili("226");
      case 42: return () => jili("132");
      case 43: return () => jili("298");
      case 44: return () => jili("209");
      case 45: return () => jili("238");
      case 46: return () => jili("208");
      case 47: return () => jili("254");
      case 48: return () => jili("211");

    

      default: return () => { };
    }
  };

  const getClickHandler2 = (gameId) => {
    switch (gameId) {
      case 1: return () =>jili("261");
      case 2: return () =>jili("224");
      case 3: return () =>jili("241");
      case 4: return () =>jili("242");
      case 5: return () =>jili("235");
      case 6: return () =>jili("223");
      case 7: return () =>jili("229");
      case 8: return () =>jili("232");
      case 9: return () =>jili("253");


      default: return () => { };
    }
  };


  const getClickHandler3 = (gameId) => {
    switch (gameId) {
    


      default: return () => { };
    }
  };

  
  const dpsport = (gameId) => {
    switch (gameId) {
    
    



      default: return () => { };
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/head"); // Navigate to the specified link
  };
  const handleClick1 = () => {
    navigate("/k3"); // Navigate to the specified link
  };
  const handleClick2 = () => {
    navigate("/trx"); // Navigate to the specified link
  };

  const [currentIndexes, setCurrentIndexes] = useState({
    Loteria: 0,
    Characteristic: 0,
    Hotslot: 0,
    Original: 0,
    Slots: 0,
    Sports: 0,
    Casino: 0,
    Pvc: 0,
    Fishing: 0,
  });
  const handlePrev = (category) => {
    if (!categoriesMap[category]) return;
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [category]:
        (prevIndexes[category] -
          1 +
          Math.ceil(categoriesMap[category]?.length / 3)) %
        Math.ceil(categoriesMap[category]?.length / 3),
    }));
  };

  const handleNext = (category) => {
    if (!categoriesMap[category]) return; // Check if the category exists
    setCurrentIndexes((prevIndexes) => ({
      ...prevIndexes,
      [category]:
        (prevIndexes[category] + 1) %
        Math.ceil(categoriesMap[category]?.length / 3),
    }));
  };

  return (
    <Box>

      <Goagameshome />
      {/* <h1>Hey</h1>
      <Rajaluckhome /> */}

      <>

        <RechargeDialog
          open={openDialog}
          onClose={handleCloseDialog}
          onConfirm={handleConfirmRecharge}
          selectedGame={selectedGame}
        />
      </>
         
    </Box>
  );
};

export default Games;
