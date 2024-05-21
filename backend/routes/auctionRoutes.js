const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionControllers');
const commentController = require('../controllers/commentController');

// Route for creating a new auction
router.get('/search', auctionController.searchAuctions);
router.get("/similar/:auctionId", auctionController.getSimilar);
router.get("/popular", auctionController.getAuctionsSortedByLiked);
router.get("/recent", auctionController.getAuctionsSortedByDate);
router.get("/", auctionController.getAllAuctions);
router.get("/:id", auctionController.getAuction);
router.get("/category/:category", auctionController.getAuctionsByCategory);
router.get("/:auctionId/comments", commentController.getCommentsByAuctionId);

router.post('/comments', commentController.postComment);
router.post('/', auctionController.createAuction);
router.post('/:auctionId/placeBid/:userId/:amount' , auctionController.placeBid);

router.delete('/:id', auctionController.deleteAuction);

router.put('/:id/extend', auctionController.extendAuction);
router.put('/:id/close', auctionController.closeAuction);

module.exports = router;
