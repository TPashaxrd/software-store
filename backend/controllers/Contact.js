const Contact = require("../models/Contact");

const CreateContact = async (req, res) => {
    try {
        const { email, message } = req.body;

        if(!email || !message) return res.status(400).json({ message: "All fields are required.." });

        const exist = await Contact.findOne({ email })
        if(exist) return res.status(409).json({ message: "You have already sent a message. We will get back to you soon." })

        const newCotnact = new Contact({
            email,
            message
        })

        await newCotnact.save()

        res.status(201).json({ message: "Message sent successfully.", newCotnact });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
}

// const getContactById = async(req, res) => {
//     try {
//         const { id } = req.params;
//         if(!id) return res.status(400).json({ message: "Contact ID is required." });
//         const user = req.session.userId
//         if(!user) return res.status(401).json({ message: "You must be logged in."})

//         if(!user === id) return res.status(403).json({ message: "You can only view your own contacts." });

//         const contact = await Contact.findById(id);
//         if(!contact) return res.status(404).json({ message: "Contact not found." });

//         res.status(200).json(contact);
//     } catch (error) {
//         res.status(500).json({ message: error.message })   
//     }
// }

module.exports = { CreateContact };