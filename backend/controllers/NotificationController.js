const express = require('express');
const router = express.Router();
const Notification = require('../models/NotificationModel');


// Function to add a notification
const addNotification = async (userId, title, message) => {
  const notification = new Notification({
    userId,
    title,
    message
  });
  await notification.save();
};

module.exports = {addNotification };