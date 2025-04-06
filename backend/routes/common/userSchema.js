const express = require("express");
const router = express.Router();
const moment = require("moment");
const user = require("../../models/userModel");
const auth = require("../../middlewares/auth");
const {
  isAdmin,
  isNormal,
  isRestricted,
} = require("../../middlewares/roleSpecificMiddleware");
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const DepositHistory = require("../../models/depositHistoryModel");
const Bet = require("../../models/betsModel");
const Withdraw = require("../../models/withdrawModel");
const { getLatestPeriodId } = require("../../controllers/cronJobControllers");
const Bets = require("../../models/betsModel");
const Settings = require("../../models/Settings");
const mongoose = require("mongoose");
const K3Bets = require("../../models/K3BetModel");
const TrxBet = require("../../models/TRXBetModel");
const VIPHistory = require("../../models/VIPHistory"); // Assuming VIPHistory model is in models folder
const InvitationBonus = require("../../models/invitationBonusSchema");
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const WingoProfitLoss = require("../../models/wingoProfitLossSchema");
const K3ProfitLoss = require("../../models/K3ProfitLossSchema");
const FiveDProfitLoss = require("../../models/FiveDProfitLossSchema");
const GameWinningType = require("../../models/GameWinningType");
const UsdtSettings = require("../../models/UsdtSettings");

// Utility function to validate ObjectId
const isValidObjectId = (id) => mongoose.Types.ObjectId.isValid(id);

// Get current game winning type
router.get("/game-winning-type", auth, isAdmin, async (req, res) => {
  try {
    let config = await GameWinningType.findOne();

    if (!config) {
      config = await GameWinningType.create({ isRandomWinning: false });
    }

    return res.status(200).json({
      success: true,
      data: {
        isRandomWinning: config.isRandomWinning,
      },
    });
  } catch (error) {
    console.error("Error in getting game winning type:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

// Update game winning type
router.put("/game-winning-type", auth, isAdmin, async (req, res) => {
  try {
    const { isRandomWinning } = req.body;

    if (typeof isRandomWinning !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Invalid input",
      });
    }

    let config = await GameWinningType.findOne();

    if (!config) {
      config = await GameWinningType.create({ isRandomWinning });
    } else {
      config.isRandomWinning = isRandomWinning;
      await config.save();
    }

    console.log(
      `Game winning type updated to: ${
        isRandomWinning ? "Random" : "Least Bet"
      }`
    );

    return res.status(200).json({
      success: true,
      message: "Updated successfully",
      data: {
        isRandomWinning: config.isRandomWinning,
      },
    });
  } catch (error) {
    console.error("Error in updating game winning type:", error);
    return res.status(500).json({
      success: false,
      message: "Server error",
    });
  }
});

router.post("/k3-profit-loss-history", auth, isAdmin, async (req, res) => {
  try {
    const { timerType, timeFrame } = req.body;
    console.log("Request body:", req.body);

    if (!timerType || !timeFrame) {
      return res
        .status(400)
        .json({ message: "Timer type and time frame are required" });
    }

    const validTimerTypes = ["1min", "3min", "5min", "10min"]; // Adjust these based on K3 timer types
    const validTimeFrames = [
      "today",
      "yesterday",
      "this_week",
      "this_month",
      "this_quarter",
      "all",
    ];

    if (
      !validTimerTypes.includes(timerType) ||
      !validTimeFrames.includes(timeFrame)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid timer type or time frame" });
    }

    let startDate, endDate;
    const now = moment().utc();

    switch (timeFrame) {
      case "today":
        startDate = now.clone().startOf("day");
        endDate = now.clone().endOf("day");
        break;
      case "yesterday":
        startDate = now.clone().subtract(1, "days").startOf("day");
        endDate = now.clone().subtract(1, "days").endOf("day");
        break;
      case "this_week":
        startDate = now.clone().startOf("week");
        endDate = now.clone().endOf("week");
        break;
      case "this_month":
        startDate = now.clone().startOf("month");
        endDate = now.clone().endOf("month");
        break;
      case "this_quarter":
        startDate = now.clone().startOf("quarter");
        endDate = now.clone().endOf("quarter");
        break;
      case "all":
        startDate = moment(0).utc();
        endDate = now;
        break;
    }

    console.log("Query date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const query = {
      timerType,
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    };

    console.log("MongoDB query:", JSON.stringify(query));

    const profitLossHistory = await K3ProfitLoss.find(query).sort({
      createdAt: -1,
    });

    console.log("Query result count:", profitLossHistory.length);

    if (profitLossHistory.length === 0) {
      console.log(
        "No records found. Checking for any records in the collection..."
      );
      const sampleRecord = await K3ProfitLoss.findOne().sort({ createdAt: -1 });
      if (sampleRecord) {
        console.log("Sample record found:", sampleRecord);
      } else {
        console.log("No records found in the collection at all.");
      }
    }

    const summary = profitLossHistory.reduce(
      (acc, record) => {
        acc.totalBetAmount += record.totalBetAmount;
        acc.totalTaxAmount += record.totalTaxAmount;
        acc.totalWinAmount += record.totalWinAmount;
        acc.totalProfitLoss += record.profitLoss;
        return acc;
      },
      {
        totalBetAmount: 0,
        totalTaxAmount: 0,
        totalWinAmount: 0,
        totalProfitLoss: 0,
      }
    );

    summary.profitMargin =
      summary.totalBetAmount !== 0
        ? (summary.totalProfitLoss / summary.totalBetAmount) * 100
        : 0;

    console.log("Summary:", summary);

    res.json({
      message: "K3 profit/loss history retrieved successfully",
      timerType,
      timeFrame,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary,
      history: profitLossHistory,
    });
  } catch (error) {
    console.error("Error in k3-profit-loss-history:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the profit/loss history",
      error: error.message,
    });
  }
});

router.post("/5d-profit-loss-history", auth, isAdmin, async (req, res) => {
  try {
    const { timerType, timeFrame } = req.body;
    console.log("Request body:", req.body);

    if (!timerType || !timeFrame) {
      return res
        .status(400)
        .json({ message: "Timer type and time frame are required" });
    }

    const validTimerTypes = ["1min", "3min", "5min", "10min"]; // Adjust these based on K3 timer types
    const validTimeFrames = [
      "today",
      "yesterday",
      "this_week",
      "this_month",
      "this_quarter",
      "all",
    ];

    if (
      !validTimerTypes.includes(timerType) ||
      !validTimeFrames.includes(timeFrame)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid timer type or time frame" });
    }

    let startDate, endDate;
    const now = moment().utc();

    switch (timeFrame) {
      case "today":
        startDate = now.clone().startOf("day");
        endDate = now.clone().endOf("day");
        break;
      case "yesterday":
        startDate = now.clone().subtract(1, "days").startOf("day");
        endDate = now.clone().subtract(1, "days").endOf("day");
        break;
      case "this_week":
        startDate = now.clone().startOf("week");
        endDate = now.clone().endOf("week");
        break;
      case "this_month":
        startDate = now.clone().startOf("month");
        endDate = now.clone().endOf("month");
        break;
      case "this_quarter":
        startDate = now.clone().startOf("quarter");
        endDate = now.clone().endOf("quarter");
        break;
      case "all":
        startDate = moment(0).utc();
        endDate = now;
        break;
    }

    console.log("Query date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const query = {
      timerType,
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    };

    console.log("MongoDB query:", JSON.stringify(query));

    const profitLossHistory = await FiveDProfitLoss.find(query).sort({
      createdAt: -1,
    });

    console.log("Query result count:", profitLossHistory.length);

    if (profitLossHistory.length === 0) {
      console.log(
        "No records found. Checking for any records in the collection..."
      );
      const sampleRecord = await FiveDProfitLoss.findOne().sort({
        createdAt: -1,
      });
      if (sampleRecord) {
        console.log("Sample record found:", sampleRecord);
      } else {
        console.log("No records found in the collection at all.");
      }
    }

    const summary = profitLossHistory.reduce(
      (acc, record) => {
        acc.totalBetAmount += record.totalBetAmount;
        acc.totalTaxAmount += record.totalTaxAmount;
        acc.totalWinAmount += record.totalWinAmount;
        acc.totalProfitLoss += record.profitLoss;
        return acc;
      },
      {
        totalBetAmount: 0,
        totalTaxAmount: 0,
        totalWinAmount: 0,
        totalProfitLoss: 0,
      }
    );

    summary.profitMargin =
      summary.totalBetAmount !== 0
        ? (summary.totalProfitLoss / summary.totalBetAmount) * 100
        : 0;

    console.log("Summary:", summary);

    res.json({
      message: "5D profit/loss history retrieved successfully",
      timerType,
      timeFrame,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary,
      history: profitLossHistory,
    });
  } catch (error) {
    console.error("Error in 5D-profit-loss-history:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the profit/loss history",
      error: error.message,
    });
  }
});

router.post("/wingo-profit-loss-history", auth, isAdmin, async (req, res) => {
  try {
    const { timerType, timeFrame } = req.body;
    console.log("Request body:", req.body);

    if (!timerType || !timeFrame) {
      return res
        .status(400)
        .json({ message: "Timer type and time frame are required" });
    }

    const validTimerTypes = ["30sec", "1min", "3min", "5min", "10min"];
    const validTimeFrames = [
      "today",
      "yesterday",
      "this_week",
      "this_month",
      "this_quarter",
      "all",
    ];

    if (
      !validTimerTypes.includes(timerType) ||
      !validTimeFrames.includes(timeFrame)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid timer type or time frame" });
    }

    let startDate, endDate;
    const now = moment().utc();

    switch (timeFrame) {
      case "today":
        startDate = now.clone().startOf("day");
        endDate = now.clone().endOf("day");
        break;
      case "yesterday":
        startDate = now.clone().subtract(1, "days").startOf("day");
        endDate = now.clone().subtract(1, "days").endOf("day");
        break;
      case "this_week":
        startDate = now.clone().startOf("week");
        endDate = now.clone().endOf("week");
        break;
      case "this_month":
        startDate = now.clone().startOf("month");
        endDate = now.clone().endOf("month");
        break;
      case "this_quarter":
        startDate = now.clone().startOf("quarter");
        endDate = now.clone().endOf("quarter");
        break;
      case "all":
        startDate = moment(0).utc();
        endDate = now;
        break;
    }

    console.log("Query date range:", {
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
    });

    const query = {
      timerType,
      createdAt: { $gte: startDate.toDate(), $lte: endDate.toDate() },
    };

    console.log("MongoDB query:", JSON.stringify(query));

    const profitLossHistory = await WingoProfitLoss.find(query).sort({
      createdAt: -1,
    });

    console.log("Query result count:", profitLossHistory.length);

    if (profitLossHistory.length === 0) {
      console.log(
        "No records found. Checking for any records in the collection..."
      );
      const sampleRecord = await WingoProfitLoss.findOne().sort({
        createdAt: -1,
      });
      if (sampleRecord) {
        console.log("Sample record found:", sampleRecord);
      } else {
        console.log("No records found in the collection at all.");
      }
    }

    const summary = profitLossHistory.reduce(
      (acc, record) => {
        acc.totalBetAmount += record.totalBetAmount;
        acc.totalTaxAmount += record.totalTaxAmount;
        acc.totalWinAmount += record.totalWinAmount;
        acc.totalProfitLoss += record.profitLoss;
        return acc;
      },
      {
        totalBetAmount: 0,
        totalTaxAmount: 0,
        totalWinAmount: 0,
        totalProfitLoss: 0,
      }
    );

    summary.profitMargin =
      summary.totalBetAmount !== 0
        ? (summary.totalProfitLoss / summary.totalBetAmount) * 100
        : 0;

    console.log("Summary:", summary);

    res.json({
      message: "Wingo profit/loss history retrieved successfully",
      timerType,
      timeFrame,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      summary,
      history: profitLossHistory,
    });
  } catch (error) {
    console.error("Error in wingo-profit-loss-history:", error);
    res.status(500).json({
      message: "An error occurred while retrieving the profit/loss history",
      error: error.message,
    });
  }
});

// Helper function to find the next eligible bonus configuration
const findNextEligibleBonusConfig = async (userId) => {
  const allBonusConfigs = await InvitationBonus.find().sort({
    minSubordinates: 1,
  });

  for (const config of allBonusConfigs) {
    const hasAchieved = config.achievedBy.some(
      (achievement) => achievement.userId.toString() === userId.toString()
    );
    if (!hasAchieved) {
      return config;
    }
  }

  return null; // No more eligible bonus configurations
};

router.post("/check-referral-bonus", auth, async (req, res) => {
  try {
    const { bonusLevel } = req.body;
    const userId = req.user._id;
    if (!isValidObjectId(userId)) {
      console.log(`Invalid user ID: ${userId}`);
      return res.status(400).json({ message: "Invalid user ID" });
    }
    console.log(`Starting bonus eligibility check for user: ${userId}`);

    // 1. Get the next eligible bonus configuration
    const bonusConfig = await findNextEligibleBonusConfig(userId);
    if (!bonusConfig) {
      console.log("No eligible bonus configuration found for user");
      return res
        .status(404)
        .json({ message: "No eligible bonus configuration found" });
    }
    console.log(`Eligible bonus config found:
      Required referrals: ${bonusConfig.minSubordinates}
      Required deposit per referral: ₹${bonusConfig.minDepositAmount}
      Bonus amount: ₹${bonusConfig.bonusAmount}`);

    // 2. Get user and their level 1 referrals
    const user = await User.findById(userId);
    console.log("USER->", user);
    if (!user) {
      console.log(`User ${userId} not found`);
      return res.status(404).json({ message: "User not found" });
    }

    if (!Array.isArray(user.referredUsers)) {
      console.log(`User ${userId} has no referredUsers array`);
      return res.status(400).json({ message: "No referrals found" });
    }

    const level1Referrals = user.referredUsers.filter((ref) => ref.level === 1);
    console.log(
      `Found ${level1Referrals.length} level 1 referrals for user ${userId}`
    );

    if (level1Referrals.length < bonusConfig.minSubordinates) {
      console.log(
        `Insufficient referrals. Need ${bonusConfig.minSubordinates}, has ${level1Referrals.length}`
      );
      return res.status(400).json({
        message: `You need ${bonusConfig.minSubordinates} referrals to qualify for the next bonus level. You currently have ${level1Referrals.length}.`,
      });
    }

    // 3. Check deposits for each referral
    const referralDeposits = await Promise.all(
      level1Referrals.map(async (referral) => {
        try {
          const referredUser = await User.findOne({ uid: referral.uid });

          if (!referredUser) {
            console.log(
              `Warning: Referred user with UID ${referral.uid} not found`
            );
            return {
              uid: referral.uid,
              totalDeposit: 0,
              error: "User not found",
            };
          }

          const deposits = await DepositHistory.aggregate([
            {
              $match: {
                userId: referredUser._id,
                depositStatus: "completed",
              },
            },
            {
              $group: {
                _id: "$userId",
                totalDeposit: { $sum: "$depositAmount" },
              },
            },
          ]);

          const totalDeposit = deposits[0]?.totalDeposit || 0;
          console.log(
            `Referral ${referral.uid} (ID: ${referredUser._id}) total deposit: ₹${totalDeposit}`
          );

          return {
            uid: referral.uid,
            userId: referredUser._id,
            totalDeposit,
          };
        } catch (error) {
          console.error(`Error processing referral ${referral.uid}:`, error);
          return {
            uid: referral.uid,
            totalDeposit: 0,
            error: "Processing error",
          };
        }
      })
    );

    // Filter out any referrals where we couldn't find the user or had an error
    const validReferralDeposits = referralDeposits.filter((ref) => !ref.error);

    // 4. Filter qualifying referrals
    const qualifyingReferrals = validReferralDeposits.filter(
      (ref) => ref.totalDeposit >= bonusConfig.minDepositAmount
    );
    console.log(
      `${qualifyingReferrals.length} referrals qualify with required deposit`
    );

    if (qualifyingReferrals.length < bonusConfig.minSubordinates) {
      console.log(
        `Insufficient qualifying referrals. Need ${bonusConfig.minSubordinates}, has ${qualifyingReferrals.length}`
      );
      return res.status(400).json({
        message: `For the next bonus level, you need ${bonusConfig.minSubordinates} referrals with minimum deposits of ₹${bonusConfig.minDepositAmount}. Currently, ${qualifyingReferrals.length} referrals qualify.`,
        qualifyingReferrals: qualifyingReferrals.map((ref) => ({
          uid: ref.uid,
          userId: ref.userId,
          totalDeposit: ref.totalDeposit,
        })),
      });
    }

    // 5. Update bonus config to mark as achieved
    const updatedBonusConfig = await InvitationBonus.findByIdAndUpdate(
      bonusConfig._id,
      {
        $push: {
          achievedBy: {
            userId: userId,
            achievedAt: new Date(),
          },
        },
      },
      { new: true }
    );

    if (!updatedBonusConfig) {
      console.log("Failed to update bonus achievement status");
      return res.status(500).json({ message: "Failed to process bonus" });
    }

    // Log wallet amount before update
    console.log(
      `User ${userId} wallet amount before bonus: ₹${user.walletAmount}`
    );

    // Calculate new wallet amount
    const newWalletAmount = user.walletAmount + bonusConfig.bonusAmount;

    console.log(`Bonus amount to be added: ₹${bonusConfig.bonusAmount}`);
    console.log(`Calculated new wallet amount: ₹${newWalletAmount}`);

    // Update user's wallet amount in the database
    const updatedUser = await User.findByIdAndUpdate(
      userId,
      { $set: { walletAmount: newWalletAmount } },
      { new: true }
    );

    if (!updatedUser) {
      console.log(`Failed to update wallet amount for user ${userId}`);
      return res
        .status(500)
        .json({ message: "Failed to update wallet amount" });
    }

    addTransactionDetails(
      userId,
      bonusConfig.bonusAmount,
      `Invitation Bonus`,
      new Date()
    );

    console.log(
      `User ${userId} wallet amount after bonus: ₹${updatedUser.walletAmount}`
    );

    console.log(
      `Successfully awarded bonus to user ${userId} for level ${bonusConfig.minSubordinates}`
    );

    return res.status(200).json({
      message: `Congratulations! You have qualified for the referral bonus level ${bonusConfig.minSubordinates}.`,
      bonusAmount: bonusConfig.bonusAmount,
      newWalletAmount: updatedUser.walletAmount,
      qualifyingReferrals: qualifyingReferrals.map((ref) => ({
        uid: ref.uid,
        userId: ref.userId,
        totalDeposit: ref.totalDeposit,
      })),
    });
  } catch (error) {
    console.error("Error processing referral bonus:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
});

// Helper function to get referral deposit status with error handling
async function getReferralDepositStatus(referral) {
  try {
    const referredUser = await User.findOne({ uid: referral.uid });
    if (!referredUser) {
      console.log(`[WARN] Referred user not found for UID: ${referral.uid}`);
      return null;
    }

    const deposits = await DepositHistory.aggregate([
      {
        $match: {
          userId: referredUser._id,
          depositStatus: "completed",
        },
      },
      {
        $group: {
          _id: "$userId",
          totalDeposit: { $sum: "$depositAmount" },
          lastDepositDate: { $max: "$createdAt" },
        },
      },
    ]);

    return {
      uid: referral.uid,
      userId: referredUser._id,
      username: referredUser.username,
      totalDeposit: deposits[0]?.totalDeposit || 0,
      lastDepositDate: deposits[0]?.lastDepositDate || null,
    };
  } catch (error) {
    console.error(
      `[ERROR] Failed to get deposit status for referral ${referral.uid}:`,
      error
    );
    return null;
  }
}

router.get("/check-eligibility-status", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    console.log(`[DEBUG] Checking eligibility status for user: ${userId}`);

    const user = await User.findById(userId);
    if (!user) {
      console.log(`[ERROR] User not found: ${userId}`);
      return res.status(404).json({ message: "User not found" });
    }
    console.log(`[DEBUG] User found: ${user.username}`);

    const allBonusConfigs = await InvitationBonus.find().sort({
      minSubordinates: 1,
    });
    console.log(`[DEBUG] Found ${allBonusConfigs.length} bonus configurations`);

    const level1Referrals =
      user.referredUsers?.filter((ref) => ref.level === 1) || [];
    console.log(`[DEBUG] User has ${level1Referrals.length} level 1 referrals`);

    // Get deposit status for each referral
    const referralStatuses = await Promise.all(
      level1Referrals.map(getReferralDepositStatus)
    ).then((statuses) => statuses.filter((status) => status !== null));
    console.log(
      `[DEBUG] Processed ${referralStatuses.length} valid referral statuses`
    );

    const bonusDetails = await Promise.all(
      allBonusConfigs.map(async (config) => {
        const achieved = config.achievedBy.some(
          (achievement) => achievement.userId.toString() === userId.toString()
        );

        const qualifyingReferrals = referralStatuses.filter(
          (status) => status.totalDeposit >= config.minDepositAmount
        );

        console.log(
          `[DEBUG] Bonus level ${config.minSubordinates}: ${qualifyingReferrals.length} qualifying referrals`
        );

        return {
          level: config.minSubordinates,
          minDepositAmount: config.minDepositAmount,
          bonusAmount: config.bonusAmount,
          achieved,
          achievementDate: achieved
            ? config.achievedBy.find(
                (a) => a.userId.toString() === userId.toString()
              ).achievedAt
            : null,
          qualifyingReferrals: qualifyingReferrals.length,
          qualifyingReferralDetails: qualifyingReferrals.map((ref) => ({
            uid: ref.uid,
            username: ref.username,
            totalDeposit: ref.totalDeposit,
            lastDepositDate: ref.lastDepositDate,
          })),
          progress: {
            referrals: {
              total: referralStatuses.length,
              required: config.minSubordinates,
              qualifying: qualifyingReferrals.length,
            },
          },
        };
      })
    );

    const currentLevel = bonusDetails.filter(
      (detail) => detail.achieved
    ).length;
    console.log(`[DEBUG] User's current bonus level: ${currentLevel}`);

    const nextLevel = bonusDetails.find((detail) => !detail.achieved);

    const response = {
      userId: user._id,
      username: user.username,
      currentLevel,
      totalReferrals: level1Referrals.length,
      qualifyingReferrals: referralStatuses.filter(
        (status) => status.totalDeposit > 0
      ).length,
      bonusDetails,
      nextLevel: nextLevel
        ? {
            level: nextLevel.level,
            minDepositAmount: nextLevel.minDepositAmount,
            bonusAmount: nextLevel.bonusAmount,
            progress: nextLevel.progress,
            qualifyingReferralDetails: nextLevel.qualifyingReferralDetails,
          }
        : null,
      allReferralStatuses: referralStatuses.map((status) => ({
        uid: status.uid,
        userId: status.userId,
        username: status.username,
        totalDeposit: status.totalDeposit,
        lastDepositDate: status.lastDepositDate,
        qualifiesForNextLevel:
          status.totalDeposit >= (nextLevel ? nextLevel.minDepositAmount : 0),
      })),
    };

    console.log(`[DEBUG] Final response:`, JSON.stringify(response, null, 2));

    return res.status(200).json(response);
  } catch (error) {
    console.error("[ERROR] Error checking eligibility status:", error);
    return res
      .status(500)
      .json({ message: "Internal server error", error: error.message });
  }
});

// Route to fetch VIP history of a user
router.get("/vip-history", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user ID from token

    console.log(`Fetching VIP history for userId: ${userId}`);

    // Find all VIP history entries for the user
    const vipHistories = await VIPHistory.find({ userId: userId });

    if (!vipHistories || vipHistories.length === 0) {
      console.log(`No VIP history found for userId: ${userId}`);
      return res.status(404).json({
        success: false,
        message: "No VIP history found for this user.",
      });
    }

    // Create a formatted response based on the VIP history type
    const response = vipHistories.map((history) => {
      let message = "";
      let header = "";

      if (history.type === "levelUpdate") {
        header = "New VIP Unlocked";
        message = `You have achieved the ${history.levelAchieved} level with a one-time bonus of ${history.oneTimeBonus}.`;
      } else if (history.type === "monthlyUpdate") {
        header = "Monthly Bonus Awarded";
        message = `You have received a monthly bonus of ${history.monthlyBonus} for being a ${history.levelAchieved} VIP.`;
      }

      return {
        header,
        message,
        levelAchieved: history.levelAchieved,
        achievedAt: history.achievedAt,
        oneTimeBonus: history.oneTimeBonus,
        monthlyBonus: history.monthlyBonus,
        rebatePercentage: history.rebatePercentage,
        details: history.details,
        type: history.type,
      };
    });

    // Sort response by achievedAt in descending order
    response.sort((a, b) => new Date(b.achievedAt) - new Date(a.achievedAt));

    console.log(`VIP histories for userId: ${userId} fetched successfully.`);

    // Send the formatted response
    return res.status(200).json({
      success: true,
      vipHistories: response,
    });
  } catch (error) {
    console.error(
      `Error fetching VIP history for userId: ${req.user._id}`,
      error
    );
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

// Update bank details and TRXAddress for a user
router.put("/users/:id/update-details", auth, isAdmin, async (req, res) => {
  try {
    const { bankDetails, TRXAddress } = req.body;
    const userId = req.params.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ error: "User not found" });
    }

    // Update bank details
    if (bankDetails) {
      user.bankDetails = bankDetails;
    }

    // Update TRXAddress
    if (TRXAddress) {
      user.TRXAddress = TRXAddress;
    }

    await user.save();
    res
      .status(200)
      .send({ message: "User details updated successfully", user });
  } catch (e) {
    res
      .status(400)
      .send({ error: "Failed to update user details", details: e.message });
  }
});

router.get("/user", auth, async (req, res) => {
  const userId = req.user._id;
  if (!userId) {
    return res.status(400).send({ message: "No user ID in cookies" });
  }

  try {
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }

    // Aggregate bets for Wingo (unchanged)
    const wingoBetAggregation = await Bet.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: null,
          totalBets: { $sum: { $multiply: ["$betAmount", "$multiplier"] } },
          betCount: { $sum: 1 },
        },
      },
    ]);

    // Updated aggregation for TRX bets including tax
    const trxBetAggregation = await TrxBet.aggregate([
      { $match: { userId: userId } },
      {
        $group: {
          _id: "$userId",
          totalAmountOfBets: { $sum: { $add: ["$totalBet", "$tax"] } },
          betCount: { $sum: 1 },
        },
      },
    ]);

    // Updated aggregation for K3 bets including tax
    const k3BetAggregation = await K3Bets.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$user",
          totalAmountOfBets: { $sum: { $add: ["$totalBet", "$tax"] } },
          betCount: { $sum: 1 },
        },
      },
    ]);

    // Calculate total bets and bet counts
    const wingoBets =
      wingoBetAggregation.length > 0 ? wingoBetAggregation[0].totalBets : 0;
    const trxBets =
      trxBetAggregation.length > 0 ? trxBetAggregation[0].totalAmountOfBets : 0;
    const k3Bets =
      k3BetAggregation.length > 0 ? k3BetAggregation[0].totalAmountOfBets : 0;

    const wingoBetCount =
      wingoBetAggregation.length > 0 ? wingoBetAggregation[0].betCount : 0;
    const trxBetCount =
      trxBetAggregation.length > 0 ? trxBetAggregation[0].betCount : 0;
    const k3BetCount =
      k3BetAggregation.length > 0 ? k3BetAggregation[0].betCount : 0;

    const totalBets = wingoBets + trxBets + k3Bets;
    const totalBetCount = wingoBetCount + trxBetCount + k3BetCount;

    // Prepare the response object
    const response = {
      user,
      bets: {
        total: totalBets,
        totalCount: totalBetCount,
        wingo: { total: wingoBets, count: wingoBetCount },
        trx: { total: trxBets, count: trxBetCount },
        k3: { total: k3Bets, count: k3BetCount },
      },
    };

    res.send(response);
  } catch (error) {
    console.error("Error fetching user data:", error);
    res.status(500).send({ message: "Internal server error" });
  }
});

router.get("/fetchuserdetails", auth, isAdmin, async (req, res) => {
  try {
    const users = await User.find();
    if (!users.length) {
      res.status(404).json({
        sucess: false,
        message: "No user found",
      });
    }
    res.status(200).json({
      sucess: true,
      message: "Here is the Details",
      users,
    });
  } catch (error) {
    res.status(500).json({
      sucess: false,
      message: "server error",
      error: error.message,
    });
  }
});

router.delete("/deleteuser", auth, isAdmin, async (req, res) => {
  try {
    const { mobile } = req.body;
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter the mobile number",
      });
    }

    let user = await User.findOne({ mobile: mobile });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided mobile number",
      });
    }

    user.locked = true;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Locked Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

router.put("/unlockuser", auth, isAdmin, async (req, res) => {
  try {
    console.log("Hitted");
    const { mobile } = req.body;
    console.log(mobile);
    if (!mobile) {
      return res.status(400).json({
        success: false,
        message: "Please enter the mobile number",
      });
    }

    let user = await User.findOne({ mobile: mobile });
    console.log("user----->", user);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found with the provided mobile number",
      });
    }

    user.locked = false;
    await user.save();

    res.status(200).json({
      success: true,
      message: "User Unlocked Successfully",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
});

function generateUsername() {
  const randomNumbers = Math.floor(Math.random() * 10000);
  const randomAlphabets = Math.random()
    .toString(36)
    .substring(2, 5)
    .toUpperCase();
  return `MEMBER${randomNumbers}${randomAlphabets}`;
}

function generateInviteCode() {
  return Math.floor(100000000000 + Math.random() * 900000000000);
}

function generateUID() {
  return Math.floor(100000 + Math.random() * 900000);
}

function generateReferralLink(req, invitationCode) {
  let baseUrl = req.protocol + "://" + req.get("host");
  return `${baseUrl}/register?invitecode=${invitationCode}`;
}

function generateProfilePicture(req) {
  const randomNumber = Math.floor(Math.random() * 6) + 1;
  let baseUrl = req.protocol + "://" + req.get("host");
  return `${baseUrl}/${randomNumber}.jpg`;
}

// Endpoint for admin to register a new user
router.post("/re-register", auth, isAdmin, async (req, res) => {
  try {
    // Extract data from request body
    const { mobile, password, accountType = "Normal" } = req.body;

    // Check if mobile and password are provided
    if (!mobile || !password) {
      return res
        .status(400)
        .json({ msg: "Mobile and password are required fields" });
    }

    // Check if the requesting user is an admin
    if (req.user.accountType !== "Admin") {
      return res
        .status(403)
        .json({ msg: "Unauthorized: Only admins can register new users" });
    }

    // Check if user already exists with the provided mobile number
    const existingUser = await User.findOne({ mobile });
    if (existingUser) {
      return res.status(400).json({ msg: "User already exists" });
    }

    // Hash the password
    const encryptedPassword = await bcrypt.hash(password, 10);

    // Generate user data
    const invitationCode = generateInviteCode();
    const userData = {
      mobile,
      password: encryptedPassword,
      username: generateUsername(),
      invitationCode,
      uid: generateUID(),
      accountType,
      referralLink: generateReferralLink(req, invitationCode),
      avatar: generateProfilePicture(req),
    };

    // Register the new user
    const newUser = new User(userData);
    await newUser.save();

    // Generate JWT token for the new user
    const token = jwt.sign({ id: newUser._id }, process.env.JWT_SECRET, {
      expiresIn: 3600,
    });
    newUser.token = token;
    newUser.password = undefined;

    // Return success response
    res.status(200).json({
      success: true,
      message: "User registered successfully",
      user: newUser,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Endpoint to update username
router.put("/user/username", auth, async (req, res) => {
  const { username } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.username = username || user.username;

    await user.save();

    res.json({ message: "Username updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

// Endpoint to update avatar
router.put("/user/avatar", auth, async (req, res) => {
  const { avatar } = req.body;

  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.avatar = avatar || user.avatar;

    await user.save();

    res.json({ message: "Avatar updated successfully", user });
  } catch (error) {
    res.status(500).json({ message: "An error occurred", error });
  }
});

router.get("/user-profile/:userId", auth, isAdmin, async (req, res) => {
  const { userId } = req.params;

  try {
    const depositHistory = await DepositHistory.find({ userId });
    const bets = await Bet.find({ userId });
    const withdraws = await Withdraw.find({ userId });

    // Fetch user details
    const user = await User.findById(userId).populate("referredUsers");
    const { bankDetails, walletAmount } = user;

    // Extract mobile numbers from referred users
    const referredUserMobiles = user.referredUsers.map(
      (referredUser) => referredUser.mobile
    );

    // Sum up all values in one from all objects in teamSubordinates and directSubordinates
    const sumValues = (subordinates) => {
      return subordinates.reduce(
        (acc, curr) => {
          acc.noOfRegister += curr.noOfRegister;
          acc.depositNumber += curr.depositNumber;
          acc.depositAmount += curr.depositAmount;
          acc.firstDeposit += curr.firstDeposit;
          return acc;
        },
        { noOfRegister: 0, depositNumber: 0, depositAmount: 0, firstDeposit: 0 }
      );
    };

    const teamSubordinates = sumValues(user.teamSubordinates);
    const directSubordinates = sumValues(user.directSubordinates);

    const sumCommissionByLevel = user.commissionRecords.reduce((acc, curr) => {
      acc[`level${curr.level}`] =
        (acc[`level${curr.level}`] || 0) + curr.commission;
      return acc;
    }, {});

    res.json({
      depositHistory,
      bets,
      withdraws,
      bankDetails,
      teamSubordinates,
      directSubordinates,
      walletAmount,
      referredUserMobiles,
      commission: sumCommissionByLevel,
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/latest-bet-sums", auth, isAdmin, async (req, res) => {
  try {
    const timers = ["30sec", "1min", "3min", "5min"];
    const betSums = {};

    for (const timer of timers) {
      const periodId = await getLatestPeriodId(timer);
      const bets = await Bets.find({
        periodId,
        userType: { $ne: "Restricted" },
      });

      const numberBetSums = Array.from({ length: 10 }, (_, i) => ({
        number: i.toString(),
        totalBet: 0,
      }));
      const sizeBetSums = { big: 0, small: 0 };
      const colorBetSums = { green: 0, red: 0, violet: 0 };

      bets.forEach((bet) => {
        if (/^[0-9]$/.test(bet.selectedItem)) {
          numberBetSums[parseInt(bet.selectedItem)].totalBet += bet.totalBet;
        } else if (bet.selectedItem in sizeBetSums) {
          sizeBetSums[bet.selectedItem] += bet.totalBet;
        } else if (bet.selectedItem in colorBetSums) {
          colorBetSums[bet.selectedItem] += bet.totalBet;
        }
      });
      betSums[timer] = { periodId, numberBetSums, sizeBetSums, colorBetSums };
    }
    res.json(betSums);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/latest-k3-bet-sums", auth, isAdmin, async (req, res) => {
  try {
    const timer = req.query.timer; // Get the selected timer from query parameters
    const periodId = await getLatestPeriodId(timer); // Retrieve the latest periodId based on the timer

    if (!periodId) {
      return res
        .status(400)
        .json({ message: "Invalid timer or periodId not found." });
    }

    // Fetch bets for the specified periodId and timer
    const k3Bets = await K3Bets.find({
      periodId,
      selectedTimer: timer,
      userType: { $ne: "Restricted" },
    });

    // Initialize totals for each option
    const totals = {
      totalSum: 0,
      twoSameOneDifferent: 0,
      threeSame: 0,
      threeDifferentNumbers: 0,
    };

    // Iterate through bets and aggregate totals
    k3Bets.forEach((bet) => {
      const betAmount = bet.totalBet;

      // Check if the totalSum field is non-zero and add it to the total
      if (bet.totalSum > 0) {
        totals.totalSum += betAmount;
      }

      // Check if twoSameOneDifferent is a valid array with exactly 3 elements
      if (
        Array.isArray(bet.twoSameOneDifferent) &&
        bet.twoSameOneDifferent.length === 2
      ) {
        totals.twoSameOneDifferent += betAmount;
      }

      // Check if threeSame is a valid array with exactly 3 elements
      if (Array.isArray(bet.threeSame) && bet.threeSame.length === 3) {
        totals.threeSame += betAmount;
      }

      // Check if threeDifferentNumbers is a valid array with exactly 3 elements
      if (
        Array.isArray(bet.threeDifferentNumbers) &&
        bet.threeDifferentNumbers.length === 1
      ) {
        totals.threeDifferentNumbers += betAmount;
      }
    });

    // Send the results as a JSON response
    res.json({ periodId, totals });
  } catch (err) {
    // Handle unexpected errors
    console.error(err);
    res.status(500).json({ message: err.message });
  }
});

router.put("/updateWallet", async (req, res) => {
  const { uid, amount, action, reason } = req.body;

  try {
    const user = await User.findOne({ uid: uid });
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (action === "increase") {
      user.walletAmount += amount;
    } else if (action === "decrease") {
      user.walletAmount -= amount;
    } else {
      return res.status(400).json({ message: "Invalid action" });
    }

    await user.save();

    addTransactionDetails(user._id, amount, reason, new Date());
    console.log(
      `Wallet amount ${action}d successfully  ${reason} for user ${uid}`
    );

    res.json({ message: `Wallet amount ${action}d successfully` });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/settings-withdraw", async (req, res) => {
  try {
    console.log("setting-withdraw", req.query);
    const isUsdtOn = req.query.isUsdtOn === "true"; // Convert to boolean

    let settings;
    if (isUsdtOn) {
      settings = await UsdtSettings.findOne();
    } else {
      settings = await Settings.findOne();
    }

    res.json(settings);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.put("/settings-modify-withdrawl", auth, async (req, res) => {
  try {
    const {
      isUsdt,
      withdrawalStartHour,
      withdrawalStartPeriod,
      withdrawalEndHour,
      withdrawalEndPeriod,
      maxWithdrawRequestsPerDay,
      minWithdrawAmount,
      maxWithdrawAmount,
    } = req.body;

    const update = {};
    update.isUsdt = isUsdt;
    if (withdrawalStartHour !== undefined)
      update.withdrawalStartHour = withdrawalStartHour;
    if (withdrawalStartPeriod !== undefined)
      update.withdrawalStartPeriod = withdrawalStartPeriod;
    if (withdrawalEndHour !== undefined)
      update.withdrawalEndHour = withdrawalEndHour;
    if (withdrawalEndPeriod !== undefined)
      update.withdrawalEndPeriod = withdrawalEndPeriod;
    if (maxWithdrawRequestsPerDay !== undefined)
      update.maxWithdrawRequestsPerDay = maxWithdrawRequestsPerDay;
    if (minWithdrawAmount !== undefined)
      update.minWithdrawAmount = minWithdrawAmount;
    if (maxWithdrawAmount !== undefined)
      update.maxWithdrawAmount = maxWithdrawAmount;

    if (isUsdt) {
      const usdtSettings = await UsdtSettings.findOneAndUpdate({}, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
      res.json(usdtSettings);
    } else {
      const settings = await Settings.findOneAndUpdate({}, update, {
        new: true,
        upsert: true,
        setDefaultsOnInsert: true,
      });
      res.json(settings);
    }
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

router.get("/completed_withdraws_sum", auth, async (req, res) => {
  try {
    let user = req.user._id;
    const result = await Withdraw.aggregate([
      { $match: { userId: user, status: "Completed" } },
      { $group: { _id: null, total: { $sum: "$balance" } } },
    ]);
    console.log(result);
    const totalBalance = result.length > 0 ? result[0].total : 0;
    res.json({ totalBalance });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Mock endpoint to fetch user details
router.get("/api/users/:userId", async (req, res) => {
  console.log("Inside this block");
  const userId = req.params.userId;
  console.log("userId", userId);

  try {
    // Simulate fetching user details from database
    const user = await User.find({ _id: userId });
    console.log("user-->", user);

    if (!user) {
      return res
        .status(404)
        .json({ success: false, message: "User not found" });
    }

    const userData = {
      userId: user[0]._id,
      username: user[0].username,
      walletAmount: user[0].walletAmount, // Assuming this is a field in your User model
      // Add other user details as needed
    };

    // Mock response with user details
    res.status(200).json({
      success: true,
      data: userData,
    });
  } catch (error) {
    console.error("Error fetching user details:", error);
    res.status(500).json({ success: false, error: "Internal server error" });
  }
});

module.exports = router;
