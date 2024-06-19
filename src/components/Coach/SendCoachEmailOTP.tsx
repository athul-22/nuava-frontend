import React, { useState, useEffect } from "react";
import { gql, useMutation } from "@apollo/client";
import "./SendCoachEmailOTP.css";
import { Notyf } from "notyf";
import "notyf/notyf.min.css";
import grid from "../../assets/GRID.svg";

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
  const [passkey, setPasskey] = useState("");
  const [verificationCode, setVerificationCode] = useState<string[]>(
    Array(6).fill("")
  );
  const [sendOTP, { loading: loadingSendOTP, error: errorSendOTP }] =
    useMutation(SEND_COACH_EMAIL_OTP);
  const [verifyOTP, { loading: loadingVerifyOTP, error: errorVerifyOTP }] =
    useMutation(VERIFY_COACH_EMAIL_OTP);
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

    if (!email || !passkey) {
      notyf.error("Please fill all fields!");
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
        notyf.success("Email sent successfully");
        setShowOTPForm(true);
      } else {
        notyf.error(
          response.data?.sendCoachEmailOTP.message || "Error occurred"
        );
      }
    } catch (err) {
      console.error("Error:", err);
      notyf.error("An error occurred.");
    }
  };

  const handleVerificationCodeChange = (
    e: React.ChangeEvent<HTMLInputElement>,
    index: number
  ) => {
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

      if (response.data?.verifyCoachEmailOTP.status) {
        notyf.success("Email verified successfully");
        localStorage.setItem(
          "tempToken",
          response.data.verifyCoachEmailOTP.token
        );
        localStorage.setItem("email", email);
        window.location.href = "/coach/success";
      } else {
        notyf.error(
          response.data?.verifyCoachEmailOTP.message || "Error occurred"
        );
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
            <p className="welcome-subtitle">Welcome to </p>
            <p className="welcome-title">Nuava Sports</p>
          </div>

          <div
            className={`form-container ${
              isMobile ? "mobile-form" : "desktop-form"
            } ${showOTPForm ? "otp-shown" : ""}`}
          >
            {!showOTPForm ? (
             <form className="send-otp-form" onSubmit={handleSubmit}>
             <div className="input-group">
               <div className="input-icon">
                 {/* <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth="1.5"
                   stroke="currentColor"
                   className="size-6 icon"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M21.75 6.75v10.5a2.25 2.25 0 0 1-2.25 2.25h-15a2.25 2.25 0 0 1-2.25-2.25V6.75m19.5 0A2.25 2.25 0 0 0 19.5 4.5h-15a2.25 2.25 0 0 0-2.25 2.25m19.5 0v.243a2.25 2.25 0 0 1-1.07 1.916l-7.5 4.615a2.25 2.25 0 0 1-2.36 0L3.32 8.91a2.25 2.25 0 0 1-1.07-1.916V6.75"
                   />
                 </svg> */}
                 <input
                   type="email"
                   id="email"
                   className="input-field"
                   placeholder="Email"
                   value={email}
                   onChange={(e) => setEmail(e.target.value)}
                 />
               </div>
             </div>
           
             <div className="input-group">
               <div className="input-icon">
                 {/* <svg
                   xmlns="http://www.w3.org/2000/svg"
                   fill="none"
                   viewBox="0 0 24 24"
                   strokeWidth="1.5"
                   stroke="currentColor"
                   className="size-6 icon"
                 >
                   <path
                     strokeLinecap="round"
                     strokeLinejoin="round"
                     d="M15.75 5.25a3 3 0 0 1 3 3m3 0a6 6 0 0 1-7.029 5.912c-.563-.097-1.159.026-1.563.43L10.5 17.25H8.25v2.25H6v2.25H2.25v-2.818c0-.597.237-1.17.659-1.591l6.499-6.499c.404-.404.527-1 .43-1.563A6 6 0 1 1 21.75 8.25Z"
                   />
                 </svg> */}
                 <input
                   type="text"
                   id="passkey"
                   className="input-field"
                   placeholder="Passkey"
                   value={passkey}
                   onChange={(e) => setPasskey(e.target.value)}
                 />
               </div>
             </div>
           
             <button
               type="submit"
               className="submit-button"
               disabled={loadingSendOTP}
             >
               {loadingSendOTP ? "Sending..." : "Send OTP"}
             </button>
           </form>
           
            ) : (
              <div className="otp-animation-container">
                <div className="otp-info">
                  <p
                    style={{
                      color: "green",
                      fontSize: "18px",
                      marginBottom: "-30px",
                      textAlign: "left",
                    }}
                  >
                    A 6 digit OTP sent to {email}
                  </p>
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
                <button
                  className="submit-button"
                  onClick={handleVerifyOTP}
                  disabled={loadingVerifyOTP}
                >
                  {loadingVerifyOTP ? "Verifying..." : "Verify OTP"}
                </button>
              </div>
            )}

            {(errorSendOTP || errorVerifyOTP) && isMobile && (
              <div className="error-message">
                <p className="error-message-text">
                  {errorSendOTP?.message || errorVerifyOTP?.message}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default SendCoachEmailOTP;
