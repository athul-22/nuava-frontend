// src/App.tsx
// @ts-ignore
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Onboarding from "./components/Onboarding";
import Login from "./components/Login";
import SendCoachEmailOTP from "./components/Coach/SendCoachEmailOTP";
import SuccessCoachEmail from "./components/Coach/SuccessCoachEmail";
// import Dashboad from "./components/Dashboard";
import SendStudentEmailOTP from "./components/Students/SendStudentEmailOTP";
import SuccessStudentEmail from './components/Students/SuccessStudentEmail';
import CoachLogin from "./components/Coach/CoachLogin";
import StudentLogin from './components/Students/StudentLogin';
import Dashboard from './components/Dashboard'
import NewTournament from './components/NewTournament'
import FootballDashboard from './components/Football/FootballDashboard'
import Calender from "./components/Calender";
import URLPage from "./components/URLPage";
import IHMatches from './components/IH Matches/IHMatches'
import CreateMatch from './components/IH Matches/CreateMatch'
import About from './components/About'
import Contact from './components/Contact'
import Brackets from "./components/Brackets.jsx";
import Profile from "./components/Profile";
import Matches from "./components/Football/Matches";

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'https://nuavasports.com/graphql',
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          {/* <Route path="/login" element={<Login />} /> */}
          {/* COACH ROUTES */}
          {/* <Route path="/send-coach-email-otp" element={<SendCoachEmailOTP />} /> */}
          <Route path="/coach/register" element={<SendCoachEmailOTP />} />
          <Route path="/coach/success" element={<SuccessCoachEmail />} />
          {/* <Route path="/success-coach-email" element={<SuccessCoachEmail />} /> */}
          <Route path="/coach/login" element={<CoachLogin />} />

          {/* STUDENTS ROUTES */}
          <Route path="/student/register" element={<SendStudentEmailOTP />} />
          <Route path="/student/success" element={<SuccessStudentEmail />} />
          <Route path="/student/login" element={<StudentLogin />} />
          {/* COMMON ROUTES */}
          {/* <Route path="/login" element={<Login />} /> */}
          <Route path="/dashboard" element={<Dashboard/>} />
          <Route path="/forgotpassword" element={<h1>Forgot Password</h1>} />
          <Route path="/resetpassword" element={<h1>Reset Password</h1>} />
          <Route path="/tournament/create" element={<NewTournament />} />
          <Route path="/dashboard/football" element={<FootballDashboard />} />
          <Route path="/calender" element={<Calender />} />
          <Route path="/brackets" element={<Brackets />} />
          <Route path="/dashboard/inter-house-matches" element={<IHMatches />} />
          <Route path="/create-match" element={<CreateMatch />} />
          <Route path="/urls" element={<URLPage />} />
          <Route path="/about" element={<About/>} />
          <Route path="/profile" element={<Profile/>} />
          <Route path="/contact" element={<Contact/>} />
          <Route path="/football/matches" element={<Matches/>} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
