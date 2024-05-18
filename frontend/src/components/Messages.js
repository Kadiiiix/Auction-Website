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
    try{
      const response = await axios.post('http://localhost:4000/api/messages/send', {
        sender: userId,
        receiver: id,
        message: newMessage,
      })
      console.log("Message sent", response.data);
    } catch (error) {
      console.error("Error sending message: ", error);
    }
  }



useEffect(() => {
    const getMessages = async () => {
        try{
            const response = await axios.get(`http://localhost:4000/api/messages/conversation/${id}?senderId=${userId}`);
            setOldMessages(response.data);
            const senderUsername = fetchUser(response.data.sender);
            setSender(senderUsername.username);
          } catch (error) {
            console.error("Error fetching messages.");
        }
    };
    getMessages();
},)

useEffect(() => {
  const fetchSender = async () => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/${userId}`
      );
      setSender(response.data);
    } catch (error) {
      console.error("Error fetching a user.");
    }
  };
  fetchSender();
}, [userId]);


  const fetchUser = async (user) => {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/users/${user}`
      );
      setReceiver(response.data);
    } catch (error) {
      console.error("Error fetching a user");
    }
  };



  return (
    <div>
      <h2>Chat with {receiver.username}</h2>
      <div>
        <div>{/* Display old messages */}
      {oldMessages.map((message, index) => (
        <div key={index}>
          <p>{sender.username}: {message.message}</p>
        </div>
      ))}</div>
        {/* Display messages */}
        {messages.map((msg, index) => (
          <div key={index}>
            <p>{msg.userId}: {msg.message}</p>
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
