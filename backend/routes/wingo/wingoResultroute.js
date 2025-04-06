const express = require('express')
const router = express.Router()
const auth = require('../../middlewares/auth')
const wingo = require('../../models/wingoResultModel')
const ManualResult = require('../../models/ManualResultSchema');

router.post('/set-manual-result', async (req, res) => {
  const { periodId, numberOutcome, colorOutcome, sizeOutcome, timer } = req.body;

  try {
    // Create a new ManualResult document to store the manual outcomes
    const manualResultData = {
      periodId,
      numberOutcome,
      colorOutcome,
      sizeOutcome,
      timer
    };

    const newManualResult = new ManualResult(manualResultData);
    await newManualResult.save();

    // Respond with success message and created ManualResult
    res.status(200).json({ message: 'Manual result created successfully!', manualResult: newManualResult });
  } catch (error) {
    console.error('Error creating manual result:', error);
    res.status(500).json({ error: 'Failed to create manual result. Please try again.' });
  }
});



router.get('/wingoresult', auth, async (req, res) => {
  try {
    const { timer } = req.query; // Get the timer from query parameters
    
    if (!timer) {
      return res.status(400).json({
        success: false,
        message: "Timer parameter is required"
      });
    }

    const Result = await wingo.find({ timer })
      .sort({ _id: -1 })
      .limit(50);

    res.status(200).json({
      success: true,
      message: "Here are the results",
      Result
    });
  } catch (error) {
    console.error(error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

module.exports = router