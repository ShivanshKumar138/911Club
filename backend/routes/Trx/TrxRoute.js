const express = require("express");
const TRXBet = require("../../models/TRXBetModel");
const User = require("../../models/userModel");
const TrxResult = require("../../models/trxResultModel");
const auth = require("../../middlewares/auth");
const router = express.Router();
const moment = require("moment");
const TrxBet = require("../../models/TRXBetModel");
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const CommissionRate = require("../../models/betCommissionLevel");
const Level = require("../../models/levelSchema");
const Rebate = require("../../models/RebateSchema");
const {
  monitorIllegalBet,
  getIllegalBetSummary,
} = require("../../utils/illegalBetMonitor");
const { calculateUserDepositBalance } = require('../../utils/betBalanceTracker');

router.post("/trxbet", auth, async (req, res) => {
  try {
    console.log(req.body);
    console.log("first");
    const { _id } = req.user;
    console.log("id -->", _id);
    const {
      betAmount,
      selectedItem,
      sizeOutcome,
      periodId,
      selectedTimer,
      totalBet,
      orderId,
    } = req.body;

    const user = await User.findById(_id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check for illegal bet
    const { isIllegal, illegalCount, totalIllegalCount, betCount } =
      await monitorIllegalBet( user._id,
        "TRX",
        req.body.periodId,
        req.body.selectedItem,
        req.body.betAmount);

    if (isIllegal) {
      console.log(
        `Illegal bet detected for user ${_id} on TRX game, period ${periodId}. Illegal count: ${illegalCount}, Total illegal count: ${totalIllegalCount}`
      );
      // You can decide how to handle illegal bets. For now, we'll just log it and continue.
    }

    if (user.walletAmount < totalBet) {
      return res.status(400).json({ message: "Insufficient funds" });
    }

    // Deduct the total bet amount from the user's wallet
    user.walletAmount -= totalBet;
    await user.save();

    // Calculate the transaction fee and total bet after transaction
    const totalBetAfterTx = totalBet * 0.975; // Updated to 2.5%
    const tax = totalBet - totalBetAfterTx;
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

    // Create a new TrxBet document
    const trxBet = new TrxBet({
      userId: _id,
      betAmount,
      selectedItem,
      sizeOutcome,
      totalBet: totalBetAfterTx,
      tax,
      selectedTimer,
      periodId,
      timestamp: Date.now(),
      status: "pending",
      result: "",
      winLoss: "0",
      isIllegal: isIllegal,
      orderId,
      betSource: betSource,
      betSourceAmount: betSourceAmount

    });

    await trxBet.save();

    // Record the bet transaction
    await addTransactionDetails(
      trxBet.userId,
      totalBet,
      "TRXBet",
      new Date(),
      0,
      totalBet,
      "trx"
    );

    // Commission rates
    const { level1, level2, level3, level4, level5, level6 } =
      await CommissionRate.findOne();
    const commissionRates = [level1, level2, level3, level4, level5 , level6];

    // Start with the user who placed the bet
    let currentUserId = _id;

    // For each level in the upline
    for (let i = 0; i < 6; i++) {
      // Find the current user
      let currentUser = await User.findById(currentUserId);

      // If the user doesn't exist or doesn't have a referrer, break the loop
      if (!currentUser || !currentUser.referrer) {
        console.log(`No more referrers found at level ${i + 1}.`);
        break;
      }

      // Find the referrer
      let referrer = await User.findById(currentUser.referrer);

      // If the referrer doesn't exist, break the loop
      if (!referrer) {
        console.log(
          `Referrer not found at level ${i + 1} for user ${currentUser._id}.`
        );
        break;
      }

      // Calculate the commission for the referrer
      let commission = (totalBet * commissionRates[i]) / 100;

      // Add the commission to the referrer's wallet
      referrer.walletAmount += commission;

      // Log the commission details
      console.log(
        `Level ${i + 1} Referrer ID ${
          referrer._id
        } received commission: ${commission}`
      );

      // Record the commission transaction
      await addTransactionDetails(
        referrer._id,
        commission,
        "commission",
        new Date(),
        0,
        totalBet,
        "trx",
        req.user._id,
        0,
        i + 1 // Passing the commission level
      );

      // Update the commission record for the referrer
      let today = new Date();
      today.setHours(0, 0, 0, 0);

      let commissionRecord = referrer.commissionRecords.find((record) => {
        let recordDate = new Date(record.date);
        recordDate.setHours(0, 0, 0, 0);
        return (
          recordDate.getTime() === today.getTime() &&
          record.uid === currentUser.uid
        );
      });

      if (commissionRecord) {
        commissionRecord.commission += commission;
        commissionRecord.betAmount += totalBet;
      } else {
        if (referrer.uid === currentUser.uid) {
          referrer.commissionRecords.push({
            date: today,
            level: i + 1,
            uid: currentUser.uid,
            commission: commission,
            betAmount: totalBet,
          });
        }
      }

      await referrer.save();

      // Move to the next user in the upline
      currentUserId = referrer._id;
    }
    // Find the highest level achieved based on the user's achievements
    const levels = await Level.findOne(); // Assuming Level is a schema with the levels data

    // Create a level map from the levels data
    const levelMap = levels.levels.reduce((map, level) => {
      map[level.awarded] = level;
      return map;
    }, {});

    console.log("Level Map --->", levelMap);

    // Extract the highest achievement level based on user's achievements
    const highestAchievement = user.achievements
      .map((achievement) => {
        // Extract the level name from the achievement string
        const levelName = achievement
          .replace("Reached ", "")
          .replace(" level", "");
        const level = levelMap[levelName];
        console.log(`Mapped achievement '${achievement}' to level:`, level);
        return level;
      })
      .reduce((highest, current) => {
        console.log(
          `Comparing current level: ${
            current ? current.minAmount : "null"
          } with highest: ${highest ? highest.minAmount : "null"}`
        );
        return current && (!highest || current.minAmount > highest.minAmount)
          ? current
          : highest;
      }, null);

    console.log("Highest achievement level found:", highestAchievement);

    if (highestAchievement) {
      // Extract the rebate percentage from the highest level
      const rebatePercentage = highestAchievement.rebatePercentage;
      console.log(`Rebate Percentage for highest level: ${rebatePercentage}%`);

      // Calculate rebate based on user's wallet amount
      const rebateAmount = ((totalBetAfterTx + tax) * rebatePercentage) / 100;
      console.log(`Calculated Rebate Amount: ${rebateAmount}`);

      // Add rebate amount to user's wallet
      user.walletAmount += rebateAmount;
      console.log(`Updated User Wallet Amount: ${user.walletAmount}`);

      // Save the updated user data back to the database
      await user.save();
      console.log("User data updated successfully.");

      // Store the rebate information in the rebateSchema
      const newRebate = new Rebate({
        userId: user._id,
        levelAwarded: highestAchievement.awarded,
        rebatePercentage,
        rebateAmount,
        walletAmountAfterRebate: user.walletAmount,
        bettingAmount: totalBetAfterTx + tax,
        date: new Date(),
      });

      await newRebate.save();
      console.log("Rebate data stored successfully.");

      // Optionally, send a notification or update the user's records
      // to reflect the rebate bonus or any additional bonuses awarded.
    } else {
      console.log("No valid achievement level found. No rebate applied.");
    }

    const illegalBetSummary = await getIllegalBetSummary(_id);

    res.status(201).json({
      trxBet,
      isIllegalBet: isIllegal,
      currentGameIllegalCount: illegalCount,
      totalIllegalCount,
      currentPeriodBetCount: betCount,
      illegalBetSummary,
    });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Error saving TRX bet", error: error.message });
  }
});

router.get("/user/trxbethistory", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const trxBets = await TRXBet.find({ userId }).sort({ timestamp: -1 });
    res.status(200).json(trxBets);
  } catch (error) {
    console.error(error);
    res.status(500).json({
      message: "Error retrieving TRX bet history",
      error: error.message,
    });
  }
});

module.exports = router;
