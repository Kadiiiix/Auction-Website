import axios from "axios";
import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { Card } from "antd";
import "./../design/MessageSider.css";
import SearchUser from "./SearchUser";

function MessagesSider() {
  const [conversations, setConversations] = useState([]);
  const userId = localStorage.getItem("userId");

  // Function to fetch user details based on user ID
  const fetchUser = async (user) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/${user}`
      );
      return response.data; // Return the entire user data from the response
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  useEffect(() => {
    async function fetchConversations() {
      try {
        const response = await axios.get(
          "http://localhost:4000/api/messages/messages"
        );
        const messages = response.data;

        // Create an object to store last messages between users
        const lastMessages = {};

        // Iterate over messages to find the last message between each pair of users involving the signed-in user
        messages.forEach((message) => {
          const sender = message.sender;
          const receiver = message.receiver;
          if (sender === userId || receiver === userId) {
            // Check if the message involves the signed-in user
            const conversationKey = [sender, receiver].sort().join("-"); // Sort user IDs to create a unique conversation key

            // Update last message if it's null or newer than the current message
            if (
              !lastMessages[conversationKey] ||
              message.timestamp > lastMessages[conversationKey].timestamp
            ) {
              lastMessages[conversationKey] = message;
            }
          }
        });

        // Extract unique conversation keys from the lastMessages object
        const conversationKeys = Object.keys(lastMessages);

        // Extract user details and last messages for each conversation involving the signed-in user
        const conversations = await Promise.all(
          conversationKeys.map(async (key) => {
            const [senderId, receiverId] = key.split("-");
            const otherUserId = senderId === userId ? receiverId : senderId; // Get the ID of the other user
            const userData = await fetchUser(otherUserId);
            if (userData) {
              return {
                userId: otherUserId,
                username: userData.username,
                lastMessage: lastMessages[key],
              };
            } else {
              return null;
            }
          })
        );

        // Filter out any null conversations (in case user fetching failed)
        setConversations(
          conversations.filter((conversation) => conversation !== null)
        );
      } catch (error) {
        console.error("Error fetching conversations:", error);
      }
    }

    fetchConversations();
  }, [userId]); // Include userId in the dependency array to fetch conversations when it changes

  const handleUserSelect = (user) => {
    // Redirect to the conversation with the selected user
    window.location.href = `/messages/${user._id}`;
  };

  return (
    <div className="sider-container">
      <Card
        className="search"
        style={{
          width: 300,
        }}
      >
        <p>Find user to message them:</p>
        <SearchUser onUserSelect={handleUserSelect} />
      </Card>
      <h1 className="convo">Conversations</h1>
      <div className="conversations-list">
        {conversations.map((conversation, index) => (
          <Card key={index} style={{ width: "100%", marginBottom: "10px" }}>
            <div className="conversation-info">
              <p className="username">{conversation.username}</p>
              <p className="message-date">
                {new Date(conversation.lastMessage.timestamp).toLocaleString()}
              </p>
            </div>
            <div className="last-message">
              <p>Last message: {conversation.lastMessage.message}</p>
            </div>
            <Link to={`/messages/${conversation.userId}`}>
              View Conversation
            </Link>
          </Card>
        ))}
      </div>
    </div>
  );
}

export default MessagesSider;
