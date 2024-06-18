import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import { Notyf } from "notyf";
import "../styles/Login.css";
import "notyf/notyf.min.css";

const LOGIN_COACH = gql`
  mutation LoginCoach($input: LoginCoachInput!) {
    loginCoach(input: $input) {
      message
      status
      token
    }
  }
`;

const Login: React.FC = () => {
  const notyf = new Notyf({
    duration: 2000,
    position: {
      x: 'right',
      y: 'top',
    },
    types: [
      {
        type: 'warning',
        background: 'orange',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'warning'
        }
      },
      {
        type: 'success',
        background: 'green',
        icon: {
          className: 'material-icons',
          tagName: 'i',
          text: 'check'
        }
      },
      {
        type: 'error',
        background: 'red',
        duration: 2000,
        dismissible: false
      }
    ]
  });

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [loginCoach, { loading, error }] = useMutation(LOGIN_COACH);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !password) {
      notyf.error('Please fill all fields!');
      return;
    }

    try {
      const response = await loginCoach({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });

      if (response.data?.loginCoach.status) {
        localStorage.setItem("token", response.data.loginCoach.token);
        notyf.success('Login successful!');
        window.location.href = "/dashboard"; 
      } else {
        notyf.error(response.data?.loginCoach.message || 'Error occurred during login');
      }
    } catch (err) {
      console.error("Error:", err);
      notyf.error('An error occurred during login.');
    }
  };

  return (
    <div
      className="login-container"
      style={{ backgroundImage: "url('your-background-image-url')" }}
    >
      <div className="left-column"></div>
      <div className={`right-column ${isMobile ? 'mobile-container' : ''}`}>
        <div className="welcome-container">
          <div className="welcome-text">
            <p className="welcome-subtitle">Welcome to</p>
            <p className="welcome-title">Nuava Sports</p>
          </div>
          <div className="form-container">
            <form className="login-form" onSubmit={handleLogin}>
              <div className="input-group">
                <input
                  type="text"
                  id="username"
                  className="input-field"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <label htmlFor="username" className="input-label">
                  Email
                </label>
              </div>
              <div className="input-group">
                <input
                  type="password"
                  id="password"
                  className="input-field"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
                <label htmlFor="password" className="input-label">
                  Password
                </label>
              </div>
              <div className="forgot-password">
                <span>Forgot password?</span>
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
              <div className="new-account">
                New here?{" "}
                <span className="create-account">Create an account</span>
              </div>
              
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
