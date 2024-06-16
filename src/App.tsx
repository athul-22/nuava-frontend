// src/App.tsx
import React from "react";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { ApolloClient, InMemoryCache, ApolloProvider } from "@apollo/client";
import Onboarding from "./components/Onboarding";
import Login from "./components/Login";
import Register from "./components/RegisterCoach";
import SendCoachEmailOTP from "./components/Coach/SendCoachEmailOTP";
import SuccessCoachEmail from "./components/Coach/SuccessCoachEmail";

// Set up Apollo Client
const client = new ApolloClient({
  uri: 'http://localhost:3000/graphql',
  cache: new InMemoryCache(),
});

const App: React.FC = () => {
  return (
    <ApolloProvider client={client}>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Onboarding />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/send-coach-email-otp" element={<SendCoachEmailOTP />} />
          <Route path="/success-coach-email" element={<SuccessCoachEmail />} />
        </Routes>
      </BrowserRouter>
    </ApolloProvider>
  );
};

export default App;
