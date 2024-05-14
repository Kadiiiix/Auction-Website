const mongoose = require("mongoose");

const notificationSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  message: { type: String, required: true },
  timestamp: { type: Date, default: Date.now },
  isRead: { type: Boolean, default: false },
  bidderId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  vendorId: {
    type: mongoose.Schema.Types.String,
    ref: "User",
    required: true,
  },
  auctionId: {
    type: mongoose.Schema.Types.String,
    ref: "Auction",
    required: true,
  },
  notificationType: {type:Boolean, default:false},
});

module.exports = mongoose.model("Notification", notificationSchema);


