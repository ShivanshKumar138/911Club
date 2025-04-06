import React, { useEffect, useState } from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Register from "./Pages/Register";
import Login from "./Pages/Login";
import Home from "./Pages/Home";
import Activity from "./Pages/Activity";
import Promotion from "./Pages/Promotion";
import Account from "./Pages/Account";
import Wallet from "./Pages/Wallet";
import Head from "./Game/Head";
import LotteryApp from "./Game/5d";
import LotteryAppk from "./Game/K3";
import LotteryAppt from "./Game/Trx";
import { useAuth } from "./contexts/AuthContext";
import Timer from "./Components/Timer";
import RechargeMain from "./Components/RechargeMain";
import WithdrawMain from "./Components/WithDrawMain";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import DepositHistory from "./Pages/DepositHistory";
import BetHistory from "./Pages/BetHistory";
import WithdrawHistory from "./Pages/WithdrawHistory";
import Transaction from "./Pages/Transaction";
import CommisionDetailsMain from "./Components/CommisionDetailsMain";
import SubordinateDataMain from "./Components/SubordinateDataMain";
import CoupenUser from "./Pages/CoupenUser";
import Invite from "./Pages/Invite";
import PaymentComponent from "./Components/WowPayment";
import InvitiationRules from "./Pages/InvitiationRules";
import Messages from "./Pages/Messages";
import Settings from "./Pages/Settings";
import Language from "./Pages/Language";
import Newsubordinate from "./Pages/Newsubordinate";
import Attendance from "./Pages/Attendance";
import { AuthProvider } from "./contexts/AuthContext";
import ProtectedRoute from "./Components/ProtectedRoute";
import Testing from "./Components/testing";
import Addbank from "./Pages/addbank";
import Vip from "./Pages/Vip";
import AdminProtectedRoute from "./Components/AdminProtectedRoute";
import Support from "./Pages/Support";
import OnePage from "./Pages/OpenPage";
import AdminPanel from "./Admin/Components/Admin";
import DetailsMain from "./Components/DetailsMain";
import GameStatistics from "./Components/GameStatistics";
import ActivityDetail from "./Components/ActivityDetail";
import ActivityFirstRecharge from "./Components/ActivityFirstRecharge";
import ForgotPassword from "./Pages/ForgotPassword";
import Rebate from "./Components/Rebate";
import SuperJackpot from "./Components/SuperJackpot";
import Rule from "./Components/Rule";
import WinningStar from "./Components/WinningStar";
import ActivityDetails from "./Components/ActivityDetails";
import ChooseBank from "./Pages/ChooseBank";
import { BankProvider } from "./Pages/BankContext";
import UsdtAddress from "./Components/UsdtAddress";
import MaintenancePage from "./Components/MaintenancePage";
import PuzzleComponent from "./Components/PuzzleComponent";
import ChatZone from "./Components/ChatSection";
import CustomerService from "./Components/CustomerService";
import AboutUsPage from "./Components/About";
import FeedbackPage from "./Components/FeedbackPage";
import DepositModal from "./Pages/depositModal";
import GamesGrid from "./Components/LoateryPage";
import GameRules from "./Components/GameRules";
import WinstreakBonus from "./Components/WinstreakBonus";
import YouTubeCreative from "./Components/YouTubeCreative";
import USDTBonus from "./Components/USDTBonus";
import AviatorBonus from "./Components/AviatorBonus";
import ActivityAward from "./Components/ActivityReward";
import ReceiveHistoryPage from "./Components/ActivityReceiveHistory";
import AvatarChange from "./Pages/AvatarChange";
import FiveD from "./Game/FiveD";
import InvitationBonusComponent from "./Components/InvitationBonusComponent";
import LuckySpin from "./Game/LuckySpin";
import LuckySpinPage from "./Game/LuckySpinPage";
import ActivityRules from "./Components/ActivityRules";
import EventDetails from "./Components/EventDetails";
import EventDesc from "./Components/EventDesc";
import AdminTaskControl from "./Admin/Components/LuckySpinAdmin";
import { initializeAnalytics, logPageView } from "./Components/GoogleAnalytics";
import { useLocation } from "react-router-dom";
import Allgames from "./Pages/Allgames";
import Depositissue from "./Pages/Depositissue";
import Service from "./Pages/Service";
import ChangePassword from "./Pages/ChangePassword";
import RetrieveLogin from "./Pages/RetrieveLogin";
import GameProblem from "./Pages/GameProblem";
import RacingGame from "./Game/Racing";
import InvitationRewardRules from "./Pages/InvitaionBonusPageActivity";
import BannerDetail from "./Pages/BannerDetails";
import InvitationRecordPage from "./Components/InvitationRecordPage";
import GamesRulesAtten from "./Pages/GamesRulesAtten";
import AttendenceHistory from "./Pages/AttendenceHistory";
import WithdrawIssue from "./Pages/WithdrawMoneyIssue";
import DepositNotReceived from "./Pages/DepositNotReceived";
import BankAccountModification from "./Pages/ModificationBankDetail";
import LoadingPage from "./Pages/LoadingPage";

const gameData = [
  {
    id: 1,
    title: "Win Go 1Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Win Go",
    path: "/timer/1min",
  },
  {
    id: 2,
    title: "Win Go 3Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Win Go",
    path: "/timer/3min",
  },
  {
    id: 3,
    title: "Win Go 5Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Win Go",
    path: "/timer/5min",
  },
  {
    id: 4,
    title: "Win Go 30Sec", // Updated title for 30 seconds
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Win Go",
    path: "/timer/30sec", // Updated path for 30 seconds
  },
];

const k3GameData = [
  {
    id: 5,
    title: "K3 1Min",
    imgSrc: "/assets/lotterycategory_20240110062111bt8e.png",
    game: "K3",
    path: "/k3/1min",
  },
  {
    id: 6,
    title: "K3 3Min",
    imgSrc: "/assets/lotterycategory_20240110062111bt8e.png",
    game: "K3",
    path: "/k3/3min",
  },
  {
    id: 7,
    title: "K3 5Min",
    imgSrc: "/assets/lotterycategory_20240110062111bt8e.png",
    game: "K3",
    path: "/k3/5min",
  },
  {
    id: 8,
    title: "K3 10Min",
    imgSrc: "/assets/lotterycategory_20240110062111bt8e.png",
    game: "K3",
    path: "/k3/10min",
  },
];

const trxGameData = [
  {
    id: 9,
    title: "TRX 1Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "Trx Win",
    path: "/trx/1min",
  },
  {
    id: 10,
    title: "TRX 3Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "Trx Win",
    path: "/trx/3min",
  },
  {
    id: 11,
    title: "TRX 5Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "Trx Win",
    path: "/trx/5min",
  },
  {
    id: 12,
    title: "TRX 10Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "Trx Win",
    path: "/trx/10min",
  },
];

const fiveDGameData = [
  {
    id: 13,
    title: "5D 1Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "5D Win",
    path: "/5d/1min",
  },
  {
    id: 14,
    title: "5D 3Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "5D Win",
    path: "/5d/3min",
  },
  {
    id: 15,
    title: "5D 5Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "5D Win",
    path: "/5d/5min",
  },
  {
    id: 16,
    title: "5D 10Min",
    imgSrc: "/assets/lotterycategory_20240110062124qut6.png",
    game: "5D Win",
    path: "/5d/10min",
  },
];

const racingData = [
  {
    id: 1,
    title: "Racing 1Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Racing",
    path: "/racing-game/1min",
  },
  {
    id: 2,
    title: "Racing  3Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Racing",
    path: "/racing-game/3min",
  },
  {
    id: 3,
    title: "Racing 5Min",
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Racing",
    path: "/racing-game/5min",
  },
  {
    id: 4,
    title: "Racing 30Sec", // Updated title for 30 seconds
    imgSrc: "/assets/lotterycategory_20240110062051do1k.png",
    game: "Racing",
    path: "/racing-game/30sec", // Updated path for 30 seconds
  },
];
const extractTimerKey = (path) => {
  const parts = path.split("/");
  return parts[2];
};

const extractK3TimerKey = (path) => {
  const parts = path.split("/");
  return parts[2];
};

const App = () => {
  useEffect(() => {
    initializeAnalytics();
    logPageView(window.location.pathname);

    const handlePageChange = () => {
      logPageView(window.location.pathname);
    };

    // Listen for URL changes (works well with navigation buttons)
    window.addEventListener("popstate", handlePageChange);

    return () => {
      window.removeEventListener("popstate", handlePageChange);
    };
  }, []);

  const isAuthenticated = useAuth();
  if (isAuthenticated === null) {
    return (
      <Box
        display="flex"
        justifyContent="center"
        alignItems="center"
        minHeight="100vh"
      >
        <CircularProgress />
      </Box>
    );
  }
  return (
    <>
      <AuthProvider>
        <div style={{ backgroundColor: "whitesmoke" }}>
          <Router>
            <Routes>
              <Route path="/register" element={<Register />} />

              <Route
                path={"/testing"}
                element={
                  <AdminProtectedRoute>
                    <Testing />
                  </AdminProtectedRoute>
                }
              />

              <Route path="/depositissue" element={<Depositissue />} />
              <Route
                path={"/admin/activity-award"}
                element={<AdminProtectedRoute></AdminProtectedRoute>}
              />

              <Route
                path={"/edit-user-bank-details"}
                element={<AdminProtectedRoute></AdminProtectedRoute>}
              />

              <Route
                path={"/bonus-settings"}
                element={<AdminProtectedRoute></AdminProtectedRoute>}
              />

              <Route path="/timer" element={<Timer />} />
              <Route path="/login" element={<Login />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
              <Route path="/deposit-modal" element={<DepositModal />} />
              <Route
                path="/activity"
                element={
                  <ProtectedRoute>
                    <Activity />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/banners/:id"
                element={
                  <ProtectedRoute>
                    <BannerDetail />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activityaward"
                element={
                  <ProtectedRoute>
                    <ActivityAward />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invitation-bonus"
                element={
                  <ProtectedRoute>
                    <InvitationBonusComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invitationBonusPage"
                element={
                  <ProtectedRoute>
                    <InvitationRewardRules />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/invitationRecordPage"
                element={
                  <ProtectedRoute>
                    <InvitationRecordPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/receive-history"
                element={
                  <ProtectedRoute>
                    <ReceiveHistoryPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/FirstRecharge"
                element={
                  <ProtectedRoute>
                    <ActivityFirstRecharge />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/activity/lucky-spin"
                element={
                  <ProtectedRoute>
                    <LuckySpinPage />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/lucky-spin/activity-rules"
                element={
                  <ProtectedRoute>
                    <ActivityRules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/lucky-spin/event-details"
                element={
                  <ProtectedRoute>
                    <EventDetails />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/lucky-spin/event-description"
                element={
                  <ProtectedRoute>
                    <EventDesc />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/activity/ActivityDetail"
                element={
                  <ProtectedRoute>
                    <ActivityDetail />
                  </ProtectedRoute>
                }
              />
              <Route path="/support" element={<Support />} />
              <Route
                path="/coupen-user"
                element={
                  <ProtectedRoute>
                    <CoupenUser />
                  </ProtectedRoute>
                }
              />
              <Route path="/customer-service" element={<CustomerService />} />
              <Route path="/about-us" element={<AboutUsPage />} />
              <Route path="/feedback" element={<FeedbackPage />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />

              <Route
                path="/coupen-user"
                element={
                  <ProtectedRoute>
                    <CoupenUser />
                  </ProtectedRoute>
                }
              />
              <Route path="/vip" element={<Vip />} />
              <Route
                path="/transaction"
                element={
                  <ProtectedRoute>
                    <Transaction />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/home"
                element={
                  <ProtectedRoute>
                    <Home />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/5d"
                element={
                  <ProtectedRoute>
                    <LotteryApp />
                  </ProtectedRoute>
                }
              />
              {k3GameData.map((game) => {
                const timerKey = extractK3TimerKey(game.path);
                return (
                  <Route
                    key={game.id}
                    path={game.path}
                    element={
                      <ProtectedRoute>
                        <LotteryAppk timerKey={timerKey} />
                      </ProtectedRoute>
                    }
                  />
                );
              })}
              <Route
                path="/addbank"
                element={
                  <ProtectedRoute>
                    <Addbank />
                  </ProtectedRoute>
                }
              />
              {trxGameData.map((game) => {
                const timerKey = extractTimerKey(game.path);
                return (
                  <Route
                    key={game.id}
                    path={game.path}
                    element={
                      <ProtectedRoute>
                        <LotteryAppt timerKey={timerKey} />
                      </ProtectedRoute>
                    }
                  />
                );
              })}

              {fiveDGameData.map((game) => {
                const timerKey = extractTimerKey(game.path);
                return (
                  <Route
                    key={game.id}
                    path={game.path}
                    element={
                      <ProtectedRoute>
                        <FiveD timerKey={timerKey} />
                      </ProtectedRoute>
                    }
                  />
                );
              })}
              <Route
                path="/subordinate-data"
                element={
                  <ProtectedRoute>
                    <SubordinateDataMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/commision-details"
                element={
                  <ProtectedRoute>
                    <CommisionDetailsMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/details"
                element={
                  <ProtectedRoute>
                    <DetailsMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/bet-history"
                element={
                  <ProtectedRoute>
                    <BetHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/deposit-history"
                element={
                  <ProtectedRoute>
                    <DepositHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdraw-history"
                element={
                  <ProtectedRoute>
                    <WithdrawHistory />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/withdraw"
                element={
                  <ProtectedRoute>
                    <WithdrawMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/recharge"
                element={
                  <ProtectedRoute>
                    <RechargeMain />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/promotion"
                element={
                  <ProtectedRoute>
                    <Promotion />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/account"
                element={
                  <ProtectedRoute>
                    <Account />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/game-statistics"
                element={
                  <ProtectedRoute>
                    <GameStatistics />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/wallet"
                element={
                  <ProtectedRoute>
                    <Wallet />
                  </ProtectedRoute>
                }
              />
              {gameData.map((game) => {
                const timerKey = extractTimerKey(game.path);
                return (
                  <Route
                    key={game.id}
                    path={game.path}
                    element={
                      <ProtectedRoute>
                        <Head timerKey={timerKey} />
                      </ProtectedRoute>
                    }
                  />
                );
              })}

              {racingData.map((game) => {
                const timerKey = extractTimerKey(game.path);
                return (
                  <Route
                    path={game.path}
                    element={<RacingGame timerKey={timerKey} />}
                  />
                );
              })}
              <Route
                path="/invite"
                element={
                  <ProtectedRoute>
                    <Invite />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/USDTBonus"
                element={
                  <ProtectedRoute>
                    <USDTBonus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/AviatorBonus"
                element={
                  <ProtectedRoute>
                    <AviatorBonus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/payment"
                element={
                  <ProtectedRoute>
                    <PaymentComponent />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/invitation-rules"
                element={
                  <ProtectedRoute>
                    <InvitiationRules />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/messages"
                element={
                  <ProtectedRoute>
                    <Messages />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/settings"
                element={
                  <ProtectedRoute>
                    <Settings />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/avatar-change"
                element={
                  <ProtectedRoute>
                    <AvatarChange />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/language"
                element={
                  <ProtectedRoute>
                    <Language />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/newsubordinate"
                element={
                  <ProtectedRoute>
                    <Newsubordinate />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/attendance"
                element={
                  <ProtectedRoute>
                    <Attendance />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/rebate"
                element={
                  <ProtectedRoute>
                    <Rebate />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/superjackpot"
                element={
                  <ProtectedRoute>
                    <SuperJackpot />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/rule"
                element={
                  <ProtectedRoute>
                    <Rule />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/winningstar"
                element={
                  <ProtectedRoute>
                    <WinningStar />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/activitydetails"
                element={
                  <ProtectedRoute>
                    <ActivityDetails />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/choosebank"
                element={
                  <ProtectedRoute>
                    <ChooseBank />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/usdtaddress"
                element={
                  <ProtectedRoute>
                    <UsdtAddress />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/all-games"
                element={
                  <ProtectedRoute>
                    <Allgames />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/chat/:ticketId"
                element={
                  <ProtectedRoute>
                    <ChatZone />
                  </ProtectedRoute>
                }
              />
              <Route
                path="all-games"
                element={
                  <ProtectedRoute>
                    <GamesGrid />
                  </ProtectedRoute>
                }
              />
              <Route
                path="game-rules"
                element={
                  <ProtectedRoute>
                    <GameRules />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/activity/WinstreakBonus"
                element={
                  <ProtectedRoute>
                    <WinstreakBonus />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/gamesrulesatte"
                element={
                  <ProtectedRoute>
                    <GamesRulesAtten />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/attenhist"
                element={
                  <ProtectedRoute>
                    <AttendenceHistory />
                  </ProtectedRoute>
                }
              />

              <Route
                path="/activity/YouTubeCreative"
                element={
                  <ProtectedRoute>
                    <YouTubeCreative />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<OnePage />} />
              <Route path="/service" element={<Service />} />
              <Route path="/changePassword" element={<ChangePassword />} />
              <Route path="/retrieve" element={<RetrieveLogin />} />
              <Route path="/problems" element={<GameProblem />} />
              <Route path="/withdrawal-issue" element={<WithdrawIssue />} />
              <Route path="/deposit-issue" element={<DepositNotReceived />} />
              <Route
                path="/modify-bank-details"
                element={<BankAccountModification />}
              />

              <Route path="/auth-path" element={<LoadingPage />} />
            </Routes>
          </Router>
        </div>
      </AuthProvider>
    </>
  );
};
export default App;

// // import React, { useState, useEffect } from "react";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// // import { Box, CircularProgress } from "@mui/material";
// // // import { useAuth, AuthProvider } from "./authContext"; // assuming you have this context
// // // import {
// // //   AdminProtectedRoute,
// // //   ProtectedRoute,
// // // } from "./protectedRoutes"; // assuming you have these components
// // import {
// //   Register,
// //   Login,
// //   ForgotPassword,
// //   Timer,
// //   Testing,
// //   Activity,
// //   ActivityAward,
// //   Depositissue,
// //   Support,
// //   ActivityFirstRecharge,
// //   LuckySpinPage,
// //   ActivityRules,
// //   EventDetails,
// //   EventDesc,
// //   ActivityDetail,
// //   CoupenUser,
// //   CustomerService,
// //   AboutUsPage,
// //   FeedbackPage,
// //   Vip,
// //   Transaction,
// //   Home,
// //   LotteryApp,
// //   LotteryAppk,
// //   LotteryAppt,
// //   FiveD,
// //   SubordinateDataMain,
// //   CommisionDetailsMain,
// //   DetailsMain,
// //   BetHistory,
// //   DepositHistory,
// //   WithdrawHistory,
// //   WithdrawMain,
// //   RechargeMain,
// //   Promotion,
// //   Account,
// //   GameStatistics,
// //   Wallet,
// //   Head,
// //   Invite,
// //   USDTBonus,
// //   AviatorBonus,
// //   PaymentComponent,
// //   InvitiationRules,
// //   Messages,
// //   Settings,
// //   AvatarChange,
// //   Language,
// //   Newsubordinate,
// //   Attendance,
// //   Rebate,
// //   SuperJackpot,
// //   Rule,
// //   WinningStar,
// //   ActivityDetails,
// //   ChooseBank,
// //   UsdtAddress,
// //   Allgames,
// //   ChatZone,
// //   GamesGrid,
// //   GameRules,
// //   WinstreakBonus,
// //   YouTubeCreative,
// //   OnePage,
// //   DepositModal, // Ensure DepositModal is imported
// // } from "./Components"; // Assuming all components are imported

// const App = () => {
//   // const [isDepositModalOpen, setIsDepositModalOpen] = useState(false); // State to control modal visibility

//   useEffect(() => {
//     initializeAnalytics();
//     logPageView(window.location.pathname);

//     const handlePageChange = () => {
//       logPageView(window.location.pathname);
//     };

//     window.addEventListener("popstate", handlePageChange);

//     return () => {
//       window.removeEventListener("popstate", handlePageChange);
//     };
//   }, []);

//   const isAuthenticated = useAuth();
//   if (isAuthenticated === null) {
//     return (
//       <Box display="flex" justifyContent="center" alignItems="center" minHeight="100vh">
//         <CircularProgress />
//       </Box>
//     );
//   }

//   return (
//     <AuthProvider>
//       <div style={{ backgroundColor: "whitesmoke" }}>
//         <Router>
//           <Routes>
//             <Route path="/register" element={<Register />} />
//             <Route path="/testing" element={<AdminProtectedRoute><Testing /></AdminProtectedRoute>} />
//             <Route path="/depositissue" element={<Depositissue />} />
//             <Route path="/admin/activity-award" element={<AdminProtectedRoute />} />
//             <Route path="/edit-user-bank-details" element={<AdminProtectedRoute />} />
//             <Route path="/bonus-settings" element={<AdminProtectedRoute />} />
//             <Route path="/timer" element={<Timer />} />
//             <Route path="/login" element={<Login />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             {/* <Route path="/deposit-modal" element={<DepositModal />} /> */}
//             <Route path="/activity" element={<ProtectedRoute><Activity /></ProtectedRoute>} />
//             <Route path="/activityaward" element={<ProtectedRoute><ActivityAward /></ProtectedRoute>} />
//             <Route path="/invitation-bonus" element={<ProtectedRoute><InvitationBonusComponent /></ProtectedRoute>} />
//             <Route path="/receive-history" element={<ProtectedRoute><ReceiveHistoryPage /></ProtectedRoute>} />
//             <Route path="/activity/FirstRecharge" element={<ProtectedRoute><ActivityFirstRecharge /></ProtectedRoute>} />
//             <Route path="/activity/lucky-spin" element={<ProtectedRoute><LuckySpinPage /></ProtectedRoute>} />
//             <Route path="/activity/lucky-spin/activity-rules" element={<ProtectedRoute><ActivityRules /></ProtectedRoute>} />
//             <Route path="/activity/lucky-spin/event-details" element={<ProtectedRoute><EventDetails /></ProtectedRoute>} />
//             <Route path="/activity/lucky-spin/event-description" element={<ProtectedRoute><EventDesc /></ProtectedRoute>} />
//             <Route path="/activity/ActivityDetail" element={<ProtectedRoute><ActivityDetail /></ProtectedRoute>} />
//             <Route path="/support" element={<Support />} />
//             <Route path="/coupen-user" element={<ProtectedRoute><CoupenUser /></ProtectedRoute>} />
//             <Route path="/customer-service" element={<CustomerService />} />
//             <Route path="/about-us" element={<AboutUsPage />} />
//             <Route path="/feedback" element={<FeedbackPage />} />
//             <Route path="/forgot-password" element={<ForgotPassword />} />
//             <Route path="/vip" element={<Vip />} />
//             <Route path="/transaction" element={<ProtectedRoute><Transaction /></ProtectedRoute>} />
//             <Route path="/home" element={<ProtectedRoute><Home /></ProtectedRoute>} />
//             <Route path="/5d" element={<ProtectedRoute><LotteryApp /></ProtectedRoute>} />
//             <Route path="/addbank" element={<ProtectedRoute><Addbank /></ProtectedRoute>} />
//             <Route path="/subordinate-data" element={<ProtectedRoute><SubordinateDataMain /></ProtectedRoute>} />
//             <Route path="/commision-details" element={<ProtectedRoute><CommisionDetailsMain /></ProtectedRoute>} />
//             <Route path="/details" element={<ProtectedRoute><DetailsMain /></ProtectedRoute>} />
//             <Route path="/bet-history" element={<ProtectedRoute><BetHistory /></ProtectedRoute>} />
//             <Route path="/deposit-history" element={<ProtectedRoute><DepositHistory /></ProtectedRoute>} />
//             <Route path="/withdraw-history" element={<ProtectedRoute><WithdrawHistory /></ProtectedRoute>} />
//             <Route path="/withdraw" element={<ProtectedRoute><WithdrawMain /></ProtectedRoute>} />
//             <Route path="/recharge" element={<ProtectedRoute><RechargeMain /></ProtectedRoute>} />
//             <Route path="/promotion" element={<ProtectedRoute><Promotion /></ProtectedRoute>} />
//             <Route path="/account" element={<ProtectedRoute><Account /></ProtectedRoute>} />
//             <Route path="/game-statistics" element={<ProtectedRoute><GameStatistics /></ProtectedRoute>} />
//             <Route path="/wallet" element={<ProtectedRoute><Wallet /></ProtectedRoute>} />
//             <Route path="/invite" element={<ProtectedRoute><Invite /></ProtectedRoute>} />
//             <Route path="/activity/USDTBonus" element={<ProtectedRoute><USDTBonus /></ProtectedRoute>} />
//             <Route path="/activity/AviatorBonus" element={<ProtectedRoute><AviatorBonus /></ProtectedRoute>} />
//             <Route path="/payment" element={<ProtectedRoute><PaymentComponent /></ProtectedRoute>} />
//             <Route path="/invitation-rules" element={<ProtectedRoute><InvitiationRules /></ProtectedRoute>} />
//             <Route path="/messages" element={<ProtectedRoute><Messages /></ProtectedRoute>} />
//             <Route path="/settings" element={<ProtectedRoute><Settings /></ProtectedRoute>} />
//             <Route path="/avatar-change" element={<ProtectedRoute><AvatarChange /></ProtectedRoute>} />
//             <Route path="/language" element={<ProtectedRoute><Language /></ProtectedRoute>} />
//             <Route path="/newsubordinate" element={<ProtectedRoute><Newsubordinate /></ProtectedRoute>} />
//             <Route path="/attendance" element={<ProtectedRoute><Attendance /></ProtectedRoute>} />
//             <Route path="/rebate" element={<ProtectedRoute><Rebate /></ProtectedRoute>} />
//             <Route path="/super-jackpot" element={<ProtectedRoute><SuperJackpot /></ProtectedRoute>} />
//             <Route path="/winning-star" element={<ProtectedRoute><WinningStar /></ProtectedRoute>} />
//             <Route path="/activity/activity-details" element={<ProtectedRoute><ActivityDetails /></ProtectedRoute>} />
//             <Route path="/choose-bank" element={<ProtectedRoute><ChooseBank /></ProtectedRoute>} />
//             <Route path="/usdt-address" element={<ProtectedRoute><UsdtAddress /></ProtectedRoute>} />
//             <Route path="/allgames" element={<ProtectedRoute><Allgames /></ProtectedRoute>} />
//             <Route path="/chatzone" element={<ProtectedRoute><ChatZone /></ProtectedRoute>} />
//             <Route path="/games-grid" element={<ProtectedRoute><GamesGrid /></ProtectedRoute>} />
//             <Route path="/game-rules" element={<ProtectedRoute><GameRules /></ProtectedRoute>} />
//             <Route path="/winstreak-bonus" element={<ProtectedRoute><WinstreakBonus /></ProtectedRoute>} />
//             <Route path="/youtube-creative" element={<ProtectedRoute><YouTubeCreative /></ProtectedRoute>} />
//             <Route path="/one-page" element={<ProtectedRoute><OnePage /></ProtectedRoute>} />
//           </Routes>

//           {/* Button to open the modal */}
//           {/* <button onClick={() => setIsDepositModalOpen(true)}>Open Deposit Modal</button> */}
//         </Router>
//       </div>
//     </AuthProvider>
//   );
// };

// export default App;
