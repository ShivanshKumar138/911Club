const express = require("express");
const router = express.Router();
const notification = require("../../models/notificatonschema");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const User = require("../../models/userModel");
const Notification = require('../../models/NotificationModel');


// Route to get notifications for the authenticated user
router.get('/notifications', auth, async (req, res) => {
  try {
    const notifications = await Notification.find({ userId: req.user._id }).sort({ date: -1 });
    res.status(200).json({ success: true, notifications });
  } catch (error) {
    console.error('Error fetching notifications:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


router.delete('/notifications/:notificationId', auth, async (req, res) => {
  try {
    const notificationId = req.params.notificationId;
    const result = await Notification.deleteOne({ _id: notificationId, userId: req.user._id });
    if (result.deletedCount === 0) {
      return res.status(404).json({ success: false, message: 'Notification not found' });
    }
    res.status(200).json({ success: true, message: 'Notification deleted successfully' });
  } catch (error) {
    console.error('Error deleting notification:', error);
    res.status(500).json({ success: false, message: 'Internal Server Error' });
  }
});


// API route to delete a notification
router.delete("/notifications/:notificationId", auth, async (req, res) => {
  try {
    const userId = req.user._id; // Authenticated user's ID from token
    const notificationId = req.params.notificationId; // ID of the notification to delete

    // Find the user
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    // Check if the notification exists in the user's notification array
    const notificationIndex = user.notification.indexOf(notificationId);
    if (notificationIndex === -1) {
      return res.status(404).json({ message: "Notification not found for this user" });
    }

    // Remove the notification from the user's array
    user.notification.splice(notificationIndex, 1);

    // Save the updated user data
    await user.save();

    // Respond to the client
    res.status(200).json({ message: "Notification deleted successfully" });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Server error" });
  }
});

// Admin route for creating global notifications
router.post('/createNotification', auth, isAdmin, async (req, res) => {
  try {
    const { title, message, remark } = req.body;

    // Ensure title and message are provided
    if (!title || !message) {
      console.log("Title or message missing");
      return res.status(400).json({
        success: false,
        message: "Please provide both title and message"
      });
    }

    // Default message (with appended remark for salary notifications)
    let finalMessage = message;
    console.log("Message received:", finalMessage);

    // If the notification is related to salary, append the remark (optional)
    if (title.toLowerCase().includes("salary") && remark) {
      finalMessage = `${message} Remark: ${remark}`;
      console.log("Salary notification with remark:", finalMessage);
    }

    // Create a new notification document
    const newNotification = new notification({
      title,
      message: finalMessage,
      date: new Date(),
      global: true
    });

    // Save the new notification to the database
    await newNotification.save();
    console.log("Notification created and saved:", newNotification);

    // If global is true, add the notification to all users
    if (newNotification.global) {
      console.log("Global notification, adding to all users");
      const allUsers = await User.find(); // Fetch all users
      console.log(`Found ${allUsers.length} users`);

      // Loop through each user and push the new notification to their notification array
      const notificationPromises = allUsers.map(async (user) => {
        user.notification.push(newNotification._id);
        console.log(`Added notification to user ${user.username}`);
        return user.save(); // Save the updated user document
      });

      // Wait for all promises to complete
      await Promise.all(notificationPromises);
      console.log("Notification added to all users");
    }

    // Respond with success
    res.status(200).json({
      success: true,
      message: "Notification created and added to all users successfully"
    });
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({
      success: false,
      message: "Internal Server Error"
    });
  }
});

router.delete("/deletenotifications", auth, isAdmin, async (req, res) => {
  try {
    console.log("Inside this block--->");
    const { notificationId } = req.body;

    // Check if the notification ID is provided
    if (!notificationId) {
      return res.status(400).json({
        success: false,
        message: "Notification ID is required",
      });
    }

    console.log("id is-->", notificationId);
    // Fetch the notification by ID
    const notification1 = await notification.find({ _id: notificationId });
    console.log("Fetched notification:", notification1);

    if (!notification1) {
      return res.status(404).json({
        success: false,
        message: "Notification not found",
      });
    }

    // Delete the notification
    const result = await notification.deleteOne({ _id: notificationId });

    res.status(200).json({
      success: true,
      message: "Notification deleted successfully",
      result,
    });
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({
      success: false,
      message: error.message,
    });
  }
});

// // Route for fetching user notifications
// router.get('/notifications', auth, async (req, res) => {
//   try {
//     const userId = req.user._id; // Get the authenticated user's ID from the token

//     // Find the user and populate their notifications
//     const user = await User.findById(userId).populate('notification'); // Assuming 'notification' is an array of notification IDs

//     if (!user) {
//       return res.status(404).json({
//         success: false,
//         message: "User not found"
//       });
//     }

//     // Send the notifications to the client
//     res.status(200).json({
//       success: true,
//       notifications: user.notification // The populated array of notifications
//     });

//   } catch (error) {
//     console.error("Error fetching notifications:", error);
//     res.status(500).json({
//       success: false,
//       error: error.message
//     });
//   }
// });

// User creates a ticket
router.post("/tickets", auth, async (req, res) => {
  console.log(req.body);
  const ticket = new Ticket({
    userId: req.user._id,
    message: req.body.message,
    mobile: req.body.mobile,
  });
  await ticket.save();
  res.status(201).send(ticket);
});

// Admin replies to a ticket
router.post("/tickets/replies", auth, async (req, res) => {
  const ticket = await Ticket.findById(req.body.ticketId);
  if (!ticket) {
    return res.status(404).send({ error: "Ticket not found" });
  }
  ticket.replies.push({
    adminId: req.user._id,
    message: req.body.message,
  });
  ticket.status = "closed"; // Change status to 'closed'
  await ticket.save();
  res.status(201).send(ticket);
});

// Get all tickets
router.get("/tickets", auth, async (req, res) => {
  const tickets = await Ticket.find();
  res.send(tickets);
});

module.exports = router;
