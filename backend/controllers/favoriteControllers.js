const User = require("../models/userModel");
const Auction = require("../models/auctionModel");
const { verifyToken } = require("../middleware/middleware");
exports.addToFavorites = async (req, res) => {
  const auctionId = req.params.auctionId;
  const userId = req.params.userId;
  try {
    verifyToken(req, res, async () => {
      const auction = await Auction.findById(auctionId);
      const user = await User.findById(userId);
  
      if (!user) {
        return res.status(404).json({ error: "User not found" });
      }
      if (!auction) {
        return res.status(404).json({ error: "Auction not found" });
      }
  
      if (user.favorites.includes(auctionId)) {
        return res.status(400).json({ error: "Auction already in favorites" });
      }
  
      // Add the auction ID to the user's favorites array
      user.favorites.push(auctionId);
      auction.likedBy.push(userId);
      await user.save();
      await auction.save();
  
      res
        .status(200)
        .json({ message: "Auction added to favorites successfully", user });
    });
  } catch (error) {
    console.error("Error adding auction to favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};

exports.removeFromFavorites = async (req, res) => {
  const auctionId = req.params.auctionId;
  const userId = req.params.userId;

  try {
    // Find the user by ID
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ error: "User not found" });
    }

    // Remove the auction ID from the user's favorites array
    user.favorites = user.favorites.filter(
      (fav) => fav.toString() !== auctionId
    );
    await user.save();

    res
      .status(200)
      .json({ message: "Auction removed from favorites successfully", user });
  } catch (error) {
    console.error("Error removing auction from favorites:", error);
    res.status(500).json({ error: "Internal server error" });
  }
};
