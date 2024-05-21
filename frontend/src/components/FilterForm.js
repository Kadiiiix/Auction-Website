import React, { useState } from "react";
import axios from "axios";
import { Button, Checkbox, DatePicker, Form, Input, Select } from "antd";
import "antd/dist/antd.css"; // Import Ant Design styles

const { RangePicker } = DatePicker;

const FilterForm = () => {
  const [form] = Form.useForm();
  const [loading, setLoading] = useState(false);

  const handleSubmit = async () => {
    try {
      setLoading(true);
      const values = await form.validateFields();
      const response = await axios.post("/api/auctions/filter", values);
      console.log("Filtered auctions:", response.data);
      // Update UI to display filtered auctions
    } catch (error) {
      console.error("Error filtering auctions:", error);
      // Handle error: display error message to user
    } finally {
      setLoading(false);
    }
  };

  return (
    <Form
      form={form}
      labelCol={{ span: 4 }}
      wrapperCol={{ span: 14 }}
      layout="horizontal"
      onFinish={handleSubmit}
      initialValues={{
        instantPurchase: false,
      }}
    >
      <Form.Item label="Location" name="location">
        <Input />
      </Form.Item>
      <Form.Item label="Start Date - End Date" name="dateRange">
        <RangePicker />
      </Form.Item>
      <Form.Item label="Max Price" name="maxPrice">
        <Input type="number" />
      </Form.Item>
      <Form.Item
        label="Instant Purchase"
        name="instantPurchase"
        valuePropName="checked"
      >
        <Checkbox />
      </Form.Item>
      <Form.Item label="Condition" name="condition">
        <Select>
          <Select.Option value="new">New</Select.Option>
          <Select.Option value="used">Used</Select.Option>
        </Select>
      </Form.Item>
      <Form.Item label="Category" name="category">
        <Select>{/* Add options for categories */}</Select>
      </Form.Item>
      <Form.Item wrapperCol={{ offset: 4, span: 14 }}>
        <Button type="primary" htmlType="submit" loading={loading}>
          Filter
        </Button>
      </Form.Item>
    </Form>
  );
};

export default FilterForm;
