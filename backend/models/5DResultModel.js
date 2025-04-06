const mongoose = require('mongoose');

// 5D Game Manual Result Schema
const FiveDResultSchema = new mongoose.Schema({
    timerName: {
        type: String,
        required: true,
    },
    periodId: {
        type: String,
        required: true,
    },

    // Generated numbers, size, and parity for each section
    sectionOutcome: {
        A: {
            number: { type: Number, min: 0, max: 9, required: true },
            size: { type: String, enum: ['Small', 'Big'], required: true },  // 0-4 = Small, 5-9 = Big
            parity: { type: String, enum: ['Odd', 'Even'], required: true },  // Based on number being odd or even
        },
        B: {
            number: { type: Number, min: 0, max: 9, required: true },
            size: { type: String, enum: ['Small', 'Big'], required: true },
            parity: { type: String, enum: ['Odd', 'Even'], required: true },
        },
        C: {
            number: { type: Number, min: 0, max: 9, required: true },
            size: { type: String, enum: ['Small', 'Big'], required: true },
            parity: { type: String, enum: ['Odd', 'Even'], required: true },
        },
        D: {
            number: { type: Number, min: 0, max: 9, required: true },
            size: { type: String, enum: ['Small', 'Big'], required: true },
            parity: { type: String, enum: ['Odd', 'Even'], required: true },
        },
        E: {
            number: { type: Number, min: 0, max: 9, required: true },
            size: { type: String, enum: ['Small', 'Big'], required: true },
            parity: { type: String, enum: ['Odd', 'Even'], required: true },
        }
    },

    // Total Sum with merged size and parity
    totalSum: {
        value: { type: Number, required: true },
        size: { type: String, enum: ['Small', 'Big'], required: true },  // 0-13 = Small, 14-45 = Big
        parity: { type: String, enum: ['Odd', 'Even'], required: true },  // Based on total sum being odd or even
    },
});

const FiveDResult = mongoose.model('FiveDResult', FiveDResultSchema);
module.exports = FiveDResult;