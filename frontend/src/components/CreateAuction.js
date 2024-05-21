import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, InputNumber, Checkbox, Button, notification } from 'antd';
import "../design/CreateAuction.css";
const { Option } = Select;
const { TextArea } = Input;

const CreateAuction = ({ userId }) => {
  const [username, setUsername] = useState("");
  const [redirectToAuction, setRedirectToAuction] = useState(false);
  const [auctionId, setAuctionId] = useState("");
  const [imageUrl, setImageUrl] = useState(""); // State to hold image URL
  const [uploading, setUploading] = useState(false); // State to track image upload status

  const categories = [
    { id: 1, name: "Antiques" },
    { id: 2, name: "Artwork" },
    { id: 3, name: "Books & Movies" },
    { id: 4, name: "Clothes" },
    { id: 5, name: "Collectibles" },
    { id: 6, name: "Decorative Items" },
    { id: 7, name: "Electronics" },
    { id: 8, name: "Footwear" },
    { id: 9, name: "Furniture" },
    { id: 10, name: "Health and Beauty" },
    { id: 11, name: "Jewelry" },
    { id: 12, name: "Misceellaneous" },
    { id: 13, name: "Musical Instruments" },
    { id: 14, name: "Outdoor Gear" },
    { id: 15, name: "Pet Supplies" },
    { id: 16, name: "Tools & Equipment" },
    { id: 17, name: "Vehicles" },
    { id: 18, name: "Video Games" },
  ];

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}`
        );
        setUsername(response.data);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchUser();
  }, [userId]);

  const handleSubmit = async (formData) => {
    try {
      formData.imageUrl = imageUrl;
      // Include imageUrl in the form data
      const response = await axios.post("http://localhost:4000/api/auctions", { ...formData, createdBy: userId, imageUrl });
      console.log("Auction created:", response.data);

      // Display success notification
      notification.success({
        message: 'Auction Created',
        description: 'The auction has been created successfully.',
      });

      console.log(response.data.auction._id)
      setRedirectToAuction(true);
      setAuctionId(response.data.auction._id);
  
      // Handle success, redirect, or show a success message
    } catch (error) {
      console.error("Error creating auction:", error);

      // Display error notification
      notification.error({
        message: 'Error',
        description: 'Failed to create the auction. Please try again later.',
      });
    }
  };

  // Handle image upload
  const handleImageUpload = async (event) => {
    const file = event.target.files[0];
    const formData = new FormData();
    formData.append('image', file);
    setUploading(true);

    try {
      const response = await axios.post('http://localhost:4000/api/upload', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      // Update imageUrl state with the received URL
      setImageUrl(response.data.imageUrl);
      setUploading(false);
    } catch (error) {
      console.error('Error uploading image:', error);
    }
  };

  return (
    <div className='full-container'>
      <div className='form-container'>
        <h2 className='header'>Hello, {username.username}! Start your own auction! <br />Please fill in information:</h2>
        {redirectToAuction ? (
          <Navigate to={`/auction/${auctionId}`} />
        ) : (
          <Form
            labelCol={{ span: 4 }}
            wrapperCol={{ span: 17 }}
            layout="horizontal"
            onFinish={handleSubmit}
          >
            <Form.Item
              label="Auction Name"
              name="name"
              rules={[
                {
                  required: true,
                  message: 'Please enter Auction Name!',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Condition"
              name="condition"
              rules={[
                {
                  required: true,
                  message: 'Please select condition.',
                },
              ]}
            >
              <Select placeholder="Select condition">
                <Option value="new">New</Option>
                <Option value="used">Used</Option>
              </Select>
            </Form.Item>

            <Form.Item
              label="Category"
              name="category"
              rules={[
                {
                  required: true,
                  message: 'Please select category.',
                },
              ]}
            >
              <Select placeholder="Select the category">
                {categories.map(category => (
                  <Option key={category.id} value={category.name}>{category.name}</Option>
                ))}
              </Select>
            </Form.Item>

            <Form.Item
              label="Closing Date"
              name="closingDate"
              rules={[
                {
                  required: true,
                  message: 'Please select closing date.',
                },
              ]}
            >
              <DatePicker showTime format="YYYY-MM-DD HH:mm:ss" />
            </Form.Item>

            <Form.Item
              label="Minimal Bid"
              name="startingBid"
              rules={[
                {
                  required: true,
                  message: 'Please enter starting bid.',
                },
              ]}
            >
              <InputNumber />
            </Form.Item>

            <Form.Item
              label="Description"
              name="description"
              rules={[
                {
                  required: false,
                  message: 'Please enter description.',
                },
              ]}
            >
              <TextArea rows={4} />
            </Form.Item>

            <Form.Item
              label="Location"
              name="location"
              rules={[
                {
                  required: true,
                  message: 'Please enter location.',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Age"
              name="age"
              rules={[
                {
                  required: true,
                  message: 'Please enter age of the product.',
                },
              ]}
            >
              <Input />
            </Form.Item>

            <Form.Item
              label="Allow Instant Purchase"
              name="allowInstantPurchase"
              valuePropName="checked"
              initialValue={false}
            >
              <Checkbox></Checkbox>
            </Form.Item>

            <Form.Item
              label="Image"
              name="image"
              rules={[
                {
                  required: false,
                  message: 'Please upload an image.',
                },
              ]}
            >
              <input type="file" onChange={handleImageUpload} />
            </Form.Item>

            <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
              <Button type="primary" htmlType="submit" className='button' disabled={uploading || !imageUrl}>
                {uploading ? 'Uploading Image ...' : 'Create Auction'}
              </Button>
            </Form.Item>
          </Form>
        )}
      </div>
    </div>
  );
};

export default CreateAuction;
