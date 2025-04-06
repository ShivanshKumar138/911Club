const mongoose = require('mongoose');
const { Schema } = mongoose;

// SpinnerWheel Schema
const spinnerWheelSchema = new Schema({
  uid: {
    type: mongoose.Schema.Types.ObjectId, 
    ref: 'User', // Assuming there is a User model
    required: false
  },
  numberOfSpins: {
    type: Number,
    required: false,
    default: 0
  },
  SpinHave: {
    type: Number,
    required: false,
    default: 0
  },
  todayRewardMoney: {
    type: Number,
    required: false,
    default: 0
  },
  timestamp: {
    type: Date,
    default: Date.now
  },
  depositMadeToday: {
    type: Number,
    required: false,
    default: 0
  },
  turnoverMadeToday: {
    type: Number,
    required: false,
    default: 0
  }
});

// Creating model from the schema
const SpinnerWheel = mongoose.model('SpinnerWheel', spinnerWheelSchema);

module.exports = SpinnerWheel;