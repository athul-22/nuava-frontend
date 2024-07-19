import React from "react";
import { Card } from "primereact/card";
import { Button } from "primereact/button";
import "./LiveMatch.css";
import Navbar from "../Navbar";

const LiveMatch = () => {
  return (
    <>
      <Navbar buttontext="" />
      <h1 className="live-match-title" style={{color:'grey',marginLeft:'100px'}}>LIVE MATCHES</h1>
      <div className="live-match-container">
       
        {/* <Button label="Live" icon="pi pi-video" className="p-button-danger live-button" /> */}
        <Card className="match-card">
        <div style={{ display: "flex", justifyContent: "center" }}>
              <div
                style={{
                  backgroundColor: "red",
                  color: "white",
                  width: "100px",
                  borderRadius: "20px",
                  padding: "5px",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                <span
                  className="pi pi-wifi"
                  style={{ marginRight: "10px" }}
                ></span>
                Live
              </div>
            </div>
          <div className="match-header">
            <h2 className="tournament-name-live-match">TISB Tournament 2024</h2>
            {/* <p className="match-location-live-match">Home | Court #4</p> */}
          </div>
          <div className="match-content">
            <div className="team-info">
              <img
                src="https://scontent-lga3-2.xx.fbcdn.net/v/t39.30808-1/302180000_522637619864600_8040649852919170243_n.jpg?stp=dst-jpg_p480x480&_nc_cat=101&ccb=1-7&_nc_sid=f4b9fd&_nc_ohc=02JMm7EA-XcQ7kNvgHdxmgL&_nc_ht=scontent-lga3-2.xx&oh=00_AYBPzCPnsufObZKQuafm0c1WTPPFZntFaRyyKq7DAuWWjw&oe=669EF1CC"
                alt="TISB U15"
                className="team-logo"
              />
              <h3 className="team-name">TISB U15</h3>
            </div>
            <div className="match-score">
              <span>0</span>
              <span>:</span>
              <span>0</span>
            </div>
            <div className="team-info">
              <img
                src="https://scontent-lga3-1.xx.fbcdn.net/v/t1.6435-1/162043817_222230513025550_4458232019493567155_n.jpg?stp=dst-jpg_p480x480&_nc_cat=106&ccb=1-7&_nc_sid=616b0e&_nc_ohc=8-lFpGrAYH8Q7kNvgEJP7yN&_nc_ht=scontent-lga3-1.xx&oh=00_AYAWKeSEjUgeonEDg1arAji8C-3TReS4spXm76ZzEWVztQ&oe=66C090A0"
                alt="Harrow"
                className="team-logo"
              />
              <h3 className="team-name">Harrow</h3>
            </div>
          </div>
          <div className="match-type">7-A-Side</div>
          <div className="scorers">
            <div className="scorer">
              <span>Aman RK 12'</span>
              <span></span>
            </div>
            <div className="scorer">
              <span>Rohit Rathore 31'</span>
              <span></span>
            </div>
            <div className="scorer">
              <span></span>
              <span>Aarav Patel 11'</span>
            </div>
          </div>
        </Card>
      </div>
    </>
  );
};

export default LiveMatch;
