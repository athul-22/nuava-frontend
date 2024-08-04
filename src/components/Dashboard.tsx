import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import BANNER_MAIN from "../assets/BANNER_MAIN.png";
import Footer from "../components/Footer";
import { Calendar as BigCalendar, momentLocalizer } from "react-big-calendar";
import moment from "moment";
import { Card, CardContent, Typography, Alert } from "@mui/material";
import { Skeleton } from "primereact/skeleton";
import "primeicons/primeicons.css";
import '../styles/Dashboard.css'
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";

const localizer = momentLocalizer(moment);

interface Coach {
  id: string;
  name: string;
  email: string;
  phone: string;
  schoolID: string;
}

interface Event {
  id: string;
  title: string;
  start: Date;
  end: Date;
  isAllDay: boolean;
  details: string;
  typeOfEvent: string;
}

const Dashboard: React.FC = () => {
  const [coaches, setCoaches] = useState<Coach[]>([]);
  const [events, setEvents] = useState<Event[]>([]);
  const [loadingCoaches, setLoadingCoaches] = useState<boolean>(true);
  const [loadingEvents, setLoadingEvents] = useState<boolean>(true);
  const [coachError, setCoachError] = useState<string | null>(null);
  const [eventError, setEventError] = useState<string | null>(null);
  const [data, setData] = useState(null);
  const [eventDetailsVisible, setEventDetailsVisible] = useState(false);
  const [selectedEvent, setSelectedEvent] = useState<any>(null);
  const [title, setTitle] = useState<string>("");
  const [description, setDescription] = useState<string>("");
  const [startDate, setStartDate] = useState<Date | null>(new Date());
  const [endDate, setEndDate] = useState<Date | null>(new Date());
  const [startTime, setStartTime] = useState<moment.Moment | null>(moment());
  const [endTime, setEndTime] = useState<moment.Moment | null>(moment());
  const [isAllDay, setIsAllDay] = useState<boolean>(false);
  const [eventType, setEventType] = useState<string>("Normal Event");

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
      const response = await fetch("https://nuavasports.com/api", {
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
        // showToast("error", "Error", "An error occurred.");
        return;
      }

      const eventsData = result.data.getAllEvents.map((event: any) => ({
        id: event.id,
        title: event.title,
        start: new Date(parseInt(event.startDate, 10)),
        end: new Date(parseInt(event.endDate, 10)),
        description: JSON.parse(event.details)?.description || "",
        allDay: event.isAllDay,
        typeOfEvent: event.typeOfEvent,
      }));

      setEvents(eventsData);
    } catch (error) {
      console.error("Error fetching events:", error);
      // showToast("error", "Error", "An error occurred while fetching data");
    }
  };


  // EVENT DETIALS DIALOG
  const formatDuration = (start: Date, end: Date) => {
    const duration = moment.duration(moment(end).diff(moment(start)));
    return `${duration.asHours().toFixed(1)} hours`;
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


  useEffect(() => {
    localStorage.setItem("selectedSport", "Overview");
  }, []);

  // const fetchGraphQLData = async (query: string): Promise<any> => {
  //   const token = localStorage.getItem("token");
  //   if (!token) {
  //     throw new Error("No JWT token found");
  //   }
  //   const response = await fetch("https://nuavasports.com/api", {
  //     method: "POST",
  //     headers: {
  //       "Content-Type": "application/json",
  //       Authorization: `jwt ${token}`,
  //     },
  //     body: JSON.stringify({ query }),
  //   });
  //   if (!response.ok) {
  //     throw new Error(`HTTP error! status: ${response.status}`);
  //   }
  //   return response.json();
  // };

  const fetchGraphQLData = async (query: string): Promise<any> => {
    const token = localStorage.getItem("token");
    if (!token) {
      throw new Error("No JWT token found");
    }

    const response = await fetch("https://nuavasports.com/api", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `jwt ${token}`,
      },
      body: JSON.stringify({ query }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  };

  // const eventDetailsHeader = (
  //   <div className="flex justify-content-between align-items-center">
  //     <span className="text-xl font-bold">Event Details</span>
  //     <div>
  //       {/* <Button
  //         icon="pi pi-pencil"
  //         className="p-button-text p-button-sm"
  //         style={{ color: "grey" }}
  //         // onClick={handleEditButtonClick}
  //       />
  //       <Button
  //         icon="pi pi-trash"
  //         className="p-button-text p-button-sm p-button-danger"
  //         style={{ color: "red" }}
  //         // onClick={handleDeleteEvent}
  //       /> */}
  //       {/* <Button icon="pi pi-times" className="p-button-text p-button-sm" style={{color:'grey'}} onClick={() => setEventDetailsVisible(false)} /> */}
  //     </div>
  //   </div>
  // );


  



  useEffect(() => {
    const userType = localStorage.getItem("usertype");

    const fetchData = async () => {
      try {
        let query;
        if (userType === "coach") {
          query = `
            query Coach {
              getAllCoaches {
                id
                name
                email
                phone
                schoolID
              }
            }
          `;
        } else if (userType === "student") {
          query = `
            query Student {
              student {
                id
                email
                name
                schoolID
                grade
                age
              }
            }
          `;
        } else {
          throw new Error("Invalid user type");
        }

        const data = await fetchGraphQLData(query);
        setData(data.data);
        if (userType === "student") {
          const { id, email, name, schoolID, grade, age } = data.data.student;
          localStorage.setItem("id", id.toString());
          localStorage.setItem("email", email);
          localStorage.setItem("name", name);
          localStorage.setItem("schoolID", schoolID.toString());
          localStorage.setItem("grade", grade);
          localStorage.setItem("age", age.toString());
        } else if (userType === "coach") {
          const { id, email, name, phone, schoolID } = data.data.getAllCoaches[0];
          localStorage.setItem("id", id.toString());
          localStorage.setItem("email", email);
          localStorage.setItem("name", name);
          localStorage.setItem("phone", phone);
          localStorage.setItem("schoolID", schoolID.toString());
        }
        localStorage.setItem("responseData", JSON.stringify(data.data));
      } catch (error) {
        console.log("Error fetching data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const fetchCoaches = async () => {
      setLoadingCoaches(true);
      try {
        const coachQuery = `
          query Coach {
            getAllCoaches {
              id
              name
              email
              phone
              schoolID
            }
          }
        `;
        const coachData = await fetchGraphQLData(coachQuery);
        if (coachData.errors) {
          throw new Error(coachData.errors[0].message);
        }
        setCoaches(coachData.data.getAllCoaches || []);
      } catch (error) {
        console.error("Error fetching coaches:", error);
        setCoachError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoadingCoaches(false);
      }
    };

    const fetchEvents = async () => {
      setLoadingEvents(true);
      try {
        const eventQuery = `
          query Event {
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
        const eventData = await fetchGraphQLData(eventQuery);
        if (eventData.errors) {
          throw new Error(eventData.errors[0].message);
        }
        const formattedEvents = (eventData.data.getAllEvents || []).map(
          (event: any) => ({
            ...event,
            start: new Date(parseInt(event.startDate)),
            end: new Date(parseInt(event.endDate)),
          })
        );
        setEvents(formattedEvents);
      } catch (error) {
        console.error("Error fetching events:", error);
        setEventError(
          error instanceof Error ? error.message : "An unknown error occurred"
        );
      } finally {
        setLoadingEvents(false);
      }
    };

    // fetchGraphQLData();
    fetchCoaches()
    fetchEvents();
  }, []);


  const eventStyleGetter = (event: Event) => {
    let backgroundColor = "#3174ad";
    switch (event.typeOfEvent) {
      case "Fixture Event":
        backgroundColor = "#8fc9ff";
        break;
      case "Inter House Event":
        backgroundColor = "#ffc8dd";
        break;
      case "Normal Event":
        backgroundColor = "#98f5e1";
        break;
    }
    return { style: { backgroundColor } };
  };

  const CustomToolbar = () => null;

  const renderCalendarSkeleton = () => (
    <div
      style={{
        height: 500,
        display: "flex",
        flexDirection: "column",
        gap: "10px",
      }}
    >
      {[...Array(5)].map((_, index) => (
        <Skeleton key={index} height="80px" />
      ))}
    </div>
  );

  const renderCoachSkeleton = () => (
    <div style={{ display: "flex", flexWrap: "wrap", gap: "20px" }}>
      {[...Array(6)].map((_, index) => (
        <Card key={index} style={{ width: 250, marginBottom: 20 }}>
          <CardContent>
            <Skeleton width="60%" height="24px" />
            <Skeleton width="80%" />
            <Skeleton width="70%" />
            <Skeleton width="50%" />
          </CardContent>
        </Card>
      ))}
    </div>
  );

  return (
    <div>
      <Navbar buttontext="Create Tournament / Match" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          marginBottom: "20px",
        }}
      >
        {/* <img
          src={BANNER_MAIN}
          alt="Football"
          height="300"
          width="900"
          style={{ borderRadius: "15px" }}
        /> */}
      </div>
      <div>
        {/* <Typography
          variant="h5"
          style={{
            textAlign: "left",
            marginBottom: "20px",
            color: "grey",
            marginLeft:'80px',
           
          }}
        >
          Dashboard
        </Typography> */}
      </div>
      {(coachError || eventError) && (
        <Alert severity="error" style={{ marginBottom: "20px" }}>
          {coachError && <div>Error loading coaches: {coachError}</div>}
          {eventError && <div>Error loading events: {eventError}</div>}
        </Alert>
      )}
      <div className="dash-main-container">
        <div className="calender-dash">
          {loadingEvents ? (
            renderCalendarSkeleton()
          ) : (
            <BigCalendar
              localizer={localizer}
              events={events}
              startAccessor="start"
              endAccessor="end"
              style={{ height: 500 }}
              views={["month"]}
              toolbar={false}
              selectable={false}
              components={{
                toolbar: CustomToolbar,
              }}
              eventPropGetter={eventStyleGetter}
              tooltipAccessor={(event: { title: any }) => event.title}
              // onSelectEvent={(event: any) => console.log(event)}
              onSelectEvent={handleEventSelect}
              popup
              popupOffset={{ x: 30, y: 20 }}
            />
          )}
        </div>

        <div
          style={{
            width: "300px",
            padding: "10px",
            margin: "10px auto",
            marginTop: "80px",
            boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
            borderRadius: "10px",
            backgroundColor: "#fff",
            height:'fit-content'
          }}
        >
          <Typography
            variant="h6"
            gutterBottom
            style={{
              padding: "20px 0",
              textAlign: "center",
              borderBottom: "1px solid #e0e0e0",
            }}
          >
            Coach Details
          </Typography>
          {loadingCoaches ? (
            renderCoachSkeleton()
          ) : (
            <div
              style={{
                display: "flex",
                flexWrap: "wrap",
                gap: "2px",
                padding: "2px",
                justifyContent: "center",
              }}
            >
              {coaches.length > 0 ? (
                coaches.map((coach) => (
                  <Card
                    key={coach.id}
                    style={{
                      width: 300,
                      marginBottom: 20,
                      backgroundColor: "#f7f7f7",
                      boxShadow: "0 4px 8px rgba(0, 0, 0, 0.1)",
                      borderRadius: "10px",
                    }}
                  >
                    <CardContent>
                      <Typography
                        variant="h6"
                        style={{
                          color: "#333",
                          fontSize: "20px",
                          marginBottom: "10px",
                          textAlign: "center",
                        }}
                      >
                        {coach.name}
                      </Typography>

                      <hr
                        style={{
                          border: "none",
                          borderTop: "1px solid #e0e0e0",
                          margin: "10px 0",
                        }}
                      />

                      <Typography
                        color="textSecondary"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="pi pi-envelope"
                          style={{ marginRight: "5px" }}
                        ></span>{" "}
                        {coach.email}
                      </Typography>

                      <Typography
                        color="textSecondary"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="pi pi-phone"
                          style={{ marginRight: "5px" }}
                        ></span>{" "}
                        {coach.phone}
                      </Typography>

                      <Typography
                        color="textSecondary"
                        style={{
                          marginTop: "10px",
                          marginBottom: "10px",
                          display: "flex",
                          alignItems: "center",
                        }}
                      >
                        <span
                          className="pi pi-graduation-cap"
                          style={{ marginRight: "5px" }}
                        ></span>{" "}
                        {coach.schoolID}
                      </Typography>
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography
                  style={{
                    color: "#888",
                    textAlign: "center",
                    paddingTop: "20px",
                  }}
                >
                  No coaches found.
                </Typography>
              )}
            </div>
          )}
        </div>
      </div>
      {/* <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Footer />
      </div> */}
      <Dialog
        header="Event Details"
        visible={eventDetailsVisible}
        style={{ height:'fit-content' }}
        onHide={() => setEventDetailsVisible(false)}
        className="new-cal-event-dialog"
      >
        {selectedEvent && (
          <div className="p-4 " style={{marginTop:'50px'}}>
            <h2
              className="text-xl font-bold mb-2"
              style={{ fontSize: "24px", fontWeight: "bold" }}
            >
              {selectedEvent.title}
            </h2>
            <p className="mb-4">{selectedEvent.description}</p>
            <div className="mb-2">
              <br></br>
              <strong>
                <i className="pi pi-calendar-clock" style={{ color: "grey" }}></i> Start
                Date:
              </strong>{" "}
              {new Date(selectedEvent.start).toLocaleDateString()}
            </div>
            <div style={{marginBottom:'7px'}}>
              <strong>
                <i className="pi pi-clock" style={{ color: "grey" }}></i>{" "}
                Start Time:
              </strong>{" "}
              {new Date(selectedEvent.start).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}
            </div>
            <div>
              <strong>
                <i className="pi pi-hourglass" style={{ color: "grey" }}></i>{" "}
                Duration:
              </strong>{" "}
              {formatDuration(
                new Date(selectedEvent.start),
                new Date(selectedEvent.end)
              )}
            </div>
          </div>
        )}
      </Dialog>
    </div>
  );
};

export default Dashboard;
