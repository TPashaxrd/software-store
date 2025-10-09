const express = require("express")
const cors = require("cors")
const path = require("path")
const db = require("./config/db")
const dotenv = require("dotenv")
const MongoStore = require("connect-mongo")
const session = require("express-session")
const AuthRoutes = require("./routes/auth")
const CheatRoutes = require("./routes/Cheats")
const app = express()

dotenv.config()
app.use(cors({
    origin: 'http://localhost:5173',
    credentials: true
}))

app.use(express.json())
app.use(express.urlencoded({ extended: true }));
const store = MongoStore.create({
    mongoUrl: process.env.MONGO_URL,
    collectionName: "sessions"
})

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false,
    store,
    cookie: {
        maxAge: 1000 * 60 * 60 * 24,
        httpOnly: true,
        sameSite: "lax",
        secure: false
    }
}))

db()

app.use("/api/auth", AuthRoutes)
app.use("/api/cheats", CheatRoutes);

const PORT = 5000;
app.listen(PORT, () => {
    console.log(`Server running at: ${PORT}`)
})