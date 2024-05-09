const express = require("express");
const router = express.Router();
const auctionController = require("../controllers/favoriteControllers");

router.post(
  "/add/:auctionId/:userId",
  auctionController.addToFavorites
);

// Route to remove an auction from favorites
router.delete(
  "/remove/:auctionId/:userId",
  auctionController.removeFromFavorites
);
module.exports = router;