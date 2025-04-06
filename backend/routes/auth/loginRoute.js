const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
require("dotenv").config();
const moment = require("moment-timezone");
const { addNotification } = require("../../controllers/NotificationController");

router.post("/login", async (req, res) => {
  try {
    console.log("Login route hit");
    const { mobile, password } = req.body;
    console.log(mobile, password);
    if (!mobile || !password) {
      return res.status(400).json({ msg: "All fields are required" });
    }
    const user = await User.findOne({ mobile });
    if (!user) {
      return res.status(400).json({ msg: "User does not exist" });
    }

    // Check if the user's account is locked
    if (user.locked) {
      return res.status(403).json({ msg: "Your account is locked" });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ msg: "Invalid credentials" });
    }
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "10h",
    });
    user.token = token;
    user.password = undefined;
    const now = new Date();

    const ipAddress =
      req.headers["x-forwarded-for"] || req.connection.remoteAddress;
    const IpLog = require("../../models/ipLogModel");
    await new IpLog({
      userId: user.uid,
      mobile: user.mobile,
      ipAddress: ipAddress,
      userAgent: req.headers["user-agent"] || "Unknown",
    }).save();

    await addNotification(
      user._id,
      "Login Successful",
      "You have logged in successfully."
    );
    const updatedUser = await User.findOneAndUpdate(
      { mobile },
      { $set: { lastLoginTime: now } },
      { new: true }
    );
    const option = {
      expires: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000),
      httpOnly: true,
    };
    res.status(200).cookie("token", token, option).json({
      success: true,
      token,
      user,
    });
  } catch (err) {
    console.log(err);
    res.status(500).json({ msg: "Server Error" });
  }
});
module.exports = router;
