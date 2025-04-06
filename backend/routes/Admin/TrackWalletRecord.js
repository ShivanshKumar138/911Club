const { Router } = require("express");
const User = require("../../models/userModel");

const router = Router();

router.get(
  "/get-user-wallet-report/:userId/wallet-changes",
  async (req, res) => {
    const { userId } = req.params; // Get userId from URL parameter

    try {
      // Find the user by their ID
      const user = await User.findById(userId);

      // If the user is not found, return an error
      if (!user) {
        return res.status(404).json({ message: "User not found" });
      }

      // Respond with the data related to wallet changes
      res.status(200).json({
        creditedAmount: user.creditedAmount,
        debitedAmount: user.debitedAmount,
        walletChangeCount: user.walletChangeCount,
      });
    } catch (error) {
      console.error("Error fetching wallet changes:", error);
      res.status(500).json({ message: "Internal Server Error" });
    }
  }
);

module.exports = router;
