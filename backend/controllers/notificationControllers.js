const Notification = require("../models/notificationModel");
const User = require("../models/userModel");
const Auction = require("../models/auctionModel");
const cron = require("node-cron");

exports.createNotification = async (req, res) => {
  const { userId, message } = req.params;

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

/*
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
*/
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
exports.sendNotificationsAtClosing = async (req, res) => {
  try {
    // Find the auction by ID
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      console.error("Auction not found");
      return res.status(404).json({ error: "Auction not found" });
    }

    const highestBidderId = auction.highestBidder;
    const vendorId = auction.createdBy;
    const bidderIds = auction.bidderIds;
    const highestBidder = await User.findById(highestBidderId);

    if(highestBidderId){
    const notificationToBidder = new Notification({
      userId: highestBidderId,
      message: `Congratulations! You won the auction for ${auction.name}.`,
    });
    

    const notificationToVendor1 = new Notification({
      userId: vendorId,
      message: `The auction for ${auction.name} has ended. The highest bid was ${auction.highestBid} by ${highestBidder.username}.`,
    });
    }
    const notificationToVendor2 = new Notification({
      userId: vendorId,
      message: `The auction for ${auction.name} has ended. There was no highest bidder.`,
    });

    if (highestBidderId && bidderIds && bidderIds.length > 0) {
      const filteredBidders = bidderIds.filter(
        (bidderId) => bidderId !== highestBidderId
      );
    
    if (filteredBidders.length > 0) {
        const notificationsToBidders = filteredBidders.map((bidderId) => ({
          userId: bidderId,
          message: `The auction for ${auction.name} has ended`,
    }));
          await Promise.all([
          notificationToBidder.save(),
          notificationToVendor1.save(),
          Notification.insertMany(notificationsToBidders),
        ]);
      } else {
        await Promise.all([
          notificationToBidder.save(),
          notificationToVendor1.save(),
        ]);
      }
    } else {
      await Promise.all([
        notificationToVendor2.save(),
      ]);
    }

    console.log("Notifications sent successfully for closed auction");
    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Error sending notifications" });
  }
};

async function sendExpirationNotifications() {
  try {
    const currentTime = new Date(Date.now()).toISOString(); 
    const oneMinuteAgo = new Date(currentTime);
    oneMinuteAgo.setUTCMinutes(oneMinuteAgo.getUTCMinutes() - 1); 
    const expiredAuctions = await Auction.find({
      closingDate: { $lt: currentTime, $gte: oneMinuteAgo },
    });

    for (const auction of expiredAuctions) {
      const highestBidderId = auction.highestBidder;
      const vendorId = auction.createdBy;
      const bidderIds = auction.bidderIds;
      const highestBidder = await User.findById(highestBidderId);

      // Create notifications for the highest bidder and the vendor
      const messageToBidder = `Congratulations! You won the auction for ${auction.name}.`;
      const messageToBidders = `The auction for ${auction.name} has ended`;
      if(highestBidderId){
      const notificationToVendor1 = new Notification({
         userId: vendorId,
         message:`The auction for ${auction.name} has ended. The highest bid was ${auction.highestBid} by ${highestBidder.username}.`,
      });
      }
      const notificationToVendor2 = new Notification({
         userId: vendorId,
         message:`The auction for ${auction.name} has ended. There was no highest bid`,
      });

      if (highestBidder) {
        const notificationToHighestBidder= new Notification({
           userId: highestBidderId,
           message: messageToBidder,
        });

        const filteredBidders = bidderIds.filter(
          (bidderId) => bidderId !== highestBidderId
        );

        if (filteredBidders.length > 0) {
          const notificationsToBidders = filteredBidders.map((bidderId) => ({
            userId: bidderId,
            message: messageToBidders,
          }));

          await Promise.all([
            notificationToHighestBidder.save(),
            notificationToVendor1.save(),
            Notification.insertMany(notificationsToBidders),
          ]);
        } else {
          await Promise.all([
            notificationToHighestBidder.save(),
            notificationToVendor1.save(),
          ]);
        }
      } else {
        await notificationToVendor2.save();
      }

      console.log(
        "Notifications sent successfully for expired auction:",
        auction._id
      );
    }
  } catch (error) {
    console.error("Error sending expiration notifications:", error);
  }
};




cron.schedule("* * * * *", sendExpirationNotifications);

exports.notifyOutbid = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      console.error("Auction not found");
      return res.status(404).json({ error: "Auction not found" });
    }

    highestBidderId = auction.highestBidder;
    auctionName = auction.name;
    if (highestBidderId) {
      const message = `You have been outbid in the auction for ${auctionName}. Place a higher bet to win!`;

      const notification = new Notification({
        userId: highestBidderId,
        message: message,
      });

      await notification.save();
    }

    console.log(
      "Notification sent successfully to highest bidder for being outbid"
    );
    res.status(200).json({
      message:
        "Notification sent successfully to highest bidder for being outbid",
    });
  } catch (error) {
    console.error(
      "Error sending outbid notification to highest bidder:",
      error
    );
    res
      .status(500)
      .json({ error: "Error sending outbid notification to highest bidder" });
  }
};
exports.sendNotificationsAtExtension = async (req, res) => {
  try {
    const { auctionId } = req.params;
    const auction = await Auction.findById(auctionId);

    if (!auction) {
      console.error("Auction not found");
      return res.status(404).json({ error: "Auction not found" });
    }

    const bidders = auction.bidderIds;
    const messageToBidders = `The auction for ${auction.name} is extended. Place a bid!`;

    if (bidders && bidders.length > 0) {
      const notificationsToBidders = bidders.map((bidderId) => ({
        userId: bidderId,
        message: messageToBidders,
      }));

      await Notification.insertMany(notificationsToBidders);
    } else {
      console.log("No bidders found for the auction");
    }

    console.log("Notifications sent successfully");
    res.status(200).json({ message: "Notifications sent successfully" });
  } catch (error) {
    console.error("Error sending notifications:", error);
    res.status(500).json({ error: "Error sending notifications" });
  }
};