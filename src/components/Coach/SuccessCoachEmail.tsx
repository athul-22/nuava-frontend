import React, { useState, useEffect } from "react";
import Confetti from "react-confetti";
import { gql, useMutation, ApolloClient, InMemoryCache, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Notyf } from "notyf";
import FOOTERCOMMON from "../../assets/FOOTERCOMMON.png";
import "./SuccessCoachEmail.css";
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

const REGISTER_COACH = gql`
  mutation RegisterCoach($input: RegisterCoachInput!) {
    registerCoach(input: $input) {
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

const SuccessCoachEmail: React.FC = () => {
  const [showConfetti, setShowConfetti] = useState(false);

  // State for user inputs
  const [name, setName] = useState("");
  const [mobile, setMobile] = useState("");
  const [password, setPassword] = useState("");
  const [email, setEmail] = useState(localStorage.getItem("email") ?? "");

  const [registerCoach, { loading, error }] = useMutation(REGISTER_COACH, {
    client
  });

  useEffect(() => {
    setShowConfetti(true);
  }, []);

  const handleComplete = async () => {
    if (!name || !mobile || !password || !email) {
      notyf.error('Please fill all fields!');
      return;
    }

    try {
      const response = await registerCoach({
        variables: {
          input: {
            email: email,
            password: password,
            name: name,
            phone: mobile
          },
        },
      });

      if (response.data?.registerCoach.status) {
        localStorage.setItem('token', response.data.registerCoach.token);
        localStorage.setItem('name', name);
        localStorage.setItem('mobile', mobile);

        notyf.success('Registration successful!');
        window.location.replace("http://localhost:3001/dashboard");
      } else {
        notyf.error(response.data?.registerCoach.message || 'Error occurred during registration');
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

        {/* <div className="area">
          <ul className="circles">
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
            <li></li>
          </ul>
        </div> */}

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
            placeholder=" "
            value={name}
            onChange={(e) => setName(e.target.value)}
          />
          <label htmlFor="name" className="input-label">Name</label>
        </div>

        <div className="input-group">
          <input
            type="text"
            id="mobile"
            className="input-field"
            placeholder=" "
            value={mobile}
            onChange={(e) => setMobile(e.target.value)}
          />
          <label htmlFor="mobile" className="input-label">Mobile Number</label>
        </div>

        <div className="input-group">
          <input
            type="password"
            id="password"
            className="input-field"
            placeholder=" "
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <label htmlFor="password" className="input-label">Password</label>
        </div>

        <div className="input-group">
          <input
            type="email"
            id="email"
            className="input-field"
            placeholder=" "
            value={email}
            disabled
          />
          <label htmlFor="email" className="input-label">Email</label>
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

      {/* <img
        src={FOOTERCOMMON}
        alt="Footer"
        className="footer-image-mobile-only"
      /> */}
    </div>
  );
};

export default SuccessCoachEmail;
