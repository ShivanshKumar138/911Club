// routes/admin/ipLogRoutes.js
const express = require("express");
const router = express.Router();
const IpLog = require("../../models/ipLogModel");
const moment = require("moment-timezone");
const { Parser } = require("json2csv");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
// Middleware to verify admin rights

// Get IP logs with pagination and filtering
router.get("/ip-logs", async (req, res) => {
  try {
    const { page = 1, limit = 10, startDate, endDate, filter } = req.query;

    // Build query
    const query = {};

    // Date range
    if (startDate && endDate) {
      query.loginTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // Filter by mobile or IP
    if (filter) {
      query.$or = [
        { mobile: { $regex: filter, $options: "i" } },
        { ipAddress: { $regex: filter, $options: "i" } },
      ];
    }

    // Get total count
    const total = await IpLog.countDocuments(query);

    // Get paginated results
    const logs = await IpLog.find(query)
      .sort({ loginTime: -1 })
      .skip((page - 1) * limit)
      .limit(parseInt(limit))
      .lean();

    res.json({
      logs,
      total,
      page: parseInt(page),
      limit: parseInt(limit),
      totalPages: Math.ceil(total / limit),
    });
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

// Export IP logs as CSV
router.get("/ip-logs/export", async (req, res) => {
  try {
    const { startDate, endDate, filter } = req.query;

    // Build query
    const query = {};

    // Date range
    if (startDate && endDate) {
      query.loginTime = {
        $gte: new Date(startDate),
        $lte: new Date(endDate + "T23:59:59.999Z"),
      };
    }

    // Filter by mobile or IP
    if (filter) {
      query.$or = [
        { mobile: { $regex: filter, $options: "i" } },
        { ipAddress: { $regex: filter, $options: "i" } },
      ];
    }

    // Get all matching logs
    const logs = await IpLog.find(query).sort({ loginTime: -1 }).lean();

    // Format dates
    const formattedLogs = logs.map((log) => ({
      ...log,
      loginTime: moment(log.loginTime).format("YYYY-MM-DD HH:mm:ss"),
    }));

    // Convert to CSV
    const fields = ["userId", "mobile", "ipAddress", "loginTime", "userAgent"];
    const json2csvParser = new Parser({ fields });
    const csv = json2csvParser.parse(formattedLogs);

    // Set headers for file download
    res.header("Content-Type", "text/csv");
    res.attachment(`ip-logs-${startDate}-to-${endDate}.csv`);

    res.send(csv);
  } catch (err) {
    console.error(err);
    res.status(500).json({ msg: "Server Error" });
  }
});

module.exports = router;
