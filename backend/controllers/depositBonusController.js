const DepositBonus = require('../models/depositBonusSchema');
const SecondDepositBonus = require('../models/secondDepositBonusSchema');

// Initial data
const initialData = [
    { minimumDeposit: 300, bonus: 50 },
    { minimumDeposit: 500, bonus: 150 },
    { minimumDeposit: 1000, bonus: 200 },
    { minimumDeposit: 3000, bonus: 400 },
    { minimumDeposit: 4000, bonus: 500 },
    { minimumDeposit: 5000, bonus: 600 },
    { minimumDeposit: 10000, bonus: 1100 },
    { minimumDeposit: 50000, bonus: 4100 },
    { minimumDeposit: 100000, bonus: 15001 }
];

DepositBonus.find({}).then(docs => {
    if (docs.length === 0) {
        DepositBonus.insertMany(initialData)
            .then(() => console.log('Initial data added'))
            .catch(err => console.error('Error adding initial data', err));
    }
}).catch(err => console.error('Error finding initial data', err));

SecondDepositBonus.find({}).then(docs => {
    if (docs.length === 0) {
        SecondDepositBonus.insertMany(initialData)
            .then(() => console.log('Initial data added for SecondDepositBonus'))
            .catch(err => console.error('Error adding initial data for SecondDepositBonus', err));
    }
}).catch(err => console.error('Error finding initial data for SecondDepositBonus', err));

exports.updateDepositBonus = async (req, res) => {
    console.log('updateDepositBonus');
    const { minimumDeposit, bonus } = req.body;

    if (minimumDeposit === undefined || bonus === undefined) {
        return res.status(400).json({ error: 'minimumDeposit and bonus are required' });
    }

    try {
        const depositBonus = await DepositBonus.findOneAndUpdate(
            { minimumDeposit },
            { bonus },
            { new: true, upsert: true }
        );
        res.json({ message: 'Deposit bonus updated successfully', depositBonus });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the deposit bonus' });
    }
};

exports.getAllDepositBonuses = async (req, res) => {
    try {
        const depositBonuses = await DepositBonus.find({}).sort({ minimumDeposit: 1 });
        res.json(depositBonuses);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the deposit bonuses' });
    }
};

exports.updateSecondDepositBonus = async (req, res) => {
    console.log('updateSecondDepositBonus');
    const { minimumDeposit, bonus } = req.body;

    if (minimumDeposit === undefined || bonus === undefined) {
        return res.status(400).json({ error: 'minimumDeposit and bonus are required' });
    }

    try {
        const secondDepositBonus = await SecondDepositBonus.findOneAndUpdate(
            { minimumDeposit },
            { bonus },
            { new: true, upsert: true }
        );
        res.json({ message: 'Second deposit bonus updated successfully', secondDepositBonus });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while updating the second deposit bonus' });
    }
};

exports.getAllSecondDepositBonuses = async (req, res) => {
    try {
        const secondDepositBonuses = await SecondDepositBonus.find({}).sort({ minimumDeposit: 1 });
        res.json(secondDepositBonuses);
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while fetching the second deposit bonuses' });
    }
};


exports.deleteDepositBonus = async (req, res) => {
    const { minimumDeposit } = req.body;

    if (minimumDeposit === undefined) {
        return res.status(400).json({ error: 'minimumDeposit is required' });
    }

    try {
        await DepositBonus.findOneAndDelete({ minimumDeposit });
        res.json({ message: 'Deposit bonus deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the deposit bonus' });
    }
};

exports.deleteSecondDepositBonus = async (req, res) => {
    const { minimumDeposit } = req.body;

    if (minimumDeposit === undefined) {
        return res.status(400).json({ error: 'minimumDeposit is required' });
    }

    try {
        await SecondDepositBonus.findOneAndDelete({ minimumDeposit });
        res.json({ message: 'Second deposit bonus deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: 'An error occurred while deleting the second deposit bonus' });
    }
};