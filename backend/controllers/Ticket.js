const Ticket = require("../models/Ticket");

function checkAdminAuth(req) {
  const adminPass = req.headers["x-admin-password"];
  return adminPass === "2443"; 
}

exports.createTicket = async (req, res) => {
  try {
    const { userId, cheatId, firstMessage } = req.body;
    if (!userId || !cheatId) return res.status(400).json({ message: "userId ve cheatId gerekli." });

    const ticket = new Ticket({
      userId,
      cheatId,
      messages: firstMessage ? [{ sender: "user", text: firstMessage, createdAt: new Date() }] : [],
    });

    await ticket.save();
    res.status(201).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ticket oluşturulamadı." });
  }
};

exports.getTickets = async (req, res) => {
  try {
    if (!checkAdminAuth(req)) return res.status(403).json({ message: "Yetkisiz erişim." });
    const tickets = await Ticket.find().populate("userId cheatId");
    res.status(200).json(tickets);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ticketlar alınamadı." });
  }
};

exports.getTicketsByUser = async (req, res) => {
  try {
    const userId = req.session.userId;
    if (!userId) return res.status(401).json({ message: "Giriş yapmanız gerekiyor." });

    const tickets = await Ticket.find({ userId })
      .populate("userId cheatId")
      .sort({ createdAt: -1 });

    if (!tickets || tickets.length === 0)
      return res.status(404).json({ message: "Henüz ticketınız yok." });

    res.status(200).json(tickets);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Ticketlar alınamadı." });
  }
};

exports.getTicketById = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id).populate("userId cheatId");
    if (!ticket) return res.status(404).json({ message: "Ticket bulunamadı." });

    const isAdmin = checkAdminAuth(req);
    const userId = req.headers["x-user-id"];

    if (!isAdmin && ticket.userId._id.toString() !== userId) {
      return res.status(403).json({ message: "Bu ticket'a erişim izniniz yok." });
    }

    res.status(200).json(ticket);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ticket alınamadı." });
  }
};

exports.addMessage = async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket bulunamadı." });

    const userId = req.headers["x-user-id"];
    const isAdmin = checkAdminAuth(req);

    if (!isAdmin && ticket.userId._id.toString() !== userId) {
      return res.status(403).json({ message: "Bu ticket'a mesaj gönderemezsiniz." });
    }

    const { text } = req.body;
    if (!text) return res.status(400).json({ message: "Mesaj boş olamaz." });

    const message = { sender: isAdmin ? "admin" : "user", text, createdAt: new Date() };
    ticket.messages.push(message);
    await ticket.save();

    res.status(201).json(message);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Mesaj eklenemedi." });
  }
};

exports.closeTicket = async (req, res) => {
  try {
    if (!checkAdminAuth(req)) return res.status(403).json({ message: "Yetkisiz erişim." });

    const ticket = await Ticket.findById(req.params.id);
    if (!ticket) return res.status(404).json({ message: "Ticket bulunamadı." });

    ticket.status = "closed";
    await ticket.save();
    res.status(200).json({ message: "Ticket kapatıldı.", ticket });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Ticket kapatılamadı." });
  }
};
