const mongoose = require("mongoose")

const libarySchema = new mongoose.Schema({
    product_id: { type: "String" },
    date: { type: Date, default: Date.now() }
})

const UsersSchema = new mongoose.Schema({
    username: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    profilePicture: {
        type: String,
        defualt: "https://pngtree.com/freepng/internet-cyber-scammer-trying-to-cheat-an-internet-user_15533211.html"
    },
    password: {
        type: String,
        required: true
    },
    libary: {
        type: [libarySchema],
        default: []
    },
    IP_Address: {
        type: String,
        required: true
    },
    isBanned: {
        type: Boolean,
        default: false
    },
    date: {
        type: Date,
        default: Date.now()
    }
})

module.exports = mongoose.model("StoreUsers", UsersSchema)