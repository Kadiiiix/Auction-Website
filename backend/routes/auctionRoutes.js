const express = require('express');
const router = express.Router();
const auctionController = require('../controllers/auctionControllers');

// Route for creating a new auction
router.post('/', auctionController.createAuction);
router.delete('/:id', auctionController.deleteAuction);
router.put('/:id/extend', auctionController.extendAuction);
router.get('/', auctionController.getAllAuctions);

module.exports = router;
