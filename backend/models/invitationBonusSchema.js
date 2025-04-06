const mongoose = require("mongoose");

// Schema for storing invitation bonus configuration
const invitationBonusSchema = new mongoose.Schema({
  minSubordinates: {
    type: Number,
    required: true,
    default: 3, // Default to 3 subordinates
    min: 1, // Minimum value for the subordinates criteria
  },
  minDepositAmount: {
    type: Number,
    required: true,
    default: 500, // Default minimum deposit per subordinate (₹500)
    min: 0, // Minimum value for deposit amount
  },
  bonusAmount: {
    type: Number,
    required: true,
    default: 150, // Default bonus amount (₹150)
    min: 0, // Minimum value for bonus
  },
  achievedBy: [{
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    achievedAt: {
      type: Date,
      default: Date.now
    }
  }],

  createdAt: { type: Date, default: Date.now }, // Timestamp for when the rule is created
  updatedAt: { type: Date, default: Date.now }, // Timestamp for when the rule is last updated
});

// Add a pre-save hook to update `updatedAt` when changes are made
invitationBonusSchema.pre("save", function (next) {
  this.updatedAt = Date.now();
  next();
});

const InvitationBonus = mongoose.model(
  "InvitationBonus",
  invitationBonusSchema
);

module.exports = InvitationBonus;
