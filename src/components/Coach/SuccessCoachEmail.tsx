import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import FOOTERCOMMON from "../../assets/FOOTERCOMMON.png";
import "./SuccessCoachEmail.css";
import TICK from '../../assets/TICK.png'

const SuccessCoachEmail: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  // State for user inputs
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email] = useState("");

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  return (
    <div className="success-coach-email-container">
      <div className="left-section">
        <div className="context" style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
          <img src={TICK} height="120px" width="120px" alt="tick" className="tick"/>
          <br/>
          <p className="left-text" style={{color:'white',fontSize:'25px'}}> Account Verified Successfully</p>
        </div>

        <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div>

        {showConfetti && (
          <Confetti
            numberOfPieces={700}
            recycle={false}
            gravity={0.05}
            initialVelocityX={2}
            initialVelocityY={10}
            width={window.innerWidth}
            height={window.innerHeight / 2}
          />
        )}
      </div>

      <div className="right-section">
        <div className="title">Complete the Profile</div>
        <div className="input-group">
          <input
            type="text"
            id="name"
            className="input-field"
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name" className="input-label">Name</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            id="mobile"
            className="input-field"
            placeholder=" "
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <label htmlFor="mobile" className="input-label">Mobile Number</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className="input-label">Password</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder=" "
            value={email}
            disabled
          />
          <label htmlFor="email" className="input-label">Email</label>
        </div>

        <button className="complete-button">Complete</button>
      </div>

      {/* <img
        src={FOOTERCOMMON}
        alt="Footer"
        className="footer-image-mobile-only"
      /> */}
    </div>
  );
};

export default SuccessCoachEmail;
