const Cheats = require("../models/Cheat.js")
const StoreUsers = require("../models/Users.js")

const getAllCheats = async (req, res) => {
  try {
    // const cheats = await Cheats.find().sort({ createdAt: -1 });
    const cheats = await Cheats.find()
    .select("-downloadLink")
    res.status(200).json(cheats);
  } catch (err) {
    console.error("❌ getAllCheats Error:", err);
    res.status(500).json({ message: "Server error while fetching cheats" });
  }
};

const createCheat = async (req, res) => {
  try {
    const { title, description, price, game, imageUrl, images, downloadLink, cheatId } = req.body;

    if (!title || !price || !game || !downloadLink) {
      return res.status(400).json({ message: "Missing required fields" });
    }

    const ImagesArray = Array.isArray(images)
    ? images.map((img) => ({ ImageURL: img }))
    : [];

    const newCheat = new Cheats({
      cheatId,
      title,
      description,
      price,
      game,
      downloadLink,
      imageUrl: imageUrl || "https://via.placeholder.com/400",
      Images: ImagesArray,
      uploadedBy: req.user?.id || null,
    });

    await newCheat.save();

    res.status(201).json({
      message: "Cheat created successfully",
      cheat: newCheat,
    });
  } catch (err) {
    console.error("❌ createCheat Error:", err);
    res.status(500).json({ message: "Error creating cheat" });
  }
};

const getUserCheats = async (req, res) => {
  try {
    const { userId } = req.params;
    if (req.session.userId !== userId) {
      return res.status(403).json({ message: "Unauthorized access to user's cheats" });
    }
    const user = await StoreUsers.findById(userId).populate("libary.product_id");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json(user.libary);
  } catch (err) {
    console.error("❌ getUserCheats Error:", err);
    res.status(500).json({ message: "Error fetching user's cheats" });
  }
};

const getCheatsById = async (req, res) => {
  try {
    const { cheatId } = req.params; 
    const cheat = await Cheats.findOne({ cheatId });

    if (!cheat) {
      return res.status(404).json({ message: "Cheat not found." });
    }

    res.status(200).json({ cheat });
  } catch (error) {
    console.error("❌ getCheatsById Error:", error);
    res.status(500).json({ message: error.message });
  }
};

module.exports = { getUserCheats, createCheat, getAllCheats, getCheatsById }