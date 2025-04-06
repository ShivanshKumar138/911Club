const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const RebateSchema = new Schema({
  userId: {
    type: Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  levelAwarded: {
    type: String,
    required: true,
  },
  rebatePercentage: {
    type: Number,
    required: true,
  },
  rebateAmount: {
    type: Number,
    required: true,
  },
  walletAmountAfterRebate: {
    type: Number,
    required: true,
  },
  bettingAmount: {
    type: Number,
    required: true, // Set to true if bettingAmount is a required field
  },
  date: {
    type: Date,
    default: Date.now,
  },
});

const Rebate = mongoose.model("Rebate", RebateSchema);
module.exports = Rebate;
