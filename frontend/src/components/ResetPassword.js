import React from 'react';
import { Button, Input, Form, notification } from 'antd';
import { useParams } from 'react-router-dom';
import axios from 'axios';
import "../design/LoginPage.css";

// Password validation function
function validatePassword(password) {
  const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
  return passwordRegex.test(password);
}

const ResetPassword = () => {
  const { token } = useParams(); // Destructure token from useParams
  console.log("token", token);

  const handleResetPassword = async (values) => {
    const { newPassword } = values;
    console.log("newPassword", newPassword);

    try {
      const response = await fetch(`http://localhost:4000/api/pass/reset-password/${token}`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ password: newPassword }),
      });
      
      if (response.ok) {
        notification.success({
          message: 'Password Changed.',
          description: 'You have changed your password.'
        });
      } else {
        const errorData = await response.json();
        notification.error({
          message: 'Failed to Reset Password',
          description: errorData.message || 'Error. Please try again later.'
        });
      }
    } catch (error) {
      console.error('Password reset failed:', error.message);
      notification.error({
        message: 'Password reset failed',
        description: 'Error. Please try again later.'
      });
    }
  };

  return (
    <div className="container">
      <Form
        name="reset_password"
        className="reset-form"
        initialValues={{
          remember: true,
        }}
        onFinish={handleResetPassword}
      >
        <h2 className="header">Reset Password</h2>
        <Form.Item
          label="New Password"
          name="newPassword"
          rules={[
            {
              required: true,
              message: 'Please input your new password!',
            },
            {
              validator: (_, value) => {
                if (validatePassword(value)) {
                  return Promise.resolve();
                }
                return Promise.reject(new Error('Password must be at least 8 characters long and include at least one uppercase letter, one number, and one special character.'));
              },
            },
          ]}
        >
          <Input.Password />
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 8, span: 16 }}>
          <Button type="primary" htmlType="submit" className="login-form-button">
            Reset Password
          </Button>
        </Form.Item>
      </Form>
    </div>
  );
};

export default ResetPassword;
