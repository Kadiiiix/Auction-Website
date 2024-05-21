import axios from 'axios';
import React, { useState, useEffect, useRef } from 'react';
import { useParams, Link } from 'react-router-dom';
import { Input, Button } from 'antd';
import './../design/Message.css'; // Import custom CSS for styling

const { TextArea } = Input;

function Messages() {
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState('');
  const userId = localStorage.getItem("userId");
  const { id } = useParams();
  const [oldMessages, setOldMessages] = useState([]);
  const [sender, setSender] = useState("");
  const [receiver, setReceiver] = useState("");
  const messagesEndRef = useRef(null);

  const sendMessage = async () => {
    try {
      const response = await axios.post('http://localhost:4000/api/messages/send', {
        sender: userId,
        receiver: id,
        message: newMessage,
      });
      console.log("Message sent", response.data);
      setMessages([...messages, { sender: userId, message: newMessage, timestamp: new Date() }]);
      setNewMessage('');
      scrollToBottom();
      getMessages();
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
        scrollToBottom();
      } catch (error) {
        console.error("Error fetching messages:", error);
      }
    };
    getMessages();
    scrollToBottom();
  }, [id, userId]);

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

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };


  return (
    <div className="messages-container">
      {id!=="user" && oldMessages.length === 0 && (
        <h2>Start conversation with {receiver} by sending a message.</h2>
      )}
      {id!=="user" && oldMessages.length > 0 && (
        <h2>Chat with {receiver}</h2>
      )}
      {id!=="user" && oldMessages.length > 0 && (
        <div className="messages-list">
          {oldMessages.map((message, index) => (
            <div className="message-rectangle" key={index}>
              <div className="message-info">
                <Link to={`/profile/${message.sender}`}>
                  {message.sender === userId ? `${sender} (You)` : receiver}
                </Link>
                <p>{new Date(message.timestamp).toLocaleString()}</p>
              </div>
              <div className="message-text">
                <p>{message.message}</p>
              </div>
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>
      )}
      {id!=="user" && (
        <div className="message-input-container">
          <TextArea
            placeholder="Type your message"
            autoSize
            value={newMessage}
            onChange={(e) => setNewMessage(e.target.value)}
            className="message-input"
          />
          <Button type="primary" onClick={sendMessage} className="button">Send</Button>
        </div>
      )}
      {id==="user" && (
        <h2>Select conversation or start a new one.</h2>
      )}
    </div>
  );
}  

export default Messages;
