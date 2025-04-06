const express = require("express");
const Bet = require("../../models/betsModel");
const router = express.Router();
const auth = require("../../middlewares/auth");
const User = require("../../models/userModel");
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const CommissionRate = require("../../models/betCommissionLevel");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const Level = require("../../models/levelSchema");
const Rebate = require("../../models/RebateSchema");
const PendingCommission = require("../../models/PendingCommission");
const {
  monitorIllegalBet,
  getIllegalBetSummary,
} = require("../../utils/illegalBetMonitor");

const commissionProcessor = require("../../utils/CommissionProcessor");
const {
  createPendingCommissions,
  processRebate,
} = require("../../utils/commissionAndRebate");
// Initialize the commission processor scheduler
commissionProcessor.initScheduler();

router.post("/racingbet", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user.walletAmount < req.body.totalBet) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    const transactionFee = req.body.totalBet * 0.025;
    const totalBetAfterTx = req.body.totalBet - transactionFee;
    const totalBetAmount = req.body.totalBet;

    const {
      isIllegal,
      illegalReason,
      illegalCount,
      totalIllegalCount,
      betCount,
      betsThisPeriod,
    } = await monitorIllegalBet(
      user._id,
      "racing",
      req.body.periodId,
      req.body.selectedItem,
      req.body.betAmount
    );

    const bet = new Bet({
      userId: req.user._id,
      orderId: req.body.orderId,
      selectedItem: req.body.selectedItem,
      betAmount: req.body.betAmount,
      multiplier: req.body.multiplier,
      totalBet: totalBetAfterTx,
      tax: transactionFee,
      selectedTimer: req.body.selectedTimer,
      periodId: req.body.periodId,
      timestamp: Date.now(),
      result: req.body.result,
      status: req.body.status,
      winLoss: req.body.winLoss,
      isIllegal: isIllegal,
      userType: user.accountType,
    });

    user.walletAmount -= req.body.totalBet;
    await Promise.all([
      user.save(),
      bet.save(),
      addTransactionDetails(
        bet.userId,
        totalBetAmount,
        "racingbet",
        new Date(),
        0,
        totalBetAmount,
        "racing"
      ),
    ]);

    const pendingCommissions = await createPendingCommissions(
      user._id,
      totalBetAmount,
      "racing"
    );
    const rebateResult = await processRebate(user, totalBetAmount, "racing");
    const illegalBetSummary = await getIllegalBetSummary(user._id);

    res.status(201).json({
      bet,
      pendingCommissions,
      isIllegalBet: isIllegal,
      currentGameIllegalCount: illegalCount,
      totalIllegalCount,
      currentPeriodBetCount: betCount,
      illegalBetSummary,
      illegalReason,
      betsThisPeriod,
      rebate: rebateResult,
    });
  } catch (error) {
    console.error("Error in racing bet:", error);
    res
      .status(500)
      .json({ message: "Error processing bet", error: error.message });
  }
});

router.get("/user/betshistory", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const bets = await Bet.find({ userId: userId }).sort({ timestamp: -1 });
    res.status(200).json(bets);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error retrieving bet history", error: error.message });
  }
});

router.put("/commissionRates", auth, isAdmin, async (req, res) => {
  try {
    const { level1, level2, level3, level4, level5, level6 } = req.body;

    const commissionRate = await CommissionRate.findOneAndUpdate(
      {},
      {
        level1,
        level2,
        level3,
        level4,
        level5,
        level6,
      },
      { new: true, upsert: true }
    );

    res.status(200).json(commissionRate);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving commission rates", error: error.message });
  }
});

router.get("/commissionRates-data-get", auth, isAdmin, async (req, res) => {
  try {
    const commissionRates = await CommissionRate.findOne();
    res.status(200).json(commissionRates);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error fetching commission rates",
      error: error.message,
    });
  }
});

module.exports = router;
