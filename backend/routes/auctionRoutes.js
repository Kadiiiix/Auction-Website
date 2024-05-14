const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionControllers');
const commentController = require('../controllers/commentController');

// Route for creating a new auction
router.get('/search', auctionController.searchAuctions);
router.post('/comments', commentController.postComment);
router.get('/:auctionId/comments', commentController.getCommentsByAuctionId)
router.post('/', auctionController.createAuction);
router.delete('/:id', auctionController.deleteAuction);
router.put('/:id/extend', auctionController.extendAuction);
router.get('/', auctionController.getAllAuctions);
router.get('/:id', auctionController.getAuction);
router.get('/category/:category', auctionController.getAuctionsByCategory);
router.post('/:auctionId/placeBid/:userId/:amount' , auctionController.placeBid);
router.put('/:id/close', auctionController.closeAuction);
module.exports = router;
