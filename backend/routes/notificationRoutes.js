const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");

router.post("/:auctionId", notificationController.sendNotificationsAtAuctionExpiration);
router.get("/:userId", notificationController.getUserNotifications);
router.delete("/:notificationId", notificationController.deleteNotification);

module.exports = router;
