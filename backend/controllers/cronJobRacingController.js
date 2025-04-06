const racingResult = require("../models/racingResultModel");
const ManualResult = require("../models/ManualResultRacing");
const cron = require("node-cron");
const moment = require("moment");
const Bets = require("../models/betsModel");
const User = require("../models/userModel");
const GameWinningType = require("../models/GameWinningType");

const {
  Timer1Min,
  Timer3Min,
  Timer5Min,
  Timer10Min,
  Timer30Sec,
} = require("../models/timersModel");
const WingoProfitLoss = require("../models/wingoProfitLossSchema");

function secondsToHms4(d) {
  d = Number(d);
  var m = Math.floor(d / 60);
  var s = Math.floor(d % 60);
  return ("0" + m).slice(-2) + ":" + ("0" + s).slice(-2);
}

const generatePeriodId = (timerType) => {
  const now = moment();
  const date = now.format("YYYYMMDD");
  let sequence;

  switch (timerType) {
    case "30sec":
      sequence = Math.floor(
        now.hours() * 120 + now.minutes() * 2 + now.seconds() / 30
      );
      break;
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

async function getLatestPeriodId4(timerName) {
  const timerModels = {
    "1min": Timer1Min,
    "3min": Timer3Min,
    "5min": Timer5Min,
    "10min": Timer10Min,
    "30sec": Timer30Sec,
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

const createTimer4 = (TimerModel, interval, timerName) => {
  // Set up the cron interval based on timer type
  const cronInterval =
    timerName === "30sec" ? "*/30 * * * * *" : `*/${interval} * * * *`;

  const jobFunction = async () => {
    const periodId = generatePeriodId(timerName);
    await TimerModel.create({ periodId });

    // Set timeout for processing results
    setTimeout(async () => {
      try {
        // Check for manual result
        const manualResult = await ManualResult.findOne({
          periodId,
          timer: timerName,
        });

        // Get calculation bets (non-restricted users)
        const calculationBets = await Bets.find({
          periodId,
          userType: { $ne: "Restricted" },
        });

        // Get all bets for updating results
        const allBets = await Bets.find({ periodId });

        // Initialize tracking variables
        let totalBetAmount = 0;
        let totalWinAmount = 0;
        let totalTax = 0;

        // Check winning type setting
        const gameWinningType = await GameWinningType.findOne();
        const isRandomWinning = gameWinningType
          ? gameWinningType.isRandomWinning
          : false;

        // Define outcome variables
        let numberOutcome, sizeOutcome, oddEvenOutcome;

        // Constants for game rules
        const NUMBER_MULTIPLIER = 8.775;
        const SIZE_MULTIPLIER = 2;
        const ODD_EVEN_MULTIPLIER = 2;

        // Function to calculate bet sums
        const calculateBetSums = (bets) => {
          const numberBetSums = Array.from({ length: 10 }, (_, i) => ({
            number: i.toString(),
            totalBet: 0,
          }));

          const sizeBetSums = {
            big: 0,
            small: 0,
          };

          const oddEvenBetSums = {
            odd: 0,
            even: 0,
          };

          bets.forEach((bet) => {
            if (/^[0-9]$/.test(bet.selectedItem)) {
              numberBetSums[parseInt(bet.selectedItem)].totalBet +=
                bet.totalBet;
            } else if (bet.selectedItem in sizeBetSums) {
              sizeBetSums[bet.selectedItem] += bet.totalBet;
            } else if (bet.selectedItem in oddEvenBetSums) {
              oddEvenBetSums[bet.selectedItem] += bet.totalBet;
            }
          });

          return { numberBetSums, sizeBetSums, oddEvenBetSums };
        };

        // Function to get item with least bets
        const getLeastBetItem = (betSums) => {
          if (Array.isArray(betSums)) {
            return betSums.reduce(
              (min, item) => (item.totalBet < min.totalBet ? item : min),
              betSums[0]
            ).number;
          }

          return Object.entries(betSums).reduce(
            (min, [key, value]) => (value < min.value ? { key, value } : min),
            {
              key: Object.keys(betSums)[0],
              value: betSums[Object.keys(betSums)[0]],
            }
          ).key;
        };

        // Function to get total bets in category
        const getTotalBetsInCategory = (betSums) => {
          if (Array.isArray(betSums)) {
            return betSums.reduce((sum, item) => sum + item.totalBet, 0);
          }
          return Object.values(betSums).reduce((sum, value) => sum + value, 0);
        };

        // Function to generate random outcome
        const generateRandomOutcome = () => {
          const number = Math.floor(Math.random() * 10).toString();
          const size = parseInt(number) > 4 ? "big" : "small";
          const oddEven = parseInt(number) % 2 === 0 ? "even" : "odd";

          return {
            number,
            size,
            oddEven,
            numberCategory: 1, // Default category 1
            sizeCategory: 1, // Default category 1
            oddEvenCategory: 1, // Default category 1
          };
        };

        // Determine game outcome
        if (manualResult) {
          // Use manual result if available
          numberOutcome = {
            value: manualResult.numberOutcome,
            category: manualResult.numberCategory || 1,
          };
          sizeOutcome = {
            value: manualResult.sizeOutcome,
            category: manualResult.sizeCategory || 1,
          };
          oddEvenOutcome = {
            value: manualResult.oddEvenOutcome,
            category: manualResult.oddEvenCategory || 1,
          };
        } else if (isRandomWinning) {
          // Generate random outcome if random winning is enabled
          const randomResult = generateRandomOutcome();
          numberOutcome = {
            value: randomResult.number,
            category: randomResult.numberCategory,
          };
          sizeOutcome = {
            value: randomResult.size,
            category: randomResult.sizeCategory,
          };
          oddEvenOutcome = {
            value: randomResult.oddEven,
            category: randomResult.oddEvenCategory,
          };
        } else {
          // Calculate outcome based on least bet sums
          if (calculationBets.length === 0) {
            // If no bets, generate random outcome
            const randomResult = generateRandomOutcome();
            numberOutcome = {
              value: randomResult.number,
              category: randomResult.numberCategory,
            };
            sizeOutcome = {
              value: randomResult.size,
              category: randomResult.sizeCategory,
            };
            oddEvenOutcome = {
              value: randomResult.oddEven,
              category: randomResult.oddEvenCategory,
            };
          } else {
            // Calculate bet sums
            const betSums = calculateBetSums(calculationBets);

            // Calculate total bets in each category
            const totalNumberBets = getTotalBetsInCategory(
              betSums.numberBetSums
            );
            const totalSizeBets = getTotalBetsInCategory(betSums.sizeBetSums);
            const totalOddEvenBets = getTotalBetsInCategory(
              betSums.oddEvenBetSums
            );

            // Determine primary category based on bet volume
            const categories = [
              { name: "number", total: totalNumberBets },
              { name: "size", total: totalSizeBets },
              { name: "oddEven", total: totalOddEvenBets },
            ].filter((cat) => cat.total > 0);

            // Sort categories by total bets (highest to lowest)
            categories.sort((a, b) => b.total - a.total);

            if (categories.length === 0) {
              // If no bets in any category, generate random outcome
              const randomResult = generateRandomOutcome();
              numberOutcome = {
                value: randomResult.number,
                category: randomResult.numberCategory,
              };
              sizeOutcome = {
                value: randomResult.size,
                category: randomResult.sizeCategory,
              };
              oddEvenOutcome = {
                value: randomResult.oddEven,
                category: randomResult.oddEvenCategory,
              };
            } else {
              // Use the category with the most bets to determine outcome
              const primaryCategory = categories[0].name;

              if (primaryCategory === "size") {
                // Size is primary category
                sizeOutcome = {
                  value: getLeastBetItem(betSums.sizeBetSums),
                  category: 1, // Default category
                };
                numberOutcome = {
                  value:
                    sizeOutcome.value === "big"
                      ? String(Math.floor(Math.random() * 5) + 5)
                      : String(Math.floor(Math.random() * 5)),
                  category: 1, // Default category
                };
                oddEvenOutcome = {
                  value:
                    parseInt(numberOutcome.value) % 2 === 0 ? "even" : "odd",
                  category: 1, // Default category
                };
              } else if (primaryCategory === "number") {
                // Number is primary category
                numberOutcome = {
                  value: getLeastBetItem(betSums.numberBetSums),
                  category: 1, // Default category
                };
                sizeOutcome = {
                  value: parseInt(numberOutcome.value) > 4 ? "big" : "small",
                  category: 1, // Default category
                };
                oddEvenOutcome = {
                  value:
                    parseInt(numberOutcome.value) % 2 === 0 ? "even" : "odd",
                  category: 1, // Default category
                };
              } else {
                // Odd/Even is primary category
                oddEvenOutcome = {
                  value: getLeastBetItem(betSums.oddEvenBetSums),
                  category: 1, // Default category
                };
                const numbersForOddEven =
                  oddEvenOutcome.value === "odd"
                    ? [1, 3, 5, 7, 9]
                    : [0, 2, 4, 6, 8];
                numberOutcome = {
                  value: String(
                    numbersForOddEven[
                      Math.floor(Math.random() * numbersForOddEven.length)
                    ]
                  ),
                  category: 1, // Default category
                };
                sizeOutcome = {
                  value: parseInt(numberOutcome.value) > 4 ? "big" : "small",
                  category: 1, // Default category
                };
              }
            }
          }
        }

        // Store result in database
        await racingResult.create({
          timer: timerName,
          periodId,
          numberOutcome,
          sizeOutcome,
          oddEvenOutcome,
          manuallySet: !!manualResult,
        });

        // Process all bets
        await Promise.all(
          allBets.map(async (bet) => {
            let winLoss = 0;
            let status = "Failed";

            // Only process bets from valid user types
            if (["Restricted", "Admin", "Normal"].includes(bet.userType)) {
              // Calculate winnings based on bet type
              if (bet.selectedItem === numberOutcome.value) {
                winLoss = bet.totalBet * NUMBER_MULTIPLIER;
              } else if (bet.selectedItem === sizeOutcome.value) {
                winLoss = bet.totalBet * SIZE_MULTIPLIER;
              } else if (bet.selectedItem === oddEvenOutcome.value) {
                winLoss = bet.totalBet * ODD_EVEN_MULTIPLIER;
              }

              // Update user wallet if they won
              if (winLoss > 0) {
                const user = await User.findById(bet.userId);
                if (user) {
                  user.walletAmount += winLoss;
                  await user.save();
                }
                status = "Succeed";
              } else {
                winLoss = bet.totalBet * -1;
              }
            }

            // Update totals
            totalBetAmount += bet.totalBet;
            totalWinAmount += Math.max(winLoss, 0);
            totalTax += bet.tax;

            // Update bet record
            await Bets.findByIdAndUpdate(bet._id, {
              status,
              winLoss,
              result: numberOutcome.value,
            });
          })
        );

        // Calculate and store profit/loss
        const profitLoss = totalBetAmount - totalWinAmount + totalTax;

        await WingoProfitLoss.create({
          periodId,
          timerType: timerName,
          totalBetAmount,
          totalTaxAmount: totalTax,
          totalWinAmount,
          profitLoss,
        });
      } catch (error) {
        console.error(
          `[${timerName}] Error processing period ${periodId}:`,
          error
        );
      }
    }, interval * 60 * 1000);
  };

  // Start initial job and schedule recurring execution
  jobFunction();
  return cron.schedule(cronInterval, jobFunction).start();
};

const calculateRemainingTime4 = (periodId, timerType) => {
  const now = moment();
  const date = periodId.substring(0, 8);
  const sequence = parseInt(periodId.substring(8));

  let intervalMinutes;
  let periodStart;

  switch (timerType) {
    case "30sec":
      intervalMinutes = 0.5;
      const totalSeconds = sequence * 30;
      const hours = Math.floor(totalSeconds / 3600);
      const minutes = Math.floor((totalSeconds % 3600) / 60);
      const seconds = totalSeconds % 60;
      periodStart = moment(date, "YYYYMMDD")
        .hour(hours)
        .minute(minutes)
        .second(seconds);
      break;
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
  secondsToHms4,
  calculateRemainingTime4,
  getLatestPeriodId4,
  createTimer4,
};
