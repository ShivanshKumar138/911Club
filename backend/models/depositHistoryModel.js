const mongoose = require('mongoose');

const depositHistorySchema = new mongoose.Schema({
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    uid: { type: String, required: true },
    depositAmount: { type: Number, required: true },
    depositDate: { type: Date, required: true },
    depositStatus: { type: String, required: true },
    depositId: { type: String, required: true },
    depositMethod: { type: String, required: true },
    depositBonus: { type: Number, default: 0 }, // Added default value
    signupBonus: { type: Number, default: 0 }  // Added default value
});

const DepositHistory = mongoose.model('DepositHistory', depositHistorySchema);

module.exports = DepositHistory;