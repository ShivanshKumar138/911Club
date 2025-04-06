const WingoResult = require("../models/wingoResultModel");
const ManualResult = require("../models/ManualResultSchema");
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
const WinProbabilitySettings = require("../models/WinProbabilitySettings");

function secondsToHms(d) {
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

async function getLatestPeriodId(timerName) {
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

const shouldWinWithProbability = (probability) => {
  return Math.random() < probability;
};

const createTimer = (TimerModel, interval, timerName) => {
  // Set up the cron interval based on timer type
  const cronInterval =
    timerName === "30sec" ? "*/30 * * * * *" : `*/${interval} * * * *`;

  const jobFunction = async () => {
    const periodId = generatePeriodId(timerName);
    await TimerModel.create({ periodId });
    console.log(`[${timerName}] New period started: ${periodId}`);

    // Set timeout for processing results
    setTimeout(
      async () => {
        try {
          console.log(
            `[${timerName}] Processing results for period: ${periodId}`
          );

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
          const allBets = await Bets.find({
            periodId,
            selectedTimer: timerName,
          });

          // Initialize tracking variables
          let totalBetAmount = 0;
          let totalWinAmount = 0;
          let totalTax = 0;

          // Check winning type setting
          const gameWinningType = await GameWinningType.findOne();
          const isRandomWinning = gameWinningType
            ? gameWinningType.isRandomWinning
            : false;

          // NEW: Get the win probability setting from the database
          const winProbabilitySettings =
            (await WinProbabilitySettings.findOne()) || {
              singlePlayerWinProbability: 0.3,
            };
          const singlePlayerWinProbability =
            winProbabilitySettings.singlePlayerWinProbability;
          console.log(
            `[${timerName}] Single player win probability: ${
              singlePlayerWinProbability * 100
            }%`
          );

          // Define outcome variables
          let colorOutcome, numberOutcome, sizeOutcome;

          // Constants for game rules
          const NUMBER_MULTIPLIER = 9;
          const COLOR_MULTIPLIER = 2;
          const COLOR_MULTIPLIER_SPECIAL = 1.5; // New multiplier for 0 and 5
          const VIOLET_MULTIPLIER = 4.5;
          const SIZE_MULTIPLIER = 2;

          const NUMBER_COLOR_MAP = {
            0: ["violet", "red"],
            1: "green",
            2: "red",
            3: "green",
            4: "red",
            5: ["violet", "green"],
            6: "red",
            7: "green",
            8: "red",
            9: "green",
          };

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

            const colorBetSums = {
              green: 0,
              red: 0,
              violet: 0,
            };

            bets.forEach((bet) => {
              if (/^[0-9]$/.test(bet.selectedItem)) {
                numberBetSums[parseInt(bet.selectedItem)].totalBet +=
                  bet.totalBet;
              } else if (bet.selectedItem in sizeBetSums) {
                sizeBetSums[bet.selectedItem] += bet.totalBet;
              } else if (bet.selectedItem in colorBetSums) {
                colorBetSums[bet.selectedItem] += bet.totalBet;
              }
            });

            return { numberBetSums, sizeBetSums, colorBetSums };
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

          // Function to check if any bets exist in category
          const hasBetsInCategory = (betSums) => {
            if (Array.isArray(betSums)) {
              return betSums.some((item) => item.totalBet > 0);
            }
            return Object.values(betSums).some((value) => value > 0);
          };

          // Function to get total bets in category
          const getTotalBetsInCategory = (betSums) => {
            if (Array.isArray(betSums)) {
              return betSums.reduce((sum, item) => sum + item.totalBet, 0);
            }
            return Object.values(betSums).reduce(
              (sum, value) => sum + value,
              0
            );
          };

          // Function to find number matching size
          const findNumberForSize = (size) => {
            // For 'big', find the least bet number > 4
            // For 'small', find the least bet number <= 4
            const numbers = Array.from({ length: 10 }, (_, i) => i.toString());
            const validNumbers = numbers.filter((num) =>
              size === "big" ? parseInt(num) > 4 : parseInt(num) <= 4
            );
            return validNumbers[
              Math.floor(Math.random() * validNumbers.length)
            ];
          };

          // Function to generate random outcome
          const generateRandomOutcome = () => {
            const number = Math.floor(Math.random() * 10).toString();
            const size = parseInt(number) > 4 ? "big" : "small";
            const color = NUMBER_COLOR_MAP[number];

            return { number, size, color };
          };

          // Determine game outcome
          if (manualResult) {
            // Use manual result if available
            console.log(`[${timerName}] Using manual result`);
            colorOutcome = manualResult.colorOutcome;
            numberOutcome = manualResult.numberOutcome;
            sizeOutcome = manualResult.sizeOutcome;
          } else if (isRandomWinning) {
            // Generate random outcome if random winning is enabled
            console.log(`[${timerName}] Generating random outcome`);
            const randomResult = generateRandomOutcome();
            numberOutcome = randomResult.number;
            sizeOutcome = randomResult.size;
            colorOutcome = randomResult.color;
          } else {
            // Calculate outcome based on least bet sums
            console.log(
              `[${timerName}] Calculating outcome based on least bets`
            );

            if (calculationBets.length === 0) {
              // If no bets, generate random outcome
              const randomResult = generateRandomOutcome();
              numberOutcome = randomResult.number;
              sizeOutcome = randomResult.size;
              colorOutcome = randomResult.color;
            } else if (calculationBets.length === 1) {
              // Single player logic with dynamic win chance
              const singleBet = calculationBets[0];
              const willWin = shouldWinWithProbability(
                singlePlayerWinProbability
              ); // Use dynamic probability

              if (willWin) {
                // Player wins - generate winning outcome based on their bet
                if (/^[0-9]$/.test(singleBet.selectedItem)) {
                  // Number bet
                  numberOutcome = singleBet.selectedItem;
                  sizeOutcome = parseInt(numberOutcome) > 4 ? "big" : "small";
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                } else if (
                  singleBet.selectedItem === "big" ||
                  singleBet.selectedItem === "small"
                ) {
                  // Size bet
                  sizeOutcome = singleBet.selectedItem;
                  // Find a random number that matches the size
                  const possibleNumbers = Array.from(
                    { length: 10 },
                    (_, i) => i
                  ).filter((num) =>
                    singleBet.selectedItem === "big" ? num > 4 : num <= 4
                  );
                  numberOutcome =
                    possibleNumbers[
                      Math.floor(Math.random() * possibleNumbers.length)
                    ].toString();
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                } else {
                  // Color bet
                  const possibleNumbers = Object.entries(NUMBER_COLOR_MAP)
                    .filter(([_, colors]) =>
                      Array.isArray(colors)
                        ? colors.includes(singleBet.selectedItem)
                        : colors === singleBet.selectedItem
                    )
                    .map(([num]) => num);
                  numberOutcome =
                    possibleNumbers[
                      Math.floor(Math.random() * possibleNumbers.length)
                    ];
                  sizeOutcome = parseInt(numberOutcome) > 4 ? "big" : "small";
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                }
              } else {
                // Player loses - generate losing outcome
                if (/^[0-9]$/.test(singleBet.selectedItem)) {
                  // For number bet, choose any other number
                  const possibleNumbers = Array.from({ length: 10 }, (_, i) =>
                    i.toString()
                  ).filter((num) => num !== singleBet.selectedItem);
                  numberOutcome =
                    possibleNumbers[
                      Math.floor(Math.random() * possibleNumbers.length)
                    ];
                } else if (
                  singleBet.selectedItem === "big" ||
                  singleBet.selectedItem === "small"
                ) {
                  // For size bet, choose opposite size
                  sizeOutcome =
                    singleBet.selectedItem === "big" ? "small" : "big";
                  numberOutcome = findNumberForSize(sizeOutcome);
                } else {
                  // For color bet, choose different color
                  const possibleColors = ["red", "green", "violet"].filter(
                    (c) => c !== singleBet.selectedItem
                  );
                  const selectedColor =
                    possibleColors[
                      Math.floor(Math.random() * possibleColors.length)
                    ];
                  const possibleNumbers = Object.entries(NUMBER_COLOR_MAP)
                    .filter(([_, colors]) =>
                      Array.isArray(colors)
                        ? colors.includes(selectedColor)
                        : colors === selectedColor
                    )
                    .map(([num]) => num);
                  numberOutcome =
                    possibleNumbers[
                      Math.floor(Math.random() * possibleNumbers.length)
                    ];
                }
                sizeOutcome = parseInt(numberOutcome) > 4 ? "big" : "small";
                colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
              }
            } else {
              // Calculate bet sums
              const betSums = calculateBetSums(calculationBets);
              console.log(`[${timerName}] Bet sums calculated:`, betSums);

              // Calculate total bets in each category
              const totalNumberBets = getTotalBetsInCategory(
                betSums.numberBetSums
              );
              const totalSizeBets = getTotalBetsInCategory(betSums.sizeBetSums);
              const totalColorBets = getTotalBetsInCategory(
                betSums.colorBetSums
              );

              // Determine primary category based on bet volume
              const categories = [
                { name: "number", total: totalNumberBets },
                { name: "size", total: totalSizeBets },
                { name: "color", total: totalColorBets },
              ].filter((cat) => cat.total > 0);

              // Sort categories by total bets (highest to lowest)
              categories.sort((a, b) => b.total - a.total);

              if (categories.length === 0) {
                // If no bets in any category, generate random outcome
                const randomResult = generateRandomOutcome();
                numberOutcome = randomResult.number;
                sizeOutcome = randomResult.size;
                colorOutcome = randomResult.color;
              } else {
                // Use the category with the most bets to determine outcome
                const primaryCategory = categories[0].name;

                if (primaryCategory === "size") {
                  // Size is primary category
                  sizeOutcome = getLeastBetItem(betSums.sizeBetSums);
                  numberOutcome = findNumberForSize(sizeOutcome);
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                } else if (primaryCategory === "number") {
                  // Number is primary category
                  numberOutcome = getLeastBetItem(betSums.numberBetSums);
                  sizeOutcome = parseInt(numberOutcome) > 4 ? "big" : "small";
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                } else {
                  // Color is primary category
                  const leastBetColor = getLeastBetItem(betSums.colorBetSums);
                  // Find a number that matches the color
                  const possibleNumbers = Object.entries(NUMBER_COLOR_MAP)
                    .filter(([_, colors]) =>
                      Array.isArray(colors)
                        ? colors.includes(leastBetColor)
                        : colors === leastBetColor
                    )
                    .map(([num]) => num);
                  numberOutcome =
                    possibleNumbers[
                      Math.floor(Math.random() * possibleNumbers.length)
                    ];
                  sizeOutcome = parseInt(numberOutcome) > 4 ? "big" : "small";
                  colorOutcome = NUMBER_COLOR_MAP[numberOutcome];
                }
              }

              // Log category selection information
              console.log(
                `[${timerName}] Primary category: ${
                  categories[0]?.name || "none"
                }`
              );
            }
          }

          // Log final outcome
          console.log(`[${timerName}] Final outcome:
        Number: ${numberOutcome}
        Color: ${
          Array.isArray(colorOutcome) ? colorOutcome.join(", ") : colorOutcome
        }
        Size: ${sizeOutcome}`);

          // Store result in database
          await WingoResult.create({
            timer: timerName,
            periodId,
            colorOutcome,
            numberOutcome,
            sizeOutcome,
            manuallySet: !!manualResult,
          });

          // Process all bets
          console.log(`[${timerName}] Processing bets`);

          // Process bets and update user wallets
          await Promise.all(
            allBets.map(async (bet) => {
              let winLoss = 0;
              let status = "Failed";
              try {
                // Only process bets from valid user types
                if (["Restricted", "Admin", "Normal"].includes(bet.userType)) {
                  // Calculate winnings based on bet type
                  if (bet.selectedItem === numberOutcome) {
                    winLoss = bet.totalBet * NUMBER_MULTIPLIER;
                  } else if (
                    Array.isArray(colorOutcome) &&
                    colorOutcome.includes(bet.selectedItem)
                  ) {
                    if (bet.selectedItem === "violet") {
                      winLoss = bet.totalBet * VIOLET_MULTIPLIER;
                    } else {
                      // Special multiplier for numbers 0 and 5
                      const multiplier =
                        numberOutcome === "0" || numberOutcome === "5"
                          ? COLOR_MULTIPLIER_SPECIAL
                          : COLOR_MULTIPLIER;
                      winLoss = bet.totalBet * multiplier;
                    }
                  } else if (colorOutcome === bet.selectedItem) {
                    if (bet.selectedItem === "violet") {
                      winLoss = bet.totalBet * VIOLET_MULTIPLIER;
                    } else {
                      // Special multiplier for numbers 0 and 5
                      const multiplier =
                        numberOutcome === "0" || numberOutcome === "5"
                          ? COLOR_MULTIPLIER_SPECIAL
                          : COLOR_MULTIPLIER;
                      winLoss = bet.totalBet * multiplier;
                    }
                  } else if (bet.selectedItem === sizeOutcome) {
                    winLoss = bet.totalBet * SIZE_MULTIPLIER;
                  }

                  // Update user wallet if they won
                  if (winLoss > 0) {
                    try {
                      const updatedUser = await User.findByIdAndUpdate(
                        bet.userId,
                        { $inc: { walletAmount: winLoss } },
                        { new: true }
                      );

                      if (updatedUser) {
                        console.log(
                          `User ${bet.userId} wallet updated. New balance: ${updatedUser.walletAmount}`
                        );
                        status = "Succeed";
                      } else {
                        console.error(
                          `User ${bet.userId} not found when processing winnings`
                        );
                      }
                    } catch (updateError) {
                      console.error(
                        `Error updating wallet for bet ${bet._id}:`,
                        updateError
                      );
                    }
                  } else {
                    winLoss = bet.totalBet * -1;
                  }
                }

                // Update bet record with proper error handling
                const updateData = {
                  status,
                  winLoss,
                  result: numberOutcome,
                };
                console.log(
                  `BEFORE UPDATE: Bet ${bet._id} will be updated with:`,
                  updateData
                );
                const updatedBet = await Bets.findByIdAndUpdate(
                  bet._id,
                  updateData,
                  { new: true }
                );
                console.log(`AFTER UPDATE: Bet ${bet._id} now has:`, {
                  status: updatedBet.status,
                  winLoss: updatedBet.winLoss,
                  result: updatedBet.result,
                });
              } catch (error) {
                console.error(`Error processing bet ${bet._id}:`, error);
              }
            })
          );
        } catch (error) {
          console.error(
            `[${timerName}] Error processing period ${periodId}:`,
            error
          );
        }
      },
      timerName === "30sec" ? 30 * 1000 : interval * 60 * 1000
    );
  };

  // Start initial job and schedule recurring execution
  jobFunction();
  return cron.schedule(cronInterval, jobFunction).start();
};

const calculateRemainingTime = (periodId, timerType) => {
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
  secondsToHms,
  calculateRemainingTime,
  getLatestPeriodId,
  createTimer,
  generatePeriodId,
};
