const mongoose = require('mongoose');

const k3ProfitLossSchema = new mongoose.Schema({
  periodId: {
    type: String,
    required: true,
    index: true
  },
  timerType: {
    type: String,
    enum: ['1min', '3min', '5min', '10min'],
    required: true
  },
  totalBetAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalTaxAmount: {
    type: Number,
    required: true,
    default: 0
  },
  totalWinAmount: {
    type: Number,
    required: true,
    default: 0
  },
  profitLoss: {
    type: Number,
    required: true,
    default: 0
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('K3ProfitLoss', k3ProfitLossSchema);