/* eslint-disable jsx-a11y/alt-text */
import React, { useState } from "react";
import bg from "../assets/BG.jpg";
import grid from "../assets/GRID.svg";
import "../styles/Onboarding.css";
import ONB1 from "../assets/ONB_1.png";
import ONB2 from "../assets/ONB_2.png";
import ONB3 from "../assets/ONB_3.png";
import CUP from "../assets/CUP.png";
import REPORT from "../assets/REPORT.png";
import TIME from "../assets/TIME.png";
import SPORTSEQP from "../assets/SPORTSEQP.png";
import { Avatar } from "primereact/avatar";
import { AvatarGroup } from "primereact/avatargroup";
import { Dialog } from "primereact/dialog";
import Avatar1 from "../assets/AVATAR/1.png";
import Avatar2 from "../assets/AVATAR/2.png";
import Avatar3 from "../assets/AVATAR/3.png";
import Avatar4 from "../assets/AVATAR/4.png";
import Avatar5 from "../assets/AVATAR/5.png";
import Circle_1 from "../assets/ONBOARDING/1.png";
import Circle_2 from "../assets/ONBOARDING/2.png";
import Circle_3 from "../assets/ONBOARDING/3.png";
import Circle_4 from "../assets/ONBOARDING/4.png";
import Circle_5 from "../assets/ONBOARDING/5.png";
import Circle_6 from "../assets/ONBOARDING/6.png";
import Circle_7 from "../assets/ONBOARDING/7.png";
import Circle_8 from "../assets/ONBOARDING/8.png";
import { Menu } from "primereact/menu";
import { Button } from "primereact/button";
import OnboardingNav from "./OnboardingNav";
import Footer from "./Footer";

const Onboarding: React.FC = () => {
  const [showCoachDialog, setShowCoachDialog] = useState(false);
  const [showStudentDialog, setShowStudentDialog] = useState(false);

  const coachreg = () => {
    setShowCoachDialog(true);
  };

  const StudentReg = () => {
    setShowStudentDialog(true);
  };

  const handleDialogClose = () => {
    setShowCoachDialog(false);
    setShowStudentDialog(false);
  };

  const coachDialogContent = () => (
    <div
      className="dialog-content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <center>
        <Button
          label="Register"
          onClick={() => (window.location.href = "/coach/register")}
          className="p-button-primary"
          style={{
            backgroundColor: "#051da0",
            color: "white",
            marginRight: "10px",
            padding: "10px 60px",
            borderRadius: "20px",
          }}
        />
        <Button
          label="Login"
          onClick={() => (window.location.href = "/coach/login")}
          className="p-button-secondary"
          style={{
            backgroundColor: "white",
            color: "#051da0",
            marginRight: "10px",
            padding: "10px 60px",
            borderRadius: "20px",
            fontSize: "20px",
          }}
        />
      </center>
    </div>
  );

  const studentDialogContent = () => (
    <div
      className="dialog-content"
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      <center>
        <Button
          label="Register"
          onClick={() => (window.location.href = "/student/register")}
          className="p-button-primary"
          style={{
            backgroundColor: "#051da0",
            color: "white",
            marginRight: "10px",
            padding: "10px 60px",
            borderRadius: "20px",
          }}
        />
        <Button
          label="Login"
          onClick={() => (window.location.href = "/student/login")}
          className="p-button-secondary"
          style={{
            backgroundColor: "white",
            color: "#051da0",
            marginRight: "10px",
            padding: "10px 60px",
            borderRadius: "20px",
            fontSize: "20px",
          }}
        />
      </center>
    </div>
  );

  return (
    <>
      <div style={{ display: "flex", justifyContent: "center" }}>
        <OnboardingNav />
      </div>
      <div className="onboard-container">
        {/* <img src={bg} alt="" className="onboard-bg" width="1308" /> */}
        <div
          className="onboard-overlay"
          style={{ backgroundImage: `url(${grid})` }}
        ></div>

        <div className="onboard-content">
          <div className="onboard-text-box">
            <div className="onboard-title">
              <span className="gradient-text" style={{}}>
                NUAVA
              </span>
              <br className="onboard-hide-md" />
            </div>
            <div className="onboard-subtitle">
              <span className="tagline typing-effect">SPORTS DIGITIZED.</span>
              <br></br>
              Stay in the loop with live matches,
              <br className="onboard-hide-md" />
              coach updates & more
            </div>

            {/* <img src={ONB1} height="100px" width="100px" className="tennis" />
          <button
            onClick={StudentReg}
            className="onboard-button onboard-student-btn"
          >
            Continue as a Student
          </button>
          <button
            onClick={coachreg}
            className="onboard-button onboard-coach-btn"
          >
            Continue as a Coach
          </button> */}
            <div className="features-title ">Features</div>

            <div className="features-container">
              <div className="feature">
                <div className="feature-icon">
                  <img src={SPORTSEQP} height="100px" width="100px" />
                </div>
                <div className="feature-text">Inter house organization</div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <img src={CUP} height="100px" width="100px" />
                </div>
                <div className="feature-text">Create tournament</div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <img src={REPORT} height="100px" width="100px" />
                </div>
                <div className="feature-text">Track statistics</div>
              </div>
              <div className="feature">
                <div className="feature-icon">
                  <img src={TIME} height="100px" width="100px" />
                </div>
                <div className="feature-text">Live updates</div>
              </div>
            </div>

            <div className="container-c">
              <div className="circles-c">
                {/* <img src={Circle_1} alt="" className="circle_1"/> */}
                {/* <img src={Circle_8} alt="" className="circle_8" /> */}

                {/* <img src={Circle_5} alt="" className="circle_5"/> */}
                <div className="circle-c circle1-c"></div>
                <div className="circle-c circle2-c"></div>
                <div className="circle-c circle3-c"></div>
                {/* <img src={Circle_2} alt="" className="circle_2"/> */}

                {/* <img src={Circle_6} alt="" className="circle_6" />
              <img src={Circle_7} alt="" className="circle_7" /> */}
              </div>

              <div className="content-c">
                <h1>Ready to use Nuava</h1>
                <p>Digitize the entire Sports with us!</p>
                <div className="card flex justify-content-center"></div>
                <button className="btn-c">Join our waitlist</button>
                {/* <img src={Circle_4} alt="" className="circle_4"/> */}
                {/* <img src={Circle_3} alt="" className="circle_3" /> */}
              </div>
            </div>

            
          </div>
          <div style={{marginTop:'550px'}}>
          <Footer/>
          </div>
        </div>

        <Dialog
          header="Continue as a Coach"
          visible={showCoachDialog}
          style={{ width: "50vw" }}
          onHide={handleDialogClose}
        >
          {coachDialogContent()}
        </Dialog>

        <Dialog
          header="Continue as a Student"
          visible={showStudentDialog}
          style={{ width: "50vw" }}
          onHide={handleDialogClose}
        >
          {studentDialogContent()}
        </Dialog>
      </div>
    </>
  );
};

export default Onboarding;
