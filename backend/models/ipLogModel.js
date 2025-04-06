// models/ipLogModel.js
const mongoose = require("mongoose");

const ipLogSchema = new mongoose.Schema({
  userId: {
    type: String,
    required: true,
  },
  mobile: {
    type: String,
    required: true,
  },
  ipAddress: {
    type: String,
    required: true,
  },
  loginTime: {
    type: Date,
    default: Date.now,
  },
  userAgent: {
    type: String,
  },
  location: {
    type: String,
  },
});

module.exports = mongoose.model("IpLog", ipLogSchema);
