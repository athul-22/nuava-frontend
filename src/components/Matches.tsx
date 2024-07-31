import React, { useState, useEffect } from "react";
import { useQuery, gql, ApolloClient, InMemoryCache, ApolloProvider, createHttpLink } from "@apollo/client";
import { setContext } from "@apollo/client/link/context";
import Navbar from "./Navbar";
import { Skeleton } from "primereact/skeleton";
import '../styles/Match.css'

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

const SkeletonCard = () => (
  <div className="tournament-card skeleton">
    <div className="fixture-card">
      <Skeleton width="80%" height="24px" className="mb-2" />
      <Skeleton width="60%" height="20px" className="mb-2" />
      <Skeleton width="40%" height="16px" className="mb-1" />
      <Skeleton width="50%" height="16px" />
    </div>
  </div>
);

const renderSkeletonCards = () => (
  <>
    <SkeletonCard />
    <SkeletonCard />
    <SkeletonCard />
  </>
);

const Matches: React.FC = () => {
  const [schoolId, setSchoolId] = useState<number | null>(null);
  
  useEffect(() => {
    const storedSchoolId = localStorage.getItem('schoolID');
    if (storedSchoolId) {
      const parsedSchoolId = parseInt(storedSchoolId, 10);
      if (isNaN(parsedSchoolId)) {
        console.log("Error")
      } else {
        setSchoolId(parsedSchoolId);
      }
    } else {
      console.log("Error")
    }
  }, []);

  const { loading, error, data } = useQuery(GET_ALL_FIXTURES_FOR_SCHOOL, {
    variables: { schoolId: schoolId },
  });

  const fixtures = data?.getAllFixturesForSchool[0]?.fixtures ?? [];

  // Helper function to format date
  const formatDate = (dateString: string) => {
    const date = new Date(parseInt(dateString));
    return `${date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} - ${date.toLocaleDateString()}`;
  };

  return (
    <div>
      <Navbar buttontext="Create Tournament / Matches" />
      <h1 className="all-match-title">All MATCHES ({fixtures.length})</h1>
      <div className="tournaments-container-all-matches">
        {loading ? (
          renderSkeletonCards()
        ) : (
          <div className="tournament-card-all-match">
            {fixtures.map((fixture: { id: React.Key | null | undefined; team1: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; team2: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; startDate: any; location: string | number | boolean | React.ReactElement<any, string | React.JSXElementConstructor<any>> | Iterable<React.ReactNode> | React.ReactPortal | null | undefined; }) => (
              <div key={fixture.id} className="fixture-card-all-matches">
                <div className="card-content-result">
                  <div className="tournament-name-result">{fixture.location}</div>
                  <div className="team-names-result">
                    <span className="winning-team-result">{fixture.team1}</span>
                    <span className="losing-team-result"> vs {fixture.team2}</span>
                  </div>
                  
                </div>
                <div className="score-result-all-match">{formatDate(fixture.startDate)}</div>
              </div>
            ))}
          </div>
        )}
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