const dotenv = require("dotenv");

dotenv.config()

const adminAuth = (req, res, next) => {
  const { password } = req.body;
  const ADMIN_PASSWORD = process.env.ADMIN_KEY;
  if(password !== ADMIN_PASSWORD) {
      return res.status(401).json({ success: false, message: "Unauthorized" })
  }

  next();
};

module.exports = adminAuth;