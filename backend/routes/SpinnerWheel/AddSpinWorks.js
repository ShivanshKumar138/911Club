const express = require("express");
const router = express.Router();
const AdminTaskControl = require("../../models/SpinTaskModel");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");

// Create a new task
router.post("/addWork", auth, isAdmin, async (req, res) => {
  try {
    console.log('Received /addWork request with body:', req.body);
    const { work } = req.body;
    
    if (!Array.isArray(work) || work.length === 0) {
      return res.status(400).json({ error: 'Invalid work data. Expected an array of work items.' });
    }

    // Ensure proper data types for task and NumberOfSpin
    const newWorks = work.map(item => ({
      task: Number(item.task),
      NumberOfSpin: Number(item.NumberOfSpin),
    }));

    // Find the existing document or create a new one if it doesn't exist
    let taskControl = await AdminTaskControl.findOne({});
    if (!taskControl) {
      taskControl = new AdminTaskControl({ work: [] });
      await taskControl.save();
      console.log('Created new AdminTaskControl document');
    }

    // Check if the task already exists in the works array
    const tasksToAdd = newWorks.filter(item => 
      !taskControl.work.some(existingWork => existingWork.task === item.task)
    );

    if (tasksToAdd.length === 0) {
      return res.json({ message: 'Work not added or already exists' });
    }

    // Add new tasks that do not already exist
    taskControl.work.push(...tasksToAdd);
    const result = await taskControl.save();

    console.log('MongoDB Update Result:', result);
    res.json({ message: 'Work added successfully', result });
  } catch (err) {
    console.error('Error in /addWork:', err);
    res.status(500).json({ error: 'Server error' });
  }
});

router.get("/getwork", auth, isAdmin, async (req, res) => {
  try {
    // Find the existing AdminTaskControl document
    const existingTaskControl = await AdminTaskControl.findOne({});

    if (!existingTaskControl) {
      return res.status(404).json({ error: 'Admin task control not found' });
    }

    // Return the work array
    res.json({ work: existingTaskControl.work });
  } catch (err) {
    console.error('Error in /work:', err);
    res.status(500).json({ error: 'Server error' });
  }
});


// Update a task
router.put("/updateWork/:index", auth, isAdmin, async (req, res) => {
  try {
    const { index } = req.params;
    const { work } = req.body;

    // Check if AdminTaskControl document exists
    const existingAdminTaskControl = await AdminTaskControl.findOne();

    if (existingAdminTaskControl) {
      // If AdminTaskControl document exists, update the work object at the specified index
      await AdminTaskControl.updateOne(
        { "work._id": existingAdminTaskControl.work[index]._id },
        { $set: { "work.$": work } }
      );
      res.status(200).json({ message: "Work object updated successfully" });
    } else {
      res.status(404).json({ message: "AdminTaskControl document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating work object" });
  }
});

// Delete a task
router.delete("/deleteWork/:index", auth, isAdmin, async (req, res) => {
  try {
    const { index } = req.params;

    // Check if AdminTaskControl document exists
    const existingAdminTaskControl = await AdminTaskControl.findOne();

    if (existingAdminTaskControl) {
      // If AdminTaskControl document exists, remove the work object at the specified index
      await AdminTaskControl.updateOne(
        {},
        { $pull: { work: { _id: existingAdminTaskControl.work[index]._id } } }
      );
      res.status(200).json({ message: "Work object deleted successfully" });
    } else {
      res.status(404).json({ message: "AdminTaskControl document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting work object" });
  }
});

router.post("/addWinningAmount", auth, isAdmin, async (req, res) => {
  try {
    const { winningAmount } = req.body;

    // Check if AdminTaskControl document exists
    const existingAdminTaskControl = await AdminTaskControl.findOne();

    if (existingAdminTaskControl) {
      // If AdminTaskControl document exists, update the winningAmount
      await AdminTaskControl.updateOne({}, { winningAmount: winningAmount });
      res.status(201).json({ message: "Winning amount added successfully" });
    } else {
      // If AdminTaskControl document doesn't exist, create a new one
      const newAdminTaskControl = new AdminTaskControl({
        winningAmount: winningAmount,
      });
      await newAdminTaskControl.save();
      res.status(201).json({ message: "Winning amount added successfully" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error adding winning amount" });
  }
});
router.put("/updateWinningAmount", auth, isAdmin, async (req, res) => {
  try {
    const { winningAmount } = req.body;

    // Check if AdminTaskControl document exists
    const existingAdminTaskControl = await AdminTaskControl.findOne();

    if (existingAdminTaskControl) {
      // If AdminTaskControl document exists, update the winningAmount
      await AdminTaskControl.updateOne({}, { winningAmount: winningAmount });
      res.status(200).json({ message: "Winning amount updated successfully" });
    } else {
      res.status(404).json({ message: "AdminTaskControl document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error updating winning amount" });
  }
});
router.delete("/deleteWinningAmount", auth, isAdmin, async (req, res) => {
  try {
    // Check if AdminTaskControl document exists
    const existingAdminTaskControl = await AdminTaskControl.findOne();

    if (existingAdminTaskControl) {
      // If AdminTaskControl document exists, remove the winningAmount
      await AdminTaskControl.updateOne({}, { $unset: { winningAmount: "" } });
      res.status(200).json({ message: "Winning amount deleted successfully" });
    } else {
      res.status(404).json({ message: "AdminTaskControl document not found" });
    }
  } catch (error) {
    res.status(500).json({ message: "Error deleting winning amount" });
  }
});
router.get("/getWinningAmount", auth, isAdmin, async (req, res) => {
  try {
    const existingAdminTaskControl = await AdminTaskControl.findOne();
    if (!existingAdminTaskControl) {
      return res.status(404).json({ message: "No winning amount data found" });
    }
    const winningAmount = existingAdminTaskControl.winningAmount;
    if (!winningAmount) {
      return res.status(404).json({ message: "No winning amount data found" });
    }
    res.json({ winningAmount });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Error retrieving winning amount" });
  }
});
module.exports = router;