const Comment = require('../models/commentModel');

// Controller function to handle posting a comment
exports.postComment = async (req, res) => {
  try {
    const { comment, userId, auctionId } = req.body;
    const newComment = new Comment({
      comment,
      userId,
      auctionId
    });
    await newComment.save();
    res.status(201).json({ message: 'Comment posted successfully', comment: newComment });
  } catch (error) {
    res.status(500).json({ error: 'Unable to post comment' });
  }
};

exports.getCommentsByAuctionId = async (req, res) => {
    try {
      const { auctionId } = req.params;
      // Find all comments for the specified auctionId
      const comments = await Comment.find({ auctionId }).populate('userId', 'username');
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: 'Unable to fetch comments' });
    }
  };

  exports.getCommentsByUserId = async (req, res) => {
    try{
      const {userId} = req.params;
      const comments = await Comment.find({userId}).populate('comment');
      res.status(200).json(comments);
    } catch (error) {
      res.status(500).json({ error: "Unable to fetch user's comments"});
    }
  };