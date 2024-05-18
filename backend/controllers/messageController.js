const Message = require("../models/messageModel");

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({
      sender: sender,
      receiver: receiver,
      message,
    });

    await newMessage.save();
    res.status(201).json(newMessage);
  } catch (error) {
    res.status(500).json({ message: "Failed to send message", error });
  }
};

// Get conversation between two users
const getMessages = async (req, res) => {
  try {
    const { userId } = req.params;
    const { senderId } = req.query;  // Ensure this matches the query parameter you are sending
    
    const messages = await Message.find({
      $or: [
        { sender: senderId, receiver: userId },
        { sender: userId, receiver: senderId }
      ]
    }).sort({ timestamp: 1 });

    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get messages", error });
  }
};

module.exports = { sendMessage, getMessages };
