const WebSocket = require("ws");
const {
  createTimer,
  calculateRemainingTime,
  secondsToHms,
  getLatestPeriodId,
  generatePeriodId,
} = require("../controllers/cronJobControllers");
const {
  createTimer1,
  calculateRemainingTime1,
  secondsToHms1,
} = require("../controllers/cronjobTRXController");
const {
  createTimer3,
  calculateRemainingTime3,
  secondsToHms3,
} = require("../controllers/5DCronjobController");
const {
  createTimer2,
  calculateRemainingTime2,
  secondsToHms2,
} = require("../controllers/K3CronjobController");
const {
  secondsToHms4,
  calculateRemainingTime4,
  getLatestPeriodId4,
  createTimer4,
} = require("../controllers/cronJobRacingController");

const mongoose = require("mongoose");
const async = require("async");
const {
  Timer1Min,
  Timer3Min,
  Timer5Min,
  Timer10Min,
  Timer30Sec,
} = require("../models/timersModel");
const { runSalaryCronJob } = require("../controllers/cronJobSalaryController");
const User = require("../models/userModel"); // Assuming you have a User model defined
const Bet = require("../models/betsModel"); // Assuming you have Bet model defined
const cron = require("node-cron");
const MainLevelModel = require("../models/levelSchema"); // Assuming you have MainLevelModel defined
const TrxBet = require("../models/TRXBetModel");
const K3Bet = require("../models/K3BetModel");
const VIPHistory = require("../models/VIPHistory"); // VIPHistory schema
const TransactionModel = require("../models/TransictionHistory"); // Ensure correct model

cron.schedule("* * * * *", async () => {
  try {
    // console.log(
    //   "Daily level achievement calculation started at:",
    //   new Date().toISOString()
    // );

    // Fetch the main levels schema
    // console.log("Fetching main levels schema...");
    const mainLevelsDoc = await MainLevelModel.findOne();
    if (!mainLevelsDoc) {
      console.error("Main levels data not found.");
      return;
    }
    // console.log("Main levels schema retrieved:", mainLevelsDoc);

    // Fetch all users
    // console.log("Fetching all users...");
    const users = await User.find();
    if (!users || users.length === 0) {
      console.error("No users found.");
      return;
    }
    // console.log(`Processing ${users.length} users...`);

    // Process each user individually for level achievement
    for (const user of users) {
      // console.log(`\nProcessing user with ID: ${user._id}`);

      // Aggregate bets for the user from all collections
      const [wingoBetAggregation, trxBetAggregation, k3BetAggregation] =
        await Promise.all([
          Bet.aggregate([
            { $match: { userId: user._id } },
            {
              $group: {
                _id: "$userId",
                totalAmountOfBets: {
                  $sum: { $multiply: ["$betAmount", "$multiplier"] },
                },
                betCount: { $sum: 1 },
              },
            },
          ]),
          TrxBet.aggregate([
            { $match: { userId: user._id } },
            {
              $group: {
                _id: "$userId",
                totalAmountOfBets: { $sum: { $add: ["$totalBet", "$tax"] } },
                betCount: { $sum: 1 },
              },
            },
          ]),
          K3Bet.aggregate([
            { $match: { user: user._id } },
            {
              $group: {
                _id: "$user",
                totalAmountOfBets: { $sum: { $add: ["$totalBet", "$tax"] } },
                betCount: { $sum: 1 },
              },
            },
          ]),
        ]);

      // Extract bet amounts for each game type
      const wingoBetAmount = wingoBetAggregation[0]?.totalAmountOfBets || 0;
      const trxBetAmount = trxBetAggregation[0]?.totalAmountOfBets || 0;
      const k3BetAmount = k3BetAggregation[0]?.totalAmountOfBets || 0;

      // Log individual game type bet amounts
      // console.log(`User ${user._id} bet amounts:`);
      // console.log(`  Wingo: ${wingoBetAmount}`);
      // console.log(`  TRX: ${trxBetAmount}`);
      // console.log(`  K3: ${k3BetAmount}`);

      // Calculate total bet amount and count
      const totalAmountOfBets = wingoBetAmount + trxBetAmount + k3BetAmount;
      const betCount =
        (wingoBetAggregation[0]?.betCount || 0) +
        (trxBetAggregation[0]?.betCount || 0) +
        (k3BetAggregation[0]?.betCount || 0);

      // console.log(
      //   `Total bet amount for user ${user._id}: ${totalAmountOfBets}`
      // );
      // console.log(`Total bet count for user ${user._id}: ${betCount}`);

      // Determine highest achieved level
      let highestAchievedLevel = null;
      for (const level of mainLevelsDoc.levels) {
        if (totalAmountOfBets >= level.minAmount) {
          highestAchievedLevel = level;
        } else {
          break;
        }
      }

      if (highestAchievedLevel) {
        const levelAchievement = `Reached ${highestAchievedLevel.awarded} level`;

        if (!user.achievements.includes(levelAchievement)) {
          // Add one-time bonus to user's wallet
          user.walletAmount += highestAchievedLevel.oneTimeBonus;
          // console.log(
          //   `Added one-time bonus of ${highestAchievedLevel.oneTimeBonus} to user ${user._id}`
          // );

          // Update achievements and mark level as achieved
          user.achievements.push(levelAchievement);
          // console.log(
          //   `Updated achievements for user ${user._id}:`,
          //   user.achievements
          // );

          // Create a new VIP History entry for level achievement
          const levelHistory = new VIPHistory({
            userId: user._id,
            levelAchieved: highestAchievedLevel.awarded,
            achievedAt: new Date(),
            oneTimeBonus: highestAchievedLevel.oneTimeBonus,
            monthlyBonus: 0,
            rebatePercentage: highestAchievedLevel.rebatePercentage,
            details: `Achieved ${highestAchievedLevel.awarded} level with one-time bonus.`,
            type: "levelUpdate",
          });
          await levelHistory.save();
          // console.log(
          //   `Saved VIP History entry for level update for user ${user._id}:`,
          //   levelHistory
          // );

          // Create a new transaction for VIP Level Reward
          const vipTransaction = new TransactionModel({
            user: user._id,
            amount: highestAchievedLevel.oneTimeBonus,
            type: "VIPLevelReward",
            date: new Date(),
            depositAmount: 0,
            betAmount: 0,
            depositAmountOfUser: 0,
            gameType: "N/A",
            firstDepositChecker: "depositDoneAlready",
            commissionFromUser: null,
            commissionLevel: 0,
          });

          await vipTransaction.save();
          // console.log(
          //   `Transaction for VIP Level Reward created for user ${user._id}`
          // );
        }
      } else {
        // console.log(`No level achieved for user ${user._id}`);
      }

      // Save updated user
      await user.save();
      // console.log(`User ${user._id} updated successfully.`);
    }

    // console.log(
    //   "Daily user updates based on combined bets and mainLevels completed successfully."
    // );
  } catch (err) {
    console.error("Error during daily cron job execution:", err);
  }
});

// Monthly Cron Job: Apply Monthly Bonuses
cron.schedule("0 14 1 * *", async () => {
  // Runs on the 1st of every month at 2:00 PM
  try {
    // console.log(
    //   "Monthly bonus evaluation started at:",
    //   new Date().toISOString()
    // );

    // Fetch the main levels schema
    // console.log("Fetching main levels schema...");
    const mainLevelsDoc = await MainLevelModel.findOne();
    if (!mainLevelsDoc) {
      console.error("Main levels data not found.");
      return;
    }
    // console.log("Main levels schema retrieved:", mainLevelsDoc);

    // Fetch all users
    // console.log("Fetching all users...");
    const users = await User.find();
    if (!users || users.length === 0) {
      console.error("No users found.");
      return;
    }
    // console.log(`Processing ${users.length} users...`);

    // Process each user individually for monthly bonuses
    for (const user of users) {
      // console.log(`Processing user with ID: ${user._id}`);

      // Aggregate bets for the user from all collections
      const betAggregation = await Bet.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: "$userId",
            totalAmountOfBets: {
              $sum: { $multiply: ["$betAmount", "$multiplier"] },
            },
            betCount: { $sum: 1 },
          },
        },
        {
          $project: {
            userId: "$_id",
            totalAmountOfBets: 1,
            betCount: 1,
            _id: 0,
          },
        },
      ]);

      const trxBetAggregation = await TrxBet.aggregate([
        { $match: { userId: user._id } },
        {
          $group: {
            _id: "$userId",
            totalAmountOfBets: { $sum: { $sum: ["$totalBet", "$tax"] } },
            betCount: { $sum: 1 },
          },
        },
        {
          $project: {
            userId: "$_id",
            totalAmountOfBets: 1,
            betCount: 1,
            _id: 0,
          },
        },
      ]);

      const k3BetAggregation = await K3Bet.aggregate([
        { $match: { user: user._id } },
        {
          $group: {
            _id: "$user",
            totalAmountOfBets: {
              $sum: { $multiply: ["$betAmount", "$multiplier"] },
            },
            betCount: { $sum: 1 },
          },
        },
        {
          $project: {
            userId: "$_id",
            totalAmountOfBets: 1,
            betCount: 1,
            _id: 0,
          },
        },
      ]);

      // Combine results for the user
      let totalAmountOfBets = 0;
      let betCount = 0;

      const combineResults = (results) => {
        results.forEach((result) => {
          totalAmountOfBets += result.totalAmountOfBets;
          betCount += result.betCount;
        });
      };

      combineResults(betAggregation);
      combineResults(trxBetAggregation);
      combineResults(k3BetAggregation);

      // console.log(
      //   `Combined results for user ${user._id}: Total Amount of Bets = ${totalAmountOfBets}, Bet Count = ${betCount}`
      // );

      // Determine highest achieved level
      let highestAchievedLevel = null;
      for (const level of mainLevelsDoc.levels) {
        if (totalAmountOfBets >= level.minAmount) {
          highestAchievedLevel = level;
        } else {
          break;
        }
      }

      if (highestAchievedLevel) {
        const levelAchievement = `Reached ${highestAchievedLevel.awarded} level`;

        // Check if the user has achieved this level and hasn't yet received the monthly bonus
        if (
          user.achievements.includes(levelAchievement) &&
          !user.hasReceivedMonthlyBonus
        ) {
          // Apply monthly bonus to user's wallet
          user.walletAmount += highestAchievedLevel.monthlyBonus;
          user.hasReceivedMonthlyBonus = true; // Flag to prevent re-applying the bonus
          // console.log(
          //   `Added monthly bonus of ${highestAchievedLevel.monthlyBonus} to user ${user._id}`
          // );

          // Create a new VIP History entry for monthly bonus
          const monthlyBonusHistory = new VIPHistory({
            userId: user._id,
            levelAchieved: highestAchievedLevel.awarded,
            achievedAt: new Date(),
            oneTimeBonus: 0,
            monthlyBonus: highestAchievedLevel.monthlyBonus,
            rebatePercentage: highestAchievedLevel.rebatePercentage,
            details: `Monthly bonus for achieving ${highestAchievedLevel.awarded} level.`,
            type: "monthlyUpdate",
          });
          await monthlyBonusHistory.save();
          // console.log(
          //   `Saved VIP History entry for monthly bonus for user ${user._id}:`,
          //   monthlyBonusHistory
          // );

          // Add a transaction record for the monthly bonus
          const transactionRecord = new TransactionModel({
            userId: user._id,
            type: "VIPMonthlyReward",
            amount: highestAchievedLevel.monthlyBonus,
            status: "completed",
            description: `Monthly bonus of ${highestAchievedLevel.monthlyBonus} for ${highestAchievedLevel.awarded} level.`,
            createdAt: new Date(),
          });
          await transactionRecord.save();
          // console.log(
          //   `Transaction record created for monthly bonus for user ${user._id}:`,
          //   transactionRecord
          // );
        }
      } else {
        console.log(`No monthly bonus applied for user ${user._id}`);
      }

      // Save updated user
      await user.save();
      // console.log(`User ${user._id} updated successfully.`);
    }

    console.log("Monthly bonus evaluation completed successfully.");
  } catch (err) {
    console.error("Error during monthly cron job execution:", err);
  }
});

const wss = new WebSocket.Server({ noServer: true });
function setupWebSocket(server) {
  server.on("upgrade", (request, socket, head) => {
    wss.handleUpgrade(request, socket, head, (ws) => {
      wss.emit("connection", ws, request);
    });
  });

  wss.on("connection", (ws) => {
    console.log("a user connected");
    ws.on("close", () => {
      console.log("user disconnected");
    });
    ws.on("message", (msg) => {
      console.log("message: " + msg);
      wss.clients.forEach((client) => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(msg);
        }
      });
    });
  });
}

wss.on("connection", async (ws) => {
  ws.on("message", async (message) => {
    message = message.toString().trim();
    console.log("Received message:", message);
    if (message === "getUsers") {
      try {
        ws.send("hi lll");
      } catch (error) {
        console.error("error reading data", error);
      }
    }
  });
});

createTimer(Timer1Min, 1, "1min", 0); // 1 min
createTimer(Timer3Min, 3, "3min"); // 3 min
createTimer(Timer5Min, 5, "5min"); // 5 min
createTimer(Timer10Min, 10, "10min"); // 10 min
createTimer(Timer30Sec, 0.5, "30sec"); // 30 sec (interval in minutes is 0.5 for 30 seconds)

createTimer1(Timer1Min, 1, "1min", 0); // 1 min
createTimer1(Timer3Min, 3, "3min"); // 3 min
createTimer1(Timer5Min, 5, "5min"); // 5 min
createTimer1(Timer10Min, 10, "10min"); // 10 min

createTimer3(Timer1Min, 1, "1min"); // 1 min
createTimer3(Timer3Min, 3, "3min"); // 3 min
createTimer3(Timer5Min, 5, "5min"); // 5 min
createTimer3(Timer10Min, 10, "10min"); // 10 min

createTimer2(Timer1Min, 1, "1min"); // 1 min
createTimer2(Timer3Min, 3, "3min"); // 3 min
createTimer2(Timer5Min, 5, "5min"); // 5 min
createTimer2(Timer10Min, 10, "10min"); // 10 min



const timerTypes = ["30sec", "1min", "3min", "5min", "10min"];

const getTimerData = async (timerType) => {
  try {
    const TimerModel = {
      "1min": Timer1Min,
      "3min": Timer3Min,
      "5min": Timer5Min,
      "10min": Timer10Min,
      "30sec": Timer30Sec,
    }[timerType];

    if (!TimerModel) {
      throw new Error(`Invalid timer type: ${timerType}`);
    }

    const latestTimer = await TimerModel.findOne().sort({ _id: -1 }).limit(1);

    if (!latestTimer) {
      console.log(`No timer found for ${timerType}. Using current time.`);
      let currentPeriodId;
      try {
        currentPeriodId = generatePeriodId(timerType);
      } catch (error) {
        console.error(`Error generating period ID: ${error.message}`);
        currentPeriodId = "Loading..."; // Show loading state in UI
      }
      return {
        periodId: currentPeriodId,
        remainingTime: secondsToHms(
          calculateRemainingTime(currentPeriodId, timerType)
        ),
      };
    }

    const remainingTime = calculateRemainingTime(
      latestTimer.periodId,
      timerType
    );

    // Special handling for 30-second timer
    if (timerType === "30sec" && remainingTime <= 0) {
      let newPeriodId;
      try {
        newPeriodId = generatePeriodId("30sec");
      } catch (error) {
        console.error(`Error generating period ID: ${error.message}`);
        newPeriodId = "Loading..."; // Show loading state in UI
      }
      if (newPeriodId !== "Loading...") {
        await TimerModel.create({ periodId: newPeriodId });
      }
      return {
        periodId: newPeriodId,
        remainingTime: secondsToHms(30), // Reset to 30 seconds
      };
    }

    return {
      periodId: latestTimer.periodId,
      remainingTime: secondsToHms(remainingTime),
    };
  } catch (error) {
    console.error(`Error getting timer data for ${timerType}:`, error);
    return {
      periodId: "Loading...", // Show loading state in UI
      remainingTime: secondsToHms(calculateRemainingTime(null, timerType)), // Use existing logic
    };
  }
};

wss.on("connection", (ws) => {
  console.log("Client connected");

  const sendTimers = async () => {
    if (ws.readyState !== WebSocket.OPEN) {
      console.log("WebSocket is not open. Skipping sendTimers.");
      return;
    }

    try {
      const timers = await async.parallel(
        Object.fromEntries(
          timerTypes.map((type) => [type, async () => getTimerData(type)])
        )
      );

      ws.send(JSON.stringify({ timers }));
    } catch (error) {
      console.error("Error sending timers:", error);
    }
  };

  sendTimers(); // Send timers immediately on connection
  const intervalId = setInterval(sendTimers, 100); // Send timers every 100ms for more frequent updates

  ws.on("close", () => {
    console.log("Client disconnected");
    clearInterval(intervalId);
  });

  ws.on("error", (error) => {
    console.error("WebSocket error:", error);
    clearInterval(intervalId);
  });
});
runSalaryCronJob(wss);

module.exports = { setupWebSocket, wss };
