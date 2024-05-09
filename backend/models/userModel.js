const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
});

module.exports = mongoose.model("User", userSchema);
