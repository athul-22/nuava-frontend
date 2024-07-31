import React, { useState, useEffect, useRef } from "react";
import {
  gql,
  useQuery,
  useMutation,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Card } from "primereact/card";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import {
  DialogTitle,
  DialogContent,
  DialogActions,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to install axios: npm install axios
import "./LiveMatch.css";
import Navbar from "../Navbar";
import { useSubscription } from "@apollo/client";
import { Toast } from "primereact/toast";

// GraphQL queries and mutations
const GET_MATCH_DETAILS_AND_SCORE = gql`
  query GetMatchDetailsAndScore($fixtureId: ID!) {
    getMatchDetailsAndScore(fixtureId: $fixtureId) {
      fixtureId
      teamDetails {
        teamID
        teamName
        score
        matchEvents {
          playerId
          playerName
          eventType
        }
      }
      score
    }
  }
`;

const START_FIXTURE = gql`
  mutation StartFixture($input: StartFixtureInput!) {
    startFixture(input: $input) {
      status
      message
    }
  }
`;

const FIXTURE_UPDATES = gql`
  mutation FixtureUpdates($input: FixtureUpdatesInput!) {
    fixtureUpdates(input: $input) {
      message
      status
    }
  }
`;

const GET_LINEUPS = gql`
  query GetLineUps($fixtureId: ID!) {
    getLineUps(fixtureId: $fixtureId) {
      teamID
      name
      students {
        id
        name
        age
      }
    }
  }
`;

const SCORE_UPDATES_SUBSCRIPTION = gql`
  subscription Subscription($input: ScoreUpdatesInput!) {
    scoreUpdates(input: $input) {
      fixtureId
      eventType
      teamId
      playerId
    }
  }
`;

const END_FIXTURE_MUTATION = gql`
  mutation EndFixture($input: EndFixtureInput!) {
    endFixture(input: $input) {
      message
      status
    }
  }
`;

interface MatchData {
  fixtureId: number;
  teamDetails: {
    teamID: number; // Change this to number
    teamName: string;
    score: number;
    matchEvents: {
      playerId: number;
      playerName: string;
      eventType: string;
    }[];
  }[];
}

// Apollo Client setup
const httpLink = createHttpLink({
  uri: "https://nuavasports.com/graphql",
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem("token");
  return {
    headers: {
      ...headers,
      authorization: token ? `JWT ${token}` : "",
    },
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

interface TeamDetails {
  teamID: number; // Change this to number
  teamName: string;
  score: number;
  matchEvents: {
    playerId: number;
    playerName: string;
    eventType: string;
  }[];
}

interface MatchDetails {
  fixtureId: number;
  teamDetails: TeamDetails[];
  score: number;
}

interface BroadcastUpdate {
  fixtureId: number;
  hasUpdate: boolean;
}

interface LineUp {
  teamID: string;
  name: string;
  students: {
    id: string;
    name: string;
    age: number;
  }[];
}

const LiveMatch = () => {
  const toast = useRef<Toast>(null);
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [eventType, setEventType] = useState<string>("Goal");
  const fixtureId = localStorage.getItem("startfix") || "1";

  const toastRef = useRef<Toast>(null);

  const showToast = (severity: string, summary: string, detail: string) => {
    if (toast.current) {
      toast.current.show({ severity: severity as "success" | "info" | "warn" | "error", summary, detail, life: 3000 });
    }
  };


  const { loading, error, data, refetch } = useQuery<{
    getMatchDetailsAndScore: MatchDetails;
  }>(GET_MATCH_DETAILS_AND_SCORE, {
    variables: { fixtureId },
    context: {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    },
  });

  const parsedFixid = parseInt(fixtureId);

  const { data: subscriptionData } = useSubscription(
    SCORE_UPDATES_SUBSCRIPTION,
    {
      variables: { input: { parsedFixid } },
    }
  );

  // END MATCH FUNCTIONS

  const [endMatchDialogVisible, setEndMatchDialogVisible] = useState(false);
  // const [selectedWinner, setSelectedWinner] = useState(null);
  const [selectedWinner, setSelectedWinner] = useState<number | null>(null);

  const handleEndMatch = async (fixtureId: number, winnerID: number) => {
    try {
      const { data } = await client.mutate({
        mutation: END_FIXTURE_MUTATION,
        variables: {
          input: {
            fixtureId,
            winnerID,
          },
        },
      });
      console.log(data);
      showToast('success', 'Success', 'Match ended successfully');
      window.location.href = "/brackets";
    } catch (error) {
      showToast('error', 'Error ending fixture', 'Previous fixture has not been finished');
      console.error(error);
    }
  };
  

  const renderEndMatchDialog = (matchData: MatchData) => (
    <Dialog
      header="End Match"
      visible={endMatchDialogVisible}
      onHide={() => setEndMatchDialogVisible(false)}
      style={{
        height: "fit-content",
        width: "fit-content",
        backgroundColor: "white",
        borderRadius: "20px",
      }}
    >
      <DialogContent>
        <FormControl fullWidth>
          <br></br>
          {/* <InputLabel>Choose the Winner</InputLabel> */}
          <Select
            value={selectedWinner}
            onChange={(e) => setSelectedWinner(e.target.value as number)}
            placeholder="Select Winner"
            style={{ marginTop: "-30px" }}
          >
            {matchData &&
              matchData.teamDetails.map((team) => (
                <MenuItem key={team.teamID} value={team.teamID}>
                  {team.teamName}
                </MenuItem>
              ))}
          </Select>
        </FormControl>
      </DialogContent>
      <DialogActions>
        <Button
          onClick={() => setEndMatchDialogVisible(false)}
          className="p-button-secondary"
        >
          Cancel
        </Button>
        <Button
          style={{ marginLeft: "10px", color: "darkblue" }}
          onClick={() => {
            if (selectedWinner !== null) {
              handleEndMatch(parseInt(fixtureId), selectedWinner);
            } else {
              console.error("No winner selected");
            }
          }}
          className="p-button-secondary"
        >
          End Match
        </Button>
      </DialogActions>
      <Toast ref={toast}></Toast>
      
    </Dialog>
  );
  // const { data: lineUpsData } = useQuery<{ getLineUps: LineUp[] }>(GET_LINEUPS, {
  //   variables: { fixtureId },
  //   context: {
  //     headers: {
  //       Authorization: `JWT ${localStorage.getItem("token")}`,
  //     },
  //   },
  // });

  const {
    loading: lineUpsLoading,
    error: lineUpsError,
    data: lineUpsData,
  } = useQuery<{ getLineUps: LineUp[] }>(GET_LINEUPS, {
    variables: { fixtureId },
    context: {
      headers: {
        Authorization: `JWT ${localStorage.getItem("token")}`,
      },
    },
  });

  const renderLineUps = () => {
    if (!lineUpsData || !lineUpsData.getLineUps) return null;

    return lineUpsData.getLineUps.map((team) => (
      <div key={team.teamID} className="team-card">
        <h4 className="team-name-lineup">{team.name} Lineup</h4>
        {team.students.length > 0 ? (
          <ul className="players-list">
            {team.students.map((student) => (
              <li className="player-card" key={student.id}>
                {student.name}
              </li>
            ))}
          </ul>
        ) : (
          <p></p>
        )}
      </div>
    ));
  };

  const [startFixture] = useMutation(START_FIXTURE);
  const [updateFixture] = useMutation(FIXTURE_UPDATES);

  useEffect(() => {
    if (error && error.message === "Match result not found") {
      setShowDialog(true);
    }
  }, [error]);

  // useEffect(() => {
  //   const pollBroadcastUpdates = async () => {
  //     try {
  //       const response = await client.query({
  //         query: gql`
  //           query CheckBroadcastUpdate {
  //             checkBroadcastUpdate {
  //               hasUpdate
  //             }
  //           }
  //         `,
  //         fetchPolicy: 'network-only'
  //       });

  //       if (response.data.checkBroadcastUpdate.hasUpdate) {
  //         refetch();
  //       }
  //     } catch (error) {
  //       console.error("Error polling for broadcast updates:", error);
  //     }
  //   };

  //   const intervalId = setInterval(pollBroadcastUpdates, 10000); // Poll every 10 seconds

  //   return () => clearInterval(intervalId); // Clean up on component unmount
  // }, [refetch]);

  useEffect(() => {
    if (subscriptionData) {
      console.log("Received score update:", subscriptionData.scoreUpdates);
      // Handle the score update here
      // You might want to refetch your fixture data or update the local state
      refetch();
    }
  }, [subscriptionData, refetch]);

  const handleStartMatch = async () => {
    try {
      const result = await startFixture({
        variables: { input: { fixtureId: parseInt(fixtureId) } },
        context: {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      });
      console.log("Start Fixture Result:", result);
      setShowDialog(false);
      refetch();
    } catch (error) {
      console.error("Error starting fixture:", error);
    }
  };

  const handleUpdateFixture = async () => {
    try {
      const result = await updateFixture({
        variables: {
          input: {
            eventType,
            fixtureId: parseInt(fixtureId),
            isATeamWithoutPlayers: true,
            playerId: null,
            teamId: selectedTeamId,
          },
        },
        context: {
          headers: {
            Authorization: `JWT ${localStorage.getItem("token")}`,
          },
        },
      });
      console.log("Update Fixture Result:", result);
      setUpdateDialogVisible(false);
      refetch();
    } catch (error) {
      console.error("Error updating fixture:", error);
    }
  };

  const renderDialog = () => (
    <Dialog
      header="Start the Match"
      visible={showDialog}
      onHide={() => setShowDialog(false)}
      style={{
        height: "200px",
        width: "fit-content",
        backgroundColor: "white",
        borderRadius: "20px",
      }}
      footer={
        <div>
          <Button
            label="Confirm"
            icon="pi pi-check"
            onClick={handleStartMatch}
            style={{ marginRight: "20px", color: "black" }}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            style={{ color: "red" }}
            onClick={() => navigate("/dashboard/football")}
            className="p-button-secondary"
          />
        </div>
      }
    >
      <p>Do you want to start this match?</p>
    </Dialog>
  );

  const renderUpdateDialog = () => (
    <Dialog
      header="Update Score"
      visible={updateDialogVisible}
      onHide={() => setUpdateDialogVisible(false)}
      style={{
        height: "300px",
        width: `500px`,
        backgroundColor: "white",
        borderRadius: "20px",
      }}
      footer={
        <div>
          <Button
            label="Update"
            icon="pi pi-check"
            onClick={handleUpdateFixture}
            style={{ marginRight: "20px", color: "black" }}
          />
          <Button
            label="Cancel"
            icon="pi pi-times"
            style={{ color: "red" }}
            onClick={() => setUpdateDialogVisible(false)}
            className="p-button-secondary"
          />
        </div>
      }
    >
      <div>
        <Dropdown
          value={eventType}
          options={["Goal"]}
          onChange={(e) => setEventType(e.value)}
          placeholder="Select Event Type"
          style={{ marginBottom: "20px" }}
        />
      </div>
    </Dialog>
  );

  const renderSkeleton = () => (
    <Card className="match-card-individual">
      <Skeleton shape="rectangle" height="2rem" width="10rem" />
      <div className="match-header">
        <Skeleton shape="rectangle" height="1.5rem" width="15rem" />
      </div>
      <p>Scores</p>
      <div className="match-content">
        <Skeleton shape="rectangle" height="1.5rem" width="10rem" />
        <Skeleton shape="rectangle" height="1.5rem" width="5rem" />
        <Skeleton shape="rectangle" height="1.5rem" width="10rem" />
      </div>
      <Skeleton shape="rectangle" height="1rem" width="7rem" />
      <div className="scorers">
        <Skeleton shape="rectangle" height="1.5rem" width="5rem" />
        <Skeleton shape="rectangle" height="1.5rem" width="5rem" />
        <Skeleton shape="rectangle" height="1.5rem" width="5rem" />
      </div>

      <div className="lineups-container team-card">{renderLineUps()}</div>
    </Card>
  );

  const renderContent = () => {
    if (loading) return renderSkeleton();
    if (error) {
      if (error.message === "Match result not found") {
        return <p style={{ marginLeft: "-360px" }}>Match not yet started</p>;
      }
      return <div className="error-message">Error: {error.message}</div>;
    }
    if (!data || !data.getMatchDetailsAndScore) return <p>No data available</p>;

    const matchData = data.getMatchDetailsAndScore;

    const renderLineUps = () => {
      console.log("Lineup data:", lineUpsData); // Debug log

      if (lineUpsLoading) return <div>Loading lineups...</div>;
      if (lineUpsError)
        return <div>Error loading lineups: {lineUpsError.message}</div>;
      if (!lineUpsData || !lineUpsData.getLineUps)
        return <div>No lineup data available</div>;

      const teamsWithStudents = lineUpsData.getLineUps.filter(
        (team) => team.students.length > 0
      );

      if (teamsWithStudents.length === 0) return <div> </div>;

      return teamsWithStudents.map((team) => (
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div key={team.teamID} className="team-card-live-match">
            <ul className="players-lis">
              <h4 className="team-name-lineup">{team.name} Lineup</h4>
              {team.students.map((student) => (
                <li className="player-card" key={student.id}>
                  {student.name}
                </li>
              ))}
            </ul>
          </div>
        </div>
      ));
    };

    return (
      <div className="match-card-individual">
        <div style={{ display: "flex", justifyContent: "center" }}>
          <div
            style={{
              backgroundColor: "red",
              color: "white",
              width: "100px",
              borderRadius: "20px",
              padding: "5px",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <span className="pi pi-wifi" style={{ marginRight: "10px" }}></span>
            Live
          </div>
          {/* <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "green",
            padding: "10px 20px",
            color: "white",
            borderRadius: "20px",
            marginLeft: "20px",
          }}
        >
          <Button onClick={() => setEndMatchDialogVisible(true)}>
            End Match
          </Button>
        </div> */}
        </div>

        <div className="match-header">
          <h2 className="tournament-name-live-match">{matchData.fixtureId}</h2>
        </div>
        <div className="match-content">
          <div
            className="team-info"
            onClick={() => {
              setSelectedTeamId(matchData.teamDetails[0].teamID);
              setUpdateDialogVisible(true);
            }}
          >
            <h3 className="team-name">
              {matchData.teamDetails[0].teamName}{" "}
              <i
                className="pi pi-plus-circle"
                style={{ fontSize: "1.5rem", marginLeft: "10px" }}
              ></i>
            </h3>
          </div>
          <div className="match-score">
            <span>{matchData.teamDetails[0].score}</span>
            <span>:</span>
            <span>{matchData.teamDetails[1].score}</span>
          </div>
          <div
            className="team-info"
            onClick={() => {
              setSelectedTeamId(matchData.teamDetails[1].teamID);
              setUpdateDialogVisible(true);
            }}
          >
            <h3 className="team-name">
              {matchData.teamDetails[1].teamName}{" "}
              <i
                className="pi pi-plus-circle"
                style={{ fontSize: "1.5rem", marginLeft: "10px" }}
              ></i>
            </h3>
          </div>
        </div>
        <div className="scorers">
          {matchData.teamDetails.flatMap((team) =>
            team.matchEvents.map((event, index) => (
              <div key={index} className="scorer">
                {event.playerName} - {event.eventType}
              </div>
            ))
          )}
        </div>
        <div style={{display:'flex',justifyContent:'center'}}>
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            backgroundColor: "#051DA0",
            padding: "10px 20px",
            color: "white",
            borderRadius: "20px",
            marginLeft: "20px",
            width:'140px'
          }}
        >
          <Button onClick={() => setEndMatchDialogVisible(true)}>
            End Match
          </Button>
        </div>
        </div>
        <div className="lineups-container">{renderLineUps()}</div>
        <Dialog
          visible={endMatchDialogVisible}
          onHide={() => setEndMatchDialogVisible(false)}
          style={{
            height: "200px",
            width: "fit-content",
            backgroundColor: "white",
            borderRadius: "20px",
          }}
        ></Dialog>
        {endMatchDialogVisible && renderEndMatchDialog(matchData)}
        <Toast ref={toast} position="top-right" />
      </div>
    );
  };

  return (
    <ApolloProvider client={client}>
      <Navbar buttontext="Create Tournament / Matches" />
      <h1 className="live-match-title-single-match" style={{ color: "grey" }}>
        LIVE MATCH
      </h1>
      <div className="live-match-container">
        {renderContent()}
        {renderDialog()}
        {renderUpdateDialog()}
      </div>
    </ApolloProvider>
  );
};

export default LiveMatch;
