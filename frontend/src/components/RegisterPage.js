import React, { useState } from "react";
import "../design/RegisterPage.css"; // Import the CSS file

const RegisterPage = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleUsernameChange = (e) => {
    setUsername(e.target.value);
  };

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle registration submission
  };

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
