const express = require('express');
const K3ManualResult = require('../../models/K3ManualResultSchema');

const router = express.Router();

router.post('/k3/manual-result', async (req, res) => {
  const { timerName, periodId, totalSum, size, parity, diceOutcome } = req.body;

  try {
    // Create or update the manual result
    const result = await K3ManualResult.findOneAndUpdate(
      { timerName, periodId },
      { totalSum, size, parity, diceOutcome },
      { new: true, upsert: true } // upsert: true will create the document if it does not exist
    );

    res.status(200).json({
      success: true,
      message: 'Manual result set successfully',
      result,
    });
  } catch (error) {
    console.error('Error setting manual result:', error);
    res.status(500).json({
      success: false,
      message: 'Error setting manual result',
      error: error.message,
    });
  }
});

module.exports = router;
