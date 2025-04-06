const mongoose = require('mongoose');

const pendingCommissionSchema = new mongoose.Schema({
  referrerId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  betUserId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  commissionLevel: {
    type: Number,
    required: true
  },
  betAmount: {
    type: Number,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  gameType: {
    type: String,
    required: true,
    enum: ['wingo', '5d', 'k3',"N/A", "deposit"] // Add or modify game types as needed
  },
  processed: {
    type: Boolean,
    default: false
  }
});

module.exports = mongoose.model('PendingCommission', pendingCommissionSchema);