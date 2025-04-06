// Import required modules and middlewares
const express = require("express");
const User = require("../../models/userModel"); // Adjust the path as necessary
const auth = require("../../middlewares/auth");
const AppConfig = require('../../models/AppConfig'); // Use your AppConfig schema
const {isAdmin} = require("../../middlewares/roleSpecificMiddleware");
const InvitationBonus = require("../../models/invitationBonusSchema");
const { log } = require("console");
const router = express.Router();


// POST route to toggle needToDepositFirst in AppConfig
router.post('/update-need-to-deposit-first', auth, isAdmin, async (req, res) => {
  try {
    // Find the AppConfig document or create one if it doesn't exist
    let appConfig = await AppConfig.findOne();
    if (!appConfig) {
      appConfig = new AppConfig();
    }

    // Toggle the needToDepositFirst value
    appConfig.needToDepositFirst = !appConfig.needToDepositFirst;
    
    // Save the updated config
    await appConfig.save();

    // Respond with success and the updated config
    return res.status(200).json({
      success: true,
      message: 'needToDepositFirst value updated successfully',
      data: {
        needToDepositFirst: appConfig.needToDepositFirst
      }
    });

  } catch (error) {
    console.error('Error updating needToDepositFirst:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});

// GET route to retrieve current needToDepositFirst value
router.get('/need-to-deposit-first', auth, async (req, res) => {
  try {
    const appConfig = await AppConfig.findOne() || new AppConfig();
    
    return res.status(200).json({
      success: true,
      data: {
        needToDepositFirst: appConfig.needToDepositFirst
      }
    });
  } catch (error) {
    console.error('Error fetching needToDepositFirst:', error);
    return res.status(500).json({
      success: false,
      message: 'Server Error',
      error: error.message
    });
  }
});



// Define the endpoint for setting/updating invitation bonus rules
router.post("/invitation-bonus", auth, isAdmin, async (req, res) => {
  try {
    const { minSubordinates, minDepositAmount, bonusAmount } = req.body;

    console.log("Received request:", { minSubordinates, minDepositAmount, bonusAmount });

    // Check if the `minSubordinates` value exists in the database
    const existingEntry = await InvitationBonus.findOne({ minSubordinates: minSubordinates });

    if (existingEntry) {
      // Update the `minDepositAmount` for the existing entry
      existingEntry.minDepositAmount = minDepositAmount;
      await existingEntry.save();

      console.log("Entry with the same minSubordinates already exists:", existingEntry);
      res.status(200).json({
        message: `Updated minDepositAmount to ${minDepositAmount} for the entry with minSubordinates: ${minSubordinates}.`,
      });
    } else {
      // If no entry exists with the given `minSubordinates`, create a new one
      console.log("No entry found with the given minSubordinates. Creating new entry...");
      const newBonusRule = new InvitationBonus({
        minSubordinates,
        minDepositAmount,
        bonusAmount,
      });

      const savedBonusRule = await newBonusRule.save();
      console.log("New rule created:", savedBonusRule);

      res.status(201).json({
        message: `New invitation bonus rule created.`,
        data: savedBonusRule,
      });
    }
  } catch (error) {
    console.error("Error updating invitation bonus rules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});




// Define the endpoint to delete a specific invitation bonus rule
router.delete("/invitation-bonus/:minSubordinates", auth, isAdmin, async (req, res) => {
  try {
    const { minSubordinates } = req.params;

    // Find and delete the entry with the given minSubordinates
    const deletedEntry = await InvitationBonus.findOneAndDelete({ minSubordinates: minSubordinates });

    if (!deletedEntry) {
      return res.status(404).json({ message: "Invitation bonus rule not found." });
    }

    console.log("Deleted rule:", deletedEntry);
    res.status(200).json({
      message: `Invitation bonus rule with minSubordinates: ${minSubordinates} deleted successfully.`,
      data: deletedEntry,
    });
  } catch (error) {
    console.error("Error deleting invitation bonus rule:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});



// Define the endpoint to get the current invitation bonus rules
router.get("/invitation-bonus", auth, isAdmin, async (req, res) => {
  try {
    // Fetch the invitation bonus rules from the database, sorted by minSubordinates in ascending order
    const rules = await InvitationBonus.find().sort({ minSubordinates: 1 });

    // If no rule is found, return a 404
    if (rules.length === 0) {
      return res.status(404).json({ message: "Invitation bonus rules not found." });
    }

    // Send the rules as the response
    res.status(200).json({
      message: "Invitation bonus rules retrieved successfully",
      data: rules,
    });
  } catch (error) {
    // Handle any errors
    console.error("Error fetching invitation bonus rules:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});


// Define the endpoint to get all users with "Normal" account type
router.get("/users/normal", auth, isAdmin, async (req, res) => {
  try {
    // Query the database to find users with accountType "Normal"
    const users = await User.find({ accountType: "Normal" }).select("-password -plainPassword"); // Exclude sensitive fields

    // Send the users data as the response
    res.status(200).json(users);
  } catch (error) {
    // Handle any errors that occur during the database query
    console.error("Error fetching normal users:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
