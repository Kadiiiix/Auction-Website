import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockOutlined, UserOutlined, MailOutlined } from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import "../design/RegisterPage.css"; // Import the CSS file

const RegisterPage = () => {
  const [redirectToHome, setRedirectToHome] = useState(false);


  const handleSubmit = async (values) => {
    const { email, username, password } = values;
    try {
      const response = await fetch("http://localhost:4000/api/users/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, username, password }),
      });
      const data = await response.json();
      console.log("Response:", response);
      if (response.ok) {
        // If registration successful, set redirectToHome to true
        setRedirectToHome(true);
        // Display success notification
        notification.success({
          message: 'Registration Successful',
          description: 'You have successfully registered.',
        });
      } else {
        // Handle error (e.g., display error message)
        // Display error notification
        notification.error({
          message: 'Registration Failed',
          description: 'Registration failed. Please try again later.',
        });
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
      // Display error notification
      notification.error({
        message: 'Error',
        description: 'An error occurred while trying to register. Please try again later.',
      });
    }
  };
  

  // Redirect to home page if redirectToHome is true
  if (redirectToHome) {
    return <Navigate to="/" />;
  }

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
        <h2 className="header">Register</h2>
        <Form.Item
          name="username"
          rules={[
            {
              required: true,
              message: 'Please input your username!',
            },
          ]}
        >
          <Input prefix={<UserOutlined className="site-form-item-icon" />} placeholder="Username" />
        </Form.Item>
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
        <Form.Item
          name="password"
          rules={[
            {
              required: true,
              message: 'Please input your Password!',
            },
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Password"
          />
        </Form.Item>
        <Form.Item
          name="confirmPassword"
          rules={[
            {
              required: true,
              message: 'Please confirm your password!',
            },
            ({ getFieldValue }) => ({
              validator(_, value) {
                if (!value || getFieldValue('password') === value) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('The two passwords that you entered do not match!'));
              },
            }),
          ]}
        >
          <Input.Password
            prefix={<LockOutlined className="site-form-item-icon" />}
            placeholder="Confirm Password"
          />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Register
          </Button>
          Already have an account? <a href="http://localhost:3000/login">Log in!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default RegisterPage;
