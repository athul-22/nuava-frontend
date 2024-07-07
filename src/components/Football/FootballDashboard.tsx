import React, { useEffect, useState } from 'react';
import Navbar from '../Navbar';
import Banner from '../../assets/BANNER.png';
import './FootballDashboard.css';
import { gql, useQuery, ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';

// Define the tournament type
interface Tournament {
  id: number;
  name: string;
  location: string;
  startDate: string;
  endDate: string;
  typeOfSport: string;
}

// GraphQL query
const GET_ALL_TOURNAMENTS = gql`
  query GetAllTournaments {
    getAllTournaments {
      id
      name
      location
      startDate
      endDate
      typeOfSport
    }
  }
`;

const httpLink = createHttpLink({
  uri: 'http://localhost:3000/graphql',
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
  const { loading, error, data } = useQuery(GET_ALL_TOURNAMENTS);
  const [tournaments, setTournaments] = useState<Tournament[]>([]);

  useEffect(() => {
    if (data && data.getAllTournaments) {
      setTournaments(data.getAllTournaments);
    }
  }, [data]);

  const formatDate = (timestamp: string) => {
    const date = new Date(parseInt(timestamp));
    return date.toLocaleDateString('en-US', { day: '2-digit', month: 'short' });
  };

  const len = tournaments.length;

  return (
    <>
     <Navbar buttontext="Create Tournament"/>
    <div className="dashboard-container">
     
      <div className="banner-container">
        <img src={Banner} alt='Football' className="banner-image" />
      </div>
      <p className='up-match' style={{color:'black'}}>UPCOMING MATCHES <span style={{color:'grey'}}>({len})</span></p>
      <div className="tournaments-container">
        
        {loading && <p className="loading">Loading tournaments...</p>}
        {error && <p className="error">Error loading tournaments: {error.message}</p>}
        {tournaments.map((tournament) => (
          <div key={tournament.id} className="tournament-card">
            <h3 className="tournament-name">{tournament.name}</h3>
            <p className="tournament-date">
              {formatDate(tournament.startDate)} - {formatDate(tournament.endDate)}
            </p>
            <p className="tournament-info"><strong>Location:</strong> {tournament.location}</p>
            <p className="tournament-info"><strong>Sport:</strong> {tournament.typeOfSport}</p>
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