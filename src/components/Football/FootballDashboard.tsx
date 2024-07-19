import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Banner from '../../assets/BANNER.png';
import './FootballDashboard.css';
import { gql, useQuery, ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import { Skeleton } from 'primereact/skeleton';

interface Participant {
  id: string;
  name: string;
  resultText: string | null;
  isWinner: boolean;
  status: string | null;
}

interface Bracket {
  id: string;
  name: string;
  nextMatchId: string | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Participant[];
}

interface Tournament {
  id: number;
  name: string;
  brackets: Bracket[];
}

const GET_ALL_TOURNAMENTS = gql`
  query GetAllTournaments($input: GetBracketsInput!) {
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
  }
`;

const httpLink = createHttpLink({
  uri: 'https://nuavasports.com/graphql',
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

const Dashboard: React.FC = () => {
  const [tournaments, setTournaments] = useState<Tournament[]>([]);
  const { loading, error, data } = useQuery(GET_ALL_TOURNAMENTS, {
    variables: { input: { tournamentId: 1 } },
  });

  useEffect(() => {
    if (data && data.getBrackets) {
      
      setTournaments([
        {
          id: 1,
          name: "Example Tournament",
          brackets: data.getBrackets,
        },
      ]);
    }
  }, [data]);

  const formatDate = (timestamp: string) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' });
  };

  const renderSkeletonCard = () => (
    <div className="tournament-card skeleton">
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

  return (
    <>
      <Navbar buttontext="Create Tournament / Match" />
      <div className="dashboard-container">
        <div className="banner-container">
          <img src={Banner} alt='Football' className="banner-image" />
        </div>
        <p className='up-match' style={{color:'black'}}>UPCOMING TOURNAMENTS <span style={{color:'grey'}}>({tournaments.length})</span></p>
        <div className="tournaments-container">
          {loading && (
            <>
              {renderSkeletonCard()}
              {renderSkeletonCard()}
              {renderSkeletonCard()}
            </>
          )}
          {error && <p className="error">Error loading tournaments: {error.message}</p>}
          {tournaments.map((tournament) => (
            <div key={tournament.id} className="tournament-card">
              {/* <h2 className="tournament-name">{tournament.name}</h2> */}
              {tournament.brackets.map((bracket) => (
                <div key={bracket.id} className="bracket-card">
                  <h3 className="bracket-name" style={{backgroundColor:'#eee',padding:'10px',borderRadius:'10px'}}>{bracket.name}</h3>
                  <p className="bracket-info">Round: {bracket.tournamentRoundText}</p>
                  <p className="bracket-info">Start Time: {formatDate(bracket.startTime)}</p>
                  <p className="bracket-info">State: {bracket.state}</p>
                  <div className="participants">
                    {bracket.participants.map((participant) => (
                      <div key={participant.id} className="participant">
                        <p className="participant-name">{participant.name}</p>
                        {participant.resultText && <p className="participant-result">{participant.resultText}</p>}
                        {participant.isWinner && <p className="winner-tag">Winner</p>}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

const DashboardWithApollo: React.FC = () => (
  <ApolloProvider client={client}>
    <Dashboard />
  </ApolloProvider>
);

export default DashboardWithApollo;