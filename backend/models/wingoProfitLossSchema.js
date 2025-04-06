const mongoose = require('mongoose');

const wingoProfitLossSchema = new mongoose.Schema({
  periodId: {
    type: String,
    required: true,
    index: true
  },
  timerType: {
    type: String,
    enum: ['30sec', '1min', '3min', '5min', '10min'],
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

module.exports = mongoose.model('WingoProfitLoss', wingoProfitLossSchema);