/*eslint-disable*/
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { CssBaseline } from "@mui/material";
import { ThemeProvider } from "./context/ThemeContext";
import LoginPage from "./components/Auth/LoginPage";
import AuthLayout from "./components/Auth/AuthLayout";
import DashboardLayout from "./components/Layout/DashboardLayout";
import Dashboard from "./pages/Dashboard";
import CreateUser from "./pages/CreateUser";
import Members from "./pages/Members";
import Games from "./pages/Games";
// import ActivitySetting from './pages/ActivitySetting';
import Recharge from "./pages/Recharge";
import Withdraw from "./pages/Withdraw";
import WalletUpdate from "./pages/WalletUpdate";
import UpdateTurnover from "./pages/UpdateTurnover";
import BankDetails from "./pages/BankDetails";
import FirstDepositBonus from "./pages/FirstDepositBonus";
import CreateSalary from "./pages/CreateSalary";
import CreateGiftCode from "./pages/CreateGiftCode";
import InvitationBonus from "./pages/InvitationBonus";
// import VIPLevel from './pages/VIPLevel';
import Settings from "./pages/Settings";
import Notifications from "./pages/Notifications";
import ActivitySettings from "./pages/ActivitySettings";
import { Toaster } from "./components/ui/toaster";
// import { AuthProvider } from './context/AuthContext';
import Layout from "./components/Layout";
import VIPLevels from "./pages/VIPLevels";
import Dashboard2 from "./pages/Dashboard2";
import K3Dashboard from "./pages/Games/K3Dashboard";
import FiveDDashboard from "./pages/Games/FiveDDashboard";
import Wingo from "./pages/Games/Wingo";
import ProtectedRoute from "./components/Auth/ProtectedRoute";
import PageContainer from "./PageContainer";
import SecondDepositBonus from "./pages/SecondDepositBonus";
import IllegalBets from "./pages/IllegalBets";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import WithdrawalLimits from "./pages/WithdrawalLimits";
import SupportTickets from "./pages/SupportTicket";
import RechargeStatus from "./pages/RechargeStatus";
import WithdrawalHistory from "./pages/WithdrawalHistory";
import ActivityRewardSettings from "./pages/ActivityRewardSetting";
import RetrieveLogin from "./pages/RetriveLoginProblem";
import GameProblemTicketsPage from "./pages/GameProblemIssue";
import IpAddressUser from "./pages/IpAddressUser";
import GameDetailsPage from "./pages/BetHistoryPage";
import WinProbabilitySettings from "./pages/Probablity";
import PaymentConfigPage from "./pages/PaymentController";
import BannerUpload from "./pages/BannerController";

const ProtectedRouteHome = () => {
  const token = localStorage.getItem("token");
  const navigate = useNavigate();

  useEffect(() => {
    if (!token) {
      navigate("/login");
    } else {
      navigate("/dashboard");
    }
  }, [token, navigate]);

  return null; // Prevent rendering anything while redirecting
};
const App = () => {
  return (
    <Router>
      <ThemeProvider>
        <CssBaseline />
        {/* <AuthProvider> */}
        <Routes>
          {/* Public Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/" element={<ProtectedRouteHome />} />
          {/* Protected Routes */}
          <Route
            element={
              <ProtectedRoute>
                <DashboardLayout />
              </ProtectedRoute>
            }
          >
            {/* <Route path="/dashboard" element={<Dashboard />} />
              <Route path="/create-user" element={<CreateUser />} />
              <Route path="/members" element={<Members />} />
              <Route path="/games/wingo" element={<Wingo />} />
              <Route path="/games/k3" element={<K3Dashboard />} />
              <Route path="/games/5d" element={<FiveDDashboard />} /> */}
            {/* <Route path="/activity-setting" element={<ActivitySetting />} /> */}
            {/* <Route path="/recharge" element={<Recharge />} />
              <Route path="/withdraw" element={<Withdraw />} />
              <Route path="/wallet-update" element={<WalletUpdate />} />
              <Route path="/update-turnover" element={<UpdateTurnover />} />
              <Route path="/bank-details" element={<BankDetails />} />
              <Route path="/first-deposit-bonus" element={<FirstDepositBonus />} />
              <Route path="/create-salary" element={<CreateSalary />} />
              <Route path="/create-gift-code" element={<CreateGiftCode />} />
              <Route path="/invitation-bonus" element={<InvitationBonus />} /> */}
            {/* <Route path="/vip-level" element={<VIPLevel />} /> */}
            {/* <Route path="/settings" element={<Settings />} />
              <Route path="/notifications" element={<Notifications />} />
              <Route path="/activity-setting" element={<ActivitySettings />} />
              <Route path="/vip-level" element={<VIPLevels />} />
              <Route path="/dashboard2" element={<Dashboard2 />} /> */}

            <Route
              path="/dashboard"
              element={
                <PageContainer>
                  <Dashboard />
                </PageContainer>
              }
            />
            <Route
              path="/create-user"
              element={
                <PageContainer>
                  <CreateUser />
                </PageContainer>
              }
            />
            <Route
              path="/members"
              element={
                <PageContainer>
                  <Members />
                </PageContainer>
              }
            />
            <Route
              path="/games/wingo"
              element={
                <PageContainer>
                  <Wingo />
                </PageContainer>
              }
            />
            <Route
              path="/games/k3"
              element={
                <PageContainer>
                  <K3Dashboard />
                </PageContainer>
              }
            />
            <Route
              path="/games/5d"
              element={
                <PageContainer>
                  <FiveDDashboard />
                </PageContainer>
              }
            />
            <Route
              path="/recharge"
              element={
                <PageContainer>
                  <Recharge />
                </PageContainer>
              }
            />
            <Route
              path="/withdraw"
              element={
                <PageContainer>
                  <Withdraw />
                </PageContainer>
              }
            />
            <Route
              path="/wallet-update"
              element={
                <PageContainer>
                  <WalletUpdate />
                </PageContainer>
              }
            />
            <Route
              path="/update-turnover"
              element={
                <PageContainer>
                  <UpdateTurnover />
                </PageContainer>
              }
            />
            <Route
              path="/bank-details"
              element={
                <PageContainer>
                  <BankDetails />
                </PageContainer>
              }
            />
            <Route
              path="/first-deposit-bonus"
              element={
                <PageContainer>
                  <FirstDepositBonus />
                </PageContainer>
              }
            />
            <Route
              path="/second-deposit-bonus"
              element={
                <PageContainer>
                  <SecondDepositBonus />
                </PageContainer>
              }
            />
            <Route
              path="/create-salary"
              element={
                <PageContainer>
                  <CreateSalary />
                </PageContainer>
              }
            />
            <Route
              path="/create-gift-code"
              element={
                <PageContainer>
                  <CreateGiftCode />
                </PageContainer>
              }
            />
            <Route
              path="/invitation-bonus"
              element={
                <PageContainer>
                  <InvitationBonus />
                </PageContainer>
              }
            />
            <Route
              path="/settings"
              element={
                <PageContainer>
                  <Settings />
                </PageContainer>
              }
            />
            <Route
              path="/notifications"
              element={
                <PageContainer>
                  <Notifications />
                </PageContainer>
              }
            />
            <Route
              path="/activity-setting"
              element={
                <PageContainer>
                  <ActivitySettings />
                </PageContainer>
              }
            />
            <Route
              path="/vip-level"
              element={
                <PageContainer>
                  <VIPLevels />
                </PageContainer>
              }
            />
            <Route
              path="/dashboard2"
              element={
                <PageContainer>
                  <Dashboard2 />
                </PageContainer>
              }
            />
            <Route
              path="/illegalbets"
              element={
                <PageContainer>
                  <IllegalBets />
                </PageContainer>
              }
            />
            <Route
              path="/withdrawl-limits"
              element={
                <PageContainer>
                  <WithdrawalLimits />
                </PageContainer>
              }
            />
            <Route
              path="/support-service"
              element={
                <PageContainer>
                  <SupportTickets />
                </PageContainer>
              }
            />
            <Route
              path="/recharge-admin"
              element={
                <PageContainer>
                  <RechargeStatus />
                </PageContainer>
              }
            />
            <Route
              path="/withdraw-admin"
              element={
                <PageContainer>
                  <WithdrawalHistory />
                </PageContainer>
              }
            />
            <Route
              path="/admin/activity-award"
              element={
                <PageContainer>
                  <ActivityRewardSettings />
                </PageContainer>
              }
            />
            <Route
              path="/retrive-login"
              element={
                <PageContainer>
                  <RetrieveLogin />
                </PageContainer>
              }
            />
            <Route
              path="/game-problem"
              element={
                <PageContainer>
                  <GameProblemTicketsPage />
                </PageContainer>
              }
            />
            <Route
              path="/ip-loggs"
              element={
                <PageContainer>
                  <IpAddressUser />
                </PageContainer>
              }
            />

            <Route
              path="/bet-history"
              element={
                <PageContainer>
                  <GameDetailsPage />
                </PageContainer>
              }
            />

            <Route
              path="/win-probablity"
              element={
                <PageContainer>
                  <WinProbabilitySettings />
                </PageContainer>
              }
            />

            <Route
              path="/pay-control"
              element={
                <PageContainer>
                  <PaymentConfigPage />
                </PageContainer>
              }
            />

            <Route
              path="/banner-control"
              element={
                <PageContainer>
                  <BannerUpload />
                </PageContainer>
              }
            />
          </Route>

          {/* Redirect root to dashboard */}
          {/* <Route path="/" element={<Layout />}>
              <Route index element={<Members />} />
              <Route path="/members" element={<Members />} />
              <Route path="/salary" element={<CreateSalary />} />
              <Route path="/activity-setting" element={<ActivitySettings />} />
              <Route path="/create-coupon" element={<CreateGiftCode />} />
            </Route> */}
        </Routes>
        {/* </AuthProvider> */}
        <Toaster />
      </ThemeProvider>
    </Router>
  );
};

export default App;
