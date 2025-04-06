const mongoose = require('mongoose');

// Define the schema for the 1-minute timer
const Timer1MinSchema = new mongoose.Schema({
    periodId: String
});
const Timer1Min = mongoose.model('Timer1Min', Timer1MinSchema);

// Define the schema for the 3-minute timer
const Timer3MinSchema = new mongoose.Schema({
    periodId: String
});
const Timer3Min = mongoose.model('Timer3Min', Timer3MinSchema);

// Define the schema for the 5-minute timer
const Timer5MinSchema = new mongoose.Schema({
    periodId: String
});
const Timer5Min = mongoose.model('Timer5Min', Timer5MinSchema);

// Define the schema for the 10-minute timer
const Timer10MinSchema = new mongoose.Schema({
    periodId: String
});
const Timer10Min = mongoose.model('Timer10Min', Timer10MinSchema);

// Define the schema for the 30-second timer
const Timer30SecSchema = new mongoose.Schema({
    periodId: String
});
const Timer30Sec = mongoose.model('Timer30Sec', Timer30SecSchema);

module.exports = {
    Timer1Min,
    Timer3Min,
    Timer5Min,
    Timer10Min,
    Timer30Sec
};
