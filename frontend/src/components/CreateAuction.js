import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, InputNumber, Checkbox, Button, notification } from 'antd';
import "../design/CreateAuction.css"
const { Option } = Select;
const { TextArea } = Input;

const CreateAuction = ({userId}) => {

  const [username, setUsername] = useState("");

  const categories = [
    'decoration',
    'electronics',
    'clothes and shoes',
    'vehicle',
    'car parts',
    'tech',
    'sports',
    'other'
  ];

  useEffect(() => {
    const fetchAuction = async () => {
      try {
        const response = await axios.get(
          `http://localhost:4000/api/users/${userId}`
        );
        setUsername(response.data);
      } catch (error) {
        console.error("Error fetching an auction");
      }
    };
    fetchAuction();
  }, [userId]);

  
  const handleSubmit = async (formData) => {
    try {
      const response = await axios.post("http://localhost:4000/api/auctions", formData);
      console.log("Auction created:", response.data);
  
      // Display success notification
      notification.success({
        message: 'Auction Created',
        description: 'The auction has been created successfully.',
      });
  
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
            <Option key={category} value={category}>{category}</Option>
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
    </div>
    </div>
  );
};

export default CreateAuction;
