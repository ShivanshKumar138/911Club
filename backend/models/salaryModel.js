const mongoose = require("mongoose");

const salarySchema = new mongoose.Schema({
  uid: { type: String, required: true },
  salaryAmount: { type: Number, required: true },
  salaryFrequency: {
    type: String,
    enum: ["Daily", "Weekly", "Monthly", "Yearly", "Hourly", "Minutely"],
    required: true,
  },
  nextPaymentDate: { type: Date },
  frequencyLimit: { type: Number, required: true },
});

const Salary = mongoose.model("Salary", salarySchema);

module.exports = Salary;
