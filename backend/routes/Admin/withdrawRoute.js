const express = require("express");
const router = express.Router();
const { requestWithdraw } = require("../../controllers/requestWithdrawController");
const auth = require("../../middlewares/auth");
const {isAdmin,isNormal,} = require("../../middlewares/roleSpecificMiddleware");
const  User  = require('../../models/userModel'); // Assuming User and UserRemainingBet models exist
const UserRemainingBet  = require('../../models/UserRemainingBet'); // Assuming User and UserRemainingBet models exist

const { fetchWithdrawController,fetchWithdrawUserController } = require("../../controllers/fetchWithdrawController");
const {withdrawAcceptanceController,} = require("../../controllers/withdrawAcceptanceController");
const {totalWithdrawRequestController,} = require("../../controllers/totalWithdrawRequestController");
const { totalWithdrawsController } = require("../../controllers/totalWithdrawsController");
const {getTotalWithdrawAmountToday,getPendingWithdrawCount} = require("../../controllers/todaysWithdrawController");
const { calculateRemainingBetAmount,setManualBetAdjustment,getAllUsersRemainingBetAmounts,fetchAndUpdateUserRemainingBets } = require("../../controllers/requestWithdrawController");


router.post("/withdraw-request", auth, requestWithdraw);
router.get("/all-withdraw-history-admin_only",auth,isAdmin,fetchWithdrawController);
router.get("/all-withdraw-history", auth, fetchWithdrawUserController);
router.post("/update-withdraw-status",auth,isAdmin,withdrawAcceptanceController);

router.get("/total-withdraw-request-amount",auth,isAdmin,totalWithdrawRequestController);
router.get("/total-withdrawl-amount", auth, isAdmin, totalWithdrawsController);
router.get("/total-withdraw-amount-last-24-hours",auth,isAdmin,getTotalWithdrawAmountToday);
router.get("/calculateRemainingBetAmount", auth,calculateRemainingBetAmount);
router.get("/pending-withdrawals-count", auth, isAdmin, getPendingWithdrawCount); // Add the new route

// Admin route to adjust a user's total bet amount
router.post('/admin/adjust-bet', auth,isAdmin, setManualBetAdjustment);

router.get('/admin/users-remaining-bets', auth,isAdmin, getAllUsersRemainingBetAmounts);

router.post('/admin/fetch-and-update-users-remaining-bets',auth,isAdmin, fetchAndUpdateUserRemainingBets);

// API for Admin to update the remaining bet amount for a user by UID
router.put('/admin/update-remaining-bet/:uid',auth, isAdmin, async (req, res) => {
    try {
      const { uid } = req.params; // Extract the uid from the URL
      const { remainingBetAmount, quickMultiplier } = req.body; // Extract data from the request body
  
      // Validate that remainingBetAmount is a number and greater than or equal to 0
      if (typeof remainingBetAmount !== 'number' || remainingBetAmount < 0) {
        return res.status(400).json({
          success: false,
          message: 'Invalid remaining bet amount. It must be a number and greater than or equal to 0.',
        });
      }
  
      // Find the user by UID
      const user = await User.findOne({ uid: uid });
      if (!user) {
        return res.status(404).json({
          success: false,
          message: 'User not found.',
        });
      }
  
      // Check if the quickMultiplier is provided and is valid (2x, 3x, 5x, 10x)
      let updatedRemainingBet = remainingBetAmount;
      const validMultipliers = [2, 3, 5, 10];
      if (quickMultiplier && validMultipliers.includes(quickMultiplier)) {
        updatedRemainingBet = remainingBetAmount * quickMultiplier;
      }
  
      // Update the UserRemainingBet collection with the new remaining bet amount
      await UserRemainingBet.findOneAndUpdate(
        { userId: user._id },
        { remainingBetAmount: updatedRemainingBet },
        { upsert: true, new: true, setDefaultsOnInsert: true }
      );
  
      // Optionally, log the action performed by the admin for auditing
      console.log(`Admin ${req.user.username} updated remaining bet for User ${user.uid} to ${updatedRemainingBet}`);
  
      // Return a success response
      return res.status(200).json({
        success: true,
        message: 'Remaining bet amount updated successfully.',
        updatedRemainingBet: updatedRemainingBet,
      });
    } catch (error) {
      console.error('Error updating remaining bet amount:', error);
      return res.status(500).json({
        success: false,
        message: 'An error occurred while updating the remaining bet amount. Please try again.',
        error: error.message,
      });
    }
  });



module.exports = router;
