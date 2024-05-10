import React from 'react';
import axios from 'axios';
import { Form, Input, Select, DatePicker, InputNumber, Checkbox, Button } from 'antd';

const { Option } = Select;
const { TextArea } = Input;

const CreateAuction = () => {
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

  const handleSubmit = async (formData) => {
    console.log(formData);
    try {
      const response = await axios.post("http://localhost:4000/api/auctions", formData);
      console.log("Auction created:", response.data);
      // Handle success, redirect, or show a success message
    } catch (error) {
      console.error("Error creating auction:", error);
      // Handle error, show error message, etc.
    }
  };

  return (
    <Form
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      style={{ maxWidth: 1000 }}
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
        label=""
        name="allowInstantPurchase"
        valuePropName="checked"
        initialValue={false}
      >
        <Checkbox>Allow Instant Purchase</Checkbox>
      </Form.Item>

      <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
        <Button type="primary" htmlType="submit">
          Create Auction
        </Button>
      </Form.Item>
    </Form>
  );
};

export default CreateAuction;
