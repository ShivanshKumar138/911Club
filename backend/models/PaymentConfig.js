const mongoose = require("mongoose");

// Define the schema
const paymentConfigSchema = new mongoose.Schema(
  {
    isAllPaymentMethodOn: {
      type: Boolean,
      default: false,
      unique: true,
    },
  },
  { timestamps: true }
);

// Create and export the model
const PaymentConfig = mongoose.model("PaymentConfig", paymentConfigSchema);

module.exports = PaymentConfig;
