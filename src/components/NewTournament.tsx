import React, { useRef, useState, useEffect } from "react";
import FootballNavbar from "../components/Navbar";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import { Calendar } from "primereact/calendar";
import { Chips } from "primereact/chips";
import { InputText } from "primereact/inputtext";
import "primereact/resources/themes/saga-blue/theme.css";
import "primereact/resources/primereact.min.css";
import "primeicons/primeicons.css";
import "../styles/NewTournament.css";
import { IconField } from "primereact/iconfield";
import { InputIcon } from "primereact/inputicon";
import { Dropdown } from "primereact/dropdown";
import { Toast } from "primereact/toast";
// import { DemoContainer } from "@mui/x-date-pickers/internals/demo";
// import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
// import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
// import { TimePicker } from "@mui/x-date-pickers/TimePicker";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
// import dayjs from "dayjs";
import { InputText as TextField } from "primereact/inputtext";
import dayjs, { Dayjs } from "dayjs";
import {
  DatePicker,
  LocalizationProvider,
  TimePicker,
} from "@mui/x-date-pickers";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { AutoComplete } from 'primereact/autocomplete';
// import TextField from '@mui/material/TextField';
// import { Dayjs } from 'dayjs';

interface Student {
  age: number;
  grade: string;
  email: string;
  id: string;
  name: string;
  schoolID: number;
}

interface YourSchoolType {
  name: string;
  code: string;
}

interface TournamentDay {
  date: string;
  startTime: string;
  endTime: string;
}

interface IntervalField {
  date: Dayjs;
  startTime: Dayjs | null;
  endTime: Dayjs | null;
}

interface YourSchoolType {
  name: string;
  code: string;
}

const NewTournament: React.FC = () => {
  
  type Severity = "success" | "info" | "warn" | "error";

  const showToast = (severity: Severity, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity, summary, detail, life: 3000 });
    }
  };

  const [schools, setSchools] = useState<YourSchoolType[]>([
    { name: "School 1", code: "u" },
    { name: "School 2", code: "v" },
    { name: "School 3", code: "w" },
    { name: "School 4", code: "x" },
  ]);


  const toast = useRef<Toast>(null);
  const stepperRef = useRef<any>(null);
  const [teamDialogVisible, setTeamDialogVisible] = useState(false);
  const [chipsValue, setChipsValue] = useState<string[]>([]);
  // const [dates, setDates] = useState<Date[]>([]);
  const [selectedGender, setSelectedGender] = useState(null);
  const [selectedSchool, setSelectedSchool] = useState<YourSchoolType | null>(null);
    const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<{ name: string; students: Student[] }[]>(
    []
  );
  const [teamName, setTeamName] = useState("");
  const [selectedSchoolsList, setSelectedSchoolsList] = useState<YourSchoolType[]>([]);
  const [tournamentName, setTournamentName] = useState("");
  const [location, setLocation] = useState("");
  const [matchDuration, setMatchDuration] = useState("");
  const [intervalBetweenMatches, setIntervalBetweenMatches] = useState("");
  const [tournamentDays, setTournamentDays] = useState<TournamentDay[]>([]);
  
  const [userSchool, setUserSchool] = useState<YourSchoolType | null>(null);
  const [filteredSchools, setFilteredSchools] = useState<YourSchoolType[]>([]);

  const [students, setStudents] = useState<Student[]>([]);

  const [selectedSchools, setSelectedSchools] = useState<YourSchoolType[]>([]);

  // const [intervalFields, setIntervalFields] = useState([]);
  // const [intervalFields, setIntervalFields] = useState<IntervalField[]>([]);
  const [dates, setDates] = useState<Date[]>([]);
  const [intervalFields, setIntervalFields] = useState<IntervalField[]>([]);

  const searchSchool = (event: { query: string }) => {
    let filtered: YourSchoolType[];
    if (!event.query.trim().length) {
      filtered = schools.filter((school: YourSchoolType) => 
        !selectedSchools.some((selected: YourSchoolType) => selected.code === school.code)
      );
    } else {
      filtered = schools.filter((school: YourSchoolType) => 
        school.name.toLowerCase().startsWith(event.query.toLowerCase()) &&
        !selectedSchools.some((selected: YourSchoolType) => selected.code === school.code)
      );
    }
    
    if (filtered.length === 0) {
      filtered.push({ name: `Add "${event.query}" as a new school`, code: 'new' });
    }
    
    setFilteredSchools(filtered);
  };

  // const onSchoolSelect = (e: { value: YourSchoolType }) => {
  //   if (e.value.code === 'new') {
  //     // Add new school
  //     const newSchoolName = e.value.name.replace('Add "', '').replace('" as a new school', '');
  //     const newSchool: YourSchoolType = { name: newSchoolName, code: `new-${Date.now()}` };
  //     setSchools(prevSchools => [...prevSchools, newSchool]);
  //     setSelectedSchools(prevSelected => [...prevSelected, newSchool]);
  //   } else {
  //     // Add existing school if not already selected
  //     if (!selectedSchools.some((school: YourSchoolType) => school.code === e.value.code)) {
  //       setSelectedSchools(prevSelected => [...prevSelected, e.value]);
  //     }
  //   }
  //   // Clear the selection after adding
  //   setSelectedSchool(null);
  // };


  const onSchoolSelect = (e: { value: YourSchoolType }) => {
    if (e.value.code === 'new') {
      // Add new school
      const newSchoolName = e.value.name.replace('Add "', '').replace('" as a new school', '');
      const newSchool: YourSchoolType = { name: newSchoolName, code: `new-${Date.now()}` };
      setSchools(prevSchools => [...prevSchools, newSchool]);
      setSelectedSchools(prevSelected => [...prevSelected, newSchool]);
    } else {
      // Add existing school if not already selected
      setSelectedSchools(prevSelected => {
        if (!prevSelected.some(school => school.code === e.value.code)) {
          return [...prevSelected, e.value];
        }
        return prevSelected;
      });
    }
    // Clear the selection after adding
    setSelectedSchool(null);
  };

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      const domain = email.split('@')[1];
      let school: YourSchoolType | null = null;
      
      switch (domain) {
        case 'school1.com':
          school = schools.find(s => s.name === 'School 1') || null;
          break;
        case 'school2.com':
          school = schools.find(s => s.name === 'School 2') || null;
          break;
        case 'school3.com':
          school = schools.find(s => s.name === 'School 3') || null;
          break;
        case 'school4.com':
          school = schools.find(s => s.name === 'School 4') || null;
          break;
      }
      
      if (school) {
        setUserSchool(school);
        setSelectedSchools(prevSelected => {
          const schoolToAdd: YourSchoolType = school!; // Use non-null assertion here
          if (!prevSelected.some(s => s.code === schoolToAdd.code)) {
            return [...prevSelected, schoolToAdd];
          }
          return prevSelected;
        });
      }
    }
  }, [schools]);

  const generateIntervalFields = (startDate: Dayjs, endDate: Dayjs) => {
    const fields: IntervalField[] = [];
    let currentDate = startDate;
    while (
      currentDate.isBefore(endDate) ||
      currentDate.isSame(endDate, "day")
    ) {
      fields.push({
        date: currentDate,
        startTime: null,
        endTime: null,
      });
      currentDate = currentDate.add(1, "day");
    }
    setIntervalFields(fields);
  };

  useEffect(() => {
    if (dates.length === 2) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      generateIntervalFields(start, end);
    } else {
      setIntervalFields([]);
    }
  }, [dates]);

  const handleIntervalChange = (
    index: number,
    field: "startTime" | "endTime",
    value: Dayjs | null
  ) => {
    const updatedFields = [...intervalFields];
    updatedFields[index] = {
      ...updatedFields[index],
      [field]: value,
    };
    setIntervalFields(updatedFields);
  };

  const handleNext = () => {
    stepperRef.current.nextCallback();
  };

  const handlePrev = () => {
    stepperRef.current.prevCallback();
  };

  const gender = [
    { name: "Boys", code: "b" },
    { name: "Girls", code: "g" },
  ];

  
  
  useEffect(() => {
    const fetchStudents = async () => {
      const token = localStorage.getItem("token");

      try {
        const response = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetAllStudents {
                getAllStudents {
                  age
                  grade
                  email
                  id
                  name
                  schoolID
                }
              }
            `,
          }),
        });

        const result = await response.json();
        setStudents(result.data.getAllStudents);
      } catch (error) {
        showToast("error", "Error", "Error fetching students");
        console.error("Error fetching students: ", error);
      }
    };

    fetchStudents();
  }, []);

  useEffect(() => {
    if (dates.length === 2) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      const daysDiff = end.diff(start, "day") + 1;

      const newTournamentDays = Array.from({ length: daysDiff }, (_, index) => {
        const currentDate = start.add(index, "day");
        return {
          date: currentDate.toISOString(),
          startTime: currentDate.hour(9).minute(0).second(0).toISOString(),
          endTime: currentDate.hour(17).minute(0).second(0).toISOString(),
        };
      });

      setTournamentDays(newTournamentDays);
    }
  }, [dates]);

  // if (!students) {
  //   return <div>Loading...</div>;
  // }

  // const filteredStudents = students.filter((student) =>

  //   student.name.toLowerCase().includes(searchTerm.toLowerCase())
  // );

  const filteredStudents = students.filter((student: Student) =>
    student.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const actionBodyTemplate = (rowData: Student) => {
    return (
      <Button
        icon="pi pi-eye"
        onClick={() => handleView(rowData)}
        className="p-button-rounded p-button-text"
      />
    );
  };

  const handleView = (student: Student) => {
    // Implement view logic here
  };

  const prepareCreateTournamentInput = () => {
    return {
      name: tournamentName,
      location: location,
      startDate: dates[0].toISOString(),
      endDate: dates[1].toISOString(),
      typeOfSport: "FOOTBALL",
      intervalBetweenMatches: parseInt(intervalBetweenMatches),
      tournamentDays: intervalFields
        .filter((field): field is IntervalField & { startTime: Dayjs; endTime: Dayjs } => 
          field.startTime !== null && field.endTime !== null
        )
        .map((field) => ({
          date: field.date.startOf('day').toISOString(),
          startTime: field.startTime.toISOString(),
          endTime: field.endTime.toISOString(),
        })),
      matchDuration: parseInt(matchDuration),
      participatingSchoolNames: selectedSchoolsList.map((school) => school.name),
    };
  };

  
  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const input = prepareCreateTournamentInput();
    console.log("Tournament input:", input);

    if (!input.name || !input.location || input.tournamentDays.length === 0 || 
      !input.matchDuration || input.participatingSchoolNames.length === 0) {
    showToast("error", "Error", "Please fill all required fields");
    return;
    }

    try {
      const response = await fetch("http://localhost:3000/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation CreateTournament($input: CreateTournamentInput!) {
              createTournament(input: $input) {
                message
                status
                tournament {
                  id
                  name
                  location
                  startDate
                  endDate
                  typeOfSport
                  organizingSchoolId
                  createdAt
                  updatedAt
                }
              }
            }
          `,
          variables: { input },
        }),
      });

      const result = await response.json();
      console.log("API response:", result);

      if (result.errors) {
        console.error("GraphQL errors:", result.errors);
        showToast(
          "error",
          "Error",
          "Failed to create tournament: " + result.errors[0].message
        );
      } else if (result.data && result.data.createTournament.status) {
        showToast("success", "Success", result.data.createTournament.message);
        // Handle successful creation (e.g., redirect to tournament page)
      } else {
        showToast(
          "error",
          "Error",
          "Failed to create tournament: " +
            (result.data?.createTournament?.message || "Unknown error")
        );
      }
    } catch (error) {
      console.error("Error creating tournament: ", error);
      showToast(
        "error",
        "Error",
        "Error creating tournament: " + (error as Error).message
      );
    }
  };

  const handleCreateTeam = async () => {
    if (teamName && selectedStudents.length > 0) {
      setTeams([...teams, { name: teamName, students: selectedStudents }]);
      setTeamDialogVisible(false);
      setTeamName("");
      setSelectedStudents([]);
    } else {
      showToast("error", "Error", "Fill all required fields");
      return;
    }

    const token = localStorage.getItem("token");

    if (teamName && selectedStudents.length > 0) {
      try {
        const response = await fetch("http://localhost:3000/graphql", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${token}`,
          },
          body: JSON.stringify({
            query: `
              mutation CreateTeam($input: CreateTeamInput!) {
                createTeam(input: $input) {
                  message
                  status
                }
              }
            `,
            variables: {
              input: {
                name: teamName,
                players: selectedStudents.map((student) =>
                  parseInt(student.id, 10)
                ),
                typeOfSport: "FOOTBALL",
              },
            },
          }),
        });

        const result = await response.json();

        if (
          result.data &&
          result.data.createTeam &&
          result.data.createTeam.status
        ) {
          setTeams([...teams, { name: teamName, students: selectedStudents }]);
          setTeamDialogVisible(false);
          setTeamName("");
          setSelectedStudents([]);
          showToast("success", "Success", "Team Created Successfully");
        } else {
          showToast("error", "Error", "Error creating team");
        }
      } catch (error) {
        showToast("error", "Error", "Error creating team");
        console.error("Error creating team: ", error);
      }
    } else {
      showToast("error", "Error", "Fill all required fields");
    }
  };

  
  return (
    <div className="card flex flex-column justify-content-center align-items-start">
      <FootballNavbar />

      <div
        className="w-full text-center mb-4"
        style={{ marginTop: "30px", textAlign: "left", marginLeft: "120px" }}
      >
        <h1 className="mb-4" style={{ fontSize: "25px", fontWeight: 700 }}>
          Create Tournament
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
          ORGANISE TOURNAMENT
        </h2>
        <p style={{ fontSize: "16px", textAlign: "center", color: "grey" }}>
          Create and customise the football tournament, teams to trophies!
        </p>
      </div>
      <div
        className="w-full lg:w-6 mx-auto"
        id="stepper-class"
        style={{ marginTop: "40px" }}
      >
        <Stepper ref={stepperRef}>
          <StepperPanel header="Choose Team">
            <div className="flex flex-column">
              <div
                className="p-fluid"
                style={{ display: "flex", justifyContent: "left" }}
              >
                <div
                  className="card"
                  onClick={() => setTeamDialogVisible(true)}
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                    flexDirection: "column",
                    padding: "3rem",
                    textAlign: "center",
                    cursor: "pointer",
                    borderRadius: "15px",
                    border: "1px dashed #051da0",
                    width: "30%",
                    height: "200px",
                  }}
                >
                  <i
                    className="pi pi-plus"
                    style={{ fontSize: "2rem", color: "#051da0" }}
                  ></i>
                  <p style={{ fontSize: "18px", color: "#051da0" }}>
                    Add new team
                  </p>
                </div>

                <Dialog
                  header="Add Team"
                  visible={teamDialogVisible}
                  onHide={() => setTeamDialogVisible(false)}
                  style={{
                    width: "90vw",
                    height: "90vh",
                    margin: "20px",
                    borderRadius: "15px",
                  }}
                >
                  <IconField iconPosition="left" className="input-box-pr">
                    <InputIcon className="pi pi-users"></InputIcon>
                    <InputText
                      id="teamName"
                      placeholder="Team name"
                      value={teamName}
                      onChange={(e) => setTeamName(e.target.value)}
                    />
                  </IconField>

                  <div
                    className="p-fluid"
                    style={{
                      display: "flex",
                      alignItems: "center",
                      height: "50px",
                      justifyContent: "space-between",
                      width: "100%",
                      margin: "20px 0",
                    }}
                  >
                    <div
                      className="p-input-icon-left"
                      id="pop-search"
                      style={{
                        width: "calc(100% - 900px)",
                        borderRadius: "20px",
                        border: "1px solid #ccc",
                        display: "flex",
                        alignItems: "center",
                      }}
                    >
                      <i
                        className="pi pi-search"
                        style={{ paddingLeft: "20px" }}
                      />
                      <InputText
                        id="team"
                        placeholder="Search Team"
                        className="p-mb-4 p-ml-2 pop-search-box"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        style={{
                          border: "none",
                          borderRadius: "20px",
                          outline: "none",
                          height: "37px",
                          paddingLeft: "40px",
                        }}
                      />
                    </div>
                    <Button
                      label="Create Team"
                      icon="pi pi-send"
                      onClick={handleCreateTeam}
                      className="p-button-success p-ml-4 pop-submit-button"
                      style={{
                        backgroundColor: "#051da0",
                        borderRadius: "20px",
                        width: "260px",
                        color: "white",
                        height: "37px",
                        justifyContent: "center",
                        alignItems: "center",
                        display: "flex",
                        padding: "20px",
                      }}
                    />
                  </div>
                  <div className="mt-4">
                    <DataTable
                      value={filteredStudents}
                      selection={selectedStudents}
                      onSelectionChange={(e) =>
                        setSelectedStudents(e.value as Student[])
                      }
                      dataKey="id"
                      selectionMode="multiple"
                    >
                      <Column
                        selectionMode="multiple"
                        headerStyle={{ width: "3em" }}
                      />
                      <Column
                        body={actionBodyTemplate}
                        headerStyle={{ width: "3em" }}
                      />
                      <Column field="name" header="Name" />
                      <Column field="age" header="Age" />
                      <Column field="grade" header="Grade" />
                      <Column field="email" header="Email" />
                      <Column field="id" header="ID" />
                      <Column field="schoolID" header="School ID" />
                    </DataTable>
                  </div>
                </Dialog>
              </div>

              <div style={{ display: "flex", justifyContent: "left" }}>
                {teams.map((team, index) => (
                  <div key={index} className="team-card">
                    <h3 className="team-name">{team.name}</h3>
                    <ul className="players-list">
                      {team.students.map((student) => (
                        <li key={student.id} className="player-card">
                          <div className="player-name">{student.name}</div>
                          <div className="player-age">{student.age} Years</div>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <br className="brbr" />
              <br className="brbr" />
              <div className="flex pt-4 justify-content-end">
                <Button
                  style={{
                    border: "1px solid #051da0",
                    padding: "7px 40px",
                    fontSize: "18px",
                    borderRadius: "10px",
                  }}
                  className="action-button"
                  label="Next"
                  icon="pi pi-angle-right"
                  iconPos="right"
                  onClick={handleNext}
                />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="School Details">
            <div className="flex flex-column">
              <div className="p-fluid">
                {/* <Dropdown
                  value={selectedSchool}
                  onChange={(e) => {
                    setSelectedSchool(e.value);
                    if (
                      !selectedSchoolsList.some(
                        (school) => school.code === e.value.code
                      )
                    ) {
                      setSelectedSchoolsList([...selectedSchoolsList, e.value]);
                    }
                  }}
                  options={schools}
                  optionLabel="name"
                  placeholder="Select a School"
                  className="input-box-pr-select"
                /> */}
                <AutoComplete
  value={selectedSchool}
  suggestions={filteredSchools}
  completeMethod={searchSchool}
  field="name"
  dropdown
  forceSelection
  onChange={(e) => setSelectedSchool(e.value)}
  onSelect={onSchoolSelect}
  placeholder="Select or add a School"
  className="input-box-pr-select"
/>

<div className="selected-schools-container" style={{ marginTop: "20px", width: "590px" }}>
  <h3>Selected Schools:</h3>
  {selectedSchools.map((school: YourSchoolType, index: number) => (
    <div key={index} className="selected-school">
      <span>{school.name}</span>
      <Button
        icon="pi pi-times"
        className="p-button-rounded p-button-danger p-ml-2"
        onClick={() => setSelectedSchools(prevSelected => 
          prevSelected.filter((s: YourSchoolType) => s.code !== school.code)
        )}
      />
    </div>
  ))}
</div>

                <br className="brbr" />
                <Dropdown
                  value={selectedGender}
                  onChange={(e) => setSelectedGender(e.value)}
                  options={gender}
                  optionLabel="name"
                  placeholder="Select a Gender"
                  className="input-box-pr-select"
                />
              </div>
              <br className="brbr" />
              <br className="brbr" />
              <div className="flex pt-4 justify-content-between">
                <Button
                  style={{
                    border: "1px solid #051da0",
                    padding: "7px 40px",
                    fontSize: "18px",
                    borderRadius: "10px",
                    marginRight: "20px",
                  }}
                  label="Back"
                  className="action-button"
                  severity="secondary"
                  icon="pi pi-angle-left"
                  onClick={handlePrev}
                />
                <Button
                  style={{
                    border: "1px solid #051da0",
                    padding: "7px 40px",
                    fontSize: "18px",
                    borderRadius: "10px",
                  }}
                  label="Next"
                  icon="pi pi-angle-right"
                  iconPos="right"
                  className="action-button"
                  onClick={handleNext}
                />
              </div>
            </div>
          </StepperPanel>
          <StepperPanel header="Tournament Details">
            <div className="flex flex-column">
              <div className="p-fluid">
                <br className="brbr" />
                <IconField iconPosition="left" className="input-box-pr">
                  <InputIcon className="pi pi-sitemap"></InputIcon>
                  <InputText
                    id="tournament"
                    placeholder="Tournament Name"
                    value={tournamentName}
                    onChange={(e) => setTournamentName(e.target.value)}
                  />
                </IconField>
                <br className="brbr" />
                <div className="mt-4">
                  <label>Tournament Dates</label>
                  <div className="flex">
                    <IconField
                      iconPosition="left"
                      className="input-box-pr-cal mr-2"
                      style={{
                        height: "50px",
                        borderRadius: "10px",
                        display: "inline-flex",
                      }}
                    >
                      <InputIcon
                        className="pi pi-calendar"
                        style={{ zIndex: "999" }}
                      ></InputIcon>
                      <Calendar
                        value={dates}
                        onChange={(e) => setDates(e.value as Date[])}
                        selectionMode="range"
                        placeholder="Select Date Range"
                        readOnlyInput
                        style={{ paddingLeft: "30px" }}
                        className="input-box-pr-calendar"
                        // touchUI
                      />
                    </IconField>
                  </div>
                </div>
                <br className="brbr" />
                {intervalFields.length > 0 && (
                  <div className="mt-4">
                    <h3 className="daily-timings">
                      Select Match Time for each Day
                    </h3>
                    <LocalizationProvider dateAdapter={AdapterDayjs}>
                      {intervalFields.map((field, index) => (
                        <div key={index} className="mb-3">
                          <h4 className="daily-time-date">
                            {field.date.format("MMMM D, YYYY")}
                          </h4>
                          <div className="flex gap-20 daily-time-range">
                            <TimePicker
                              label="Start Time"
                              value={field.startTime}
                              onChange={(newValue) =>
                                handleIntervalChange(
                                  index,
                                  "startTime",
                                  newValue
                                )
                              }
                              className="input-box-time-start"
                              sx={{
                                border: "none",
                                outline: "none",
                                borderRadius: "20px",
                                marginRight: "20px",
                                width: "220px",
                              }}
                            />
                            <TimePicker
                              label="End Time"
                              value={field.endTime}
                              onChange={(newValue) =>
                                handleIntervalChange(index, "endTime", newValue)
                              }
                              sx={{
                                border: "none",
                                outline: "none",
                                borderRadius: "20px",
                                width: "220px",
                                marginLeft:'160px'
                              }}
                            />
                          </div>
                        </div>
                      ))}
                    </LocalizationProvider>
                  </div>
                )}
                <div className="mt-4">
                  <br className="brbr" />
                  <IconField iconPosition="left" className="input-box-pr">
                    <InputIcon className="pi pi-hourglass"></InputIcon>
                    <InputText
                      id="duration"
                      placeholder="Match Duration (minutes)"
                      value={matchDuration}
                      onChange={(e) => setMatchDuration(e.target.value)}
                    />
                  </IconField>
                </div>
                <div className="mt-4">
                  <br className="brbr" />
                  <IconField iconPosition="left" className="input-box-pr">
                    <InputIcon className="pi pi-clock"></InputIcon>
                    <InputText
                      id="interval"
                      placeholder="Interval Between Matches (minutes)"
                      value={intervalBetweenMatches}
                      onChange={(e) =>
                        setIntervalBetweenMatches(e.target.value)
                      }
                    />
                  </IconField>
                </div>
                <div className="mt-4">
                  <br className="brbr" />
                  <IconField iconPosition="left" className="input-box-pr">
                    <InputIcon className="pi pi-map-marker"></InputIcon>
                    <InputText
                      id="location"
                      placeholder="Location"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                    />
                  </IconField>
                </div>
              </div>
              <br className="brbr" />
              <br className="brbr" />
              <div className="flex pt-4 justify-content-start">
                <Button
                  style={{
                    border: "1px solid #051da0",
                    padding: "7px 40px",
                    fontSize: "18px",
                    borderRadius: "10px",
                    marginRight: "20px",
                  }}
                  label="Back"
                  className="action-button"
                  severity="secondary"
                  icon="pi pi-angle-left"
                  onClick={handlePrev}
                />
                <Button
                  style={{
                    border: "1px solid #051da0",
                    padding: "7px 40px",
                    fontSize: "18px",
                    borderRadius: "10px",
                  }}
                  label="Create Tournament"
                  className="action-button"
                  severity="secondary"
                  icon="pi pi-sparkles"
                  onClick={handleSubmit}
                />
              </div>
            </div>
          </StepperPanel>
        </Stepper>
        <Toast ref={toast} position="top-right" />
      </div>
    </div>
  );
};

export default NewTournament;
