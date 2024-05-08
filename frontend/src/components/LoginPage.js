import React, { useState } from "react";
import "../design/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    // Add logic to handle login submission
  };

  return (
    <div className="container">
      <div className = "upperHeader">
      <h2 className="header">Login</h2>
      </div>
      <h2 className="header">Login</h2>
      <form onSubmit={handleSubmit} className="form">
        <div className="inputGroup">
          <label className="label">Email:</label>
          <input
            type="email"
            value={email}
            onChange={handleEmailChange}
            required
            className="input"
          />
        </div>
        <div className="inputGroup">
          <label className="label">Password:</label>
          <input
            type="password"
            value={password}
            onChange={handlePasswordChange}
            required
            className="input"
          />
        </div>
        <button type="submit" className="button">
          Login
        </button>
      </form>
    </div>
  );
};

export default LoginPage;
