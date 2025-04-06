const express = require("express");
const cron = require("node-cron");
const moment = require("moment");
const FiveDProfitLoss = require("../models/FiveDProfitLossSchema");

// Timer models (simplified for this example)
const Timer1Min = require("../models/timersModel");
const Timer3Min = require("../models/timersModel");
const Timer5Min = require("../models/timersModel");
const Timer10Min = require("../models/timersModel");

// Import necessary models
const FiveDBetModel = require("../models/5DBetModel");
const FiveDResult = require("../models/5DResultModel");
const User = require("../models/userModel");
const FiveDBet = require("../models/5DBetModel");
const ManualResult = require("../models/5DManualResultModel");
// Function to generate random number between min and max
const getRandomNumber = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};
// Helper function to get least betted number within a range
const getLeastBettedNumber = (bets, start, end) => {
  let leastBetAmount = Infinity;
  let leastBetNumbers = [];

  for (let i = start; i <= end; i++) {
    const betAmount = bets[i] || 0;
    if (betAmount <= leastBetAmount) {
      if (betAmount < leastBetAmount) {
        leastBetAmount = betAmount;
        leastBetNumbers = [i];
      } else {
        leastBetNumbers.push(i);
      }
    }
  }

  return leastBetNumbers[Math.floor(Math.random() * leastBetNumbers.length)];
};

function calculateSizeParityReturn() {
  return 1.92; // As specified, the return for size and parity bets is *1.92
}

// Function to return the multiplier for number bets
function calculateReturn(number) {
  return 9; // The return for number bets is *9
}

// Function to generate period ID
const generatePeriodId = (timerType) => {
  const now = moment();
  const date = now.format("YYYYMMDD");
  let sequence;

  switch (timerType) {
    case "1min":
      sequence = now.hours() * 60 + now.minutes();
      break;
    case "3min":
      sequence = Math.floor((now.hours() * 60 + now.minutes()) / 3);
      break;
    case "5min":
      sequence = Math.floor((now.hours() * 60 + now.minutes()) / 5);
      break;
    case "10min":
      sequence = Math.floor((now.hours() * 60 + now.minutes()) / 10);
      break;
    default:
      throw new Error("Invalid timer type");
  }

  return `${date}${sequence.toString().padStart(4, "0")}`;
};

async function processBets(bets, sectionOutcome, totalSumOutcome) {
  let totalBetAmount = 0;
  let totalTaxAmount = 0;
  let totalWinAmount = 0;
  if (bets && bets.length > 0) {
  await Promise.all(
    bets.map(async (bet) => {
      try {
        console.log(`Processing bet for ${bet._id}...`);

        let userWon = false;
        let winAmount = 0;
        const betOutcome = [];

        // Process totalSum bets
        if (bet.totalSum) {
          console.log(
            `Processing totalSum bet: ${JSON.stringify(bet.totalSum)}`
          );

          if (bet.totalSum.size === totalSumOutcome.size) {
            winAmount += bet.totalBet * calculateSizeParityReturn();
            betOutcome.push({
              type: "totalSum",
              option: "size",
              bet: bet.totalSum.size,
              result: totalSumOutcome.size,
              status: "Win",
            });
            userWon = true;
          } else if (bet.totalSum.size) {
            betOutcome.push({
              type: "totalSum",
              option: "size",
              bet: bet.totalSum.size,
              result: totalSumOutcome.size,
              status: "Loss",
            });
          }

          if (bet.totalSum.parity === totalSumOutcome.parity) {
            winAmount += bet.totalBet * calculateSizeParityReturn();
            betOutcome.push({
              type: "totalSum",
              option: "parity",
              bet: bet.totalSum.parity,
              result: totalSumOutcome.parity,
              status: "Win",
            });
            userWon = true;
          } else if (bet.totalSum.parity) {
            betOutcome.push({
              type: "totalSum",
              option: "parity",
              bet: bet.totalSum.parity,
              result: totalSumOutcome.parity,
              status: "Loss",
            });
          }
        }

        // Process section bets
        if (bet.sectionBets) {
          console.log("Processing section bets...");
          Object.keys(bet.sectionBets).forEach((section) => {
            const sectionBet = bet.sectionBets[section];
            const outcome = sectionOutcome[section];

            console.log(
              `Processing section ${section}: ${JSON.stringify(sectionBet)}`
            );
            console.log(`Section outcome: ${JSON.stringify(outcome)}`);

            if (sectionBet.size === outcome.size) {
              winAmount += bet.totalBet * calculateSizeParityReturn();
              betOutcome.push({
                type: "section",
                section,
                option: "size",
                bet: sectionBet.size,
                result: outcome.size,
                status: "Win",
              });
              userWon = true;
            } else if (sectionBet.size) {
              betOutcome.push({
                type: "section",
                section,
                option: "size",
                bet: sectionBet.size,
                result: outcome.size,
                status: "Loss",
              });
            }

            if (sectionBet.parity === outcome.parity) {
              winAmount += bet.totalBet * calculateSizeParityReturn();
              betOutcome.push({
                type: "section",
                section,
                option: "parity",
                bet: sectionBet.parity,
                result: outcome.parity,
                status: "Win",
              });
              userWon = true;
            } else if (sectionBet.parity) {
              betOutcome.push({
                type: "section",
                section,
                option: "parity",
                bet: sectionBet.parity,
                result: outcome.parity,
                status: "Loss",
              });
            }

            if (Array.isArray(sectionBet.numberBet)) {
              sectionBet.numberBet.forEach((number) => {
                if (number === outcome.number) {
                  winAmount += bet.totalBet * calculateReturn(number);
                  betOutcome.push({
                    type: "section",
                    section,
                    option: "number",
                    bet: number,
                    result: outcome.number,
                    status: "Win",
                  });
                  userWon = true;
                } else {
                  betOutcome.push({
                    type: "section",
                    section,
                    option: "number",
                    bet: number,
                    result: outcome.number,
                    status: "Loss",
                  });
                }
              });
            }
          });
        }

        console.log(`User ${userWon ? "won" : "lost"}: ${winAmount}`);

        // Update user's balance if they won
        if (userWon) {
          try {
            console.log("Updating user's balance...");
            await User.updateOne(
              { _id: bet.user },
              { $inc: { walletAmount: winAmount } }
            );
          } catch (error) {
            console.error(`Error updating user's balance: ${error.message}`);
          }
        }
      // Calculate bet amount and tax
      const betAmount = bet.totalBet || 0;
      const taxRate = 0.02; // 2% tax rate
      const taxAmount = betAmount * taxRate;
      const totalBetAfterTax = betAmount - taxAmount;

      // Update totals for profit/loss calculation
      totalBetAmount += totalBetAfterTax;
      totalTaxAmount += taxAmount;
      totalWinAmount += winAmount;

      // Update the bet model with betOutcome, winAmount, and other relevant fields
      const updateFields = {
        status: userWon ? "Succeed" : "Failed",
        winAmount,
        winLoss: userWon ? winAmount : -totalBetAfterTax,
        betOutcome,
        resultOutcome: {
          sectionOutcome,
          totalSumOutcome,
        },
        totalBetAfterTax,
        taxAmount
      };
      console.log(
        `Updating bet ${bet._id} with: ${JSON.stringify(updateFields)}`
      );
      await FiveDBet.updateOne({ _id: bet._id }, { $set: updateFields });
    } catch (error) {
      console.error(`Error processing bet ${bet._id}: ${error.message}`);
    }
  })
);
} else {
  console.log("No bets placed for this period.");
}

console.log("================ totalBetAmount, totalTaxAmount, totalWinAmount ================",totalBetAmount, totalTaxAmount, totalWinAmount)

return { totalBetAmount, totalTaxAmount, totalWinAmount };
}


// Main timer creation function
const createTimer3 = (TimerModel, interval, timerName) => {
  const cronInterval = `*/${interval} * * * *`;

  const jobFunction = async () => {
    console.log(`\n--- Starting job for ${timerName} ---\n`);

    const periodId = generatePeriodId(timerName);
    console.log(`Creating timer entry for ${timerName}, periodId: ${periodId}`);

    try {
      await TimerModel.create({ periodId });
      console.log(`Timer created for ${timerName} & periodId: ${periodId}`);

      setTimeout(async () => {
        try {
          console.log(`Processing results for periodId: ${periodId}`);

          // Check for manual result first
          const manualResult = await ManualResult.findOne({ periodId });
          let sectionOutcome, totalSumOutcome, allBets;
          if (manualResult) {
            console.log(`Manual result found for periodId: ${periodId}`);
            const existingResult = await FiveDResult.findOne({ periodId });

            if (!existingResult) {
              await FiveDResult.create({
                timerName,
                periodId,
                sectionOutcome: manualResult.sectionOutcome,
                totalSum: manualResult.totalSum,
                manuallySet: true,
              });

              // Get all bets for updating results
              allBets = await FiveDBetModel.find({ periodId });
              const { totalBetAmount, totalTaxAmount, totalWinAmount } = await processBets(
                allBets,
                manualResult.sectionOutcome,
                manualResult.totalSum
              );

              // Calculate profit/loss
              const profitLoss = totalBetAmount - totalWinAmount + totalTaxAmount;

              // Create FiveDProfitLoss document
              await FiveDProfitLoss.create({
                periodId,
                timerType: timerName,
                totalBetAmount,
                totalTaxAmount,
                totalWinAmount,
                profitLoss
              });

              console.log(`Profit/Loss for ${periodId}: ${profitLoss}`);
            }
          } else {
            // Auto-generation logic
            const existingResult = await FiveDResult.findOne({ periodId });
            if (existingResult) {
              console.log(
                `Result already exists for periodId: ${periodId}. Skipping.`
              );
              return;
            }

            // Get non-restricted bets for calculation
            const calculationBets = await FiveDBetModel.find({
              periodId,
              userType: { $ne: "Restricted" },
            });

            // Get all bets for updating results
            allBets = await FiveDBetModel.find({ periodId });

            if (calculationBets.length > 0) {
              console.log("Processing bets for outcome calculation...");

              const sectionBetsTotal = { A: {}, B: {}, C: {}, D: {}, E: {} };
              const totalSumBets = {
                size: { Big: 0, Small: 0 },
                parity: { Odd: 0, Even: 0 },
              };

              // Populate bet totals using only non-restricted bets
              calculationBets.forEach((bet) => {
                if (bet.sectionBets) {
                  Object.keys(bet.sectionBets).forEach((section) => {
                    const sectionBet = bet.sectionBets[section];

                    // Process number bets
                    if (Array.isArray(sectionBet.numberBet)) {
                      sectionBet.numberBet.forEach((value) => {
                        if (typeof value === "number") {
                          sectionBetsTotal[section][value] =
                            (sectionBetsTotal[section][value] || 0) +
                            bet.betAmount;
                        }
                      });
                    }

                    // Process size and parity bets
                    if (sectionBet.size) {
                      if (!sectionBetsTotal[section].size) {
                        sectionBetsTotal[section].size = { Big: 0, Small: 0 };
                      }
                      sectionBetsTotal[section].size[sectionBet.size] +=
                        bet.betAmount;
                    }
                    if (sectionBet.parity) {
                      if (!sectionBetsTotal[section].parity) {
                        sectionBetsTotal[section].parity = { Odd: 0, Even: 0 };
                      }
                      sectionBetsTotal[section].parity[sectionBet.parity] +=
                        bet.betAmount;
                    }
                  });
                }

                if (bet.totalSum) {
                  if (bet.totalSum.size) {
                    totalSumBets.size[bet.totalSum.size] += bet.betAmount;
                  }
                  if (bet.totalSum.parity) {
                    totalSumBets.parity[bet.totalSum.parity] += bet.betAmount;
                  }
                }
              });

              // Find max bet section and option
              let maxBetSection;
              let maxBetOption;
              let maxBetAmount = 0;

              Object.keys(sectionBetsTotal).forEach((section) => {
                Object.keys(sectionBetsTotal[section]).forEach((option) => {
                  if (typeof sectionBetsTotal[section][option] === "object") {
                    Object.keys(sectionBetsTotal[section][option]).forEach(
                      (subOption) => {
                        if (
                          sectionBetsTotal[section][option][subOption] >
                          maxBetAmount
                        ) {
                          maxBetAmount =
                            sectionBetsTotal[section][option][subOption];
                          maxBetSection = section;
                          maxBetOption = `${option}_${subOption}`;
                        }
                      }
                    );
                  } else {
                    if (sectionBetsTotal[section][option] > maxBetAmount) {
                      maxBetAmount = sectionBetsTotal[section][option];
                      maxBetSection = section;
                      maxBetOption = `number_${option}`;
                    }
                  }
                });
              });

              // Compare with totalSum bets
              Object.keys(totalSumBets).forEach((option) => {
                Object.keys(totalSumBets[option]).forEach((subOption) => {
                  if (totalSumBets[option][subOption] > maxBetAmount) {
                    maxBetAmount = totalSumBets[option][subOption];
                    maxBetSection = "totalSum";
                    maxBetOption = `${option}_${subOption}`;
                  }
                });
              });

              let sectionOutcome = {};
              let totalSumOutcome;

              if (maxBetSection === "totalSum") {
                // Process totalSum result generation
                const leastBettedSize =
                  totalSumBets.size.Big <= totalSumBets.size.Small
                    ? "Big"
                    : "Small";
                const leastBettedParity =
                  totalSumBets.parity.Odd <= totalSumBets.parity.Even
                    ? "Odd"
                    : "Even";

                let totalSum = 0;
                for (let i = 0; i < 5; i++) {
                  const section = ["A", "B", "C", "D", "E"][i];
                  const start = leastBettedSize === "Small" ? 0 : 5;
                  const end = leastBettedSize === "Small" ? 4 : 9;

                  const sectionNumber = getLeastBettedNumber(
                    sectionBetsTotal[section],
                    start,
                    end
                  );

                  sectionOutcome[section] = {
                    number: sectionNumber,
                    size: sectionNumber >= 5 ? "Big" : "Small",
                    parity: sectionNumber % 2 === 0 ? "Even" : "Odd",
                  };

                  totalSum += sectionNumber;
                }

                totalSumOutcome = {
                  value: totalSum,
                  size: totalSum >= 23 ? "Big" : "Small",
                  parity: totalSum % 2 === 0 ? "Even" : "Odd",
                };
              } else {
                // Process section bets
                Object.keys(sectionBetsTotal).forEach((section) => {
                  const bets = sectionBetsTotal[section];

                  // Initialize all numbers
                  for (let i = 0; i <= 9; i++) {
                    if (!bets.hasOwnProperty(i)) {
                      bets[i] = 0;
                    }
                  }

                  const leastBetNumber = getLeastBettedNumber(bets, 0, 9);

                  sectionOutcome[section] = {
                    number: leastBetNumber,
                    size: leastBetNumber >= 5 ? "Big" : "Small",
                    parity: leastBetNumber % 2 === 0 ? "Even" : "Odd",
                  };
                });

                const totalSumValue = Object.values(sectionOutcome).reduce(
                  (sum, outcome) => sum + outcome.number,
                  0
                );
                totalSumOutcome = {
                  value: totalSumValue,
                  size: totalSumValue >= 23 ? "Big" : "Small",
                  parity: totalSumValue % 2 === 0 ? "Even" : "Odd",
                };
              }

              // Save result and process all bets
              await FiveDResult.create({
                timerName,
                periodId,
                sectionOutcome,
                totalSum: totalSumOutcome,
              });

              // Process ALL bets (including restricted users) with the generated outcome
              const { totalBetAmount, totalTaxAmount, totalWinAmount } = await processBets(allBets, sectionOutcome, totalSumOutcome);

              // Calculate profit/loss
              const profitLoss = totalBetAmount - totalWinAmount + totalTaxAmount;

              // Create FiveDProfitLoss document
              await FiveDProfitLoss.create({
                periodId,
                timerType: timerName,
                totalBetAmount,
                totalTaxAmount,
                totalWinAmount,
                profitLoss
              });

              console.log(`Profit/Loss for ${periodId}: ${profitLoss}`);
            } else {
              // Generate random outcome when no bets exist
              const sectionOutcome = {};
              ["A", "B", "C", "D", "E"].forEach((section) => {
                const randomNumber = Math.floor(Math.random() * 10);
                sectionOutcome[section] = {
                  number: randomNumber,
                  size: randomNumber >= 5 ? "Big" : "Small",
                  parity: randomNumber % 2 === 0 ? "Even" : "Odd",
                };
              });

              const totalSumValue = Object.values(sectionOutcome).reduce(
                (sum, outcome) => sum + outcome.number,
                0
              );
              const totalSumOutcome = {
                value: totalSumValue,
                size: totalSumValue >= 23 ? "Big" : "Small",
                parity: totalSumValue % 2 === 0 ? "Even" : "Odd",
              };

              await FiveDResult.create({
                timerName,
                periodId,
                sectionOutcome,
                totalSum: totalSumOutcome,
              });

              // Process any existing bets (should be none, but just in case)
              if (allBets.length > 0) {
                const { totalBetAmount, totalTaxAmount, totalWinAmount } = await processBets(allBets, sectionOutcome, totalSumOutcome);

                // Calculate profit/loss
                const profitLoss = totalBetAmount - totalWinAmount + totalTaxAmount;

                // Create FiveDProfitLoss document
                await FiveDProfitLoss.create({
                  periodId,
                  timerType: timerName,
                  totalBetAmount,
                  totalTaxAmount,
                  totalWinAmount,
                  profitLoss
                });

                console.log(`Profit/Loss for ${periodId}: ${profitLoss}`);
              } else {
                // No bets placed, create a zero profit/loss entry
                await FiveDProfitLoss.create({
                  periodId,
                  timerType: timerName,
                  totalBetAmount: 0,
                  totalTaxAmount: 0,
                  totalWinAmount: 0,
                  profitLoss: 0
                });

                console.log(`No bets placed. Zero profit/loss entry created for ${periodId}`);
              }
            }
          }
        } catch (error) {
          console.error(`Error during ${timerName} job:`, error);
        }
      }, interval * 60 * 1000);
    } catch (error) {
      console.error(`Error creating timer for ${timerName}:`, error);
    }
  };

  cron.schedule(cronInterval, jobFunction).start();
};

// Function to calculate remaining time
const calculateRemainingTime3 = (periodId, timerType) => {
  const now = moment();
  const date = periodId.substring(0, 8);
  const sequence = parseInt(periodId.substring(8));

  let intervalMinutes;
  let periodStart;

  switch (timerType) {
    case "1min":
      intervalMinutes = 1;
      periodStart = moment(date, "YYYYMMDD").add(sequence, "minutes");
      break;
    case "3min":
      intervalMinutes = 3;
      periodStart = moment(date, "YYYYMMDD").add(sequence * 3, "minutes");
      break;
    case "5min":
      intervalMinutes = 5;
      periodStart = moment(date, "YYYYMMDD").add(sequence * 5, "minutes");
      break;
    case "10min":
      intervalMinutes = 10;
      periodStart = moment(date, "YYYYMMDD").add(sequence * 10, "minutes");
      break;
    default:
      console.error("Invalid timer type:", timerType);
      return 0;
  }

  const periodEnd = periodStart.clone().add(intervalMinutes, "minutes");
  const remainingTime = periodEnd.diff(now, "seconds");

  return Math.max(remainingTime, 0);
};

// Function to format seconds to MM:SS
function secondsToHms3(d) {
  d = Number(d);
  const m = Math.floor(d / 60);
  const s = Math.floor(d % 60);
  return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

// Function to get the latest period ID from a specific timer
async function getLatestPeriodId3(timerName) {
  const timerModels = {
    "1min": Timer1Min,
    "3min": Timer3Min,
    "5min": Timer5Min,
    "10min": Timer10Min,
  };
  const timerModel = timerModels[timerName];
  const latestTimer = await timerModel.find().sort({ _id: -1 }).limit(1);
  return latestTimer[0] ? latestTimer[0].periodId : null;
}

module.exports = {
  createTimer3,
  getLatestPeriodId3,
  calculateRemainingTime3,
  secondsToHms3,
};
