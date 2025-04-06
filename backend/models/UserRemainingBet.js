// models/UserRemainingBet.js

const mongoose = require('mongoose');

const userRemainingBetSchema = new mongoose.Schema({
  userId: { type: String, required: true, unique: true },
  remainingBetAmount: { type: Number, required: true },
}, { timestamps: true });

const UserRemainingBet = mongoose.model('UserRemainingBet', userRemainingBetSchema);

module.exports = UserRemainingBet;
