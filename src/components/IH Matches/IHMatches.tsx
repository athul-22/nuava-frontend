import React from 'react';
import { useQuery, gql, ApolloClient, InMemoryCache, createHttpLink, ApolloProvider } from '@apollo/client';
import { setContext } from '@apollo/client/link/context';
import Navbar from '../Navbar';
import './IHMatch.css'
import { Button } from 'primereact/button';

interface MatchDetails {
  description: string;
  typeOfSport: string;
  house1Name: string;
  house2Name: string;
  venue?: string;
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

const httpLink = createHttpLink({
  uri: 'https://nuavasports.com/graphql',
});

const authLink = setContext((_, { headers }) => {
  const token = localStorage.getItem('token');
  return {
    headers: {
      ...headers,
      authorization: token ? `Bearer ${token}` : "",
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

  const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString));
    return date.toLocaleString('en-US', { hour: 'numeric', minute: 'numeric', hour12: true, month: 'short', day: 'numeric' });
  };

  const renderMatches = () => {
    if (loading) return <p>Loading matches...</p>;
    if (error) return (
      <div className="error-message">
        <p>Error loading matches: {error.message}</p>
      </div>
    );

    return (
      <div style={{width:'100%'}}>
        <h1 className='titleihmatch'>NUAVA</h1>
        <h2 className='ihmatchdesription'>Upcoming Interhouse Matches</h2>
        
        {!data || data.getAllInterHouseEvents.length === 0 ? (
          <div className="no-matches-message">
            <p>No matches available at the moment.</p>
          </div>
        ) : (
          <div style={{ display: 'flex', overflowX: 'auto', padding: '20px 0' }}>
            {data.getAllInterHouseEvents.map((match) => {
              const details: MatchDetails = JSON.parse(match.details);
              return (
                <div key={match.id} className="match-card" style={{ minWidth: '300px', margin: '0 10px' }}>
                  <div className="match-header">
                    <h3>{match.title}</h3>
                  </div>
                  <div className="match-content">
                    <div className="team">
                      <p style={{fontSize:'20px',backgroundColor:'#eee',height:'50px',width:'50px',paddingTop:'10px',display:'flex',justifyContent:'center',borderRadius:'50%'}}>{details.house1Name}</p>
                    </div>
                    <div className="match-info">
                      <p className="match-time">{formatDate(match.startDate)}</p>
                      {details.venue && <p className="match-venue">{details.venue}</p>}
                    </div>
                    <div className="team">
                      <p style={{fontSize:'20px',backgroundColor:'#eee',height:'50px',width:'50px',paddingTop:'10px',display:'flex',justifyContent:'center',borderRadius:'50%'}}>{details.house2Name}</p>
                    </div>
                  </div>
                  <div className="match-details">
                    <center>
                      <p style={{color:'#b99d0b',backgroundColor:'#fefbdd',width:"100px",borderRadius:'20px'}} className="sport-type">
                        <strong></strong> {details.typeOfSport}
                      </p>
                      <p style={{color:'silver',marginBottom:'10px'}} className="description">
                        <strong></strong> {details.description}
                      </p>
                      <button style={{padding:'5px',width:'90%',backgroundColor:'#051da0',textAlign:'center',color:'white',margin:'10px',borderRadius:'20px'}}>Edit</button>
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

  return (
    <div>
      <Navbar buttontext="Create match" />
      <div className="matches-container">
        {renderMatches()}
      </div>
    </div>
  );
};

export default IHMatches;