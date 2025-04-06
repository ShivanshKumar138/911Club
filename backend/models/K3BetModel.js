const mongoose = require('mongoose');
const User = require('./userModel');

const K3betSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
    },
    betAmount: Number,
    selectedItem: String,
    multiplier: Number,
    totalBet:Number,
    orderId: String,
    tax: Number,
    fee: { type: String, default: '2%' },
    selectedTimer: String,
    periodId: Number,
    timestamp: { type: Date, default: Date.now },
    diceOutcome: {
        type: [Number],
        validate: [arrayLimit, '{PATH} exceeds the limit of 3'],
        required: true,
    },
    status: { type: String, default: 'Loading' },
    winLoss: String,
    totalSum: { type: Number, default: 0 },
    size: String,
    parity: String,
    twoSameOneDifferent: [{ type: Number, minlength: 3, maxlength: 3 }],
    threeSame: [{ type: Number, minlength: 3, maxlength: 3 }],
    threeDifferentNumbers: [{ type: Number, minlength: 3, maxlength: 3 }],
    userType: String,
    // Add to each bet model schema:
    betSource: {
        type: String,
        enum: ['deposit', 'winning', 'partial'],
        required: true
      },
        betSourceAmount: Number,
});

function arrayLimit(val) {
    return val.length <= 3;
}

module.exports = mongoose.models.K3bets || mongoose.model('K3bets', K3betSchema);