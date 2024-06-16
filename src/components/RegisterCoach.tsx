// src/components/SendCoachEmailOTP.tsx
import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
// import "../styles/SendCoachEmailOTP.css";

const SEND_COACH_EMAIL_OTP = gql`
  mutation SendCoachEmailOTP($input: CoachOTPInput!) {
    sendCoachEmailOTP(input: $input) {
      message
      status
    }
  }
`;

const SendCoachEmailOTP: React.FC = () => {
  const [email, setEmail] = useState("");
  const [passkey, setPasskey] = useState("");
  const [sendOTP, { data, loading, error }] = useMutation(SEND_COACH_EMAIL_OTP);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Prevent the default form submission
    console.log("Email:", email);
    console.log("Passkey:", passkey);

    try {
      const response = await sendOTP({
        variables: {
          input: {
            OTPInputs: {
              purpose: "REGISTER",
              email: email,
            },
            passkey: passkey,
          },
        },
      });
      console.log("Response:", response.data);
    } catch (err) {
      console.error("Error:", err);
    }
  };

  return (
    <div
      className="send-otp-container"
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

          {/* Send OTP Form */}
          <form className="send-otp-form" onSubmit={handleSubmit}>
            {/* Email Input */}
            <div className="input-group">
              <input
                type="email"
                id="email"
                className="input-field"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <label htmlFor="email" className="input-label">
                Email
              </label>
            </div>

            {/* Passkey Input */}
            <div className="input-group">
              <input
                type="text"
                id="passkey"
                className="input-field"
                placeholder="Passkey"
                value={passkey}
                onChange={(e) => setPasskey(e.target.value)}
              />
              <label htmlFor="passkey" className="input-label">
                Passkey
              </label>
            </div>

            {/* Submit Button */}
            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? "Sending..." : "Send OTP"}
            </button>
          </form>

          {error && <p className="error-message">{error.message}</p>}
          {data && <p className="success-message">{data.sendCoachEmailOTP.message}</p>}
        </div>
      </div>
    </div>
  );
};

export default SendCoachEmailOTP;
