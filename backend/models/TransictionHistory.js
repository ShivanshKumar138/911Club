const mongoose = require("mongoose");
const User = require("./userModel");

// Define the schema for transaction history
const TransactionHistorySchema = mongoose.Schema({
  amount: {
    type: Number,
    required: true,
  },
  type: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    default: Date.now,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  depositAmount: {
    type: Number,
    default: 0,
  },
  betAmount: {
    type: Number,
    default: 0,
  },
  depositAmountOfUser: {
    type: Number,
    default: 0,
  },
  gameType: {
    type: String,
    enum: ["wingo", "k3", "trx", "5d", "N/A"],
    default: "N/A",
  },
  commissionFromUser: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  commissionLevel: {
    type: Number,
    default: 0,
  },
  firstDepositChecker: {
    type: String,
    enum: ["notDepositYet", "firstTimeDepositing", "depositDoneAlready"],
    default: "notDepositYet", // Set 'notDepositYet' as the default value
  },
});

// Create the model using the schema
const TransactionHistory = mongoose.model(
  "TransactionHistory",
  TransactionHistorySchema
);

module.exports = TransactionHistory;
