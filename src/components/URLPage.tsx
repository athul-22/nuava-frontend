// src/components/URLPage.tsx

import React from "react";
import { Link } from "react-router-dom";

interface Section {
  title: string;
  routes: { url: string; title: string; description: string }[];
}

const URLPage: React.FC = () => {
  const sections: Section[] = [
    {
      title: "Coach",
      routes: [
        { 
          url: "/coach/register", 
          title: "Coach Registration", 
          description: "Register as a coach to access coaching tools and resources." 
        },
        { 
          url: "/coach/success", 
          title: "Success Coach Email", 
          description: "Confirmation page after successfully registering as a coach." 
        },
        { 
          url: "/coach/login", 
          title: "Coach Login", 
          description: "Log in to access coaching dashboard and manage coaching activities." 
        },
      ],
    },
    {
      title: "Student",
      routes: [
        { 
          url: "/student/register", 
          title: "Student Registration", 
          description: "Sign up as a student to join courses and interact with instructors." 
        },
        { 
          url: "/student/success", 
          title: "Success Student Email", 
          description: "Confirmation page after successfully registering as a student." 
        },
        { 
          url: "/student/login", 
          title: "Student Login", 
          description: "Log in to access student dashboard and course materials." 
        },
      ],
    },
    {
      title: "General",
      routes: [
        { 
          url: "/dashboard", 
          title: "Dashboard", 
          description: "View personalized dashboard with summary of activities and notifications." 
        },
        { 
          url: "/forgotpassword", 
          title: "Forgot Password", 
          description: "Recover forgotten password by entering your registered email address." 
        },
        { 
          url: "/resetpassword", 
          title: "Reset Password", 
          description: "Set a new password after receiving password reset instructions." 
        },
        { 
          url: "/tournament/create", 
          title: "Create New Tournament", 
          description: "Initiate a new tournament event with specified details and participants." 
        },
        { 
          url: "/dashboard/football", 
          title: "Football Dashboard", 
          description: "Access football-related statistics, match schedules, and team management tools." 
        },
        { 
          url: "/calender", 
          title: "Calendar", 
          description: "View and manage personal and team schedules and events." 
        },
      ],
    },
  ];

  return (
    <div style={{ maxWidth: "800px", margin: "auto", padding: "20px" }}>
      <h1 style={{ fontSize: "28px", fontWeight: "bold", marginBottom: "20px" }}>API Documentation</h1>
      {sections.map((section, index) => (
        <div key={index} style={{ marginBottom: "20px", backgroundColor: index % 2 === 0 ? "#f0f0f0" : "#ffffff", padding: "10px", borderRadius: "4px" }}>
          <h2 style={{ fontSize: "20px", fontWeight: "bold", marginBottom: "10px" }}>{section.title}</h2>
          <div style={{ padding: "10px", border: "1px solid #e5e7eb", borderTop: "none", borderRadius: "0 0 4px 4px" }}>
            {section.routes.map((item, idx) => (
              <div key={idx} style={{ marginBottom: "10px" }}>
                <p style={{ marginBottom: "5px", fontSize: "16px" }}>{item.description}</p>
                <Link
                  to={item.url}
                  style={{ color: "#4f46e5", textDecoration: "none", fontWeight: "500" }}
                >
                  {item.url}
                </Link>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
};

export default URLPage;
