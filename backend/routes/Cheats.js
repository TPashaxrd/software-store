const express = require("express")
const {
  getAllCheats,
  createCheat,
  assignCheatToUser,
  getUserCheats,
  getCheatsById,
} = require ("../controllers/cheatsController.js")

const router = express.Router();

router.get("/", getAllCheats);
router.post("/", createCheat);
router.get("/view/:cheatId", getCheatsById)
router.post("/assign/:userId", assignCheatToUser);
// router.get("/all-cheats")
router.get("/user/:userId", getUserCheats);

module.exports = router