import React, { useState, useEffect } from 'react';
import { Bracket, RoundProps, Seed, SeedTeam } from 'react-brackets';
import Navbar from './Navbar';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

interface ExtendedSeedTeam extends SeedTeam {
  isWinner: boolean;
  status: string | null;
}

const Brackets: React.FC = () => {
  const [rounds, setRounds] = useState<RoundProps[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Simulate API call with a 3-second delay
    const timer = setTimeout(() => {
      setRounds(generateDummyData());
      setLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  const generateDummyData = (): RoundProps[] => {
    const teams: ExtendedSeedTeam[] = [
      { name: 'Team A', isWinner: false, status: null },
      { name: 'Team B', isWinner: false, status: null },
      { name: 'Team C', isWinner: false, status: null },
      { name: 'Team D', isWinner: false, status: null },
    ];
    return [
      {
        title: 'Quarter Finals',
        seeds: teams.map((team, index) => ({
          id: index + 1,
          date: new Date().toDateString(),
          teams: [
            team,
            { name: teams[teams.length - 1 - index].name, isWinner: false, status: null }
          ],
        })),
      },
      {
        title: 'Semi Finals',
        seeds: [
          {
            id: 9,
            date: new Date().toDateString(),
            teams: [
              { name: 'Team A', isWinner: true, status: 'active' },
              { name: 'Team D', isWinner: false, status: 'active' }
            ],
          },
          {
            id: 10,
            date: new Date().toDateString(),
            teams: [
              { name: 'Team B', isWinner: false, status: 'active' },
              { name: 'Team C', isWinner: true, status: 'active' }
            ],
          },
        ],
      },
      {
        title: 'Final',
        seeds: [
          {
            id: 11,
            date: new Date().toDateString(),
            teams: [
              { name: 'Team A', isWinner: false, status: 'active' },
              { name: 'Team B', isWinner: true, status: 'active' }
            ],
          },
        ],
      },
    ];
  };

  const handleRightClick = (event: React.MouseEvent, seedId: number | string) => {
    event.preventDefault();
    alert(`Edit clicked for seed ${seedId}`);
  };

  const getBorderColor = (isWinner: boolean, status: string | null) => {
    if (status === null) {
      return 'silver';
    }
    return isWinner ? 'green' : 'red';
  };

  const CustomSeed = ({ seed }: { seed: Seed }) => (
    <div
      onContextMenu={(e) => handleRightClick(e, seed.id)}
      style={{ padding: '20px', border: '1px solid #ccc', borderRadius: '4px', background: '#fff' }}
    >
      <div>{seed.date}</div>
      {seed.teams.map((team, index) => {
        const extendedTeam = team as ExtendedSeedTeam;
        return (
          <div
            key={index}
            style={{
              fontWeight: extendedTeam.name === 'TBD' ? 'normal' : 'bold',
              borderLeft: `10px solid ${getBorderColor(extendedTeam.isWinner, extendedTeam.status)}`,
              padding: '10px',
              margin: '5px 0',
            }}
          >
            {extendedTeam.name}
          </div>
        );
      })}
    </div>
  );

  const renderCustomBracket = () => (
    <div>
      {rounds.map((round, roundIndex) => (
        <div key={roundIndex}>
          <h3>{round.title}</h3>
          <div style={{ display: 'flex', justifyContent: 'space-around' }}>
            {round.seeds.map((seed, seedIndex) => (
              <CustomSeed key={seedIndex} seed={seed} />
            ))}
          </div>
        </div>
      ))}
    </div>
  );

  if (loading) {
    return (
      <div style={{ padding: '20px' }}>
        <Skeleton count={5} height={100} style={{ marginBottom: '20px' }} />
      </div>
    );
  }

  return (
    <>
      <Navbar buttontext="Create Tournament" />
      <div style={{
        backgroundColor: '#FFFFFF',
        minHeight: '100vh',
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        padding: '20px',
      }}>
        {renderCustomBracket()}
      </div>
    </>
  );
};

export default Brackets;
