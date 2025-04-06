const mongoose = require("mongoose");
const { Schema } = mongoose;

const levelSchema = new Schema({
  minAmount: { type: Number, required: true },
  oneTimeBonus: { type: Number, required: true },
  awarded: { type: String, required: true },
  monthlyBonus: { type: Number, required: true },
  rebatePercentage: { type: Number, required: true }, // Added rebatePercentage
});

const mainLevelSchema = new Schema({
  levels: {
    type: [levelSchema],
    default: () => [
      {
        minAmount: 1000,
        oneTimeBonus: 100,
        awarded: "Bronze",
        monthlyBonus: 50,
        rebatePercentage: 0.5, // Rebate percentage for Bronze level
      },
      {
        minAmount: 5000,
        oneTimeBonus: 250,
        awarded: "Silver",
        monthlyBonus: 100,
        rebatePercentage: 1.0, // Rebate percentage for Silver level
      },
      {
        minAmount: 10000,
        oneTimeBonus: 500,
        awarded: "Gold",
        monthlyBonus: 200,
        rebatePercentage: 1.5, // Rebate percentage for Gold level
      },
      {
        minAmount: 20000,
        oneTimeBonus: 1000,
        awarded: "Platinum",
        monthlyBonus: 300,
        rebatePercentage: 2.0, // Rebate percentage for Platinum level
      },
      {
        minAmount: 50000,
        oneTimeBonus: 2000,
        awarded: "Diamond",
        monthlyBonus: 500,
        rebatePercentage: 2.5, // Rebate percentage for Diamond level
      },
    ],
  },
});

const MainLevelModel = mongoose.model("MainLevelModel", mainLevelSchema);

module.exports = MainLevelModel;
