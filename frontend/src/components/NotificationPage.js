import React, { useState, useEffect } from "react";
import axios from "axios";
import "../design/NotificationPage.css";
import { Link } from "react-router-dom";
import { DeleteOutlined } from "@ant-design/icons";

function NotificationPage() {
  const [notifications, setNotifications] = useState([]);
  const [notificationLinks, setNotificationLinks] = useState([]);
  const userId = localStorage.getItem("userId");

  useEffect(() => {
    fetchNotifications();
  }, []);

  async function fetchNotifications() {
    try {
      const response = await axios.get(
        `http://localhost:4000/api/notification/${userId}`
      );
      const notifications = response.data.map((notification) => ({
        ...notification,
      }));
      setNotifications(notifications);
      await fetchNotificationLinks(notifications);
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
      const updatedNotifications = notifications.filter(
        (notification) => notification._id !== notificationId
      );
      setNotifications(updatedNotifications);
      const updatedLinks = notificationLinks.filter(
        (link, index) => notifications[index]._id !== notificationId
      );
      setNotificationLinks(updatedLinks);
    } catch (error) {
      console.error("Error deleting notification:", error);
    }
  };

  async function fetchAuctionDetails(name) {
    if (!name) {
      console.error("Auction name not found in message");
      return null;
    }

    try {
      const response = await axios.get(
        `http://localhost:4000/api/auctions/search?query=${encodeURIComponent(
          name
        )}`
      );

      const auction = response.data[0];
      const auctionId = auction._id;
      const vendor = auction.createdBy;
      const highestBidder = auction.highestBidder || null;
      return { auctionId, vendor, highestBidder };
    } catch (error) {
      console.error("Error fetching auction details:", error);
      return null;
    }
  }

  const extractAuctionName = (message) => {
    const startIndex = message.indexOf("auction for");
    if (startIndex !== -1) {
      let auctionName = message.slice(startIndex + 12).trim();
      const delimiters = [" is ", " has ", "."];
      let endIndex = auctionName.length;
      delimiters.forEach((delimiter) => {
        const delimiterIndex = auctionName.indexOf(delimiter);
        if (delimiterIndex !== -1 && delimiterIndex < endIndex) {
          endIndex = delimiterIndex;
        }
      });
      auctionName = auctionName.slice(0, endIndex).trim();
      return auctionName;
    }
    return null;
  };

const getLink = async (notification) => {
  const name = extractAuctionName(notification.message);
  if (name) {
    const message = notification.message.toLowerCase();
    const details = await fetchAuctionDetails(name);
    if (!details) return null;

    const auctionId = details.auctionId;
    const vendorId = details.vendor;
    const bidderId = details.highestBidder;

    if (message.includes("extended") || message.includes("outbid")) {
      if (auctionId) return `/auction/${auctionId}`;
    } else if (message.includes("congratulations!")) {
      if (vendorId) return `/profile/${vendorId}`;
    } else if (message.includes("highest bid was")) {
      if (bidderId) return `/profile/${bidderId}`;
    }
  }
  return null;
};


  async function fetchNotificationLinks(notifications) {
    const links = await Promise.all(
      notifications.map((notification) => getLink(notification))
    );
    setNotificationLinks(links);
  }

  return (
    <div className="notification-container">
      <h1 className="head">Notifications</h1>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <div className="mes">
              <div className="notification-message">{notification.message}</div>
              <div className="notification-time">
                {formatTime(notification.timestamp)}
              </div>
            </div>
            <div class="bb">
              {notificationLinks[index] && (
                <button  class="but">
                  <Link
                    to={notificationLinks[index]}
                    className="notification-link"
                  >
                    View Details
                  </Link>
                </button>
              )}
            </div>
            <div class="del">
              <DeleteOutlined
                className="dele"
                onClick={() => deleteNotification(notification._id)}
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default NotificationPage;
