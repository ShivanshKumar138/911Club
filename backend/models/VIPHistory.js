const mongoose = require("mongoose");
const { Schema } = mongoose;

const vipHistorySchema = new Schema({
  userId: { type: Schema.Types.ObjectId, ref: 'User', required: true },
  levelAchieved: { type: String, required: true },
  achievedAt: { type: Date, default: Date.now },
  oneTimeBonus: { type: Number },
  monthlyBonus: { type: Number },
  rebatePercentage: { type: Number },
  details: { type: String },
  type: { 
    type: String, 
    enum: ['monthlyUpdate', 'levelUpdate'], // Only allow specific types
    required: true 
  }
});

const VIPHistory = mongoose.model("VIPHistory", vipHistorySchema);
module.exports = VIPHistory;
