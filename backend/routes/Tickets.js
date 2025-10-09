const express = require("express");
const router = express.Router();
const ticketController = require("../controllers/Ticket");

router.post("/", ticketController.createTicket);
router.get("/", ticketController.getTickets);
router.get("/:id", ticketController.getTicketById);
router.post("/:id/messages", ticketController.addMessage);
router.post("/:id/close", ticketController.closeTicket);

module.exports = router;