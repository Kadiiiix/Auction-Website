import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import { LockOutlined, MailOutlined} from '@ant-design/icons';
import { Button, Form, Input, notification } from 'antd';
import "../design/LoginPage.css";

const LoginPage = ({ setLoggedIn }) => {
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleSubmit = async (values) => {
    const { email, password } = values; // Destructure values to get email and password
    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      console.log(data);
      if (response.ok) {
        // If login successful, set redirectToHome to true
        setRedirectToHome(true);
        localStorage.setItem("token", data.token);
        localStorage.setItem("userId", data.userId);
        setLoggedIn(true);
        // Display success notification
        notification.success({
          message: 'Login Successful',
          description: 'You have successfully logged in.',
        });
      } else {
        // Handle error (e.g., display error message)
        // Display error notification
        notification.error({
          message: 'Login Failed',
          description: 'Incorrect email or password. Please try again.',
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
  
  // Redirect to home page if redirectToHome is true
  if (redirectToHome) {
    return <Navigate to="/items" />;
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
        <h2 className="header">Login</h2>
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
        <Form.Item>
          <a className="login-form-forgot" href="">
            Forgot password
          </a>
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Log in
          </Button>
          Or <a href="http://localhost:3000/register">Register now!</a>
        </Form.Item>
      </Form>
    </div>
  );
};

export default LoginPage;
