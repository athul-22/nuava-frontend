import React from "react";
import OnboardingNav from "./OnboardingNav";
import grid from "../assets/GRID.svg";
import '../styles/Onboarding.css'

const Contact: React.FC = () => {
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
      <div style={{ textAlign: "center", marginTop: "200px", }}>
        <p style={{  }} className="contact-title">
          Contact Us
        </p>
        <p style={{ }} className="contact-subtitle">
          24*7 Support . We are here to help you
        </p>
      </div>
      <div style={{display:'flex',justifyContent:'center',alignItems:'center'}}>
      <div className="contact-form-main"
        style={{
          width: "98%",
          maxWidth:'600px',
          backgroundColor: "white",
          padding: "20px",
          borderRadius: "20px",
          // boxShadow: "0 0 10px rgba(0,0,0,0.1)",
          marginTop: "50px",
          border:'1px solid #eee',
          
          
        }}
      >
        
        <form>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="email">Email ID</label>
            <input
              type="email"
              id="email"
              name="email"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                border:'1px solid #eee'
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="title">Title</label>
            <input
              type="text"
              id="title"
              name="title"
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                 border:'1px solid #eee'
              }}
            />
          </div>
          <div style={{ marginBottom: "10px" }}>
            <label htmlFor="message">Message</label>
            <textarea
              id="message"
              name="message"
              rows={4}
              style={{
                width: "100%",
                padding: "10px",
                borderRadius: "5px",
                 border:'1px solid #eee'
              }}
            ></textarea>
          </div>
          <div style={{ textAlign: "center" }}>
            <button
              type="submit"
              style={{
                backgroundColor: "#051da0",
                color: "white",
                padding: "10px 20px",
                borderRadius: "5px",
                border: "none",
                cursor: "pointer",
                width:'100%'
              }}
            >
              Submit
            </button>
          </div>
        </form>
        </div>
      </div>
    </div>
    </>
  );
};

export default Contact;
