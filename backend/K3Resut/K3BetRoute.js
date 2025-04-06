const express = require("express");
const router = express.Router();
const auth = require("../middlewares/auth");
const User = require("../models/userModel");
const k3betmodel = require("../models/K3BetModel");
const K3ResultModel = require("../models/K3ResultModel");
const CommissionRate = require("../models/betCommissionLevel");
const Level = require("../models/levelSchema");
const Rebate = require("../models/RebateSchema");
const {
  addTransactionDetails,
} = require("../controllers/TransactionHistoryControllers");
const { monitorIllegalBet } = require("../utils/illegalBetMonitor");
const commissionProcessor = require("../utils/CommissionProcessor");
const {
  createPendingCommissions,
  processRebate,
} = require("../utils/commissionAndRebate");
const { calculateUserDepositBalance } = require('../utils/betBalanceTracker');
// Initialize the commission processor scheduler
commissionProcessor.initScheduler();

router.post("/K3betgame", auth, async (req, res) => {
  try {
    console.log("Request received for K3 bet");

    const { _id } = req.user;
    console.log("User ID:", _id);

    const {
      betAmount,
      selectedItem,
      multiplier,
      totalBet,
      diceOutcome,
      periodId,
      selectedTimer,
      status,
      winLoss,
      userType,
      orderId,
    } = req.body;

    // Convert diceOutcome to an array of numbers
    const diceOutcomeArray = Array.isArray(diceOutcome)
      ? diceOutcome.map(Number)
      : [];

    // Validate diceOutcome length
    if (diceOutcomeArray.length > 3) {
      return res
        .status(400)
        .json({ message: "diceOutcome exceeds the limit of 3" });
    }

    // Fetch the user
    console.log("Fetching user from database...");
    const user = await User.findById(_id);
    const accountType = user.accountType;
    if (!user) {
      console.log("User not found");
      return res.status(404).json({ message: "User not found" });
    }

    // Check wallet balance
    console.log("Checking wallet balance...");
    if (user.walletAmount < totalBet) {
      console.log("Insufficient funds");
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct total bet amount from the user's wallet
    console.log("Updating wallet balance...");
    user.walletAmount -= totalBet;
    await user.save();
    console.log("User wallet updated successfully");

    // Calculate transaction fee and total bet after tax
    const totalBetAfterTax = totalBet * 0.98; // 2% tax
    const tax = totalBet - totalBetAfterTax;

    console.log("Total Bet After Tax:", totalBetAfterTax);
    console.log("Tax amount:", tax);
  
    const depositBalance = await calculateUserDepositBalance(user._id);
    let betSource = 'winning';
let betSourceAmount = 0;
console.log('Deposit Balance:', depositBalance);
// If we have some deposit balance
if (depositBalance > 0) {
  if (depositBalance >= totalBet) {
    betSource = 'deposit';
    betSourceAmount = totalBet;
  } else {
    betSource = 'partial';
    betSourceAmount = depositBalance;
  }
}

    // Create a new K3Bet document
    console.log("Creating new K3 bet document...");
    const k3bet = new k3betmodel({
      user: _id,
      orderId,
      betAmount,
      selectedItem,
      multiplier,
      totalBet: totalBetAfterTax,
      diceOutcome: diceOutcomeArray,
      tax,
      periodId,
      selectedTimer,
      status,
      winLoss,
      userType: userType,
      timestamp: Date.now(),
      betSource: betSource,
      betSourceAmount: betSourceAmount
    });

    // Add the relevant field based on the selectedItem
    switch (selectedItem) {
      case "totalSum":
        k3bet.totalSum = req.body.totalSum;
        break;
      case "twoSameOneDifferent":
        k3bet.twoSameOneDifferent = req.body.twoSameOneDifferent;
        break;
      case "threeSame":
        k3bet.threeSame = req.body.threeSame;
        break;
      case "threeDifferentNumbers":
        k3bet.threeDifferentNumbers = req.body.threeDifferentNumbers;
        break;
      case "size":
        k3bet.size = req.body.size;
        break;
      case "parity":
        k3bet.parity = req.body.parity;
        break;
      default:
        return res.status(400).send({ message: "Invalid selected item" });
    }

    await k3bet.save();
    console.log("K3 bet saved successfully:", k3bet);

    // Record the bet transaction
    console.log("Recording bet transaction...");
    await addTransactionDetails(
      k3bet.user,
      totalBet,
      "K3Bet",
      new Date(),
      0,
      totalBet,
      "k3"
    );
    console.log("Bet transaction recorded successfully");

    // Determine the betType to pass based on selectedItem

    let betType = null;
    switch (selectedItem) {
      case "size":
        betType = req.body.size; // This will be "Big" or "Small"
        break;
      case "parity":
        betType = req.body.parity; // This will be "Odd" or "Even"
        break;
      case "totalSum":
      case "twoSameOneDifferent":
      case "threeSame":
      case "threeDifferentNumbers":
        betType = selectedItem;
        break;
      default:
        return res.status(400).json({ message: "Invalid selected item" });
    }

    console.log("BETTYPE IS------------>", betType);

    // Monitor for illegal bets
    const illegalBetResult = await monitorIllegalBet(
      user._id,
      "K3",
      periodId,
      betType,
      totalBet
    );

    console.log("Illegal bet monitoring result:", illegalBetResult);

    const pendingCommissions = await createPendingCommissions(
      user._id,
      totalBet,
      "k3"
    );
    const rebateResult = await processRebate(user, totalBet, "k3");
    res.status(201).json({ k3bet });
  } catch (error) {
    console.error("Error processing K3 bet:", error);
    res
      .status(500)
      .json({ message: "Error saving K3 bet", error: error.message });
  }
});

router.get("/user/K3history", auth, async (req, res) => {
  try {
    // Fetch historical results for the authenticated user, sorted by the most recent timestamp
    const history = await k3betmodel
      .find({ user: req.user._id })
      .sort({ timestamp: -1 }); // Sorting by timestamp in descending order
    res.status(200).json(history);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error fetching game history", error: error.message });
  }
});

module.exports = router;
