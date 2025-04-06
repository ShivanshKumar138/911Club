const mongoose = require("mongoose");

const secondDepositBonusSchema = new mongoose.Schema({
  minimumDeposit: { type: Number, unique: true, required: true },
  bonus: { type: Number, required: true },
});

const SecondDepositBonus = mongoose.model("SecondDepositBonus", secondDepositBonusSchema);

module.exports = SecondDepositBonus;