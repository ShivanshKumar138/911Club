// models/WebsiteMaintenance.js

const mongoose = require('mongoose');

const websiteMaintenanceSchema = new mongoose.Schema({
  maintenanceMode: {
    type: Boolean,
    default: false
  }
});

const WebsiteMaintenance = mongoose.model('WebsiteMaintenance', websiteMaintenanceSchema);

module.exports = WebsiteMaintenance;
