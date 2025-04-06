const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth");
const GameResult = require("../../models/trxResultModel");

router.get("/trxresultroute", auth, async (req, res) => {
  const { timer } = req.query;  // Get timer from query params
  try {
    // Find the latest 50 periods based on the given timer
    const latestResults = await GameResult.find({ timer })
      .sort({ _id: -1 })
      .limit(50);
      
    res.status(200).json(latestResults);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;