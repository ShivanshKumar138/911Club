import React, { useState, useRef, useEffect, useCallback, memo } from "react";
import { Box, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
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
import { sub } from "date-fns";
import { fontFamily, fontSize, fontWeight } from "@mui/system";
// import { Grid } from '@mui
import fivedimage from "../../public/assets/5d/lotterycategory_20250210101042iwui.png";
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

RechargeDialog.displayName = "RechargeDialog";
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
    {
      id: "sports",
      label: "Popular",
      img: "https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134718aedk.png",
      bgImage: "url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)",
    },

    {
      id: "lobby",
      label: "Lottery",
      img: "https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127134331wkt7.png",
      bgImage: "url(https://goagameb.com/assets/png/lottery_bg-1edd950a.png)",
    },
    {
      id: "slot",
      label: "Slots",
      img: "https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127160211wyu9.png",
      bgImage: "rgb(87,199,221)",
    },
    {
      id: "cards",
      label: "Sport",
      img: "https://ossimg.goa999.vip/GoaGame/gamecategory/gamecategory_20240127171151ol6s.png",
      bgcolor: "transparent",
    },
    {
      id: "casino",
      label: "Casino",
      img: "https://www.66lottery9.com/static/gameIcon/video_icon.png?v=1.0.0",
      bgcolor: "transparent",
    },
    {
      id: "flash",
      label: "Rummy",
      img: "https://www.66lottery9.com/static/gameIcon/chess_icon.png?v=1.0.0",
      bgcolor: "linear-gradient(to bottom, #fbb2ff, #e27bd1)",
    },
    {
      id: "original",
      label: "Original",
      img: "https://www.66lottery9.com/static/gameIcon/flash_icon.png?v=1.0.0",
      bgcolor: "rgb(245,144,193)",
    },
    {
      id: "dice",
      label: "Fishing",
      img: "https://www.66lottery9.com/static/gameIcon/fish_icon.png?v=1.0.0",
      bgcolor: "rgb(253,177,107)",
    },
  ];

  const lotteryGames = [
    {
      id: "wingo",
      title: "Win Go",
      subtitle: "Guess the number",
      desc: "Through the platform Win Go  Hash lottery seed as the result of the lottery",
      img: "https://ossimg.91admin123admin.com/91club/lotterycategory/lotterycategory_202502101011154e3a.png",
      path: "/timer/30sec",
    },
    {
      id: "k3",
      title: "K3",
      subtitle: "Guess the number",
      desc: "The player predicts 3 DICE numbers,the winning rate is high,the gameplay is simple,and it is easy to win",
      img: "https://ossimg.91admin123admin.com/91club/lotterycategory/lotterycategory_20250210101053ntrf.png",
      path: "/k3/1min",
    },
    {
      id: "5d",
      title: "5D",
      subtitle: "Guess the number",
      desc: "5 numbers are used as the result of the lottery,and the palying methods are flexible and diverse",
      img: fivedimage,
      path: "/5d/1min",
    },
    {
      id: "trxwin",
      title: "Trx Win",
      subtitle: "Guess the number",
      desc: "By obtaining the real-time hash value of the TRX blockchain as the result of the lottery",
      img: "https://ossimg.91admin123admin.com/91club/lotterycategory/lotterycategory_20250210101104jtse.png",
      path: "/trx/1min",
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
    hot_games: [
      {
        id: "popular-1",
        title: "Popular 1",
        gameId: 800,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/800_20250210113151122.png",
      },
      {
        id: "popular-2",
        title: "Popular 2",
        gameId: 801,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/801_20250210111620851.png",
      },
      {
        id: "popular-3",
        title: "Popular 3",
        gameId: 903,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/500_20250210111515519.png",
      },
      {
        id: "popular-20",
        title: "Popular 20",
        gameId: 810,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/810_20250210113250708.png",
      },
    ],
    originals: [
      {
        id: "popular-10",
        title: "Popular 10",
        gameId: 103,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/103_20250210111953841.png",
      },
      {
        id: "popular-11",
        title: "Popular 11",
        gameId: 104,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/104_20250210111939890.png",
      },
      {
        id: "popular-12",
        title: "Popular 12",
        gameId: 105,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/502_20250210111723255.png",
      },
      {
        id: "popular-13",
        title: "Popular 13",
        gameId: 106,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/106.png",
      },
      {
        id: "popular-7",
        title: "Popular 7",
        gameId: 100,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/JILI/229_20250213130902179.png",
      },
      {
        id: "popular-8",
        title: "Popular 8",
        gameId: 101,
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/TB_Chess/101_20250210111652965.png",
      },
    ],
    flash: [
      {
        id: "popular-1",
        title: "Popular 1",
        gameId: 903,
        img: "https://image.0nxq4.cc/game/SPB/Slots/SPB_aviator.png",
      },
      {
        id: "popular-2",
        title: "Popular 2",
        gameId: 801,
        img: "https://image.0nxq4.cc/icon/202502280344359991004.jpg",
      },
      {
        id: "popular-3",
        title: "Popular 3",
        gameId: 903,
        img: "https://image.0nxq4.cc/game/JL/Slots/JL_51.png",
      },
      {
        id: "popular-9",
        title: "Popular 9",
        gameId: 102,
        img: "https://image.0nxq4.cc/icon/202408180914311997003.jpg",
      },
      {
        id: "popular-10",
        title: "Popular 10",
        gameId: 103,
        img: "/assets/flash/103.jpg",
      },
      {
        id: "popular-11",
        title: "Popular 11",
        gameId: 104,
        img: "/assets/flash/104.jpg",
      },
      {
        id: "popular-12",
        title: "Popular 12",
        gameId: 105,
        img: "/assets/flash/105.jpg",
      },
      {
        id: "popular-13",
        title: "Popular 13",
        gameId: 106,
        img: "/assets/flash/106.jpg",
      },
      {
        id: "popular-3",
        title: "Popular 3",
        gameId: 202,
        img: "/assets/flash/802.jpg",
      },
      {
        id: "popular-4",
        title: "Popular 4",
        gameId: 803,
        img: "/assets/flash/803.jpg",
      },
      {
        id: "popular-7",
        title: "Popular 7",
        gameId: 100,
        img: "/assets/flash/100.jpg",
      },
      {
        id: "popular-8",
        title: "Popular 8",
        gameId: 101,
        img: "/assets/flash/101.jpg",
      },
      {
        id: "popular-14",
        title: "Popular 14",
        gameId: 107,
        img: "/assets/flash/107.jpg",
      },
      {
        id: "popular-15",
        title: "Popular 15",
        gameId: 900,
        img: "/assets/flash/900.jpg",
      },
      {
        id: "popular-16",
        title: "Popular 16",
        gameId: 109,
        img: "/assets/flash/109.jpg",
      },
      {
        id: "popular-17",
        title: "Popular 17",
        gameId: 110,
        img: "/assets/flash/110.jpg",
      },
      {
        id: "popular-18",
        title: "Popular 18",
        gameId: 111,
        img: "/assets/flash/111.jpg",
      },
      {
        id: "popular-19",
        title: "Popular 19",
        gameId: 112,
        img: "/assets/flash/112.jpg",
      },
      {
        id: "popular-20",
        title: "Popular 20",
        gameId: 810,
        img: "/assets/flash/810.jpg",
      },
    ],
    popular: [
      {
        id: "slot-1",
        title: "Slot 1",
        gameId: "229",
        img: "/assets/flash/229.png",
      },
      {
        id: "slot-2",
        title: "Slot 2",
        gameId: "224",
        img: "/assets/flash/224.png",
      },
      {
        id: "slot-3",
        title: "Slot 3",
        gameId: "232",
        img: "/assets/flash/232.png",
      },
      {
        id: "slot-4",
        title: "Slot 4",
        gameId: "233",
        img: "/assets/flash/233.png",
      },
      {
        id: "slot-5",
        title: "Slot 5",
        gameId: "235",
        img: "/assets/flash/235.png",
      },
      {
        id: "slot-6",
        title: "Slot 6",
        gameId: "236",
        img: "/assets/flash/236.png",
      },
    ],
    slot: [
      {
        id: "slot1",
        title: "Slot Magic",
        gameId: "223",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20250210101450ooy8.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot2",
        title: "Super Slots",
        gameId: "240",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20250210101414n2wm.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot3",
        title: "Slot Magic",
        gameId: "180",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_202401021653336o2h.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot4",
        title: "Super Slots",
        gameId: "300",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20250210101616beik.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot5",
        title: "Slot Magic",
        gameId: "223",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20250210101541uomm.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot6",
        title: "Super Slots",
        gameId: "240",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20250210101325vpri.png",
        bgColor: "rgb(77,144,254)",
      },
      {
        id: "slot7",
        title: "Slot Magic",
        gameId: "180",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_202502101015194ux1.png ",
        bgColor: "rgb(77,144,254)",
      },
    ],
    sports: [
      {
        id: "football_sports",
        title: "Football",
        gameId: "403",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20240102165536rgfg.png",
        subtitle: "Football",
        desc: "",
      },
      {
        id: "cricket_sports",
        title: "Cricket",
        gameId: "389",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20240102165536rgfg.png",
        subtitle: "Cricket",
        desc: "",
      },
    ],
    casino: [
      {
        id: "roulette_casino3",
        title: "EZUGI",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "1000",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_20240102165020x66i.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino6",
        title: "PRAGMATIC GAME",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "lobby",
        img: "https://ossimg.91admin123admin.com/91club/vendorlogo/vendorlogo_202401021635413lly.png",
        subtitle: "Roulette",
        desc: "",
      },
    ],
    cards: [
      {
        id: "poker_cards",
        title: "Poker",
        gameId: "EVOLIVE_TRPTable00000001",
        img: "/assets/evolution/EVOLIVE_TRPTable00000001.png",
        subtitle: "Poker",
        desc: "365",
      },
      {
        id: "baccarat_cards",
        title: "Baccarat",
        gameId: "EVOLIVE_Always8baccarat0",
        img: "/assets/evolution/EVOLIVE_Always8baccarat0.png",
        subtitle: "Baccarat",
        desc: "365",
      },
    ],
    dice: [
      {
        img: "/assets/games/jili/JL_260x380_GameID464_en-US.png",
        gameId: "464",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID404_en-US.png",
        gameId: "404",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID259_en-US.png",
        gameId: "259",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID427_en-US.png",
        gameId: "427",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID441_en-US.png",
        gameId: "441",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID439_en-US.png",
        gameId: "439",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID439_en-US.png",
        gameId: "439",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID439_en-US.png",
        gameId: "439",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID372_en-US.png",
        gameId: "372",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID440_en-US.png",
        gameId: "440",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID302_en-US.png",
        gameId: "302",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID400_en-US.png",
        gameId: "400",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID407_en-US.png",
        gameId: "407",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID399_en-US.png",
        gameId: "399",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID301_en-US.png",
        gameId: "301",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID258_en-US.png",
        gameId: "258",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID420_en-US.png",
        gameId: "420",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID074_en-US.png",
        gameId: "074",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID223_en-US.png",
        gameId: "223",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID240_en-US.png",
        gameId: "240",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID180_en-US.png",
        gameId: "180",
      },
    ],
    bingo: [
      {
        img: "/assets/games/jili/JL_260x380_GameID464_en-US.png",
        gameId: "464",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID397_en-US.png",
        gameId: "397",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID299_en-US.png",
        gameId: "299",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID464_en-US.png",
        gameId: "464",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID264_en-US.png",
        gameId: "264",
      },
      {
        img: "/assets/games/jili/JL_260x380_GameID263_en-US.png",
        gameId: "263",
      },
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
      {
        id: "slot-1",
        title: "Slot 1",
        gameId: "229",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/JILI/82.png",
      },
      {
        id: "slot-2",
        title: "Slot 2",
        gameId: "224",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/JILI/32.png",
      },
      {
        id: "slot-3",
        title: "Slot 3",
        gameId: "232",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/MG_Fish/SFG_WDGoldenTyrantFishing.png",
      },
      {
        id: "slot-4",
        title: "Slot 4",
        gameId: "233",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/JILI/20.png",
      },
      {
        id: "slot-5",
        title: "Slot 5",
        gameId: "235",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/MG_Fish/SFG_WDGoldBlastFishing.png",
      },
      {
        id: "slot-6",
        title: "Slot 6",
        gameId: "236",
        img: "https://ossimg.91admin123admin.com/91club/gamelogo/JILI/1.png",
      },
    ],
    rummy: [
      {
        img: "https://image.0nxq4.cc/icon/20240513173344303008.png",
        gameId: "464",
      },
      {
        img: "https://image.0nxq4.cc/icon/20240513173526027011.png",
        gameId: "397",
      },
      {
        img: "https://image.0nxq4.cc/icon/202502051305011533117.png",
        gameId: "299",
      },
    ],
  };

  const casinoTabs = {
    evoRing: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240513140303366005.png",
        subtitle: "Roulette",
        desc: "",
      },
    ],

    evoLive: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "lobby",
        img: "https://m7rhjtz.thefanz.net/desktop/lobby.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino2",
        title: "EVOLIVE LIVE",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "1hl323e1lxuqdrkr",
        img: "https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl323e1lxuqdrkr/poster.jpg?v0.6583499167741359",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino3",
        title: "EZUGI",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "1hl65ce1lxuqdrkr",
        img: "https://client.pragmaticplaylive.net/desktop/assets/snaps/1hl65ce1lxuqdrkr/poster.jpg?v0.6583499167741359",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino4",
        title: "WINFINITY",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "381rwkr381korean",
        img: "https://client.pragmaticplaylive.net/desktop/assets/snaps/381rwkr381korean/poster.jpg?v0.6583499167741359",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino5",
        title: "YEEBET",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "5bzl2835s5ruvweg",
        img: "https://client.pragmaticplaylive.net/desktop/assets/snaps/5bzl2835s5ruvweg/poster.jpg?v0.6583499167741359",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino6",
        title: "PRAGMATIC GAME",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-pragmatic",
        gameCode: "5kvxlw4c1qm3xcyn",
        img: "https://client.pragmaticplaylive.net/desktop/assets/snaps/5kvxlw4c1qm3xcyn/poster.jpg?v0.6583499167741359",
        subtitle: "Roulette",
        desc: "",
      },
    ],

    ezughi: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "1000",
        img: "https://play.thefanz.net/images/tables/italian_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino2",
        title: "EVOLIVE LIVE",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "5001",
        img: "https://play.thefanz.net/images/tables/cricket_auto_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino3",
        title: "EZUGI",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "221000",
        img: "https://play.thefanz.net/images/tables/speed_auto_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino4",
        title: "WINFINITY",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "221002",
        img: "https://play.thefanz.net/images/tables/football_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino5",
        title: "YEEBET",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "221003",
        img: "https://play.thefanz.net/images/tables/diamond_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino6",
        title: "PRAGMATIC GAME",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        vendorCode: "casino-ezugi",
        gameCode: "221004",
        img: "https://play.thefanz.net/images/tables/prestige_auto_roulette.jpg",
        subtitle: "Roulette",
        desc: "",
      },
    ],

    wify: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        gameCode: "lobby",
        vendorCode: "casino-dream",
        img: "https://dream.thefanz.net/images/dream.jpg",
        subtitle: "Roulette",
        desc: "",
      },
    ],

    yb: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240513140303366005.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino2",
        title: "EVOLIVE LIVE",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/202502051304248271108.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino3",
        title: "EZUGI",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122338043003.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino4",
        title: "WINFINITY",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122401590014.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino5",
        title: "YEEBET",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122455222004.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino6",
        title: "PRAGMATIC GAME",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122154561001.png",
        subtitle: "Roulette",
        desc: "",
      },
    ],

    pp: [
      {
        id: "roulette_casino1",
        title: "EVOLIVE RNG",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240513140303366005.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino2",
        title: "EVOLIVE LIVE",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/202502051304248271108.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino3",
        title: "EZUGI",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122338043003.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino4",
        title: "WINFINITY",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122401590014.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino5",
        title: "YEEBET",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122455222004.png",
        subtitle: "Roulette",
        desc: "",
      },
      {
        id: "roulette_casino6",
        title: "PRAGMATIC GAME",
        gameId: "EVOLIVE_pv2zgy42anvdwk3l",
        img: "https://image.0nxq4.cc/icon/20240514122154561001.png",
        subtitle: "Roulette",
        desc: "",
      },
    ],
  };

  const [firstDepositMade, setFirstDepositMade] = useState(true);
  const [needToDepositFirst, setNeedToDepositFirst] = useState(false);
  const [phoneUserUid, setPhoneUserUid] = useState(null);
  const [openDialog, setOpenDialog] = useState(false);
  const [selectedGame, setSelectedGame] = useState(null);
  const [gameType, setGameType] = useState("");
  const [isDepositCheckLoading, setIsDepositCheckLoading] = useState(true);
  const [hasDeposit, setHasDeposit] = useState(false);
  const [accountType, setAccountType] = useState("");

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
        const token = sessionStorage.getItem("token");
        const userResponse = await axios.get(`${domain}/user`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        const depositResponse = await axios.get(
          `${domain}/need-to-deposit-first`,
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );

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

  const jili = useCallback(
    async (gameId) => {
      if (accountType === "Restricted") {
        alert(
          "Your account is restricted. You cannot play games at this time."
        );
        return;
      }

      console.log("Jili game:", gameId);
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
        console.log("Jili game response:", response.data.responseData);

        if (ErrorCode === 0) {
          window.location.href = Data;
        }
      } catch (error) {
        console.error("Jili game error:", error);
      }
    },
    [accountType]
  );

  const [isLoading, setIsLoading] = useState(true);

  async function launchGame(vendorCode, gameCode) {
    if (accountType === "Restricted") {
      alert("Your account is restricted. You cannot play games at this time.");
      return;
    }

    console.log("Launching game:", vendorCode, gameCode);
    const token = sessionStorage.getItem("token");
    if (!token) {
      console.error("No auth token found in sessionStorage");
      return;
    }

    try {
      const response = await axios.post(
        `${domain}/game/launch-url`,
        { vendorCode, gameCode },
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (response) {
        console.log("Game launch URL:", response.data);
        window.location.href = response.data.message;
      }
    } catch (error) {
      console.error(
        "Failed to get launch URL:",
        error.response?.data || error.message
      );
    }
  }
  const jdbcall = async (app_id) => {
    setIsLoading(true);
    try {
      const token = sessionStorage.getItem("token"); // Changed to sessionStorage
      const response = await axios.post(
        `${domain}/game/launch/jdb/`,
        { gameCode: app_id },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
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
    if (accountType === "Restricted") {
      alert("Your account is restricted. You cannot play games at this time.");
      return;
    }

    console.log("--------->", app_id);
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

  const handleItemClick = useCallback(
    (path) => {
      // If the user is restricted, allow navigation without showing the popup
      if (accountType === "Restricted") {
        if (!path) {
          console.error("No path provided for navigation");
          return;
        }

        try {
          console.log("Navigating to:", path);
          navigate(path);
        } catch (error) {
          console.error("Navigation error:", error);
        }
        return;
      }

      // Show the popup if the user has not deposited and the deposit check is complete
      if (!hasDeposit && !isDepositCheckLoading) {
        setSelectedGame({ game: path.split("/").pop() });
        setOpenDialog(true);
        return;
      }

      if (!path) {
        console.error("No path provided for navigation");
        return;
      }

      try {
        console.log("Navigating to:", path);
        navigate(path);
      } catch (error) {
        console.error("Navigation error:", error);
      }
    },
    [accountType, hasDeposit, isDepositCheckLoading, navigate]
  );

  const contentRef = useRef(null);

  const handleTabClick = (index) => {
    setActiveTab(index);

    if (contentRef.current) {
      contentRef.current.scrollIntoView({
        behavior: "smooth",
        block: "start",
      });
    }
  };

  const SectionHeading = ({ title, image }) => (
    <Box
      sx={{
        fontSize: "18px",
        fontWeight: 700,
        fontFamily: "Arial, sans-serif",
        color: "#333",
        mb: 1,
        pl: 0,
        lineHeight: "1",
        width: "90%",
        display: "flex",
        alignItems: "center",
        gap: "4px",
      }}
    >
      <div
        style={{
          display: "flex",
          alignItems: "center",
          width: "100%",
          position: "relative",
        }}
      >
        {/* 8-ball image */}
        <img
          src={image}
          alt="8 ball"
          style={{
            width: "35px",
            height: "30px",
            marginRight: "2px",
          }}
        />

        {/* Title */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            fontSize: "18px",
            fontWeight: "bold",
            color: "#1a365d",
          }}
        >
          {title}
        </div>

        {/* All button */}
        <div
          style={{
            marginLeft: "auto",
            display: "flex",
            alignItems: "center",
          }}
        >
          <button
            style={{
              border: "1px solid #d1d5db",
              borderRadius: "16px",
              background: "#f3f4f6",
              color: "#6b7280",
              fontSize: "14px",
              cursor: "pointer",
              padding: "2px 12px",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontWeight: "normal",
            }}
            onClick={() => {
              navigate("/all-games");
            }}
          >
            All
          </button>
        </div>
      </div>
    </Box>
  );

  const LotteryItem = ({ title, subtitle, desc, img, onClick, amount }) => (
    <Box
      onClick={onClick}
      sx={{
        height: "125px",
        bgcolor: "white",
        borderRadius: "16px",
        p: 1,
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        cursor: "pointer",
        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
        },
      }}
    >
      {/* Left section with red background and image */}
      <Box
        sx={{
          width: "80px",
          height: "100%",
          bgcolor: "rgb(254,99,99)",
          borderRadius: "12px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          mr: 2,
        }}
      >
        <Typography
          sx={{
            position: "absolute",
            top: "8px",
            left: "8px",
            fontSize: "16px",
            fontWeight: 700,
            color: "white",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {title}
        </Typography>

        <Box
          component="img"
          src={img}
          alt={title}
          sx={{
            width: "60px",
            height: "60px",
            objectFit: "contain",
          }}
        />
      </Box>

      {/* Middle section with text content */}
      <Box
        sx={{
          flex: 1,
          textAlign: "left",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
        }}
      >
        <Typography
          sx={{
            fontSize: "20px",
            fontWeight: 700,
            color: "#333",
            mb: 0,
            fontFamily: "Arial, sans-serif",
          }}
        >
          {title}
        </Typography>

        <Typography
          sx={{
            fontSize: "11px",
            color: "#777",
            fontFamily: "Arial, sans-serif",
          }}
        >
          {desc}
        </Typography>
      </Box>

      {/* Right section with button */}
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          alignItems: "flex-end",
          ml: 1,
        }}
      >
        <Button
          sx={{
            bgcolor: "rgb(254,99,99)",
            color: "white",
            borderRadius: "20px",
            height: "32px",
            px: 2,
            py: 1,
            textTransform: "none",
            fontWeight: "bold",
            fontSize: "16px",
            "&:hover": {
              bgcolor: "rgb(235,80,80)",
            },
          }}
        >
          GO →
        </Button>
      </Box>
    </Box>
  );

  // Import these at the top of your file
  // import { Box, Typography, Button } from '@mui/material';

  const LotteryItemSports = ({ title, subtitle, desc, img, onClick }) => (
    <Box
      onClick={onClick}
      sx={{
        height: "120px",
        backgroundImage: `url(${img})`,
        backgroundSize: "cover", // This makes the image cover the entire box
        backgroundPosition: "center", // This centers the image in the box
        borderRadius: "16px",
        p: 0,
        mb: 2,
        display: "flex",
        justifyContent: "space-between",
        alignItems: "stretch",
        color: "white",
        cursor: "pointer",
        transition: "0.3s",
        "&:hover": {
          transform: "translateY(-2px)",
          boxShadow: "0 4px 12px rgba(0,0,0,0.1)",
        },
      }}
    ></Box>
  );

  // ...existing code...
  const GameGrid = ({ games, currentPage, setPage, onGameClick }) => {
    const itemsPerPage = 6;
    const currentItems = games.slice(
      currentPage * itemsPerPage,
      (currentPage + 1) * itemsPerPage
    );
    const totalPages = Math.ceil(games.length / itemsPerPage);

    return (
      <Box sx={{ position: "relative" }}>
        <Box
          sx={{
            display: "grid",
            gridTemplateColumns: {
              xs: "repeat(2, 1fr)", // 2 columns for extra small screens (below 600px, which includes your 300px requirement)
              sm: "repeat(3, 1fr)", // 3 columns for small screens and above
              md: "repeat(3, 1fr)", // 4 columns for medium screens and above
            },
            gap: 1,
            mb: 2,
          }}
        >
          {currentItems.map((game) => (
            <Box
              key={game.id}
              onClick={() => onGameClick(game.gameId)}
              sx={{
                width: { xs: "100%", sm: 110 }, // Full width on extra small screens, fixed width on larger screens
                height: 130,
                marginRight: 0,
                bgcolor: "rgb(254,167,148)",
                borderRadius: "16px",
                overflow: "hidden",
                cursor: "pointer",
                transition: "0.3s",
                "&:hover": {
                  transform: "scale(1.05)",
                },
              }}
            >
              <Box
                component="img"
                src={game.img}
                alt={game.title}
                sx={{
                  width: "90%",
                  height: "100%",
                  objectFit: "cover",
                }}
              />
            </Box>
          ))}
        </Box>

        {totalPages > 1 && (
          <Box
            sx={{
              display: "flex",
              justifyContent: "flex-end",
              gap: 1,
              mt: 2,
            }}
          >
            <Box
              onClick={() => setPage(Math.max(0, currentPage - 1))}
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#4D8FFF",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#fff",
                "&:hover": { bgcolor: "#4D8FFF" },
              }}
            >
              {"<"}
            </Box>
            <Box
              onClick={() => setPage(Math.min(totalPages - 1, currentPage + 1))}
              sx={{
                width: 32,
                height: 32,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                bgcolor: "#F95959",
                borderRadius: "8px",
                cursor: "pointer",
                color: "#fff",
                "&:hover": { bgcolor: "#4D8FFF" },
              }}
            >
              {">"}
            </Box>
          </Box>
        )}
      </Box>
    );
  };
  // ...existing code...
  const scrollContainerRef = useRef(null);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    let scrollAmount = 0;
    const itemWidth = 105; // Width + gap of each item
    const scrollSpeed = 2000; // 2 seconds interval

    const autoScroll = setInterval(() => {
      if (container) {
        if (scrollAmount >= container.scrollWidth - container.clientWidth) {
          // Reset to beginning when reaching the end
          scrollAmount = 0;
        } else {
          // Scroll one item at a time
          scrollAmount += itemWidth;
        }

        container.scrollTo({
          left: scrollAmount,
          behavior: "smooth",
        });
      }
    }, scrollSpeed);

    return () => clearInterval(autoScroll);
  }, []);

  return (
    <Box sx={{ width: "100%", maxWidth: "3xl", margin: "auto" }}>
      <Box sx={{ position: "relative", px: 0, mb: 0 }}>
        <div className="bg-white-100">
          {/* Wallet balance and feature section */}
          <div className="p-1">
            {/* Wallet balance and action buttons - in single row with better spacing */}
            <div className="flex flex-wrap items-center justify-between mb-2 gap-0">
              <div className="flex items-center">
                <div className="w-4 h-4 rounded-full bg-yellow-400 mr-1 flex items-center justify-center">
                  <span className="text-yellow-700 text-xs">💰</span>
                </div>
                <div>
                  <div className="text-xs text-gray-700">Wallet balance</div>
                  <div className="text-lg font-bold flex items-center">
                    ₹0.00
                    <div className="ml-1 bg-gray-200 rounded-full p-1">
                      <svg
                        className="w-3 h-3 text-gray-500"
                        fill="none"
                        stroke="currentColor"
                        viewBox="0 0 24 24"
                      >
                        <path
                          strokeLinecap="round"
                          strokeLinejoin="round"
                          strokeWidth={2}
                          d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
                        />
                      </svg>
                    </div>
                  </div>
                </div>
              </div>

              <div className="flex ">
                <button className="bg-gradient-to-br from-orange-300 to-orange-400 text-white px-2 py-1 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M5 10l7-7m0 0l7 7m-7-7v18"
                    />
                  </svg>
                  <span className="font-bold text-xs">Withdraw</span>
                </button>

                <button className="bg-gradient-to-br from-red-400 to-red-500 text-white px-2 py-1 rounded-lg shadow-sm flex items-center">
                  <svg
                    className="w-3 h-3 mr-1"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M19 14l-7 7m0 0l-7-7m7 7V3"
                    />
                  </svg>
                  <span className="font-bold text-xs">Deposit</span>
                </button>
              </div>
            </div>

            {/* Feature buttons - left aligned */}
            <div className="grid grid-cols-2 gap-2 mb-2">
              {/* Wheel of fortune button */}
              <div className="bg-gradient-to-r from-red-400 to-orange-400 rounded-lg p-2 flex items-center justify-start shadow-sm">
                <div className="w-8 h-8 relative mr-1">
                  <div className="absolute inset-0 rounded-full border-2 border-white"></div>
                  <div className="absolute inset-0 rounded-full overflow-hidden">
                    {/* Wheel segments */}
                    {[...Array(8)].map((_, i) => (
                      <div
                        key={i}
                        className={`absolute top-1/2 left-1/2 h-1/2 w-2 -translate-x-1/2 origin-bottom 
                ${
                  i % 3 === 0
                    ? "bg-purple-500"
                    : i % 3 === 1
                    ? "bg-yellow-300"
                    : "bg-orange-300"
                }`}
                        style={{
                          transform: `rotate(${i * 45}deg) translateX(-50%)`,
                        }}
                      />
                    ))}
                    <div className="absolute top-1/2 left-1/2 w-1 h-1 bg-orange-100 rounded-full -translate-x-1/2 -translate-y-1/2"></div>
                  </div>
                </div>
                <div className="text-white">
                  <div className="text-xs font-bold leading-tight">Wheel</div>
                  <div className="text-xs font-bold leading-tight">
                    of fortune
                  </div>
                </div>
              </div>

              {/* VIP privileges button */}
              <div className="bg-gradient-to-r from-purple-500 to-purple-400 rounded-lg p-2 flex items-center justify-start shadow-sm">
                <div className="w-8 h-8 flex items-center justify-center mr-1">
                  <div className="relative w-6 h-5">
                    {/* Crown */}
                    <div className="absolute top-0 left-1/2 -translate-x-1/2 w-5 h-3 bg-yellow-400 rounded-sm">
                      <div className="absolute -top-1 left-0 w-1 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="absolute -top-1 left-1/2 -translate-x-1/2 w-1 h-2 bg-yellow-400 rounded-full"></div>
                      <div className="absolute -top-1 right-0 w-1 h-2 bg-yellow-400 rounded-full"></div>

                      {/* Gemstones */}
                      <div className="absolute top-1 left-1/2 -translate-x-1/2 w-2 h-1 bg-yellow-200 rounded-full flex items-center justify-center">
                        <div className="w-1 h-1 bg-yellow-100 rounded-full"></div>
                      </div>
                    </div>

                    {/* Sparkles */}
                    <div className="absolute -top-1 -right-1 text-yellow-300 text-xs">
                      ✨
                    </div>
                    <div className="absolute -top-1 -left-1 text-yellow-300 text-xs">
                      ✨
                    </div>
                    <div className="absolute -bottom-1 right-0 text-yellow-300 text-xs">
                      ✨
                    </div>
                  </div>
                </div>
                <div className="text-yellow-200">
                  <div className="text-xs font-bold leading-tight">VIP</div>
                  <div className="text-xs font-bold leading-tight">
                    privileges
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Navigation tabs section */}
          <div className="w-full bg-white p-2 rounded">
            <div className="flex items-center justify-between">
              {/* Navigation tabs */}
              <div
                className="flex space-x-4 items-center overflow-x-auto"
                style={{
                  scrollBehavior: "smooth",
                  msOverflowStyle: "none",
                  scrollbarWidth: "none",
                }}
              >
                {tabs.map((tab, index) => (
                  <div
                    key={tab.id}
                    onClick={() => handleTabClick(index)}
                    className={`flex items-center p-2 cursor-pointer ${
                      activeTab === index ? "text-red-500" : "text-gray-600"
                    }`}
                  >
                    <img
                      src={tab.img}
                      alt={tab.label}
                      className="w-6 h-6 mr-2"
                    />
                    <div className="text-sm font-medium">{tab.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </Box>

      <Box sx={{ mt: 0, px: 1 }}>
        {activeTab === 1 && (
          <Box>
            <SectionHeading
              title="Lottery"
              image={"https://91appl.com/assets/svg/ball_8-075598b0.svg"}
            />
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
          <Box sx={{ width: "100%", overflow: "hidden" }}>
            <SectionHeading
              title="Lottery Games"
              image={"https://91appl.com/assets/svg/ball_8-075598b0.svg"}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(2, 1fr)",
                gridTemplateRows: "repeat(2, 1fr)",
                gap: 2,
                maxWidth: "500px", // Limit the maximum width
                width: "100%",
                padding: "5px",
                margin: "0 auto", // Center the entire grid
              }}
            >
              {lotteryGames.slice(0, 4).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => handleItemClick(game.path)}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                    borderRadius: "12px", // Slightly smaller radius
                    height: "120px", // Smaller height
                    maxWidth: "200px", // Maximum width
                    width: "100%", // Take full width within the grid cell
                    position: "relative",
                    overflow: "hidden",
                    boxShadow: "0 3px 8px rgba(0,0,0,0.2)", // Lighter shadow
                    margin: "0 auto", // Center within grid cell
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "100%",
                      objectFit: "cover",
                      position: "absolute",
                      top: 0,
                      left: 0,
                      right: 0,
                      bottom: 0,
                    }}
                  />
                </Box>
              ))}
            </Box>
            <SectionHeading
              title="Hot Games"
              image={"https://91appl.com/assets/svg/mini-4ae18c6b.svg"}
            />
            <Box
              ref={scrollContainerRef} // Add this ref for auto-scrolling
              sx={{
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                gap: 1,
                width: "100%",
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth", // For smoother scrolling
                "&::-webkit-scrollbar": {
                  height: "4px", // Smaller scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                },
              }}
            >
              {gamesByTab.hot_games.slice(0, 4).map(
                (
                  game,
                  index // Increased to show more items for scrolling
                ) => (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!hasDeposit && !isDepositCheckLoading) {
                        setSelectedGame({ game: "Flash Game" });
                        setOpenDialog(true);
                        return;
                      }
                      topbet(game.gameId);
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: "100px", // Smaller fixed width to fit 3 in a row
                      gap: 2,
                    }}
                  >
                    {/* Game Image */}
                    <Box
                      sx={{
                        width: "100px", // Smaller width
                        height: "170px", // Adjusted height to maintain aspect ratio
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        mr: 1,
                      }}
                    >
                      <img
                        src={game.img}
                        alt={game.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Box>
                )
              )}
            </Box>

            <SectionHeading
              title="Original Games"
              image={"https://91appl.com/assets/svg/pop-bc4fd589.svg"}
            />
            <Box
              ref={scrollContainerRef} // Add this ref for auto-scrolling
              sx={{
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                gap: 1,
                width: "100%",
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth", // For smoother scrolling
                "&::-webkit-scrollbar": {
                  height: "4px", // Smaller scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                },
              }}
            >
              {gamesByTab.originals.slice(0, 6).map(
                (
                  game,
                  index // Increased to show more items for scrolling
                ) => (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!hasDeposit && !isDepositCheckLoading) {
                        setSelectedGame({ game: "Flash Game" });
                        setOpenDialog(true);
                        return;
                      }
                      topbet(game.gameId);
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: "100px", // Smaller fixed width to fit 3 in a row
                      gap: 2,
                    }}
                  >
                    {/* Game Image */}
                    <Box
                      sx={{
                        width: "100px", // Smaller width
                        height: "170px", // Adjusted height to maintain aspect ratio
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        mr: 1,
                      }}
                    >
                      <img
                        src={game.img}
                        alt={game.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Box>
                )
              )}
            </Box>

            <SectionHeading
              title="Slot Games"
              image={"https://91appl.com/assets/svg/slots_a-de9dd5ee.svg"}
            />
            <Box
              ref={scrollContainerRef} // Add this ref for auto-scrolling
              sx={{
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                gap: 1,
                width: "100%",
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth", // For smoother scrolling
                "&::-webkit-scrollbar": {
                  height: "4px", // Smaller scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                },
              }}
            >
              {gamesByTab.slot.slice(0, 7).map(
                (
                  game,
                  index // Increased to show more items for scrolling
                ) => (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!hasDeposit && !isDepositCheckLoading) {
                        setSelectedGame({ game: "Flash Game" });
                        setOpenDialog(true);
                        return;
                      }
                      topbet(game.gameId);
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: "100px", // Smaller fixed width to fit 3 in a row
                      gap: 2,
                    }}
                  >
                    {/* Game Image */}
                    <Box
                      sx={{
                        width: "100px", // Smaller width
                        height: "170px", // Adjusted height to maintain aspect ratio
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        mr: 1,
                      }}
                    >
                      <img
                        src={game.img}
                        alt={game.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Box>
                )
              )}
            </Box>

            <Box>
              <SectionHeading
                title="Sports Games"
                image={"https://91appl.com/assets/svg/sports_a-5313dd33.svg"}
              />
              <Box
                ref={scrollContainerRef} // Add this ref for auto-scrolling
                sx={{
                  padding: "5px",
                  display: "flex",
                  flexDirection: "row",
                  gap: 1,
                  width: "100%",
                  overflowX: "auto",
                  pb: 1,
                  scrollBehavior: "smooth", // For smoother scrolling
                  "&::-webkit-scrollbar": {
                    height: "4px", // Smaller scrollbar
                  },
                  "&::-webkit-scrollbar-thumb": {
                    backgroundColor: "rgba(0,0,0,0.2)",
                    borderRadius: "6px",
                  },
                }}
              >
                {gamesByTab.sports.slice(0, 1).map(
                  (
                    game,
                    index // Increased to show more items for scrolling
                  ) => (
                    <Box
                      key={index}
                      onClick={() => {
                        if (!hasDeposit && !isDepositCheckLoading) {
                          setSelectedGame({ game: "Flash Game" });
                          setOpenDialog(true);
                          return;
                        }
                        topbet(game.gameId);
                      }}
                      sx={{
                        cursor: "pointer",
                        transition: "transform 0.2s",
                        "&:hover": { transform: "scale(1.02)" },
                        display: "flex",
                        flexDirection: "column",
                        alignItems: "center",
                        flexShrink: 0,
                        width: "100px", // Smaller fixed width to fit 3 in a row
                        gap: 2,
                      }}
                    >
                      {/* Game Image */}
                      <Box
                        sx={{
                          width: "100px", // Smaller width
                          height: "170px", // Adjusted height to maintain aspect ratio
                          borderRadius: "12px",
                          overflow: "hidden",
                          boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                          mr: 1,
                        }}
                      >
                        <img
                          src={game.img}
                          alt={game.title}
                          style={{
                            width: "100%",
                            height: "100%",
                            objectFit: "cover",
                            borderRadius: "12px",
                          }}
                        />
                      </Box>
                    </Box>
                  )
                )}
              </Box>
            </Box>
            <SectionHeading
              title="Casino Games"
              image={"https://91appl.com/assets/svg/live-7d277a8c.svg"}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mb: 4,
                width: "100%",
                "& > *": {
                  width: "100%",
                  minWidth: 0,
                },
              }}
            >
              {gamesByTab.casino.slice(0, 6).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!hasDeposit && !isDepositCheckLoading) {
                      setSelectedGame({ game: "Flash Game" });
                      setOpenDialog(true);
                      return;
                    }
                    launchGame(game.vendorCode, game.gameCode);
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              ))}
            </Box>
            <SectionHeading
              title="Fishing Games"
              image={"https://91appl.com/assets/png/fishing_a-8b8f8c2c.png"}
            />
            <Box
              ref={scrollContainerRef} // Add this ref for auto-scrolling
              sx={{
                padding: "5px",
                display: "flex",
                flexDirection: "row",
                gap: 1,
                width: "100%",
                overflowX: "auto",
                pb: 1,
                scrollBehavior: "smooth", // For smoother scrolling
                "&::-webkit-scrollbar": {
                  height: "4px", // Smaller scrollbar
                },
                "&::-webkit-scrollbar-thumb": {
                  backgroundColor: "rgba(0,0,0,0.2)",
                  borderRadius: "6px",
                },
              }}
            >
              {gamesByTab.fishing.slice(0, 6).map(
                (
                  game,
                  index // Increased to show more items for scrolling
                ) => (
                  <Box
                    key={index}
                    onClick={() => {
                      if (!hasDeposit && !isDepositCheckLoading) {
                        setSelectedGame({ game: "Flash Game" });
                        setOpenDialog(true);
                        return;
                      }
                      topbet(game.gameId);
                    }}
                    sx={{
                      cursor: "pointer",
                      transition: "transform 0.2s",
                      "&:hover": { transform: "scale(1.02)" },
                      display: "flex",
                      flexDirection: "column",
                      alignItems: "center",
                      flexShrink: 0,
                      width: "100px", // Smaller fixed width to fit 3 in a row
                      gap: 2,
                    }}
                  >
                    {/* Game Image */}
                    <Box
                      sx={{
                        width: "100px", // Smaller width
                        height: "170px", // Adjusted height to maintain aspect ratio
                        borderRadius: "12px",
                        overflow: "hidden",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.1)",
                        mr: 1,
                      }}
                    >
                      <img
                        src={game.img}
                        alt={game.title}
                        style={{
                          width: "100%",
                          height: "100%",
                          objectFit: "cover",
                          borderRadius: "12px",
                        }}
                      />
                    </Box>
                  </Box>
                )
              )}
            </Box>
            <SectionHeading
              title="Rummy Games"
              image={"https://91appl.com/assets/svg/card_a-1da2e03a.svg"}
            />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mb: 4,
                width: "100%",
                "& > *": {
                  width: "100%",
                  minWidth: 0,
                },
              }}
            >
              {gamesByTab.rummy.slice(0, 4).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!hasDeposit && !isDepositCheckLoading) {
                      setSelectedGame({ game: "Flash Game" });
                      setOpenDialog(true);
                      return;
                    }
                    jili(game.gameId);
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
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
                  setSelectedGame({ game: "Slot Game" });
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
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mb: 4,
                width: "100%",
                "& > *": {
                  width: "100%",
                  minWidth: 0,
                },
              }}
            >
              {casinoTabs.evoLive.slice(0, 6).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!hasDeposit && !isDepositCheckLoading) {
                      setSelectedGame({ game: "Flash Game" });
                      setOpenDialog(true);
                      return;
                    }
                    launchGame(game.vendorCode, game.gameCode);
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
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
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mb: 4,
                width: "100%",
                "& > *": {
                  width: "100%",
                  minWidth: 0,
                },
              }}
            >
              {casinoTabs.ezughi.slice(0, 6).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!hasDeposit && !isDepositCheckLoading) {
                      setSelectedGame({ game: "Flash Game" });
                      setOpenDialog(true);
                      return;
                    }
                    launchGame(game.vendorCode, game.gameCode);
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
                    }}
                  />
                </Box>
              ))}
            </Box>

            <SectionHeading title="Dream Gaming" />
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: "repeat(3, 1fr)",
                gap: 1,
                mb: 4,
                width: "100%",
                "& > *": {
                  width: "100%",
                  minWidth: 0,
                },
              }}
            >
              {casinoTabs.wify.slice(0, 6).map((game, index) => (
                <Box
                  key={index}
                  onClick={() => {
                    if (!hasDeposit && !isDepositCheckLoading) {
                      setSelectedGame({ game: "Flash Game" });
                      setOpenDialog(true);
                      return;
                    }
                    launchGame(game.vendorCode, game.gameCode);
                  }}
                  sx={{
                    cursor: "pointer",
                    transition: "transform 0.2s",
                    "&:hover": { transform: "scale(1.02)" },
                  }}
                >
                  <img
                    src={game.img}
                    alt={game.title}
                    style={{
                      width: "100%",
                      height: "auto",
                      borderRadius: "8px",
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
                  setSelectedGame({ game: "Dice Game" });
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
                  setSelectedGame({ game: "Bingo Game" });
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
