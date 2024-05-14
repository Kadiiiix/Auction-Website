const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Auction = require("../models/auctionModel");

exports.createNotification = async (req, res) => {
  const { userId, message } = req.body;

  try {
    const notification = await Notification.create({ userId, message });
    res.status(201).json(notification);
  } catch (error) {
    console.error("Error creating notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.getUserNotifications = async (req, res) => {
  const { userId } = req.params;

  try {
    const notifications = await Notification.find({ userId }).sort({
      timestamp: -1,
    });
    res.status(200).json(notifications);
  } catch (error) {
    console.error("Error retrieving notifications:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to mark a notification as read
exports.markNotificationAsRead = async (req, res) => {
  const { notificationId } = req.params;

  try {
    const notification = await Notification.findByIdAndUpdate(
      notificationId,
      { isRead: true },
      { new: true }
    );
    res.status(200).json(notification);
  } catch (error) {
    console.error("Error marking notification as read:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Controller to delete a notification
exports.deleteNotification = async (req, res) => {
  const { notificationId } = req.params;

  try {
    await Notification.findByIdAndDelete(notificationId);
    res.status(204).send();
  } catch (error) {
    console.error("Error deleting notification:", error);
    res.status(500).json({ message: "Internal server error" });
  }
};

exports.sendNotificationsAtAuctionExpiration = async (req, res) => {
  try {
    // Find the auction by ID
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      console.error("Auction not found");
      return;
    }

    // Get the highest bidder and the vendor
    const highestBidderId = auction.highestBidder;
    const vendorId = auction.createdBy;
    const highestBidder = await User.findById(highestBidderId);
    // Create notifications for the highest bidder and the vendor
    const notificationToBidder = new Notification({
      userId: highestBidderId,
      message: `Congratulations! You won the auction for ${auction.name}.`,
      bidderId: highestBidderId,
      vendorId: vendorId,
      auctionId: auctionId,
      notificationType: true,
    });

    const notificationToVendor = new Notification({
      userId: vendorId,
      message: `The auction for ${auction.name} has ended. The highest bid was ${auction.highestBid} by ${highestBidder.name}.`,
      bidderId: highestBidderId,
      vendorId: vendorId,
      auctionId: auctionId,
      notificationType: false,
    });

    // Save notifications to the database
    await Promise.all([
      notificationToBidder.save(),
      notificationToVendor.save(),
    ]);

    console.log("Notifications sent successfully");
  } catch (error) {
    console.error("Error sending notifications:", error);
  }
};
