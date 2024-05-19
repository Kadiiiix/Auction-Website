import React, { useState } from "react";
import { MailOutlined} from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import "../design/LoginPage.css";

const ForgotPassword = () => {

  const handleSubmit = async (values) => {
    const { email } = values; // Destructure values to get email and password
    try {
      const response = await fetch("http://localhost:4000/api/pass/forgot-password", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email }),
      });
      if (response.ok) {
        // Display success notification
        notification.success({
          message: 'Email Sent.',
          description: 'Check your email for password recovery link.',
        });
      } else {
        // Handle error (e.g., display error message)
        // Display error notification
        notification.error({
          message: 'Error Sending Email',
          description: 'Incorrect email. Please try again.',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
      // Display error notification
      notification.error({
        message: 'Error',
        description: 'An error occurred while trying to log in. Please try again later.',
      });
    }
  };
  

  return (
    <div className="container">
      <Form
        name="normal_login"
        className="login-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleSubmit}
      >
        <h2 className="header">Forgot Password</h2>
        <Form.Item
          name="email"
          rules={[
            {
              required: true,
              message: 'Please input your email!',
            },
          ]}
        >
          <Input prefix={<MailOutlined className="site-form-item-icon" />} placeholder="Email" />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Recover Password
          </Button>
          Or <a href="http://localhost:3000/login">Back to Log In</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ForgotPassword;
