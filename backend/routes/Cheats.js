const express = require("express")
const {
  getAllCheats,
  createCheat,
  getUserCheats,
  getCheatsById,
} = require ("../controllers/cheatsController.js");
const adminAuth = require("../middlewares/isAdmin.js");

const router = express.Router();

router.get("/", getAllCheats);
router.post("/", createCheat);
router.get("/view/:cheatId", getCheatsById)
// router.get("/all-cheats")
router.get("/user/:userId", getUserCheats);

module.exports = router

// Routes
// POST /api/cheats/        -> Create a new cheat (admin only)
// GET  /api/cheats/        -> Get all cheats
// GET  /api/cheats/user/:userId -> Get cheats owned by a specific user
// GET  /api/cheats/view/:cheatId -> Get cheat details by cheatId