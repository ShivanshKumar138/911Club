const Withdraw = require("../models/withdrawModel");
const User = require("../models/userModel");
const { addNotification } = require('./NotificationController');

exports.withdrawAcceptanceController = async (req, res) => {
  try {
    // Check if the user is an admin
    if (!req.user || req.user.accountType !== "Admin") {
      return res.status(403).json({
        message: "You are not authorized to perform this action",
      });
    }

    const { withdrawId, acceptanceType, remark } = req.body;

    // Validate acceptanceType
    if (!["Completed", "Rejected"].includes(acceptanceType)) {
      return res.status(400).json({
        message: "Invalid acceptance type provided.",
      });
    }

    // Find the withdrawal request by ID
    const updatedRequest = await Withdraw.findById(withdrawId);
    if (!updatedRequest) {
      return res.status(404).json({
        message: "Withdrawal request not found or already processed.",
      });
    }

    // Find the user associated with the withdrawal request
    const user = await User.findById(updatedRequest.userId);
    if (!user) {
      return res.status(404).json({
        message: "User not found.",
      });
    }

    // Admin approval
    if (acceptanceType === "Completed") {
      // No balance changes here as the balance was deducted earlier, just update the request status
      updatedRequest.status = "Completed";
      updatedRequest.withdrawDone = true; // Mark the request as done
    }
    // Admin rejection
    else if (acceptanceType === "Rejected") {
      // Refund the user's balance, taking into account the USDT conversion if applicable
      if (updatedRequest.withdrawMethod === "USDT") {
        const conversionRate = 93; // Assuming 1 USDT = 93 units of local currency
        const convertedAmount = updatedRequest.balance;

        // Refund the converted amount back to the user's wallet
        user.walletAmount += convertedAmount;
      } else {
        // Refund the original balance for non-USDT withdrawals
        user.walletAmount += updatedRequest.balance;
      }

      // Save the updated user balance
      await user.save();
     

      // Update the status of the withdrawal request to "Rejected"
      updatedRequest.status = "Rejected";
    }

    // Update the remark if provided, else set an empty string
    updatedRequest.remark = remark || "";
    await updatedRequest.save();
    await addNotification(user._id, 'Withdraw Successful', 'You have Withdraw successfully.');

    res.status(200).json({
      message: `Withdraw request has been ${acceptanceType}.`,
      updatedRequest: updatedRequest,
    });
  } catch (error) {
    res.status(500).json({
      message: "Error updating withdraw request",
      error: error.message,
    });
  }
};
