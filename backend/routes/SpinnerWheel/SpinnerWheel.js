const express = require("express");
const router = express.Router();
const cron = require("node-cron");
const mongoose = require("mongoose");
const User = require("../../models/userModel");
const SpinnerWheel = require("../../models/SpinnerModel");
const AdminTaskControl = require("../../models/SpinTaskModel");
const DepositHistory = require("../../models/depositHistoryModel");
const auth = require("../../middlewares/auth");
const moment = require("moment");
const SpinnerHistory = require("../../models/SpinnerHistory");

// Function to get today's deposit amount
// async function getTodaysDepositAmount(userId) {
//   console.log(`Getting today's deposit amount for user ${userId}...`);
//   const pipeline = [
//     {
//       $match: {
//         userId: new mongoose.Types.ObjectId(userId),
//         depositDate: {
//           $gte: new Date(new Date().setHours(0, 0, 0, 0)),
//           $lt: new Date(new Date().setHours(23, 59, 59, 999)),
//         },
//         depositStatus: "completed",
//       },
//     },
//     {
//       $group: {
//         _id: null,
//         depositAmount: { $sum: "$depositAmount" },
//       },
//     },
//   ];

//   const result = await DepositHistory.aggregate(pipeline);
//   console.log(
//     `Today's deposit amount for user ${userId}: ${
//       result[0] ? result[0].depositAmount : 0
//     }`
//   );
//   return result[0] ? result[0].depositAmount : 0;
// }

// // Function to check if user has betted the required amount
// async function hasUserBettedRequiredAmount(userId, requiredAmount) {
//   console.log(
//     `Checking if user ${userId} has betted the required amount of ${requiredAmount}...`
//   );
//   const todaysDepositAmount = await getTodaysDepositAmount(userId);
//   console.log(`User  ${userId} has betted ${todaysDepositAmount} today.`);
//   if (todaysDepositAmount >= requiredAmount) {
//     console.log(`User  ${userId} has betted the required amount.`);
//     return true;
//   } else {
//     console.log(`User  ${userId} has not betted the required amount.`);
//     return false;
//   }
// }

// Function to spin the wheel
let winningSection
 
async function spinTheWheel(userId) {
  console.log(`Spinning the wheel for user ${userId}...`);
  const tasks = await AdminTaskControl.findOne();
  const work = tasks.work;
  const winningAmounts = tasks.winningAmount;
  const sections = Object.keys(winningAmounts);

  // Sort the sections by amount in ascending order
  const sortedSections = sections.sort((a, b) => {
    const amountA =
      typeof winningAmounts[a] === "number" ? winningAmounts[a] : 0;
    const amountB =
      typeof winningAmounts[b] === "number" ? winningAmounts[b] : 0;
    return amountA - amountB;
  });

  // Assign percentages to each section
  const sectionPercentages = {};
  sectionPercentages[sortedSections[0]] = 50;
  sectionPercentages[sortedSections[1]] = 5;
  sectionPercentages[sortedSections[2]] = 5;
  for (let i = 3; i < sortedSections.length; i++) {
    sectionPercentages[sortedSections[i]] =
      sortedSections[i] === "section8" ? 40 : 0;
  }

  // Check if the user has available spins
  const spinnerWheel = await SpinnerWheel.findOne({ uid: userId });
  if (!spinnerWheel || spinnerWheel.SpinHave <= 0) {
    console.log(`User ${userId} has no available spins.`);
    console.log("Developer Bolte:",spinnerWheel)
    return { error: 'No spins available' };
  }
 

  // Determine the winning section using weighted random selection
  winningSection = weightedRandom(sectionPercentages);
  console.log(`User ${userId} has won ${winningSection} section.`);

  // Update the user's wallet amount
  const user = await User.findById(userId);
  const winningAmount = winningAmounts[winningSection];

  if (
    winningSection !== "section8" &&
    typeof winningAmount === "number" &&
    !isNaN(winningAmount)
  ) {
    user.walletAmount += winningAmount;
    await user.save();
    console.log(
      `User ${userId} has won ${winningAmount} and their new wallet amount is ${user.walletAmount}.`
    );
  } else if (winningSection === "section8") {
    console.log(`User ${userId} landed on section8: ${winningAmount}`);
  } else {
    console.error(`Invalid winning amount: ${winningAmount}`);
    return null;
  }

  // Update the spinner wheel document
  spinnerWheel.numberOfSpins += 1;
  spinnerWheel.SpinHave -= 1;
  if (winningSection !== "section8") {
    spinnerWheel.todayRewardMoney += winningAmount;
  }
  await spinnerWheel.save();

  console.log(
    `User ${userId} has spin the wheel and won ${winningAmounts[winningSection]}.`
  );
  return { reward: winningAmounts[winningSection] };
}

// Function to generate random number with specific probabilities
function weightedRandom(sectionPercentages) {
  // Create an array where each element is repeated a number of times equal to its probability
  const weightedSections = [];
  for (const section in sectionPercentages) {
    for (let i = 0; i < sectionPercentages[section] * 10; i++) {
      weightedSections.push(section);
    }
  }

  // Generate a random index into the weightedSections array
  const randomIndex = Math.floor(Math.random() * weightedSections.length);

  // Select the winning section based on the random index
  const winningSection = weightedSections[randomIndex];

  return winningSection;
}

async function resetSpinnerWheel() {
  console.log("Resetting SpinnerWheel documents...");
  await SpinnerWheel.updateMany(
    {},
    {
      $set: {
        depositMadeToday: 0,
        todayRewardMoney: 0,
        numberOfSpins: 0,
      },
    }
  );
  console.log("SpinnerWheel documents reset successfully.");
}

// Set the cron job to run every day at 12:00 AM
"0 0 * * *", resetSpinnerWheel;

router.post("/spin-wheel", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch the user's spinner wheel record
    const spinnerWheel = await SpinnerWheel.findOne({
      uid: new mongoose.Types.ObjectId(userId),
    });

    if (!spinnerWheel || spinnerWheel.SpinHave <= 0) {
      return res.status(400).send({
        message:
          "You have no available spins. Make a deposit to get more spins!",
        
      });
    }

    // Calculate remaining spins (subtract used spins from eligible spins)
    const remainingSpins = spinnerWheel.SpinHave;
    spinnerWheel.SpinHave = remainingSpins;
    await spinnerWheel.save(); // Save the updated spins count

    // Spin the wheel logic (replace this with your actual spinning logic)
    let result = await spinTheWheel(userId);
    let prize = result !== "section8" ? result.reward : "Better Luck Next Time! bro"; // Assign 0 if result is 'section8'
    let rewardType = result !== "section8" ? "Money" : "Nothing!!"; // Adjust the rewardType

    // Create a new SpinnerHistory entry
    let historyPrize = prize;
    let historyRewardType = rewardType;
    if (isNaN(prize)) {
      historyPrize = "Better Luck Next Time";
      historyRewardType = "Nothing!!";
    }

    const spinnerHistoryEntry = new SpinnerHistory({
      spinTime: new Date(), // Current time as spin time
      prize: historyPrize, // Ensure prize is a number
      rewardType: historyRewardType,
      userId: userId, // Reference to the user
    });

    // Save the spinner history
    await spinnerHistoryEntry.save();

    // Send response based on the spin result
    if (result !== "section8") {
      res.send({
        message: `You have won ${prize} in the spin.`,
        remainingSpins: spinnerWheel.SpinHave,
        depositMadeToday: spinnerWheel.depositMadeToday,
        SpinHave: spinnerWheel.SpinHave,
        numberOfSpins: spinnerWheel.numberOfSpins,
        winningSection
      });
    } else {
      res.send({
        message: `Oh sorry, ${result}.`,
        remainingSpins: spinnerWheel.SpinHave,
      });
    }
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});



router.get("/spin-history", auth, async (req, res) => {
  try {
    const userId = req.user._id;

    // Fetch today's spinning result
    const todayStart = new Date(new Date().setHours(0, 0, 0, 0));
    const todayEnd = new Date(new Date().setHours(23, 59, 59, 999));

    const todaySpinHistory = await SpinnerHistory.find({
      userId: new mongoose.Types.ObjectId(userId),
      spinTime: {
        $gte: todayStart,
        $lt: todayEnd,
      },
    });

    // Fetch all-time spinning result
    const allTimeSpinHistory = await SpinnerHistory.find({
      userId: new mongoose.Types.ObjectId(userId),
    }).sort({ createdAt: -1 }); // Sort by createdAt timestamp in descending order (most recent first)

    // If no history is found for the user
    if (!todaySpinHistory.length && !allTimeSpinHistory.length) {
      return res.status(404).send({
        message: "No spinning history found.",
      });
    }

    const formattedTodaySpins = todaySpinHistory.map((spin) => {
      return {
        spinTime: moment(spin.createdAt).format("YYYY-MM-DD h:mm A"), // Format createdAt timestamp in 12-hour format (e.g., 2023-03-15 12:00 PM)
        rewardType: spin.rewardType,
        prize: spin.prize,
      };
    });
    // Map all-time spins if needed (optional)
    const formattedAllTimeSpins = allTimeSpinHistory.map((spin) => ({
      spinTime: moment(spin.createdAt).format("YYYY-MM-DD h:mm A"), // Format createdAt timestamp in 12-hour format (e.g., 2023-03-15 12:00 PM)
      rewardType: spin.rewardType,
      prize: spin.prize,
    }));

    // Respond with today's and overall history
    res.send({
      message: "Spinning history retrieved successfully.",
      todaySpins: formattedTodaySpins, // Today's spins with required fields
      allTimeSpins: formattedAllTimeSpins, // Overall spins
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});

router.get("/spin-info", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Directly using req.user._id

    // Fetch the user's spinner wheel record using the user ID
    const spinnerWheel = await SpinnerWheel.findOne({
      uid: userId, // No need for mongoose.Types.ObjectId
    });

    if (!spinnerWheel) {
      return res.status(404).send({
        message: "No spin data available for this user.",
      });
    }

    // Send the relevant data
    res.send({
      depositMadeToday: spinnerWheel.depositMadeToday,
      SpinHave: spinnerWheel.SpinHave,
      numberOfSpins: spinnerWheel.numberOfSpins,
    });
  } catch (error) {
    console.error(error);
    res.status(500).send({ message: "Internal Server Error" });
  }
});


module.exports = router;