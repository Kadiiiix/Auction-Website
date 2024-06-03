const express = require("express");
const router = express.Router();
const notificationController = require("../controllers/notificationControllers");



router.post(
  "/closing/:auctionId",
  notificationController.sendNotificationsAtClosing
);

router.post(
  "/extension/:auctionId",
  notificationController.sendNotificationsAtExtension
);
router.post(
    "/outbid/:auctionId",
    notificationController.notifyOutbid
);

router.get("/:userId", notificationController.getUserNotifications);
router.delete("/:notificationId", notificationController.deleteNotification);



module.exports = router;
