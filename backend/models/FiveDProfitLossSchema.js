// 5D Profit and Loss Schema
const mongoose = require("mongoose");

const fiveDProfitLossSchema = new mongoose.Schema({
  periodId: { type: String, required: true, unique: true },
  timerType: {
    type: String,
    enum: ["1min", "3min", "5min", "10min"],
    required: true,
  },
  totalBetAmount: { type: Number, required: true, default: 0 },
  totalTaxAmount: { type: Number, required: true, default: 0 },
  totalWinAmount: { type: Number, required: true, default: 0 },
  profitLoss: { type: Number, required: true, default: 0 },
  createdAt: { type: Date, default: Date.now },
});
module.exports = mongoose.model("FiveDProfitLoss", fiveDProfitLossSchema);
