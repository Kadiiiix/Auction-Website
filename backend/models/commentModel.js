const mongoose = require("mongoose");

const commentSchema = new mongoose.Schema({
    timePosted: { type: Date, default: Date.now },
    comment: String,
    userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
    auctionId: String
  });

module.exports = mongoose.model("Comment", commentSchema);