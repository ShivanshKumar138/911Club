const mongoose = require("mongoose");
const ReferredUser = require("./ReferredUser");

function round(val) {
  return Math.round(val * 100) / 100;
}

// Schema for activity claims to track which rewards the user has claimed
const claimSchema = new mongoose.Schema({
  cardId: { type: String, required: true }, // Id of the activity award card
  activityAward: { type: Number, required: true }, // The award claimed
  date: { type: Date, default: Date.now }, // Date when the award was claimed
});

const subordinateSchema = new mongoose.Schema(
  {
    noOfRegister: { type: Number, default: 0 },
    depositNumber: { type: Number, default: 0 },
    depositAmount: { type: Number, default: 0 },
    firstDeposit: { type: Number, default: 0 },
    date: { type: Date, default: Date.now },
    level: { type: Number, default: 1 },
  },
  { _id: false }
);

const walletTransactionSchema = new mongoose.Schema({
  amount: { type: Number, required: true },
  type: { type: String, enum: ["credit", "debit"], required: true },
  balance: { type: Number, required: true },
  source: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

const userSchema = new mongoose.Schema({
  mobile: { type: Number, required: true, unique: true },
  password: { type: String, required: true },
  plainPassword: { type: String },
  invitecode: { type: String, default: null },
  invitationCode: { type: String },
  username: { type: String, required: true },
  uid: { type: String, required: true, unique: true },
  referralLink: { type: String, default: null },
  walletHistory: [walletTransactionSchema], // Define this before walletAmount
  walletAmount: {
    type: Number,
    default: 0,
    set: function (value) {
      const oldValue = this.walletAmount || 0;
      if (value !== oldValue && Array.isArray(this.walletHistory)) {
        this.walletHistory.push({
          amount: Math.abs(value - oldValue),
          type: value > oldValue ? "credit" : "debit",
          balance: value,
          source: "system",
        });
      }
      return round(value);
    },
  },
  isWalletOnHold: { type: Boolean, default: false }, // New field to track wallet hold status
  holdAmount: { type: Number, default: 0 }, // New field to track hold amount
  accountType: {
    type: String,
    enum: [
      "Admin",
      "Normal",
      "Restricted",
      "FinanceHead",
      "GameHead",
      "SettingsHead",
      "AdditionalHead",
      "SupportHead",
    ],
    default: "Normal",
  },
  lastBonusWithdrawal: { type: Date, default: null },
  totalCommission: { type: Number, default: 0, set: round },
  avatar: { type: String, default: null },
  token: { type: String, default: null },
  directSubordinates: [subordinateSchema],
  teamSubordinates: [subordinateSchema],
  lastLoginTime: { type: Date, default: Date.now },
  registrationDate: { type: Date, default: Date.now },
  referrer: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
  firstDepositMade: { type: Boolean, default: false },
  secondDepositMade: { type: Boolean, default: false },
  totalBonusAmount: { type: Number, default: 0 },
  consecutiveDays: { type: Number, default: 0 },
  locked: { type: Boolean, default: false },
  lastMonthlyBonusMinute: { type: Number, default: 0 },
  referredUsers: [ReferredUser.schema],
  commissionRecords: [
    {
      level: Number,
      commission: Number,
      date: Date,
      uid: String,
      betAmount: { type: Number, default: 0 },
      depositAmount: Number,
    },
  ],
  notification: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "notify",
    },
  ],
  bankDetails: [
    {
      name: String,
      accountNo: String,
      ifscCode: String,
      mobile: String,
      bankName: String,
    },
  ],
  withdrawRequestsToday: { type: Number, default: 0 },
  TRXAddress: [
    {
      address: { type: String }, // This will hold the TRX address
      alias: { type: String }, // Alias for the TRX address
    },
  ],
  withdrawRecords: [
    {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Withdraw",
      default: [
        {
          status: "NA",
          balance: 0,
          withdrawMethod: "",
        },
      ],
    },
  ],
  achievements: [String],
  manualBetAdjustment: { type: Number, default: 0 },
  remainingWithdrawAmount: { type: Number, default: 0 }, // Added field
  // New field to track daily claim activity
  claims: [claimSchema], // This will store the cards claimed and when they were claimed
});

// Add method to handle wallet updates
userSchema.methods.updateWalletAmount = async function (amount, source) {
  const oldValue = this.walletAmount || 0;
  const newValue = round(oldValue + amount);

  if (!Array.isArray(this.walletHistory)) {
    this.walletHistory = [];
  }

  this.walletHistory.push({
    amount: Math.abs(amount),
    type: amount >= 0 ? "credit" : "debit",
    balance: newValue,
    source: source || "system",
  });

  this.walletAmount = newValue;
  return this.save();
};

const User = mongoose.model("User", userSchema);

module.exports = User;
