const mongoose = require('mongoose');

const telegramLinkSchema = new mongoose.Schema({
  telegramLink: {
    type: String,
    required: true,
  },
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
});

const TelegramLink = mongoose.model('TelegramLink', telegramLinkSchema);

module.exports = TelegramLink;