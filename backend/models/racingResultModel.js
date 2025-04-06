const mongoose = require("mongoose");

const ResultSchema = new mongoose.Schema({
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
  oddEvenOutcome: {
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

const Result = mongoose.model("RacingGameResult", ResultSchema);

module.exports = Result;
