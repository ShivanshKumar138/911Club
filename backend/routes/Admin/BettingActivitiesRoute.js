const express = require("express");
const router = express.Router();
const User = require("../../models/userModel");
const WingoBet = require("../../models/betsModel");
const TrxBet = require("../../models/TRXBetModel");
const K3Bet = require("../../models/K3BetModel");
const IllegalBet = require("../../models/IllegalBetSchema");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");

router.get("/illegal-bets", auth, isAdmin, async (req, res) => {
  try {
    // Fetch only illegal bets
    const illegalBets = await IllegalBet.find();

    // If no illegal bets are found, return an empty array
    if (illegalBets.length === 0) {
      return res.status(200).json([]);
    }

    // Extract userIds from the illegal bets
    const userIds = illegalBets.map(bet => bet.userId);

    // Fetch user details from the User schema
    const users = await User.find({ _id: { $in: userIds } }, 'uid mobile');
    const userMap = {};
    users.forEach(user => {
      userMap[user._id.toString()] = {
        uid: user.uid,
        mobile: user.mobile,
      };
    });

    // Combine illegal bet details for each user
    const aggregatedData = illegalBets.reduce((acc, bet) => {
      const userId = bet.userId.toString();
      
      // Initialize user entry if it doesn't exist
      if (!acc[userId]) {
        acc[userId] = {
          userId: userMap[userId].uid, // Include the user ID
          mobile: userMap[userId].mobile, // Include the mobile number
          games: {},
          totalIllegalCount: 0,
          totalBetAmountThisPeriod: 0,
          lastUpdated: bet.lastUpdated,
        };
      }

      // Aggregate details for each game
      const game = bet.game;
      if (!acc[userId].games[game]) {
        acc[userId].games[game] = {
          totalIllegalCount: 0,
          latestPeriodId: bet.latestPeriodId,
          latestPeriodBetCount: 0,
          maximumAllowedIllegalBets: bet.maximumAllowedIllegalBets,
          betsPerPeriod: {}, // Initialize to hold only illegal bets
        };
      }

      // Update the game data with the current bet
      acc[userId].games[game].totalIllegalCount += bet.totalIllegalCount;
      acc[userId].games[game].latestPeriodId = bet.latestPeriodId; // Update to the latest
      acc[userId].games[game].latestPeriodBetCount += bet.latestPeriodBetCount; // Sum counts

      // Create an entry for the specific period with illegal bets
      const periodId = bet.latestPeriodId; // Use the latest period ID
      acc[userId].games[game].betsPerPeriod[periodId] = {
        bets: bet.bets,
        isIllegal: true,
        illegalReasons: bet.illegalReasons,
        sizeBetTypes: bet.sizeBetTypes,
        colorBetTypes: bet.colorBetTypes || [], // Add colorBetTypes if exists
        parityTypes: bet.parityTypes || [], // Add parityTypes if exists
      };

      // Update overall totals
      acc[userId].totalIllegalCount += bet.totalIllegalCount;
      acc[userId].totalBetAmountThisPeriod += bet.totalBetAmountThisPeriod;
      acc[userId].lastUpdated = new Date(Math.max(acc[userId].lastUpdated, bet.lastUpdated)); // Get the latest date

      return acc;
    }, {});

    // Convert to an array and return
    return res.status(200).json(Object.values(aggregatedData));
  } catch (error) {
    console.error("Error fetching illegal bets:", error);
    return res.status(500).json({ message: "Error fetching illegal bets", error: error.message });
  }
});


// Route to update maximumAllowedIllegalBets
router.put("/update-maximum-illegal-bets", auth, isAdmin, async (req, res) => {
  try {
    const { userId, maximumAllowedIllegalBets } = req.body;

    if (
      maximumAllowedIllegalBets === undefined ||
      isNaN(maximumAllowedIllegalBets)
    ) {
      return res
        .status(400)
        .json({ message: "Invalid maximumAllowedIllegalBets value" });
    }

    let result;
    if (userId) {
      // Update for a specific user
      const illegalBet = await IllegalBet.findOne({ userId });

      if (!illegalBet) {
        return res.status(404).json({
          message: "IllegalBet entry not found for the specified user",
        });
      }

      illegalBet.maximumAllowedIllegalBets = maximumAllowedIllegalBets;
      result = await illegalBet.save();
      return res.status(200).json({
        message: "Maximum allowed illegal bets updated successfully for user",
        illegalBet: result,
      });
    } else {
      // Update for all users
      result = await IllegalBet.updateMany({}, { maximumAllowedIllegalBets });
      return res.status(200).json({
        message:
          "Maximum allowed illegal bets updated successfully for all users",
        result,
      });
    }
  } catch (error) {
    console.error("Error updating maximum allowed illegal bets:", error);
    res.status(500).json({ message: "Server error" });
  }
});

module.exports = router;
