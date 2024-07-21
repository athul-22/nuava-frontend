import { Button } from "primereact/button";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import React, { useEffect, useState, useRef } from "react";
import "../styles/Onboarding.css";

const OnboardingNav: React.FC = () => {
  const [scrolled, setScrolled] = useState(false);
  const [visible, setVisible] = useState(false);
  const coachMenuRef = useRef<Menu>(null);
  const studentMenuRef = useRef<Menu>(null);

  useEffect(() => {
    const handleScroll = () => {
      const isScrolled = window.scrollY > 10;
      if (isScrolled !== scrolled) {
        setScrolled(isScrolled);
      }
    };

    document.addEventListener("scroll", handleScroll);
    return () => {
      document.removeEventListener("scroll", handleScroll);
    };
  }, [scrolled]);

  const coachItems = [
    {
      label: "Login",
      command: () => window.location.replace("/coach/login"),
    },
    {
      label: "Register",
      command: () => window.location.replace("/coach/register"),
    },
  ];

  const studentItems = [
    {
      label: "Login",
      command: () => window.location.replace("/student/login"),
    },
    {
      label: "Register",
      command: () => window.location.replace("/student/register"),
    },
  ];

  return (
    <nav className={`navbar-onboard ${scrolled ? "scrolled" : ""}`}>
      <div className="navbar-content-onboard">
        <a href="/" className="mobile-nav-home">Home</a>
        <a href="/about" className="mobile-nav-about">About Us</a>
        <a href="/contact" className="mobile-nav-contact">Contact Us</a>
        <div className="nav-btn-contaier mobile-nav-btn-container" style={{ float: "right", justifyContent: 'end' }}>
          <Button
            label="Coach"
            onClick={(e) => coachMenuRef.current?.toggle(e)}
            className="popup-menu-coach-class mobile-nav-popup-menu-coach-class"
          /> 
          <Menu
            model={coachItems}
            popup
            ref={coachMenuRef}
            id="popup_menu_coach"
            style={{ marginTop: "20px", borderRadius: '10px' }}
          />
          <Button
            label="Student"
            onClick={(e) => studentMenuRef.current?.toggle(e)}
            className="popup-menu-student-class mobile-nav-popup-menu-student-class"
          />
          <Menu
            model={studentItems}
            popup
            ref={studentMenuRef}
            id="popup_menu_student"
            style={{ marginTop: "20px", borderRadius: '10px' }}
          />
        </div>
        <Button icon="pi pi-bars" onClick={() => setVisible(true)} className="mobile-nav-menu-button" />
      </div>
      <Sidebar visible={visible} onHide={() => setVisible(false)} className="mobile-nav-sidebar">
        <a href="/" className="mobile-nav-sidebar-link">Home</a>
        <a href="/about" className="mobile-nav-sidebar-link">About Us</a>
        <a href="/contact" className="mobile-nav-sidebar-link">Contact Us</a>
        <Button
          label="Coach"
          onClick={(e) => coachMenuRef.current?.toggle(e)}
          className="popup-menu-coach-class mobile-nav-sidebar-button"
        />
        <Button
          label="Student"
          onClick={(e) => studentMenuRef.current?.toggle(e)}
          className="popup-menu-student-class mobile-nav-sidebar-button"
        />
      </Sidebar>
    </nav>
  );
};

export default OnboardingNav;
