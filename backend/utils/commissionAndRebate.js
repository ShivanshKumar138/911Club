const User = require('../models/userModel');
const CommissionRate = require('../models/betCommissionLevel');
const PendingCommission = require('../models/PendingCommission');
const Level = require('../models/levelSchema');
const Rebate = require('../models/RebateSchema');
const { addTransactionDetails } = require('../controllers/TransactionHistoryControllers');

async function createPendingCommissions(userId, totalBetAmount,gameType) {
  const commissionRates = await CommissionRate.findOne();
  if (!commissionRates) return [];

  const rates = [
    commissionRates.level1,
    commissionRates.level2,
    commissionRates.level3,
    commissionRates.level4,
    commissionRates.level5,
    commissionRates.level6,
  ];

  let currentUserId = userId;
  const pendingCommissions = [];

  for (let i = 0; i < 6; i++) {
    const currentUser = await User.findById(currentUserId);
    if (!currentUser || !currentUser.referrer) break;

    const referrer = await User.findById(currentUser.referrer);
    if (!referrer) break;

    const commission = (totalBetAmount * rates[i]) / 100;

    const pendingCommission = new PendingCommission({
      referrerId: referrer._id,
      betUserId: userId,
      amount: commission,
      commissionLevel: i + 1,
      betAmount: totalBetAmount,
      gameType: gameType, // Add the gameType here
    });

    pendingCommissions.push(pendingCommission);
    currentUserId = referrer._id;
  }

  await Promise.all(pendingCommissions.map((pc) => pc.save()));
  return pendingCommissions;
}

async function processRebate(user, totalBetAmount,gameType) {
  const levelDoc = await Level.findOne();
  if (!levelDoc) return null;

  const levelMap = levelDoc.levels.reduce((map, level) => {
    map[level.awarded] = level;
    return map;
  }, {});

  const highestAchievement = user.achievements
    .map((achievement) => {
      const levelName = achievement
        .replace("Reached ", "")
        .replace(" level", "");
      return levelMap[levelName];
    })
    .reduce((highest, current) => {
      return current && (!highest || current.minAmount > highest.minAmount)
        ? current
        : highest;
    }, null);

  if (highestAchievement) {
    const rebatePercentage = highestAchievement.rebatePercentage;
    const rebateAmount = (totalBetAmount * rebatePercentage) / 100;

    user.walletAmount += rebateAmount;

    const newRebate = new Rebate({
      userId: user._id,
      levelAwarded: highestAchievement.awarded,
      rebatePercentage,
      rebateAmount,
      walletAmountAfterRebate: user.walletAmount,
      bettingAmount: totalBetAmount,
      date: new Date(),
    });

    await Promise.all([
      user.save(),
      newRebate.save(),
      addTransactionDetails(
        user._id,
        rebateAmount,
        "RebateBonus",
        new Date(),
        0,
        totalBetAmount,
        gameType
      ),
    ]);

    return {
      percentage: rebatePercentage,
      amount: rebateAmount,
    };
  }

  return null;
}

module.exports = {
  createPendingCommissions,
  processRebate
};