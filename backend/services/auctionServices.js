const Auction = require("../models/auctionModel");
const {
  sendNotificationsAtAuctionExpiration,
} = require("../controllers/notificationControllers");

const AuctionService = {
  trackAuctionExpiration: async (auctionId) => {
    try {
      // Find the auction by ID
      const auction = await Auction.findById(auctionId);

      if (!auction) {
        console.error("Auction not found");
        return;
      }

      // Check if the auction has already ended
      if (auction.closingDate <= new Date()) {
        // Send request to send notifications
        await sendNotificationsAtAuctionExpiration({ params: { auctionId } });
      }
    } catch (error) {
      console.error("Error tracking auction expiration:", error);
    }
  },
  // Other auction-related functions...
};

module.exports = AuctionService;
