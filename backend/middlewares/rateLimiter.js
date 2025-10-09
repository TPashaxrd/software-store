const rateLimit = require("express-rate-limit")

const limiter = rateLimit({
    windowMs: 60 * 1000,
    max: 50,
    message: "Too many request from this IP, try later."
})

module.exports = { limiter }