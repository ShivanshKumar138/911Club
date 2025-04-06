const mongoose = require("mongoose");

const ManualResultRacingSchema = new mongoose.Schema({
  timer: {
    type: String,
    required: true,
  },
  periodId: {
    type: String,
    required: true,
  },
  numberOutcome: {
    category: {
      type: Number,
      enum: [1, 2, 3], // Category type
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  sizeOutcome: {
    category: {
      type: Number,
      enum: [1, 2, 3], // Category type
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
  oddEvenOutCome: {
    category: {
      type: Number,
      enum: [1, 2, 3], // Category type
      required: true,
    },
    value: {
      type: String,
      required: true,
    },
  },
});

const ManualResult = mongoose.model(
  "ManualResultRacing",
  ManualResultRacingSchema
);

module.exports = ManualResult;
