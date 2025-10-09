const mongoose = require("mongoose")

const ImagesSchema = new mongoose.Schema({
  ImageURL: { type: String }
})

const cheatSchema = new mongoose.Schema({
  cheatId: { type: String, required: true },
  title: { type: String, required: true },
  description: { type: String },
  price: { type: Number, required: true },
  game: { type: String, required: true },
  imageUrl: { type: String, default: "" },
  Images: [ImagesSchema],
  downloadLink: { type: String, default: "" },
  uploadedBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "StoreUsers",
    default: null,
  },
}, { timestamps: true });

module.exports = mongoose.model("Cheats", cheatSchema);