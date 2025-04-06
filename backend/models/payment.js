const mongoose = require('mongoose');

const PaymentSchema = new mongoose.Schema({
    payOrderId: { type: String, required: true, unique: true },
    income: Number,
    mchId: String,
    appId: String,
    productId: String,
    mchOrderNo: String,
    amount: Number,
    status: String,
    channelOrderNo: String,
    channelAttach: String,
    param1: String,
    param2: String,
    paySuccTime: Date,
    backType: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true }, // Reference to User model
    approved: { type: Boolean, default: false }, // Boolean with default value of false
    depositId: { type: mongoose.Schema.Types.ObjectId, ref: 'DepositHistory', required: true } // Reference to DepositHistory schema
});

const Payment = mongoose.model('Payment', PaymentSchema);
module.exports = Payment;
