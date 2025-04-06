const mongoose = require("mongoose");

const adminTaskControlSchema = new mongoose.Schema({
  work: [
    {
      task: {
        type: Number,
      },
      NumberOfSpin: {
        type: Number,
      },
    },
  ],
  winningAmount: {
    section1: {
      type: Number,
    },
    section2: {
      type: Number,
    },
    section3: {
      type: Number,
    },
    section4: {
      type: Number,
    },
    section5: {
      type: Number,
    },
    section6: {
      type: Number,
    },
    section7: {
      type: Number,
    },
    section8: {
      type: String,
    },
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

const AdminTaskControl = mongoose.model("AdminTaskControl", adminTaskControlSchema);

module.exports = AdminTaskControl;