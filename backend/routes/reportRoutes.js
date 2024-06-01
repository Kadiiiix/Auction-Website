const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/report', reportController.createReport);
router.get('/reports/user/:userId', reportController.getUserReportCount);
router.get('/reports/auction/:auctionId', reportController.getAuctionReportCount);
router.get('/reports/comment/:commentId', reportController.getCommentReportCount);

module.exports = router;
