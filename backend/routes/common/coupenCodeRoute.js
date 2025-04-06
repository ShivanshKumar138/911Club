// controllers/couponController.js
const express = require("express");
const router = express.Router();
const Coupon = require("../../models/coupon"); // Assuming you have a Coupon model
const User = require("../../models/userModel"); // Assuming you have a User model
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const {
  addTransactionDetails,
} = require("../../controllers/TransactionHistoryControllers");
const { addNotification } = require("../../controllers/NotificationController");
const DepositHistory = require("../../models/depositHistoryModel");

router.post("/create-coupon", async (req, res) => {
  const { code, bonusAmount, redemptionLimit, amount, validity } = req.body;

  const coupon = new Coupon({
    code,

    bonusAmount,

    redemptionLimit,

    amount,

    validity,
  });

  await coupon.save();

  res.send("Coupon created");
});

// Modify the existing redeem-coupon route to handle different coupon types
router.post("/redeem-coupon", auth, async (req, res) => {
  const { code } = req.body;
  const userId = req.user._id;
  console.log("id is:", userId);

  try {
    // Find the coupon by code
    const coupon = await Coupon.findOne({ code });
    if (!coupon) {
      return res.status(200).send("Invalid or expired coupon");
    }

    // Check if the coupon has reached its redemption limit
    if (coupon.redemptionCount >= coupon.redemptionLimit) {
      return res.status(200).send("Coupon redemption limit reached");
    }

    // Check if the user has already redeemed the coupon
    if (coupon.redeemedBy.includes(userId)) {
      return res.status(200).send("You have already redeemed this coupon");
    }

    // Get user
    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).send("User not found");
    }

    console.log("User is:", user);
    // Check for first deposit coupon type
    if (coupon.couponType === "firstDeposit" && !user.firstDepositMade) {
      return res
        .status(200)
        .send("You must make your first deposit before redeeming this coupon");
    }

    // Check if the coupon has a minimum amount requirement
    if (coupon.amount > 0) {
      // Check if the user has made a deposit with the required amount
      const depositWithRequiredAmount = await DepositHistory.findOne({
        uid: user.uid,
        depositAmount: { $gte: coupon.amount },
        depositStatus: "completed", // Assuming you have a status field for successful deposits
      });
      console.log("DepositHistory", depositWithRequiredAmount);

      if (!depositWithRequiredAmount) {
        return res
          .status(200)
          .send(
            `You need to make a deposit of at least ${coupon.amount} to redeem this coupon`
          );
      }
    }

    // Check if the user has already redeemed 2 coupons
    const redeemedCouponsCount = await Coupon.countDocuments({
      redeemedBy: userId,
    });
    console.log(redeemedCouponsCount);
    if (redeemedCouponsCount >= 2) {
      return res
        .status(200)
        .send("You have already redeemed the maximum number of coupons");
    }

    // Update user's wallet with bonus amount
    user.walletAmount += coupon.bonusAmount;

    // Increment redemption count and add user to redeemedBy list
    coupon.redemptionCount += 1;
    coupon.redeemedBy.push(userId);

    // Log the transaction
    addTransactionDetails(
      userId,
      coupon.bonusAmount,
      `Coupon - ${code}`,
      new Date()
    );
    await addNotification(
      userId,
      "Gift Code Redeem",
      "You have Redeem Gift Code successfully."
    );

    // Save the updated user and coupon
    await user.save();
    await coupon.save();

    res.send("Coupon redeemed successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});
// Create first deposit coupon
router.post("/create-first-deposit-coupon", auth, isAdmin, async (req, res) => {
  const { code, bonusAmount, redemptionLimit } = req.body;
  const coupon = new Coupon({
    code,
    bonusAmount,
    redemptionLimit,
    couponType: "firstDeposit",
  });

  try {
    await coupon.save();
    res.status(201).send("First deposit coupon created successfully");
  } catch (error) {
    console.error(error);
    res.status(500).send("Internal server error");
  }
});

router.get("/coupons-list", async (req, res) => {
  try {
    const coupons = await Coupon.find({}).populate("redeemedBy", "uid");
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

// Get first deposit coupons
router.get("/first-deposit-coupons", auth, async (req, res) => {
  try {
    const coupons = await Coupon.find({ couponType: "firstDeposit" });
    res.json(coupons);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
