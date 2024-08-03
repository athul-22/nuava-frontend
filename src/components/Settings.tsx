import React, { useState, useRef } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useMutation, gql } from "@apollo/client";
import Navbar from "./Navbar";
import "../styles/Settings.css";
import { Toast } from "primereact/toast";

const MAKE_STUDENT_MODERATOR = gql`
  mutation MakeStudentMorderator($input: MakeStudentModeratorInput!) {
    makeStudentMorderator(input: $input) {
      status
      message
    }
  }
`;

const ProfileSettings: React.FC = () => {
  const toast = useRef<any>(null);
  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };
  const [studentIdVal, setStudentId] = useState<string>('');
  const [makeStudentModerator] = useMutation(MAKE_STUDENT_MODERATOR, {
    context: {
      headers: {
        Authorization: `jwt ${localStorage.getItem("token")}`,
      },
    },
  });

  const handleSubmit = () => {
    const studentId = parseInt(studentIdVal);
    makeStudentModerator({ variables: { input: { studentId } } })
      .then((response) => {
        if (response.data.makeStudentMorderator.status === true) {
          showToast(
            "success",
            "Success",
            "Student is now a moderator"
          );
        }   
        // console.log(response.data.makeStudentModerator.message);
      })
      .catch((error) => {
        console.error(error);
        showToast(
            "error",
            "Error",
            error.message
          );
      });
  };

  return (
    <>
      <Navbar buttontext="" />
      <div className="profile-settings">
        <div className="sidebar-settings">
          <ul>
            <li className="selected">Access</li>
          </ul>
        </div>
        <div className="content">
          <Card
            title="Settings"
            style={{ borderRadius: "10px", paddingLeft: "30px" }}
          >
            <div className="input-group">
              <label htmlFor="studentId">
                Enter student ID to make moderator
              </label>
              <span className="p-input-icon-left">
                <i className="pi pi-user" style={{ marginLeft: "15px" }}></i>
                <InputText
                  id="studentId"
                  value={studentIdVal !== null ? studentIdVal.toString() : ""}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Student ID"
                />
              </span>
            </div>
            {/* <p className="info-text">Student will get access to edit the score for a fi</p> */}
            <div className="input-group">
              <Button
                label="Submit"
                onClick={handleSubmit}
                style={{
                  
                }}
                id="mod-submit-btn"
              />
            </div>
          </Card>
        </div>
      </div>
      <Toast ref={toast} position="top-right" />
    </>
  );
};

export default ProfileSettings;
