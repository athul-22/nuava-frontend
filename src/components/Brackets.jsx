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

// const CustomSeed = ({ seed, breakpoint, onFixtureClick }) => {
//   const determineFixtureStyle = (fixture) => {
//     switch (fixture.state) {
//       case 'Pending':
//         return { borderLeft: '5px solid grey' };
//       case 'Live':
//         return { borderLeft: '5px solid red' };
//       case 'Ended':
//         return { borderLeft: '5px solid green' };
//       default:
//         return { borderLeft: '5px solid grey' };
//     }
//   };

//   return (
//     <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 16 }}>
//       <SeedItem
//         style={{
//           ...determineFixtureStyle(seed),
//           backgroundColor: 'white',
//           color: 'black',
//           padding: '30px',
//           borderRadius: '5px',
//           border: '1px solid #eee',
//           cursor: 'pointer',
//         }}
//         onClick={(e) => onFixtureClick(e, seed)}
//       >
//         <div>
//           {seed.teams.map((team, index) => (
//             <SeedTeam
//               key={index}
//               style={determineTeamStyle(team, seed.state)}
//             >
//               {team.name || 'NO TEAM'}
//             </SeedTeam>
//           ))}
//         </div>
//       </SeedItem>
//     </Seed>
//   );
// };

// ************************************************************

const CustomSeed = ({ seed, breakpoint, onFixtureClick }) => {

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

  // const determineTeamStyle = (team, fixtureState) => {
  //   if (fixtureState === 'DONE') {
  //     if (team.resultText === 'LOST') {
  //       return { border: '2px solid red' };
  //     } else if (team.resultText === 'WON') {
  //       return { border: '2px solid green' };
  //     }
  //   } else if (fixtureState === 'PENDING') {
  //     return { border: '2px solid grey' };
  //   }
  //   return {};
  // };

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

  // const determineTeamStyle = (team, fixtureState) => {
  //   if (fixtureState === "STARTED" || fixtureState === "ENDED") {
  //     return team.isWinner
  //       ? { color: "green", fontWeight: "bold" }
  //       : { color: "red" };
  //   }
  //   return {
  //     color: "grey",
  //     borderLeft: "5px solid grey",
  //     marginTop: "10px",
  //     fontSize: "20px",
  //   };
  // };

  const determineTeamStyle = (team, fixtureState) => {
    if (fixtureState === 'DONE') {
      if (team.resultText === 'LOST') {
        return { borderLeft: '5px solid red' };
      } else if (team.resultText === 'WON') {
        return { borderLeft: '5px solid green' };
      }
    } else if (fixtureState === 'PENDING') {
      return { borderLeft: '5px solid grey' };
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
        onClick={(e) => onFixtureClick(e, seed)}
      >
        <div>
          {seed.teams.map((team, index) => (
            <SeedTeam key={index} style={determineTeamStyle(team, seed.state)}>
              {team.name || "NO TEAM"}
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
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [selectedTeamToSwap, setSelectedTeamToSwap] = useState("");
  const [selectedTargetTeam, setSelectedTargetTeam] = useState("");
  const [allTeams, setAllTeams] = useState([]);

  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [fixtureBeingEdited, setFixtureBeingEdited] = useState(null);

  const handleEdit = (fixtureId) => {
    setFixtureBeingEdited(fixtureId);
    setEditDialogOpen(true);
  };
  
  

  const handleFixtureClick = (event, fixture) => {
    event.stopPropagation();
    setSelectedFixture(fixture);
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    console.log("Clicked fixture:", fixture);
  };

  const handleOptionClick = async (action) => {
    console.log(`${action} clicked for fixture:`, selectedFixture);
    if (action === "handleStart") {
      localStorage.setItem("selectedFixture", JSON.stringify(selectedFixture));
      localStorage.setItem("startfix", selectedFixture.id);
      window.location.href = "/football/matches";
    } else if (action === "handleSwap") {
      prepareSwapDialog();
    }
    setMenuOpen(false);
  };

  const prepareSwapDialog = () => {
    const allTeamsExceptCurrent = rounds.flatMap((round) =>
      round.seeds.flatMap((seed) =>
        seed.id !== selectedFixture.id ? seed.teams : []
      )
    );
    setAllTeams(allTeamsExceptCurrent);
    setSelectedTeamToSwap(selectedFixture.teams[0].id);
    setSelectedTargetTeam("");
    setSwapDialogOpen(true);
  };

  const handleSwap = async () => {
    if (!selectedTeamToSwap || !selectedTargetTeam) {
      console.error("Please select both teams to swap");
      return;
    }

    try {
      const token = localStorage.getItem("token");
      const targetFixture = rounds
        .flatMap((round) => round.seeds)
        .find((seed) =>
          seed.teams.some((team) => team.id === selectedTargetTeam)
        );

      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation SwapTeams($input: SwapTeamsInput!) {
              swapTeams(input: $input) {
                status
                message
              }
            }
          `,
          variables: {
            input: {
              fixtureId1: parseInt(selectedFixture.id),
              fixtureId2: parseInt(targetFixture.id),
              team1Id: parseInt(selectedTeamToSwap),
              team2Id: parseInt(selectedTargetTeam),
            },
          },
        }),
      });
      const result = await response.json();
      if (result.data?.swapTeams?.status) {
        console.log(result.data.swapTeams.message);
        fetchBracketsData(); // Refresh data after swapping teams
      } else {
        console.error(
          "Swap failed:",
          result.errors || result.data?.swapTeams?.message
        );
      }
    } catch (error) {
      console.error("Error swapping teams:", error);
    }
    setSwapDialogOpen(false);
  };

  // const fetchBracketsData = async () => {
  //   try {
  //     const token = localStorage.getItem('token');
  //     const schoolid = parseInt(localStorage.getItem('schoolID'));
  //     const response = await fetch('https://nuavasports.com/graphql', {
  //       method: 'POST',
  //       headers: {
  //         'Content-Type': 'application/json',
  //         'Authorization': `jwt ${token}`,
  //       },
  //       body: JSON.stringify({
  //         query: `query GetBrackets($input: GetBracketsInput!) {
  //           getBrackets(input: $input) {
  //             id
  //             name
  //             nextMatchId
  //             tournamentRoundText
  //             startTime
  //             state
  //             participants {
  //               id
  //               name
  //               resultText
  //               isWinner
  //               status
  //             }
  //           }
  //         }`,
  //         variables: { input: { tournamentId: schoolid } },
  //       }),
  //     });

  //     const result = await response.json();
  //     const brackets = result.data?.getBrackets;

  //     if (brackets) {
  //       const mappedRounds = brackets.reduce((acc, match) => {
  //         const roundIndex = parseInt(match.tournamentRoundText, 10) - 1;
  //         if (!acc[roundIndex]) {
  //           acc[roundIndex] = { title: `Round ${roundIndex + 1}`, seeds: [] };
  //         }
  //         acc[roundIndex].seeds.push({
  //           id: match.id,
  //           date: new Date(match.startTime).toDateString(),
  //           state: match.state,
  //           teams: match.participants.map(participant => ({
  //             id: participant.id,
  //             name: participant.name,
  //             isWinner: participant.isWinner,
  //           })),
  //         });
  //         return acc;
  //       }, []);

  //       setRounds(mappedRounds);
  //     }
  //   } catch (error) {
  //     console.error('Error fetching data:', error);
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  const fetchBracketsData = async () => {
    try {
      const token = localStorage.getItem("token");
      const schoolid = parseInt(localStorage.getItem("schoolID"));
      const response = await fetch("https://nuavasports.com/graphql", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `query GetBrackets($input: GetBracketsInput!) {
            getBrackets(input: $input) {
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
              }
            }
          }`,
          variables: { input: { tournamentId: schoolid } },
        }),
      });

      const result = await response.json();
      const brackets = result.data?.getBrackets;

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
    <>
      <Navbar buttontext="Create Tournament / Match" />
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          padding: "20px",
          backgroundColor: "white",
          fontSize: "24px",
        }}
      >
        {loading ? (
          <Skeleton height={40} count={10} />
        ) : rounds ? (
          <Bracket
            rounds={rounds}
            renderSeedComponent={(props) => (
              <CustomSeed {...props} onFixtureClick={handleFixtureClick} />
            )}
          />
        ) : (
          <img
            src="https://static.vecteezy.com/system/resources/previews/010/856/652/non_2x/no-result-data-document-or-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg"
            height="100px"
            width="200px"
            alt="No data"
          />
        )}
        <PopperMenu
          isOpen={menuOpen}
          onClose={() => setMenuOpen(false)}
          title={selectedFixture ? `Match ${selectedFixture.id}` : ""}
          anchorEl={anchorEl}
          options={menuOptionsWithIcons}
          onOptionClick={handleOptionClick}
        />
        <Dialog open={swapDialogOpen} onClose={() => setSwapDialogOpen(false)}>
          <DialogTitle>Swap Teams</DialogTitle>
          <DialogContent>
            <FormControl fullWidth margin="normal">
              <InputLabel style={{ fontSize: "20px", marginLeft: "-10px" }}>
                Select Teams to Swap
              </InputLabel>
              <br></br>
              <Select
                value={selectedTeamToSwap}
                onChange={(e) => setSelectedTeamToSwap(e.target.value)}
              >
                {selectedFixture?.teams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl fullWidth margin="normal">
              <InputLabel>Select Target Team</InputLabel>
              <Select
                value={selectedTargetTeam}
                onChange={(e) => setSelectedTargetTeam(e.target.value)}
              >
                {allTeams.map((team) => (
                  <MenuItem key={team.id} value={team.id}>
                    {team.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleSwap} color="primary">
              Swap
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    </>
  );
};

export default BracketsComponent;
