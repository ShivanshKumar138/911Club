const Withdraw = require("../models/withdrawModel");
const User = require("../models/userModel");
const Bet = require("../models/betsModel");
const K3Bet = require("../models/K3BetModel");
const TrxBet = require("../models/TRXBetModel");
const DepositHistory = require("../models/depositHistoryModel");
const Settings = require("../models/Settings");
const UserRemainingBet = require("../models/UserRemainingBet");
const TransasictionHistory = require("../models/TransictionHistory");
const FiveDBet = require("../models/5DBetModel");
const axios = require("axios");
const {
  addTransactionDetails,
} = require("../controllers/TransactionHistoryControllers");
const UsdtSettings = require("../models/UsdtSettings");

const domain = `http://localhost:4000`;

// Utility function to round values
function round(val) {
  return Math.round(val * 100) / 100;
}

const VALID_WITHDRAW_METHODS = ["Bank Card", "UPI", "USDT"];
const USDT_RATE = 93; // 1 USDT = 93 INR

// Shared function to calculate remaining bet amount with consistent logic
const calculateUserRemainingBetAmount = async (userId) => {
  try {
    const user = await User.findById(userId);
    if (!user) {
      throw new Error("User not found");
    }

    // Aggregate total bet amount from all game models including 5DBet
    const [
      totalBetAmount,
      totalK3BetAmount,
      totalTrxBetAmount,
      totalFiveDBetAmount,
      totalDepositAmount,
    ] = await Promise.all([
      Bet.aggregate([
        {
          $match: {
            userId: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }],
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$betSourceAmount", // Only count betSourceAmount
            },
          },
        },
      ]),
      K3Bet.aggregate([
        {
          $match: {
            user: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }],
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$betSourceAmount",
            },
          },
        },
      ]),
      // TRX bets - modified to only use betSourceAmount
      TrxBet.aggregate([
        {
          $match: {
            userId: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }],
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$betSourceAmount",
            },
          },
        },
      ]),
      // 5D bets - modified to only use betSourceAmount
      FiveDBet.aggregate([
        {
          $match: {
            user: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }],
          },
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: "$betSourceAmount",
            },
          },
        },
      ]),
      DepositHistory.aggregate([
        { $match: { userId: userId, depositStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$depositAmount" } } },
      ]),
    ]);

    // Get regular bonus amounts
    const regularBonusTypes = [
      "AttendanceBonus",
      "VIPLevelReward",
      "VIPMonthlyReward",
      "WalletIncrease",
      "Coupon",
      "Invitation Bonus",
      "DailyReward",
      "Sign Up Bonus",
    ];

    // Get deposit bonus amounts that should be doubled
    const doubleCountBonusTypes = ["DepositBonus", "SecondDepositBonus"];

    // Get total bonus amounts, separating regular and doubled bonuses
    const [regularBonusTransactions, doubleCountBonusTransactions] =
      await Promise.all([
        TransasictionHistory.aggregate([
          {
            $match: {
              user: userId,
              type: { $in: regularBonusTypes },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),
        TransasictionHistory.aggregate([
          {
            $match: {
              user: userId,
              type: { $in: doubleCountBonusTypes },
            },
          },
          {
            $group: {
              _id: null,
              total: { $sum: "$amount" },
            },
          },
        ]),
      ]);

    const regularBonusAmount = regularBonusTransactions[0]?.total || 0;
    const doubleCountBonusAmount = doubleCountBonusTransactions[0]?.total || 0;

    // Double the deposit bonus amounts
    const totalBonusAmount = regularBonusAmount + doubleCountBonusAmount * 2;

    const totalBet =
      (totalBetAmount[0]?.total || 0) +
      (totalK3BetAmount[0]?.total || 0) +
      (totalTrxBetAmount[0]?.total || 0) +
      (totalFiveDBetAmount[0]?.total || 0);

    const totalDeposit = totalDepositAmount[0]?.total || 0;

    // Add bonus amounts to required bet amount calculation
    const requiredBetAmount =
      totalDeposit + user.manualBetAdjustment + totalBonusAmount;

    // Calculate remaining bet amount
    const remainingBetAmount = Math.max(0, requiredBetAmount - totalBet);

    return {
      remainingBetAmount,
      totalBet,
      totalDeposit,
      regularBonusAmount,
      doubleCountBonusAmount: doubleCountBonusAmount * 2, // Return doubled amount
      totalBonusAmount,
      manualBetAdjustment: user.manualBetAdjustment,
      requiredBetAmount,
    };
  } catch (error) {
    console.error("Error calculating remaining bet amount:", error);
    throw error;
  }
};

// Set Manual Bet Adjustment
const setManualBetAdjustment = async (req, res) => {
  try {
    const { userId, adjustmentAmount } = req.body;

    if (!userId || adjustmentAmount === undefined) {
      return res.status(400).json({
        success: false,
        message: "User ID and adjustment amount are required",
      });
    }

    const user = await User.findByIdAndUpdate(
      userId,
      { manualBetAdjustment: adjustmentAmount },
      { new: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    res.status(200).json({
      success: true,
      message: "Manual bet adjustment updated successfully",
      user: {
        id: user._id,
        manualBetAdjustment: user.manualBetAdjustment,
      },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error updating manual bet adjustment",
      error: error.message,
    });
  }
};

// Request Withdraw
const requestWithdraw = async (req, res) => {
  let savedRequest;
  try {
    const userId = req.user._id;
    const userDetail = await User.findById(userId);

    // Check if user's wallet is on hold
    if (userDetail.isWalletOnHold) {
      return res.status(403).json({
        success: false,
        message:
          "Your wallet is currently on hold. Please contact support for assistance.",
      });
    }
    let balance = req.body.balance; // Use let to allow modification
    const withdrawMethod = req.body.withdrawMethod;
    let settings;
    if (withdrawMethod === "USDT") {
      settings = UsdtSettings.findOne();
    } else {
      settings = await Settings.findOne();
    }

    // Fallback if no settings found
    if (!settings) {
      settings = new Settings();
      await settings.save();
    }

    // Validate withdraw method
    if (!withdrawMethod || !VALID_WITHDRAW_METHODS.includes(withdrawMethod)) {
      return res.status(400).json({
        success: false,
        message: `Invalid withdrawal method. Allowed methods are: ${VALID_WITHDRAW_METHODS.join(
          ", "
        )}`,
      });
    }

    // Special handling for USDT withdrawals
    if (withdrawMethod === "USDT" && settings.isUsdt) {
      // Check if the balance is between 10 and 500 USDT without converting
      if (
        balance < settings.minWithdrawAmount ||
        balance > settings.maxWithdrawAmount
      ) {
        return res.status(400).json({
          success: false,
          message: `USDT withdrawals must be between ${settings.minWithdrawAmount} USDT and ${settings.maxWithdrawAmount} USDT`,
        });
      }
      // Convert balance to INR for processing
      balance = balance * USDT_RATE;
    } else if (withdrawMethod === "Bank Card" || withdrawMethod === "UPI") {
      // Regular withdrawal amount validation
      if (
        balance < settings.minWithdrawAmount ||
        balance > settings.maxWithdrawAmount
      ) {
        return res.status(400).json({
          success: false,
          message: `You can only withdraw between ${settings.minWithdrawAmount} and ${settings.maxWithdrawAmount}`,
        });
      }
    }

    // Helper function to convert 12-hour format to 24-hour format
    const convertTo24Hour = (hour, period) => {
      if (period === "PM" && hour !== 12) return hour + 12;
      if (period === "AM" && hour === 12) return 0;
      return hour;
    };

    const currentTime = new Date();
    const currentHour = currentTime.getHours();
    const startHour24 = convertTo24Hour(
      settings.withdrawalStartHour,
      settings.withdrawalStartPeriod
    );
    const endHour24 = convertTo24Hour(
      settings.withdrawalEndHour,
      settings.withdrawalEndPeriod
    );

    // Check if the user is restricted
    const isRestricted = userDetail.accountType === "Restricted";

    // Apply withdrawal restrictions for non-restricted users
    if (!isRestricted) {
      // Check time restrictions
      if (currentHour < startHour24 || currentHour >= endHour24) {
        return res.status(400).json({
          success: false,
          message: `Withdrawals are allowed between ${settings.withdrawalStartHour} ${settings.withdrawalStartPeriod} and ${settings.withdrawalEndHour} ${settings.withdrawalEndPeriod}`,
        });
      }

      // Check daily withdrawal limit
      if (
        userDetail.withdrawRequestsToday >= settings.maxWithdrawRequestsPerDay
      ) {
        return res.status(400).json({
          success: false,
          message: `You can only send ${settings.maxWithdrawRequestsPerDay} withdrawal requests per day`,
        });
      }

      // Use the shared calculation function
      const betCalculation = await calculateUserRemainingBetAmount(userId);

      if (userDetail.walletAmount < balance) {
        return res.status(400).json({
          success: false,
          message: "You have insufficient balance to withdraw",
        });
      }

      // Calculate how much can be withdrawn
      const withdrawableAmount = Math.max(
        0,
        userDetail.walletAmount - betCalculation.remainingBetAmount
      );

      if (withdrawableAmount <= 0) {
        // Can't withdraw anything
        return res.status(400).json({
          success: false,
          message: `You need to place ₹${betCalculation.remainingBetAmount.toFixed(
            2
          )} more in bets before you can withdraw any funds.`,
          remainingBetAmount: betCalculation.remainingBetAmount,
          requiredBetAmount: betCalculation.requiredBetAmount,
          totalBet: betCalculation.totalBet,
        });
      } else if (balance > withdrawableAmount) {
        // Trying to withdraw more than allowed
        return res.status(400).json({
          success: false,
          message: `You can only withdraw up to ₹${withdrawableAmount.toFixed(
            2
          )} at this time. You need to place ₹${betCalculation.remainingBetAmount.toFixed(
            2
          )} more in bets to unlock your remaining funds.`,
          withdrawableAmount: withdrawableAmount,
          remainingBetAmount: betCalculation.remainingBetAmount,
        });
      }
    }

    // Create the withdrawal request
    const withdrawRequest = new Withdraw({
      balance: balance,
      withdrawMethod: withdrawMethod,
      status: isRestricted ? "Completed" : "Pending", // Auto-complete for restricted users
      userId: userId,
    });

    savedRequest = await withdrawRequest.save();

    // Process wallet deduction and records for restricted users
    if (isRestricted) {
      await User.findByIdAndUpdate(userId, {
        $inc: { walletAmount: -balance },
        $push: { withdrawRecords: savedRequest._id },
      });
      // Add transaction details using the existing function
      await addTransactionDetails(
        userId, // userId
        balance, // amount
        "withdraw", // type
        new Date(), // date
        0, // depositAmount
        0, // betAmount
        "N/A", // gameType
        null, // commissionFromUser
        0, // depositAmountOfUser
        0, // commissionLevel
        "depositDoneAlready" // firstDepositChecker
      );
    } else {
      // Update wallet and request history for non-restricted users
      await User.findByIdAndUpdate(
        userId,
        {
          $inc: { withdrawRequestsToday: 1, walletAmount: -balance },
          $push: { withdrawRecords: savedRequest._id },
        },
        { new: true }
      );
    }

    // Notify all admins about the withdrawal request
    await User.updateMany(
      { accountType: "Admin" },
      { $push: { withdrawRecords: savedRequest._id } }
    );

    res.status(201).json({
      success: true,
      message:
        "We will complete the withdrawal within 2 hours! Please wait patiently ...",
      withdrawRequest: savedRequest,
    });
  } catch (error) {
    // Rollback in case of an error
    if (savedRequest && savedRequest._id) {
      await Withdraw.findByIdAndDelete(savedRequest._id);
    }

    res.status(500).json({
      success: false,
      message: "Error creating withdrawal request",
      error: error.message,
    });
  }
};

// Calculate Remaining Bet Amount
const calculateRemainingBetAmount = async (req, res) => {
  try {
    const userId = req.user._id;
    const user = await User.findById(userId);

    // Use the shared calculation function
    const betCalculation = await calculateUserRemainingBetAmount(userId);

    // Update user's remaining withdraw amount
    await User.findByIdAndUpdate(userId, {
      remainingWithdrawAmount: betCalculation.remainingBetAmount,
    });

    res.status(200).json({
      success: true,
      ...betCalculation,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error calculating remaining bet amount",
      error: error.message,
    });
  }
};

// Get All Users Remaining Bet Amounts
const getAllUsersRemainingBetAmounts = async (req, res) => {
  try {
    const users = await User.find({});

    // Aggregate total bet amounts and deposits for all users
    const userBetData = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;

        // Aggregate total bet amount from all game models
        const [
          totalBetAmount,
          totalK3BetAmount,
          totalTrxBetAmount,
          totalFiveDBetAmount,
          totalDepositAmount,
        ] = await Promise.all([
          Bet.aggregate([
            {
              $match: {
                userId: userId,
                $or: [{ betSource: "deposit" }, { betSource: "partial" }],
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$betSourceAmount", // Only count betSourceAmount
                },
              },
            },
          ]),
          K3Bet.aggregate([
            { $match: { user: userId } },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$totalBet", "$tax"] } },
              },
            },
          ]),
          TrxBet.aggregate([
            { $match: { userId: userId } },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$totalBet", "$tax"] } },
              },
            },
          ]),
          FiveDBet.aggregate([
            { $match: { user: userId } },
            {
              $group: {
                _id: null,
                total: { $sum: "$totalBet" },
              },
            },
          ]),
          DepositHistory.aggregate([
            { $match: { userId: userId, depositStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$depositAmount" } } },
          ]),
        ]);

        const totalBet =
          (totalBetAmount[0]?.total || 0) +
          (totalK3BetAmount[0]?.total || 0) +
          (totalTrxBetAmount[0]?.total || 0) +
          (totalFiveDBetAmount[0]?.total || 0);

        const totalDeposit = totalDepositAmount[0]?.total || 0;
        const requiredBetAmount = totalDeposit + user.manualBetAdjustment;

        // Calculate remaining bet amount
        const remainingBetAmount = Math.max(0, requiredBetAmount - totalBet);

        return {
          userId: userId,
          uid: user.uid,
          username: user.username,
          remainingBetAmount: remainingBetAmount,
          totalBet: totalBet,
          totalDeposit: totalDeposit,
          manualBetAdjustment: user.manualBetAdjustment,
          requiredBetAmount: requiredBetAmount,
        };
      })
    );

    res.status(200).json({
      success: true,
      users: userBetData,
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Error fetching users' remaining bet amounts",
      error: error.message,
    });
  }
};

// Function to fetch data from the database and update the UserRemainingBet collection
const fetchAndUpdateUserRemainingBets = async (req, res) => {
  try {
    const users = await User.find({}); // Fetch all users

    // Aggregate total bet amounts and deposits for all users
    const userBetData = await Promise.all(
      users.map(async (user) => {
        const userId = user._id;
        const userUID = user.uid; // Fetch user's UID

        // Check if the user already exists in the UserRemainingBet collection
        const existingUserBet = await UserRemainingBet.findOne({ userId });

        // If user already exists in UserRemainingBet, return the existing data
        if (existingUserBet) {
          return {
            userId: userId,
            uid: userUID, // Include the user's UID
            remainingBetAmount: existingUserBet.remainingBetAmount, // Return existing remaining bet
            alreadyExists: true, // Flag to indicate this user already exists in the collection
          };
        }

        // If user doesn't exist, perform the calculations
        const [
          totalBetAmount,
          totalK3BetAmount,
          totalTrxBetAmount,
          totalDepositAmount,
        ] = await Promise.all([
          Bet.aggregate([
            {
              $match: {
                userId: userId,
                $or: [{ betSource: "deposit" }, { betSource: "partial" }],
              },
            },
            {
              $group: {
                _id: null,
                total: {
                  $sum: "$betSourceAmount", // Only count betSourceAmount
                },
              },
            },
          ]),
          K3Bet.aggregate([
            { $match: { user: userId } },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$totalBet", "$tax"] } },
              },
            },
          ]),
          TrxBet.aggregate([
            { $match: { userId: userId } },
            {
              $group: {
                _id: null,
                total: { $sum: { $add: ["$totalBet", "$tax"] } },
              },
            },
          ]),
          DepositHistory.aggregate([
            { $match: { userId: userId, depositStatus: "completed" } },
            { $group: { _id: null, total: { $sum: "$depositAmount" } } },
          ]),
        ]);

        // Calculate total bet amount
        const totalBet =
          (totalBetAmount[0]?.total || 0) +
          (totalK3BetAmount[0]?.total || 0) +
          (totalTrxBetAmount[0]?.total || 0);

        // Calculate total deposit amount
        const totalDeposit = totalDepositAmount[0]?.total || 0;
        const requiredBetAmount = totalDeposit + user.manualBetAdjustment;

        // Calculate remaining bet amount
        const remainingBetAmount = Math.max(0, requiredBetAmount - totalBet);

        // Return user data with calculated remaining bet
        return {
          userId: userId,
          uid: userUID, // Include the user's UID
          remainingBetAmount: remainingBetAmount,
          alreadyExists: false, // Flag to indicate this user didn't exist before and was calculated
        };
      })
    );

    // Update the UserRemainingBet collection for newly calculated users
    for (const userBet of userBetData) {
      if (!userBet.alreadyExists) {
        await UserRemainingBet.findOneAndUpdate(
          { userId: userBet.userId },
          { remainingBetAmount: userBet.remainingBetAmount },
          { upsert: true, new: true, setDefaultsOnInsert: true }
        );
      }
    }

    // Send the response with user data including UID
    res.status(200).json({
      success: true,
      message: "Users remaining bet amounts updated successfully",
      users: userBetData, // Return the updated user data, including UIDs and remaining bet amounts
    });
  } catch (error) {
    console.error("Error updating users remaining bet amounts:", error);
    res.status(500).json({
      success: false,
      message: "Error updating users remaining bet amounts",
      error: error.message,
    });
  }
};

module.exports = {
  requestWithdraw,
  calculateRemainingBetAmount,
  setManualBetAdjustment,
  getAllUsersRemainingBetAmounts,
  fetchAndUpdateUserRemainingBets,
};
