import React from "react";
import OnboardingNav from "./OnboardingNav";
import grid from "../assets/GRID.svg";

const About: React.FC = () => {
  return (
    // <div style={{ backgroundColor: '#f7f7f7', minHeight: '100vh' }}>
    <div
      // className="onboard-overlay"

      style={{ backgroundImage: `url(${grid})`, height: "100%" }}
    >
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          paddingTop: "1px",
          marginBottom: "200px",
        }}
      >
        <OnboardingNav />
      </div>

      <p
        style={{
          fontSize: "80px",
          textAlign: "center",
          color: "#051da0",
          fontWeight: "bolder",
        }}
      >
        About us
      </p>
      <p
        style={{
          fontSize: "30px",
          textAlign: "center",
          color: "grey",
          fontWeight: "bolder",
        }}
      >
        We are democratizing the digital Sports
      </p>
      <div style={{ width: "100%", textAlign: "center" }}>
        <h2 style={{ color: "#051da0", fontWeight: "bold",fontSize: "40px",marginTop:'50px' }}>Team</h2>
        <div
          style={{
            display: "inline-flex",
            justifyContent: "center",

          }}
        >
          {/* Dummy profile cards */}
          <ProfileCard name="Anirudh Jain" />
          <ProfileCard name="Samar Hussain" />
          <ProfileCard name="Viha Nagarkatti" />
          <ProfileCard name="Athul Nambiar" />
        </div>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >

        </div>
      </div>
    </div>
  );
};

const ProfileCard = ({ name }: { name: string }) => (
  <div
    style={{
      border: "1px solid #ccc",
      backgroundColor:'white',
      padding: "10px",
      margin: "10px",
      width:'200px',
      borderRadius: "20px",
      // width: "85%",
    }}
  >
    <img
      src={`https://via.placeholder.com/150`}
      alt={name}
      style={{ width: "100%", borderRadius: "10px" }}
    />
    <h3 style={{ marginTop: "10px", marginBottom: "5px" ,fontWeight:'bolder'}}>{name}</h3>
    <div style={{ display: "flex", justifyContent: "center" }}>
      {/* <a href="https://github.com/" target="_blank" rel="noopener noreferrer">
        <img src="/path/to/github-icon.png" alt="GitHub" style={{ width: '30px', marginRight: '10px' }} />
      </a>
      <a href="https://linkedin.com/" target="_blank" rel="noopener noreferrer">
        <img src="/path/to/linkedin-icon.png" alt="LinkedIn" style={{ width: '30px' }} />
      </a> */}
    </div>
  </div>
);

export default About;
