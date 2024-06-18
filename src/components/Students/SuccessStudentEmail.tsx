import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { gql, useMutation, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Notyf } from "notyf";
import FOOTERCOMMON from "../../assets/FOOTERCOMMON.png";
import "./SuccessStudentEmail.css";
import TICK from '../../assets/TICK.png';

// Initialize Notyf for notifications
const notyf = new Notyf({
  duration: 2000,
  position: {
    x: 'right',
    y: 'top',
  },
  types: [
    {
      type: 'warning',
      background: 'orange',
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'warning'
      }
    },
    {
      type: 'success',
      background: 'green',
      icon: {
        className: 'material-icons',
        tagName: 'i',
        text: 'check'
      }
    },
    {
      type: 'error',
      background: 'red',
      duration: 2000,
      dismissible: false
    }
  ]
});

const REGISTER_STUDENT = gql`
  mutation RegisterStudent($input: RegisterStudentInput!) {
    registerStudent(input: $input) {
      message
      status
      token
    }
  }
`;

// Create an Apollo client instance with the temporary token in the headers
const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('tempToken');
  return {
    headers: {
      ...headers,
      Authorization: token ? `jwt ${token}` : "",
    }
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const SuccessStudentEmail: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  // State for user inputs
  const [name, setName] = useState("");
  const [schoolID, setSchoolID] = useState("");
  const [grade, setGrade] = useState("");
  const [age, setAge] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") ?? "");

  const [registerStudent, { loading, error }] = useMutation(REGISTER_STUDENT, {
    client
  });

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const handleComplete = async () => {
    if (!name || !schoolID || !grade || !age || !password || !email) {
      notyf.error('Please fill all fields!');
      return;
    }

    try {
      const response = await registerStudent({
        variables: {
          input: {
            email: email,
            password: password,
            name: name,
            schoolID: parseInt(schoolID, 10),
            grade: grade,
            age: parseInt(age, 10)
          },
        },
      });

      if (response.data?.registerStudent.status) {
        localStorage.setItem('token', response.data.registerStudent.token);
        localStorage.setItem('name', name);
        localStorage.setItem('schoolID', schoolID);
        localStorage.setItem('grade', grade);
        localStorage.setItem('age', age.toString());

        notyf.success('Registration successful!');
        window.location.href = "/dashboard";
      } else {
        notyf.error(response.data?.registerStudent.message || 'Error occurred during registration');
      }
    } catch (err) {
      console.error("Error:", err);
      notyf.error('An error occurred during registration.');
    }
  };

  return (
    <div className="success-coach-email-container">
      <div className="left-section">
        <div className="context" style={{display:'flex',justifyContent:'center',alignItems:'center',flexDirection:'column'}}>
          <img src={TICK} height="120px" width="120px" alt="tick" className="tick"/>
          <br/>
          <p className="left-text" > Account Verified Successfully</p>
        </div>

        {showConfetti && (
          <Confetti
            numberOfPieces={700}
            recycle={false}
            gravity={0.05}
            initialVelocityX={2}
            initialVelocityY={10}
            width={window.innerWidth}
            height={window.innerHeight / 2}
          />
        )}
      </div>

      <div className="right-section">
        <div className="title">Complete the Profile</div>
        <div className="input-group">
          <input
            type="text"
            id="name"
            className="input-field"
            placeholder="Name"
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            id="schoolID"
            className="input-field"
            placeholder="School ID"
            value={schoolID}
            onChange={(e) => setSchoolID(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            id="grade"
            className="input-field"
            placeholder="Grade"
            value={grade}
            onChange={(e) => setGrade(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="text"
            id="age"
            className="input-field"
            placeholder="Age"
            value={age}
            onChange={(e) => setAge(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
        </div>

        <div className="input-group">
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder="Email"
            value={email}
            disabled
          />
        </div>

        <button className="complete-button" onClick={handleComplete} disabled={loading}>
          {loading ? "Completing..." : "Complete"}
        </button>
        
        {error && (
          <div className="error-message">
            <p className="error-message-text">{error.message}</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default SuccessStudentEmail;
