const mongoose = require('mongoose');

const ManualResultSchema = new mongoose.Schema({
  timer: {
    type: String,
    required: true
  },
  periodId: {
    type: String,
    required: true
  },
  colorOutcome: {
    type: [String],
    default: []
  },
  numberOutcome: {
    type: String,
    required: true
  },
  sizeOutcome: {
    type: String,
    enum: ['small', 'big'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const ManualResult = mongoose.model('ManualResult', ManualResultSchema);

module.exports = ManualResult;
