const express = require("express");
const router = express.Router();

const registerRoute = require("../routes/auth/registerRoute");
const loginRoute = require("../routes/auth/loginRoute");
const logoutRoute = require("../routes/auth/logoutRoute");
const walletRoute = require("../routes/wallet/walletRoute");
const betRoute = require("../routes/wingo/wingoRoutes");
const couponRoutes = require("../routes/common/coupenCodeRoute");
const todaysJoinee = require("../routes/users/userDetailsRoute");
const commissionStats = require("../routes/users/userStatisticsRoute");
const transactions = require("../routes/wallet/TodaysRecharge");
const userBalance = require("../routes/Admin/UserBalance");
const withdraw = require("../routes/Admin/withdrawRoute");
const ChangePassword = require("../routes/ChangePassword/ChangePassword");
const createNotification = require("../routes/Notification/AllUserNotification");
const getNotification = require("../routes/Notification/AllUserNotification");
const commission = require("../routes/Admin/commisionRoute");
const CreateAddress = require("./Admin/TRX-Address");
const UpdateAddress = require("./Admin/TRX-Address");
const getAddresses = require("./Admin/TRX-Address");
const UPIAddress = require("./Admin/UPIAddress");
const UpdateUPI = require("./Admin/UPIAddress");
const Getid = require("./Admin/UPIAddress");
const transaction = require("./Admin/TransactionHistoryRoute");
const Savings = require("./wallet/SavingsAmount");
const ShowSavings = require("./wallet/SavingsAmount");
const trxresult = require("../TRXResult/TRXResult");
const wingoresult = require("./wingo/wingoResultroute");
const k3result = require("../K3Resut/K3ResultRoute");
const K3betgame = require("../K3Resut/K3BetRoute");
const TrxResultRoute = require("../routes/Trx/TrxResultRoute");
const depositBonusRoute = require("../routes/Admin/depositBonusRoute");
const adminSalaryCriteriaRoute = require("../routes/Admin/adminSettingsRoute");
const autoSalaryCreditRoute = require("../routes/Salary/autoSalaryCreditRoute");
const aviatorRoute = require("../routes/Aviator/aviatorRoute");
const trxRoute = require("../routes/Trx/TrxRoute");
const siteSettingsRoutes = require("../routes/ImageUpdation/imageUpdationRoute");
const K3ManualResult = require("../routes/K3Results/k3ManualResultRoutes");
const WebsiteMaintenance = require("../routes/websiteMode/websiteMaintenance");
const betHistoryRoute = require("../routes/Bet Histories/betHistoryRoute");
const ticketRoute = require("../routes/Tickets/ticketRoute");
const userDetailsAdminCheckingRoute = require("../routes/Admin/UserDetailsAdminCheckingRoute");
const activityRewardRoutes = require("../routes/ActivityAward/activityRewardSettingRoutes");
const bettingActivities = require("../routes/Admin/BettingActivitiesRoute");
const FiveDBet = require("../5DBet/5DBetRoute");
const FiveDResult = require("../5DBet/5DResultRoute");
const FiveDManualResult = require("./Admin/5DManualresultPush");
const AddSpinnerTask = require("../routes/SpinnerWheel/AddSpinWorks");
const SpinnerController = require("../routes/SpinnerWheel/SpinnerWheel");
const topbetgaming = require("./Topbetgaming/Allroutes");
const jilireal = require("./JiliGames/jilireal");
const casino = require("./casinoapi/casinoapi");
const dpsport = require("./dpsport/dpsport");
const jdbcall = require("./jdb/jdbcall");
const salaryRoutes = require("./Admin/SalaryCreate");
const GlobalApi = require("../routes/Globalapi/GlobalApi");
const { sendOtp, verifyOtp } = require("../controllers/otp.controller");
const racingRoute = require("../routes/racing/racingRoute");
const racingResult = require("../routes/racing/racingResult");
const RegisterOptToggleRoute = require("../routes/Admin/RegisterOtpToggle");
const TrackWalletRecord = require("../routes/Admin/TrackWalletRecord");
const {
  ChangePasswordtwo,
  retriveIdPost,
  upload,
  gameProblemPost,
  gameProblem,
  retriveID,
  ChangePasswordOne,
} = require("../controllers/SupportService");

const ipLogRoutes = require("../routes/Admin/ipLogRoute");
const BetTracker = require("../routes/Admin/BetTracker");
const probability = require("../routes/Admin/Probability");
const paymentController = require("../routes/Admin/PaymentMethodController");
const bannerController = require("../routes/Admin/BannerController");
router.use("/", registerRoute);
router.use("/", loginRoute);
router.use("/", logoutRoute);
router.use("/", walletRoute);
router.use("/", betRoute);
router.use("/", couponRoutes);
router.use("/", todaysJoinee);
router.use("/", transactions);
router.use("/", userBalance);
router.use("/", withdraw);
router.use("/", ChangePassword);
router.use("/", createNotification);
router.use("/", getNotification);
router.use("/", commission);
router.use("/", CreateAddress);
router.use("/", UpdateAddress);
router.use("/", getAddresses);
router.use("/", UPIAddress);
router.use("/", UpdateUPI);
router.use("/", Getid);
router.use("/", commissionStats);
router.use("/", transaction);
router.use("/", Savings);
router.use("/", ShowSavings);
router.use("/", trxresult);
router.use("/", wingoresult);
router.use("/", K3betgame);
router.use("/", k3result);
router.use("/", TrxResultRoute);
router.use("/", depositBonusRoute);
router.use("/", adminSalaryCriteriaRoute);
router.use("/", autoSalaryCreditRoute);
router.use("/", aviatorRoute);
router.use("/", trxRoute);
router.use("/", siteSettingsRoutes);
router.use("/", K3ManualResult);
router.use("/", WebsiteMaintenance);
router.use("/", betHistoryRoute);
router.use("/", ticketRoute);
router.use("/", userDetailsAdminCheckingRoute);
// Routes
router.use("/api/activity-reward-settings", activityRewardRoutes);
router.use("/", bettingActivities);
router.use("/", FiveDBet);
router.use("/", FiveDResult);
router.use("/", FiveDManualResult);
router.use("/", AddSpinnerTask);
router.use("/", SpinnerController);
router.use("/", topbetgaming);
router.use("/", jilireal);
router.use("/", casino);
router.use("/", dpsport);
router.use("/", jdbcall);
router.use("/", salaryRoutes);
router.use("/", GlobalApi);
router.use("/", racingRoute);
router.use("/", racingResult);
router.use("/", RegisterOptToggleRoute);
router.use("/", TrackWalletRecord);
router.use("/", ipLogRoutes);
router.use("/", BetTracker);
router.use("/", probability);
router.use("/", paymentController);
router.use("/", bannerController);

const handleMulterError = (err, req, res, next) => {
  if (err instanceof multer.MulterError) {
    return res.status(400).json({ msg: err.message });
  }
  if (err) {
    return res.status(400).json({ msg: err.message });
  }
  next();
};

router.put("/forgetPasswordChange", ChangePasswordOne);
router.put(
  "/change",
  upload.array("files", 5), // Changed from 'images' to 'files'
  handleMulterError,
  ChangePasswordtwo
);
router.post(
  "/create-retriveID",
  upload.single("file"),
  handleMulterError,
  retriveIdPost
);
router.post(
  "/create-game-problem",
  upload.single("file"),
  handleMulterError,
  gameProblemPost
);
router.get("/game-problem", gameProblem);
router.get("/retriveId", retriveID);

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);
module.exports = router;
