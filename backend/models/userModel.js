const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  email: String,
  username: String,
  password: String,
  resetPasswordToken: String, // New field for storing reset password token
  resetPasswordExpires: Date, // New field for storing token expiration date
  favorites: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  fullname: String,
  phone_number: String,
  city: String,
  photo: String,
  vendorRatings: [
    {
      type: Number,
      default: 1,
      min: 1,
      max: 5,
    },
  ], // Array of vendor ratings
  vendorRating: {
    type: Number,
    default: 1,
    min: 1,
    max: 5,
  },
  ratedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }], // Users who have rated this user
  bidOn: [{ type: mongoose.Schema.Types.ObjectId, ref: "Auction" }],
  role: {
    type: String,
    default: "user", // Default role is "user"
    enum: ["user", "admin"] // Enumerate the possible roles
  }
});

module.exports = mongoose.model("User", userSchema);
