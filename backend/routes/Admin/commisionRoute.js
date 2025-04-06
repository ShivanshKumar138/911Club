const express = require("express");
const router = express.Router();
const Commission = require("../../models/commissionModel");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const auth = require("../../middlewares/auth");
const MainLevelModel = require("../../models/levelSchema");

router.put("/update-commission-rates", auth, isAdmin, async (req, res) => {
  try {
    const { level1, level2, level3, level4, level5, level6 } = req.body;

    let commission = await Commission.findOne();
    if (commission) {
      const updatedCommission = await Commission.findByIdAndUpdate(
        commission._id,
        { $set: { level1, level2, level3, level4, level5, level6 } },
        { new: true }
      );
      res.json({ msg: "Commission rates updated", data: updatedCommission });
    } else {
      commission = new Commission({ level1, level2, level3, level4, level5, level6 });
      await commission.save();
      res.json({ msg: "Commission rates created", data: commission });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

router.put("/update-unlock-commission", auth, isAdmin, async (req, res) => {
  try {
    let { levels } = req.body;

    if (!levels || levels.length === 0) {
      levels = [
        { minAmount: 1000, oneTimeBonus: 100, awarded: "Bronze", monthlyBonus: 50, rebatePercentage: 0.5 },
        { minAmount: 5000, oneTimeBonus: 250, awarded: "Silver", monthlyBonus: 100, rebatePercentage: 1.0 },
        { minAmount: 10000, oneTimeBonus: 500, awarded: "Gold", monthlyBonus: 200, rebatePercentage: 1.5 },
        { minAmount: 20000, oneTimeBonus: 1000, awarded: "Platinum", monthlyBonus: 300, rebatePercentage: 2.0 },
        { minAmount: 50000, oneTimeBonus: 2000, awarded: "Diamond", monthlyBonus: 500, rebatePercentage: 2.5 },
      ];
    }

    // Find the first document; assuming there's only one config document
    const mainConfig = await MainLevelModel.findOne();

    // Check if a document exists, if it does update it, otherwise create a new one
    if (mainConfig) {
      // Update the existing configuration with the new levels
      mainConfig.levels = levels;
      await mainConfig.save();
      res.json({ msg: "Commission levels updated", data: mainConfig });
    } else {
      // Create a new document with the specified levels
      const newMainConfig = new MainLevelModel({ levels });
      await newMainConfig.save();
      res.json({ msg: "Commission levels created", data: newMainConfig });
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});


// New endpoint to fetch levels
router.get("/vip-levels", auth, async (req, res) => {
  try {
    const mainLevel = await MainLevelModel.findOne();
    if (!mainLevel) {
      return res.status(404).json({ message: "No levels data found" });
    }
    res.json({ msg: "Levels fetched", data: mainLevel.levels });
  } catch (error) {
    console.error(error);
    res.status(500).send("Server Error");
  }
});


router.get("/fetch-commission-rates", auth, isAdmin, async (req, res) => {
  try {
    const commission = await Commission.findOne();
    if (commission) {
      res.json({ msg: "Commission rates fetched", data: commission });
    } else {
      res.status(404).send("No commission rates found");
    }
  } catch (err) {
    console.error(err);
    res.status(500).send("Server Error");
  }
});

module.exports = router;
