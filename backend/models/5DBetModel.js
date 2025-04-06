const mongoose = require("mongoose");

// 5D Game Bet Schema
const FiveDBetSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
  },
  betAmount: Number,
  totalBet: Number,
  totalBetAfterTax: Number, // New field for storing totalBet - fee
  multiplier: Number,
  fee: { type: String, default: "2%" },
  selectedTimer: String,
  orderId: String,
  periodId: Number,
  timestamp: { type: Date, default: Date.now },

  // Bet sections (A, B, C, D, E)
  sectionBets: {
    A: {
      size: { type: String, enum: ["Small", "Big"] }, // "Small" (0-4) or "Big" (5-9)
      parity: { type: String, enum: ["Even", "Odd"] }, // "Even" or "Odd"
      numberBet: [{ type: Number, min: 0, max: 9 }], // Array to allow betting on multiple numbers (0-9)
    },
    B: {
      size: { type: String, enum: ["Small", "Big"] },
      parity: { type: String, enum: ["Even", "Odd"] },
      numberBet: [{ type: Number, min: 0, max: 9 }],
    },
    C: {
      size: { type: String, enum: ["Small", "Big"] },
      parity: { type: String, enum: ["Even", "Odd"] },
      numberBet: [{ type: Number, min: 0, max: 9 }],
    },
    D: {
      size: { type: String, enum: ["Small", "Big"] },
      parity: { type: String, enum: ["Even", "Odd"] },
      numberBet: [{ type: Number, min: 0, max: 9 }],
    },
    E: {
      size: { type: String, enum: ["Small", "Big"] },
      parity: { type: String, enum: ["Even", "Odd"] },
      numberBet: [{ type: Number, min: 0, max: 9 }],
    },
  },
  totalSum: {
    size: { type: String, enum: ["Small", "Big"] }, // Small (0-22) or Big (23-45)
    parity: { type: String, enum: ["Odd", "Even"] }, // Odd or Even
  },

  // The generated outcome for each section (replaces the diceOutcome)
  resultOutcome: {
    sectionOutcome: {
      A: {
        number: { type: Number, min: 0, max: 9 },
        size: { type: String, enum: ["Small", "Big"] },
        parity: { type: String, enum: ["Even", "Odd"] },
      },
      B: {
        number: { type: Number, min: 0, max: 9 },
        size: { type: String, enum: ["Small", "Big"] },
        parity: { type: String, enum: ["Even", "Odd"] },
      },
      C: {
        number: { type: Number, min: 0, max: 9 },
        size: { type: String, enum: ["Small", "Big"] },
        parity: { type: String, enum: ["Even", "Odd"] },
      },
      D: {
        number: { type: Number, min: 0, max: 9 },
        size: { type: String, enum: ["Small", "Big"] },
        parity: { type: String, enum: ["Even", "Odd"] },
      },
      E: {
        number: { type: Number, min: 0, max: 9 },
        size: { type: String, enum: ["Small", "Big"] },
        parity: { type: String, enum: ["Even", "Odd"] },
      },
    },
    totalSumOutcome: {
      value: { type: Number },
      size: { type: String, enum: ["Small", "Big"] },
      parity: { type: String, enum: [" Even", "Odd"] },
    },
  },
  status: { type: String, default: "Loading" }, // 'Loading', 'Won', 'Failed'
  winLoss: String, // Win/Loss status
  userType:String,
  // Add to each bet model schema:
  betSource: {
    type: String,
    enum: ['deposit', 'winning', 'partial'],
    required: true
  },
    betSourceAmount: Number,
});

const FiveDBet = mongoose.model("FiveDBet", FiveDBetSchema);
module.exports = FiveDBet;