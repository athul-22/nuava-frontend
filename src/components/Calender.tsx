import React, { useState, useEffect, useRef } from "react";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import "react-big-calendar/lib/css/react-big-calendar.css";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import Navbar from "../components/Navbar";
import "../styles/Calender.css";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import { Calendar } from "primereact/calendar";
import { LocalizationProvider, TimePicker } from "@mui/x-date-pickers";
import { AdapterMoment } from "@mui/x-date-pickers/AdapterMoment";
import { Toast } from "primereact/toast";
import { Flex } from "@mantine/core";
import { Dropdown } from "primereact/dropdown";

const localizer = momentLocalizer(moment);

const eventTypeColors = {
  "Normal Event": "#90EE90", // light green
  "Inter House Event": "#ADD8E6", // light blue
  "Fixture Event": "#FFB6C1", // light red
};

const eventTypeOptions = [
  { label: "Normal Event", value: "Normal Event" },
  { label: "Inter House Event", value: "Inter House Event" },
  { label: "Fixture Event", value: "Fixture Event" },
];

const CalendarComponent: React.FC = () => {
  const [visible, setVisible] = useState(false);
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<moment.Moment | null>(moment());
  const [endTime, setEndTime] = useState<moment.Moment | null>(moment());
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [events, setEvents] = useState<any[]>([]);
  const [eventType, setEventType] = useState<string>("Normal Event");
  const toast = useRef<any>(null);

  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  useEffect(() => {
    fetchEvents();
  }, []);

  const fetchEvents = async () => {
    const query = `
      query GetAllEvents {
        getAllEvents {
          id
          title
          startDate
          endDate
          isAllDay
          details
          typeOfEvent
        }
      }
    `;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Authentication token is missing");
      return;
    }

    try {
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ query }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        showToast("error", "Error", "An error occurred.");
        return;
      }

      const eventsData = result.data.getAllEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(parseInt(event.startDate, 10)),
        end: new Date(parseInt(event.endDate, 10)),
        description: JSON.parse(event.details)?.description || '',
        allDay: event.isAllDay,
        typeOfEvent: event.typeOfEvent,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      showToast("error", "Error", "An error occurred while fetching data");
    }
  };

  const handleCreateEvent = async () => {
    if (!startDate || !endDate || !startTime || !endTime || !title) {
      showToast("error", "Error", "Enter all the fields");
      return;
    }
  
    const combinedStartDate = moment(startDate)
      .hours(startTime.hours())
      .minutes(startTime.minutes())
      .seconds(0)
      .milliseconds(0);
  
    const combinedEndDate = moment(endDate)
      .hours(endTime.hours())
      .minutes(endTime.minutes())
      .seconds(0)
      .milliseconds(0);
  
    const input = {
      title,
      description, // Change this line
      startDate: combinedStartDate.toISOString(), // Use ISO format
      endDate: combinedEndDate.toISOString(), // Use ISO format
      isAllDay,
    };
  
    const mutation = `
      mutation Mutation($input: CreateEventInput!) {
        createEvent(input: $input) {
          message
          status
        }
      }
    `;
  
    const token = localStorage.getItem("token");
  
    if (!token) {
      showToast("error", "Error", "Login to see the events");
      return;
    }
  
    try {
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input },
        }),
      });
  
      const result = await response.json();
  
      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        showToast("error", "Error", result.errors[0].message);
        return;
      }
  
      if (result.data.createEvent.status) {
        showToast("success", "Event created successfully", "");
        fetchEvents();
      } else {
        alert("Failed to create event");
      }
    } catch (error) {
      console.error("Error creating event:", error);
      showToast("error", "Error", "Some error occurred");
    }
  
    setVisible(false);
  };

  const handleEditEvent = async () => {
    if (
      !selectedEvent ||
      !startDate ||
      !endDate ||
      !startTime ||
      !endTime ||
      !title
    ) {
      showToast("error", "Error", "Enter all the fields");
      return;
    }
  
    const combinedStartDate = moment(startDate)
      .hours(startTime.hours())
      .minutes(startTime.minutes())
      .seconds(0)
      .milliseconds(0);
  
    const combinedEndDate = moment(endDate)
      .hours(endTime.hours())
      .minutes(endTime.minutes())
      .seconds(0)
      .milliseconds(0);

  
    const input = {
      eventId: selectedEvent.id,
      title,
      desciprtion:description,
      startDate: combinedStartDate.toISOString(), // Use ISO format
      endDate: combinedEndDate.toISOString(), // Use ISO format
      isAllDay,
    };
  
    const mutation = `
      mutation Mutation($input: EditEventInput!) {
        editEvent(input: $input) {
          message
          status
        }
      }
    `;

    const token = localStorage.getItem("token");

    if (!token) {
      showToast("error", "Error", "Login to see the events");
      return;
    }

    try {
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        showToast("error", "Error", "Some error occurred");
        return;
      }

      if (result.data.editEvent.status) {
        showToast("success", "Event edited successfully", "");
        fetchEvents();
      } else {
        alert("Failed to edit event");
      }
    } catch (error) {
      console.error("Error editing event:", error);
      showToast("error", "Error", "Some error occurred");
    }

    setEventDetailsVisible(false);
  };

  const handleDeleteEvent = async () => {
    if (!selectedEvent) {
      showToast("error", "Error", "No event selected");
      return;
    }

    const input = {
      eventId: selectedEvent.id,
    };

    const mutation = `
      mutation DeleteAnyEvent($input: DeleteEventInput!) {
          deleteAnyEvent(input: $input) {
            message
            status
          }
        }
    `;

    const token = localStorage.getItem("token");

    if (!token) {
      showToast("error", "Error", "Login to see the events");
      return;
    }

    try {
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          query: mutation,
          variables: { input },
        }),
      });

      const result = await response.json();

      if (result.errors) {
        console.error("GraphQL Errors:", result.errors);
        showToast("error", "Error", "Some error occurred");
        return;
      }

      if (result.data.deleteAnyEvent.status) {
        showToast("success", "Event deleted successfully", "");
        fetchEvents();
      } else {
        alert("Failed to delete event");
      }
    } catch (error) {
      console.error("Error deleting event:", error);
      showToast("error", "Error", "Some error occurred");
    }

    setEventDetailsVisible(false);
  };

  const handleEventSelect = (event: any) => {
    setSelectedEvent(event);
    setTitle(event.title);
    setDescription(event.description);
    setStartDate(new Date(event.start));
    setEndDate(new Date(event.end));
    setStartTime(moment(event.start));
    setEndTime(moment(event.end));
    setIsAllDay(event.allDay);
    setEventType(event.typeOfEvent);
    setEventDetailsVisible(true);
  };

  const opencreateEventdialog = () => {
    setTitle("");
    setDescription("");
    setStartDate(new Date());
    setEndDate(new Date());
    setStartTime(moment());
    setEndTime(moment());
    setIsAllDay(false);
    setEventType("Normal Event");
    setVisible(true);
  };

  const eventStyleGetter = (event: any) => {
    const backgroundColor = eventTypeColors[event.typeOfEvent as keyof typeof eventTypeColors] || '#3174ad';
    return { style: { backgroundColor } };
  };

  return (
    <div>
      <Navbar buttontext="Create Tournament"/>
      <div className="calendar-container">
        <div className="sidebar">
          <button className="create-btn" onClick={opencreateEventdialog}>
            Create +
          </button>
          <div className="calendar-widget">
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 300, width: "100%" }}
              views={["month"]}
              toolbar={false}
              selectable={false}
              onSelectEvent={handleEventSelect}
              eventPropGetter={eventStyleGetter}
            />
          </div>
          <div className="calendar-types">
            <h4>Event Types</h4>
            {Object.entries(eventTypeColors).map(([type, color]) => (
              <div key={type}>
                <span style={{ backgroundColor: color, display: 'inline-block', width: '20px', height: '20px', marginRight: '10px' }}></span>
                <label>{type}</label>
              </div>
            ))}
          </div>
        </div>
        <div className="main-calendar">
          <BigCalendar
            localizer={localizer}
            events={events}
            startAccessor="start"
            endAccessor="end"
            style={{ height: 700 }}
            onSelectEvent={handleEventSelect}
            eventPropGetter={eventStyleGetter}
          />
        </div>
      </div>

      <Dialog
        header="Create Event"
        visible={visible}
        style={{
          width: "35vw",
          height: "650px",
          display: "flex",
          justifyContent: "center",
        }}
        onHide={() => setVisible(false)}
      >
        <div style={{ marginLeft: "30px" }}>
          <div className="p-field">
            <InputText
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="event-title"
            />
            <InputText
              placeholder="Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="event-title"
            />
          </div>
          <div className="p-field" style={{ marginTop: "30px" }}>
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              className="input-box-pr-calendar-cal"
              value={startDate}
              onChange={(e) => setStartDate(e.value as Date | null)}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="p-field">
            <label htmlFor="startTime">Start Time </label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ marginLeft: "15px" }}
              />
            </LocalizationProvider>
          </div>
          <div className="p-field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              className="input-box-pr-calendar-cal-end"
              value={endDate}
              onChange={(e) => setEndDate(e.value as Date | null)}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="p-field">
            <label htmlFor="endTime">End Time</label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                sx={{ marginLeft: "29px" }}
              />
            </LocalizationProvider>
          </div>
          {/* <div className="p-field">
            <label htmlFor="eventType">Event Type</label>
            <Dropdown
              value={eventType}
              options={eventTypeOptions}
              onChange={(e) => setEventType(e.value)}
              placeholder="Select Event Type"
            />
          </div> */}
          <div
            className="p-field-checkbox"
            style={{ marginTop: "30px", display: "flex" }}
          >
            <input
              type="checkbox"
              id="isAllDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="large-checkbox"
            />

            <label
              htmlFor="isAllDay"
              style={{ marginLeft: "12px", paddingTop: "-50px" }}
            >
              All Day
            </label>
          </div>
          <Button
            label="Create"
            onClick={handleCreateEvent}
            className="cal-event-btn"
          />
        </div>
      </Dialog>

      <Dialog
        header="Event Details"
        visible={eventDetailsVisible}
        style={{
          width: "35vw",
          height: "600px",
          display: "flex",
          justifyContent: "center",
        }}
        onHide={() => setEventDetailsVisible(false)}
      >
        <div style={{ marginLeft: "30px" }}>
          <div className="p-field">
            <InputText
              placeholder="Event title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="event-title"
            />
          </div>
          <div className="p-field">
            <InputText
              placeholder="Event Description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="event-title"
            />
          </div>
          <div className="p-field" style={{ marginTop: "30px" }}>
            <label htmlFor="startDate">Start Date</label>
            <Calendar
              className="input-box-pr-calendar-cal"
              value={startDate}
              onChange={(e) => setStartDate(e.value as Date | null)}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="p-field">
            <label htmlFor="startTime">Start Time </label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                value={startTime}
                onChange={(newValue) => setStartTime(newValue)}
                sx={{ marginLeft: "15px" }}
              />
            </LocalizationProvider>
          </div>
          <div className="p-field">
            <label htmlFor="endDate">End Date</label>
            <Calendar
              className="input-box-pr-calendar-cal-end"
              value={endDate}
              onChange={(e) => setEndDate(e.value as Date | null)}
              dateFormat="yy-mm-dd"
            />
          </div>
          <div className="p-field">
            <label htmlFor="endTime">End Time</label>
            <LocalizationProvider dateAdapter={AdapterMoment}>
              <TimePicker
                value={endTime}
                onChange={(newValue) => setEndTime(newValue)}
                sx={{ marginLeft: "29px" }}
              />
            </LocalizationProvider>
          </div>
          {/* <div className="p-field">
            <label htmlFor="eventType">Event Type</label>
            <Dropdown
              value={eventType}
              options={eventTypeOptions}
              onChange={(e) => setEventType(e.value)}
              placeholder="Select Event Type"
            />
          </div> */}
          <div
            className="p-field-checkbox"
            style={{ marginTop: "30px", display: "flex" }}
          >
            <input
              type="checkbox"
              id="isAllDay"
              checked={isAllDay}
              onChange={(e) => setIsAllDay(e.target.checked)}
              className="large-checkbox"
            />

            <label
              htmlFor="isAllDay"
              style={{ marginLeft: "12px", paddingTop: "-50px" }}
            >
              All Day
            </label>
          </div>
          <Flex justify="space-between" style={{ marginTop: "20px" }}>
            <Button
              label="Save changes"
              onClick={handleEditEvent}
              className="cal-event-btn-edit"
            />
            <Button
              label="Delete"
              onClick={handleDeleteEvent}
              className="cal-event-btn-del"
            />
          </Flex>
        </div>
      </Dialog>
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default CalendarComponent;