const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const Commission = require("../../models/commissionModel");
const auth = require("../../middlewares/auth");
const moment = require("moment");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const TransactionHistoryModel = require("../../models/TransictionHistory");
const mongoose = require("mongoose");



// Admin route to get wallet history
router.get("/admin/wallet-history", auth, isAdmin, async (req, res) => {
  try {
    const { uid } = req.query;

    if (!uid) {
      return res.status(400).json({ 
        success: false,
        message: "User UID is required" 
      });
    }

    // Find user by UID with specific fields
    const user = await User.findOne({ uid })
      .select('uid username walletAmount walletHistory')
      .lean();
    
    if (!user) {
      return res.status(404).json({ 
        success: false,
        message: "User not found" 
      });
    }

    // Ensure walletHistory exists and sort it
    console.log("User Wallet History:", user.walletHistory);
    const walletHistory = (user.walletHistory || [])
      .sort((a, b) => b.createdAt - a.createdAt);

    res.status(200).json({
      success: true,
      data: {
        uid: user.uid,
        username: user.username,
        currentBalance: user.walletAmount || 0,
        walletHistory: walletHistory
      }
    });

  } catch (error) {
    console.error("Error fetching wallet history:", error);
    res.status(500).json({ 
      success: false, 
      message: "Error fetching wallet history",
      error: error.message 
    });
  }
});


// Route to get the last achievement
router.get("/last-achievement", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the user document
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Extract the achievements and determine the last one
    const achievements = user.achievements || [];
    const lastAchievement =
      achievements.length > 0 ? achievements[achievements.length - 1] : null;

    if (lastAchievement) {
      // Extract the middle portion from the achievement
      const parts = lastAchievement.split(" ");
      const middlePart = parts.slice(1, -1).join(" "); // Remove the first and last parts

      res.status(200).json({ lastAchievement: middlePart });
    } else {
      res.status(200).json({ lastAchievement: null });
    }
  } catch (error) {
    console.error("Error fetching user achievement:", error);
    res.status(500).json({ message: "Failed to fetch last achievement" });
  }
});

router.get("/envelop-transactions", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch transactions where type starts with "Envelop" for the authenticated user
    const transactions = await TransactionHistoryModel.find({
      user: userId,
      type: { $regex: /^Coupon\b/i }, // Matches "Envelop" at the beginning, followed by a word boundary
    });

    // Map transactions to include the code portion
    const transactionsWithCode = transactions.map((transaction) => {
      const [_, code] = transaction.type.split(" - "); // Split the type by " - " and extract the code
      return {
        ...transaction._doc, // Spread the original transaction fields
        code: code || null, // Include the code or null if not present
      };
    });

    // Properly structured console logging for easier readability
    console.log("Fetched transactions for user:", userId);
    console.log("Original transactions:", transactions);
    console.log("Mapped transactions with code:", transactionsWithCode);

    res.status(200).json(transactionsWithCode);
  } catch (error) {
    console.error("Error fetching transactions:", error);
    res.status(500).json({ message: "Failed to fetch transactions" });
  }
});



router.get("/transaction-history", auth, async (req, res) => {
  console.log("hiiii");
  const userId = req.user._id;
  const { category } = req.query; // Get the category from the query parameters

  console.log(
    `Request received for user ID: ${userId} with category: ${category}`
  );

  try {
    let transactions = [];

    // Determine the query based on the category
    let filter = { user: userId };

    if (category === "All") {
      // No additional filters, retrieve all transactions for the user
    } else {
      switch (category) {
        case "RebateBonus":
          filter.type = "RebateBonus";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "DailyReward":
          filter.type = "DailyReward";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "DepositBonus":
          filter.type = "DepositBonus";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "Salary":
          filter.type = "Salary";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "VIPMonthlyReward":
          filter.type = "VIPMonthlyReward";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "VIPLevelReward":
          filter.type = "VIPLevelReward";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "AttendanceBonus":
          filter.type = "AttendanceBonus";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "Envelop":
          // Filter where type contains the word "Envelop"
          filter.type = { $regex: /^Envelop/, $options: "i" }; // Case-insensitive match for "Envelop"
          break;
        case "SignUpBonus":
          filter.type = "Sign Up Bonus";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "InvitationBonus":
          filter.type = "Invitation Bonus";
          // filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "AgentCommission":
          filter.type = "commission";
          filter.commissionFromUser = { $ne: null }; // Non-null commissionFromUser
          break;
        case "Bet":
          filter.type = { $in: ["WingoBet", "K3Bet", "TRXBet", "5DBet"] };
          filter.commissionFromUser = null; // Ensure no commission
          break;
        case "Deposit":
          filter.type = "deposit";
          filter.commissionFromUser = null; // Ensure no commission
          break;
        case "Withdraw":
          filter.type = "withdraw";
          filter.commissionFromUser = null; // Ensure no commission
          break;
        default:
          return res.status(400).json({ message: "Invalid category" });
      }
    }

    // Fetch and sort transactions by date
    transactions = await TransactionHistoryModel.find(filter)
      .sort({ date: -1 }) // Sort by the most recent date first
      .exec();

    if (!transactions.length) {
      console.log(
        `No transactions found for user ID ${userId} with category: ${category}`
      );
      return res.json([]); // Return an empty array if no transactions are found
    }

    // Log the transaction history data
    console.log(`Transactions found: ${JSON.stringify(transactions)}`);

    // Respond with the transactions
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching transaction history:", err);
    res.status(500).json({ message: "Server error" });
  }
});


router.get("/attendance-transactions", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch transactions where type is "AttendanceBonus" for the authenticated user
    const transactions = await TransactionHistoryModel.find({
      user: userId,
      type: "AttendanceBonus",
    }).sort({ date: -1 }); // Sort by the most recent date first

    if (!transactions.length) {
      console.log(`No attendance transactions found for user ID ${userId}`);
      return res.json([]); // Return an empty array if no transactions are found
    }

    // Log the attendance transaction data
    console.log(`Attendance transactions found: ${JSON.stringify(transactions)}`);

    // Respond with the transactions
    res.json(transactions);
  } catch (err) {
    console.error("Error fetching attendance transactions:", err);
    res.status(500).json({ message: "Server error" });
  }
});

// Endpoint to get the user object IDs of direct, team, and total subordinates
router.get("/subordinates", auth, async (req, res) => {
  const userId = req.user._id; // Fetch user ID from the authenticated user
  console.log(`Request received for user ID: ${userId}`);

  try {
    // Fetch the user from the database by ID
    const user = await User.findById(userId).exec();

    if (!user) {
      console.log(`User with ID ${userId} not found.`);
      return res.status(404).json({ message: "User not found" });
    }

    // Log the fetched user data
    console.log(`Fetched user: ${JSON.stringify(user)}`);

    // Initialize arrays to store subordinate IDs
    const directSubordinateIds = [];
    const teamSubordinateIds = [];

    // Iterate through referredUsers to categorize subordinates
    user.referredUsers.forEach((sub) => {
      if (sub.level === 1) {
        // Level 1 referred users are direct subordinates
        directSubordinateIds.push(sub._id.toString());
      } else if (sub.level > 1) {
        // Level greater than 1 referred users are team subordinates
        teamSubordinateIds.push(sub._id.toString());
      }
    });

    // Log subordinate IDs
    console.log(`Direct subordinate IDs: ${directSubordinateIds}`);
    console.log(`Team subordinate IDs: ${teamSubordinateIds}`);

    // Combine all subordinate IDs
    const allSubordinateIds = [...directSubordinateIds, ...teamSubordinateIds];
    console.log(`All subordinate IDs: ${allSubordinateIds}`);

    // Respond with the IDs and counts
    res.json({
      directSubordinateIds,
      teamSubordinateIds,
      allSubordinateIds,
      directSubordinateCount: directSubordinateIds.length,
      teamSubordinateCount: teamSubordinateIds.length,
      totalSubordinateCount: allSubordinateIds.length,
    });
  } catch (err) {
    console.error("Error fetching subordinate data:", err);
    res.status(500).json({ message: "Server error" });
  }
});

router.get("/api/subordinates", auth, async (req, res) => {
  const userId = req.user._id;

  console.log("User ID:", userId);

  if (!userId) {
    console.log("User ID not found. User not authenticated.");
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    console.log("Fetching user data...");
    const user = await User.findById(
      userId,
      "directSubordinates teamSubordinates -_id"
    ).lean();

    console.log("Fetched User Data:", user);

    if (!user) {
      console.log("User not found.");
      return res.status(404).json({ message: "User not found" });
    }

    const sumValues = (subordinates) => {
      console.log("Calculating sums for:", subordinates);
      const initialSum = {
        noOfRegister: 0,
        depositNumber: 0,
        depositAmount: 0,
        firstDeposit: 0,
        level: 0,
      };

      const result = subordinates.reduce((acc, curr) => {
        console.log("Processing Subordinate:", curr);
        acc.noOfRegister += curr.noOfRegister || 0;
        acc.depositNumber += curr.depositNumber || 0;
        acc.depositAmount += curr.depositAmount || 0;
        acc.firstDeposit += curr.firstDeposit || 0;
        acc.level += curr.level || 0;
        return acc;
      }, initialSum);

      console.log("Sum Result:", result);
      return result;
    };

    console.log("Summing direct subordinates...");
    const totalDirectSubordinates = sumValues(user.directSubordinates || []);
    console.log("Total Direct Subordinates:", totalDirectSubordinates);

    console.log("Summing team subordinates...");
    const totalTeamSubordinates = sumValues(user.teamSubordinates || []);
    console.log("Total Team Subordinates:", totalTeamSubordinates);

    res.json({
      totalDirectSubordinates,
      totalTeamSubordinates,
    });
  } catch (error) {
    console.error("Error fetching subordinates:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/api/subordinates/previous-day", auth, async (req, res) => {
  const userId = req.user._id;

  console.log("User ID:", userId);

  if (!userId) {
    console.log("User ID not found. User not authenticated.");
    return res.status(401).json({ message: "User not authenticated" });
  }

  try {
    // Calculate the previous day's date string and create start and end of the day
    const today = new Date();
    const previousDay = new Date(today);
    previousDay.setDate(today.getDate() - 1);
    const previousDayDateStr = previousDay.toISOString().split("T")[0];

    // Create a Date object for the start and end of the previous day
    const startOfDay = new Date(previousDayDateStr + "T00:00:00Z");
    const endOfDay = new Date(previousDayDateStr + "T23:59:59Z");

    console.log("Previous Day Date:", previousDayDateStr);
    console.log("Start of Previous Day:", startOfDay);
    console.log("End of Previous Day:", endOfDay);

    // Fetch the user's referred users
    console.log("Fetching user data...");
    const user = await User.findById(userId, "referredUsers -_id");

    console.log("Fetched User Data:", user);

    if (user.referredUsers.length === 0) {
      console.log("No subordinates found.");
      return res.json({
        directSubordinatesJoinedYesterday: [],
        teamSubordinatesJoinedYesterday: [],
        directSubordinatesCount: 0,
        teamSubordinatesCount: 0,
        directSubordinatesDepositSum: 0,
        teamSubordinatesDepositSum: 0,
        directSubordinatesDepositCount: 0,
        teamSubordinatesDepositCount: 0,
        directSubordinatesFirstTimeDepositors: 0,
        teamSubordinatesFirstTimeDepositors: 0,
      });
    }

    // Arrays to store direct subordinates and team subordinates
    const directSubordinatesJoinedYesterday = [];
    const teamSubordinatesJoinedYesterday = [];
    const directSubordinatesFirstTimeDepositors = new Set();
    const teamSubordinatesFirstTimeDepositors = new Set();

    // Variables to store deposit sums and counts
    let directSubordinatesDepositSum = 0;
    let teamSubordinatesDepositSum = 0;
    let directSubordinatesDepositCount = 0;
    let teamSubordinatesDepositCount = 0;

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

    // Fetch all transactions where type is "deposit" and date is within the previous day
    const allDepositTransactions = await TransactionHistoryModel.find({
      type: "deposit",
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    console.log("Filtered Deposit Transactions:", allDepositTransactions);

    // Fetch all commission transactions to check for first-time deposits
    const allCommissionTransactions = await TransactionHistoryModel.find({
      type: "commission",
      date: { $gte: startOfDay, $lte: endOfDay },
    }).lean();

    console.log("Filtered Commission Transactions:", allCommissionTransactions);

    // Loop through referred users
    for (const subordinate of user.referredUsers) {
      const regDateStr = new Date(subordinate.date).toISOString().split("T")[0];

      if (regDateStr === previousDayDateStr) {
        console.log("Processing Subordinate:", subordinate._id);

        const userObjectId = uidToIdMap[subordinate.uid];
        if (!userObjectId) {
          console.log(`No user found for UID ${subordinate.uid}`);
          continue;
        }

        console.log("User Object ID:", userObjectId.toString());

        const transactions = allDepositTransactions.filter((transaction) => {
          console.log("Transaction User ID:", transaction.user.toString());
          console.log("Comparing with:", userObjectId.toString());

          return transaction.user.toString() === userObjectId.toString();
        });

        console.log(
          `Filtered Transactions for user ${userObjectId.toString()}:`,
          transactions
        );

        let depositSum = 0;
        let depositCount = 0;
        transactions.forEach((transaction) => {
          depositSum += transaction.amount;
          depositCount += 1; // Increment the count for each deposit
        });

        console.log(
          `Deposit sum for user ${userObjectId.toString()}:`,
          depositSum
        );
        console.log(
          `Deposit count for user ${userObjectId.toString()}:`,
          depositCount
        );

        if (subordinate.level === 1) {
          directSubordinatesJoinedYesterday.push(subordinate);
          directSubordinatesDepositSum += depositSum;
          directSubordinatesDepositCount += depositCount;
        } else if (subordinate.level > 1) {
          teamSubordinatesJoinedYesterday.push(subordinate);
          teamSubordinatesDepositSum += depositSum;
          teamSubordinatesDepositCount += depositCount;
        }

        // Check for first-time depositors in commission transactions
        console.log("Checking for first-time depositors...");
        for (const commissionTransaction of allCommissionTransactions) {
          if (
            commissionTransaction.commissionFromUser.toString() ===
            userObjectId.toString()
          ) {
            console.log(
              "Match found for Commission Transaction User ID:",
              commissionTransaction.commissionFromUser.toString()
            );

            // Fetch transactions where `user` matches and check `firstDepositChecker`
            const relatedTransactions = await TransactionHistoryModel.find({
              user: userObjectId,
              type: "deposit",
              date: { $gte: startOfDay, $lte: endOfDay },
            }).lean();

            console.log("Related Transactions for User:", relatedTransactions);

            const isFirstTimeDepositor = relatedTransactions.some(
              (transaction) => {
                console.log("Checking Transaction:", transaction);
                return (
                  transaction.firstDepositChecker === "firstTimeDepositing"
                );
              }
            );

            if (isFirstTimeDepositor) {
              console.log("User is a first-time depositor.");
              if (subordinate.level === 1) {
                console.log(
                  "Adding to Direct Subordinates First-Time Depositors:",
                  subordinate.uid
                );
                directSubordinatesFirstTimeDepositors.add(subordinate.uid);
              } else if (subordinate.level > 1) {
                console.log(
                  "Adding to Team Subordinates First-Time Depositors:",
                  subordinate.uid
                );
                teamSubordinatesFirstTimeDepositors.add(subordinate.uid);
              }
            } else {
              console.log("No first-time deposit found for User.");
            }
          } else {
            console.log(
              "No match for Commission Transaction User ID:",
              commissionTransaction.commissionFromUser.toString()
            );
          }
        }
      }
    }

    const directSubordinatesCount = directSubordinatesJoinedYesterday.length;
    const teamSubordinatesCount = teamSubordinatesJoinedYesterday.length;

    console.log("Direct Subordinates Count:", directSubordinatesCount);
    console.log("Team Subordinates Count:", teamSubordinatesCount);
    console.log(
      "Direct Subordinates Deposit Sum:",
      directSubordinatesDepositSum
    );
    console.log("Team Subordinates Deposit Sum:", teamSubordinatesDepositSum);
    console.log(
      "Direct Subordinates Deposit Count:",
      directSubordinatesDepositCount
    );
    console.log(
      "Team Subordinates Deposit Count:",
      teamSubordinatesDepositCount
    );
    console.log(
      "Direct Subordinates First-Time Depositors Count:",
      directSubordinatesFirstTimeDepositors.size
    );
    console.log(
      "Team Subordinates First-Time Depositors Count:",
      teamSubordinatesFirstTimeDepositors.size
    );

    res.json({
      directSubordinatesJoinedYesterday,
      teamSubordinatesJoinedYesterday,
      directSubordinatesCount,
      teamSubordinatesCount,
      directSubordinatesDepositSum,
      teamSubordinatesDepositSum,
      directSubordinatesDepositCount,
      teamSubordinatesDepositCount,
      directSubordinatesFirstTimeDepositors:
        directSubordinatesFirstTimeDepositors.size,
      teamSubordinatesFirstTimeDepositors:
        teamSubordinatesFirstTimeDepositors.size,
    });
  } catch (error) {
    console.error("Error fetching subordinates:", error.message);
    res.status(500).json({ message: error.message });
  }
});

router.get("/commission-stats", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch user's details and commission rates
    const [user, commissionRates] = await Promise.all([
      User.findById(userId),
      Commission.findOne(),
    ]);

    let totalCommissionTillNow = 0;

    const calculateSubordinateCommissions = async (subordinates) => {
      const commissions = await Promise.all(
        subordinates.map(async (subordinate) => {
          const commissionRate =
            commissionRates[`level${subordinate.level}`] || 0;
          return subordinate.depositAmount * commissionRate;
        })
      );
      return commissions.reduce((sum, commission) => sum + commission, 0);
    };

    // Calculate total commission from direct and team subordinates in parallel
    const [directCommission, teamCommission] = await Promise.all([
      calculateSubordinateCommissions(user.directSubordinates),
      calculateSubordinateCommissions(user.teamSubordinates),
    ]);

    totalCommissionTillNow = directCommission + teamCommission;

    console.log("-------------->", totalCommissionTillNow);

    // Fetch commission for the last 7 days
    const sevenDaysAgo = new Date();
    sevenDaysAgo.setDate(sevenDaysAgo.getDate() - 7);

    const commissionLast7Days = user.commissionRecords
      .filter((record) => record.date >= sevenDaysAgo)
      .reduce((total, record) => total + record.commission, 0);

    // Count total direct and team subordinates' registrations
    const countTotalRegistrations = (subordinates) => {
      return subordinates.reduce((total, subordinate) => {
        return total + subordinate.noOfRegister;
      }, 0);
    };

    const totalDirectSubordinates = countTotalRegistrations(
      user.directSubordinates
    );
    const totalTeamSubordinates = countTotalRegistrations(
      user.teamSubordinates
    );

    res.status(200).json({
      totalCommissionTillNow,
      commissionLast7Days,
      totalDirectSubordinates,
      totalTeamSubordinates: totalTeamSubordinates + totalDirectSubordinates,
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

router.get("/user/totalcommission", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const totalCommission = user.commissionRecords.reduce(
      (total, record) => total + record.commission,
      0
    );
    res.json({ totalCommission });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
});
router.get("/users/referredUsers", auth, async (req, res) => {
  try {
    const user = await User.findById(req.user._id).populate("referredUsers");
    if (!user) {
      return res.status(404).send({ message: "User not found" });
    }
    res.send(user.referredUsers);
  } catch (error) {
    res.status(500).send({ message: error.message });
  }
});

module.exports = router;
