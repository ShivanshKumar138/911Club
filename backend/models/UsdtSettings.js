const mongoose = require("mongoose");

const settingsSchema = new mongoose.Schema({
  isUsdt: { type: Boolean, default: false },
  withdrawalStartHour: { type: Number, default: 8 },
  withdrawalStartPeriod: { type: String, enum: ["AM", "PM"], default: "AM" },
  withdrawalEndHour: { type: Number, default: 9 },
  withdrawalEndPeriod: { type: String, enum: ["AM", "PM"], default: "PM" },
  maxWithdrawRequestsPerDay: { type: Number, default: 3 },
  minWithdrawAmount: { type: Number, default: 110 },
  maxWithdrawAmount: { type: Number, default: 100000 },
});

module.exports = mongoose.model("UsdtSettings", settingsSchema);
