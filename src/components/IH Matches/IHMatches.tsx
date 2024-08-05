import React, { useEffect, useState } from 'react';
import { useQuery, useMutation, gql, ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from '../Navbar';
import './IHMatch.css';
import { Button } from 'primereact/button';
import { Dialog } from 'primereact/dialog';
import { InputText } from 'primereact/inputtext';
import { Dropdown } from 'primereact/dropdown';

interface MatchDetails {
  description: string;
  typeOfSport: string;
  house1Name: string;
  house2Name: string;
  venue?: string;
  house1Score?: number;
  house2Score?: number;
  winnerHouse?: string;
  interHouseEventStatus?: string;
}

interface InterHouseEvent {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  details: string;
}

const GET_ALL_INTER_HOUSE_EVENTS = gql`
  query GetAllInterHouseEvents {
    getAllInterHouseEvents {
      id
      title
      startDate
      endDate
      details
    }
  }
`;

const END_INTER_HOUSE_EVENT = gql`
  mutation EndInterHouseEvent($endInterHouseEventInput2: EndInterHouseEventInput!) {
    endInterHouseEvent(input: $endInterHouseEventInput2) {
      status
      message
    }
  }
`;

const httpLink = createHttpLink({
  uri: 'https://nuavasports.com/api',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `jwt ${token}` : "",
    }
  }
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const IHMatches: React.FC = () => {
  const { loading, error, data } = useQuery<{ getAllInterHouseEvents: InterHouseEvent[] }>(
    GET_ALL_INTER_HOUSE_EVENTS,
    { client }
  );

  const [endMatchDialog, setEndMatchDialog] = useState(false);
  const [selectedMatch, setSelectedMatch] = useState<InterHouseEvent | null>(null);
  const [house1Score, setHouse1Score] = useState('');
  const [house2Score, setHouse2Score] = useState('');
  const [winnerHouse, setWinnerHouse] = useState<string | null>(null);
  const [moderatorAccess, setModeratorAccess] = useState<boolean>(false);

  const [endInterHouseEvent] = useMutation(END_INTER_HOUSE_EVENT, { client });

  const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });
  };

  useEffect(() => {
    const usertype  = localStorage.getItem('usertype');
    const moderatorAcces = localStorage.getItem('moderatorAccess');

    if (usertype === 'coach' || moderatorAcces === 'true') {
      setModeratorAccess(true);
    }
    }, []);

  const renderMatches = () => {
    if (loading) return <p>Loading matches...</p>;
    if (error) return (
      <div className="error-message">
        <p>Error loading matches: {error.message}</p>
      </div>
    );

    const upcomingMatches = data?.getAllInterHouseEvents.filter((match) => {
      const details: MatchDetails = JSON.parse(match.details);
      return !details.house1Score && !details.house2Score && details.interHouseEventStatus !== 'COMPLETED';
    });

    return (
      <div style={{ width: '100%' }}>
        <h1 className='titleihmatch'>NUAVA</h1>
        <h2 className='ihmatchdesription'>Upcoming Interhouse Matches</h2>
        
        {!upcomingMatches || upcomingMatches.length === 0 ? (
          <div className="no-matches-message">
            <p>No matches available at the moment.</p>
          </div>
        ) : (
          <div style={{ }} className='ihmatchmain'>
            {upcomingMatches.map((match) => {
              const details: MatchDetails = JSON.parse(match.details);
              return (
                <div key={match.id} className="match-card" style={{ minWidth: '400px' }}>
                  <div className="match-header">
                    <h3>{match.title}</h3>
                  </div>
                  <div className="match-content">
                    <div className="team">
                      <p style={{ fontSize: '20px', height: '50px', width: '50px', paddingTop: '10px', display: 'flex', justifyContent: 'center', borderRadius: '50%' }}>{details.house1Name}</p>
                    </div>
                    <div className="match-info">
                      <p className="match-time">{formatDate(match.startDate)}</p>
                      {details.venue && <p className="match-venue">{details.venue}</p>}
                    </div>
                    <div className="team">
                      <p style={{ fontSize: '20px', height: '50px', width: '50px', paddingTop: '10px', display: 'flex', justifyContent: 'center', borderRadius: '50%' }}>{details.house2Name}</p>
                    </div>
                  </div>
                  <div className="match-details-ihm">
                    <center>
                      <p style={{ color: '#b99d0b', backgroundColor: '#fefbdd', width: "100px", borderRadius: '20px' }} className="sport-type">
                        <strong></strong> {details.typeOfSport}
                      </p>
                      <p style={{ color: 'silver', marginBottom: '10px' }} className="description">
                        <strong></strong> {details.description}
                      </p>
                      { moderatorAccess && <Button label="End Match" onClick={() => openEndMatchDialog(match)} style={{ padding: '5px', width: '90%', backgroundColor: '#051da0', textAlign: 'center', color: 'white', margin: '10px', borderRadius: '20px', height: '40PX' }} /> }
                    </center>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    );
  };

  const openEndMatchDialog = (match: InterHouseEvent) => {
    setSelectedMatch(match);
    setEndMatchDialog(true);
  };

  const closeEndMatchDialog = () => {
    setEndMatchDialog(false);
    setSelectedMatch(null);
    setHouse1Score('');
    setHouse2Score('');
    setWinnerHouse(null);
  };

  const handleEndMatch = async () => {
    if (!selectedMatch) return;

    const details: MatchDetails = JSON.parse(selectedMatch.details);

    const input = {
      eventId: selectedMatch.id,
      house1Name: details.house1Name,
      house1Score: parseInt(house1Score),
      house2Name: details.house2Name,
      house2Score: parseInt(house2Score),
      winnerHouse,
    };

    try {
      await endInterHouseEvent({
        variables: {
          endInterHouseEventInput2: input
        }
      });
      closeEndMatchDialog();
      window.location.reload();
    } catch (error) {
      console.error("Error ending match:", error);
    }
  };

  return (
    <div>
      <Navbar buttontext="Create match" />
      <div className="matches-container">
        {renderMatches()}
      </div>
      <Dialog header="End Match" visible={endMatchDialog} style={{ width: 'fit-content' }} onHide={closeEndMatchDialog}>
        <div className="p-fluid">
          <div className="p-field">
            <label htmlFor="house1Score">Enter House 1 Score</label>
            <InputText id="house1Score" value={house1Score} onChange={(e) => setHouse1Score(e.target.value)} style={{ border: '1px solid silver', height: '40px', marginTop: '10px', marginBottom: '10px', borderRadius: '10px' }} />
          </div>
          <div className="p-field">
            <label htmlFor="house2Score">Enter House 2 Score</label>
            <InputText id="house2Score" value={house2Score} onChange={(e) => setHouse2Score(e.target.value)} style={{ border: '1px solid silver', height: '40px', marginTop: '10px', marginBottom: '10px', borderRadius: '10px' }} />
          </div>
          <div className="p-field">
            <label htmlFor="winnerHouse">Winner House</label>
            {selectedMatch && (
              <Dropdown
                id="winnerHouse"
                value={winnerHouse}
                options={[
                  { label: JSON.parse(selectedMatch.details).house1Name, value: JSON.parse(selectedMatch.details).house1Name },
                  { label: JSON.parse(selectedMatch.details).house2Name, value: JSON.parse(selectedMatch.details).house2Name }
                ]}
                onChange={(e) => setWinnerHouse(e.value)}
                placeholder="Select a Winner"
              />
            )}
          </div>
          <Button style={{ marginTop: '20px', backgroundColor: '#051da0', height: "40px", color: 'white', borderRadius: '10px' }} label="Submit" onClick={handleEndMatch} />
        </div>
      </Dialog>
    </div>
  );
};

export default IHMatches;