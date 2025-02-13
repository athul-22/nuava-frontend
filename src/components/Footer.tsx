import { Button } from "primereact/button";
import React from "react";


const Footer: React.FC = () => {

  const handleHomeClick = () => {

  }
    return (
        <div className="footer" >
            <div className="footer-content">
              {/* <img src="path_to_logo.png" alt="Logo" className="footer-logo" /> */}
              <p className="footer-text">Nuava Sports</p>
              {/* <div className="footer-social-icons">
                <i className="pi pi-facebook" />
                <i className="pi pi-twitter" />
                <i className="pi pi-instagram" />
                <i className="pi pi-linkedin" />
              </div> */}
              <div className="footer-links">
                <Button label="Home" onClick={() => {window.location.href = '/'}} className="p-button-text" />
                <Button label="About Us" className="p-button-text"onClick={() => {window.location.href = '/about'}}/>
                <Button label="Contact Us" className="p-button-text" onClick={() => {window.location.href = '/contact'}}/>
                {/* <Button label="Updates" className="p-button-text" /> */}
                {/* <Button label="Careers" className="p-button-text" /> */}
              </div>
            </div>
          </div>
    );
    }

export default Footer;