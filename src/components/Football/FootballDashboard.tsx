import React, { useEffect, useState } from "react";
import Navbar from "../Navbar";
import Banner from "../../assets/BANNER.png";
import "./FootballDashboard.css";
import {
  gql,
  useQuery,
  ApolloClient,
  InMemoryCache,
  createHttpLink,
  ApolloProvider,
} from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import { Skeleton } from "primereact/skeleton";
import { Dialog } from "primereact/dialog";
import { Button } from "primereact/button";
import { InputText } from "primereact/inputtext";
import { Card } from "@mui/material";
import Footballimg from "../../assets/football.png";

interface Fixture {
  id: number;
  location: string;
  teamParticipationId1: number;
  teamParticipationId2: number;
  tournamentID: number;
  isBye: boolean;
  startDate: string;
  endDate: string;
  round: number;
  winnerID: number | null;
  team1: string;
  team2: string;
  status: string;
  createdAt: string;
  updatedAt: string;
}

interface Tournament {
  tournamentName: string;
  fixtures: Fixture[];
}

const GET_ALL_EVENTS = gql`
  query GetAllEvents($schoolId: Int!) {
    getAllFixturesForSchool(schoolId: $schoolId) {
      tournamentName
      fixtures {
        id
        location
        teamParticipationId1
        teamParticipationId2
        tournamentID
        isBye
        startDate
        endDate
        round
        winnerID
        team1
        team2
        status
        createdAt
        updatedAt
      }
    }
  }
`;

const EDIT_FIXTURE = gql`
  mutation EditFixture($input: EditFixtureInput!) {
    editFixture(input: $input) {
      status
      message
    }
  }
`;

const GET_ALL_TOURNAMENTS = gql`
  query GetAllTournaments {
    getAllTournaments {
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
`;

const httpLink = createHttpLink({
  uri: "https://nuavasports.com/graphql",
});

const authLink = setContext(
  (_, { headers = {} }: { headers?: Record<string, string> }) => {
    const token = localStorage.getItem("token");
    return {
      headers: {
        ...headers,
        authorization: token ? `jwt ${token}` : "",
        "school-id": localStorage.getItem("schoolID"),
      },
    };
  }
);

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache(),
});

const Dashboard: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_ALL_EVENTS, {
    variables: { schoolId: parseInt(localStorage.getItem("schoolID") || "1") },
  });

  const {
    loading: tournamentsLoading,
    error: tournamentsError,
    data: tournamentsData,
  } = useQuery(GET_ALL_TOURNAMENTS);

  const [showbanner, setShowbanner] = useState(false);
  const [nomatch, setNoMatch] = useState(true);

  const [userType, setUserType] = useState(false);

  useEffect(() => {
    if (localStorage.getItem("usertype") === "coach") {
      setUserType(true);
    }
  }, []);

  const handleCreatetournamentclick = () => {
    window.location.href = "/tournament/create";
  };

  useEffect(() => {
    if (data && data.getAllFixturesForSchool) {
      setTournaments(data.getAllFixturesForSchool);
    }
    if (data && data.getAllFixturesForSchool.length > 0) {
      setShowbanner(true);
      setNoMatch(false);
    }
  }, [data]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString("en-US", {
      day: "2-digit",
      month: "short",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  const formatTournamentDate = (timestamp: string) => {
    // Parse the timestamp as a number
    const date = new Date(parseInt(timestamp));

    // Check if the date is valid
    if (isNaN(date.getTime())) {
      return "Invalid Date";
    }

    // Format the date
    return date.toLocaleString("en-US", {
      year: "numeric",
      month: "short",
      day: "2-digit",
      // hour: '2-digit',
      // minute: '2-digit',
      // hour12: true
    });
  };

  const BannerClick = () => {
    window.location.href = "/brackets";
  };

  const renderSkeletonCard = () => (
    <div className="fixture-card skeleton">
      <Skeleton width="70%" height="2rem" className="mb-2" />
      <Skeleton width="40%" height="1.5rem" className="mb-2" />
      <Skeleton width="60%" height="1rem" className="mb-1" />
      <Skeleton width="50%" height="1rem" className="mb-1" />
      <div className="participants-skeleton">
        <Skeleton width="45%" height="2rem" className="mb-1" />
        <Skeleton width="45%" height="2rem" className="mb-1" />
      </div>
    </div>
  );

  const handleEditClick = (fixture: Fixture) => {
    setSelectedFixture(fixture);
    setEditDialogVisible(true);
  };

  const handleEditSave = () => {
    // Save the edited fixture using the EDIT_FIXTURE mutation
    setEditDialogVisible(false);
  };

  const storeFixtureId = (fixtureId: number) => {
    localStorage.setItem("startfix", fixtureId.toString());
  };

  const redirectToMatchPage = () => {
    window.location.href = "/football/matches";
  };

  const handleStartMatchClick = (fixtureId: number) => {
    storeFixtureId(fixtureId);
    redirectToMatchPage();
  };

  const handleViewUpdatesClick = (fixtureId: number) => {
    storeFixtureId(fixtureId);
    redirectToMatchPage();
  };

  const tournamentCardClick = (tournament: { id: string; }) => {
    localStorage.setItem('schoolID', tournament.id);
    window.location.href = '/brackets';
  };


  return (
    <>
      <Navbar buttontext="Create Tournament / Match" />
      <div className="dashboard-container">
        {showbanner && (
          <div className="banner-container">
            <img
              src={Banner}
              onClick={BannerClick}
              alt="Football"
              className="banner-image"
            />
          </div>
        )}

        {showbanner && (
          <h2 className="live-match-title-fd title-mobile-custom">
            ALL TOURNAMENTS{" "}
          </h2>
        )}
        <div
          className="tournaments-list-container-all"
          // onClick={tournamentCardClick}
        >
          {tournamentsLoading && <p>Loading tournaments...</p>}
          {tournamentsError && (
            <p className="error">
              Error loading tournaments: {tournamentsError.message}
            </p>
          )}
          {tournamentsData && (
            <div className="tournaments-grid-all">
              {tournamentsData.getAllTournaments.map((tournament: any) => (
                <div key={tournament.id} className="tournament-card-all" onClick={() => tournamentCardClick(tournament)}>
                  {/* <div className="image-container">
                    <img src={Footballimg} className="t-football-img" alt="" />
                  </div> */}
                  <h3>{tournament.name}</h3>
                  <p>Location: {tournament.location}</p>
                  {/* <p>Sport: {tournament.typeOfSport}</p> */}
                  <p>
                    Date: {formatTournamentDate(tournament.startDate)} to{" "}
                    {formatTournamentDate(tournament.endDate)}
                  </p>
                </div>
              ))}
            </div>
          )}
        </div>

        {showbanner && (
          <p className="live-match-title-fd">
            UPCOMING MATCHES (
            <span style={{ color: "grey" }}>{tournaments.length}</span>)
          </p>
        )}
        {nomatch && (
          <div
            style={{
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
          >
            <center>
              <button
                onClick={handleCreatetournamentclick}
                style={{
                  backgroundColor: "#051da0",
                  color: "white",
                  padding: "10px 20px",
                  borderRadius: "20px",
                }}
              >
                Create Tournament / Match
              </button>
            </center>
          </div>
        )}

        <div className="tournaments-container">
          {loading && (
            <>
              {renderSkeletonCard()}
              {renderSkeletonCard()}
              {renderSkeletonCard()}
            </>
          )}
          {error && (
            <p className="error">Error loading tournaments: {error.message}</p>
          )}

          {tournaments.map((tournament, index) => (
            <div key={index} className="tournament-card">
              {tournament.fixtures
                .filter((fixture) => fixture.status !== "live")
                .map((fixture) => (
                  <div key={fixture.id} className="fixture-card">
                    <h2 className="tournament-name">
                      {tournament.tournamentName}
                    </h2>
                    <div className="fixture-header">
                      <h3 className="fixture-title">
                        {fixture.team1}{" "}
                        <span
                          style={{
                            color: "grey",
                            marginLeft: "10px",
                            marginRight: "10px",
                          }}
                        >
                          VS
                        </span>{" "}
                        {fixture.team2}
                      </h3>
                      {userType && (
                        <Button
                          icon="pi pi-pencil"
                          onClick={() => handleEditClick(fixture)}
                          className="p-button-rounded edit-button fixture-edit-btn"
                        />
                      )}
                    </div>
                    <p className="fixture-time">
                      {formatDate(fixture.startDate)}
                    </p>
                    <p className="fixture-info">{fixture.location}</p>
                    {/* <p className="fixture-info">{fixture.round} - {fixture.isBye ? 'Bye' : '7-A-Side'}</p> */}
                    {userType && (
                      <button
                        className="start-fxture"
                        onClick={() => handleStartMatchClick(fixture.id)}
                      >
                        Start Match
                      </button>
                    )}
                  </div>
                ))}
            </div>
          ))}
        </div>

        <div className="live-matches-container">
          {showbanner && (
            <p className="live-match-title-fd" style={{}}>
              LIVE MATCHES
            </p>
          )}
          <div className="tournaments-container">
            {loading && (
              <>
                {renderSkeletonCard()}
                {renderSkeletonCard()}
                {renderSkeletonCard()}
              </>
            )}
            {error && (
              <p className="error">
                Error loading tournaments: {error.message}
              </p>
            )}
            {tournaments.map((tournament, index) => (
              <div key={index} className="tournament-card">
                {tournament.fixtures
                  .filter((fixture) => fixture.status === "live")
                  .map((fixture) => (
                    <div key={fixture.id} className="fixture-card-live">
                      <h2 className="tournament-name">
                        {tournament.tournamentName}
                      </h2>
                      <div className="fixture-header">
                        <h3 className="fixture-title">
                          {fixture.team1}{" "}
                          <span
                            style={{
                              color: "grey",
                              marginLeft: "10px",
                              marginRight: "10px",
                            }}
                          >
                            VS
                          </span>{" "}
                          {fixture.team2}
                        </h3>
                        {/* <Button icon="pi pi-pencil" onClick={() => handleEditClick(fixture)} className="p-button-rounded edit-button" /> */}
                      </div>
                      <p className="fixture-time">
                        {" "}
                        {formatDate(fixture.startDate)}
                      </p>
                      <p className="fixture-info">{fixture.location}</p>
                      {/* <p className="fixture-info">{fixture.round} - {fixture.isBye ? 'Bye' : '7-A-Side'}</p> */}
                      <button
                        className="view-fixture-updates"
                        onClick={() => handleViewUpdatesClick(fixture.id)}
                      >
                        View Updates
                      </button>
                    </div>
                  ))}
              </div>
            ))}
          </div>
        </div>
      </div>

      <Dialog
        header="Edit Fixture"
        visible={editDialogVisible}
        onHide={() => setEditDialogVisible(false)}
      >
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <InputText
              style={{
                border: "1px solid silver",
                height: "50px",
                borderRadius: "10px",
              }}
              id="startDate"
              value={selectedFixture?.startDate || ""}
              onChange={(e) =>
                setSelectedFixture((prev) =>
                  prev ? { ...prev, startDate: e.target.value } : null
                )
              }
            />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <InputText
              style={{
                border: "1px solid silver",
                height: "50px",
                borderRadius: "10px",
              }}
              id="location"
              value={selectedFixture?.location || ""}
              onChange={(e) =>
                setSelectedFixture((prev) =>
                  prev ? { ...prev, location: e.target.value } : null
                )
              }
            />
          </div>
          <center>
            <Button
              label="Save"
              style={{
                padding: "5px 10px",
                width: "100%",
                height: "50px",
                marginTop: "10px",
                backgroundColor: "#051da0",
                borderRadius: "50px",
                color: "white",
              }}
              onClick={handleEditSave}
            />
          </center>
        </div>
      </Dialog>
    </>
  );
};

const DashboardWithApollo: React.FC = () => (
  <ApolloProvider client={client}>
    <Dashboard />
  </ApolloProvider>
);

export default DashboardWithApollo;
