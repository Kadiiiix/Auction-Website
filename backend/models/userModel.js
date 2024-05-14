const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  fullname: String,
  phone_number: String,
  city: String,
  photo: String,
  vendorRatings: [{ type: Number, default: 0 }], // Array of vendor ratings
  vendorRating: { type: Number, default: 0 }, // Average vendor rating
});

module.exports = mongoose.model("User", userSchema);
