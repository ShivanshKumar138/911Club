// This is my coupon model
// Updated coupon schema

const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  amount: { type: Number, default: 0 }, // Minimum spend required to claim

  validity: { type: Date, default: 0 },

  code: { type: String, required: true },

  bonusAmount: { type: Number, required: true },

  redemptionLimit: { type: Number, required: true },

  redemptionCount: { type: Number, default: 0 },

  redeemedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],

  couponType: {
    type: String,

    enum: ["regular", "firstDeposit"],

    default: "regular",
  },
});

const Coupon = mongoose.model("Coupon", couponSchema);

module.exports = Coupon;
