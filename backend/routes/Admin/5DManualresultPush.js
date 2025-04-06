const express = require("express");
const router = express.Router();
const FiveDManualResult = require("../../models/5DManualResultModel"); // Assuming the model is in the models folder
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");

// Route to manually push the result
router.post("/set-5d-result", auth, isAdmin, async (req, res) => {
  try {
    const { timerName, periodId, sectionOutcome } = req.body;

    // Validate the required fields
    if (!timerName || !periodId || !sectionOutcome) {
      return res.status(400).json({ message: "Missing required fields." });
    }

    // Validate the size and parity fields for sections A to E
    const validSizeEnum = ["Small", "Big"];
    const validParityEnum = ["Odd", "Even"];

    const sections = ["A", "B", "C", "D", "E"];
    let totalSumValue = 0; // To calculate total sum

    sections.forEach((section) => {
      const { number, size, parity } = sectionOutcome[section];
      if (
        number === undefined ||
        !validSizeEnum.includes(size) ||
        !validParityEnum.includes(parity)
      ) {
        throw new Error(`Invalid size or parity in section ${section}`);
      }

      // Accumulate the sum of the numbers from each section
      totalSumValue += number;
    });

    // Determine the size and parity for the total sum
    const totalSumSize = totalSumValue <= 13 ? "Small" : "Big"; // 0-13 = Small, 14-45 = Big
    const totalSumParity = totalSumValue % 2 === 0 ? "Even" : "Odd"; // Even or Odd based on total sum

    // Create the totalSum object
    const totalSum = {
      value: totalSumValue,
      size: totalSumSize,
      parity: totalSumParity,
    };

    // Create a new result document with the calculated totalSum
    const newResult = new FiveDManualResult({
      timerName,
      periodId,
      sectionOutcome,
      totalSum, // This is automatically calculated
    });

    // Save the result to the database
    await newResult.save();

    // Respond with success message
    res.status(201).json({
      message: "Result successfully saved!",
      result: newResult,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

module.exports = router;
