// models/AppConfig.js
const mongoose = require('mongoose');

const AppConfigSchema = new mongoose.Schema({
  needToDepositFirst: {
    type: Boolean,
    default: false,
  },
  // Other global settings fields can be added here
});

module.exports = mongoose.model('AppConfig', AppConfigSchema);
