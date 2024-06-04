const Report = require('../models/reportModel');
const User = require('../models/userModel');
const Auction = require('../models/auctionModel');
const Comment = require('../models/commentModel');

// Report a user, auction, or comment
exports.createReport = async (req, res) => {
  try {
    const { reporter, reportedUser, auction, comment, reason, description } = req.body;

    // Ensure only one of auction or comment is provided
    if ((auction && comment) || (!auction && !comment && !reportedUser)) {
      return res.status(400).send('Invalid report data');
    }

    const report = new Report({
      reporter,
      reportedUser,
      auction,
      comment,
      reason,
      description
    });

    await report.save();
    res.status(201).json(report);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report count for a user
exports.getUserReportCount = async (req, res) => {
  try {
    const userId = req.params.userId;
    const count = await Report.countDocuments({ reportedUser: userId });
    res.json({ userId, reportCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report count for an auction
exports.getAuctionReportCount = async (req, res) => {
  try {
    const auctionId = req.params.auctionId;
    const count = await Report.countDocuments({ auction: auctionId });
    res.json({ auctionId, reportCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get report count for a comment
exports.getCommentReportCount = async (req, res) => {
  try {
    const commentId = req.params.commentId;
    const count = await Report.countDocuments({ comment: commentId });
    res.json({ commentId, reportCount: count });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Get aggregated reports for a user
exports.getAggregatedUserReports = async (req, res) => {
  try {
    const { userId } = req.params;

    // Fetch profile reports
    const profileReports = await Report.find({ reportedUser: userId }).populate('reporter', 'username');

    // Fetch auctions created by user
    const auctions = await Auction.find({ createdBy: userId });
    const auctionIds = auctions.map(auction => auction._id);

    // Fetch auction reports
    const auctionReports = await Report.find({ auction: { $in: auctionIds } })
        .populate('reporter', 'username')
        .populate('auction', 'name');

    // Fetch comments made by user
    const comments = await Comment.find({ userId: userId });
    const commentIds = comments.map(comment => comment._id);

    // Fetch comment reports
    const commentReports = await Report.find({ comment: { $in: commentIds } })
        .populate('reporter', 'username')
        .populate('comment', 'comment');

    // Aggregate all reports
    const allReports = [...profileReports, ...auctionReports, ...commentReports];

    res.json({
        profileReports,
        auctionReports,
        commentReports,
        totalReports: allReports.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching aggregated reports' });
  }
};

exports.getAllAuctionReports = async (req, res) => {
  try {
    const { auctionId } = req.params;

    // Fetch reports related to the auction
    const auctionReports = await Report.find({ auction: auctionId })
      .populate('reporter', 'username')
      .select('-__v'); // Exclude mongoose metadata

    res.json({
      auctionReports,
      totalReports: auctionReports.length,
    });
  } catch (error) {
    res.status(500).json({ error: 'Error fetching aggregated auction reports' });
  }
};

// Get all comment reports with details
exports.getAllCommentReports = async (req, res) => {
  try {
    const reports = await Report.find({ comment: { $exists: true } })
        .populate({
            path: 'reporter',
            select: 'username'
        })
        .populate('comment', 'comment');
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: 'Error fetching comment reports' });
  }
};
