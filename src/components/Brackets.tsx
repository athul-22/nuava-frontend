import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SingleEliminationBracket, Match, SVGViewer,createTheme } from '@g-loot/react-tournament-brackets';

interface Participant {
  id: number;
  name: string;
  resultText: string;
  isWinner: boolean | null;
  status: null;
}

interface Bracket {
  id: number;
  name: string;
  nextMatchId: number | null;
  tournamentRoundText: string;
  startTime: string;
  state: string;
  participants: Participant[];
}

const BracketsList = () => {
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('http://localhost:3000/graphql', {
          query: `
            query GetBrackets($input: GetBracketsInput!) {
              getBrackets(input: $input) {
                id
                tournamentId
                team1Id
                team2Id
                team1Name
                team2Name
                team1Score
                team2Score
                startDate
                endDate
              }
            }
          `,
          variables: { input: { tournamentId: 1 } }
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data.getBrackets;
        const transformedData = transformData(apiData);
        setBrackets(transformedData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  const transformData = (data: any[]): Bracket[] => {
    return data.map((match) => ({
      id: match.id,
      name: `${match.team1Name} vs ${match.team2Name}`,
      nextMatchId: null, // Adjust this based on your data
      tournamentRoundText: 'Quarterfinal', // Adjust this based on your data
      startTime: new Date(parseInt(match.startDate)).toISOString(),
      state: 'DONE', // Adjust this based on your data
      participants: [
        {
          id: match.team1Id,
          name: match.team1Name,
          resultText: match.team1Score.toString(),
          isWinner: match.team1Score > match.team2Score,
          status: null,
        },
        {
          id: match.team2Id,
          name: match.team2Name,
          resultText: match.team2Score.toString(),
          isWinner: match.team2Score > match.team1Score,
          status: null,
        }
      ]
    }));
  };

  if (loading) {
    return <div>Loading...</div>;
  }

  const WhiteTheme = createTheme({
    textColor: { main: '#000000', highlighted: '#07090D', dark: '#3E414D' },
    matchBackground: { wonColor: '#daebf9', lostColor: '#96c6da' },
    score: {
      background: { wonColor: '#87b2c4', lostColor: '#87b2c4' },
      text: { highlightedWonColor: '#7BF59D', highlightedLostColor: '#FB7E94' },
    },
    border: {
      color: '#CED1F2',
      highlightedColor: '#da96c6',
    },
    roundHeader: { backgroundColor: '#da96c6', fontColor: '#000' },
    connectorColor: '#CED1F2',
    connectorColorHighlight: '#da96c6',
    svgBackground: '#FAFAFA',
  });
  
  return (
    <div style={{ backgroundColor: '#f9f9f9', padding: '20px' }}>
      <SingleEliminationBracket
        matches={brackets}
        theme={WhiteTheme}
        matchComponent={Match}
        svgWrapper={({ children, ...props }: any) => (
          <SVGViewer width={500} height={500} {...props}>
            {children}
          </SVGViewer>
        )}
      />
    </div>
  );
};

export default BracketsList;
