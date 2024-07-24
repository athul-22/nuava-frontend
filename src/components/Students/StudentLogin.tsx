import React, { useState, useEffect, useRef } from "react";
import { gql, useMutation } from "@apollo/client";
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import "./StudentLogin.css"; 
import { Toast } from 'primereact/toast';

const LOGIN_STUDENT = gql`
  mutation LoginStudent($input: LoginStudentInput!) { 
    loginStudent(input: $input) {
      status
      message
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

const StudentLogin: React.FC = () => {
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

  const [loginStudent, { loading }] = useMutation(LOGIN_STUDENT); 
  const [forgotPassword] = useMutation(FORGOT_PASSWORD);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    try {
      const response = await loginStudent({
        variables: {
          input: {
            email: email,
            password: password,
          },
        },
      });

      if (response.data?.loginStudent.status) {
        localStorage.setItem("token", response.data.loginStudent.token);
        showToast('success', 'Login Successful', 'Redirecting to dashboard...');
        localStorage.setItem('usertype','student')
        window.location.href = "/dashboard";
      } else {
        showToast('error', 'Login Failed', response.data?.loginStudent.message || 'Error occurred during login');
      }
    } catch (err) {
      console.error("Error:", err);
      showToast('error', 'Error', 'An error occurred during login.');
    }
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
        showToast('success', 'Success', response.data.forgotPassword.message);
      } else {
        showToast('error', 'Error', response.data?.forgotPassword.message || 'Failed to reset password');
        setModalOpen(true);
      }
    } catch (err) {
      console.error("Error:", err);
      showToast('error', 'Error', 'An error occurred while resetting password');
    }

    setModalOpen(false);
  };

  const createNewAccount = () => {
    window.location.href = "/student/register";
  };

  return (
    <div className="login-container-student-login"> {/* Updated class name */}
      <div className="left-column-student-login"></div>
      <div className={`right-column-student-login ${isMobile ? 'mobile-container-student-login' : ''}`}>
        <div className="welcome-container-student-login">
          <div className="welcome-text-student-login">
            <p className="welcome-subtitle-student-login">Welcome to</p>
            <p className="welcome-title-student-login">Nuava Sports</p>
          </div>
          <div className="form-container-student-login">
            <form className="login-form-student-login" onSubmit={handleLogin}>
              <div className="input-group-student-login">
                <InputText
                  type="text"
                  id="username-student-login"
                  className="input-field-student-login"
                  placeholder="Email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div className="input-group-student-login">
                <InputText
                  type="password"
                  id="password-student-login"
                  className="input-field-student-login"
                  placeholder="Password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
              <div className="forgot-password-student-login" onClick={() => setModalOpen(true)}>
                <span>Forgot password?</span>
              </div>
              <Button type="submit" label={loading ? "Logging in..." : "Login"} className="submit-button-student-login" disabled={loading} />
              <div className="new-account-student-login">
                <span style={{ color: "grey" }}>New here?</span>{" "}
                <span onClick={createNewAccount} className="create-account-student-login">Create an account</span>
              </div>
            </form>
          </div>
        </div>
      </div>

      <Dialog
        header="Forgot Password"
        visible={modalOpen}
        onHide={() => setModalOpen(false)}
        style={{ width: '30vw', borderRadius: '20px' }}
        breakpoints={{ '960px': '75vw', '641px': '100vw' }}
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
                border: '1px solid #ced4da',
                height: '60px',
                fontSize: '18px',
                paddingLeft: '10px',
                outline: 'none',
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
              marginTop: '20px',
              height: '60px',
              backgroundColor: 'black',
              fontSize: '18px',
              color: 'white',
            }}
          />
        </form>
      </Dialog>

      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default StudentLogin;
