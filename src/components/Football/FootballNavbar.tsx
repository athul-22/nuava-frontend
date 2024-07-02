import React, { useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Toast } from "primereact/toast";
import { Sidebar } from "primereact/sidebar";
import "../../styles/Navbar.css";

const Navbar: React.FC = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const menuRef = useRef(null);
  const toastRef = useRef(null);

  const handleCreateTournament = () => {
    window.location.href = '/tournament/create';
  }

  const handleCalenderSelection = () => {
    window.location.href = '/calender';
  };

  const togglePopup = () => {
    setShowPopup(!showPopup);
  };

  const closePopup = () => {
    setShowPopup(false);
  };

  const handleOptionClick = (option: string) => {
    alert(`Selected option: ${option}`);
    closePopup();
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        {/* Left section with profile icon and text */}
        <div className="profile-icon">
          <div className="profile-icon-svg">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#051da0"
            >
              <path
                fillRule="evenodd"
                d="M7.5 6a4.5 4.5 0 1 1 9 0 4.5 4.5 0 0 1-9 0ZM3.751 20.105a8.25 8.25 0 0 1 16.498 0 .75.75 0 0 1-.437.695A18.683 18.683 0 0 1 12 22.5c-2.786 0-5.433-.608-7.812-1.7a.75.75 0 0 1-.437-.695Z"
                clipRule="evenodd"
              />
            </svg>
          </div>
          <div className="sport-type-text">
            <span className="light-text">Type of sport:</span>
            <div className="medium-text">
              <p style={{fontSize:'20px'}}>Football</p>

              {/* <Select
                  label="Sport Type"
                  placeholder="Football"
                  data={['Football']}
                /> */}
              {/* <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="cursor-pointer"
                // onClick={togglePopup}
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg> */}
            </div>
          </div>
        </div>

        {/* Center section with selection menu */}
        <div className="center-menu">
          <span>Home</span>
          <span>Matches</span>
          <span>Results</span>
          <span>Live</span>
        </div>

        {/* Right section with buttons and icons */}
        <div className="right-section-navbar">
          {/* New Tournament Button */}
          <button className="new-tournament-button" onClick={handleCreateTournament}>
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
              className="size-6"
            >
              <path
                fillRule="evenodd"
                d="M12 3.75a.75.75 0 0 1 .75.75v6.75h6.75a.75.75 0 0 1 0 1.5h-6.75v6.75a.75.75 0 0 1-1.5 0v-6.75H4.5a.75.75 0 0 1 0-1.5h6.75V4.5a.75.75 0 0 1 .75-.75Z"
                clipRule="evenodd"
              />
            </svg>
            New Tournament
          </button>

          {/* Notification Bell Icon */}
          <div
            style={{ display: "flex", gap: "10px" }}
            className="icon-container"
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 icon"
              id="notification-icon"
              style={{ color: "white" }}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M14.857 17.082a23.848 23.848 0 0 0 5.454-1.31A8.967 8.967 0 0 1 18 9.75V9A6 6 0 0 0 6 9v.75a8.967 8.967 0 0 1-2.312 6.022c1.733.64 3.56 1.085 5.455 1.31m5.714 0a24.255 24.255 0 0 1-5.714 0m5.714 0a3 3 0 1 1-5.714 0M3.124 7.5A8.969 8.969 0 0 1 5.292 3m13.416 0a8.969 8.969 0 0 1 2.168 4.5"
              />
            </svg>

            {/* CALENDER */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 icon"
              style={{ color: "white" }}
              onClick={handleCalenderSelection}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6.75 3v2.25M17.25 3v2.25M3 18.75V7.5a2.25 2.25 0 0 1 2.25-2.25h13.5A2.25 2.25 0 0 1 21 7.5v11.25m-18 0A2.25 2.25 0 0 0 5.25 21h13.5A2.25 2.25 0 0 0 21 18.75m-18 0v-7.5A2.25 2.25 0 0 1 5.25 9h13.5A2.25 2.25 0 0 1 21 11.25v7.5"
              />
            </svg>
          </div>

          {/* Menu Icon for Mobile */}
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 24 24"
            fill="currentColor"
            className="menu-icon"
            onClick={() => setShowSidebar(true)}
          >
            <path
              fillRule="evenodd"
              d="M3 9a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75A.75.75 0 0 1 3 9Zm0 6.75a.75.75 0 0 1 .75-.75h16.5a.75.75 0 0 1 0 1.5H3.75a.75.75 0 0 1-.75-.75Z"
              clipRule="evenodd"
            />
          </svg>
        </div>
      </div>

      {/* Popup Component */}
      {showPopup && (
        <div className="popup-container">
          <div className="popup-content">
            <h2 className="text-xl font-semibold">Select Sport</h2>
            <Toast ref={toastRef}></Toast>
          </div>
        </div>
      )}

      {/* Sidebar for Mobile Menu */}
      <Sidebar
        visible={showSidebar}
        onHide={() => setShowSidebar(false)}
        className="p-sidebar-sm"
      >
        <div className="sidebar-menu">
          <h2>Explore</h2>
          <ul>
            <li>
              <a href="#home">Home</a>
            </li>
            <li>
              <a href="#matches">Matches</a>
            </li>
            <li>
              <a href="#results">Results</a>
            </li>
            <li>
              <a href="#live">Live</a>
            </li>
            <button
              className="new-tournament-button"
              style={{ backgroundColor: "blue" }}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                strokeWidth={1.5}
                stroke="currentColor"
                className="size-6 text-blue-800 mr-2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="m19.5 8.25-7.5 7.5-7.5-7.5"
                />
              </svg>
              New Tournament
            </button>
          </ul>
        </div>
      </Sidebar>
    </div>
  );
};

export default Navbar;
