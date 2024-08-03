import React, { useEffect, useRef, useState } from "react";
import { Menu } from "primereact/menu";
import { Sidebar } from "primereact/sidebar";
import { Button } from "primereact/button";
import { classNames } from "primereact/utils";
import { Avatar } from "primereact/avatar";
import { Toast } from "primereact/toast";
import { MenuItem } from "primereact/menuitem";
import "../styles/Navbar.css";
import CoachLogin from "./Coach/CoachLogin";

interface NavbarProps {
  buttontext: string;
}

const Navbar: React.FC<NavbarProps> = ({ buttontext }) => {
  const menuLeft = useRef<Menu>(null);
  const profileMenu = useRef<Menu>(null);
  const [showPopup, setShowPopup] = useState(false);
  const [showSidebar, setShowSidebar] = useState(false);
  const toastRef = useRef<Toast>(null);
  const [showCreateButton, setShowCreateButton] = useState(false);
  const [userType, setUserType] = useState(false);
  const [footballselected , setFootballSelected] = useState(false);
  const [interhouseselect , setInterhouseselected] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("selectedSport") === "Inter-House") {
      setShowCreateButton(true);
      setInterhouseselected(true);
    } else if (localStorage.getItem("selectedSport") === "Football") {
      setShowCreateButton(true);
      setFootballSelected(true);
    } else {
      setShowCreateButton(false);
    }

    if (localStorage.getItem("usertype") === "coach") {
      setUserType(true);
    }
  });

  const [selectedSport, setSelectedSport] = useState<string>(
    localStorage.getItem("selectedSport") || "Select"
  );

  const handleFootballSelection = () => {
    setSelectedSport("Football");
    localStorage.setItem("selectedSport", "Football");
    window.location.href = "/dashboard/football";
  };

  const handleInterHouseSelection = () => {
    setSelectedSport("Inter-House");
    localStorage.setItem("selectedSport", "Inter-House");
    window.location.href = "/dashboard/inter-house-matches";
  };

  const handleOverviewSelection = () => {
    setSelectedSport("Overview");
    localStorage.setItem("selectedSport", "Overview");
    window.location.href = "/dashboard";
  };

  const handleCalenderSelection = () => {
    window.location.href = "/calender";
  };

  const handleCreateTournament = () => {
    window.location.href = "/tournament/create";
  };

  const handleCreateMatch = () => {
    window.location.href = "/create-match";
  };

  

  const handleCreateButtonClick = () => {
    if (localStorage.getItem("selectedSport") === "Inter-House") {
      window.location.href = "/create-match";
    } else if (localStorage.getItem("selectedSport") === "Football") {
      window.location.href = "/tournament/create";
    }
  };

  const handleLogout = () => {
    localStorage.clear();
    window.location.href = "/";
  };

  const handleViewProfileClick = () => {
    window.location.href = "/profile";
  };

  const homeClickMenu = () => {
    if (localStorage.getItem("selectedSport") === "Inter-House") {
      window.location.href = "/dashboard/inter-house-matches";
    } else if (localStorage.getItem("selectedSport") === "Football") {
      window.location.href = "/dashboard/football";
    } else {
      window.location.href = "/dashboard";
    }
  };

  const items: MenuItem[] = [
    {
      items: [
        {
          label: "Overview",
          icon: "pi pi-objects-column",
          command: handleOverviewSelection,
        },
        {
          label: "Football",
          icon: "pi pi-angle-right",
          command: handleFootballSelection,
        },
        {
          label: "Inter-House",
          icon: "pi pi-angle-right",
          command: handleInterHouseSelection,
        },
      ],
    },
  ];

  const user_name = localStorage.getItem("name");

  const Profileitems: MenuItem[] = [
    {
      command: () => {
        toastRef.current?.show({
          severity: "info",
          summary: "Info",
          detail: "Item Selected",
          life: 3000,
        });
      },
      template: (item: MenuItem, options: any) => {
        return (
          <button
            onClick={(e) => options.onClick(e)}
            className={classNames(
              options.className,
              "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
            )}
            id="profile-menu-img-section"
          >
            <Avatar
              image="https://img-new.cgtrader.com/items/4506145/4d6ab481d2/large/football-player-avatar-3d-icon-3d-model-4d6ab481d2.jpg"
              className="mr-20"
              shape="circle"
              id="proile-menu-avatar"
            />

            <div className="flex flex-column align">
              <span className="font-bold" id="profile-menu-name">
                {user_name}
              </span>{" "}
              <br></br>
              {/* <span className="text-sm" id="profile-menu-email">email id</span> */}
              <button
                id="profile-menu-profile-button"
                onClick={handleViewProfileClick}
              >
                View Profile
              </button>
            </div>
          </button>
        );
      },
    },
    {
      separator: true,
    },
    // {
    //   label: "Saved",
    //   icon: "pi pi-bookmark",
    //   template: (item: MenuItem, options: any) => {
    //     return (
    //       <>
    //         <hr className="my-4" />
    //         <button
    //           onClick={(e) => options.onClick(e)}
    //           className={classNames(
    //             options.className,
    //             "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
    //           )}
    //           id="profile-button"
    //           style={{ marginTop: "10px" }}
    //         >
    //           {/* <i
    //             className={classNames("pi pi pi-bookmark mr-2", {
    //               "text-primary": options.selected,
    //             })}
    //             style={{ color: "black", marginRight: "10px" }}
    //           ></i> */}
    //           {/* <span>Saved</span> */}
    //         </button>
    //       </>
    //     );
    //   },
    // },
    {
      label: "Settings",
      icon: "pi pi-cog",
      template: (item: MenuItem, options: any) => {
        return (
          <> {userType &&
            <button
              onClick={(e) => options.onClick(e)}
              className={classNames(
                options.className,
                "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
              )}
              id="profile-button"
              style={{ marginBottom: "10px" }}
            >
             
              <i
                className={classNames("pi pi-cog mr-2", {
                  "text-primary": options.selected,
                })}
                style={{ color: "black", marginRight: "10px" }}
              ></i>
               <span onClick={() => {window.location.href = "/settings"}}>Settings</span> 
            </button> }
          </>
        );
      },
    },
    {
      label: "Logout",
      icon: "pi pi-sign-out",
      command: handleLogout,
      template: (item: MenuItem, options: any) => {
        return (
          <>
            <hr className="my-4" />
            <button
              onClick={(e) => options.onClick(e)}
              className={classNames(
                options.className,
                "w-full p-link flex align-items-center p-2 pl-4 text-color hover:surface-200 border-noround"
              )}
              id="logout-button"
            >
              <i
                className={classNames("pi pi-sign-out mr-2", {
                  "text-primary": options.selected,
                })}
                style={{
                  color: "red",
                  marginRight: "10px",
                  paddingLeft: "4px",
                }}
              ></i>
              <span>Logout</span>
            </button>
          </>
        );
      },
    },
  ];

  const handleButtonClick = (
    event: React.MouseEvent<HTMLButtonElement | SVGSVGElement, MouseEvent>,
    menuType: "profile" | "sport"
  ) => {
    if (menuType === "profile" && profileMenu.current) {
      profileMenu.current.toggle(event);
    } else if (menuType === "sport" && menuLeft.current) {
      menuLeft.current.toggle(event);
    }
  };

  return (
    <div className="navbar">
      <div className="navbar-content">
        <Menu
          model={Profileitems}
          popup
          ref={profileMenu}
          id="popup_menu_profile"
          style={{ marginTop: "100px" }}
        />
        <div className="profile-icon">
          <div className="profile-icon-svg" aria-controls="popup_menu_profile">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="#051da0"
              onClick={(event) => handleButtonClick(event, "profile")}
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
              <Menu model={items} popup ref={menuLeft} id="popup_menu_left" />
              <Button
                label={selectedSport}
                icon="pi pi-angle-down"
                className="mr-2"
                onClick={(event) => handleButtonClick(event, "sport")}
                aria-controls="popup_menu_left"
                aria-haspopup
              />
            </div>
          </div>
        </div>

        {/* Center section with navigation links */}
        <div className="center-menu">
          { footballselected &&
          <span onClick={homeClickMenu}>Home</span>
          }


          { footballselected && <span
            onClick={() => {
              window.location.href = "/matches";
            }}
          >
            Matches
          </span> }

           { footballselected && <span onClick={() => {
              window.location.href = "/result";
            }}>Results</span> }
{ interhouseselect && <span onClick={() => {
              window.location.href = "/dashboard/inter-house-matches";
            }}>Home</span> }
{ interhouseselect && <span onClick={() => {
              window.location.href = "/inter-house-result";
            }}>InterHouse Results</span> }

          {/* <span>Live</span> */}
        </div>

        {/* Right section with buttons and icons */}
        <div className="right-section-navbar">
          {/* New Tournament Button */}
          {/* <button
            className="new-tournament-button"
            onClick={handleCreateMatch}
          >
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
            {buttontext}
            New Match
          </button> */}

          {showCreateButton && userType && (
            <button
              className="new-tournament-button"
              onClick={handleCreateButtonClick}
            >
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
              {buttontext}
            </button>
          )}

          {/* Notification Bell Icon */}
          <div
            style={{ display: "flex", gap: "10px" }}
            className="icon-container"
          >
            {/* <svg
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
            </svg> */}

            {/* Calendar Icon */}
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              strokeWidth={1.5}
              stroke="currentColor"
              className="size-6 icon"
              style={{
                color: "white",
                marginLeft: "-15px",
                marginRight: "20px",
              }}
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
            {/* <li>
              <button onClick={homeClickMenu} className="menu-item">
                Home
              </button>
            </li> */}
             { footballselected &&
          <span onClick={homeClickMenu}>Home</span>
          }
            { footballselected && <li>
             <button
                onClick={() => (window.location.href = "/matches")}
                className="menu-item"
              >
                Matches
              </button> 
            </li>}
            { footballselected &&   <li>
            <button onClick={() => {
              window.location.href = "/result";
            }} className="menu-item">Results</button> 
            </li>}

            { interhouseselect && <li onClick={() => {
              window.location.href = "/dashboard/inter-house-matches";
            }}>Home</li> }
            { interhouseselect && <li onClick={() => {
              window.location.href = "/inter-house-result";
            }}>Results</li> }
            
          </ul>
          {showCreateButton && userType && (
              <li style={{textDecoration:'none',lineHeightStep:'none',listStyle:'none'}}>
                <button
                  onClick={handleCreateButtonClick}
                  className="create-button"
                  style={{
                    width: "100%",
                    backgroundColor: "#051da0",
                    color: "white",
                    borderRadius: "20px",
                    padding: "10px",
                    marginTop: "10px",
                  }}
                >
                  {buttontext}
                </button>
              </li>
            )}

          <li style={{textDecoration:'none',lineHeightStep:'none',listStyle:'none'}}>
              <button
                onClick={handleCalenderSelection}
                style={{
                  width: "100%",
                  backgroundColor: "#051da0",
                  color: "white",
                  borderRadius: "20px",
                  padding: "10px",
                  marginTop: "10px",
                }}
              >
                Calendar
              </button>
            </li>
        </div>
      </Sidebar>
    </div>
  );
};

export default Navbar;
