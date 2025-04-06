const express = require("express");
const router = express.Router();
const auth = require("../../middlewares/auth"); // Import your authentication middleware

// Import your models
const K3Bet = require("../../models/K3BetModel");
const WingoBet = require("../../models/betsModel");
const TrxBet = require("../../models/TRXBetModel");
const FiveDBet = require("../../models/5DBetModel");

// Helper function for standardized error responses
const handleError = (res, message, error) => {
  console.error(`[ERROR] ${message}:`, error);
  res.status(500).json({ message, error: error.message });
};

// Endpoint to fetch bet history for a specific game type or all game types for the authenticated user
router.get("/bet-history", auth, async (req, res) => {
  try {
    console.log("Received query params:", req.query);
    const { gameType, startDate, endDate } = req.query;
    const userId = req.user._id;

    // Parse date strings to Date objects
    const start = startDate ? new Date(startDate) : null;
    const end = endDate ? new Date(endDate) : null;

    // Create date range filter if both start and end dates are provided
    const dateFilter =
      start && end ? { timestamp: { $gte: start, $lte: end } } : {};

    const fetchBets = async (Model, userIdField = "user") => {
      const query = { [userIdField]: userId, ...dateFilter };
      return await Model.find(query).sort({ timestamp: -1 }).exec();
    };

    let allBets = [];

    if (gameType === "All" || !gameType) {
      // Fetch all bets across all game types
      const [k3Bets, wingoBets, trxBets, fiveDBets] = await Promise.all([
        fetchBets(K3Bet),
        fetchBets(WingoBet, "userId"),
        fetchBets(TrxBet, "userId"),
        fetchBets(FiveDBet),
      ]);

      allBets = [
        ...k3Bets.map((bet) => ({ ...bet.toObject(), gameType: "k3" })),
        ...wingoBets.map((bet) => ({ ...bet.toObject(), gameType: "wingo" })),
        ...trxBets.map((bet) => ({ ...bet.toObject(), gameType: "trx" })),
        ...fiveDBets.map((bet) => ({ ...bet.toObject(), gameType: "5d" })),
      ];
    } else {
      // Fetch bets for a specific game type
      let bets;
      let gameLabel;

      switch (gameType) {
        case "K3":
          bets = await fetchBets(K3Bet);
          gameLabel = "k3";
          break;
        case "Wingo":
          bets = await fetchBets(WingoBet, "userId");
          gameLabel = "wingo";
          break;
        case "TRX":
          bets = await fetchBets(TrxBet, "userId");
          gameLabel = "trx";
          break;
        case "5D":
          bets = await fetchBets(FiveDBet);
          gameLabel = "5d";
          break;
        default:
          return res
            .status(400)
            .json({ message: "Invalid game type specified" });
      }

      allBets = bets.map((bet) => ({ ...bet.toObject(), gameType: gameLabel }));
    }

    // Sort all bets by timestamp
    allBets.sort((a, b) => b.timestamp - a.timestamp);

    console.log(
      `[INFO] Fetched ${allBets.length} total bets for user ${userId} within the specified date range`
    );
    res.status(200).json(allBets);
  } catch (error) {
    console.error("Error fetching bet history:", error);
    res
      .status(500)
      .json({ message: "Error fetching bet history", error: error.message });
  }
});

// Helper function to get IST date
const getISTDate = (date) => {
  // Add IST offset (UTC+5:30)
  return new Date(date.getTime() + (5.5 * 60 * 60 * 1000));
};


// Update getDayRange function for IST
const getDayRange = (date) => {
  // Convert to IST
  const istDate = getISTDate(date);
  
  // Set start of day in IST
  const start = new Date(istDate);
  start.setHours(0, 0, 0, 0);
  // Convert back to UTC for MongoDB
  const utcStart = new Date(start.getTime() - (5.5 * 60 * 60 * 1000));
  
  // Set end of day in IST
  const end = new Date(istDate);
  end.setHours(23, 59, 59, 999);
  // Convert back to UTC for MongoDB
  const utcEnd = new Date(end.getTime() - (5.5 * 60 * 60 * 1000));
  
  return { start: utcStart, end: utcEnd };
};

// Helper function to get the start of the week
const getWeekRange = (date) => {
  const startOfWeek = new Date(date.setDate(date.getDate() - date.getDay()));
  const endOfWeek = new Date(startOfWeek);
  endOfWeek.setDate(endOfWeek.getDate() + 6);
  return {
    start: getDayRange(startOfWeek).start,
    end: getDayRange(endOfWeek).end,
  };
};

// Helper function to get the start of the month
const getMonthRange = (date) => {
  const start = new Date(date.getFullYear(), date.getMonth(), 1);
  const end = new Date(date.getFullYear(), date.getMonth() + 1, 0);
  return { start, end: getDayRange(end).end };
};

// Update getYesterdayRange function
const getYesterdayRange = () => {
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(yesterday.getDate() - 1);
  
  const range = getDayRange(yesterday);
  
  // Add debug logging
  console.log('Yesterday Range (IST):', {
    start: getISTDate(range.start).toLocaleString('en-IN'),
    end: getISTDate(range.end).toLocaleString('en-IN')
  });
  
  return range;
};
// Endpoint to fetch user's total bet stats for today, yesterday, this week, and this month
router.get("/bet-stats", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Extracted from auth middleware

    // Date ranges
    const todayRange = getDayRange(new Date());
    const yesterdayRange = getYesterdayRange(); // 864e5 = 24 * 60 * 60 * 1000
    const weekRange = getWeekRange(new Date());
    const monthRange = getMonthRange(new Date());

    // Function to calculate total bets, total amount, and winning amount for a specific date range
    const calculateStatsForRange = async (start, end) => {
      // Add debug logging
      console.log('Query Range (IST):', {
        start: getISTDate(start).toLocaleString('en-IN'),
        end: getISTDate(end).toLocaleString('en-IN')
      });
    
      const [k3Bets, wingoBets, trxBets, fiveDBets] = await Promise.all([
        K3Bet.find({ 
          user: userId, 
          timestamp: { $gte: start, $lte: end } 
        }),
        WingoBet.find({
          userId: userId,
          timestamp: { $gte: start, $lte: end }
        }),
        TrxBet.find({ 
          userId: userId, 
          timestamp: { $gte: start, $lte: end }
        }),
        FiveDBet.find({
          user: userId,
          timestamp: { $gte: start, $lte: end }
        })
      ]);
    
      // Tag each bet with its game type
      const taggedK3Bets = k3Bets.map((bet) => ({
        ...bet.toObject(),
        gameType: "k3",
      }));
      const taggedWingoBets = wingoBets.map((bet) => ({
        ...bet.toObject(),
        gameType: "wingo",
      }));
      const taggedTrxBets = trxBets.map((bet) => ({
        ...bet.toObject(),
        gameType: "trx",
      }));
      const tagged5DBets = fiveDBets.map((bet) => ({
        ...bet.toObject(),
        gameType: "5d",
      }));
    
      const allBets = [
        ...taggedK3Bets, 
        ...taggedWingoBets, 
        ...taggedTrxBets,
        ...tagged5DBets
      ];
    
      const totalBets = allBets.length;
    
      // Calculate total amount and winning amount
      const totalAmountBet = allBets.reduce((acc, bet) => {
        let amount = bet.totalBet;
    
        if (bet.gameType === "wingo" || bet.gameType === "trx") {
          amount += bet.tax;
          amount = Math.round(amount * 100) / 100;
        }
    
        return acc + amount;
      }, 0);
    
      const winningAmount = allBets.reduce(
        (acc, bet) =>
          bet.status === "Succeed" ? acc + parseFloat(bet.winLoss) : acc,
        0
      );
    
      return { totalBets, totalAmountBet, winningAmount };
    };

    // Calculate stats for each range
    const todayStats = await calculateStatsForRange(
      todayRange.start,
      todayRange.end
    );
    const yesterdayStats = await calculateStatsForRange(
      yesterdayRange.start,
      yesterdayRange.end
    );
    const weekStats = await calculateStatsForRange(
      weekRange.start,
      weekRange.end
    );
    const monthStats = await calculateStatsForRange(
      monthRange.start,
      monthRange.end
    );

    const stats = {
      today: todayStats,
      yesterday: yesterdayStats,
      thisWeek: weekStats,
      thisMonth: monthStats,
    };

    console.log(`[INFO] Fetched betting stats for user ${userId}`);
    res.status(200).json(stats);
  } catch (error) {
    console.error(`[ERROR] Fetching betting stats failed: ${error.message}`);
    res.status(500).json({ message: "Error fetching betting stats", error });
  }
});

module.exports = router;
