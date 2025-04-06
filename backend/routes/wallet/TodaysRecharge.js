const Deposit = require("../../models/depositHistoryModel");
const express = require("express");
const router = express.Router();

router.get("/recharge-today", async (req, res) => {
  try {
    // Create a date object for IST (UTC+5:30)
    const indiaTime = new Date().toLocaleString('en-US', { 
      timeZone: 'Asia/Kolkata' 
    });
    const now = new Date(indiaTime);

    // Set start of day in IST
    const startTime = new Date(now);
    startTime.setHours(0, 0, 0, 0);

    // Set end of day in IST
    const endTime = new Date(now);
    endTime.setHours(23, 59, 59, 999);

    // Convert to UTC for MongoDB query
    const utcStartTime = new Date(startTime.getTime() - (5.5 * 60 * 60 * 1000));
    const utcEndTime = new Date(endTime.getTime() - (5.5 * 60 * 60 * 1000));

    // Debug logs
    console.log("\n=== Debug Info ===");
    console.log("Current IST:", now.toLocaleString('en-IN'));
    console.log("Query Range (IST):");
    console.log("Start:", startTime.toLocaleString('en-IN'));
    console.log("End:", endTime.toLocaleString('en-IN'));
    console.log("UTC Query Times:");
    console.log("Start UTC:", utcStartTime.toISOString());
    console.log("End UTC:", utcEndTime.toISOString());
    console.log("=================\n");

    // Fetch only today's deposits
    const successfulRecharges = await Deposit.find({
      depositDate: {
        $gte: utcStartTime,
        $lt: utcEndTime
      },
      depositStatus: "completed",
    }).populate({
      path: "userId",
      select: "accountType"
    });

    // Filter for Normal users
    const normalUserRecharges = successfulRecharges.filter(
      recharge => recharge.userId?.accountType === "Normal"
    );

    // Calculate totals
    const totalAmount = normalUserRecharges.reduce((sum, recharge) => 
      sum + recharge.depositAmount, 0);

    res.status(200).json({
      success: true,
      message: "Amount fetched successfully",
      totalRechargeAmount: totalAmount || 0,
      rechargeCount: normalUserRecharges.length || 0,
      dateRange: {
        start: startTime.toLocaleString('en-IN'),
        end: endTime.toLocaleString('en-IN')
      }
    });

  } catch (error) {
    console.error("Error fetching recharge data:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

module.exports = router;