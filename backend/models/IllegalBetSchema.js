const mongoose = require("mongoose");

const IllegalBetSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  game: {
    type: String,
    enum: ["Wingo", "K3", "5D","TRX"],
    required: true,
  },
  totalIllegalCount: {
    type: Number,
    default: 0,
  },
  latestPeriodId: {
    type: String,
    required: true,
  },
  latestPeriodBetCount: {
    type: Number,
    default: 0,
  },
  lastUpdated: {
    type: Date,
    default: Date.now,
  },
  maximumAllowedIllegalBets: {
    type: Number,
    default: 10,
  },
  betsPerPeriod: {
    type: Map,
    of: new mongoose.Schema({
      bets: [
        {
          betType: String,
          betAmount: Number,
        },
      ],
      isIllegal: { type: Boolean, default: false },
      illegalReasons: [String],
      sizeBetTypes: [String],
      colorBetTypes: [String],
      parityTypes: [String], // Track Odd/Even for K3
    }),
    default: {},
  },
  totalBetAmountThisPeriod: {
    type: Number,
    default: 0,
    set: (v) => {
      const parsed = parseFloat(v);
      return isNaN(parsed) ? 0 : parsed;
    },
  },
});

// Method to add a bet
IllegalBetSchema.methods.addBet = function (periodId, betType, betAmount) {
  // Ensure betAmount is a number
  const numericBetAmount = parseFloat(betAmount);
  if (isNaN(numericBetAmount)) {
    throw new Error(`Invalid bet amount: ${betAmount}`);
  }

  if (!this.betsPerPeriod.has(periodId)) {
    this.betsPerPeriod.set(periodId, {
      bets: [],
      isIllegal: false,
      illegalReasons: [],
      sizeBetTypes: [],
      colorBetTypes: [],
      parityTypes: [],
    });
  }

  const periodBets = this.betsPerPeriod.get(periodId);
  periodBets.bets.push({ betType, betAmount: numericBetAmount });
  // Check for illegal bets based on the game type
  if (this.game === "Wingo") {
    const sizeTypes = ["big", "small"];
    const colorTypes = ["red", "green"];

    // Existing Wingo logic...
    if (sizeTypes.includes(betType.toLowerCase())) {
      periodBets.sizeBetTypes.push(betType.toLowerCase());
      if (
        periodBets.sizeBetTypes.includes("big") &&
        periodBets.sizeBetTypes.includes("small") &&
        !periodBets.illegalReasons.includes("big and small")
      ) {
        periodBets.isIllegal = true;
        periodBets.illegalReasons.push("big and small");
        this.totalIllegalCount += 1;
      }
    } else if (colorTypes.includes(betType.toLowerCase())) {
      periodBets.colorBetTypes.push(betType.toLowerCase());
      if (
        periodBets.colorBetTypes.includes("red") &&
        periodBets.colorBetTypes.includes("green") &&
        !periodBets.illegalReasons.includes("red and green")
      ) {
        periodBets.isIllegal = true;
        periodBets.illegalReasons.push("red and green");
        this.totalIllegalCount += 1;
      }
    }
  } else if (this.game === "K3") {
    // K3 logic for illegal bets
    const sizeTypes = ["big", "small"];
    const parityTypes = ["odd", "even"];

    // Check size bet types
    if (sizeTypes.includes(betType.toLowerCase())) {
      periodBets.sizeBetTypes.push(betType.toLowerCase());
      if (
        periodBets.sizeBetTypes.includes("big") &&
        periodBets.sizeBetTypes.includes("small") &&
        !periodBets.illegalReasons.includes("big and small")
      ) {
        periodBets.isIllegal = true;
        periodBets.illegalReasons.push("big and small");
        this.totalIllegalCount += 1;
      }
    }

    // Check parity bet types
    if (parityTypes.includes(betType.toLowerCase())) {
      periodBets.parityTypes.push(betType.toLowerCase());
      if (
        periodBets.parityTypes.includes("odd") &&
        periodBets.parityTypes.includes("even") &&
        !periodBets.illegalReasons.includes("odd and even")
      ) {
        periodBets.isIllegal = true;
        periodBets.illegalReasons.push("odd and even");
        this.totalIllegalCount += 1;
      }
    }
  }

  // Update the latest period information with proper numeric handling
  this.latestPeriodId = periodId;
  this.latestPeriodBetCount = periodBets.bets.length;
  // Safely update totalBetAmountThisPeriod
  const currentTotal = parseFloat(this.totalBetAmountThisPeriod) || 0;
  this.totalBetAmountThisPeriod = currentTotal + numericBetAmount;

  this.lastUpdated = Date.now();

  return this.save();
};

const IllegalBet = mongoose.model("IllegalBet", IllegalBetSchema);
module.exports = IllegalBet;
