const express = require('express');
const router = express.Router();
const EmployeeSalary = require('../../models/Salary');
const User = require('../../models/userModel');
const { addTransactionDetails } = require('../../controllers/TransactionHistoryControllers');

// POST route to create a new salary entry
router.post('/create-user-salary', async (req, res) => {
    const { uid, amount, isActive } = req.body;

    if (!uid || !amount || isActive === undefined) {
        return res.status(400).json({ message: 'All fields are required' });
    }

    try {
        const newSalary = new EmployeeSalary({
            uid,
            amount,
            isActive
        });

        await newSalary.save();
        res.status(201).json({ message: 'Salary entry created successfully', salary: newSalary });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// GET route to fetch all salary entries
router.get('/all-salaries', async (req, res) => {
    try {
        const salaries = await EmployeeSalary.find();
        res.status(200).json(salaries);
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});
// ...existing code...



// POST route to update an existing salary entry
router.post('/update-user-salary', async (req, res) => {
    const { uid, amount, isActive } = req.body;

    if (!uid || !amount) {
        return res.status(400).json({ message: 'UID and amount are required' });
    }

    try {
        // Find the existing salary entry by uid
        const existingSalary = await EmployeeSalary.findOne({ uid });

        if (!existingSalary) {
            return res.status(404).json({ message: 'Salary entry not found for this user' });
        }

        // Update the salary amount and isActive status if provided
        existingSalary.amount = amount;
        if (isActive !== undefined) {
            existingSalary.isActive = isActive;
        }

        // Save the updated record
        await existingSalary.save();

        res.status(200).json({ 
            message: 'Salary entry updated successfully', 
            salary: existingSalary 
        });
    } catch (error) {
        console.error('Error updating salary entry:', error);
        res.status(500).json({ message: 'Server error', error: error.message });
    }
});

router.post('/credit-salaries', async (req, res) => {
    try {
        // Find all salary records where isActive is false
        const inactiveSalaries = await EmployeeSalary.find({ isActive: false });

        // Iterate over each inactive salary record
        for (const salary of inactiveSalaries) {
            // Find the user by uid
            const user = await User.findOne({ uid: salary.uid });

            if (user) {
                // Credit the salary amount to the user's walletAmount
                user.walletAmount += salary.amount;

                // Save the updated user
                await user.save();

                // Set the salary record's isActive to true
                salary.isActive = true;

                // Save the updated salary record
                await salary.save();

                // Add transaction details
                await addTransactionDetails(
                    user._id,
                    salary.amount,
                    "Salary",
                    new Date(),
                    0, // depositAmount
                    0, // betAmount
                    "N/A", // gameType
                    null, // commissionFromUser
                    0, // depositAmountOfUser
                    0, // commissionLevel
                    "notDepositYet" // firstDepositChecker
                );
            }
        }

        res.status(200).json({ message: 'Salaries credited successfully' });
    } catch (error) {
        res.status(500).json({ message: 'Server error', error });
    }
});

// ...existing code...

module.exports = router;