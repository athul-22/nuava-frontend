import React, { useRef, useState, useEffect } from "react";
import FootballNavbar from "../components/Navbar";
import { Stepper } from "primereact/stepper";
import { StepperPanel } from "primereact/stepperpanel";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
// import { Calendar,CalendarChangeEvent } from "primereact/calendar";
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
import { AutoComplete } from "primereact/autocomplete";
// import TextField from '@mui/material/TextField';
// import { Dayjs } from 'dayjs';
import { RadioButton } from "primereact/radiobutton";

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
  const [selectedSchool, setSelectedSchool] = useState<YourSchoolType | null>(
    null
  );
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedStudents, setSelectedStudents] = useState<Student[]>([]);
  const [teams, setTeams] = useState<{ name: string; students: Student[] }[]>(
    []
  );
  const [teamName, setTeamName] = useState("");
  const [selectedSchoolsList, setSelectedSchoolsList] = useState<
    YourSchoolType[]
  >([]);
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
  //OLD
  // const [dates, setDates] = useState<Date[]>([]);
  const [intervalFields, setIntervalFields] = useState<IntervalField[]>([]);

  const [fetchedTeams, setFetchedTeams] = useState<any[]>([]);
  // const [selectedTeam, setSelectedTeam] = useState<string | null>(null);
  const [selectedTeams, setSelectedTeams] = useState<string[]>([]);

  const [newSchoolDialogVisible, setNewSchoolDialogVisible] = useState(false);
  const [newSchoolName, setNewSchoolName] = useState("");

  // ********** SINGLE / MULTI DAY TOURNAMENT SELECTION **********

  const [tournamentType, setTournamentType] = useState<
    "single-day" | "multi-day"
  >("multi-day");
  const [singleDate, setSingleDate] = useState<Date | null>(null);
  const [dates, setDates] = useState<Date[]>([]);

  const handleTournamentTypeChange = (e: {
    value: "single-day" | "multi-day";
  }) => {
    setTournamentType(e.value);
    setDates([]);
    setSingleDate(null);
  };

  const handleDateSelection = (e: any) => {
    if (tournamentType === "single-day") {
      const selectedDate = e.value as Date;
      setSingleDate(selectedDate);
      setDates([selectedDate, selectedDate]);
    } else {
      const selectedDates = e.value as Date[];
      setDates(selectedDates);
    }
  };

  useEffect(() => {
    if (tournamentType === "single-day" && singleDate) {
      const singleDayjs = dayjs(singleDate);
      generateIntervalFields(singleDayjs, singleDayjs);
    } else if (dates.length === 2) {
      const start = dayjs(dates[0]);
      const end = dayjs(dates[1]);
      generateIntervalFields(start, end);
    } else {
      setIntervalFields([]);
    }
  }, [tournamentType, singleDate, dates]);

  const handleAddNewSchool = () => {
    if (newSchoolName.trim()) {
      const newSchool: YourSchoolType = {
        name: newSchoolName.trim(),
        code: `new-${Date.now()}`,
      };
      setSchools((prevSchools) => [...prevSchools, newSchool]);
      setSelectedSchools((prevSelected) => [...prevSelected, newSchool]);
      setNewSchoolName("");
      setNewSchoolDialogVisible(false);
    }
  };

  // const onSchoolSelect = (e: { value: YourSchoolType }) => {
  //   if (!selectedSchools.some(school => school.code === e.value.code)) {
  //     setSelectedSchools(prevSelected => [...prevSelected, e.value]);
  //   }
  //   setSelectedSchool(null);
  // };

  const removeSelectedSchool = (schoolToRemove: YourSchoolType) => {
    setSelectedSchools((prevSelected) =>
      prevSelected.filter((school) => school.code !== schoolToRemove.code)
    );
  };

  const handleTeamSelect = (teamId: string) => {
    setSelectedTeams((prevSelected) => {
      if (prevSelected.includes(teamId)) {
        return prevSelected.filter((id) => id !== teamId);
      } else {
        return [...prevSelected, teamId];
      }
    });
  };

  const fetchTeams = async () => {
    const token = localStorage.getItem("token");
    try {
      const response = await fetch("https://nuavasports.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `
            query GetAllAvailablePlayers($filters: getAllTeamsFilter) {
              getAllTeams(filters: $filters) {
                id
                name
                coachID
                typeOfSport
                players {
                  name
                  age
                }
              }
            }
          `,
          variables: {
            filters: {
              typeOfSport: "FOOTBALL",
            },
          },
        }),
      });

      const result = await response.json();
      if (result.data && result.data.getAllTeams) {
        setFetchedTeams(result.data.getAllTeams);
      } else {
        console.error("Error fetching teams:", result.errors);
        showToast("error", "Error", "Failed to fetch teams");
      }
    } catch (error) {
      console.error("Error fetching teams:", error);
      showToast("error", "Error", "Error fetching teams");
    }
  };

  useEffect(() => {
    fetchTeams();
  }, []);

  const searchSchool = (event: { query: string }) => {
    let filtered: YourSchoolType[];
    if (!event.query.trim().length) {
      filtered = schools.filter(
        (school: YourSchoolType) =>
          !selectedSchools.some(
            (selected: YourSchoolType) => selected.code === school.code
          )
      );
    } else {
      filtered = schools.filter(
        (school: YourSchoolType) =>
          school.name.toLowerCase().startsWith(event.query.toLowerCase()) &&
          !selectedSchools.some(
            (selected: YourSchoolType) => selected.code === school.code
          )
      );
    }

    if (filtered.length === 0) {
      filtered.push({
        name: `Add "${event.query}" as a new school`,
        code: "new",
      });
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

  // const onSchoolSelect = (e: { value: YourSchoolType }) => {
  //   if (e.value.code === "new") {
  //     // Add new school
  //     const newSchoolName = e.value.name
  //       .replace('Add "', "")
  //       .replace('" as a new school', "");
  //     const newSchool: YourSchoolType = {
  //       name: newSchoolName,
  //       code: `new-${Date.now()}`,
  //     };
  //     setSchools((prevSchools) => [...prevSchools, newSchool]);
  //     setSelectedSchools((prevSelected) => [...prevSelected, newSchool]);
  //   } else {
  //     // Add existing school if not already selected
  //     setSelectedSchools((prevSelected) => {
  //       if (!prevSelected.some((school) => school.code === e.value.code)) {
  //         return [...prevSelected, e.value];
  //       }
  //       return prevSelected;
  //     });
  //   }
  //   // Clear the selection after adding
  //   setSelectedSchool(null);
  // };

  const onSchoolSelect = (e: { value: YourSchoolType }) => {
    console.log("Selected school:", e.value);
    if (
      e.value &&
      !selectedSchools.some((school) => school.code === e.value.code)
    ) {
      setSelectedSchools((prevSelected) => {
        console.log("Previous selected schools:", prevSelected);
        const newSelected = [...prevSelected, e.value];
        console.log("New selected schools:", newSelected);
        return newSelected;
      });
    }
    setSelectedSchool(null);
  };

  useEffect(() => {
    const email = localStorage.getItem("email");
    if (email) {
      const domain = email.split("@")[1];
      let school: YourSchoolType | null = null;

      switch (domain) {
        case "school1.com":
          school = schools.find((s) => s.name === "School 1") || null;
          break;
        case "school2.com":
          school = schools.find((s) => s.name === "School 2") || null;
          break;
        case "school3.com":
          school = schools.find((s) => s.name === "School 3") || null;
          break;
        case "school4.com":
          school = schools.find((s) => s.name === "School 4") || null;
          break;
      }

      if (school) {
        setUserSchool(school);
        setSelectedSchools((prevSelected) => {
          const schoolToAdd: YourSchoolType = school!; // Use non-null assertion here
          if (!prevSelected.some((s) => s.code === schoolToAdd.code)) {
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
    while (currentDate.isSame(endDate) || currentDate.isBefore(endDate)) {
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
        const response = await fetch("https://nuavasports.com/api", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `jwt ${token}`,
          },
          body: JSON.stringify({
            query: `
              query GetAllAvailablePlayers($input: AvailablePlayersInput!) {
                    getAllAvailablePlayers(input: $input) {
                          id
                          email
                          name
                          schoolID
                          grade
                          age
                    }
                  }
            `,
            variables: {
              input: {
                typeOfSport: "FOOTBALL",
              },
            },
          }),
        });

        const result = await response.json();
        setStudents(result.data.getAllAvailablePlayers);
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

  // const prepareCreateTournamentInput = () => {
  //   return {
  //     name: tournamentName,
  //     location: location,
  //     startDate: dates[0].toISOString(),
  //     endDate: dates[1].toISOString(),
  //     typeOfSport: "FOOTBALL",
  //     gender:selectedGender,
  //     intervalBetweenMatches: parseInt(intervalBetweenMatches),
  //     tournamentDays: intervalFields
  //       .filter(
  //         (
  //           field
  //         ): field is IntervalField & { startTime: Dayjs; endTime: Dayjs } =>
  //           field.startTime !== null && field.endTime !== null
  //       )
  //       .map((field) => ({
  //         date: field.date.startOf("day").toISOString(),
  //         startTime: field.startTime.toISOString(),
  //         endTime: field.endTime.toISOString(),
  //       })),
  //     matchDuration: parseInt(matchDuration),
  //     participatingSchoolNames: selectedSchools.map((school) => school.name),
  //   };
  // };

  const prepareCreateTournamentInput = () => {
    const startDate = tournamentType === "single-day" ? singleDate : dates[0];
    const endDate = tournamentType === "single-day" ? singleDate : dates[1];

    return {
      name: tournamentName,
      location: location,
      startDate: startDate?.toISOString(),
      endDate: endDate?.toISOString(),
      typeOfSport: "FOOTBALL",
      gender: selectedGender,
      intervalBetweenMatches: parseInt(intervalBetweenMatches),
      tournamentDays: intervalFields
        .filter(
          (
            field
          ): field is IntervalField & { startTime: Dayjs; endTime: Dayjs } =>
            field.startTime !== null && field.endTime !== null
        )
        .map((field) => ({
          date: field.date.startOf("day").toISOString(),
          startTime: field.startTime.toISOString(),
          endTime: field.endTime.toISOString(),
        })),
      matchDuration: parseInt(matchDuration),
      participatingSchoolNames: selectedSchools.map((school) => school.name),
    };
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    const input = prepareCreateTournamentInput();
    console.log("Tournament input:", input);

    if (
      !input.name ||
      !input.location ||
      input.tournamentDays.length === 0 ||
      !input.matchDuration ||
      input.participatingSchoolNames.length === 0
    ) {
      showToast("error", "Error", "Please fill all required fields");
      return;
    }

    try {
      const response = await fetch("https://nuavasports.com/api", {
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

      
        window.location.href = "/dashboard/football";

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

  // const handleSubmit = async () => {
  //   const token = localStorage.getItem("token");
  //   const input = prepareCreateTournamentInput();
  //   console.log("Tournament input:", input);
  
  //   if (
  //     !input.name ||
  //     !input.location ||
  //     input.tournamentDays.length === 0 ||
  //     !input.matchDuration ||
  //     input.participatingSchoolNames.length === 0
  //   ) {
  //     showToast("error", "Error", "Please fill all required fields");
  //     return;
  //   }
  
  //   try {
  //     const response = await fetch("https://nuavasports.com/api", {
  //       method: "POST",
  //       headers: {
  //         "Content-Type": "application/json",
  //         Authorization: `jwt ${token}`,
  //       },
  //       body: JSON.stringify({
  //         query: `
  //           mutation CreateTournament($input: CreateTournamentInput!) {
  //             createTournament(input: $input) {
  //               message
  //               status
  //               tournament {
  //                 id
  //                 name
  //                 location
  //                 startDate
  //                 endDate
  //                 typeOfSport
  //                 organizingSchoolId
  //                 createdAt
  //                 updatedAt
  //               }
  //             }
  //           }
  //         `,
  //         variables: { input },
  //       }),
  //     });
  
  //     const result = await response.json();
  //     console.log("API response:", result);
  
  //     if (result.errors) {
  //       console.error("GraphQL errors:", result.errors);
  //       showToast("error", "Error", "Failed to create tournament: " + result.errors[0].message);
  //     } else if (result.data && result.data.createTournament.status) {
  //       showToast("success", "Success", result.data.createTournament.message);
  
  //       // Store the tournament ID in local storage
  //       const tournamentId = result.data.createTournament.tournament.id;
  //       localStorage.setItem("schoolID", tournamentId);
  
  //       // Redirect to the brackets page
  //       window.location.href = "/brackets";
  //     } else {
  //       showToast("error", "Error", "Failed to create tournament: " + (result.data?.createTournament?.message || "Unknown error"));
  //     }
  //   } catch (error) {
  //     console.error("Error creating tournament: ", error);
  //     showToast("error", "Error", "Error creating tournament: " + (error as Error).message);
  //   }
  // };
  


  
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
        const response = await fetch("https://nuavasports.com/api", {
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
                // gender: selectedGender,
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
      <FootballNavbar buttontext="Create Tournament / Match" />

      <div
        className="w-full text-center mb-4 create-tournament-top-texts"
        style={{}}
      >
        {/* <h1 className="mb-4" style={{ fontSize: "25px", fontWeight: 700 }}>
          Create Tournament
        </h1> */}
        <h2
          style={{
            fontSize: "20px",
            fontWeight: 500,
            textAlign: "center",
            marginTop: "20px",
            color: "grey",
          }}
          className="h2-top-create-tournament"
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
                  className="card create-new-team"
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
                    // width: "24%",
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
                  style={{}}
                  className="add-team-dialog-style"
                >
                  <IconField
                    iconPosition="left"
                    className="input-box-pr"
                    style={{ marginTop: "20px" }}
                  >
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
                      className="p-input-icon-left pop-search"
                      id="pop-search"
                      // style={{
                      //   // width: "calc(100% - 900px)",
                      //   borderRadius: "10px",
                      //   height:'50px',
                      //   border: "1px solid silver",
                      //   display: "flex",
                      //   alignItems: "center",
                      // }}
                    >
                      <i
                        className="pi pi-search"
                        style={{ paddingLeft: "20px" }}
                      />
                      <InputText
                        id="team"
                        placeholder="Search Student"
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
                      style={{}}
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
                      className="data-table-popup"
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
                      {/* <Column field="id" header="ID" /> */}
                      {/* <Column field="schoolID" header="School ID" /> */}
                    </DataTable>
                  </div>
                </Dialog>
              </div>

              {/* <div style={{ display: "flex", justifyContent: "left" }}>
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
              </div> */}

              <div
                style={{
                  display: "flex",
                  flexWrap: "wrap",
                  justifyContent: "left",
                }}
              >
                {[...teams, ...fetchedTeams].map((team, index) => (
                  <div
                    key={index}
                    className={`team-card ${
                      selectedTeams.includes(team.id) ? "selected" : ""
                    }`}
                    onClick={() => handleTeamSelect(team.id)}
                  >
                    <h3 className="team-name">{team.name}</h3>
                    <ul className="players-list">
                      {(team.students || team.players).map(
                        (player: any, playerIndex: number) => (
                          <li key={playerIndex} className="player-card">
                            <div className="player-name">{player.name}</div>
                            {/* <div className="player-age">{player.age} Years</div> */}
                          </li>
                        )
                      )}
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
              {/* <div className="p-fluid">
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

                <div
                  className="selected-schools-container"
                  style={{ marginTop: "20px", width: "590px" }}
                >
                  <h3>Selected Schools:</h3>
                  {selectedSchools.map(
                    (school: YourSchoolType, index: number) => (
                      <div key={index} className="selected-school">
                        <span>{school.name}</span>
                        <Button
                          icon="pi pi-times"
                          className="p-button-rounded p-button-danger p-ml-2"
                          onClick={() =>
                            setSelectedSchools((prevSelected) =>
                              prevSelected.filter(
                                (s: YourSchoolType) => s.code !== school.code
                              )
                            )
                          }
                        />
                      </div>
                    )
                  )}
                </div> */}

              <div className="p-fluid">
                <div>
                  {/* <Dropdown
      value={selectedSchool}
      options={schools}
      onChange={(e) => setSelectedSchool(e.value)}
      optionLabel="name"
      placeholder="Select a School"
      className="input-box-pr-select mr-2"
    /> */}
                  <Dropdown
                    value={selectedSchool}
                    options={schools}
                    onChange={onSchoolSelect}
                    optionLabel="name"
                    placeholder="Select a School"
                    className="input-box-pr-select mr-2"
                  />
                  <Button
                    label="Add New School +"
                    // icon="pi pi-plus"
                    onClick={() => setNewSchoolDialogVisible(true)}
                    className="p-button-outlined add-new-school-button"
                  />
                </div>
                <br></br>
                <br></br>
                <div className="selected-schools-container mt-4">
                  <h3>Selected Schools:</h3>
                  {selectedSchools.map(
                    (school: YourSchoolType, index: number) => (
                      <div key={index} className="selected-school">
                        <span>{school.name}</span>
                        <Button
                          icon="pi pi-times"
                          className="p-button-rounded p-button-danger p-button-text"
                          onClick={() => removeSelectedSchool(school)}
                        />
                      </div>
                    )
                  )}
                </div>

                <Dialog
                  header="Add New School"
                  className="add-new-school-create-tournament"
                  visible={newSchoolDialogVisible}
                  onHide={() => setNewSchoolDialogVisible(false)}
                  style={{  }}
                  footer={
                    <div>
                      <Button
                        label="Add"
                        icon="pi pi-check"
                        style={{
                          color: "white",
                          backgroundColor: "#051da0",
                          padding: "5px 20px",
                        }}
                        onClick={handleAddNewSchool}
                        autoFocus
                      />
                    </div>
                  }
                >
                  <div className="p-fluid">
                    <InputText
                      value={newSchoolName}
                      onChange={(e) => setNewSchoolName(e.target.value)}
                      placeholder="Enter school name"
                      className="input-box-pr"
                      style={{ border: "1px solid #eee", marginTop: "10px" }}
                    />
                  </div>
                </Dialog>
              </div>

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
                <div className="gender-selection">
                  <h3>Select Gender</h3>
                  <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="gender1"
                        name="gender"
                        value="BOYS"
                        onChange={(e) => setSelectedGender(e.value)}
                        checked={selectedGender === "BOYS"}
                      />
                      <label htmlFor="gender1" className="p-ml-2">
                        Boys
                      </label>
                    </div>
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="gender2"
                        name="gender"
                        value="GIRLS"
                        onChange={(e) => setSelectedGender(e.value)}
                        checked={selectedGender === "GIRLS"}
                      />
                      <label htmlFor="gender2" className="p-ml-2">
                        Girls
                      </label>
                    </div>
                  </div>
                </div>
                <br className="brbr" />

                <div className="mt-4">
                  <h3 style={{ marginBottom: "10px" }}>Tournament Type</h3>

                  <div className="p-formgroup-inline">
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="tournamentType1"
                        name="tournamentType"
                        value="single-day"
                        onChange={handleTournamentTypeChange}
                        checked={tournamentType === "single-day"}
                      />
                      <label htmlFor="tournamentType1" className="p-ml-2">
                        Single Day Match
                      </label>
                    </div>
                    <div className="p-field-radiobutton">
                      <RadioButton
                        inputId="tournamentType2"
                        name="tournamentType"
                        value="multi-day"
                        onChange={handleTournamentTypeChange}
                        checked={tournamentType === "multi-day"}
                      />
                      <label htmlFor="tournamentType2" className="p-ml-2">
                        Multi-Day Tournament
                      </label>
                    </div>
                  </div>
                </div>
                <br className="brbr" />
                <div className="mt-4">
                  <label>
                    Tournament Date{tournamentType === "multi-day" ? "s" : ""}
                  </label>
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
                      {tournamentType === "single-day" ? (
                        <Calendar
                          value={singleDate}
                          onChange={handleDateSelection}
                          selectionMode="single"
                          placeholder="Select Date"
                          readOnlyInput
                          style={{ paddingLeft: "30px" }}
                          className="input-box-pr-calendar"
                        />
                      ) : (
                        <Calendar
                          value={dates}
                          onChange={handleDateSelection}
                          selectionMode="range"
                          placeholder="Select Date Range"
                          readOnlyInput
                          style={{ paddingLeft: "30px" }}
                          className="input-box-pr-calendar"
                        />
                      )}
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
                          <div className=" daily-time-range" style={{display:'flex',flexDirection:'column'}}>
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
                                marginTop:'10px',
                                // marginLeft: "160px",
                              }}
                              className="input-box-time-end"
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
                  label="Create Tournament / Match"
                  className="action-button-submit"
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
