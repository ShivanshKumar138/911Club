const IllegalBet = require("../models/IllegalBetSchema");

async function monitorIllegalBet(userId, game, periodId, betType, betAmount) {
  console.log(
    `Monitoring bet for User: ${userId}, Game: ${game}, Period: ${periodId}, Bet Type: ${betType}, Bet Amount: ${betAmount}`
  );

  try {
    // Ensure betAmount is a valid number
    const numericBetAmount = parseFloat(betAmount);
    if (isNaN(numericBetAmount)) {
      throw new Error(`Invalid bet amount: ${betAmount}`);
    }
    let illegalBet = await IllegalBet.findOne({ userId, game });

    if (!illegalBet) {
      console.log("Creating new IllegalBet document");
      illegalBet = new IllegalBet({
        userId,
        game,
        latestPeriodId: periodId,
        latestPeriodBetCount: 0,
        totalIllegalCount: 0,
        totalBetAmountThisPeriod: 0,
      });
    }

    await illegalBet.addBet(periodId, betType, betAmount);

    const periodBets = illegalBet.betsPerPeriod.get(periodId);

    console.log("IllegalBet document saved");

    return {
      status: "success",
      data: {
        isIllegal: periodBets.isIllegal,
        illegalReasons: periodBets.illegalReasons,
        illegalCount: periodBets.isIllegal ? 1 : 0,
        totalIllegalCount: illegalBet.totalIllegalCount,
        betCount: illegalBet.latestPeriodBetCount,
        betsThisPeriod: periodBets.bets,
        totalBetAmountThisPeriod: illegalBet.totalBetAmountThisPeriod,
      },
    };
  } catch (error) {
    console.error("Error monitoring illegal bet:", error);
    throw new Error("Failed to monitor illegal bet.");
  }
}

async function getIllegalBetSummary(userId) {
  console.log(`Getting illegal bet summary for User: ${userId}`);

  try {
    const illegalBets = await IllegalBet.find({ userId });
    console.log(`Found ${illegalBets.length} IllegalBet documents`);

    const { totalIllegalCount, gameSummary } = illegalBets.reduce((acc, bet) => {
      acc.totalIllegalCount += bet.totalIllegalCount;
      acc.gameSummary[bet.game] = {
        illegalCount: bet.totalIllegalCount,
        latestPeriodId: bet.latestPeriodId,
        latestPeriodBetCount: bet.latestPeriodBetCount,
        betsThisPeriod: bet.betsPerPeriod.get(bet.latestPeriodId)?.bets || [],
        totalBetAmountThisPeriod: bet.totalBetAmountThisPeriod,
      };
      return acc;
    }, { totalIllegalCount: 0, gameSummary: {} });

    console.log(`Total illegal count: ${totalIllegalCount}`);
    console.log("Game summary:", gameSummary);

    return {
      status: "success",
      data: { totalIllegalCount, gameSummary },
    };
  } catch (error) {
    console.error("Error getting illegal bet summary:", error);
    throw new Error("Failed to get illegal bet summary.");
  }
}

module.exports = {
  monitorIllegalBet,
  getIllegalBetSummary,
};
