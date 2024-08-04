import React, { useState, useEffect, useMemo, useRef } from "react";
import { Bracket, Seed, SeedItem, SeedTeam } from "react-brackets";
import { usePopper } from "react-popper";
import Navbar from "./Navbar";
import menuOptionsWithIcons from "./menuOptionsWithIcons";
import Skeleton from "react-loading-skeleton";
import "react-loading-skeleton/dist/skeleton.css";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import {
  gql,
  useQuery,
  useMutation,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import OnboardingNav from "./OnboardingNav";
import { useParams } from 'react-router-dom';


const token = localStorage.getItem("token");

const client = new ApolloClient({
  link: createHttpLink({
    uri: "https://nuavasports.com/api",
    headers: {
      Authorization: `jwt ${token}`,
    },
  }),
  cache: new InMemoryCache(),
});

const PopperMenu = ({
  isOpen,
  onClose,
  title,
  anchorEl,
  options,
  onOptionClick,
}) => {
  const [popperElement, setPopperElement] = useState(null);
  const menuRef = useRef(null);
  const { styles, attributes } = usePopper(anchorEl, popperElement, {
    placement: "bottom-start",
    modifiers: [{ name: "offset", options: { offset: [0, 8] } }],
  });

  const determineTeamStyle = (team, fixtureState) => {
    if (fixtureState === "STARTED" || fixtureState === "ENDED") {
      return team.isWinner
        ? { color: "green", fontWeight: "bold" }
        : { color: "red" };
    }
    return {
      color: "grey",
      borderLeft: "5px solid grey",
      marginTop: "10px",
      fontSize: "20px",
    };
  };

  useEffect(() => {
    const handleOutsideClick = (event) => {
      if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !anchorEl.contains(event.target)
      ) {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("mousedown", handleOutsideClick);
    }

    return () => {
      document.removeEventListener("mousedown", handleOutsideClick);
    };
  }, [isOpen, onClose, anchorEl]);

  if (!isOpen) return null;

  return (
    <div
      // ref={setPopperElement}
      ref={(el) => {
        setPopperElement(el);
        menuRef.current = el;
      }}
      style={{
        ...styles.popper,
        backgroundColor: "white",
        padding: "10px",
        borderRadius: "5px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.2)",
        zIndex: 1000,
        minWidth: "150px",
      }}
      {...attributes.popper}
    >
      <h3
        style={{
          margin: "0 0 10px 0",
          borderBottom: "1px solid #eee",
          paddingBottom: "5px",
          fontSize: "14px",
        }}
      >
        {title}
      </h3>
      <ul style={{ listStyle: "none", padding: 0, margin: 0 }}>
        {options.map((item) => (
          <li
            key={item.label}
            style={{
              padding: "10px 10px",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              fontSize: "14px",
              color: item.style?.color || "inherit",
            }}
            onClick={() => {
              onOptionClick(item.onClick);
              onClose();
            }}
          >
            <item.icon style={{ marginRight: "20px" }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomSeed = ({ seed, breakpoint }) => {
  const determineFixtureStyle = (fixture) => {
    console.log("Fixture state:", fixture.state, "Teams:", fixture.teams);

    if (fixture.state === "DONE" || fixture.state === "ENDED") {
      const winningTeam = fixture.teams.find((team) => team.isWinner);
      if (winningTeam) {
        console.log("Winning team found:", winningTeam.name);
        return { borderLeft: "5px solid green" };
      } else {
        console.log("No winning team found");
        return { borderLeft: "5px solid red" };
      }
    } else if (fixture.state === "STARTED" || fixture.state === "LIVE") {
      return { borderLeft: "5px solid orange" };
    } else if (fixture.state === "PENDING" || fixture.state === "NOT_STARTED") {
      return { borderLeft: "5px solid grey" };
    }

    console.log("Default style applied");
    return { borderLeft: "5px solid grey" }; // Default style
  };

  const fixtureStyle = useMemo(() => determineFixtureStyle(seed), [seed]);

  const formatDateTime = (dateTimeString) => {
    const date = new Date(dateTimeString);
    return date.toLocaleString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const determineTeamStyle = (team, fixtureState) => {
    if (fixtureState === "DONE") {
      if (team.resultText === "LOST") {
        return { borderLeft: "5px solid red" };
      } else if (team.resultText === "WON") {
        return { borderLeft: "5px solid green" };
      }
    } else if (fixtureState === "PENDING") {
      return { borderLeft: "5px solid grey" };
    }
    return {};
  };

  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 16 }}>
      <div style={{ marginBottom: "10px", textAlign: "center" }}>
        <div style={{ fontSize: "14px", color: "#666" }}>
          {formatDateTime(seed.date)}
        </div>
      </div>
      <SeedItem
        style={{
          ...fixtureStyle,
          backgroundColor: "white",
          color: "black",
          padding: "20px",
          borderRadius: "5px",
          border: "1px solid #eee",
          cursor: "pointer",
        }}
        // onClick={(e) => onFixtureClick(e, seed)}
      >
        <div>
          {seed.teams.map((team, index) => (
            <SeedTeam key={index} style={determineTeamStyle(team, seed.state)}>
              {team.name || "NO TEAM"} {team.score ? `(${team.score})` : ""}
            </SeedTeam>
          ))}
        </div>
      </SeedItem>
    </Seed>
  );
};

const BracketsComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [loading, setLoading] = useState(true);

  const schoolid = parseInt(useParams().id);
  console.log(schoolid.id)
  const fetchBracketsData = async () => {
    try {
      const token = localStorage.getItem("token");
      // const schoolid = parseInt(localStorage.getItem("schoolID"));
      
      const response = await fetch("https://nuavasports.com/api", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `query GetBracketsWithoutAuth($input: GetBracketsInput!) {
  getBracketsWithoutAuth(input: $input) {
    id
    name
    nextMatchId
    tournamentRoundText
    startTime
    state
    participants {
      id
      name
      resultText
      isWinner
      status
      score
    }
  }
}`,
          variables: { input: { tournamentId: schoolid } },
        }),
      });

      const result = await response.json();
      const brackets = result.data?.getBracketsWithoutAuth;

      if (brackets) {
        const mappedRounds = brackets.reduce((acc, match) => {
          const roundIndex =
            parseInt(match.tournamentRoundText.match(/\d+/)[0], 10) - 1;
          if (!acc[roundIndex]) {
            acc[roundIndex] = { title: `Round ${roundIndex + 1}`, seeds: [] };
          }
          acc[roundIndex].seeds.push({
            id: match.id,
            name: match.name,
            date: match.startTime,
            state: match.state.toUpperCase(),
            teams: match.participants.map((participant) => ({
              id: participant.id,
              name: participant.name,
              isWinner: participant.isWinner,
              resultText: participant.resultText,
              status: participant.status,
              score: participant.score,
            })),
          });
          return acc;
        }, []);

        console.log("Mapped rounds:", mappedRounds);
        setRounds(mappedRounds);
      }
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracketsData();
  }, []);

  useEffect(() => {
    console.log("Rounds updated:", rounds);
  }, [rounds]);

  return (
    <ApolloProvider client={client}>
      {/* <Navbar buttontext="Create Tournament / Match" /> */}
      <div style={{display:'flex',justifyContent:'center',marginTop:'20px'}}>
      <OnboardingNav />

      </div>
      
      <div
        style={{
          
          display: "flex",
          justifyContent: "center",
          // padding: "200px",
          backgroundColor: "white",
          fontSize: "24px",
          flexDirection:'column',
          
        }}
      >
        <h1 style={{marginTop:'100px',}} className='titleihmatch-copylink'>NUAVA</h1>
        {loading ? (
          <Skeleton height={40} count={10} />
        ) : rounds ? (
          <Bracket
            rounds={rounds}
            renderSeedComponent={(props) => <CustomSeed {...props} />}
          />
        ) : (
         <div>
           <img
            src="https://static.vecteezy.com/system/resources/previews/010/856/652/non_2x/no-result-data-document-or-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg"
            height="100px"
            width="200px"
            alt="No data"
          />
          <div>Tournament Not found</div>
          </div>
        )}
        <PopperMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          title={selectedFixture ? `Match ${selectedFixture.id}` : ""}
          anchorEl={anchorEl}
          options={menuOptionsWithIcons}
          // onOptionClick={handleOptionClick}
        />
        
      </div>
    </ApolloProvider>
  );
};

export default BracketsComponent;
