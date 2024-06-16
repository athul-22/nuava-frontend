// src/components/Login.tsx
import React from "react";
import "../styles/Login.css";

const Login: React.FC = () => {
  return (
    <div
      className="login-container"
      style={{ backgroundImage: "url('your-background-image-url')" }}
    >
      {/* Left Column */}
      <div className="left-column"></div>
      {/* Right Column */}
      <div className="right-column mobile-container">
        <div className="form-container">
          {/* Welcome Text */}
          <div className="welcome-text">
            <p className="welcome-subtitle">Welcome to</p>
            <p className="welcome-title">Nuava Sports</p>
          </div>

          {/* Login Form */}
          <form className="login-form">
            {/* Username Input */}
            <div className="input-group">
              <input
                type="text"
                id="username"
                className="input-field"
                placeholder="Username"
              />
              <label htmlFor="username" className="input-label">
                Username
              </label>
            </div>

            {/* Password Input */}
            <div className="input-group">
              <input
                type="password"
                id="password"
                className="input-field"
                placeholder="Password"
              />
              <label htmlFor="password" className="input-label">
                Password
              </label>
            </div>

            <div className="forgot-password">
              <span>Forgot password?</span>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button">
              Login
            </button>

            {/* New Account Link */}
            <div className="new-account">
              New here?{" "}
              <span className="create-account">Create an account</span>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default Login;
