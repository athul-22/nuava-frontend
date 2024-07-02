import React from "react";
import { Calendar, momentLocalizer } from 'react-big-calendar';
import moment from 'moment';
import 'react-big-calendar/lib/css/react-big-calendar.css'; 
import Navbar from "../components/Navbar";
import "../styles/Calender.css";

const localizer = momentLocalizer(moment);

const myEventsList = [
  {
    title: 'Sample Event',
    start: new Date(),
    end: new Date(),
    allDay: false,
  },
];

const CalendarComponent: React.FC = () => {
  return (
    <div>
        <Navbar/>
    
    <div className="calendar-container">
      
      <div className="sidebar">
        <button className="create-btn">Create +</button>
        <div className="calendar-widget">
          <Calendar
            localizer={localizer}
            events={myEventsList}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 300, width: '100%' }}
            views={['month']}
            toolbar={false}
            selectable={false}
          />
        </div>
        <div className="calendar-types">
          <h4>My Calendars</h4>
          <div>
            <input type="checkbox" id="practice" name="practice" />
            <label htmlFor="practice"> Practice Sessions</label>
          </div>
          <div>
            <input type="checkbox" id="champions" name="champions" checked />
            <label htmlFor="champions"> Champions League</label>
          </div>
          <div>
            <input type="checkbox" id="tryouts" name="tryouts" />
            <label htmlFor="tryouts"> Try Outs</label>
          </div>
        </div>
      </div>
      <div className="main-calendar">
        <Calendar
          localizer={localizer}
          events={myEventsList}
          startAccessor="start"
          endAccessor="end"
          style={{ height: 700 }}
        />
      </div>
    </div>
    </div>
  );
};

export default CalendarComponent;
