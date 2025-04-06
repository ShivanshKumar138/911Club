const TrxResult = require("../models/trxResultModel");
const TrxBet = require("../models/TRXBetModel");
const User = require("../models/userModel");
const crypto = require("crypto");
const cron = require("node-cron");
const moment = require("moment");
const {
  Timer1Min,
  Timer3Min,
  Timer5Min,
  Timer10Min,
  Timer30Sec,
} = require("../models/timersModel");
const axios = require("axios");
require("dotenv").config();

const NUMBER_MULTIPLIER = 8.775; // For exact number bets
const COLOR_MULTIPLIER = 1.95; // For regular color bets
const COLOR_MULTIPLIER_SPECIAL = 1.5; // For color bets when number is 0 or 5
const VIOLET_MULTIPLIER = 4.5; // For violet color bets
const SIZE_MULTIPLIER = 1.95;

const getNextBlockData = async (betAmounts) => {
  try {
   

    // Check if there are any bets at all
    const hasBets =
      Object.values(betAmounts.number).some((amount) => amount > 0) ||
      Object.values(betAmounts.size).some((amount) => amount > 0) ||
      Object.values(betAmounts.color).some((amount) => amount > 0);

    if (!hasBets) {
      // Generate true random outcome when no bets exist
      const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
      const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
      const randomNumber = possibleNumbers[randomIndex];

      return {
        blockAddress: Math.floor(
          Math.random() * 90000000 + 10000000
        ).toString(),
        blockTime: moment().format("HH:mm:54"),
        hash:
          crypto.randomBytes(32).toString("hex").slice(0, -1) + randomNumber,
      };
    }

    // Calculate total bets for each category
    const totalSizeBets = betAmounts.size.small + betAmounts.size.big;
    const totalColorBets =
      betAmounts.color.red + betAmounts.color.green + betAmounts.color.violet;
    const totalNumberBets = Object.values(betAmounts.number).reduce(
      (a, b) => a + b,
      0
    );

    // Create comprehensive outcome map
    const numberOutcomeMap = {};
    for (let num = 0; num <= 9; num++) {
      const numStr = num.toString();
      let potentialLoss = 0;

      // Calculate potential loss for this number
      // Number bets (9x payout)
      potentialLoss += betAmounts.number[numStr] * 8.77;

      // Size bets (2x payout)
      const size = num < 5 ? "small" : "big";
      potentialLoss += betAmounts.size[size] * 2;

      // Color bets (2x for regular, 4.5x for violet)
      const colors = [];
      if ([0, 5].includes(num)) {
        colors.push("violet");
        if (num === 0) colors.push("red");
        if (num === 5) colors.push("green");
      } else if ([2, 4, 6, 8].includes(num)) {
        colors.push("red");
      } else if ([1, 3, 7, 9].includes(num)) {
        colors.push("green");
      }

      colors.forEach((color) => {
        if (color === "violet") {
          potentialLoss += betAmounts.color[color] * 4.5;
        } else {
          potentialLoss += betAmounts.color[color] * 2;
        }
      });

      numberOutcomeMap[numStr] = {
        number: num,
        potentialLoss,
        totalBets: betAmounts.number[numStr],
      };
    }

    

    // Find number with minimum potential loss
    const optimalNumber = Object.entries(numberOutcomeMap).reduce(
      (optimal, [number, data]) => {
        if (!optimal || data.potentialLoss < optimal.potentialLoss) {
          return { number, potentialLoss: data.potentialLoss };
        }
        return optimal;
      },
      null
    );

   

    // Generate block with optimal number
    const block = {
      blockAddress: Math.floor(Math.random() * 90000000 + 10000000).toString(),
      blockTime: moment().format("HH:mm:54"),
      hash: crypto.randomBytes(32).toString("hex"),
    };

    // Ensure hash ends with optimal number
    block.hash = block.hash.slice(0, -1) + optimalNumber.number;

    return block;
  } catch (error) {
    console.error("Error in getNextBlockData:", error);
    // Generate random fallback instead of always using 0
    const possibleNumbers = [0, 1, 2, 3, 4, 5, 6, 7, 8, 9];
    const randomIndex = Math.floor(Math.random() * possibleNumbers.length);
    const randomNumber = possibleNumbers[randomIndex];

    const fallbackBlock = {
      blockAddress: Math.floor(Math.random() * 90000000 + 10000000).toString(),
      blockTime: moment().format("HH:mm:54"),
      hash: crypto.randomBytes(32).toString("hex").slice(0, -1) + randomNumber,
    };
    return fallbackBlock;
  }
};

// Modify the createTimer1 function to pass betAmounts to getNextBlockData
const createTimer1 = (TimerModel, interval, timerName) => {
  const cronInterval = `*/${interval} * * * *`;

  const jobFunction1 = async () => {
    try {
      const periodId = generatePeriodId(timerName);

      await TimerModel.create({ periodId });

      setTimeout(async () => {
        const trxBets = await TrxBet.find({ periodId });

        // Debugging: Log the contents of trxBets
        console.log("trxBets:", trxBets);

        // Separate bets into number bets, size bets, and color bets
        const numberBets = trxBets.filter((bet) =>
          /^[0-9]$/.test(bet.selectedItem)
        );
        const sizeBets = trxBets.filter((bet) =>
          ["small", "big"].includes(bet.selectedItem)
        );
        const colorBets = trxBets.filter((bet) =>
          ["red", "green", "violet"].includes(bet.selectedItem)
        );

        // Debugging: Log the separated bets
     

        // Initialize betAmounts with all numbers set to 0, size bets, and color bets
        const betAmounts = {
          number: {},
          size: { small: 0, big: 0 },
          color: { red: 0, green: 0, violet: 0 },
        };
        for (let i = 0; i < 10; i++) {
          betAmounts.number[i.toString()] = 0;
        }

        // Sum the total bet amounts for number bets, size bets, and color bets
        numberBets.forEach((bet) => {
          betAmounts.number[bet.selectedItem] += bet.totalBet;
        });
        sizeBets.forEach((bet) => {
          betAmounts.size[bet.selectedItem] += bet.totalBet;
        });
        colorBets.forEach((bet) => {
          betAmounts.color[bet.selectedItem] += bet.totalBet;
        });

        // Console log the bet amounts


        // Get block data with manipulated hash
        const blockData = await getNextBlockData(betAmounts);
        const trxBlockAddress = blockData.blockAddress;
        const blockTime = blockData.blockTime;
        const randomHash = blockData.hash;

        // Get number from hash
        const numbers = randomHash.match(/\d/g) || ["0"]; // Get all numbers or default to ['0']
        const numberOutcome = numbers[numbers.length - 1]; // Get last number

        // Determine size based on number
        const sizeOutcome = parseInt(numberOutcome) < 5 ? "small" : "big";

        // Determine color based on number
        let colorOutcome;
        switch (numberOutcome) {
          case "1":
          case "3":
          case "7":
          case "9":
            colorOutcome = "green";
            break;
          case "2":
          case "4":
          case "6":
          case "8":
            colorOutcome = "red";
            break;
          case "0":
            colorOutcome = ["red", "violet"];
            break;
          case "5":
            colorOutcome = ["green", "violet"];
            break;
          default:
            colorOutcome = "unknown";
        }

        await TrxResult.create({
          timer: timerName,
          periodId,
          colorOutcome,
          numberOutcome,
          sizeOutcome,
          trxBlockAddress,
          blockTime,
          hash: randomHash,
        });

        if (trxBets.length === 0) {
          console.log(`No bets for ${timerName} & ${periodId}`);
          return;
        }

        console.log(`Bets for ${timerName} & ${periodId} found.`);

        for (const bet of trxBets.filter(
          (bet) => bet.selectedTimer === timerName
        )) {
          let winLoss = 0;
          let status = "Failed";
          const result = numberOutcome.toString();
          console.log(bet.selectedItem);
          console.log(numberOutcome);
          if (bet.selectedItem === numberOutcome.toString()) {
            // Number bet - pays 9x
            winLoss = typeof bet.totalBet === "number" ? (bet.totalBet * 8.77).toString() : "0";
            status = "Succeed";
        } else if (bet.selectedItem === "violet" && Array.isArray(colorOutcome) && colorOutcome.includes("violet")) {
            // Violet bet - pays 4.5x
            winLoss = typeof bet.totalBet === "number" ? (bet.totalBet * 1.5).toString() : "0";
            status = "Succeed";
        } else if ((bet.selectedItem === "red" && (colorOutcome === "red" || (Array.isArray(colorOutcome) && colorOutcome.includes("red")))) ||
                   (bet.selectedItem === "green" && (colorOutcome === "green" || (Array.isArray(colorOutcome) && colorOutcome.includes("green"))))) {
            // Color bet - pays 2x
            winLoss = typeof bet.totalBet === "number" ? (bet.totalBet * 2).toString() : "0";
            status = "Succeed";
        } else if (bet.selectedItem === sizeOutcome) {
            // Size bet - pays 2x
            winLoss = typeof bet.totalBet === "number" ? (bet.totalBet * 2).toString() : "0";
            status = "Succeed";
        } else {
            // Loss - lose entire bet amount
            winLoss = typeof bet.totalBet === "number" ? (bet.totalBet * -1).toString() : "0";
        }

          if (status === "Succeed") {
            const user = await User.findById(bet.userId);
            if (user) {
              user.walletAmount += Number(winLoss);
              await user.save();
            }
          }

          await TrxBet.findByIdAndUpdate(bet._id, {
            status,
            winLoss,
            result,
          });
        }
      }, interval * 60 * 1000);
      console.log(`TRX Timer ${timerName} & ${periodId} started.`);
    } catch (error) {
      console.error("Error in TRX Timer function:", error);
    }
  };

  jobFunction1();

  const job = cron.schedule(cronInterval, jobFunction1);

  job.start();
};

const calculateRemainingTime1 = (periodId, timerType) => {
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

function secondsToHms1(d) {
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

async function getLatestPeriodId1(timerName) {
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

module.exports = {
  createTimer1,
  calculateRemainingTime1,
  secondsToHms1,
  getLatestPeriodId1,
};
