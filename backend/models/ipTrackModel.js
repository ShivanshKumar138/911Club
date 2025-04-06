const mongoose = require('mongoose');

const ipTrackSchema = new mongoose.Schema({
  ipAddress: {
    type: String,
    required: true,
    unique: true
  },
  registrationCount: {
    type: Number,
    default: 1
  },
  firstRegistrationDate: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('IpTrack', ipTrackSchema);