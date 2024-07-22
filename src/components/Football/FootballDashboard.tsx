import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Banner from '../../assets/BANNER.png';
import './FootballDashboard.css';
import { gql, useQuery, ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Skeleton } from 'primereact/skeleton';
import { Dialog } from 'primereact/dialog';
import { Button } from 'primereact/button';
import { InputText } from 'primereact/inputtext';

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

const httpLink = createHttpLink({
  uri: 'https://nuavasports.com/graphql',
});

const authLink = setContext((_, { headers = {} }: { headers?: Record<string, string> }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `jwt ${token}` : "",
      'school-id': localStorage.getItem('schoolID')
    }
  }
});


const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const Dashboard: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const [selectedFixture, setSelectedFixture] = useState<Fixture | null>(null);
  const [editDialogVisible, setEditDialogVisible] = useState(false);
  const { loading, error, data } = useQuery(GET_ALL_EVENTS, {
    variables: { schoolId: parseInt(localStorage.getItem('schoolID') || '1') },
  });

  useEffect(() => {
    if (data && data.getAllFixturesForSchool) {
      setTournaments(data.getAllFixturesForSchool);
    }
  }, [data]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const BannerClick = () => {
    window.location.href = '/brackets';
  }

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
    localStorage.setItem('startfix', fixtureId.toString());
  };

  const redirectToMatchPage = () => {
    window.location.href = '/football/matches';
  };

  const handleStartMatchClick = (fixtureId: number) => {
    storeFixtureId(fixtureId);
    redirectToMatchPage();
  };

  const handleViewUpdatesClick = (fixtureId: number) => {
    storeFixtureId(fixtureId);
    redirectToMatchPage();
  };

  return (
    <>
      <Navbar buttontext="Create Tournament / Match" />
      <div className="dashboard-container">
        <div className="banner-container">
          <img src={Banner} onClick={BannerClick} alt='Football' className="banner-image" />
        </div>

        <p className='live-match-title-fd' >UPCOMING MATCHES (<span style={{ color: 'grey' }}>{tournaments.length}</span>)</p>
        <div className="tournaments-container">
          {loading && (
            <>
              {renderSkeletonCard()}
              {renderSkeletonCard()}
              {renderSkeletonCard()}
            </>
          )}
          {error && <p className="error">Error loading tournaments: {error.message}</p>}
          {tournaments.map((tournament, index) => (
            <div key={index} className="tournament-card">
              {tournament.fixtures.filter(fixture => fixture.status !== 'live').map((fixture) => (
                <div key={fixture.id} className="fixture-card">
                  <h2 className="tournament-name">{tournament.tournamentName}</h2>
                  <div className="fixture-header">
                    <h3 className="fixture-title">{fixture.team1} <span style={{color:'grey',marginLeft:'10px',marginRight:'10px'}}>VS</span> {fixture.team2}</h3>
                    <Button icon="pi pi-pencil" onClick={() => handleEditClick(fixture)} className="p-button-rounded edit-button fixture-edit-btn" />
                  </div>
                  <p className="fixture-time">{formatDate(fixture.startDate)}</p>
                  <p className="fixture-info">{fixture.location}</p>
                  {/* <p className="fixture-info">{fixture.round} - {fixture.isBye ? 'Bye' : '7-A-Side'}</p> */}
                  <button className='start-fxture' onClick={() => handleStartMatchClick(fixture.id)}>Start Match</button>
                </div>
              ))}
            </div>
          ))}
        </div>


        <div className="live-matches-container">
          <p className='live-match-title-fd' style={{  }}>LIVE MATCHES </p>
          <div className="tournaments-container">
            {loading && (
              <>
                {renderSkeletonCard()}
                {renderSkeletonCard()}
                {renderSkeletonCard()}
              </>
            )}
            {error && <p className="error">Error loading tournaments: {error.message}</p>}
            {tournaments.map((tournament, index) => (
              <div key={index} className="tournament-card">
                {tournament.fixtures.filter(fixture => fixture.status === 'live').map((fixture) => (
                  <div key={fixture.id} className="fixture-card-live">
                    <h2 className="tournament-name">{tournament.tournamentName}</h2>
                    <div className="fixture-header">
                      <h3 className="fixture-title">{fixture.team1} <span style={{color:'grey',marginLeft:'10px',marginRight:'10px'}}>VS</span> {fixture.team2}</h3>
                      {/* <Button icon="pi pi-pencil" onClick={() => handleEditClick(fixture)} className="p-button-rounded edit-button" /> */}
                    </div>
                    <p className="fixture-time"> {formatDate(fixture.startDate)}</p>
                    <p className="fixture-info">{fixture.location}</p>
                    {/* <p className="fixture-info">{fixture.round} - {fixture.isBye ? 'Bye' : '7-A-Side'}</p> */}
                    <button className='view-fixture-updates' onClick={() => handleViewUpdatesClick(fixture.id)}>View Updates</button>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </div>

        
      </div>

      <Dialog header="Edit Fixture" visible={editDialogVisible} onHide={() => setEditDialogVisible(false)}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="startDate">Start Date</label>
            <InputText id="startDate" value={selectedFixture?.startDate || ''} onChange={(e) => setSelectedFixture(prev => prev ? { ...prev, startDate: e.target.value } : null)} />
          </div>
          <div className="p-field">
            <label htmlFor="location">Location</label>
            <InputText id="location" value={selectedFixture?.location || ''} onChange={(e) => setSelectedFixture(prev => prev ? { ...prev, location: e.target.value } : null)} />
          </div>
          <Button label="Save" onClick={handleEditSave} />
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
