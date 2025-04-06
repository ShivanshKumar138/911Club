const express = require("express");
const Bet = require("../../models/betsModel");
const FiveDBet = require("../../models/5DBetModel");
const K3BetModel = require("../../models/K3BetModel");
const TrxBet = require("../../models/TRXBetModel");

const router = express.Router();

router.get("/get-all-bet", async (req, res) => {
  const { gameType } = req.query;
  let allBetsRecord;
  if (gameType === "wingo") {
    allBetsRecord = await Bet.find();
    return res.json(allBetsRecord);
  } else if (gameType === "fiveD") {
    allBetsRecord = await FiveDBet.find();
    return res.json(allBetsRecord);
  } else if (gameType == "k3") {
    allBetsRecord = await K3BetModel.find();
    return res.json(allBetsRecord);
  } else if (gameType === "trx") {
    allBetsRecord = await TrxBet.find();
    return res.json(allBetsRecord);
  }
});

module.exports = router;
