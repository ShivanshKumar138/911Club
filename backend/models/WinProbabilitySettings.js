// models/WinProbabilitySettings.js
const mongoose = require("mongoose");

const winProbabilitySettingsSchema = new mongoose.Schema({
  singlePlayerWinProbability: {
    type: Number,
    default: 0.3,
    min: 0,
    max: 1,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model(
  "WinProbabilitySettings",
  winProbabilitySettingsSchema
);
