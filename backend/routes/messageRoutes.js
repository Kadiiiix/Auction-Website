const express = require("express");
const router = express.Router();
const { sendMessage, getMessages, getAllMessages } = require("../controllers/messageController");

router.post("/send", sendMessage);
router.get("/conversation/:userId", getMessages);
router.get('/messages', getAllMessages);
module.exports = router;
