import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import "../../styles/Login.css";
import { Toast } from "primereact/toast";

const LOGIN_COACH = gql`
  mutation LoginCoach($input: LoginCoachInput!) {
    loginCoach(input: $input) {
      message
      status
      token
    }
  }
`;

const FORGOT_PASSWORD = gql`
  mutation ForgotPassword($input: ForgotPasswordRequest!) {
    forgotPassword(input: $input) {
      status
      message
    }
  }
`;

const CoachLogin: React.FC = () => {
  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState("");
  const [modalOpen, setModalOpen] = useState(false);
  const toast = useRef<any>(null);

  const [loginCoach, { loading }] = useMutation(LOGIN_COACH);
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  async function fetchDetails() {
    const query = `
      query {
        coach {
          email
          id
          name
          phone
          schoolID
        }
      }`;
  
    const headers = {
      "Content-Type": "application/json",
      "Authorization": `Bearer ${localStorage.getItem("token")}`,
    };
  
    try {
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({ query: query }),
      });
  
      if (!response.ok) {
        console.error("Network response was not ok:", response.statusText);
        throw new Error("Network response was not ok");
      }
  
      const data = await response.json();
      console.log("Fetched coach details:", data); // Log the fetched data
      return data;
    } catch (err) {
      console.error("Error fetching coach details:", err);
      throw err;
    }
  }
  
  

  // const handleLogin = async (e: React.FormEvent) => {
  //   e.preventDefault();

  //   try {
  //     const response = await loginCoach({
  //       variables: {
  //         input: {
  //           email: email,
  //           password: password,
  //         },
  //       },
  //     });

  //     if (response.data?.loginCoach.status) {
  //       localStorage.setItem("token", response.data.loginCoach.token);
  //       showToast("success", "Login Successful", "Redirecting to dashboard...");

  //       // window.location.href = "/dashboard";
  //     } else {
  //       showToast(
  //         "error",
  //         "Login Failed",
  //         response.data?.loginCoach.message || "Error occurred during login"
  //       );
  //     }
  //   } catch (err) {
  //     console.error("Error:", err);
  //     showToast("error", "Error", "An error occurred during login.");
  //   }
  // };


  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
  
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
        // Store the token in local storage
        localStorage.setItem("token", response.data.loginCoach.token);
        showToast("success", "Login Successful", "Redirecting to dashboard...");
        
        // Fetch coach details
        const coachDetails = await fetchDetails();
  
        if (coachDetails?.data?.coach) {
          // Store coach details in local storage
          const { name, phone, email, id, schoolID } = coachDetails.data.coach;
          localStorage.setItem("name", name);
          localStorage.setItem("mobile", phone);
          localStorage.setItem("email", email);
          localStorage.setItem("id", id.toString());
          localStorage.setItem("schoolID", schoolID);
  
          // Redirect to dashboard
          localStorage.setItem('usertype','coach')
          window.location.href = "/dashboard";
        } else {
          showToast("error", "Error", "Failed to fetch coach details");
        }
      } else {
        showToast(
          "error",
          "Login Failed",
          response.data?.loginCoach.message || "Error occurred during login"
        );
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("error", "Error", "An error occurred during login.");
    }
  };
  
  

  const createNewAccount = () => {
    window.location.href = "/coach/register";
  };

  const handleForgotPasswordSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await forgotPassword({
        variables: {
          input: {
            email: forgotPasswordEmail,
          },
        },
      });

      if (response.data?.forgotPassword.status) {
        showToast("success", "Success", response.data.forgotPassword.message);
      } else {
        showToast(
          "error",
          "Error",
          response.data?.forgotPassword.message || "Failed to reset password"
        );
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast("error", "Error", "An error occurred while resetting password");
    }

    setModalOpen(false);
  };

  return (
    <div className="login-container-coach-login">
      <div className="left-column-coach-login"></div>
      <div
        className={`right-column-coach-login ${
          isMobile ? "mobile-container-coach-login" : ""
        }`}
      >
        <div className="welcome-container-coach-login">
          <div className="welcome-text-coach-login">
            <p className="welcome-subtitle-coach-login">Welcome to</p>
            <p className="welcome-title-coach-login">Nuava Sports</p>
          </div>
          <div className="form-container-coach-login">
            <form className="login-form-coach-login" onSubmit={handleLogin}>
              <div className="input-group-coach-login">
                <InputText
                  type="text"
                  id="username-coach-login"
                  className="input-field-coach-login"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group-coach-login">
                <InputText
                  type="password"
                  id="password-coach-login"
                  className="input-field-coach-login"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div
                className="forgot-password-coach-login"
                onClick={() => setModalOpen(true)}
              >
                <span>Forgot password?</span>
              </div>
              <Button
                type="submit"
                label={loading ? "Logging in..." : "Login"}
                className="submit-button-coach-login"
                disabled={loading}
              />
              <div className="new-account-coach-login">
                <span style={{ color: "grey" }}>New here?</span>{" "}
                <span
                  onClick={createNewAccount}
                  className="create-account-coach-login"
                >
                  Create an account
                </span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog
        header="Forgot Password"
        visible={modalOpen}
        onHide={() => setModalOpen(false)}
        style={{ width: "30vw", borderRadius: "20px" }}
        breakpoints={{ "960px": "75vw", "641px": "100vw" }}
        draggable={false}
      >
        <form onSubmit={handleForgotPasswordSubmit} className="p-fluid">
          <div className="p-field">
            <InputText
              id="forgotPasswordEmail"
              name="forgotPasswordEmail"
              placeholder="Email"
              value={forgotPasswordEmail}
              onChange={(e) => setForgotPasswordEmail(e.target.value)}
              required
              style={{
                border: "1px solid #ced4da",
                height: "60px",
                fontSize: "18px",
                paddingLeft: "10px",
                outline: "none",
              }}
              className="custom-input"
            />
          </div>
          <br />
          <Button
            type="submit"
            label="Submit"
            className="p-mt-2"
            style={{
              marginTop: "20px",
              height: "60px",
              backgroundColor: "black",
              fontSize: "18px",
              color: "white",
            }}
          />
        </form>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default CoachLogin;
