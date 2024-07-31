import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import '../styles/Result.css';
import Navbar from './Navbar';

const GET_FIXTURE_RESULTS = gql`
  query GetFixtureResults {
    getFixtureResults {
      fixtureId
      tournamentName
      team1 {
        teamID
        teamName
        score
        matchEvents {
          playerId
          playerName
          eventType
        }
      }
      team2 {
        teamID
        teamName
        score
        matchEvents {
          playerId
          playerName
          eventType
        }
      }
      finalScore
    }
  }
`;

interface MatchEvent {
  playerId: string;
  playerName: string;
  eventType: string;
}

interface Team {
  teamID: string;
  teamName: string;
  score: string;
  matchEvents: MatchEvent[];
}

interface FixtureResult {
  fixtureId: number;
  tournamentName: string;
  team1: Team;
  team2: Team;
  finalScore: string;
}

const Result: React.FC = () => {
  const [selectedFixture, setSelectedFixture] = useState<FixtureResult | null>(null);
  
  const { loading, error, data } = useQuery(GET_FIXTURE_RESULTS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCardClick = (fixture: FixtureResult) => {
    setSelectedFixture(fixture);
  };

  const closeDialog = () => {
    setSelectedFixture(null);
  };

  const getWinningTeam = (fixture: FixtureResult) => {
    const team1Score = parseInt(fixture.team1.score);
    const team2Score = parseInt(fixture.team2.score);
    return team1Score > team2Score ? fixture.team1 : fixture.team2;
  };

  const getLosingTeam = (fixture: FixtureResult) => {
    const team1Score = parseInt(fixture.team1.score);
    const team2Score = parseInt(fixture.team2.score);
    return team1Score < team2Score ? fixture.team1 : fixture.team2;
  };

  const renderMatchEvents = (events: MatchEvent[]) => {
    return events.map((event, index) => (
      <div key={index} className="match-event-result">
        <span className="event-player-result">{event.playerName}</span>
        <span className="event-type-result">{event.eventType === 'GOAL' ? '⚽' : '🔴'}</span>
      </div>
    ));
  };

  return (
    <>
      <Navbar buttontext='Create Tournament / Match'/>
      <div className="result-container-result">
        <div className="result-cards-result">
          {data.getFixtureResults.map((fixture: FixtureResult) => {
            const winningTeam = getWinningTeam(fixture);
            const losingTeam = getLosingTeam(fixture);
            
            return (
              <Card style={{cursor:'pointer'}}
                key={fixture.fixtureId}
                className="result-card-result"
                onClick={() => handleCardClick(fixture)}
              >
                <div className="card-content-result" style={{cursor:'pointer'}}>
                  <div className="tournament-name-result">{fixture.tournamentName}</div>
                  <div className="team-names-result">
                    <span className="winning-team-result">{winningTeam.teamName} </span>
                    <span className="losing-team-result"> vs  {losingTeam.teamName}</span>
                  </div>
                  <div className="score-result">{fixture.finalScore}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <Dialog
          visible={selectedFixture !== null}
          onHide={closeDialog}
          modal
          className="match-details-dialog-result"
          dismissableMask={true}
        >
          {selectedFixture && (
            <div className="match-details-result">
              <h2 className="tournament-name-result-dialog">{selectedFixture.tournamentName}</h2>
              <div className="final-score-result">
                <div className="team-info-result">
                  <span className={`team-name-result ${parseInt(selectedFixture.team1.score) > parseInt(selectedFixture.team2.score) ? 'team-name-result-win' : 'team-name-result-loss'}`}>
                    {selectedFixture.team1.teamName}
                  </span>
                </div>
                <div className="score-container-result">
                  <span className="score-result">{selectedFixture.finalScore}</span>
                </div>
                <div className="team-info-result">
                  <span className={`team-name-result ${parseInt(selectedFixture.team2.score) > parseInt(selectedFixture.team1.score) ? 'team-name-result-win' : 'team-name-result-loss'}`}>
                    {selectedFixture.team2.teamName}
                  </span>
                </div>
              </div>
              <div className="match-events-result">
                <div className="team-events-result">
                  {renderMatchEvents(selectedFixture.team1.matchEvents)}
                </div>
                <div className="team-events-result">
                  {renderMatchEvents(selectedFixture.team2.matchEvents)}
                </div>
              </div>
            </div>
          )}
        </Dialog>
      </div>
    </>
  );
};

export default Result;