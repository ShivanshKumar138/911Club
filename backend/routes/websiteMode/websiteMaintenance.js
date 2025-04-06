// routes/websiteMaintenance.js

const express = require("express");
const router = express.Router();
const WebsiteMaintenance = require("../../models/websiteModeModel");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");

// Ensure this middleware extracts the token correctly and attaches the user to the request object
router.get("/maintenance-mode", auth, async (req, res) => {
  try {
    // Fetch maintenance mode setting
    let maintenance = await WebsiteMaintenance.findOne();
    if (!maintenance) {
      // Create default record with maintenanceMode set to false
      maintenance = new WebsiteMaintenance({ maintenanceMode: false });
      await maintenance.save();
    }

    // Check if req.user exists and has accountType
    if (!req.user || !req.user.accountType) {
      return res.status(401).json({ message: "Unauthorized - Invalid account type." });
    }

    // Fetch user's account type from the authenticated user
    const accountType = req.user.accountType;

    // Return maintenance mode and account type
    res.json({
      maintenanceMode: maintenance.maintenanceMode,
      accountType: accountType,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

// Update maintenance mode
router.post("/maintenance-mode", auth, isAdmin, async (req, res) => {
  try {
    let maintenance = await WebsiteMaintenance.findOne();
    if (!maintenance) {
      // Create default record with maintenanceMode set to false
      maintenance = new WebsiteMaintenance({ maintenanceMode: false });
      await maintenance.save();
    }

    // Toggle maintenance mode
    maintenance.maintenanceMode = !maintenance.maintenanceMode;
    await maintenance.save();
    res.json({
      message: "Maintenance mode updated.",
      maintenanceMode: maintenance.maintenanceMode,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
});

module.exports = router;