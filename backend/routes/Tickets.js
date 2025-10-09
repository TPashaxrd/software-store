const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/Ticket");
const adminAuth = require("../middlewares/isAdmin");

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/:id/messages", ticketController.addMessage);

router.post("/:id/close", adminAuth, ticketController.closeTicket);

router.get("/user/:userId", ticketController.getTicketsByUser);

module.exports = router;