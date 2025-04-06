// models/SpinnerHistory.js

const mongoose = require("mongoose");

const SpinnerHistorySchema = new mongoose.Schema(
  {
    spinTime: {
      type: Date,
      required: true,
    },
    prize: {
      type: String,
      required: true,
    },
    rewardType: {
      type: String,
      required: true,
    },
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User", // Assuming you have a User model to reference
      required: true,
    },
  },
  {
    timestamps: true, // Automatically add createdAt and updatedAt timestamps
  }
);

const SpinnerHistory = mongoose.model("SpinnerHistory", SpinnerHistorySchema);

module.exports = SpinnerHistory;