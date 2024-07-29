import React, { useState, useEffect } from "react";
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
import { Button } from "primereact/button";
import { Dropdown } from "primereact/dropdown";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // Make sure to install axios: npm install axios
import "./LiveMatch.css";
import Navbar from "../Navbar";

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
  teamID: number;
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
  const navigate = useNavigate();
  const [showDialog, setShowDialog] = useState(false);
  const [updateDialogVisible, setUpdateDialogVisible] = useState(false);
  const [selectedTeamId, setSelectedTeamId] = useState<number | null>(null);
  const [eventType, setEventType] = useState<string>("");
  const fixtureId = localStorage.getItem("startfix") || "1";

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


  // const { data: lineUpsData } = useQuery<{ getLineUps: LineUp[] }>(GET_LINEUPS, {
  //   variables: { fixtureId },
  //   context: {
  //     headers: {
  //       Authorization: `JWT ${localStorage.getItem("token")}`,
  //     },
  //   },
  // });

  
  const { loading: lineUpsLoading, error: lineUpsError, data: lineUpsData } = useQuery<{ getLineUps: LineUp[] }>(GET_LINEUPS, {
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
              <li className="player-card" key={student.id}>{student.name}</li>
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

  useEffect(() => {
    const pollBroadcastUpdates = async () => {
      try {
        const response = await axios.get<BroadcastUpdate>(
          `https://nuavasports.com/graphql`,
          {
            headers: {
              Authorization: `JWT ${localStorage.getItem("token")}`,
            },
          }
        );
        
        if (response.data.hasUpdate) {
          refetch();
        }
      } catch (error) {
        console.error("Error polling for broadcast updates:", error);
      }
    };

    const pollInterval = setInterval(pollBroadcastUpdates, 10000); // Poll every 10 seconds

    return () => clearInterval(pollInterval);
  }, [fixtureId, refetch]);

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
        width: `500px`,
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
          options={["Goal", "RedCard", "YellowCard"]}
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

      <div className="lineups-container team-card">
          {renderLineUps()}
        </div>
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
    if (lineUpsError) return <div>Error loading lineups: {lineUpsError.message}</div>;
    if (!lineUpsData || !lineUpsData.getLineUps) return <div>No lineup data available</div>;
  
    const teamsWithStudents = lineUpsData.getLineUps.filter((team) => team.students.length > 0);
  
    if (teamsWithStudents.length === 0) return <div></div>;
  
    return teamsWithStudents.map((team) => (
      <div style={{display:'flex',justifyContent:'center',}}>
      <div key={team.teamID} className="team-card-live-match">
        <ul className="players-lis">
          <h4 className="team-name-lineup">{team.name} Lineup</h4>
          {team.students.map((student) => (
            <li className="player-card" key={student.id}>{student.name}</li>
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
      </div>
      <div className="match-header">
        <h2 className="tournament-name-live-match">TISB Tournament 2024</h2>
      </div>
      <div className="match-content">
        <div
          className="team-info"
          onClick={() => {
            setSelectedTeamId(matchData.teamDetails[0].teamID);
            setUpdateDialogVisible(true);
          }}
        >
          <h3 className="team-name">{matchData.teamDetails[0].teamName} <i className="pi pi-plus-circle" style={{ fontSize: '1.5rem',marginLeft:'10px' }}></i></h3>
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
          <h3 className="team-name">{matchData.teamDetails[1].teamName} <i className="pi pi-plus-circle" style={{ fontSize: '1.5rem',marginLeft:'10px' }}></i></h3>
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
      <div className="lineups-container">
        {renderLineUps()}
      </div>
    </div>
  );
};

  return (
    <ApolloProvider client={client}>
      <Navbar buttontext="Create Tournament / Matches" />
      <h1
        className="live-match-title-single-match"
        style={{ color: "grey" }}
      >
        LIVE MATCHES
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