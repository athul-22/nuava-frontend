import React, { useState, useRef } from "react";
import { useMutation } from "@apollo/client";
import { gql } from "@apollo/client";
import Navbar from "../Navbar";
import { IconField } from "primereact/iconfield";
import { InputText } from "primereact/inputtext";
import { InputIcon } from "primereact/inputicon";
import { Calendar } from "primereact/calendar";
import { Dropdown, DropdownChangeEvent } from "primereact/dropdown";
import { InputTextarea } from "primereact/inputtextarea";
import { Button } from "primereact/button";
import { Toast } from "primereact/toast";
import "../../styles/Common.css";
import './IHMatch.css'

const CREATE_INTER_HOUSE_EVENT = gql`
  mutation Mutation($input: CreateInterHouseEventInput!) {
    createInterHouseEvent(input: $input) {
      message
      status
    }
  }
`;

const CreateMatch: React.FC = () => {
  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  const toast = useRef<any>(null);

  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [startDate, setStartDate] = useState<Date | null>(null);
  const [endDate, setEndDate] = useState<Date | null>(null);
  const [startTime, setStartTime] = useState<Date | null>(null);
  const [endTime, setEndTime] = useState<Date | null>(null);
  const [isAllDay, setIsAllDay] = useState(false);
  const [house1Name, setHouse1Name] = useState("");
  const [house2Name, setHouse2Name] = useState("");
  const [typeOfSport, setTypeOfSport] = useState("");

  const [createInterHouseEvent] = useMutation(CREATE_INTER_HOUSE_EVENT);
  const token = localStorage.getItem("token");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const combineDateAndTime = (date: Date | null, time: Date | null) => {
      if (!date || !time) return null;
      const combined = new Date(date);
      combined.setHours(time.getHours());
      combined.setMinutes(time.getMinutes());
      return combined;
    };

    const combinedStartDateTime = combineDateAndTime(startDate, startTime);
    const combinedEndDateTime = combineDateAndTime(endDate, endTime);

    try {
      const result = await createInterHouseEvent({
        variables: {
          input: {
            title,
            description,
            startDate: combinedStartDateTime?.toISOString(),
            endDate: combinedEndDateTime?.toISOString(),
            isAllDay,
            house1Name,
            house2Name,
            typeOfSport,
          },
        },
        context: {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
        },
      });
      console.log(result);
      showToast("success", "Success", "Event created successfully");
      window.location.href = "/dashboard/inter-house-matches";
    } catch (error) {
      console.error("Error creating event:", error);
      showToast("error", "Error", "Error creating event");
    }
  };

  return (
    <div>
      <Navbar buttontext="Create match" />
      <h1
        className="mb-4"
        style={{
          fontSize: "25px",
          fontWeight: 700,
          marginLeft: "100px",
          marginTop: "50px",
        }}
      >
        {/* Create Inter House Match */}
      </h1>
      <h2
        style={{
          fontSize: "20px",
          fontWeight: 500,
          textAlign: "center",
          marginTop: "20px",
          color: "grey",
        }}
      >
        ORGANISE INTERHOUSE MATCHES
      </h2>
      <p
        style={{
          fontSize: "16px",
          textAlign: "center",
          color: "grey",
          marginBottom: "50px",
        }}
      >
        Create and customise the football matches, teams to trophies!
      </p>

      <form
        onSubmit={handleSubmit}
        className="p-4 create-ih-match-new"
        style={{
          
        }}
      >
        <IconField iconPosition="left" className="mb-3 input-box-pr">
          <InputIcon className="pi pi-trophy" />
          <InputText
            id="title"
            placeholder="Event Title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </IconField>

        <IconField iconPosition="left" className="mb-3 input-box-pr">
          <InputIcon className="pi pi-users" />
          <InputText
            id="house1Name"
            placeholder="House 1 Name"
            value={house1Name}
            onChange={(e) => setHouse1Name(e.target.value)}
          />
        </IconField>

        <IconField iconPosition="left" className="mb-3 input-box-pr">
          <InputIcon className="pi pi-users" />
          <InputText
            id="house2Name"
            placeholder="House 2 Name"
            value={house2Name}
            onChange={(e) => setHouse2Name(e.target.value)}
          />
        </IconField>

        <Calendar
          placeholder="Start Date"
          className="input-box-pr-calendar-cal-create-match-ih"
          value={startDate}
          onChange={(e: any) => setStartDate(e.value)}
          dateFormat="yy-mm-dd"
        />

        <Calendar
          placeholder="Start Time"
          className="input-box-pr-calendar-cal-create-match-ih"
          value={startTime}
          onChange={(e: any) => setStartTime(e.value)}
          timeOnly
          hourFormat="24"
        />

        <Calendar
          placeholder="End Date"
          className="input-box-pr-calendar-cal-create-match-ih"
          value={endDate}
          onChange={(e: any) => setEndDate(e.value)}
          dateFormat="yy-mm-dd"
        />

        <Calendar
          placeholder="End Time"
          className="input-box-pr-calendar-cal-create-match-ih"
          value={endTime}
          onChange={(e: any) => setEndTime(e.value)}
          timeOnly
          hourFormat="24"
        />

        <div className="mb-3" style={{display:'flex',alignItems:'center'}}>
          <label htmlFor="isAllDay" className="mr-2" style={{marginTop:'-10px'}}>
            All Day Event
          </label>
          <input
            type="checkbox"
            id="isAllDay"
            className="p-checkbox-create-match"
            checked={isAllDay}
            onChange={(e) => setIsAllDay(e.target.checked)}
          />
        </div>

        <IconField iconPosition="left" className="mb-3 input-box-pr-selection-box" style={{marginTop:'-10px'}}>
          <InputIcon className="pi pi-angle-down" />
          <Dropdown
          className="iinput-box-pr-selection-box"
            id="typeOfSport"
            value={typeOfSport}
            options={["Football", "Basketball", "Tennis", "Other"]}
            onChange={(e: DropdownChangeEvent) => setTypeOfSport(e.value)}
            placeholder="Type of Sport"

          />
        </IconField>

        <IconField iconPosition="left" className="mb-3 input-box-pr">
          <InputIcon className="pi pi-align-left" />
          <InputText
            id="description"
            placeholder="Description"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
          />
        </IconField>

        <Button
          type="submit"
          label="Create Match"
          style={{
           
          }}
          className="button-submit-ih-match"
        />
      </form>
      <Toast ref={toast} position="top-right" />
    </div>
  );
};

export default CreateMatch;