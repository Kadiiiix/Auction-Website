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
      const comments = await Comment.find({ auctionId }).populate('userId', 'username photo');
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

  exports.getAllComments = async (req, res) => {
    try {
      const comments = await Comment.find();
      res.status(200).json(comments);
    } catch (error) {
      console.error('Error getting all users:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  };

  exports.deleteComment = async (req, res) => {
    try {
      const {id} = req.params;

      const deletedComment = await Comment.findByIdAndDelete(id);

      if (!deletedComment) {
        return res.status(404).json({ error: "Comment not found." });
      }

      res.status(200).json({ message: "Comment deleted successfully." });
    } catch (error) {
      console.error("Error deliting comment: ", error);
      res.status(500).json({ error: 'Internal server error.' });
    }
  }