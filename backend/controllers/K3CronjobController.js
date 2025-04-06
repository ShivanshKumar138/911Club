const express = require("express");
const User = require("../models/userModel");
const K3Result = require("../models/K3ResultModel");
const k3betmodel = require("../models/K3BetModel");
const cron = require("node-cron");
const moment = require("moment");
const K3ManualResult = require("../models/K3ManualResultSchema");
const K3ProfitLoss = require("../models/K3ProfitLossSchema");
const GameWinningType = require("../models/GameWinningType");
// Return values for the sum of dice outcomes
const returnValues = {
  3: 207.36,
  4: 69.12,
  5: 34.56,
  6: 20.74,
  7: 13.83,
  8: 9.88,
  9: 8.3,
  10: 7.68,
  11: 7.68,
  12: 8.3,
  13: 9.88,
  14: 13.83,
  15: 20.74,
  16: 34.56,
  17: 69.12,
  18: 207.36,
};

function secondsToHms2(d) {
  d = Number(d);
  var m = Math.floor((d % 3600) / 60);
  return ("0" + m).slice(-2) + ":" + ("0" + (d % 60)).slice(-2);
}

function generatePeriodId(timerType) {
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
}

async function getLatestPeriodId2(timerName) {
  const timerModels = {
    "1min": Timer1Min,
    "3min": Timer3Min,
    "5min": Timer5Min,
    "10min": Timer10Min,
  };

  const timerModel = timerModels[timerName];
  if (!timerModel) {
    throw new Error("Invalid timer name");
  }

  const latestTimer = await timerModel.findOne().sort({ _id: -1 });

  if (!latestTimer) {
    return generatePeriodId(timerName);
  }

  return latestTimer.periodId;
}

const createTimer2 = (TimerModel, interval, timerName) => {
  const cronInterval = `*/${interval} * * * *`;

  const jobFunction = async () => {
    // console.log(`Starting job for ${timerName}...`);
    const periodId = generatePeriodId(timerName);
    // console.log(`Creating timer entry for periodId: ${periodId}`);
    await TimerModel.create({ periodId });

    setTimeout(async () => {
      try {
        // console.log(`Processing results for ${timerName} & ${periodId}`);

        // Fetch all bets for this periodId
        const allBets = await k3betmodel.find({ periodId });
        // console.log(
        //   `  Fetched ${allBets.length} bets for periodId: ${periodId}`
        // );

        // Initialize total bets object
        const totalBets = {
          totalSum: new Array(18).fill(0),
          twoSameOneDifferent: new Array(6).fill(0),
          threeSame: new Array(6).fill(0),
          threeDifferentNumbers: 0,
          size: { Small: 0, Big: 0 },
          parity: { Even: 0, Odd: 0 },
        };

        // Sum up all bets in respective categories
        allBets.forEach((bet) => {
          const totalBet = bet.betAmount * (bet.multiplier || 1);
          switch (bet.selectedItem) {
            case "totalSum":
              totalBets.totalSum[bet.totalSum - 3] += totalBet;
              break;
            case "twoSameOneDifferent":
              bet.twoSameOneDifferent.forEach(
                (num) => (totalBets.twoSameOneDifferent[num - 1] += totalBet)
              );
              break;
            case "threeSame":
              bet.threeSame.forEach(
                (num) => (totalBets.threeSame[num - 1] += totalBet)
              );
              break;
            case "threeDifferentNumbers":
              totalBets.threeDifferentNumbers += totalBet;
              break;
            case "size":
              totalBets.size[bet.size] += totalBet;
              break;
            case "parity":
              totalBets.parity[bet.parity] += totalBet;
              break;
          }
        });

        // console.log(`  Total bets calculated:`);
        // console.log(JSON.stringify(totalBets, null, 2));

        // Fetch isRandomWinning flag
        const gameWinningType = await GameWinningType.findOne().sort({
          createdAt: -1,
        });
        const isRandomWinning = gameWinningType
          ? gameWinningType.isRandomWinning
          : false;

        // console.log(`  Is Random Winning: ${isRandomWinning}`);

        // Generate or fetch manual result
        let diceOutcomeD1, diceOutcomeD2, diceOutcomeD3, winningNumberTotalSum;
        const manualResult = await K3ManualResult.findOne({ periodId });

        if (manualResult) {
          // console.log(`  Manual result found for periodId: ${periodId}`);
          [diceOutcomeD1, diceOutcomeD2, diceOutcomeD3] =
            manualResult.diceOutcome;
        } else {
          // console.log(`  Generating result for periodId: ${periodId}`);
          if (isRandomWinning) {
            // console.log(`    Using random winning logic`);
            diceOutcomeD1 = Math.floor(Math.random() * 6) + 1;
            diceOutcomeD2 = Math.floor(Math.random() * 6) + 1;
            diceOutcomeD3 = Math.floor(Math.random() * 6) + 1;
          } else {
            // console.log(`    Using least betted option logic`);

            // Find least betted options
            const leastBettedSize =
              totalBets.size.Small <= totalBets.size.Big ? "Small" : "Big";
            const leastBettedParity =
              totalBets.parity.Odd <= totalBets.parity.Even ? "Odd" : "Even";

            // console.log(`      Least betted size: ${leastBettedSize}`);
            // console.log(`      Least betted parity: ${leastBettedParity}`);

            let attempts = 0;
            do {
              attempts++;
              diceOutcomeD1 = Math.floor(Math.random() * 6) + 1;
              diceOutcomeD2 = Math.floor(Math.random() * 6) + 1;
              diceOutcomeD3 = Math.floor(Math.random() * 6) + 1;
              winningNumberTotalSum =
                diceOutcomeD1 + diceOutcomeD2 + diceOutcomeD3;
              const generatedSize =
                winningNumberTotalSum >= 3 && winningNumberTotalSum <= 10
                  ? "Small"
                  : "Big";
              const generatedParity =
                winningNumberTotalSum % 2 === 0 ? "Even" : "Odd";

              if (
                generatedSize === leastBettedSize &&
                generatedParity === leastBettedParity
              ) {
                console.log(
                  `      Found matching result after ${attempts} attempts`
                );
                break;
              }
            } while (attempts < 1000); // Increased attempts to ensure we find a suitable outcome

            if (attempts >= 1000) {
              console.log(
                `      Failed to find exact match after 1000 attempts. Using last generated result.`
              );
            }
          }
        }

        winningNumberTotalSum = diceOutcomeD1 + diceOutcomeD2 + diceOutcomeD3;
        const size =
          winningNumberTotalSum >= 3 && winningNumberTotalSum <= 10
            ? "Small"
            : "Big";
        const parity = winningNumberTotalSum % 2 === 0 ? "Even" : "Odd";

        // console.log(`  Final result:`);
        // console.log(
        //   `    Dice outcomes: [${diceOutcomeD1}, ${diceOutcomeD2}, ${diceOutcomeD3}]`
        // );
        // console.log(`    Total sum: ${winningNumberTotalSum}`);
        // console.log(`    Size: ${size}`);
        // console.log(`    Parity: ${parity}`);

        // Insert the result into the database
        await K3Result.create({
          timerName,
          periodId,
          totalSum: winningNumberTotalSum,
          size,
          parity,
          diceOutcome: [diceOutcomeD1, diceOutcomeD2, diceOutcomeD3],
        });

        // console.log(`  Result inserted into K3Result collection`);

        // Initialize variables for profit/loss calculation
        let totalBetAmount = 0;
        let totalWinAmount = 0;
        let totalTaxAmount = 0;

        // Process the bets to determine winners
        // console.log(`  Processing individual bets:`);
        for (const bet of allBets) {
          let userWon = false;
          let winAmount = 0;
          const totalBet = bet.betAmount * (bet.multiplier || 1);
          const betItem = bet.selectedItem;

          // console.log(`    Processing bet: ${bet._id}`);
          // console.log(`      Bet type: ${betItem}`);
          // console.log(`      Bet amount: ${totalBet}`);

          switch (betItem) {
            case "totalSum":
              if (bet.totalSum === winningNumberTotalSum) {
                userWon = true;
                winAmount = totalBet * returnValues[winningNumberTotalSum];
              }
              break;
            case "twoSameOneDifferent":
              if (
                (diceOutcomeD1 === diceOutcomeD2 &&
                  diceOutcomeD3 !== diceOutcomeD1) ||
                (diceOutcomeD1 === diceOutcomeD3 &&
                  diceOutcomeD2 !== diceOutcomeD1) ||
                (diceOutcomeD2 === diceOutcomeD3 &&
                  diceOutcomeD1 !== diceOutcomeD2)
              ) {
                const sameNumber =
                  diceOutcomeD1 === diceOutcomeD2
                    ? diceOutcomeD1
                    : diceOutcomeD3;
                const differentNumber = [
                  diceOutcomeD1,
                  diceOutcomeD2,
                  diceOutcomeD3,
                ].find((n) => n !== sameNumber);
                if (
                  bet.twoSameOneDifferent.includes(sameNumber) &&
                  bet.twoSameOneDifferent.includes(differentNumber)
                ) {
                  userWon = true;
                  winAmount = totalBet * 2;
                }
              }
              break;
            case "threeSame":
              if (
                diceOutcomeD1 === diceOutcomeD2 &&
                diceOutcomeD2 === diceOutcomeD3 &&
                bet.threeSame.includes(diceOutcomeD1)
              ) {
                userWon = true;
                winAmount = totalBet * 3;
              }
              break;
            case "threeDifferentNumbers":
              if (
                diceOutcomeD1 !== diceOutcomeD2 &&
                diceOutcomeD1 !== diceOutcomeD3 &&
                diceOutcomeD2 !== diceOutcomeD3 &&
                bet.threeDifferentNumbers.includes(diceOutcomeD1) &&
                bet.threeDifferentNumbers.includes(diceOutcomeD2) &&
                bet.threeDifferentNumbers.includes(diceOutcomeD3)
              ) {
                userWon = true;
                winAmount = totalBet * 5;
              }
              break;
            case "size":
              if (bet.size === size) {
                userWon = true;
                winAmount = totalBet * 1.92;
              }
              break;
            case "parity":
              if (bet.parity === parity) {
                userWon = true;
                winAmount = totalBet * 1.92;
              }
              break;
          }

          // Update bet outcome and user's wallet based on result
          if (userWon) {
            const user = await User.findById(bet.user);
            if (user) {
              // console.log(`      User ${bet.user} won ${winAmount}`);
              user.walletAmount += winAmount;
              await user.save();
            }
            bet.status = "Succeed";
            bet.winLoss = winAmount;
            totalWinAmount += winAmount;
          } else {
            const tax = (totalBet * 2) / 100;
            bet.status = "Failed";
            bet.winLoss = (totalBet - tax) * -1;
            totalTaxAmount += tax;
          }

          totalBetAmount += totalBet;

          // console.log(`      Updating bet status for bet id: ${bet._id}`);
          await k3betmodel.findByIdAndUpdate(bet._id, {
            status: bet.status,
            winLoss: bet.winLoss,
            diceOutcome: [diceOutcomeD1, diceOutcomeD2, diceOutcomeD3],
            totalBet: totalBet,
          });
        }

        // Calculate profit/loss
        const profitLoss = totalBetAmount - totalWinAmount + totalTaxAmount;

        // Create a new K3ProfitLoss document
        await K3ProfitLoss.create({
          periodId,
          timerType: timerName,
          totalBetAmount,
          totalTaxAmount,
          totalWinAmount,
          profitLoss,
        });

        // console.log(`  K3 Profit/Loss calculated for ${timerName}:`);
        // console.log(`    Period ID: ${periodId}`);
        // console.log(`    Total Bet Amount: ${totalBetAmount}`);
        // console.log(`    Total Tax Amount: ${totalTaxAmount}`);
        // console.log(`    Total Win Amount: ${totalWinAmount}`);
        // console.log(`    Profit/Loss: ${profitLoss}`);
      } catch (error) {
        // console.error(`Error processing bets for ${timerName} & ${periodId}:`);
        console.error(error);
      }
    }, interval * 60 * 1000);

    console.log(`K3 Timer ${timerName} & ${periodId} started.`);
  };

  cron.schedule(cronInterval, jobFunction).start();
};

const calculateRemainingTime2 = (periodId, timerType) => {
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

module.exports = {
  createTimer2,
  getLatestPeriodId2,
  calculateRemainingTime2,
  secondsToHms2,
};
