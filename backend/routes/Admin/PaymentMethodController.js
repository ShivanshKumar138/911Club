const express = require("express");
const router = express.Router();
const PaymentConfig = require("../../models/PaymentConfig"); // Assuming you have a PaymentConfig model

// GET route to fetch the payment configuration
router.get("/payment-config", async (req, res) => {
  try {
    // Find the first document or create one if it doesn't exist
    let config = await PaymentConfig.findOne();

    if (!config) {
      config = await PaymentConfig.create({ isAllPaymentMethodOn: false });
    }

    res.status(200).json(config);
  } catch (error) {
    console.error("Error fetching payment config:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

// POST route to update the payment configuration
router.post("/payment-config", async (req, res) => {
  try {
    const { isAllPaymentMethodOn } = req.body;

    // Find and update the document, create if it doesn't exist
    const config = await PaymentConfig.findOneAndUpdate(
      {}, // empty filter to find any document
      { isAllPaymentMethodOn },
      { new: true, upsert: true }
    );

    res.status(200).json(config);
  } catch (error) {
    console.error("Error updating payment config:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
});

module.exports = router;
