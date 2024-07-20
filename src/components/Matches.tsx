import React from "react";
import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from "./Navbar";
import '../styles/Match.css';

// Define the GraphQL query
const GET_ALL_FIXTURES_FOR_SCHOOL = gql`
  query GetAllFixturesForSchool($schoolId: Int!) {
    getAllFixturesForSchool(schoolId: $schoolId) {
      fixtures {
        location
        createdAt
        endDate
        id
        isBye
        round
        startDate
        status
        team1
        team2
        teamParticipationId1
        teamParticipationId2
        tournamentID
        updatedAt
        winnerID
      }
    }
  }
`;

// Set up the Apollo Client
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
  };
});

const client = new ApolloClient({
  link: authLink.concat(httpLink),
  cache: new InMemoryCache()
});

const Matches: React.FC = () => {
  const { loading, error, data } = useQuery(GET_ALL_FIXTURES_FOR_SCHOOL, {
    variables: { schoolId: 1 },
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const fixtures = data?.getAllFixturesForSchool[0]?.fixtures ?? [];

  return (
    <div>
      <Navbar buttontext="Create Tournament / Matches" />
      <h1 style={{marginLeft:'120px',fontSize:'30px',color:'grey'}}>All MATCHES</h1>
      <div className="tournament-card">
        {fixtures.map((fixture: any) => (
          <div className="match-card-all" key={fixture.id}>
            <div className="match-header-all">
              <h2>U15 Champions League</h2>
            </div>
            <div className="match-details-all">
              <div className="team team1-all">
                <p>{fixture.team1}</p>
              </div>
              <div className="match-info-all">
                <p>{new Date(parseInt(fixture.startDate)).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</p>
                <p>{new Date(parseInt(fixture.startDate)).toLocaleDateString()}</p>
                <p>7-A-Side</p>
                <p>{fixture.location}</p>
              </div>
              <div className="team team2">
                <p>{fixture.team2}</p>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

const App: React.FC = () => (
  <ApolloProvider client={client}>
    <Matches />
  </ApolloProvider>
);

export default App;
