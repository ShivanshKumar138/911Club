const express = require("express");
const router = express.Router();
const mongoose = require('mongoose');
const User = require("../../models/userModel");
const auth = require("../../middlewares/auth");
const {
  isAdmin,
  isNormal,
  isRestricted,
} = require("../../middlewares/roleSpecificMiddleware");
require("dotenv").config();
const TransactionHistory = require("../../models/TransictionHistory");
const Transaction = require("../../models/TransictionHistory");
const CommissionRates = require("../../models/betCommissionLevel");
const DepositHistory = require("../../models/depositHistoryModel");
const Rebate = require('../../models/RebateSchema')
const moment = require("moment")
const Withdraw = require("../../models/withdrawModel"); // Add this line to import the Withdraw model

// Endpoint to get total bets placed by the authenticated user for the day
router.get('/user/todays/total-bets', auth, async (req, res) => {
  try {
    const userId = req.user.id; // Get user ID from auth middleware
    console.log(`User ID from auth middleware: ${userId}`);

    // Get the start and end of the current day
    const startOfDay = moment().startOf('day').toDate();
    const endOfDay = moment().endOf('day').toDate();
    console.log(`Start of Day: ${startOfDay}`);
    console.log(`End of Day: ${endOfDay}`);

    // Fetch all transactions for the user on the current day
    const transactions = await TransactionHistory.find({
      user:userId, // Ensure ObjectId conversion
      date: { $gte: startOfDay, $lt: endOfDay }
    });

    console.log(`Fetched Transactions: ${JSON.stringify(transactions)}`);

    // Filter transactions by type and compute total bet amount
    const filteredTransactions = transactions.filter(transaction =>
      ["WingoBet", "K3Bet", "TRXBet"].includes(transaction.type)
    );
    console.log(`Filtered Transactions: ${JSON.stringify(filteredTransactions)}`);

    const totalBetAmount = filteredTransactions.reduce((total, transaction) => total + transaction.betAmount, 0);
    console.log(`Total Bet Amount: ${totalBetAmount}`);

    return res.status(200).json({ totalBetAmount });
  } catch (error) {
    console.error('Error fetching total bets:', error);
    return res.status(500).json({ msg: 'Error fetching total bets', error });
  }
});


// GET API to fetch the total rebate amount for the authenticated user
router.get('/rebate', auth, async (req, res) => {
  try {
    const userId = req.user._id; // Fetch the user ID from the auth middleware

    // Get today's start and end date
    const startOfDay = new Date();
    startOfDay.setHours(0, 0, 0, 0); // Set the time to 00:00:00

    const endOfDay = new Date();
    endOfDay.setHours(23, 59, 59, 999); // Set the time to 23:59:59

    // Find the most recent rebate for the authenticated user
    const recentRebate = await Rebate.findOne({ userId: userId })
      .sort({ date: -1 }) // Sort by date in descending order to get the most recent
      .limit(1); // Limit to one document to get the latest one

    // Aggregate and sum up the rebateAmount for today for the authenticated user
    const todayRebate = await Rebate.aggregate([
      {
        $match: {
          userId: userId,
          date: {
            $gte: startOfDay,
            $lte: endOfDay,
          },
        },
      },
      {
        $group: {
          _id: null,
          totalRebateAmount: { $sum: '$rebateAmount' },
        },
      },
    ]);

    // Aggregate and sum up the total rebateAmount for the authenticated user
    const totalRebate = await Rebate.aggregate([
      {
        $match: { userId: userId },
      },
      {
        $group: {
          _id: null,
          totalRebateAmount: { $sum: '$rebateAmount' },
        },
      },
    ]);

    // Find all rebate history for the authenticated user
    const rebateHistory = await Rebate.find({ userId: userId })
      .sort({ date: -1 }); // Sort by date in descending order to get recent records first

    // Extract the rebate amounts from the aggregation results
    const todayRebateAmount = todayRebate.length > 0 ? todayRebate[0].totalRebateAmount : 0;
    const totalRebateAmount = totalRebate.length > 0 ? totalRebate[0].totalRebateAmount : 0;

    // Extract the rebatePercentage from the most recent rebate, if it exists
    const rebatePercentage = recentRebate ? recentRebate.rebatePercentage : 0;

    res.status(200).json({
      success: true,
      todayRebateAmount: todayRebateAmount,
      totalRebateAmount: totalRebateAmount,
      rebatePercentage: rebatePercentage,
      rebateHistory: rebateHistory,
    });
  } catch (error) {
    console.error('Error fetching rebate amounts:', error);
    res.status(500).json({
      success: false,
      message: 'Server Error',
    });
  }
});



router.get("/total-registrations", auth, async (req, res) => {
  try {
    const userDetails = await User.find();
    if (!userDetails) {
      console.log("No user found in the DB");
    }
    let count = userDetails.length;
    res.status(200).json({
      count: count,
      success: true,
      message: "data fetched succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// have to add auth middleware
router.get("/todays-registrations", async (req, res) => {
  try {
    const twentyFourHoursAgo = new Date(new Date() - 24 * 60 * 60 * 1000);

    const registrations = await User.find({
      registrationDate: { $gte: twentyFourHoursAgo },
    });

    let count = registrations.length;
    res.status(200).json({
      success: true,
      countOfDailyUsers: count,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Internal Server Error" });
  }
});

router.get("/user-balance", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const userDetails = await User.find({ _id: userId });
    if (!userDetails) {
      console.log("No user found in the DB");
    }

    let totalAmount = 0;
    for (let i = 0; i < userDetails.length; i++) {
      totalAmount = totalAmount + userDetails[i].walletAmount;
    }
    res.status(200).json({
      walletAmount: totalAmount,
      success: true,
      message: "data fetched succesfully",
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Admin endpoint to get total wallet amount and count of Normal users
router.get(
  "/admin/normal-users-wallet-summary",
  auth,
  isAdmin,
  async (req, res) => {
    try {
      const users = await User.find({ accountType: "Normal" });

      // Calculate total wallet amount and user count
      const totalWalletAmount = users.reduce(
        (acc, user) => acc + user.walletAmount,
        0
      );
      const userCount = users.length;

      res.status(200).json({
        totalWalletAmount,
        userCount,
        success: true,
        message: "Data fetched successfully",
      });
    } catch (err) {
      console.log(err);
      res.status(500).json({ msg: "Server Error" });
    }
  }
);

router.get("/commission-history", auth, async (req, res) => {
  try {
    const userId = req.user._id;
    const allowedGameTypes = ["wingo", "5d", "k3", "trx"];

    const endDate = new Date();
    const startDate = new Date();
    startDate.setDate(endDate.getDate() - 7);

    const yesterdayStart = new Date();
    yesterdayStart.setDate(endDate.getDate() - 1);
    yesterdayStart.setHours(0, 0, 0, 0);

    const yesterdayEnd = new Date();
    yesterdayEnd.setDate(endDate.getDate() - 1);
    yesterdayEnd.setHours(23, 59, 59, 999);

    console.log(`User ID: ${userId}`);
    console.log(
      `Fetching commission history from: ${startDate.toISOString()} to ${endDate.toISOString()}`
    );
    console.log(
      `Fetching yesterday's commission history from: ${yesterdayStart.toISOString()} to ${yesterdayEnd.toISOString()}`
    );

    const commissionHistories = await TransactionHistory.find({
      user: userId,
      type: "commission",
      date: { $gte: startDate, $lte: endDate },
    }).sort({ date: -1 });

    console.log(`Commission histories found: ${commissionHistories.length}`);

    if (!commissionHistories.length) {
      console.warn(
        "No commission history found for this user during the specified dates."
      );
      return res.status(200).json({
        groupedByDate: {},
        previousWeekCommissionTotal: 0,
        lifetimeCommission: 0,
        yesterdayCommissionTotal: 0,
        totalGameGeneratedCommission: 0,
        commissionHistories: [],
      });
    }

    const commissionFromUserIds = [
      ...new Set(commissionHistories.map((item) => item.commissionFromUser)),
    ];

    console.log(
      `Unique commissionFromUser IDs: ${commissionFromUserIds.join(", ")}`
    );

    const users = await User.find(
      { _id: { $in: commissionFromUserIds } },
      "uid"
    );

    console.log(`Fetched UIDs: ${users.map((user) => user.uid).join(", ")}`);

    const userMap = users.reduce((acc, user) => {
      acc[user._id] = user.uid;
      return acc;
    }, {});

    const groupedByDate = commissionHistories.reduce((acc, history) => {
      const dateStr = history.date.toISOString().split("T")[0];
      const level = `l${history.commissionLevel}`;

      if (!acc[dateStr]) {
        acc[dateStr] = {
          commissionHistories: [],
          levelCommissionTotals: {},
          levelBetTotals: {},
          levelCommissionGames: {},
          totalGameGeneratedCommission: 0,
        };
      }

      acc[dateStr].commissionHistories.push({
        ...history.toObject(),
        commissionFromUserDetails: {
          uid: userMap[history.commissionFromUser] || null,
        },
      });

      console.log(
        `Processing history for date: ${dateStr}, level: ${level}, amount: ${history.amount}`
      );

      if (!acc[dateStr].levelCommissionTotals[level]) {
        acc[dateStr].levelCommissionTotals[level] = { amount: 0 };
      }
      acc[dateStr].levelCommissionTotals[level].amount += history.amount || 0;

      if (allowedGameTypes.includes(history.gameType) && history.betAmount) {
        if (!acc[dateStr].levelBetTotals[level]) {
          acc[dateStr].levelBetTotals[level] = { amount: 0 };
        }
        acc[dateStr].levelBetTotals[level].amount += history.betAmount || 0;
      }

      if (allowedGameTypes.includes(history.gameType) && history.amount) {
        if (!acc[dateStr].levelCommissionGames[level]) {
          acc[dateStr].levelCommissionGames[level] = { amount: 0 };
        }
        acc[dateStr].levelCommissionGames[level].amount += history.amount || 0;
        acc[dateStr].totalGameGeneratedCommission += history.amount || 0;
      }

      return acc;
    }, {});

    const previousWeekCommissionTotal = commissionHistories.reduce(
      (total, history) => total + (history.amount || 0),
      0
    );

    console.log(
      `Total commission for the previous week: ${previousWeekCommissionTotal}`
    );

    const lifetimeCommission = await TransactionHistory.aggregate([
      { $match: { user: userId, type: "commission" } },
      { $group: { _id: null, total: { $sum: "$amount" } } },
    ]);

    const lifetimeCommissionAmount =
      lifetimeCommission.length > 0 ? lifetimeCommission[0].total : 0;

    console.log(`Lifetime commission amount: ${lifetimeCommissionAmount}`);

    // Calculate yesterday's commission total
    const yesterdayCommissionTotal = commissionHistories
      .filter(
        (history) =>
          history.date >= yesterdayStart && history.date <= yesterdayEnd
      )
      .reduce((total, history) => total + (history.amount || 0), 0);

    console.log(`Yesterday's commission total: ${yesterdayCommissionTotal}`);

    const commissionHistoriesWithUID = commissionHistories.map((history) => ({
      ...history.toObject(),
      commissionFromUserDetails: {
        uid: userMap[history.commissionFromUser] || null,
      },
    }));

    console.log(
      "Final grouped data by date:",
      JSON.stringify(groupedByDate, null, 2)
    );

    res.status(200).json({
      groupedByDate,
      previousWeekCommissionTotal,
      lifetimeCommission: lifetimeCommissionAmount,
      yesterdayCommissionTotal,
      totalGameGeneratedCommission: Object.values(groupedByDate).reduce(
        (total, dateData) => total + dateData.totalGameGeneratedCommission,
        0
      ),
      commissionHistories: commissionHistoriesWithUID,
    });
  } catch (err) {
    console.error("Error fetching commission history:", err.stack || err);
    res.status(500).json({ msg: "Server error" });
  }
});


// Endpoint to get subordinate details
router.get("/subordinate-details", auth, async (req, res) => {
  try {
    const supervisorId = req.user._id; // Assuming supervisor ID is stored in req.user

    // Find the user by their ID
    const user = await User.findById(supervisorId).exec();

    if (!user) {
      return res.status(404).json({ msg: "User not found" });
    }

    // Extract referred users and classify them as direct or team subordinates
    const subordinates = await Promise.all(user.referredUsers.map(async (sub) => {
      const subordinateUser = await User.findOne({ uid: sub.uid }).exec();
      if (!subordinateUser) {
        return {
          mobile: sub.mobile || null,
          uid: sub.uid || null,
          registrationDate: sub.date || null,
          isDirect: sub.level === 1,
          totalDepositAmount: 0
        };
      }

      const totalDepositAmount = await DepositHistory.aggregate([
        { $match: { userId: subordinateUser._id, depositStatus: "completed" } },
        { $group: { _id: null, total: { $sum: "$depositAmount" } } }
      ]);

      return {
        mobile: sub.mobile || null,
        uid: sub.uid || null,
        registrationDate: sub.date || null,
        isDirect: sub.level === 1,
        totalDepositAmount: totalDepositAmount.length > 0 ? totalDepositAmount[0].total : 0
      };
    }));

    // Return the subordinate details
    res.status(200).json({
      subordinates,
    });
  } catch (err) {
    console.error("Error fetching subordinate details:", err);
    res.status(500).json({ msg: "Server error" });
  }
});




// Endpoint to get deposit history details
router.get('/deposit-history', auth, async (req, res) => {
  try {
    console.log('Fetching deposit history...');
    
    const userId = req.user._id; // Assuming user ID is stored in req.user
    console.log('Authenticated user ID:', userId);

    // Find deposit history by user ID and sort by depositDate in descending order
    const deposits = await DepositHistory.find({ userId })
      .sort({ depositDate: -1 }) // Sorts by depositDate in descending order
      .exec();
    console.log('Deposits found:', deposits);

    // Map deposit history to the desired format
    const depositDetails = deposits.map((deposit) => ({
      depositAmount: deposit.depositAmount || null,
      depositDate: deposit.depositDate || null,
      depositStatus: deposit.depositStatus || null,
      depositId: deposit.depositId || null,
      depositMethod: deposit.depositMethod || null,
    }));
    console.log('Formatted deposit details:', depositDetails);

    // Return the deposit history details or an empty array if none found
    res.status(200).json({
      depositHistory: depositDetails,
    });
  } catch (err) {
    console.error('Error fetching deposit history:', err);
    res.status(500).json({ msg: 'Server error' });
  }
});



router.get("/api/admin/subordinates-summary", auth, isAdmin, async (req, res) => {
  try {
    // Fetch all users
    const users = await User.find({}, "_id uid referredUsers").lean();

    if (!users.length) {
      console.log("No users found.");
      return res.json({ usersSummary: [] });
    }

    const allUsersSummary = await Promise.all(users.map(async (user) => {
      const userId = user._id;
      const uids = user.referredUsers.map((subordinate) => subordinate.uid);

      // Fetch all users based on uids
      const referredUsers = await User.find({ uid: { $in: uids } }, "_id uid referredUsers").lean();

      // Map uid to _id for quick lookup
      const uidToIdMap = referredUsers.reduce((acc, u) => {
        acc[u.uid] = u._id;
        return acc;
      }, {});

      // Fetch all deposit transactions for the subordinates
      const allDepositTransactions = await TransactionHistory.find({
        user: { $in: Object.values(uidToIdMap) },
        type: "deposit",
      })
        .sort({ date: 1 })
        .lean();

      // Fetch all betting transactions for the subordinates filtered by types
      const betTypes = ["WingoBet", "TRXBet", "K3Bet", "5DBet"];
      const allBetTransactions = await TransactionHistory.find({
        user: { $in: Object.values(uidToIdMap) },
        type: { $in: betTypes },
      }).lean();

      // Fetch all withdrawal transactions for the subordinates where status is "Completed"
      const allWithdrawalTransactions = await Withdraw.find({
        userId: { $in: Object.values(uidToIdMap) },
        status: "Completed",
      }).lean();

      // Track users who have already made a deposit and their first deposit amounts
      const usersWhoMadeDeposit = new Set();
      const firstDepositAmounts = {}; // To store the amount of each user's first deposit

      // Group transactions by date and calculate total deposit count, amount, first-time depositors, bet users count, total bet amount, total first deposit amount, and total withdrawal amount
      const depositsSummary = allDepositTransactions.reduce(
        (acc, transaction) => {
          const dateStr = moment(transaction.date).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
          const userIdStr = transaction.user.toString();

          if (!acc[dateStr]) {
            acc[dateStr] = {
              date: dateStr,
              totalDeposits: 0,
              totalDepositAmount: 0,
              totalWithdrawals: 0,
              totalWithdrawalAmount: 0,
              firstTimeDepositors: new Set(), // Using Set to store unique first-time depositor user IDs
              totalBetAmount: 0, // Initialize totalBetAmount
              usersWhoBet: new Set(), // Using Set to store unique user IDs
              totalFirstDepositAmount: 0, // Initialize totalFirstDepositAmount
            };
          }

          acc[dateStr].totalDeposits += 1;
          acc[dateStr].totalDepositAmount += transaction.amount;

          // Check if the user is making a deposit for the first time
          if (!usersWhoMadeDeposit.has(userIdStr)) {
            acc[dateStr].firstTimeDepositors.add(userIdStr);
            usersWhoMadeDeposit.add(userIdStr); // Mark this user as having made a deposit
            firstDepositAmounts[userIdStr] = transaction.amount; // Store the first deposit amount for the user
            acc[dateStr].totalFirstDepositAmount += transaction.amount; // Add to the total first deposit amount for this date
          }

          return acc;
        },
        {}
      );

      // Update depositsSummary with the number of users who placed bets and total bet amount
      allBetTransactions.forEach((transaction) => {
        const dateStr = moment(transaction.date).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        if (depositsSummary[dateStr]) {
          depositsSummary[dateStr].usersWhoBet.add(transaction.user.toString());
          depositsSummary[dateStr].totalBetAmount += transaction.amount; // Add bet amount to totalBetAmount
        } else {
          depositsSummary[dateStr] = {
            date: dateStr,
            totalDeposits: 0,
            totalDepositAmount: 0,
            totalWithdrawals: 0,
            totalWithdrawalAmount: 0,
            firstTimeDepositors: new Set(), // Initialize with empty Set for first-time depositors
            totalBetAmount: transaction.amount, // Initialize with the bet amount
            usersWhoBet: new Set([transaction.user.toString()]), // Initialize with the user who bet
            totalFirstDepositAmount: 0, // Initialize with zero as no deposit was found for this date
          };
        }
      });

      // Update depositsSummary with the total withdrawal amount
      allWithdrawalTransactions.forEach((transaction) => {
        const dateStr = moment(transaction.createdAt).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss");
        if (depositsSummary[dateStr]) {
          depositsSummary[dateStr].totalWithdrawals += 1;
          depositsSummary[dateStr].totalWithdrawalAmount += transaction.balance; // Add withdrawal amount to totalWithdrawalAmount
        } else {
          depositsSummary[dateStr] = {
            date: dateStr,
            totalDeposits: 0,
            totalDepositAmount: 0,
            totalWithdrawals: 1,
            totalWithdrawalAmount: transaction.balance, // Initialize with the withdrawal amount
            firstTimeDepositors: new Set(), // Initialize with empty Set for first-time depositors
            totalBetAmount: 0, // Initialize with zero as no bet was found for this date
            usersWhoBet: new Set(), // Initialize with empty Set for users who bet
            totalFirstDepositAmount: 0, // Initialize with zero as no deposit was found for this date
          };
        }
      });

      // Convert the grouped object into an array and count unique users who bet and made first-time deposits
      const depositsSummaryArray = Object.values(depositsSummary).map(
        (summary) => ({
          date: summary.date,
          totalDeposits: summary.totalDeposits,
          totalDepositAmount: summary.totalDepositAmount,
          totalBetAmount: summary.totalBetAmount, // Include totalBetAmount in the response
          usersWhoBetCount: summary.usersWhoBet.size, // Get the size of the Set to count unique users
          firstTimeDepositorsCount: summary.firstTimeDepositors.size, // Get the size of the Set to count unique first-time depositors
          totalFirstDepositAmount: summary.totalFirstDepositAmount, // Total amount of first-time deposits for the date
          totalWithdrawals: summary.totalWithdrawals, // Include totalWithdrawals in the response
          totalWithdrawalAmount: summary.totalWithdrawalAmount, // Include totalWithdrawalAmount in the response
        })
      );

      // Convert referredUsers date to IST format
      const referredUsersWithISTDate = user.referredUsers.map((subordinate) => ({
        ...subordinate,
        date: moment(subordinate.date).tz("Asia/Kolkata").format("YYYY-MM-DD HH:mm:ss")
      }));

      return {
        uid: user.uid,
        depositsSummary: depositsSummaryArray,
        referredUsers: referredUsersWithISTDate // Include referred users with IST date in the response
      };
    }));

    res.json({ usersSummary: allUsersSummary });
  } catch (error) {
    console.error("Error fetching deposit summary for all users:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/subordinates/subordinate-summary", auth, async (req, res) => {
  const userId = req.user._id;

  console.log("User ID:", userId);

  if (!userId) {
    console.log("User ID not found. User not authenticated.");
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Fetch the user's referred users
    console.log("Fetching user data...");
    const user = await User.findById(userId, "referredUsers -_id");

    console.log("Fetched User Data:", user);

    if (user.referredUsers.length === 0) {
      console.log("No subordinates found.");
      return res.json({ depositsSummary: [] });
    }

    // Collect uids for later user ID lookup
    const uids = user.referredUsers.map((subordinate) => subordinate.uid);

    // Fetch all users based on uids
    const users = await User.find({ uid: { $in: uids } }, "_id uid").lean();

    // Map uid to _id for quick lookup
    const uidToIdMap = users.reduce((acc, u) => {
      acc[u.uid] = u._id;
      return acc;
    }, {});

    console.log("UID to _ID Map:", uidToIdMap);

    // Fetch all deposit transactions for the subordinates
    const allDepositTransactions = await TransactionHistory.find({
      user: { $in: Object.values(uidToIdMap) },
      type: "deposit",
    })
      .sort({ date: 1 })
      .lean(); // Sorting by date to ensure correct first deposit calculation

    console.log("All Deposit Transactions:", allDepositTransactions);

    // Fetch all betting transactions for the subordinates filtered by types
    const betTypes = ["WingoBet", "TRXBet", "K3Bet", "5DBet"];
    const allBetTransactions = await TransactionHistory.find({
      user: { $in: Object.values(uidToIdMap) },
      type: { $in: betTypes },
    }).lean();

    console.log("All Bet Transactions:", allBetTransactions);

    // Track users who have already made a deposit and their first deposit amounts
    const usersWhoMadeDeposit = new Set();
    const firstDepositAmounts = {}; // To store the amount of each user's first deposit

    // Group transactions by date and calculate total deposit count, amount, first-time depositors, bet users count, total bet amount, and total first deposit amount
    const depositsSummary = allDepositTransactions.reduce(
      (acc, transaction) => {
        const dateStr = new Date(transaction.date).toISOString().split("T")[0];
        const userIdStr = transaction.user.toString();

        if (!acc[dateStr]) {
          acc[dateStr] = {
            date: dateStr,
            totalDeposits: 0,
            totalDepositAmount: 0,
            firstTimeDepositors: new Set(), // Using Set to store unique first-time depositor user IDs
            totalBetAmount: 0, // Initialize totalBetAmount
            usersWhoBet: new Set(), // Using Set to store unique user IDs
            totalFirstDepositAmount: 0, // Initialize totalFirstDepositAmount
          };
        }

        acc[dateStr].totalDeposits += 1;
        acc[dateStr].totalDepositAmount += transaction.amount;

        // Check if the user is making a deposit for the first time
        if (!usersWhoMadeDeposit.has(userIdStr)) {
          acc[dateStr].firstTimeDepositors.add(userIdStr);
          usersWhoMadeDeposit.add(userIdStr); // Mark this user as having made a deposit
          firstDepositAmounts[userIdStr] = transaction.amount; // Store the first deposit amount for the user
          acc[dateStr].totalFirstDepositAmount += transaction.amount; // Add to the total first deposit amount for this date
        }

        return acc;
      },
      {}
    );

    // Update depositsSummary with the number of users who placed bets and total bet amount
    allBetTransactions.forEach((transaction) => {
      const dateStr = new Date(transaction.date).toISOString().split("T")[0];
      if (depositsSummary[dateStr]) {
        depositsSummary[dateStr].usersWhoBet.add(transaction.user.toString());
        depositsSummary[dateStr].totalBetAmount += transaction.amount; // Add bet amount to totalBetAmount
      } else {
        depositsSummary[dateStr] = {
          date: dateStr,
          totalDeposits: 0,
          totalDepositAmount: 0,
          firstTimeDepositors: new Set(), // Initialize with empty Set for first-time depositors
          totalBetAmount: transaction.amount, // Initialize with the bet amount
          usersWhoBet: new Set([transaction.user.toString()]), // Initialize with the user who bet
          totalFirstDepositAmount: 0, // Initialize with zero as no deposit was found for this date
        };
      }
    });

    console.log(
      "Deposits Summary with Bets and First-Time Depositors:",
      depositsSummary
    );

    // Convert the grouped object into an array and count unique users who bet and made first-time deposits
    const depositsSummaryArray = Object.values(depositsSummary).map(
      (summary) => ({
        date: summary.date,
        totalDeposits: summary.totalDeposits,
        totalDepositAmount: summary.totalDepositAmount,
        totalBetAmount: summary.totalBetAmount, // Include totalBetAmount in the response
        usersWhoBetCount: summary.usersWhoBet.size, // Get the size of the Set to count unique users
        firstTimeDepositorsCount: summary.firstTimeDepositors.size, // Get the size of the Set to count unique first-time depositors
        totalFirstDepositAmount: summary.totalFirstDepositAmount, // Total amount of first-time deposits for the date
      })
    );

    res.json(depositsSummaryArray);
  } catch (error) {
    console.error("Error fetching deposit summary:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/subordinates/total-commission", auth, async (req, res) => {
  const userId = req.user._id;

  console.log("User ID:", userId);

  if (!userId) {
    console.log("User ID not found. User not authenticated.");
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Fetch the user's referred users
    console.log("Fetching user data...");
    const user = await User.findById(userId, "referredUsers -_id").lean();

    console.log("Fetched User Data:", user);

    if (!user || !user.referredUsers.length) {
      console.log("No subordinates found.");
      return res.json({ totalCommissions: {} });
    }

    // Collect uids for later user ID lookup
    const uids = user.referredUsers.map((subordinate) => subordinate.uid);

    // Fetch all users based on uids
    const users = await User.find({ uid: { $in: uids } }, "_id uid").lean();

    // Map uid to _id for quick lookup
    const uidToIdMap = {};
    users.forEach((u) => (uidToIdMap[u.uid] = u._id));

    console.log("UID to _ID Map:", uidToIdMap);

    // Fetch all commission transactions for the subordinates
    const commissionTransactions = await TransactionHistory.find({
      commissionFromUser: { $in: Object.values(uidToIdMap) },
      type: "commission",
    }).lean();

    console.log("All Commission Transactions:", commissionTransactions);

    // Calculate total commission per subordinate
    const totalCommissions = commissionTransactions.reduce(
      (acc, transaction) => {
        // Find the UID corresponding to the commissionFromUser
        const uid = Object.keys(uidToIdMap).find(
          (uid) =>
            uidToIdMap[uid].toString() ===
            transaction.commissionFromUser.toString()
        );
        if (uid) {
          if (!acc[uid]) {
            acc[uid] = 0;
          }
          acc[uid] += transaction.amount;
        }
        return acc;
      },
      {}
    );

    // Ensure every referred user has an entry in the response, even if no commission is generated
    const result = user.referredUsers.reduce((acc, sub) => {
      const uid = sub.uid;
      acc[uid] = totalCommissions[uid] || 0;
      return acc;
    }, {});

    console.log("Total Commissions per Subordinate:", result);

    res.json({ totalCommissions: result });
  } catch (error) {
    console.error("Error fetching total commission:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/levels", async (req, res) => {
  try {
    const levels = await CommissionRates.find({});

    // Structure the response
    const response = {
      success: true,
      message: "Levels retrieved successfully",
      data: levels.map((level) => ({
        id: level._id,
        createdAt: level.createdAt,
        updatedAt: level.updatedAt,
        levels: {
          level1: level.level1,
          level2: level.level2,
          level3: level.level3,
          level4: level.level4,
          level5: level.level5,
          level6: level.level6,
        },
      })),
    };

    res.json(response);
  } catch (err) {
    res.status(500).json({
      success: false,
      message: "An error occurred while retrieving levels",
      error: err.message,
    });
  }
});

// Endpoint to get all transactions for a specific user
router.post("/user-transactions", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Validate the user ID
    if (!userId) {
      return res.status(400).json({ msg: "User ID is required" });
    }

    // Ensure the userId is a valid ObjectId
    if (!mongoose.Types.ObjectId.isValid(userId)) {
      return res.status(400).json({ msg: "Invalid user ID" });
    }

    // Find all transactions for the user
    const transactions = await Transaction.find({
      user: mongoose.Types.ObjectId(userId), // Convert userId to ObjectId for the query
    }).sort({ date: -1 }); // Sort by date, latest first

    if (!transactions || transactions.length === 0) {
      return res
        .status(404)
        .json({ msg: "No transactions found for this user" });
    }

    // Return the transactions in the response
    res.status(200).json(transactions);
  } catch (err) {
    console.error("Error fetching user transactions:", err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
