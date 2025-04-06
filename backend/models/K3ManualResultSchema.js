const mongoose = require('mongoose');

const K3ManualResultSchema = new mongoose.Schema({
  timerName: {
    type: String,
    required: true,
  },
  periodId: {
    type: String,
    required: true,
  },
  totalSum: {
    type: Number,
    required: true,
  },
  size: {
    type: String,
    enum: ['Small', 'Big'],
    required: true,
  },
  parity: {
    type: String,
    enum: ['Odd', 'Even'],
    required: true,
  },
  diceOutcome: {
    type: [Number],
    validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
    required: true,
  },
});

function arrayLimit(val) {
  return val.length <= 3;
}

const K3ManualResult = mongoose.model('K3ManualResult', K3ManualResultSchema);

module.exports = K3ManualResult;
