// routes/adminRoutes.js
const express = require("express");
const router = express.Router();
const WinProbabilitySettings = require("../../models/WinProbabilitySettings");

// Get win probability settings
router.get("/win-probability", async (req, res) => {
  try {
    let settings = await WinProbabilitySettings.findOne();

    if (!settings) {
      settings = await WinProbabilitySettings.create({
        singlePlayerWinProbability: 0.3,
      });
    }

    res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

// Update win probability settings
router.put("/win-probability", async (req, res) => {
  try {
    const { singlePlayerWinProbability } = req.body;

    // Validate input
    if (
      typeof singlePlayerWinProbability !== "number" ||
      singlePlayerWinProbability < 0 ||
      singlePlayerWinProbability > 1
    ) {
      return res.status(400).json({
        success: false,
        message: "Win probability must be a number between 0 and 1",
      });
    }

    let settings = await WinProbabilitySettings.findOne();

    if (!settings) {
      settings = new WinProbabilitySettings();
    }

    settings.singlePlayerWinProbability = singlePlayerWinProbability;
    settings.lastUpdated = Date.now();
    await settings.save();

    res.json({ success: true, settings });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Server error" });
  }
});

module.exports = router;
