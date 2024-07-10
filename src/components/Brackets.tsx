import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { SingleEliminationBracket, Match, SVGViewer, createTheme } from '@g-loot/react-tournament-brackets';
import Navbar from './Navbar';

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

interface CustomMatchProps {
  match: {
    participants: Participant[];
  };
}

const BracketsList: React.FC = () => {
  const [brackets, setBrackets] = useState<Bracket[]>([]);
  const [loading, setLoading] = useState(true);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => {
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      const token = localStorage.getItem('token');
      try {
        const response = await axios.post('https://nuavasports.com/graphql', {
          query: `
            query Query($input: GetBracketsInput!) {
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
          `,
          variables: { input: { tournamentId: 1 } }
        }, {
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
        });

        const apiData = response.data.data.getBrackets;
        setBrackets(apiData);
      } catch (error) {
        console.error('Error fetching data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const mapTournamentRoundText = (round: string) => {
    switch (round) {
      case '1':
        return 'Quarterfinal';
      case '2':
        return 'Semifinal';
      case '3':
        return 'Final';
      default:
        return round;
    }
  };

  const mappedBrackets = brackets.map(bracket => ({
    ...bracket,
    tournamentRoundText: mapTournamentRoundText(bracket.tournamentRoundText),
  }));

  if (loading) {
    return <div>Loading...</div>;
  }

  const LightTheme = createTheme({
    textColor: { main: '#000000', highlighted: '#000000', dark: '#000000' },
    matchBackground: { wonColor: '#ffffff', lostColor: '#ffffff' },
    score: {
      background: { wonColor: '#4ADE80', lostColor: '#F87171' },
      text: { highlightedWonColor: '#FFFFFF', highlightedLostColor: '#FFFFFF' },
    },
    border: {
      color: '#E5E7EB',
      highlightedColor: 'silver',
    },
    roundHeader: { backgroundColor: '#F3F4F6', fontColor: '#000000' },
    connectorColor: '#E5E7EB',
    connectorColorHighlight: '#4ADE80',
    svgBackground: '#FFFFFF',
  });

  const CustomMatch: React.FC<CustomMatchProps> = ({ ...props }) => {
    const { participants } = props.match;
    const resultAvailable = participants.some((p: Participant) => p.resultText !== null);
    const isWinner = participants.find((p: Participant) => p.isWinner);
    const leftBorderColor = resultAvailable
      ? isWinner
        ? '#4ADE80' // Green for winner
        : '#F87171' // Red for loser
      : '#E5E7EB'; // Silver for no result

    return (
      <Match
        {...props}
        style={{
          borderLeft: `10px solid ${leftBorderColor}`,
          backgroundColor: participants[0].status === null
            ? '#C0C0C0' // Silver background for no status
            : isWinner
              ? '#ECFDF5' // Light green for winner
              : '#FEF2F2', // Light red for loser
          color: participants[0].status === null ? '#000000' : '#FFFFFF', // Black text for no status, white otherwise
        }}
      />
    );
  };

  return (
    <>
      <Navbar buttontext="Create Tournament"/>
      <div style={{
        backgroundColor: '#FFFFFF',
        height: '50vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
      }}>
        <SingleEliminationBracket
          matches={mappedBrackets}
          theme={LightTheme}
          matchComponent={CustomMatch}
          svgWrapper={({ children, ...props }: any) => (
            <SVGViewer
              width={windowSize.width}
              height={windowSize.height} // Set the SVGViewer height to window height
              {...props}
              background="#FFFFFF"
              SVGBackground="#FFFFFF"
            >
              {children}
            </SVGViewer>
          )}
        />
      </div>
    </>
  );
};

export default BracketsList;
