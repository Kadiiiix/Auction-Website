import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Navigate } from "react-router-dom";
import { Form, Input, Select, DatePicker, InputNumber, Checkbox, Button, notification } from 'antd';
import sedan from "../design/sedan.png";
import "../design/CreateAuction.css"
const { Option } = Select;
const { TextArea } = Input;

const CreateAuction = ({userId}) => {

  const [username, setUsername] = useState("");
  const [redirectToAuction, setRedirectToAuction] = useState(false);
  const [auctionId, setAuctionId] = useState("");

  const categories = [
    { id: 1, name: "Vehicles", image: sedan },
    { id: 2, name: "Real Estate", image: sedan },
    { id: 3, name: "Electronics", image: sedan },
    { id: 4, name: "Antiques", image: sedan },
    { id: 5, name: "Artwork", image: sedan },
    { id: 6, name: "Home Appliances", image: sedan },
    { id: 7, name: "Clothing and Footwear", image: sedan },
    { id: 8, name: "Sports Equipment", image: sedan },
    { id: 9, name: "Collectibles", image: sedan },
    { id: 10, name: "Decorative Items", image: sedan },
    { id: 11, name: "Books and Magazines", image: sedan },
    { id: 12, name: "Hobbies and Crafts", image: sedan },
    { id: 13, name: "Health and Beauty", image: sedan },
    { id: 14, name: "Tools and Equipment", image: sedan },
    { id: 15, name: "Musical Instruments", image: sedan },
    { id: 16, name: "Art Supplies", image: sedan },
    { id: 17, name: "Home Furniture", image: sedan },
    { id: 18, name: "Technical Equipment", image: sedan },
    { id: 19, name: "Music & Movies", image: sedan },
    { id: 20, name: "Tools & DIY", image: sedan },
    { id: 21, name: "Computer Accessories", image: sedan },
    { id: 22, name: "Video Games & Consoles", image: sedan },
    { id: 23, name: "Crafts", image: sedan },
    { id: 24, name: "Spare Parts and Accessories", image: sedan },
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
      const response = await axios.post("http://localhost:4000/api/auctions", {...formData, createdBy: userId});
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
  
      // Handle error, show error message, etc.
    }
  };
  

  return (
    <div className='full-container'>
      <div className='form-container'>
      <h2 className='header'>Hello, {username}! Start your own auction! <br/>Please fill in information:</h2>
      {redirectToAuction ? (
          <Navigate to={`/auction/${auctionId}`} />
        ) : (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 17 }}
      layout="horizontal"
      style={{  }}
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
        <DatePicker />
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
            required: true,
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

      <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
        <Button type="primary" htmlType="submit" className='button'>
          Create Auction
        </Button>
      </Form.Item>
    </Form>
    )}
    </div>
    </div>
  );
};

export default CreateAuction;
