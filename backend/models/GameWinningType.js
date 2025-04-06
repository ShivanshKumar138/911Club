const mongoose = require('mongoose');

const gameWinningTypeSchema = new mongoose.Schema({
    isRandomWinning: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

const GameWinningType = mongoose.model('GameWinningType', gameWinningTypeSchema);

module.exports = GameWinningType;
