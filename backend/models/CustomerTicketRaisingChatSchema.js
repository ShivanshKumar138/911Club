const mongoose = require('mongoose');
const { Schema } = mongoose;
const { v4: uuidv4 } = require('uuid'); // Import UUID library to generate unique IDs

const CustomerTicketRaisingChatSchema = new Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
    index: true,
  },
  ticketId: {
    type: String,
    required: true,
    unique: true,
    index: true,
  },
  subject: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'In Progress', 'Resolved', 'Closed'],
    default: 'Open',
    required: true,
  },
  priority: {
    type: String,
    enum: ['Low', 'Medium', 'High', 'Urgent'],
    default: 'Medium',
    required: true,
  },
  messages: [
    {
      sender: {
        type: String,
        enum: ['User', 'Admin'],
        required: true,
      },
      message: {
        type: String,
        required: true,
      },
      timestamp: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  attachments: [
    {
      filename: {
        type: String,
      },
      url: {
        type: String,
      },
      uploadedAt: {
        type: Date,
        default: Date.now,
      },
    },
  ],
  createdAt: {
    type: Date,
    default: Date.now,
    immutable: true,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
  resolvedAt: {
    type: Date,
  },
});

// Automatically generate a unique ticketId using UUID before validation
CustomerTicketRaisingChatSchema.pre('validate', function (next) {
  if (!this.ticketId) {
    this.ticketId = uuidv4(); // Generate unique ticket ID
  }
  this.updatedAt = Date.now();
  next();
});

const CustomerTicketRaisingChat = mongoose.model('CustomerTicketRaisingChat', CustomerTicketRaisingChatSchema);

module.exports = CustomerTicketRaisingChat;
