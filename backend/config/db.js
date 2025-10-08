const mongoose = require('mongoose')
const dotenv = require("dotenv")

dotenv.config()

const db = () => {
  mongoose.connect(process.env.MONGO_URL, )
  .then(() => console.log('MongoDB connected.'))
  .catch(err => console.error('MongoDB didnt connect:', err))
}

module.exports = db