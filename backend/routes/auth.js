const express = require("express")
const { CreateUser, Login, me, Logout } = require("../controllers/Auth")

const router = express.Router()

router.post("/register", CreateUser)
router.post("/login", Login)
router.get("/me", me)
router.get("/logout", Logout)

module.exports = router