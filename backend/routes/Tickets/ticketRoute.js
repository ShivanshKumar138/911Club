const express = require("express");
const router = express.Router();
const CustomerTicketRaisingChat = require("../../models/CustomerTicketRaisingChatSchema");
const auth = require("../../middlewares/auth");
const { isAdmin } = require("../../middlewares/roleSpecificMiddleware");
const mongoose = require("mongoose");

// @route   POST /api/tickets/raise
// @desc    User raise a new ticket
// @access  Private (Authenticated Users)
router.post("/tickets/raise", auth, async (req, res) => {
  try {
    const { subject, description, priority, initialMessage } = req.body;

    // Validate input
    if (!subject || !description || !priority || !initialMessage) {
      return res.status(400).json({ message: "All fields are required." });
    }

    // Create a new ticket
    const newTicket = new CustomerTicketRaisingChat({
      userId: req.user._id, // Assuming req.user contains the authenticated user's data
      subject,
      description,
      priority,
      status: "Open", // Initial status is 'Open'
      messages: [
        {
          sender: "User",
          message: initialMessage,
          timestamp: Date.now(),
        },
      ],
    });

    // Save the ticket to the database
    await newTicket.save();

    res
      .status(201)
      .json({ message: "Ticket raised successfully.", ticket: newTicket });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not raise the ticket." });
  }
});

// @route   GET /api/tickets/admin/:ticketId?
// @desc    Admin view all tickets or a specific ticket by ticketId
// @access  Private (Admins only)
router.get("/admin/tickets/:ticketId?", auth, isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params; // Check for path parameter
    const queryTicketId = req.query.ticketId; // Check for query parameter

    // Prioritize path parameter if both are provided
    const finalTicketId = ticketId || queryTicketId;

    console.log("finalTicketId--->", finalTicketId);

    if (finalTicketId) {
      // Convert the ticketId to an ObjectId if it is a valid MongoDB ObjectId
      const isValidObjectId = mongoose.Types.ObjectId.isValid(finalTicketId);

      const query = isValidObjectId
        ? { _id: new mongoose.Types.ObjectId(finalTicketId) } // Use 'new' keyword
        : { ticketId: finalTicketId }; // Search by ticketId (if it's not an ObjectId)

      // Fetch the ticket by either _id or ticketId
      const ticket = await CustomerTicketRaisingChat.findOne(query);

      if (!ticket) {
        console.log("Ticket not found for ticketId:", finalTicketId);
        return res.status(404).json({ message: "Ticket not found." });
      }

      // Return ticket data
      res.status(200).json({
        originalTicketId: finalTicketId,
        ticketId: ticket.ticketId,
        userId: ticket.userId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        messages: ticket.messages.map((msg) => ({
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
          messageId: msg._id,
        })),
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      });
    } else {
      // No specific ticket ID provided, return all tickets
      console.log("Fetching all tickets...");
      const tickets = await CustomerTicketRaisingChat.find().sort({
        createdAt: -1,
      });
      res.status(200).json(tickets);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch the ticket." });
  }
});

router.get("/admin/tickets/:ticketId?", auth, isAdmin, async (req, res) => {
  try {
    const { ticketId } = req.params; // Check for path parameter
    const queryTicketId = req.query.ticketId; // Check for query parameter

    // Prioritize path parameter if both are provided
    const finalTicketId = ticketId || queryTicketId;

    console.log("ticketId--->", finalTicketId);

    if (finalTicketId) {
      // Fetch the ticket by ticketId
      const ticket = await CustomerTicketRaisingChat.find({
        _id: ticketId,
      });

      if (!ticket) {
        console.log("Ticket not found for ticketId:", finalTicketId);
        return res.status(404).json({ message: "Ticket not found." });
      }

      // Return ticket data
      res.status(200).json({
        ticketId: ticket.ticketId,
        userId: ticket.userId,
        subject: ticket.subject,
        description: ticket.description,
        status: ticket.status,
        priority: ticket.priority,
        messages: ticket.messages.map((msg) => ({
          sender: msg.sender,
          message: msg.message,
          timestamp: msg.timestamp,
          messageId: msg._id,
        })),
        createdAt: ticket.createdAt,
        updatedAt: ticket.updatedAt,
      });
    } else {
      // No specific ticket ID provided, return all tickets
      console.log("Fetching all tickets...");
      const tickets = await CustomerTicketRaisingChat.find().sort({
        createdAt: -1,
      });
      res.status(200).json(tickets);
    }
  } catch (error) {
    console.error("Error fetching ticket:", error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch the ticket." });
  }
});

// Update ticket
router.put("/tickets/admin/:id", auth, isAdmin, async (req, res) => {
  try {
    const { status, priority } = req.body;

    // Validate inputs
    if (!status || !priority) {
      return res
        .status(400)
        .json({ message: "Status and priority are required." });
    }

    const ticket = await CustomerTicketRaisingChat.findByIdAndUpdate(
      req.params.id,
      { status, priority, updatedAt: Date.now() },
      { new: true, runValidators: true }
    );

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not update ticket." });
  }
});

// Delete ticket
router.delete("/tickets/admin/:id", auth, isAdmin, async (req, res) => {
  try {
    const ticket = await CustomerTicketRaisingChat.findByIdAndDelete(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    res.status(200).json({ message: "Ticket deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not delete ticket." });
  }
});


// @route   POST /api/tickets/admin/:id/reply
// @desc    Admin reply to a ticket
// @access  Private (Admins only)
router.post("/tickets/admin/:id/reply", auth, isAdmin, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Find the ticket and add the admin's message
    const ticket = await CustomerTicketRaisingChat.findById(req.params.id);

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Add admin message to the ticket
    ticket.messages.push({
      sender: "Admin",
      message,
      timestamp: Date.now(),
    });

    // Update the ticket's status to 'In Progress' if it's not already resolved or closed
    if (ticket.status === "Open") {
      ticket.status = "In Progress";
    }

    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: "Reply added successfully.", ticket });
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not reply to the ticket." });
  }
});



// @route   GET /api/tickets/user
// @desc    Get all tickets raised by the authenticated user with details and admin replies
// @access  Private (Authenticated Users)
router.get("/tickets/user", auth, async (req, res) => {
  try {
    // Fetch all tickets for the authenticated user
    const tickets = await CustomerTicketRaisingChat.find({
      userId: req.user._id,
    })
      .sort({ createdAt: -1 }) // Sort by creation date, most recent first
      .populate("userId", "username email"); // Optional: populate user details if needed

    // If no tickets found
    if (tickets.length === 0) {
      return res
        .status(404)
        .json({ message: "No tickets found for this user." });
    }

    // Send the tickets along with details and admin replies
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not fetch tickets." });
  }
});

// @route   GET /api/tickets/user/:id
// @desc    Get a specific ticket and all its messages for the authenticated user
// @access  Private (Authenticated Users)
router.get("/tickets/user/:id", auth, async (req, res) => {
  try {
    // Fetch the specific ticket by ID
    const ticket = await CustomerTicketRaisingChat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Send the ticket along with its messages
    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res
      .status(500)
      .json({ message: "Server error. Could not fetch the ticket." });
  }
});

// @route   POST /api/tickets/user/:id/message
// @desc    User sends a message for a specific ticket
// @access  Private (Authenticated Users)
router.post("/tickets/user/:id/message", auth, async (req, res) => {
  try {
    const { message } = req.body;

    // Validate input
    if (!message) {
      return res.status(400).json({ message: "Message is required." });
    }

    // Find the ticket belonging to the authenticated user
    const ticket = await CustomerTicketRaisingChat.findOne({
      _id: req.params.id,
      userId: req.user._id,
    });

    if (!ticket) {
      return res.status(404).json({ message: "Ticket not found." });
    }

    // Add the user's message to the ticket
    ticket.messages.push({
      sender: "User",
      message,
      timestamp: Date.now(),
    });

    // Save the updated ticket
    await ticket.save();

    res.status(200).json({ message: "Message sent successfully.", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error. Could not send message." });
  }
});

module.exports = router;
