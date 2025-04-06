const express = require('express');
const router = express.Router();
const auth = require('../middlewares/auth'); // Assuming your auth middleware is in the 'middleware' folder
const FiveDResult = require("../models/5DResultModel");
// Get a user's bets by user ID (protected route)
router.get("/5dgameresult", auth, async (req, res) => {
    try {
      const { selectedTimer } = req.query; // Get selectedTimer from query parameters
  
      // Ensure the selectedTimer query parameter is provided
      if (!selectedTimer) {
        return res.status(400).json({
          success: false,
          message: "selectedTimer is required",
        });
      }
  
      // Find the latest 50 5D results filtered by selectedTimer, sorted by timestamp
      const latestResults = await FiveDResult.find({ timerName: selectedTimer })
        .sort({ _id: -1 }) // Sort by _id in descending order (latest results first)
        .limit(50); // Limit the results to 50
  
      res.status(200).json({
        success: true,
        message: "Latest 50 5D results fetched successfully",
        results: latestResults,
      });
    } catch (error) {
      console.error("Error fetching latest 5D results:", error);
      res.status(500).json({
        success: false,
        message: "Server error while fetching latest 5D results",
        error: error.message,
      });
    }
  });
  module.exports = router;