import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import "./SendCoachEmailOTP.css";
import { Notyf } from 'notyf';
import 'notyf/notyf.min.css';

const SEND_COACH_EMAIL_OTP = gql`
  mutation SendCoachEmailOTP($input: CoachOTPInput!) {
    sendCoachEmailOTP(input: $input) {
      status
      message
    }
  }
`;

const VERIFY_COACH_EMAIL_OTP = gql`
  mutation VerifyCoachEmailOTP($input: VerifyInput!) {
    verifyCoachEmailOTP(input: $input) {
      message
      status
      token
    }
  }
`;

const SendCoachEmailOTP: React.FC = () => {
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
  const [passkey, setPasskey] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(Array(6).fill(""));
  const [sendOTP, { loading: loadingSendOTP, error: errorSendOTP }] = useMutation(SEND_COACH_EMAIL_OTP);
  const [verifyOTP, { loading: loadingVerifyOTP, error: errorVerifyOTP }] = useMutation(VERIFY_COACH_EMAIL_OTP);
  const [showOTPForm, setShowOTPForm] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!email || !passkey) {
      notyf.error('Please fill all fields!');
      return;
    }

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

      if (response.data?.sendCoachEmailOTP.status) {
        notyf.success('Email sent successfully');
        setShowOTPForm(true);
      } else {
        notyf.error(response.data?.sendCoachEmailOTP.message || 'Error occurred');
      }

    } catch (err) {
      console.error("Error:", err);
      notyf.error('An error occurred.');
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
    const otp = verificationCode.join('');

    if (otp.length !== 6) {
      notyf.error('Please enter the full OTP');
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

      if (response.data?.verifyCoachEmailOTP.status) {
        notyf.success('Email verified successfully');
        localStorage.setItem('tempToken', response.data.verifyCoachEmailOTP.token);
        localStorage.setItem('email', email)
        window.location.replace("http://localhost:3001/success-coach-email");
      } else {
        notyf.error(response.data?.verifyCoachEmailOTP.message || 'Error occurred');
      }

    } catch (err) {
      console.error("Error:", err);
      notyf.error('An error occurred.');
    }
  };

  return (
    <div className="send-otp-container">
      <div className="left-column"></div>
      <div className="right-column">
        <div className="welcome-container">
          <div className="welcome-text">
            <p className="welcome-subtitle">Welcome to</p>
            <p className="welcome-title">Nuava Sports</p>
          </div>

          <div className={`form-container ${isMobile ? 'mobile-form' : 'desktop-form'} ${showOTPForm ? 'otp-shown' : ''}`}>
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
                  <label htmlFor="email" className="input-label">
                    Email
                  </label>
                </div>

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

                <button type="submit" className="submit-button" disabled={loadingSendOTP}>
                  {loadingSendOTP ? "Sending..." : "Send OTP"}
                </button>
              </form>
            ) : (
              <div className="otp-animation-container">
                <div className="otp-info">
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

export default SendCoachEmailOTP;
