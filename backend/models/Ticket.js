const mongoose = require("mongoose");

const MessageSchema = new mongoose.Schema({
  sender: {
    type: String,
    enum: ["user", "admin"],
    required: true
  },
  text: {
    type: String,
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

const TicketSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoreUsers",
    required: true
  },
  cheatId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Cheats",
    required: true
  },
  status: {
    type: String,
    enum: ["open", "pending", "closed"],
    default: "open"
  },
  messages: [MessageSchema], 
}, { timestamps: true });

module.exports = mongoose.model("Tickets", TicketSchema);