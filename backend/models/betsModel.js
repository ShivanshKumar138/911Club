const mongoose = require("mongoose");

const betSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  orderId: String,
  selectedItem: String,
  betAmount: Number,
  multiplier: Number,
  totalBet: Number,
  tax: Number,
  fee: { type: String, default: "2%" },
  selectedTimer: String,
  periodId: Number,
  timestamp: { type: Date, default: Date.now },
  result: String,
  status: { type: String, default: "Loading" },
  winLoss:Number,
  isIllegal: { type: Boolean, default: false },
  userType: String,
  // Add to each bet model schema:
betSource: {
  type: String,
  enum: ['deposit', 'winning', 'partial'],
  required: true
},
  betSourceAmount: Number,
  // Add any other fields specific to the bet model here
});

const Bet = mongoose.model("Bet", betSchema);

module.exports = Bet;
