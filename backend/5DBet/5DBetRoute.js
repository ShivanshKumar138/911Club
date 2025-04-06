const express = require("express");
const router = express.Router();
const FiveDBet = require("../models/5DBetModel");
const User = require("../models/userModel");
const auth = require("../middlewares/auth");
const FiveDResult = require("../models/5DResultModel");
const { isAdmin } = require("../middlewares/roleSpecificMiddleware");
const { getLatestPeriodId } = require("../controllers/cronJobControllers");
const CommissionRate = require("../models/betCommissionLevel");
const Level = require("../models/levelSchema");
const Rebate = require("../models/RebateSchema");
const {
  addTransactionDetails,
} = require("../controllers/TransactionHistoryControllers");
const commissionProcessor = require("../utils/CommissionProcessor");
const {
  createPendingCommissions,
  processRebate,
} = require("../utils/commissionAndRebate");
// Initialize the commission processor scheduler
commissionProcessor.initScheduler();
const { calculateUserDepositBalance } = require('../utils/betBalanceTracker');




router.post("/place-bet", auth, async (req, res) => {
  try {
    const {
      betAmount,
      multiplier,
      tax,
      fee,
      selectedTimer,
      periodId,
      sectionBets,
      totalSum,
      totalBet,
      orderId,  
    } = req.body;

    const userId = req.user._id;

    // Fetch user from the database
    const user = await User.findById(userId);
    const accountType = user.accountType;
    if (!user) {
      console.error(`User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }

    // Ensure that walletAmount is defined
    if (typeof user.walletAmount === "undefined") {
      console.error(`User ${userId} does not have a walletAmount field.`);
      return res
        .status(500)
        .json({ message: "User wallet balance not defined." });
    }

    // Validate betAmount
    if (betAmount <= 0) {
      console.warn(`Invalid bet amount: ${betAmount}`);
      return res
        .status(400)
        .json({ message: "Bet amount must be greater than zero" });
    }

    // Log totalBet value received from the request body
    console.log(`Received totalBet: ${totalBet}`);

    // Parse the fee to remove the percentage symbol and ensure it's a number
    const parsedFee = parseFloat(fee);
    const feeAmount = (totalBet * parsedFee) / 100;
    const totalBetAfterTax = totalBet - feeAmount;

    console.log(
      `Fee amount: ${feeAmount}, Total bet after tax: ${totalBetAfterTax}`
    );

    // Check if user has sufficient balance
    console.log(`User wallet balance before deduction: ${user.walletAmount}`);
    if (user.walletAmount < totalBet) {
      console.warn(
        `Insufficient balance for user ${userId}. Wallet balance: ${user.walletAmount}, Required: ${totalBet}`
      );
      return res
        .status(400)
        .json({ message: "Insufficient balance to place bet" });
    }

    // Deduct totalBet from user's walletAmount
    user.walletAmount -= totalBet;

    // Ensure the walletAmount doesn't become NaN
    if (isNaN(user.walletAmount)) {
      console.error("walletAmount became NaN after deduction.");
      return res.status(500).json({ message: "Error updating wallet balance" });
    }

    console.log(`User ${userId} new wallet balance: ${user.walletAmount}`);
 // Calculate available deposit balance

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
    // Create and save the new bet
    const newBet = new FiveDBet({
      user: userId,
      betAmount,
      totalBet,
      totalBetAfterTax,
      multiplier,
      tax,
      fee: `${parsedFee}%`,
      selectedTimer,
      periodId,
      sectionBets: sectionBets || {},
      totalSum,
      status: "Pending",
      userType: accountType,
      orderId,
      betSource: betSource,
      betSourceAmount: betSourceAmount
    });

    await newBet.save();
    console.log(`New bet placed: ${JSON.stringify(newBet)}`);

    // Save the updated user balance
    await user.save();

    // Record the bet transaction
    await addTransactionDetails(
      userId,
      totalBet,
      "5DBet",
      new Date(),
      0,
      totalBet,
      "5d"
    );

    const pendingCommissions = await createPendingCommissions(
      user._id,
      totalBet,
      "5d"
    );
    const rebateResult = await processRebate(user, totalBet, "5d");

    res.status(201).json({ message: "Bet placed successfully", bet: newBet });
  } catch (error) {
    console.error("Error placing bet:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

router.get("/fiveD-bets", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Extract user ID from the authenticated user

    // Find bets for the authenticated user and sort them in descending order based on the timestamp
    const userBets = await FiveDBet.find({ user: userId })
      .sort({ timestamp: -1 }) // Sort by `timestamp` in descending order
      .exec();

    if (userBets.length === 0) {
      return res
        .status(404)
        .json({ success: false, message: "No bets found for this user." });
    }

    // Return bets with success message
    return res.status(200).json({
      success: true,
      message: "Bets fetched successfully.",
      data: userBets,
    });
  } catch (error) {
    console.error("Error fetching bets:", error);
    return res.status(500).json({
      success: false,
      message: "An error occurred while fetching bets.",
    });
  }
});

router.get("/latest-5d-bet-sums", auth, isAdmin, async (req, res) => {
  try {
    const timer = req.query.timer;
    console.log("Requested timer:", timer);

    const periodId = await getLatestPeriodId(timer);
    console.log("Latest periodId:", periodId);

    const bets = await FiveDBet.find({
      periodId,
      userType: { $ne: "Restricted" },
    });

    const totalBetSums = {
      A: {
        numbers: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
      B: {
        numbers: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
      C: {
        numbers: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
      D: {
        numbers: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
      E: {
        numbers: {
          0: 0,
          1: 0,
          2: 0,
          3: 0,
          4: 0,
          5: 0,
          6: 0,
          7: 0,
          8: 0,
          9: 0,
        },
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
      totalSum: {
        size: { Small: 0, Big: 0 },
        parity: { Even: 0, Odd: 0 },
      },
    };

    let totalBetAmount = 0;

    bets.forEach((bet) => {
      const { sectionBets, totalBet } = bet;
      totalBetAmount += totalBet;

      // Iterate over each section (A, B, C, D, E)
      for (const section in sectionBets) {
        const sectionBet = sectionBets[section];

        // Check if numberBet is defined and an array before iterating
        if (sectionBet.numberBet && Array.isArray(sectionBet.numberBet)) {
          sectionBet.numberBet.forEach((number) => {
            totalBetSums[section].numbers[number] += totalBet;
          });
        }

        // Sum up size bets (only valid values)
        if (
          sectionBet.size &&
          (sectionBet.size === "Small" || sectionBet.size === "Big")
        ) {
          totalBetSums[section].size[sectionBet.size] += totalBet;
        }

        // Sum up parity bets (only valid values)
        if (
          sectionBet.parity &&
          (sectionBet.parity === "Even" || sectionBet.parity === "Odd")
        ) {
          totalBetSums[section].parity[sectionBet.parity] += totalBet;
        }
      }

      // Handle totalSum fields
      if (bet.totalSum) {
        // Sum up total size (only valid values)
        if (
          bet.totalSum.size &&
          (bet.totalSum.size === "Small" || bet.totalSum.size === "Big")
        ) {
          totalBetSums.totalSum.size[bet.totalSum.size] += totalBet;
        }

        // Sum up total parity (only valid values)
        if (
          bet.totalSum.parity &&
          (bet.totalSum.parity === "Even" || bet.totalSum.parity === "Odd")
        ) {
          totalBetSums.totalSum.parity[bet.totalSum.parity] += totalBet;
        }
      }
    });

    res.json({
      periodId,
      totalBetSums,
      totalBetAmount,
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Failed to fetch latest 5D bet sums" });
  }
});

module.exports = router;
