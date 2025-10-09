const Cheats = require("../models/Cheats");
const Users = require("../models/Users");
const bcrypt = require("bcryptjs")

const CreateUser = async(req, res) => {
    try {
        const { username, email, password, IP_Address } = req.body;
        if(!username || !email || !password || !IP_Address) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const existing = await Users.findOne({ email })
        if(existing) return res.status(400).json({ message: "Email already exists."})
        
        const hashed = await bcrypt.hash(password, 10)

        const user = await Users.create({
            username,
            email,
            password: hashed,
            IP_Address
        })

        req.session.userId = user._id;

        await user.save()

        res.status(201).json({ message: "Registered successfully!"})
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

const Login = async(req, res) => {
    try {
        const {email, password } = req.body;
        if(!email || !password) {
            return res.status(400).json({ message: "All fields are required."})
        }
        const user = await Users.findOne({ email })
        if(!user) return res.status(400).json({ message: "Invalid credentials"})
        const match = await bcrypt.compare(password, user.password)
        if(!match) return res.status(400).json({ message: "Your password are Incorrect."})
        
        req.session.userId = user._id;
        res.json({ message: "Logged in", user: { id: user._id, email }})
    } catch (error) {
        res.status(500).json({message:error.message})
    }
}

const Logout = async(req, res) => {
    req.session.destroy(err=> {
        if(err) return res.status(500).json({ message: "Logout error"})
        res.clearCookie("connect.sid")
        res.json({ message: "Logged out."})
    })
}

const me = async (req, res) => {
  try {
    if (!req.session.userId) {
      return res.status(401).json({ message: "Not logged in" });
    }

    const user = await Users.findById(req.session.userId).select("-password");
    if (!user) {
      req.session.destroy(() => {});
      res.clearCookie("connect.sid");
      return res.status(401).json({ message: "Session expired, please login again" });
    }

    const libaryWithCheats = await Promise.all(
      user.libary.map(async (item) => {
        const cheat = await Cheats.findOne({ cheatId: item.product_id }).select("-downloadLink");
        return {
          ...item.toObject(),
          cheat: cheat || null,
        };
      })
    );

    res.status(200).json({
      user: {
        ...user.toObject(),
        libary: libaryWithCheats,
      },
    });
  } catch (error) {
    console.error("❌ me() error:", error);
    res.status(500).json({ message: "Server error" });
  }
};

module.exports = { CreateUser, Login, Logout, me  }