const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/Ticket");

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/:id/messages", ticketController.addMessage);

router.get("/user/:userId", ticketController.getTicketsByUser);

module.exports = router;

// Routes
// POST   /api/tickets/            -> Create a new ticket
// GET    /api/tickets/            -> Get all tickets (admin only)
// GET    /api/tickets/:id         -> Get ticket by ID
// POST   /api/tickets/:id/messages -> Add message to ticket
// POST   /api/tickets/:id/close   -> Close ticket (admin only)
// GET    /api/tickets/user/:userId -> Get tickets by user ID (admin only)