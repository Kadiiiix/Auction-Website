import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../design/RegisterPage.css"; // Import the CSS file

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

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
        // If login successful, set redirectToHome to true
        setRedirectToHome(true);
      } else {
        // Handle error (e.g., display error message)
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle error
    }
  };

  // Redirect to home page if redirectToHome is true
  if (redirectToHome) {
    return <Navigate to="/" />;
  }

  return (
    <div className="register-container">
      <h2 className="register-header">Register</h2>
      <form onSubmit={handleSubmit} className="register-form">
        <div>
          <label className="register-label">Username:</label>
          <input
            type="text"
            value={username}
            onChange={handleUsernameChange}
            required
            className="register-input"
          />
        </div>
        <div>
          <label className="register-label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="register-input"
          />
        </div>
        <div>
          <label className="register-label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="register-input"
          />
        </div>
        <button type="submit" className="register-button">
          Register
        </button>
      </form>
    </div>
  );
};

export default RegisterPage;
