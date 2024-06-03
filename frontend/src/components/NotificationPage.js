import React, { useState, useEffect } from "react";
import axios from "axios";
import "../design/NotificationPage.css";
import { Link } from "react-router-dom";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/notification/${userId}`
      );
      const notifications = response.data.map((notification) => {
        const auctionName = extractAuctionName(notification.message);
        return {
          ...notification,
          auctionName: auctionName ? auctionName.trim() : null,
        };
      });
      setNotifications(notifications);
    } catch (error) {
      console.error("Error fetching notifications:", error);
    }
  }

  const formatTime = (timestamp) => {
    const options = {
      year: "numeric",
      month: "short",
      day: "numeric",
      hour: "numeric",
      minute: "numeric",
    };
    return new Date(timestamp).toLocaleString("en-US", options);
  };

  const deleteNotification = async (notificationId) => {
    try {
      await axios.delete(
        `http://localhost:4000/api/notification/${notificationId}`
      );
      setNotifications(
        notifications.filter(
          (notification) => notification._id !== notificationId
        )
      );
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  async function fetchAuctionDetails(name) {
    const auctionName = name;
    if (!auctionName) {
      console.error("Auction name not found in message");
      return null;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/auctions/search?query=${encodeURIComponent(
          auctionName
        )}`
      );
      const auction = response.data;
      // Process the fetched auction details as needed
      return auction;
    } catch (error) {
      console.error("Error fetching auction details:", error);
      return null;
    }
  }

  const extractAuctionName = (message) => {
    const startIndex = message.indexOf("auction for");
    if (startIndex !== -1) {
      // Add 12 to skip "auction for" and 1 to skip the following space
      return message.slice(startIndex + 12);
    }
    return null;
  };

  const getLink = async (notification) => {
    const message = notification.message.toLowerCase();
    if (message.includes("extended") || message.includes("outbid")) {
      const auctionName = extractAuctionName(message);
      if (auctionName) {
        const auction = await fetchAuctionDetails(auctionName);
        if (auction) {
          return `/auction/${auction._id}`;
        }
      }
    } else if (message.includes("congratulations!")) {
      const auctionName = extractAuctionName(message);
      if (auctionName) {
        const auction = await fetchAuctionDetails(auctionName);
        if (auction) {
          return `/profile/${auction.vendorId}`;
        }
      }
    } else if (message.includes("highest bid was")) {
      const auctionName = extractAuctionName(message);
      if (auctionName) {
        const auction = await fetchAuctionDetails(auctionName);
        if (auction) {
          return `/profile/${auction.highestBidderId}`;
        }
      }
    }

    return null;
  };

  return (
    <div className="notification-container">
      <h1>Notifications</h1>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <div className="notification-message">{notification.message}</div>
            <div className="notification-time">
              {formatTime(notification.timestamp)}
            </div>
            <button onClick={() => deleteNotification(notification._id)}>
              Delete
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;
