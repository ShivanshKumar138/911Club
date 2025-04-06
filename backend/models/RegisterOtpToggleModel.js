const mongoose = require("mongoose");

const RegisterOtpToggleSchema = new mongoose.Schema({
  username: {
    type: String,
    required: true,
    unique: true,
  },
  isToggle: {
    type: Boolean,
    required: true,
  },
});

module.exports = mongoose.model(
  "RegisterOtpToggleModel",
  RegisterOtpToggleSchema
);
