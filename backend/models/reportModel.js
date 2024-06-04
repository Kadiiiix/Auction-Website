const mongoose = require('mongoose');

const reportSchema = new mongoose.Schema({
  reporter: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  reportedUser: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: false },
  auction: { type: mongoose.Schema.Types.ObjectId, ref: 'Auction', required: false },
  comment: { type: mongoose.Schema.Types.ObjectId, ref: 'Comment', required: false },
  reason: { 
    type: String, 
    enum: ['hate_speech', 'spam', 'false_information', 'inappropriate_content', 'other'], 
    required: true 
  },
  description: { type: String }
}, { timestamps: true });

module.exports = mongoose.model('Report', reportSchema);

