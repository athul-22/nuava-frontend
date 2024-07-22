import React, { useState } from "react";
import OnboardingNav from "./OnboardingNav";
import grid from "../assets/GRID.svg";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import bg from "../assets/BG.jpg";
import "../styles/Onboarding.css";
import Footer from "./Footer";

interface TeamMember {
  name: string;
  info: string;
}

const teamMembers: TeamMember[] = [
  {
    name: "Anirudh Jain",
    info: "Anirudh Jain is a dynamic recent graduate from a prestigious university in the United States. After an enriching period abroad in America, England, and Spain, Anirudh has returned to Bangalore. His passion for sports led him to the world of professional football, where he secured prominent roles in the Bengaluru FC U-17, Karnataka State U-16, and India U-17 teams.",
  },
  { name: "Samar Hussain", info: "Information about Samar Hussain" },
  { name: "Viha Nagarkatti", info: "Information about Viha Nagarkatti" },
  { name: "Athul Nambiar", info: "Information about Athul Nambiar" },
];

const About: React.FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState<TeamMember | null>(null);

  const handleClickOpen = (member: TeamMember) => {
    setSelectedMember(member);
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
    setSelectedMember(null);
  };

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

        <p className="aboutus-text">About us</p>
        <p className="aboutus-text-tagline">
          We are democratizing the digital Sports
        </p>

        <div className="container-class-forabout">
          <br></br>
          <p className="subtitle-about">Who we are:</p>
          <br></br>
          <p className="subtitle-content-about">
            At Nuava Sports, we are dedicated to digitizing the sports
            infrastructure in schools and colleges. As passionate sports
            enthusiasts, we recognize the significant gap in sports education
            growth within India. Our mission is to revolutionize sports
            infrastructure across the nation, from schools to academies,
            spanning a variety of sports.
          </p>

          <br></br>
          <p className="subtitle-about">What we do:</p>
          <br></br>
          <p className="subtitle-content-about">
            We are developing a digital platform designed to empower coaches to
            manage all aspects of sports, from player selection to tournament
            organization to stat collection. This platform serves as a valuable
            tool for coaches and sports staff, enhancing the overall sporting
            experience. By adopting this digital-first approach, we aim to
            benefit students and the wider student body, providing them with an
            innovative and immersive sports education. Technology is already
            transforming classrooms in numerous ways, so why not extend its
            benefits to sports education as well?
          </p>

          <br></br>
          <p className="subtitle-about-location">Location: Bangalore</p>
          <br></br>
        </div>

        <div
          style={{ width: "100%", textAlign: "center" }}
          className="about-team-main"
        >
          <h2
            style={{
              color: "#051da0",
              fontWeight: "bold",
              fontSize: "40px",
              marginTop: "50px",
            }}
          >
            Team
          </h2>
          <div className="about-team-main-container grid md:inline-flex justify-center">
            {teamMembers.map((member) => (
              <ProfileCard
                key={member.name}
                member={member}
                onInfoClick={handleClickOpen}
              />
            ))}
          </div>
        </div>
        <Dialog open={open} onClose={handleClose}>
          <DialogTitle>{selectedMember?.name}</DialogTitle>
          <DialogContent>
            <p>{selectedMember?.info}</p>
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose} color="primary">
              Close
            </Button>
          </DialogActions>
        </Dialog>

       
      </div>
    </>
  );
};

const ProfileCard: React.FC<{
  member: TeamMember;
  onInfoClick: (member: TeamMember) => void;
}> = ({ member, onInfoClick }) => (
  <div
    style={{
      border: "1px solid #ccc",
      backgroundColor: "white",
      padding: "10px",
      margin: "10px",
      width: "200px",
      borderRadius: "20px",
    }}
  >
    <img
      src={`https://via.placeholder.com/150`}
      alt={member.name}
      style={{ width: "100%", borderRadius: "10px" }}
    />
    <h3
      style={{ marginTop: "10px", marginBottom: "5px", fontWeight: "bolder" }}
    >
      {member.name}
    </h3>
    <div style={{ display: "flex", justifyContent: "center" }}></div>
    <i
      className="pi pi-info-circle"
      style={{
        fontSize: "1rem",
        color: "#211F1F",
        marginRight: "20px",
        cursor: "pointer",
      }}
      onClick={() => onInfoClick(member)}
    ></i>
    <i
      className="pi pi-linkedin"
      style={{ fontSize: "1rem", color: "#0a66c2" }}
    ></i>
  </div>
);

export default About;
