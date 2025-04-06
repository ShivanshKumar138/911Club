const mongoose = require('mongoose');

const SalarySchema = new mongoose.Schema({
    uid: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    isActive: {
        type: Boolean,
        required: true
    },
    date: {
        type: Date,
        default: Date.now
    }   
});

module.exports = mongoose.model('EmployeeSalary', SalarySchema);