import React, { useState, useRef,useEffect ,useCallback, memo} from 'react';
import { Box, Grid } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import {
  Typography,
  IconButton,
  Button,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
} from "@mui/material";
import { domain } from "./config";
import axios from "axios";
import { styled } from "@mui/material/styles";
import { sub } from 'date-fns';
import { fontFamily, fontSize, fontWeight } from '@mui/system';
// import { Grid } from '@mui/system';

// Styled components remain the same
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
  backgroundColor: "#F95959",
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
}));

// Separate RechargeDialog component with memo
const RechargeDialog = memo(({ open, onClose, onConfirm, selectedGame }) => {
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
          style={{ backgroundColor: "#F95959", color: "white" }}
        >
          Recharge Now
        </StyledButton>
      </StyledDialogActions>
    </StyledDialog>
  );
});

RechargeDialog.displayName = 'RechargeDialog';
const TabLayout = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [flashPage, setFlashPage] = useState(0);
  const [slotPage, setSlotPage] = useState(0);
  const [sportsPage, setSportsPage] = useState(0);
  const [casinoPage, setCasinoPage] = useState(0);
  const [cardsPage, setCardsPage] = useState(0);
  const [dicePage, setDicePage] = useState(0);
  const [bingoPage, setBingoPage] = useState(0);
  const tabsRef = useRef(null);


  const tabs = [
    {id: 'sports', label: 'Popular', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134718aedk.png', bgImage:"url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)" },
    
    {id: 'lobby', label: 'Lottery', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134331wkt7.png',bgImage:"url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)" },
    {id: 'slot', label: 'Slots', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160211wyu9.png', bgImage:"rgb(87,199,221)" },
    { id: 'cards', label: 'Sport', img: 'https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127171151ol6s.png', bgcolor: "transparent" },
    {id: 'casino', label: 'Casino', img: 'https://www.66lottery9.com/static/gameIcon/video_icon.png?v=1.0.0', bgcolor: "transparent" },
    {id: 'flash', label: 'Rummy', img: 'https://www.66lottery9.com/static/gameIcon/chess_icon.png?v=1.0.0', bgcolor: "linear-gradient(to bottom, #fbb2ff, #e27bd1)" },
    { id: 'original', label: "Original", img: "https://www.66lottery9.com/static/gameIcon/flash_icon.png?v=1.0.0", bgcolor: "rgb(245,144,193)" },
    { id: 'dice', label: 'Fishing', img: 'https://www.66lottery9.com/static/gameIcon/fish_icon.png?v=1.0.0', bgcolor: "rgb(253,177,107)" },
    
  ]

  const lotteryGames = [
    { 
      id: 'wingo', 
      title: 'Win Go',
      subtitle: 'Guess the number',
      desc: 'Through the platform Win Go  Hash lottery seed as the result of the lottery', 
      img: 'https://www.66lottery9.com/static/gameIcon/lotterycategory_winGo.png?v=2',
      path: "/timer/30sec" 
    },
    { 
      id: 'k3', 
      title: 'K3',
      subtitle: 'Guess the number',
      desc: 'The player predicts 3 DICE numbers,the winning rate is high,the gameplay is simple,and it is easy to win', 
      img: 'https://www.66lottery9.com/static/gameIcon/lotterycategory_k3.png?v=2',
      path: "/k3/1min"
    },
    { 
      id: '5d', 
      title: '5D',
      subtitle: 'Guess the number',
      desc: '5 numbers are used as the result of the lottery,and the palying methods are flexible and diverse', 
      img: 'https://www.66lottery9.com/static/gameIcon/lotterycategory_5d.png?v=2',
      path: "/5d/1min"
    },
    { 
      id: 'trxwin', 
      title: 'Trx Win',
      subtitle: 'Guess the number',
      desc: 'By obtaining the real-time hash value of the TRX blockchain as the result of the lottery', 
      img: '/assets/banners/trx.png',
      path: "/trx/1min"
    },
    // { 
    //   id: 'racing', 
    //   title: 'Racing',
    //   subtitle: 'Guess the number',
    //   desc: 'Predict the top three car numbers, with a high winning rate, simple gameplay and easy to win', 
    //   img: 'https://www.66lottery9.com/static/gameIcon/lotterycategory_racing.png?v=2',
    //   path: "/racing-game/30sec"
    // }
  ];
  const gamesByTab = {
    hot_games:[
      { id: 'popular-1', title: 'Popular 1', gameId: 800, img: '/assets/flash/800.jpg' },
      { id: 'popular-2', title: 'Popular 2', gameId: 801, img: 'https://image.0nxq4.cc/icon/202502280344359991004.jpg' },
      { id: 'popular-3', title: 'Popular 3', gameId: 903, img: '/assets/flash/903.png' },
      { id: 'popular-20', title: 'Popular 20', gameId: 810, img: '/assets/flash/810.jpg' },
      
    ],
    originals:[
      { id: 'popular-10', title: 'Popular 10', gameId: 103, img: '/assets/flash/103.jpg' },
      { id: 'popular-11', title: 'Popular 11', gameId: 104, img: '/assets/flash/104.jpg' },
      { id: 'popular-12', title: 'Popular 12', gameId: 105, img: '/assets/flash/105.jpg' },
      { id: 'popular-13', title: 'Popular 13', gameId: 106, img: '/assets/flash/106.jpg' },
      { id: 'popular-7', title: 'Popular 7', gameId: 100, img: '/assets/flash/100.jpg' },
      { id: 'popular-8', title: 'Popular 8', gameId: 101, img: '/assets/flash/101.jpg' },
    ],
    flash: [
      { id: 'popular-1', title: 'Popular 1', gameId: 903, img: 'https://image.0nxq4.cc/game/SPB/Slots/SPB_aviator.png' },
      { id: 'popular-2', title: 'Popular 2', gameId: 801, img: 'https://image.0nxq4.cc/icon/202502280344359991004.jpg' },
      { id: 'popular-3', title: 'Popular 3', gameId: 903, img: 'https://image.0nxq4.cc/game/JL/Slots/JL_51.png' },
      { id: 'popular-9', title: 'Popular 9', gameId: 102, img: 'https://image.0nxq4.cc/icon/202408180914311997003.jpg' },
      { id: 'popular-10', title: 'Popular 10', gameId: 103, img: '/assets/flash/103.jpg' },
      { id: 'popular-11', title: 'Popular 11', gameId: 104, img: '/assets/flash/104.jpg' },
      { id: 'popular-12', title: 'Popular 12', gameId: 105, img: '/assets/flash/105.jpg' },
      { id: 'popular-13', title: 'Popular 13', gameId: 106, img: '/assets/flash/106.jpg' },
      { id: 'popular-3', title: 'Popular 3', gameId: 202, img: '/assets/flash/802.jpg' },
      { id: 'popular-4', title: 'Popular 4', gameId: 803, img: '/assets/flash/803.jpg' },
      { id: 'popular-7', title: 'Popular 7', gameId: 100, img: '/assets/flash/100.jpg' },
      { id: 'popular-8', title: 'Popular 8', gameId: 101, img: '/assets/flash/101.jpg' },
      { id: 'popular-14', title: 'Popular 14', gameId: 107, img: '/assets/flash/107.jpg' },
      { id: 'popular-15', title: 'Popular 15', gameId: 900, img: '/assets/flash/900.jpg' },
      { id: 'popular-16', title: 'Popular 16', gameId: 109, img: '/assets/flash/109.jpg' },
      { id: 'popular-17', title: 'Popular 17', gameId: 110, img: '/assets/flash/110.jpg' },
      { id: 'popular-18', title: 'Popular 18', gameId: 111, img: '/assets/flash/111.jpg' },
      { id: 'popular-19', title: 'Popular 19', gameId: 112, img: '/assets/flash/112.jpg' },
      { id: 'popular-20', title: 'Popular 20', gameId: 810, img: '/assets/flash/810.jpg' },
      
      
    ],
    popular: [
      { id: 'slot-1', title: 'Slot 1', gameId: '229', img: '/assets/flash/229.png' },
      { id: 'slot-2', title: 'Slot 2', gameId: '224', img: '/assets/flash/224.png' },
      { id: 'slot-3', title: 'Slot 3', gameId: '232', img: '/assets/flash/232.png' },
      { id: 'slot-4', title: 'Slot 4', gameId: '233', img: '/assets/flash/233.png' },
      { id: 'slot-5', title: 'Slot 5', gameId: '235', img: '/assets/flash/235.png' },
      { id: 'slot-6', title: 'Slot 6', gameId: '236', img: '/assets/flash/236.png' },

    ],
    slot: [
      { id: 'slot1', title: 'Slot Magic', gameId: '223', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184642yw3q.png' ,bgColor:'rgb(77,144,254)'},
      { id: 'slot2', title: 'Super Slots', gameId: '240', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_202307101846164xab.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot3', title: 'Slot Magic', gameId: '180', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184633b9w1.png',bgColor:'rgb(77,144,254)'},
      { id: 'slot4', title: 'Super Slots', gameId: '300', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230724124135ypq8.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot5', title: 'Slot Magic', gameId: '223', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184550vu9q.png' ,bgColor:'rgb(77,144,254)'},
      { id: 'slot6', title: 'Super Slots', gameId: '240', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20241017050424j8it.png',bgColor:'rgb(77,144,254)' },
      { id: 'slot7', title: 'Slot Magic', gameId: '180', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20240508124035qn6t.png ',bgColor:'rgb(77,144,254)'},
      { id: 'slot8', title: 'Super Slots', gameId: '300', img: 'https://ossimg.goa999.vip/GoaGame/vendorlogo/vendorlogo_20230710184642yw3q.png',bgColor:'rgb(77,144,254)' },
    ],
    sports: [
      { id: 'football_sports', title: 'Football', gameId: '403', img: 'https://www.66lottery9.com/static/gameIcon/sport_SABA-SPORTS.png?v=2.2',subtitle:"Football",desc:"" },
      { id: 'cricket_sports', title: 'Cricket', gameId: '389', img: 'https://www.66lottery9.com/static/gameIcon/sport_9Wickets.png?v=2.2',subtitle:"Cricket",desc:"" },
    ],
    casino: [
     
      { id: 'roulette_casino3', title: 'EZUGI',gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '1000', img: 'https://image.0nxq4.cc/icon/20240514122338043003.png' ,subtitle:"Roulette",desc:""},
      { id: 'roulette_casino6', title: 'PRAGMATIC GAME', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: 'lobby', img: 'https://image.0nxq4.cc/icon/20240514122154561001.png' ,subtitle:"Roulette",desc:""},

    ],
    cards: [
      { id: 'poker_cards', title: 'Poker', gameId: 'EVOLIVE_TRPTable00000001', img: '/assets/evolution/EVOLIVE_TRPTable00000001.png',subtitle:"Poker",desc:"365" },
      { id: 'baccarat_cards', title: 'Baccarat', gameId: 'EVOLIVE_Always8baccarat0', img: '/assets/evolution/EVOLIVE_Always8baccarat0.png' ,subtitle:"Baccarat",desc:"365"},
    ],
    dice: [
      { img: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
      { img: "/assets/games/jili/JL_260x380_GameID404_en-US.png", gameId: "404" },
      { img: "/assets/games/jili/JL_260x380_GameID259_en-US.png", gameId: "259" },
      { img: "/assets/games/jili/JL_260x380_GameID427_en-US.png", gameId: "427" },
      { img: "/assets/games/jili/JL_260x380_GameID441_en-US.png", gameId: "441" },
      { img: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
      { img: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
      { img: "/assets/games/jili/JL_260x380_GameID439_en-US.png", gameId: "439" },
      { img: "/assets/games/jili/JL_260x380_GameID372_en-US.png", gameId: "372" },
      { img: "/assets/games/jili/JL_260x380_GameID440_en-US.png", gameId: "440" },
      { img: "/assets/games/jili/JL_260x380_GameID302_en-US.png", gameId: "302" },
      { img: "/assets/games/jili/JL_260x380_GameID400_en-US.png", gameId: "400" },
      { img: "/assets/games/jili/JL_260x380_GameID407_en-US.png", gameId: "407" },
      { img: "/assets/games/jili/JL_260x380_GameID399_en-US.png", gameId: "399" },
      { img: "/assets/games/jili/JL_260x380_GameID301_en-US.png", gameId: "301" },
      { img: "/assets/games/jili/JL_260x380_GameID258_en-US.png", gameId: "258" },
      { img: "/assets/games/jili/JL_260x380_GameID420_en-US.png", gameId: "420" },
      { img: "/assets/games/jili/JL_260x380_GameID074_en-US.png", gameId: "074" },
      { img: "/assets/games/jili/JL_260x380_GameID223_en-US.png", gameId: "223" },
      { img: "/assets/games/jili/JL_260x380_GameID240_en-US.png", gameId: "240" },
      { img: "/assets/games/jili/JL_260x380_GameID180_en-US.png", gameId: "180" },
    ],
    bingo: [
      { img: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
      { img: "/assets/games/jili/JL_260x380_GameID397_en-US.png", gameId: "397" },
      { img: "/assets/games/jili/JL_260x380_GameID299_en-US.png", gameId: "299" },
      { img: "/assets/games/jili/JL_260x380_GameID464_en-US.png", gameId: "464" },
      { img: "/assets/games/jili/JL_260x380_GameID264_en-US.png", gameId: "264" },
      { img: "/assets/games/jili/JL_260x380_GameID263_en-US.png", gameId: "263" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_300.png", gameId: "300" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_252.png", gameId: "252" },
      { img: "/assets/games/jili/GAMEID_231_EN_260x380.png", gameId: "231" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_114.png", gameId: "114" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_153.png", gameId: "153" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_253.png", gameId: "253" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_259.png", gameId: "259" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_301.png", gameId: "301" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_220.png", gameId: "220" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_226.png", gameId: "226" },
      { img: "/assets/games/jili/GAMEID_132_EN_260x380.png", gameId: "132" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_298.png", gameId: "298" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_209.png", gameId: "209" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_238.png", gameId: "238" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_208.png", gameId: "208" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_254.png", gameId: "254" },
      { img: "/assets/games/jili/260x380_EN_GAMEID_211.png", gameId: "211" },
    ],
    fishing: [
      { id: 'slot-1', title: 'Slot 1', gameId: '229', img: '/assets/flash/229.png' },
      { id: 'slot-2', title: 'Slot 2', gameId: '224', img: '/assets/flash/224.png' },
      { id: 'slot-3', title: 'Slot 3', gameId: '232', img: '/assets/flash/232.png' },
      { id: 'slot-4', title: 'Slot 4', gameId: '233', img: '/assets/flash/233.png' },
      { id: 'slot-5', title: 'Slot 5', gameId: '235', img: '/assets/flash/235.png' },
      { id: 'slot-6', title: 'Slot 6', gameId: '236', img: '/assets/flash/236.png' },
    ],
    rummy: [
      { img: "https://image.0nxq4.cc/icon/20240513173344303008.png", gameId: "464" },
      { img: "https://image.0nxq4.cc/icon/20240513173526027011.png", gameId: "397" },
      { img: "https://image.0nxq4.cc/icon/202502051305011533117.png", gameId: "299" },
    ],

  };



  const casinoTabs={
    evoRing:[ 
      { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240513140303366005.png' ,subtitle:"Roulette",desc:""},
    
      ],


      evoLive:[
        { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: 'lobby', img: 'https://m7rhjtz.thefanz.net/desktop/lobby.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino2', title: 'EVOLIVE LIVE', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: '1hl323e1lxuqdrkr', img: 'https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl323e1lxuqdrkr/poster.jpg?v0.6583499167741359', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino3', title: 'EZUGI', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: '1hl65ce1lxuqdrkr', img: 'https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl65ce1lxuqdrkr/poster.jpg?v0.6583499167741359', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino4', title: 'WINFINITY', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: '381rwkr381korean', img: 'https://client.pragmaticplaylive.net/desktop/assets/snaps/381rwkr381korean/poster.jpg?v0.6583499167741359', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino5', title: 'YEEBET', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: '5bzl2835s5ruvweg', img: 'https://client.pragmaticplaylive.net/desktop/assets/snaps/5bzl2835s5ruvweg/poster.jpg?v0.6583499167741359', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino6', title: 'PRAGMATIC GAME', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-pragmatic', gameCode: '5kvxlw4c1qm3xcyn', img: 'https://client.pragmaticplaylive.net/desktop/assets/snaps/5kvxlw4c1qm3xcyn/poster.jpg?v0.6583499167741359', subtitle: "Roulette", desc: "" },
      ],

      ezughi:[
        { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '1000', img: 'https://play.thefanz.net/images/tables/italian_roulette.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino2', title: 'EVOLIVE LIVE', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '5001', img: 'https://play.thefanz.net/images/tables/cricket_auto_roulette.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino3', title: 'EZUGI', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '221000', img: 'https://play.thefanz.net/images/tables/speed_auto_roulette.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino4', title: 'WINFINITY', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '221002', img: 'https://play.thefanz.net/images/tables/football_roulette.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino5', title: 'YEEBET', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '221003', img: 'https://play.thefanz.net/images/tables/diamond_roulette.jpg', subtitle: "Roulette", desc: "" },
        { id: 'roulette_casino6', title: 'PRAGMATIC GAME', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', vendorCode: 'casino-ezugi', gameCode: '221004', img: 'https://play.thefanz.net/images/tables/prestige_auto_roulette.jpg', subtitle: "Roulette", desc: "" },
      ],

      wify:[
        { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l',gameCode: 'lobby', vendorCode: "casino-dream", img: 'https://dream.thefanz.net/images/dream.jpg' ,subtitle:"Roulette",desc:""},
       
      ],

      yb:[
        { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240513140303366005.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino2', title: 'EVOLIVE LIVE', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/202502051304248271108.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino3', title: 'EZUGI', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122338043003.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino4', title: 'WINFINITY', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122401590014.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino5', title: 'YEEBET', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122455222004.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino6', title: 'PRAGMATIC GAME', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122154561001.png' ,subtitle:"Roulette",desc:""},
      ],

      pp:[
        { id: 'roulette_casino1', title: 'EVOLIVE RNG', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240513140303366005.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino2', title: 'EVOLIVE LIVE', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/202502051304248271108.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino3', title: 'EZUGI', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122338043003.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino4', title: 'WINFINITY', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122401590014.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino5', title: 'YEEBET', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122455222004.png' ,subtitle:"Roulette",desc:""},
        { id: 'roulette_casino6', title: 'PRAGMATIC GAME', gameId: 'EVOLIVE_pv2zgy42anvdwk3l', img: 'https://image.0nxq4.cc/icon/20240514122154561001.png' ,subtitle:"Roulette",desc:""},
      ],
    }

  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState("");
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [accountType, setAccountType] = useState('');

  
  const scrollToMiddle = () => {
    window.scrollTo({
      top: document.documentElement.scrollHeight / 2,
      behavior: "smooth",
    });
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

  const handleCloseDialog = useCallback(() => {
    setOpenDialog(false);
  }, []);

  const navigate = useNavigate();
  const handleConfirmRecharge = () => {
    // Navigate to recharge page or trigger recharge process
    window.location.href = "/recharge"; // Adjust this path as needed
  };

  const allgame = () => {
    // Navigate to recharge page or trigger recharge process
    window.location.href = "/all-games"; // Adjust this path as needed
  };

  const jili = useCallback(async (gameId) => {
    if (accountType === 'Restricted') {
      alert('Your account is restricted. You cannot play games at this time.');
      return;
    }
  
    console.log('Jili game:', gameId);
    try {
      const token = sessionStorage.getItem("token");
      const response = await axios.post(
        `${domain}/jilireal-test-login/`,
        { GameId: gameId },
        {
          headers: {
            Authorization: `Bearer ${token}`,
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
  }, [accountType]);



   const [isLoading, setIsLoading] = useState(true);


   async function launchGame(vendorCode, gameCode) {
    if (accountType === 'Restricted') {
      alert('Your account is restricted. You cannot play games at this time.');
      return;
    }
  
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

const topbet = async (app_id) => {
  if (accountType === 'Restricted') {
    alert('Your account is restricted. You cannot play games at this time.');
    return;
  }

  console.log("--------->",app_id);
  setIsLoading(true);
  try {
    const token = sessionStorage.getItem("token");
    const response = await axios.post(
      `${domain}/topbetgaming-login/`,
      { app_id },
      {
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

const handleItemClick = useCallback((path) => {
  // If the user is restricted, allow navigation without showing the popup
  if (accountType === 'Restricted') {
    if (!path) {
      console.error('No path provided for navigation');
      return;
    }

    try {
      console.log('Navigating to:', path);
      navigate(path);
    } catch (error) {
      console.error('Navigation error:', error);
    }
    return;
  }

  // Show the popup if the user has not deposited and the deposit check is complete
  if (!hasDeposit && !isDepositCheckLoading) {
    setSelectedGame({ game: path.split('/').pop() });
    setOpenDialog(true);
    return;
  }

  if (!path) {
    console.error('No path provided for navigation');
    return;
  }

  try {
    console.log('Navigating to:', path);
    navigate(path);
  } catch (error) {
    console.error('Navigation error:', error);
  }
}, [accountType, hasDeposit, isDepositCheckLoading, navigate]);

  const contentRef = useRef(null);

const handleTabClick = (index) => {
  setActiveTab(index);
  
  if (contentRef.current) {
    contentRef.current.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  }
};
  
  const SectionHeading = ({ title }) => (
<Box
  sx={{
    fontSize: '15px',
    fontWeight: 700,
    fontFamily: 'Arial, sans-serif',
    color: '#333',
    mb: 1,
    pl: 0,
    lineHeight: '1', 
    width: '100%',
    marginTop:"-20px"
  }}
>
  <div style={{
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    width: "100%",
    position: "relative",
    paddingLeft: "4px"
  }}>
    {/* Border applied to a pseudo-element with controlled height */}
    <div 
      style={{
        marginTop:"10px",
        position: "absolute",
        left: 0,
        top: "50%",
        transform: "translateY(-50%)",
        width: "4px",
        height: "20px", // Control border height here
        backgroundColor: "rgb(245,68,68)"
      }}
    />
    
    <div style={{
      display: "flex",
      alignItems: "center",
      height: "32px",
      marginTop:"20px",
      marginLeft:"5px",
      
    }}>
      {title}
    </div>
    <button style={{
      border: '2px solid #afafaf',
      borderRadius: '5px',
      background: 'transparent',
      color: '#afafaf',
      fontSize: '12px',
      cursor: 'pointer',
      padding: '1px 30px',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      fontWeight: 'normal',
      height: "20px"
    }}
    onClick={()=>{navigate("/all-games")}}
    >
      All
    </button>
  </div>
</Box>
);

const LotteryItem = ({ title, subtitle, desc, img, onClick, amount }) => (
  <Box
    onClick={onClick}
    sx={{
      height: '125px',
      bgcolor: 'white',
      borderRadius: '16px',
      p: 1,
      mb: 2,
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'stretch',
      cursor: 'pointer',
      boxShadow: '0 2px 8px rgba(0,0,0,0.3)',
      transition: '0.3s',
      '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0 4px 12px rgba(0,0,0,0.3)'
      }
    }}
  >
    {/* Left section with red background and image */}
    <Box 
      sx={{
        width: '80px',
        height: '100%',
        bgcolor: 'rgb(254,99,99)',
        borderRadius: '12px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        mr: 2
      }}
    >
      <Typography
        sx={{
          position: 'absolute',
          top: '8px',
          left: '8px',
          fontSize: '16px',
          fontWeight: 700,
          color: 'white',
          fontFamily: "Arial, sans-serif"
        }}
      >
        {title}
      </Typography>
      
      <Box
        component="img"
        src={img}
        alt={title}
        sx={{
          width: '60px',
          height: '60px',
          objectFit: 'contain'
        }}
      />
    </Box>
    
    {/* Middle section with text content */}
    <Box sx={{ flex: 1, textAlign: 'left', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}>
      <Typography sx={{ fontSize: '20px', fontWeight: 700, color: '#333', mb: 0, fontFamily: "Arial, sans-serif" }}>
        {title}
      </Typography>
      
      <Typography sx={{ fontSize: '11px', color: '#777', fontFamily: "Arial, sans-serif" }}>
        {desc}
      </Typography>
    </Box>
    
    {/* Right section with button */}
    <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'flex-end', ml: 1 }}>
      <Button
        sx={{
          bgcolor: 'rgb(254,99,99)',
          color: 'white',
          borderRadius: '20px',
          height: '32px',
          px: 2,
          py: 1,
          textTransform: 'none',
          fontWeight: 'bold',
          fontSize: '16px',
          '&:hover': {
            bgcolor: 'rgb(235,80,80)'
          }
        }}
      >
        GO →
      </Button>
    </Box>
  </Box>
);

// Import these at the top of your file
// import { Box, Typography, Button } from '@mui/material';

  const LotteryItemSports = ({ title, subtitle, desc, img,onClick }) => (
<Box
  onClick={onClick}
  sx={{
    height: '120px',
    backgroundImage: `url(${img})`,
    backgroundSize: 'cover',     // This makes the image cover the entire box
    backgroundPosition: 'center', // This centers the image in the box
    borderRadius: '16px',
    p: 0,
    mb: 2,
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'stretch',
    color: 'white',
    cursor: 'pointer',
    transition: '0.3s',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: '0 4px 12px rgba(0,0,0,0.1)'
    }
  }}
>
</Box>
  );

 // ...existing code...
 const GameGrid = ({ games, currentPage, setPage, onGameClick }) => {
  const itemsPerPage = 6;
  const currentItems = games.slice(currentPage * itemsPerPage, (currentPage + 1) * itemsPerPage);
  const totalPages = Math.ceil(games.length / itemsPerPage);

  return (
    
    <Box sx={{ position: 'relative' }}>
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: {
          xs: 'repeat(2, 1fr)', // 2 columns for extra small screens (below 600px, which includes your 300px requirement)
          sm: 'repeat(3, 1fr)', // 3 columns for small screens and above
          md: 'repeat(3, 1fr)', // 4 columns for medium screens and above
        },
        gap: 1,
        mb: 2
      }}>
        {currentItems.map((game) => (
         <Box
           key={game.id}
           onClick={() => onGameClick(game.gameId)}
           sx={{
             width: { xs: '100%', sm: 110 }, // Full width on extra small screens, fixed width on larger screens
             height: 130,
             marginRight: 0,
             bgcolor: 'rgb(254,167,148)',
             borderRadius: '16px',
             overflow: 'hidden',
             cursor: 'pointer',
             transition: '0.3s',
             '&:hover': {
               transform: 'scale(1.05)'
             }
           }}
         >
           <Box
             component="img"
             src={game.img}
             alt={game.title}
             sx={{
               width: '90%',
               height: '100%',
               objectFit: 'cover',
             }}
           />
         </Box>
        ))}
      </Box>
      
      {totalPages > 1 && (
        <Box sx={{ 
          display: 'flex', 
          justifyContent: 'flex-end',
          gap: 1,
          mt: 2
        }}>
          <Box 
            onClick={() => setPage(Math.max(0, currentPage - 1))}
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#4D8FFF',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              '&:hover': { bgcolor: '#4D8FFF' }
            }}
          >
            {'<'}
          </Box>
          <Box
            onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
            sx={{
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              bgcolor: '#F95959',
              borderRadius: '8px',
              cursor: 'pointer',
              color: '#fff',
              '&:hover': { bgcolor: '#4D8FFF' }
            }}
          >
            {'>'}
          </Box>
        </Box>
      )}
    </Box>
  );
};
// ...existing code...

  return (
    <Box sx={{ width: '100%', maxWidth: '3xl', margin: 'auto' }}>
      <Box sx={{ position: 'relative', px: 0,mb:0 }}>
        <Box 
          sx={{
            display: 'flex',
            overflowX: 'hidden',
            scrollBehavior: 'smooth',
            position: 'relative',
            '&::-webkit-scrollbar': { display: 'none' },
            msOverflowStyle: 'none',
            scrollbarWidth: 'none',
          }}
        >
<div className="p-1 w-full max-w-3xl mx-auto">
      {/* First row - 4 distinct boxes with small gap */}
      <div className="grid grid-cols-4 gap-2 mb-3" >
        {tabs.slice(0, 4).map((tab, index) => (
          <div 
            ref={contentRef}
            key={tab.id} 
            onClick={() => handleTabClick(index)}
            className="relative overflow-hidden cursor-pointer  flex flex-col items-center"
            style={{
              background: index === 0 ? '#54ABE5' : 
                         index === 1 ? '#FFA735' : 
                         index === 2 ? '#8163EA' : 
                         '#FF5F74',
              padding: '5px',
              height: '105px',
              borderRadius: '11px',
            }}
          >
         <div className="text-white font-bold text-lg pb-1" style={{ fontFamily: 'Arial', fontWeight: 700, fontSize: '12px' }}>{tab.label}</div>
            <div className="flex-grow flex items-center justify-center w-full">
              <img 
                src={tab.img} 
                alt={tab.label}
                className="w-[89px] h-[90px] object-contain"

              />
            </div>
            
          </div>
        ))}
      </div>

      {/* Second row - Purple bar with 4 sections */}
      <div className=" overflow-hidden" style={{ backgroundImage: 'url(https://www.66lottery9.com/static/gameIcon/di_new.png?v=1.0.0)', borderRadius: '8px',backgroundClip: 'padding-box', backgroundSize: 'cover', backgroundPosition: 'center', height: '100px', }}>
        <div className="flex">
          {tabs.slice(4, 8).map((tab, index) => (
            <div
            key={tab.id}
            onClick={() => handleTabClick(index + 4)}
            className="flex-1 flex flex-col items-center justify-center py-4 cursor-pointer  text-white relative"
            style={{
              // Remove the border from here
              height: '100px',
              position: 'relative' // Add position relative for absolute positioning inside
            }}
          >
            {/* Add a pseudo border element with controlled height */}
    {index < 3 && (
      <div
        style={{
          position: 'absolute',
          right: 0,
          top: '50%',
          transform: 'translateY(-50%)',
          width: '3px',
          height: '60px', // Control border height here (adjust as needed)
          backgroundColor: 'rgba(255, 255, 255, 0.1)'
        }}
      />
    )}
              <div className="flex items-center justify-center mb-2">
                <img 
                  src={tab.img} 
                  alt={tab.label}
                  className="w-12 h-12 object-contain"
                />
              </div>
              <span className="font-bold text-lg" style={{ fontFamily: 'Arial', fontWeight: 700, fontSize: '12px' }}>{tab.label}</span>
            </div>
          ))}
        </div>
      </div>
    </div>

        </Box>
      </Box>

      <Box sx={{ mt: 0, px: 1 }}>
        {activeTab === 1 && (
          <Box>
            <SectionHeading title="Lottery" />
            {lotteryGames.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
                onClick={() => handleItemClick(game.path)}
              />
            ))}
          </Box>
        )}
        


{activeTab === 0 && (
  <Box sx={{ width: '100%', overflow: 'hidden', }}>
  <SectionHeading  title="Lottery Games" />
  <Box
  sx={{
    display: 'flex',  // Changed to flex instead of grid
    flexDirection: 'row',
    flexWrap: 'nowrap', // Prevent wrapping to new lines
    justifyContent: 'space-between', // Distribute items evenly
    gap: 1,
    width: '100%',
    padding: '0px',
    overflow: 'auto', // Allow horizontal scrolling if needed on very small screens
  }}
>
  {lotteryGames.slice(0, 4).map((game, index) => (
    <Box
      key={index}
      onClick={() => handleItemClick(game.path)}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
        backgroundImage: "url(https://www.66lottery9.com/static/gameIcon/gamebg.png)",
        backgroundSize: 'cover',
        backgroundPosition: 'center',
        borderRadius: '8px',
        width: 'calc(25% - 8px)', // Take up 25% of parent width minus gap
        maxWidth: '85px', // Maximum width
        aspectRatio: '85/110', // Maintain aspect ratio
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        position: 'relative',
        overflow: 'hidden',
        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
        flex: '1 0 auto', // Allow growing but not shrinking
      }}
    >
      <span className="font-bold text-sm text-white py-1 -mt-9">{game.title}</span>
      <img
        src={game.img}
        alt={game.title}
        style={{
          marginTop: -2,
          width: '55%',
          height: 'auto',
          maxHeight: '85%',
          objectFit: 'contain',
          borderRadius: '4px',
        }}
      />
      <button
        style={{
          position: 'absolute',
          bottom: '10px',
          padding: '1px 10px',
          background: 'transparent',
          color: 'white',
          border: '1px solid white',
          borderRadius: '20px',
          fontSize: '10px',
          fontWeight: 'bold',
          cursor: 'pointer',
        }}
        onClick={(e) => {
          e.stopPropagation();
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          jili(game.gameId);
        }}
      >
        GO
      </button>
    </Box>
  ))}
</Box>
<SectionHeading title="Hot Games" />
<Box
  sx={{
    display: 'grid',
    gridTemplateColumns: 'repeat(4, 1fr)',
    gap: 2,
    width: '100%',
    '& > *': {
      width: '100%',
      minWidth: 0,
    }
  }}
>
  {gamesByTab.hot_games.slice(0, 4).map((game, index) => (
    <Box
      key={index}
      onClick={() => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Flash Game' });
          setOpenDialog(true);
          return;
        }
        topbet(game.gameId);
      }}
      sx={{
        cursor: 'pointer',
        transition: 'transform 0.2s',
        '&:hover': { transform: 'scale(1.02)' },
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
      }}
    >
      {/* Game Image */}
      <Box
        sx={{
          width: '100%',
          height: '95px',
          borderRadius: '12px',
          overflow: 'hidden',
          mb: 1,
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
        }}
      >
        <img
          src={game.img}
          alt={game.title}
          style={{
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            borderRadius: '12px',
          }}
        />
      </Box>
      
      {/* Game Title Background */}
      <Box
        sx={{
          width: '100%',
          py: 1,
          px: 1,
          bgcolor: '#f0f0f0',
          borderRadius: '12px',
          textAlign: 'center',
        }}
      >
        {/* Game Title */}
        <Typography
          variant="h1"
          sx={{
            fontWeight: 100,
            color: '#333',
            fontSize: '12px',
            fontFamily: 'Arial, sans-serif',
          }}
        >
          {game.title}
        </Typography>
      </Box>
    </Box>
  ))}
</Box>

  <SectionHeading title="Original Games" />
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {gamesByTab.originals.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          topbet(game.gameId);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '115px', 
            height: '115px',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>


  <SectionHeading title="Slot Games" />
    <GameGrid 
      games={gamesByTab.slot}
      currentPage={slotPage}
      setPage={setSlotPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Slot Game' });
          setOpenDialog(true);
          return;
        }
        allgame();
      }}
    />

<Box>
    <SectionHeading title="Sports Games" />
    {gamesByTab.sports.map((game) => (
              <LotteryItemSports
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
               
              />
            ))}
  </Box>
  <SectionHeading title="Casino Games" />
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {gamesByTab.casino.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          launchGame(game.vendorCode, game.gameCode);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>
  <SectionHeading title="Fishing Games" />
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {gamesByTab.fishing.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          jili(game.gameId);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '115px', 
            height: '115px',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>
  <SectionHeading title="Rummy Games" />
  <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {gamesByTab.rummy.slice(0, 4).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          jili(game.gameId);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>
</Box>
)}

{activeTab === 2 && (
  <Box>
    <SectionHeading title="Slot Games" />
    <GameGrid 
      games={gamesByTab.slot}
      currentPage={slotPage}
      setPage={setSlotPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Slot Game' });
          setOpenDialog(true);
          return;
        }
        allgame();
      }}
    />
  </Box>
)}


{activeTab === 4 && (
          <Box>
            <SectionHeading title="Pragmatic Play" />
            <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {casinoTabs.evoLive.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          launchGame(game.vendorCode, game.gameCode);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>



  {/* <SectionHeading title="EVO-RNG" />
            <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {casinoTabs.evoRing.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          jili(game.gameId);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box> */}



  <SectionHeading title="EZUGI" />
            <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {casinoTabs.ezughi.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          launchGame(game.vendorCode, game.gameCode);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>



  <SectionHeading title="Dream Gaming" />
            <Box
    sx={{
      display: 'grid',
      gridTemplateColumns: 'repeat(3, 1fr)',
      gap: 1,
      mb: 4,
      width: '100%',
      '& > *': {
        width: '100%',
        minWidth: 0,
      }
    }}
  >
    {casinoTabs.wify.slice(0, 6).map((game, index) => (
      <Box 
        key={index}
        onClick={() => {
          if (!hasDeposit && !isDepositCheckLoading) {
            setSelectedGame({ game: 'Flash Game' });
            setOpenDialog(true);
            return;
          }
          launchGame(game.vendorCode, game.gameCode);
        }}
        sx={{
          cursor: 'pointer',
          transition: 'transform 0.2s',
          '&:hover': { transform: 'scale(1.02)' },
        }}
      >
        <img 
          src={game.img} 
          alt={game.title}
          style={{ 
            width: '100%', 
            height: 'auto',
            borderRadius: '8px',
          }} 
        />
       
      </Box>
    ))}
  </Box>
          </Box>
 )}

{activeTab === 3 && (
  <Box>
    <SectionHeading title="Sports Games" />
    {gamesByTab.sports.map((game) => (
              <LotteryItemSports
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
               
              />
            ))}
  </Box>
)}

{/* {activeTab === 4 && (
  <Box>
    <SectionHeading title="Casino Games" />
    <GameGrid 
      games={gamesByTab.casino}
      currentPage={casinoPage}
      setPage={setCasinoPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Casino Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)} */}

{activeTab === 5 && (
  <Box>
    <SectionHeading title="Card Games" />
    {gamesByTab.cards.map((game) => (
              <LotteryItem
                key={game.id}
                title={game.title}
                subtitle={game.subtitle}
                desc={game.desc}
                img={game.img}
               
              />
            ))}
  </Box>
)}

{activeTab === 6 && (
  <Box>
    <SectionHeading title="Dice Games" />
    <GameGrid 
      games={gamesByTab.dice}
      currentPage={dicePage}
      setPage={setDicePage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Dice Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}

{activeTab === 7 && (
  <Box>
    <SectionHeading title="Bingo Games" />
    <GameGrid 
      games={gamesByTab.bingo}
      currentPage={bingoPage}
      setPage={setBingoPage}
      onGameClick={(gameId) => {
        if (!hasDeposit && !isDepositCheckLoading) {
          setSelectedGame({ game: 'Bingo Game' });
          setOpenDialog(true);
          return;
        }
        jili(gameId);
      }}
    />
  </Box>
)}
      </Box>
      <RechargeDialog
    open={openDialog}
    onClose={handleCloseDialog}
    onConfirm={handleConfirmRecharge}
    selectedGame={selectedGame}
  />
    </Box>
  );
};

export default TabLayout;