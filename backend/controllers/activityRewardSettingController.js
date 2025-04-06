const ActivityRewardSetting = require("../models/ActivityRewardSetting");
const User = require("../models/userModel");
const moment = require("moment")
const TransactionHistory = require("../models/TransictionHistory")
const { addTransactionDetails } = require('../controllers/TransactionHistoryControllers'); // Update the path as needed

// Create a new activity reward setting
exports.createSetting = async (req, res) => {
  try {
    const { minimumBettingAmount, activityAward } = req.body;
    const newSetting = new ActivityRewardSetting({
      minimumBettingAmount,
      activityAward,
    });
    await newSetting.save();
    return res
      .status(201)
      .json({ msg: "Activity Reward Setting created", data: newSetting });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error creating activity reward setting", error });
  }
};

// Get all activity reward settings sorted by minimumBettingAmount in ascending order
exports.getAllSettings = async (req, res) => {
    try {
      const settings = await ActivityRewardSetting.find().sort({ minimumBettingAmount: 1 });
      return res
        .status(200)
        .json({ msg: "All activity reward settings", data: settings });
    } catch (error) {
      return res
        .status(500)
        .json({ msg: "Error fetching activity reward settings", error });
    }
  };
  
// Update an activity reward setting
exports.updateSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const { minimumBettingAmount, activityAward } = req.body;
    const updatedSetting = await ActivityRewardSetting.findByIdAndUpdate(
      id,
      { minimumBettingAmount, activityAward },
      { new: true }
    );
    if (!updatedSetting) {
      return res.status(404).json({ msg: "Activity Reward Setting not found" });
    }
    return res
      .status(200)
      .json({ msg: "Activity Reward Setting updated", data: updatedSetting });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error updating activity reward setting", error });
  }
};

// Delete an activity reward setting
exports.deleteSetting = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedSetting = await ActivityRewardSetting.findByIdAndDelete(id);
    if (!deletedSetting) {
      return res.status(404).json({ msg: "Activity Reward Setting not found" });
    }
    return res
      .status(200)
      .json({ msg: "Activity Reward Setting deleted", data: deletedSetting });
  } catch (error) {
    return res
      .status(500)
      .json({ msg: "Error deleting activity reward setting", error });
  }
};




const calculateTotalBetAmount = async (userId) => {
    try {
      const startOfDay = moment().startOf('day').toDate();
      const endOfDay = moment().endOf('day').toDate();
  
      // Fetch all transactions for the user on the current day
      const transactions = await TransactionHistory.find({
        user: userId, // Ensure ObjectId conversion
        date: { $gte: startOfDay, $lt: endOfDay }
      });
  
      // Filter transactions by type and compute total bet amount
      const filteredTransactions = transactions.filter(transaction =>
        ["WingoBet", "K3Bet", "TRXBet"].includes(transaction.type)
      );
  
      const totalBetAmount = filteredTransactions.reduce((total, transaction) => total + transaction.betAmount, 0);
  
      return totalBetAmount;
    } catch (error) {
      console.error("Error fetching total bet amount:", error);
      throw new Error("Error fetching total bet amount");
    }
  };
  

  exports.claimReward = async (req, res) => {
    try {
      const userId = req.user.id;
      const { settingId } = req.body;
  
      console.log(`User ID: ${userId}`);
      console.log(`Setting ID: ${settingId}`);
  
      if (!settingId) {
        console.log("Error: Setting ID is missing in the request body");
        return res.status(400).json({ msg: "Setting ID is required" });
      }
  
      // Fetch user and activity reward setting
      const user = await User.findById(userId);
      const setting = await ActivityRewardSetting.findById(settingId);
  
      console.log("User fetched:", user);
      console.log("Setting fetched:", setting);
  
      if (!user) {
        console.log("Error: User not found");
        return res.status(404).json({ msg: "User not found" });
      }
  
      if (!setting) {
        console.log("Error: Activity reward setting not found");
        return res.status(404).json({ msg: "Activity reward setting not found" });
      }
  
      // Check if the user has already claimed this reward for today
      const claimedToday = user.claims.some(claim => 
        claim.cardId === settingId && 
        new Date(claim.date).toDateString() === new Date().toDateString()
      );
  
      console.log("Claimed Today:", claimedToday);
  
      if (claimedToday) {
        console.log("Error: Reward already claimed for today");
        return res.status(400).json({ msg: "Reward already claimed for today" });
      }
  
      // Check if the user meets the minimum betting amount
      const totalBetAmount = await calculateTotalBetAmount(userId);
  
      console.log("Total Bet Amount:", totalBetAmount);
  
      if (totalBetAmount < setting.minimumBettingAmount) {
        console.log("Error: Total bet amount is less than the minimum required");
        return res.status(400).json({ msg: "Total bet amount is less than the minimum required" });
      }
  
      // Add the activity award to the user's wallet
      user.walletAmount += setting.activityAward;
      console.log("New Wallet Amount:", user.walletAmount);
  
      // Push the claim with all required fields
      const newClaim = {
        cardId: settingId,
        activityAward: setting.activityAward,
        date: new Date(), // Current date and time
      };
      
      console.log("Adding New Claim:", newClaim);
      user.claims.push(newClaim);
  
      // Save user and add transaction
      await user.save();
      console.log("User updated successfully");
  
      // Add transaction details
      await addTransactionDetails(
        userId,
        setting.activityAward,
        "DailyReward",
        new Date(), // Use current date for transaction
        0, // Deposit amount, if any
        0, // Bet amount, if any
        "N/A", // Game type, if any
        null, // Commission from user, if any
        0, // Deposit amount of user, if any
        0, // Commission level, if any
        "notDepositYet" // First deposit checker, if any
      );
      console.log("Transaction recorded successfully");
  
      return res.status(200).json({ msg: "Reward claimed successfully", award: setting.activityAward });
    } catch (error) {
      console.error("Error claiming reward:", error);
      return res.status(500).json({ msg: "Error claiming reward", error });
    }
  };
// Controller function to get claimed rewards
exports.getClaimedRewards = async (req, res) => {
    try {
      console.log("Fetching claimed rewards...");
  
      // Extract user ID from the request (assuming it's available in req.user after authentication)
      const userId = req.user._id;
      console.log(`User ID extracted: ${userId}`);
  
      // Fetch user from database
      const user = await User.findById(userId);
      console.log("User fetched:");
  
      // Check if user exists
      if (!user) {
        console.log("Error: User not found");
        return res.status(404).json({ message: 'User not found' });
      }
  
      // Get claimed rewards
      const claimedRewards = user.claims;
      console.log("Claimed rewards fetched:", claimedRewards);
  
      // Respond with the claimed rewards
      res.status(200).json({ claimedRewards });
    } catch (error) {
      console.error('Error fetching claimed rewards:', error);
      res.status(500).json({ message: 'Internal server error' });
    }
  };

// Controller function to get rewards based on period
exports.getRewardsByPeriod = async (req, res) => {
    const { period } = req.params;
    const userId = req.user._id; // Assuming userId is obtained from req.user after authentication

    try {
        // Determine the date range based on the period
        let startDate, endDate;
        if (period === 'daily') {
            startDate = moment().startOf('day').toDate();
            endDate = moment().endOf('day').toDate();
        } else if (period === 'weekly') {
            startDate = moment().startOf('week').toDate();
            endDate = moment().endOf('week').toDate();
        } else {
            return res.status(400).json({ message: 'Invalid period' });
        }

        // Fetch user from database
        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ message: 'User not found' });
        }

        // Filter claims based on the date range
        const claims = user.claims.filter(claim => 
            moment(claim.date).isBetween(startDate, endDate, null, '[]')
        );

        // Respond with the claims
        res.status(200).json({ claims });
    } catch (error) {
        console.error('Error fetching rewards:', error);
        res.status(500).json({ message: 'Internal server error' });
    }
};