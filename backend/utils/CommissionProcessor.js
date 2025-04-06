const cron = require("node-cron");
const mongoose = require("mongoose");
const PendingCommission = require("../models/PendingCommission");
const User = require("../models/userModel");
const { addTransactionDetails } = require("../controllers/TransactionHistoryControllers");

class CommissionProcessor {
  constructor() {
    this.isProcessing = false;
    this.batchSize = 100;
  }
 
  initScheduler() {
    cron.schedule("1 0 * * *", async () => {
      await this.processAllPendingCommissions();
      await this.processDepositCommissions();
    });
  }

  async processAllPendingCommissions() {
    if (this.isProcessing) {
      console.log("Commission processing already in progress");
      return;
    }

    this.isProcessing = true;
    let processedCount = 0;
    let hasMore = true;

    try {
      while (hasMore) {
        const result = await this.processBatch();
        if (result.processedCount === 0) {
          hasMore = false;
        } else {
          processedCount += result.processedCount;
        }
      }
      console.log(`Total commissions processed: ${processedCount}`);
    } catch (error) {
      console.error("Error in commission processing:", error);
    } finally {
      this.isProcessing = false;
    }
  }

  async processBatch() {
    let processedCount = 0;

    try {
      const pendingCommissions = await PendingCommission.find({
        processed: false,
      })
        .limit(this.batchSize)
        .lean();

      if (pendingCommissions.length === 0) {
        return { processedCount: 0 };
      }

      const commissionsByReferrer = this.groupCommissionsByReferrer(pendingCommissions);
      const processingResults = await this.processCommissionsByReferrer(commissionsByReferrer);

      const successfullyProcessedIds = processingResults
        .filter((result) => result.success)
        .map((result) => result.commissionId);

      if (successfullyProcessedIds.length > 0) {
        await PendingCommission.updateMany(
          { _id: { $in: successfullyProcessedIds } },
          { $set: { processed: true } }
        );
      }

      processedCount = successfullyProcessedIds.length;
      return { processedCount };
    } catch (error) {
      console.error("Error processing batch:", error);
      return { processedCount: 0 };
    }
  }

  async processDepositCommissions() {
    console.log("Processing deposit commissions");
    const yesterday = new Date();
    yesterday.setDate(yesterday.getDate() - 1);
    yesterday.setHours(0, 0, 0, 0);

    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const pendingCommissions = await PendingCommission.find({
      createdAt: { $gte: yesterday, $lt: today },
      gameType: "deposit",
      processed: false,
    });

    for (const commission of pendingCommissions) {
      try {
        const referrer = await User.findById(commission.referrerId);
        if (!referrer) {
          console.log(`Referrer not found for commission: ${commission._id}`);
          continue;
        }

        await User.findByIdAndUpdate(commission.referrerId, {
          $inc: { walletAmount: commission.amount }
        });

        await this.updateCommissionRecord(
          referrer._id,
          commission.betUserId,
          commission,
          today
        );

        await addTransactionDetails(
          referrer._id,
          commission.amount,
          "commission",
          new Date(),
          0,
          commission.betAmount,
          "deposit",
          commission.betUserId,
          0,
          commission.commissionLevel
        );

        commission.processed = true;
        await commission.save();

        console.log(`Processed commission ${commission._id} for referrer ${referrer._id}`);
      } catch (error) {
        console.error(`Error processing deposit commission ${commission._id}:`, error);
      }
    }
  }

  groupCommissionsByReferrer(pendingCommissions) {
    return pendingCommissions.reduce((acc, commission) => {
      const referrerId = commission.referrerId.toString();
      if (!acc[referrerId]) {
        acc[referrerId] = [];
      }
      acc[referrerId].push(commission);
      return acc;
    }, {});
  }

  async processCommissionsByReferrer(commissionsByReferrer) {
    const processingResults = [];

    for (const [referrerId, commissions] of Object.entries(commissionsByReferrer)) {
      try {
        const referrer = await User.findById(referrerId);
        if (!referrer) {
          commissions.forEach((commission) => {
            processingResults.push({
              commissionId: commission._id,
              success: false,
              error: "Referrer not found"
            });
          });
          continue;
        }

        const totalCommission = commissions.reduce(
          (sum, commission) => sum + commission.amount,
          0
        );

        await User.findByIdAndUpdate(
          referrerId,
          { $inc: { walletAmount: totalCommission } }
        );

        for (const commission of commissions) {
          try {
            await this.processIndividualCommission(commission, referrer);
            processingResults.push({
              commissionId: commission._id,
              success: true
            });
          } catch (error) {
            console.error(`Error processing commission ${commission._id}:`, error);
            processingResults.push({
              commissionId: commission._id,
              success: false,
              error: error.message
            });
          }
        }
      } catch (error) {
        console.error(`Error processing referrer ${referrerId}:`, error);
        commissions.forEach((commission) => {
          processingResults.push({
            commissionId: commission._id,
            success: false,
            error: error.message
          });
        });
      }
    }

    return processingResults;
  }

  async processIndividualCommission(commission, referrer) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const transactionGameType = commission.gameType === "deposit" ? "N/A" : commission.gameType;

    await addTransactionDetails(
      referrer._id,
      commission.amount,
      "commission",
      new Date(),
      0,
      commission.betAmount,
      transactionGameType,
      commission.betUserId,
      0,
      commission.commissionLevel
    );

    const betUser = await User.findById(commission.betUserId).lean();
    if (betUser) {
      await this.updateCommissionRecord(
        referrer._id,
        betUser,
        commission,
        today
      );
    }
  }

  async updateCommissionRecord(referrerId, betUser, commission, today) {
    const tomorrow = new Date(today.getTime() + 24 * 60 * 60 * 1000);

    const existingRecord = await User.findOne({
      _id: referrerId,
      "commissionRecords.date": { $gte: today, $lt: tomorrow },
      "commissionRecords.uid": betUser.uid
    });

    if (existingRecord) {
      await User.updateOne(
        {
          _id: referrerId,
          "commissionRecords.date": { $gte: today, $lt: tomorrow },
          "commissionRecords.uid": betUser.uid
        },
        {
          $inc: {
            "commissionRecords.$.commission": commission.amount,
            "commissionRecords.$.betAmount": commission.betAmount
          }
        }
      );
    } else {
      await User.findByIdAndUpdate(
        referrerId,
        {
          $push: {
            commissionRecords: {
              date: today,
              level: commission.commissionLevel,
              uid: betUser.uid,
              commission: commission.amount,
              betAmount: commission.betAmount
            }
          }
        }
      );
    }
  }
}

const commissionProcessor = new CommissionProcessor();
module.exports = commissionProcessor;