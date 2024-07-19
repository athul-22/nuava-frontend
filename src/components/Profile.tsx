import React from 'react';
import '../styles/Profile.css';
import Navbar from './Navbar';

const dummyData = {
  name: "Nikhil Siddharth",
  school: "Stonehill International",
  house: "Yellow",
  grade: "Forth",
  recognitions: [
    { title: "Top Scorer", tournament: "TISB TOURNAMENT 2023", goals: 5 },
    { title: "Top Scorer", tournament: "CIS TOURNAMENT 2023", goals: 7 },
  ],
  upcomingEvents: [
    {
      league: "U15 Champions League",
      time: "04:00 PM",
      date: "10 APR",
      type: "7-A-Side",
      teams: ["TISB U15", "CIS U15"],
      location: "TISB Basketball Court",
    },
    {
      league: "U15 Champions League",
      time: "04:00 PM",
      date: "10 APR",
      type: "7-A-Side",
      teams: ["TISB U15", "CIS U15"],
      location: "TISB Basketball Court",
    },
  ],
  playerStats: {
    games: 24,
    goals: 12,
    image: "https://via.placeholder.com/150",
  },
};

const Profile: React.FC = () => {
  return (
    <div className="profile-container">
      <Navbar buttontext=""/>
      <div className="profile-header">
        <h1>{dummyData.name}</h1>
        <div className="profile-actions">
          <button>Edit</button>
          <button>Share</button>
        </div>
      </div>
      <div className="profile-content">
        <div className="profile-left">
          <div className="profile-recognitions">
            <h2>Recognitions</h2>
            {dummyData.recognitions.map((recog, index) => (
              <div key={index} className="recognition-card">
                <div>{recog.title}</div>
                <div>{recog.tournament}</div>
                <div>{recog.goals} GOALS</div>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-center">
          <div className="profile-info">
            <h2>{dummyData.school}</h2>
            <div>Grade: {dummyData.grade}</div>
            <div>House: {dummyData.house}</div>
          </div>
          <div className="upcoming-events">
            <h2>Upcoming Events</h2>
            {dummyData.upcomingEvents.map((event, index) => (
              <div key={index} className="event-card">
                <div>{event.league}</div>
                <div>{event.time} {event.date}</div>
                <div>{event.type}</div>
                <div>{event.teams.join(" vs ")} </div>
                <div>{event.location}</div>
              </div>
            ))}
          </div>
        </div>
        <div className="profile-right">
          <img src={dummyData.playerStats.image} alt="Player" />
          <div>Games: {dummyData.playerStats.games}</div>
          <div>Goals: {dummyData.playerStats.goals}</div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
