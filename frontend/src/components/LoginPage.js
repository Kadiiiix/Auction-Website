import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import "../design/LoginPage.css";

const LoginPage = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [redirectToHome, setRedirectToHome] = useState(false);
  const handleEmailChange = (e) => {
    setEmail(e.target.value);
  };

  const handlePasswordChange = (e) => {
    setPassword(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await fetch("http://localhost:4000/api/users/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
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
