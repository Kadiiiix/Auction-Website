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
      const notifications = response.data;
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

  return (
    <div className="notification-container">
      <h1>Notifications</h1>
      <div className="notification-list">
        {notifications.map((notification, index) => (
          <div key={index} className="notification-item">
            <div className="notification-message">{notification.message}</div>
            {notification.type ? (
              <Link to={`/profile/${notification.bidderId}`}>
                Bidder Profile
              </Link>
            ) : (
              <Link to={`/profile/${notification.vendorId}`}>
                Vendor Profile
              </Link>
            )}
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
