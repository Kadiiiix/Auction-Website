const express = require('express');
const router = express.Router();
const reportController = require('../controllers/reportController');

router.post('/report', reportController.createReport);
router.get('/reports/user/:userId', reportController.getUserReportCount);
router.get('/reports/auction/:auctionId', reportController.getAuctionReportCount);
router.get('/reports/auction/all/:auctionId', reportController.getAllAuctionReports);
router.get('/reports/comment/:commentId', reportController.getCommentReportCount);
router.get('/reports/comment/all/:commentId', reportController.getAllCommentReports);
router.get('/reports/aggregated/:userId', reportController.getAggregatedUserReports);
module.exports = router;
