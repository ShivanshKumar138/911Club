const mongoose = require("mongoose");
const SpinnerWheel = require("../../models/SpinnerModel"); // Adjust path as needed
const AdminTaskControl = require("../../models/SpinTaskModel"); // Adjust path as needed
const DepositHistory = require("../../models/depositHistoryModel"); // Adjust path as needed

async function getCumulativeDepositAmount(userId) {
  console.log("Fetching cumulative deposit for userId:", userId);

  // Find deposits to check if there are any completed deposits
  const deposits = await DepositHistory.find({
    userId: new mongoose.Types.ObjectId(userId),
    depositStatus: "completed",
  });

  console.log("Completed deposits found:", deposits);

  // Log the count of deposits found
  console.log("Number of completed deposits:", deposits.length);

  // Define the aggregation pipeline
  const pipeline = [
    {
      $match: {
        userId: new mongoose.Types.ObjectId(userId),
        depositStatus: "completed",
      },
    },
    {
      $group: {
        _id: null,
        totalDeposit: { $sum: "$depositAmount" },
      },
    },
  ];

  // Execute the aggregation
  const result = await DepositHistory.aggregate(pipeline);
  console.log("Aggregation result:", result);

  // Return the total deposit or 0 if none
  return result[0] ? result[0].totalDeposit : 0;
}

async function calculateAndUpdateSpins(userId, depositAmount) {
  try {
    // Get the user's current total deposit amount
    const cumulativeDepositAmount = await getCumulativeDepositAmount(userId);
    const newCumulativeDepositAmount = cumulativeDepositAmount + depositAmount;
    console.log(
      `New cumulative deposit amount for userId ${userId}: ${newCumulativeDepositAmount}`
    );

    // Fetch the admin task control document
    const adminTask = await AdminTaskControl.findOne();
    if (!adminTask || !adminTask.work || adminTask.work.length === 0) {
      console.error("Admin task control not found or work array is empty");
      return { success: false, message: "No task available", spinsAdded: 0 };
    }

    // Find the highest applicable task based on cumulative deposit amount
    let applicableTask = null;

    // Sort tasks by task amount in descending order
    const sortedTasks = adminTask.work.sort((a, b) => b.task - a.task);

    for (const work of sortedTasks) {
      if (newCumulativeDepositAmount >= work.task) {
        applicableTask = work;
        break; // Stop at the first (highest) matching task
      }
    }

    // Check if any applicable task was found
    if (!applicableTask) {
      return {
        success: false,
        message: "Deposit amount doesn't qualify for any spins",
        spinsAdded: 0,
      };
    }

    console.log(`Found applicable task: ${JSON.stringify(applicableTask)}`);

    // Find or create the SpinnerWheel document
    let spinnerWheel = await SpinnerWheel.findOne({ uid: userId });

    if (!spinnerWheel) {
      // Create a new SpinnerWheel document for the user
      spinnerWheel = new SpinnerWheel({
        uid: userId,
        numberOfSpins: 0,
        SpinHave: applicableTask.NumberOfSpin,
        depositMadeToday: newCumulativeDepositAmount,
      });
    } else {
      // Update the existing SpinnerWheel document
      const previousSpins = spinnerWheel.SpinHave;
      spinnerWheel.SpinHave = applicableTask.NumberOfSpin;
      spinnerWheel.depositMadeToday = newCumulativeDepositAmount;
    }

    // Save the updated SpinnerWheel document
    await spinnerWheel.save();

    return {
      success: true,
      message: "Spins calculated and updated successfully",
      spinsAdded: applicableTask.NumberOfSpin - (spinnerWheel.SpinHave || 0),
      totalSpins: spinnerWheel.SpinHave,
    };
  } catch (error) {
    console.error("Error in calculateAndUpdateSpins:", error);
    throw error;
  }
}

module.exports = calculateAndUpdateSpins;