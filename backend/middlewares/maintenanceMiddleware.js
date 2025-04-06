// middleware/maintenanceMiddleware.js
const WebsiteMaintenance = require("../models/websiteModeModel");

const checkMaintenanceMode = async (req, res, next) => {
  try {
    console.log("Hiiii")
    const maintenance = await WebsiteMaintenance.findOne();
    if (!maintenance) {
      return res
        .status(500)
        .json({ message: "Maintenance setting not found." });
    }
    console.log(maintenance)

    const isMaintenanceMode = maintenance.maintenanceMode;
    console.log(isMaintenanceMode)
    const userRole = req.user.accountType; // Get the user's role (ensure this is set in your auth middleware)
    console.log(userRole)

    if (isMaintenanceMode && userRole !== "Admin") {
      return res
        .status(503)
        .json({
          message: "Server is under maintenance. Please try again later.",
        });
    }

    next(); // Proceed to the next middleware/route
  } catch (error) {
    res.status(500).json({ message: "Server error", error });
  }
};

module.exports = checkMaintenanceMode;
