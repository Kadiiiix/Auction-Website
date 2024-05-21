const Message = require("../models/messageModel");
const User = require("../models/userModel"); // Assuming you have a User model to fetch user details

// Send a new message
const sendMessage = async (req, res) => {
  try {
    const { sender, receiver, message } = req.body;
    const newMessage = new Message({
      sender,
      receiver,
      message,
      timestamp: new Date() // Ensure timestamps are recorded
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

// Get all chats for a user
const getAllMessages = async (req, res) => {
  try {
    const messages = await Message.find();
    res.status(200).json(messages);
  } catch (error) {
    res.status(500).json({ message: "Failed to get all messages, ", error });
  }
};


module.exports = { sendMessage, getMessages, getAllMessages };
