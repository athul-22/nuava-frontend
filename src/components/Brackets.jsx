import React, { useState, useEffect } from 'react';
import { Bracket, Seed, SeedItem, SeedTeam } from 'react-brackets';
import { usePopper } from 'react-popper';
import Navbar from './Navbar';
import menuOptionsWithIcons from './menuOptionsWithIcons';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, List, ListItem, ListItemText } from '@mui/material';

const PopperMenu = ({ isOpen, onClose, title, anchorEl, options, onOptionClick }) => {
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(anchorEl, popperElement, {
    placement: 'bottom-start',
    modifiers: [
      { name: 'offset', options: { offset: [0, 8] } },
    ],
  });

  if (!isOpen) return null;

  return (
    <div
      ref={setPopperElement}
      style={{
        ...styles.popper,
        backgroundColor: 'white',
        padding: '10px',
        borderRadius: '5px',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
        zIndex: 1000,
        minWidth: '150px',
      }}
      {...attributes.popper}
    >
      <h3 style={{ margin: '0 0 10px 0', borderBottom: '1px solid #eee', paddingBottom: '5px', fontSize: '14px' }}>{title}</h3>
      <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
        {options.map((item) => (
          <li 
            key={item.label} 
            style={{ 
              padding: '10px 10px', 
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              fontSize: '14px',
              color: item.style?.color || 'inherit'
            }}
            onClick={() => {
              onOptionClick(item.onClick);
              onClose();
            }}
          >
            <item.icon style={{ marginRight: '20px' }} />
            {item.label}
          </li>
        ))}
      </ul>
    </div>
  );
};

const CustomSeed = ({ seed, breakpoint, onFixtureClick }) => {
  const determineFixtureStyle = (fixture) => {
    switch (fixture.state) {
      case 'PENDING':
        return { borderLeft: '5px solid grey' };
      case 'STARTED':
        return { borderLeft: '5px solid blue' };
      case 'ENDED':
        return { borderLeft: '5px solid green' };
      default:
        return { borderLeft: '5px solid grey' };
    }
  };

  const determineTeamStyle = (team, fixtureState) => {
    if (fixtureState === 'STARTED' || fixtureState === 'ENDED') {
      return team.isWinner ? { color: 'green', fontWeight: 'bold' } : { color: 'red' };
    }
    return { color: 'grey',borderLeft: '5px solid grey',marginTop:'10px' };
  };

  return (
    <Seed mobileBreakpoint={breakpoint} style={{ fontSize: 12 }}>
      <SeedItem 
        style={{ 
          ...determineFixtureStyle(seed),
          backgroundColor: 'white', 
          color: 'black', 
          padding: '10px', 
          borderRadius: '5px', 
          border: '1px solid #eee',
          cursor: 'pointer'
        }}
        onClick={(e) => onFixtureClick(e, seed)}
      >
        <div>
          {seed.teams.map((team, index) => (
            <SeedTeam 
              key={index}
              style={determineTeamStyle(team, seed.state)}
            >
              {team.name || 'NO TEAM'}
            </SeedTeam>
          ))}
        </div>
      </SeedItem>
    </Seed>
  );
};

const BracketsComponent = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedFixture, setSelectedFixture] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);
  const [rounds, setRounds] = useState(null);
  const [loading, setLoading] = useState(true);
  const [swapDialogOpen, setSwapDialogOpen] = useState(false);
  const [swapOptions, setSwapOptions] = useState([]);

  const [fixtureDialogOpen, setFixtureDialogOpen] = useState(false);

  const handleFixtureClick = (event, fixture) => {
    event.stopPropagation();
    setSelectedFixture(fixture);
    setAnchorEl(event.currentTarget);
    setMenuOpen(true);
    console.log('Clicked fixture:', fixture);
  };

  const handleOptionClick = async (action) => {
    console.log(`${action} clicked for fixture:`, selectedFixture);
    if (action === 'handleStart') {
      localStorage.setItem('selectedFixture', JSON.stringify(selectedFixture));
      window.location.href = '/football/matches';
    } else if (action === 'handleSwap') {
      showSwapOptions(selectedFixture);
    }
    else if (action === 'fixtureInfo') {
      setFixtureDialogOpen(true);
    }
    setMenuOpen(false);
  };

  const showSwapOptions = (fixture) => {
    const otherFixtures = rounds.flatMap(round => 
      round.seeds.filter(seed => seed.id !== fixture.id)
    );

    const options = [];
    fixture.teams.forEach(teamToSwap => {
      otherFixtures.forEach(otherFixture => {
        otherFixture.teams.forEach(otherTeam => {
          options.push({
            teamToSwap: teamToSwap,
            targetFixture: otherFixture,
            targetTeam: otherTeam
          });
        });
      });
    });

    setSwapOptions(options);
    setSwapDialogOpen(true);
  };

  const handleSwap = async (swapOption) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://nuavasports.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `
            mutation SwapTeams($input: SwapTeamsInput!) {
              swapTeams(input: $input) {
                status
                message
              }
            }
          `,
          variables: { 
            input: { 
              fixtureId1: parseInt(selectedFixture.id),
              fixtureId2: parseInt(swapOption.targetFixture.id),
              team1Id: parseInt(swapOption.teamToSwap.id),
              team2Id: parseInt(swapOption.targetTeam.id)
            } 
          },
        }),
      });
      const result = await response.json();
      if (result.data?.swapTeams?.status) {
        console.log(result.data.swapTeams.message);
        fetchBracketsData();  // Refresh data after swapping teams
      } else {
        console.error('Swap failed:', result.errors || result.data?.swapTeams?.message);
      }
    } catch (error) {
      console.error('Error swapping teams:', error);
    }
    setSwapDialogOpen(false);
  };

  const fetchBracketsData = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('https://nuavasports.com/graphql', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `jwt ${token}`,
        },
        body: JSON.stringify({
          query: `query GetBrackets($input: GetBracketsInput!) {
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
          }`,
          variables: { input: { tournamentId: 5 } },
        }),
      });

      const result = await response.json();
      const brackets = result.data?.getBrackets;

      if (brackets) {
        const mappedRounds = brackets.reduce((acc, match) => {
          const roundIndex = parseInt(match.tournamentRoundText, 10) - 1;
          if (!acc[roundIndex]) {
            acc[roundIndex] = { title: `Round ${roundIndex + 1}`, seeds: [] };
          }
          acc[roundIndex].seeds.push({
            id: match.id,
            date: new Date(match.startTime).toDateString(),
            state: match.state,
            teams: match.participants.map(participant => ({
              id: participant.id,
              name: participant.name,
              isWinner: participant.isWinner,
            })),
          });
          return acc;
        }, []);

        setRounds(mappedRounds);
      }
    } catch (error) {
      console.error('Error fetching data:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBracketsData();
  }, []);

  return (
    <>
      <Navbar buttontext="Create Tournament / Match" />
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        padding: '20px',
        backgroundColor: 'white',
        fontSize:'24px'
      }}>
        {loading ? (
          <Skeleton height={40} count={10} />
        ) : rounds ? (
          <Bracket
            rounds={rounds}
            renderSeedComponent={(props) => (
              <CustomSeed {...props} onFixtureClick={handleFixtureClick} />
            )}
          />
        ) : (
          <img src="https://static.vecteezy.com/system/resources/previews/010/856/652/non_2x/no-result-data-document-or-file-not-found-concept-illustration-flat-design-eps10-modern-graphic-element-for-landing-page-empty-state-ui-infographic-icon-etc-vector.jpg" height="100px" width="200px" alt="No data" />
        )}
        <PopperMenu 
          isOpen={menuOpen} 
          onClose={() => setMenuOpen(false)} 
          title={selectedFixture ? `Match ${selectedFixture.id}` : ''}
          anchorEl={anchorEl}
          // options={[
          //   ...menuOptionsWithIcons,
          //   { label: 'Swap Teams', onClick: 'handleSwap', icon: 'SwapIcon' }
          // ]}
          options={menuOptionsWithIcons}
          onOptionClick={handleOptionClick}
        />
        <Dialog open={swapDialogOpen} onClose={() => setSwapDialogOpen(false)}>
          <DialogTitle>Select a team to swap</DialogTitle>
          <DialogContent>
            <List>
              {swapOptions.map((option, index) => (
                <ListItem button key={index} onClick={() => handleSwap(option)}>
                  <ListItemText primary={`Swap ${option.teamToSwap.name} with ${option.targetTeam.name} (Fixture ${option.targetFixture.id})`} />
                </ListItem>
              ))}
            </List>
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setSwapDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>

        <Dialog open={fixtureDialogOpen} onClose={() => setFixtureDialogOpen(false)}>
          <DialogTitle>Select a team to swap</DialogTitle>
          <DialogContent>
           
          </DialogContent>
          <DialogActions>
            <Button onClick={() => setFixtureDialogOpen(false)}>Cancel</Button>
          </DialogActions>
        </Dialog>


      </div>
    </>
  );
};

export default BracketsComponent;
