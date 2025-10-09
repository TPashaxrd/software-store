const Users = require("../models/Users")

const totals = async (req, res) => {
    try {
        const UserCount = await Users.countDocuments()

        const dashboard = {
            UserCount
        }

        res.status(200).json({ success: true, dashboard })
    } catch (error) {
        res.status(500).json({ message: error.message })
    }
}

