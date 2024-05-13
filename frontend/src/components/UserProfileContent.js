import React, { useEffect, useState } from "react";
import axios from "axios";
import { Card, Button, Form, Input, Space, notification } from "antd";

const UserProfileContent = ({ userId, loggedIn }) => {
  const [author, setAuthor] = useState("");
  const [fullname, setName] = useState("");
  const [phone_number, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [city, setCity] = useState("");
  const [commentsNumber, setCommentsNumber] = useState(0);
  const [favoritesNumber, setFavoritesNumber] = useState(0);
  const [auctionsNumber, setAuctionsNumber] = useState(0);
  const [isCurrentUser, setIsCurrentUser] = useState(false);
  const [editMode, setEditMode] = useState(false); // State to track edit mode
  const [form] = Form.useForm(); // Ant Design Form instance

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/comments/${userId}`
        );
        const comments = response.data;
        const commentsNum = comments.length;
        setCommentsNumber(commentsNum);
      } catch (error) {
        console.error("Error fetching user's comments: ", error);
      }
    };
    fetchComments();
  }, []);

  useEffect(() => {
    const fetchUserData = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}`
        );
        const userData = response.data;

        setAuthor(userData.username);
        setName(userData.fullname);
        setPhone(userData.phone_number);
        setEmail(userData.email);
        setCity(userData.city);
        setFavoritesNumber(userData.favorites.length);

        if (userData._id === userId) setIsCurrentUser(true);
      } catch (error) {
        console.error("Error fetching user data: ", error);
      }
    };
    fetchUserData();
  }, [userId]);

  useEffect(() => {
    const fetchAuctions = async () => {
      try {
        const response = await axios.get("http://localhost:4000/api/auctions");
        const auctions = response.data;
        const auctionsCreatedByUser = auctions.filter(
          (auction) => auction.createdBy === userId
        );
        setAuctionsNumber(auctionsCreatedByUser.length);
      } catch (error) {
        console.error("Error fetching auctions: ", error);
      }
    };
    fetchAuctions();
  }, [userId]);

  const handleEditClick = () => {
    // Toggle edit mode and reset form fields
    setEditMode(!editMode);
    form.setFieldsValue({
      fullname,
      email,
      phone_number,
      city,
    });
  };

  const handleFormSubmit = async (values) => {
    try {
      // Send a request to the backend to update user information
      const response = await axios.put(`http://localhost:4000/api/users/${userId}`, values);
  
      if (response.data) {
        console.log("User information updated successfully:", response.data);
        // Display success notification
        notification.success({
          message: 'Success',
          description: 'Changes were saved successfully.',
        });
      } else {
        console.log("User information updated successfully.");
      }
      setEditMode(false);
    } catch (error) {
      // Handle error response
      if (error.response && error.response.data) {
        console.error("Error updating user information:", error.response.data);
        // You can display an error message to the user or handle the error in another way
      } else {
        console.error("Error updating user information:", error.message);
      }
    }
  };
  

  const handleCancel = () => {
    // Return to view mode and reset form fields
    setEditMode(false);
    form.resetFields();
  };

  return (
    <>
      <Card title={`${author}'s Information`} className="main-card">
        {editMode ? (
          <Form
            form={form}
            onFinish={handleFormSubmit}
            labelCol={{ span: 6 }}
            wrapperCol={{ span: 14 }}
            initialValues={{
              fullname,
              email,
              phone_number,
              city,
            }}
          >
            <Form.Item label="Name" name="fullname">
              <Input />
            </Form.Item>
            <Form.Item label="Email" name="email">
              <Input />
            </Form.Item>
            <Form.Item label="Phone" name="phone_number">
              <Input />
            </Form.Item>
            <Form.Item label="City" name="city">
              <Input />
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 6, span: 14 }}>
              <Space>
                <Button className="edit-button" type="primary" htmlType="submit" onClick={handleFormSubmit}>
                  Save Changes
                </Button>
                <Button className="edit-button" onClick={handleCancel}>
                  Cancel
                </Button>
              </Space>
            </Form.Item>
          </Form>
        ) : (
          <>
            <Card type="inner" title="Name" className="card">
              <p>{fullname}</p>
            </Card>
            <Card type="inner" title="Email" className="card">
              <p>{email}</p>
            </Card>
            <Card type="inner" title="Phone" className="card">
              <p>{phone_number}</p>
            </Card>
            <Card type="inner" title="City" className="card">
              <p>{city}</p>
            </Card>
            <Card type="inner" title="Total Comments" className="card">
              <p>{commentsNumber}</p>
            </Card>
            <Card type="inner" title="Total Favorites" className="card">
              <p>{favoritesNumber}</p>
            </Card>
            <Card type="inner" title="Total Auctions Created" className="card">
              <p>{auctionsNumber}</p>
            </Card>
            {isCurrentUser && (
              <div className="edit-button-container">
                <Button type="primary" className="edit-button" onClick={handleEditClick}>
                  Edit Your Information
                </Button>
              </div>
            )}
          </>
        )}
      </Card>
    </>
  );
};

export default UserProfileContent;
