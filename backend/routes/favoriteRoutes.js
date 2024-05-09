const express = require("express");
const router = express.Router();
const favoriteController = require("../controllers/favoriteControllers");

router.post("/add/:auctionId/:userId", favoriteController.addToFavorites);

router.delete(
  "/remove/:auctionId/:userId",
  favoriteController.removeFromFavorites
);
module.exports = router;
