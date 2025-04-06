const mongoose = require('mongoose');

const uidSequenceSchema = new mongoose.Schema({
  currentUid: {
    type: Number,
    required: true,
    default: 5000
  }
});

const UidSequence = mongoose.model('UidSequence', uidSequenceSchema);

module.exports = UidSequence;