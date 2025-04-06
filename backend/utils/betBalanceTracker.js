const Bet = require("../models/betsModel");
const K3Bet = require("../models/K3BetModel");
const TrxBet = require("../models/TRXBetModel");
const FiveDBet = require("../models/5DBetModel");
const DepositHistory = require("../models/depositHistoryModel");
const TransactionHistory = require("../models/TransictionHistory");

const calculateUserDepositBalance = async (userId) => {
  try {
    // Get total deposits and bonus transactions in parallel
    const [totalDeposits, bonusTransactions] = await Promise.all([
      // Get deposits with their bonuses
      DepositHistory.aggregate([
        {
          $match: {
            userId: userId,
            depositStatus: "completed"
          }
        },
        {
          $group: {
            _id: null,
            total: { 
              $sum: { 
                $add: [
                  "$depositAmount", 
                  "$depositBonus", 
                  "$signupBonus"
                ] 
              }
            }
          }
        }
      ]),
      // Get bonus amounts from transactions
      TransactionHistory.aggregate([
        {
          $match: {
            user: userId,
            type: {
              $in: [
                "AttendanceBonus",
                "VIPLevelReward",
                "VIPMonthlyReward",
                "WalletIncrease",
                "Coupon",
                "Invitation Bonus",
                "DailyReward"
              ]
            }
          }
        },
        {
          $group: {
            _id: null,
            totalBonus: { $sum: "$amount" }
          }
        }
      ])
    ]);

    // Calculate total available amount including all bonuses
    const totalAvailableAmount = (totalDeposits[0]?.total || 0) + (bonusTransactions[0]?.totalBonus || 0);

    // Get total bets from all game types considering both deposit and partial bets
    const [wingoBets, k3Bets, trxBets, fiveDBets] = await Promise.all([
      // Wingo bets
      Bet.aggregate([
        {
          $match: {
            userId: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }]
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$betSource", "deposit"] },
                  { $multiply: ["$betAmount", "$multiplier"] },
                  "$betSourceAmount"
                ]
              }
            }
          }
        }
      ]),
      // K3 bets
      K3Bet.aggregate([
        {
          $match: {
            user: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }]
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$betSource", "deposit"] },
                  { $multiply: ["$betAmount", "$multiplier"] },
                  "$betSourceAmount"
                ]
              }
            }
          }
        }
      ]),
      // TRX bets
      TrxBet.aggregate([
        {
          $match: {
            userId: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }]
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$betSource", "deposit"] },
                  { $multiply: ["$betAmount", "$multiplier"] },
                  "$betSourceAmount"
                ]
              }
            }
          }
        }
      ]),
      // 5D bets
      FiveDBet.aggregate([
        {
          $match: {
            user: userId,
            $or: [{ betSource: "deposit" }, { betSource: "partial" }]
          }
        },
        {
          $group: {
            _id: null,
            total: {
              $sum: {
                $cond: [
                  { $eq: ["$betSource", "deposit"] },
                  { $multiply: ["$betAmount", "$multiplier"] },
                  "$betSourceAmount"
                ]
              }
            }
          }
        }
      ])
    ]);

    // Calculate total bets from deposit funds and partial deposits
    const totalDepositBets = 
      (wingoBets[0]?.total || 0) +
      (k3Bets[0]?.total || 0) +
      (trxBets[0]?.total || 0) +
      (fiveDBets[0]?.total || 0);

    // Calculate remaining deposit balance
    const depositBalance = totalAvailableAmount - totalDepositBets;
    
    // Debug logging
    console.log({
      userId,
      totalDeposits: totalDeposits[0]?.total || 0,
      totalBonuses: bonusTransactions[0]?.totalBonus || 0,
      totalAvailableAmount,
      totalDepositBets,
      depositBalance: Math.max(0, depositBalance),
      betBreakdown: {
        wingo: wingoBets[0]?.total || 0,
        k3: k3Bets[0]?.total || 0,
        trx: trxBets[0]?.total || 0,
        fiveD: fiveDBets[0]?.total || 0
      }
    });

    return Math.max(0, depositBalance);
  } catch (error) {
    console.error("Error calculating deposit balance:", error);
    throw error;
  }
};

module.exports = { calculateUserDepositBalance };