const mongoose = require("mongoose");

const auctionSchema = new mongoose.Schema({
  picture: { type: String, required: false }, // URL of the product picture
  name: { type: String, required: true }, // Name/short description of the product
  condition: { type: String, enum: ["new", "used"], required: true }, // Condition of the item (new/used)
  category: { type: String, required: true }, // Category of the item
  closingDate: { type: Date, required: true }, // Auction closing date
  /*createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },*/
  additionalPhotos: [String], // Array of URLs of additional photos
  startingBid: Number, // Starting bid amount
  allowInstantPurchase: Boolean, // Whether instant purchasing is allowed
  description: String, // Long description of the product
  location: String, // Location of the item
  age: Number, // Age of the item
  likedBy: [{ type: mongoose.Schema.Types.ObjectId, ref: "User" }],
});

const Auction = mongoose.model("Auction", auctionSchema);

module.exports = Auction;
