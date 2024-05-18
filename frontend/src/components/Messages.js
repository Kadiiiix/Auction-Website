import axios from 'axios';
import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const [oldMessages, setOldMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/messages/send', {
        sender: userId,
        receiver: id,
        message: newMessage,
      });
      console.log("Message sent", response.data);
      setMessages([...messages, { sender: userId, message: newMessage }]);
      setNewMessage('');
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  };

  const fetchUser = async (user) => {
    try {
      const response = await axios.get(`http://localhost:4000/api/users/${user}`);
      return response.data;
    } catch (error) {
      console.error("Error fetching user:", error);
      return null;
    }
  };

  useEffect(() => {
    const getMessages = async () => {
      try {
        const response = await axios.get(`http://localhost:4000/api/messages/conversation/${id}?senderId=${userId}`);
        setOldMessages(response.data);

        const senderData = await fetchUser(userId);
        const receiverData = await fetchUser(id);

        if (senderData) setSender(senderData.username);
        if (receiverData) setReceiver(receiverData.username);
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessages();
  }, [id, userId]);

  return (
    <div>
      <h2>Chat with {receiver}</h2>
      <div>
        {/* Display old messages */}
        {oldMessages.map((message, index) => (
          <div key={index}>
            <p>{message.sender === userId ? sender : receiver}: {message.message}</p>
          </div>
        ))}
      </div>
      <div>
        {/* Display new messages */}
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.sender === userId ? sender : receiver}: {msg.message}</p>
          </div>
        ))}
      </div>
      {/* Input field and button for sending messages */}
      <div>
        <input type="text" value={newMessage} onChange={(e) => setNewMessage(e.target.value)} />
        <button onClick={sendMessage}>Send</button>
      </div>
    </div>
  );
}

export default Messages;
