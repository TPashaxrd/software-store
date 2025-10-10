const express = require("express");
const Ticket = require("../models/Ticket");
const adminAuth = require("../middlewares/isAdmin");
const Users = require("../models/Users");
const Cheats = require("../models/Cheat");

const router = express.Router()

router.post("/ticket/close/:id", adminAuth, async (req, res) => {
      try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket bulunamadı." });
    
        ticket.status = "closed";
        await ticket.save();
        res.status(200).json({ message: "Ticket kapatıldı.", ticket });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ticket kapatılamadı." });
      }
})

router.post("/ticket/reopen/:id", adminAuth, async (req, res) => {
      try {
        const ticket = await Ticket.findById(req.params.id);
        if (!ticket) return res.status(404).json({ message: "Ticket bulunamadı." });
        if (ticket.status !== "closed") {
          return res.status(400).json({ message: "Sadece kapatılmış ticket'lar yeniden açılabilir." });
        }
        ticket.status = "open";
        await ticket.save();
        res.status(200).json({ message: "Ticket yeniden açıldı.", ticket });
      } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ticket yeniden açılamadı." });
      }
})

router.post("/user/all", adminAuth, async (req, res) => {
    try {
        const allUsers = await Users.find().select("-password");
        res.status(200).json(allUsers);
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
})

router.post("/user/delete/:id", adminAuth, async (req, res) => {
    try {
        const user = await Users.findByIdAndDelete(req.params.id);
        if(!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        res.status(200).json({ message: "User successfully deleted..", user });
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
})

router.post("/user/update/:id", adminAuth, async(req, res) => {
    try {
        const { username, email, isAdmin } = req.body;
        if(!username || !email) return res.status(400).json({ message: "Eksik alanlar var." });
        const updatedUser = await Users.findByIdAndUpdate(
            req.params.id,
            { username, email, isAdmin },
            { new: true }
        ).select("-password");
        if(!updatedUser) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        res.status(200).json({ message: "Kullanıcı başarıyla güncellendi.", user: updatedUser });
        const user = await Users.findById(req.params.id);
        if(!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
    } catch (error) {
        
    }
})

router.post("/user/ban/:id", adminAuth, async(req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if(!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        user.isBanned = true;
        await user.save();
        res.status(200).json({ message: "User successfully banned..", user });
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
})

router.post("/user/unban/:id", adminAuth, async(req, res) => {
    try {
        const user = await Users.findById(req.params.id)
        if(!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });
        user.isBanned = false;
        await user.save();
        res.status(200).json({ message: "User successfully unbanned..", user });
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
})

router.post("/user/cheat/remove/:id", adminAuth, async(req, res) => {
    try {
        const userId = req.params.id;

        const { cheatId } = req.body;
        const user = await Users.findById(userId);

        if(!user) return res.status(404).json({ message: "Kullanıcı bulunamadı." });

        const cheatIndex = user.libary.findIndex(
            (item) => item.product_id?.toString() === cheatId
        );
        if(cheatIndex === -1) return res.status(404).json({ message: "Kullanıcının bu hileye sahip değil." });

        user.libary.splice(cheatIndex, 1);
        await user.save();
        res.status(200).json({ message: "Cheat başarıyla kaldırıldı.", libary: user.libary });
    } catch (error) {
        res.status(500).json({ message: message.error });
    }
})

router.post("/user/cheat/add/:id", adminAuth, async (req, res) => {
  try {
    const userId = req.params.id; 
    const { cheatId, ticketId } = req.body;

    const cheat = await Cheats.findOne({ cheatId });
    if (!cheat) return res.status(404).json({ message: "Cheat not found" });

    const user = await Users.findById(userId);
    if (!user) return res.status(404).json({ message: "User not found" });

    const alreadyHas = user.libary.some(
      (item) => item.product_id?.toString() === cheatId
    );
    if (alreadyHas)
      return res.status(400).json({ message: "User already owns this cheat" });

    const randomKey = Math.random().toString(36).substring(2, 15) +
                      Math.random().toString(36).substring(2, 15);
    const newKey = `SHANZY-${randomKey.toUpperCase()}`;

    const ticket = await Ticket.findById(ticketId);
    if(ticket) {
        ticket.order = "Successfully refunded by admin";
        await ticket.save();
    }

    user.libary.push({
      product_id: cheatId,
      key: newKey,
    });

    await user.save();

    res.status(200).json({
      message: `Cheat '${cheat.title}' assigned to ${user.username}`,
      libary: user.libary,
    });
  } catch (err) {
    console.error("assignCheatToUser Error:", err);
    res.status(500).json({ message: "Error assigning cheat" });
  }
});

router.post("/tickets", adminAuth, async (req, res) => {
    try {
        const tickets = await Ticket.find()
        .populate({ path: "userId", select: "-password -IP_Address" })
        .populate("cheatId")
        .sort({ createdAt: -1 });
        res.status(200).json(tickets);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Ticketlar alınamadı." });
    }  
})

router.post("/cheats", adminAuth, async (req, res) => {
    try {
        const cheats = await Cheats.find().select("-downloadLink");
        res.status(200).json(cheats);
    } catch (error) {
        res.status(500).json({ message: "Hileler alınamadı." });
    }
})

router.post("/ticket/msg/:id", async (req, res) => {
  try {
    const ticket = await Ticket.findById(req.params.id)
      .populate("userId", "username")
      .populate("cheatId", "title");
    
    if (!ticket) {
      return res.status(404).json({ message: "Ticket bulunamadı." });
    }

    const { text } = req.body;
    if (!text || text.trim() === "") {
      return res.status(400).json({ message: "Mesaj boş olamaz." });
    }

    const message = {
      sender: "admin",
      text,
      createdAt: new Date(),
    };

    ticket.messages.push(message);
    await ticket.save();

    res.status(201).json({
      message: "Mesaj başarıyla eklendi.",
      data: message,
    });
  } catch (err) {
    console.error("Ticket mesajı eklenemedi:", err);
    res.status(500).json({ message: "Sunucu hatası." });
  }
});

module.exports = router

// Routes
//  POST /api/admin/ticket/close/:id - Ticket'ı kapatır (admin yetkisi gerektirir)
//  POST /api/admin/ticket/reopen/:id - Kapatılmış ticket'ı yeniden açar (admin yetkisi gerektirir)
//  POST /api/admin/user/all - Tüm kullanıcıları listeler (admin yetkisi gerektirir)
//  POST /api/admin/user/delete/:id - Belirtilen kullanıcıyı siler (admin yetkisi gerektirir)
//  POST /api/admin/user/update/:id - Belirtilen kullanıcıyı günceller (admin yetkisi gerektirir)
//  POST /api/admin/user/ban/:id - Belirtilen kullanıcıyı banlar (admin yetkisi gerektirir)
//  POST /api/admin/user/unban/:id - Belirtilen kullanıcının banını kaldırır (admin yetkisi gerektirir)
//  POST /api/admin/user/cheat/add/:id - Belirtilen kullanıcıya cheat ekler (admin yetkisi gerektirir)