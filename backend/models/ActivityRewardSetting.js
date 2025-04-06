const mongoose = require('mongoose');

const activityRewardSettingSchema = new mongoose.Schema({
  minimumBettingAmount: {
    type: Number,
    required: true,
  },
  activityAward: {
    type: Number,
    required: true,
  },
}, { timestamps: true });

const ActivityRewardSetting = mongoose.model('ActivityRewardSetting', activityRewardSettingSchema);

module.exports = ActivityRewardSetting;
