import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import "./SendStudentEmailOTP.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import grid from "../../assets/GRID.svg";

const REGISTER_STUDENT = gql`
  mutation RegisterStudent($input: OtpInput!) {
    sendStudentEmailOTP(input: $input) {
      message
      status
    }
  }
`;

const VERIFY_STUDENT_EMAIL_OTP = gql`
  mutation VerifyEmailOTP($input: VerifyInput!) {
    verifyEmailOTP(input: $input) {
      message
      status
      token
    }
  }
`;

const SendStudentEmailOTP: React.FC = () => {
  const notyf = new Notyf({
    duration: 2000,
    position: {
      x: "right",
      y: "top",
    },
    types: [
      {
        type: "warning",
        background: "orange",
        icon: {
          className: "material-icons",
          tagName: "i",
          text: "warning",
        },
      },
      {
        type: "success",
        background: "green",
        icon: {
          className: "material-icons",
          tagName: "i",
          text: "check",
        },
      },
      {
        type: "error",
        background: "red",
        duration: 2000,
        dismissible: false,
      },
    ],
  });

  

  const [email, setEmail] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [sendOTP, { loading: loadingSendOTP, error: errorSendOTP }] = useMutation(REGISTER_STUDENT);
  const [verifyOTP, { loading: loadingVerifyOTP, error: errorVerifyOTP }] = useMutation(VERIFY_STUDENT_EMAIL_OTP);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email) {
      notyf.error("Please enter your email!");
      return;
    }

    try {
      const response = await sendOTP({
        variables: {
          input: {
            email: email,
            purpose: "REGISTER",
          },
        },
      });

      if (response.data?.sendStudentEmailOTP.status) {
        notyf.success("OTP sent successfully");
        setShowOTPForm(true);
      } else {
        notyf.error(response.data?.sendStudentEmailOTP.message || "Error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      notyf.error("An error occurred.");
    }
  };
  

  const handleVerificationCodeChange = (e: React.ChangeEvent<HTMLInputElement>, index: number) => {
    const newCode = [...verificationCode];
    newCode[index] = e.target.value;
    setVerificationCode(newCode);

    if (index < verificationCode.length - 1 && e.target.value !== "") {
      const nextInput = document.getElementById(`otp-input-${index + 1}`);
      if (nextInput) {
        nextInput.focus();
      }
    }
  };

  const handleVerifyOTP = async () => {
    const otp = verificationCode.join("");

    if (otp.length !== 6) {
      notyf.error("Please enter the full OTP");
      return;
    }

    try {
      const response = await verifyOTP({
        variables: {
          input: {
            email: email,
            otp: otp,
          },
        },
      });

      if (response.data?.verifyEmailOTP.status) {
        notyf.success("Email verified successfully");
        localStorage.setItem("tempToken", response.data.verifyEmailOTP.token);
        localStorage.setItem("email", email);
        window.location.href = "/student/success";
      } else {
        notyf.error(response.data?.verifyEmailOTP.message || "Error occurred");
      }
    } catch (err) {
      console.error("Error:", err);
      notyf.error("An error occurred.");
    }
  };
  return (
    <div className="send-otp-container" style={{ backgroundColor: "white" }}>
      <div
        className="absolute inset-0 bg-center grid-pattern"
        style={{
          backgroundImage: `url(${grid})`,
          maskImage: "linear-gradient(180deg, white, rgba(255, 255, 255, 0))",
        }}
      ></div>
      <div className="left-column"></div>
      <div className="right-column">
        <div className="welcome-container">
          <div className="welcome-text">
            <p className="welcome-subtitle">Welcome to</p>
            <p className="welcome-title">Nuava Sports</p>
          </div>

          <div className={`form-container ${isMobile ? "mobile-form" : "desktop-form"} ${showOTPForm ? "otp-shown" : ""}`}>
            {!showOTPForm ? (
              <form className="send-otp-form" onSubmit={handleSubmit}>
                <div className="input-group">
                  <input
                    type="email"
                    id="email"
                    className="input-field"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>

                <button type="submit" className="submit-button" disabled={loadingSendOTP}>
                  {loadingSendOTP ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <div className="otp-animation-container">
                <div className="otp-info">
                  <p style={{ color: 'green', fontSize: '18px', marginBottom: '-30px', textAlign: 'left' }}>A 6 digit OTP sent to {email}</p>
                </div>
                <div className="verification-code-container">
                  {verificationCode.map((_, index) => (
                    <input
                      key={index}
                      id={`otp-input-${index}`}
                      type="text"
                      className="verification-code-input"
                      maxLength={1}
                      value={verificationCode[index]}
                      onChange={(e) => handleVerificationCodeChange(e, index)}
                    />
                  ))}
                </div>
                <button className="submit-button" onClick={handleVerifyOTP} disabled={loadingVerifyOTP}>
                  {loadingVerifyOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {(errorSendOTP || errorVerifyOTP) && isMobile && (
              <div className="error-message">
                <p className="error-message-text">{errorSendOTP?.message || errorVerifyOTP?.message}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendStudentEmailOTP;
