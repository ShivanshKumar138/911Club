const express = require("express");
const router = express.Router();
const K3Result = require("../models/K3ResultModel");
const auth = require("../middlewares/auth");

// Route to fetch the latest 50 results based on selectedTimer
router.get("/k3gameresult", auth, async (req, res) => {
  try {
    const { selectedTimer } = req.query; // Get selectedTimer from query parameters

    // Ensure the selectedTimer query parameter is provided
    if (!selectedTimer) {
      return res.status(400).json({
        success: false,
        message: "selectedTimer is required",
      });
    }

    // Find the latest 50 results filtered by selectedTimer, sorted by timestamp
    const latestResults = await K3Result.find({ timerName: selectedTimer })
      .sort({_id: -1 }) // Sort by timestamp in descending order
      .limit(50); // Limit the results to 50

    res.status(200).json({
      success: true,
      message: "Latest 50 results fetched successfully",
      results: latestResults,
    });
  } catch (error) {
    console.error("Error fetching latest results:", error);
    res.status(500).json({
      success: false,
      message: "Server error while fetching latest results",
      error: error.message,
    });
  }
});

module.exports = router;
