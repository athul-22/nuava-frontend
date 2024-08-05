import React, { useState } from 'react';
import { gql, useQuery } from '@apollo/client';
import { Card } from 'primereact/card';
import { Dialog } from 'primereact/dialog';
import Navbar from '../Navbar';
// import '../styles/Result.css';

const GET_INTER_HOUSE_EVENTS_RESULTS = gql`
  query GetInterHouseEventsResults {
    getInterHouseEventsResults {
      id
      title
      startDate
      endDate
      description
      details
    }
  }
`;

interface MatchDetails {
  house1Name: string;
  house2Name: string;
  house1Score: number;
  house2Score: number;
  winnerHouse: string;
  interHouseEventStatus: string;
}

interface InterHouseEventResult {
  id: number;
  title: string;
  startDate: string;
  endDate: string;
  description: string | null;
  details: string;
}

const IHResult: React.FC = () => {
  const [selectedEvent, setSelectedEvent] = useState<InterHouseEventResult | null>(null);
  
  const { loading, error, data } = useQuery(GET_INTER_HOUSE_EVENTS_RESULTS, {
    context: {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('token')}`
      }
    }
  });

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error: {error.message}</p>;

  const handleCardClick = (event: InterHouseEventResult) => {
    setSelectedEvent(event);
  };

  const closeDialog = () => {
    setSelectedEvent(null);
  };

  const renderEventDetails = (details: MatchDetails) => {
    return (
      <div className="match-details-result">
        <h2 className="tournament-name-result-dialog">{selectedEvent?.title}</h2>
        <div className="final-score-result">
          <div className="team-info-result">
            <span className={`team-name-result ${details.house1Score > details.house2Score ? 'team-name-result-win' : 'team-name-result-loss'}`}>
              {details.house1Name}
            </span>
          </div>
          <div className="score-container-result">
            <span className="score-result">{`${details.house1Score} - ${details.house2Score}`}</span>
          </div>
          <div className="team-info-result">
            <span className={`team-name-result ${details.house2Score > details.house1Score ? 'team-name-result-win' : 'team-name-result-loss'}`}>
              {details.house2Name}
            </span>
          </div>
        </div>
        <div className="match-format-result">
          {/* <p>{details.description}</p> */}
        </div>
      </div>
    );
  };

  return (
    <>
      <Navbar buttontext='Create Tournament / Match'/>
      <div className="result-container-result">
        <div className="result-cards-result">
          {data.getInterHouseEventsResults.map((event: InterHouseEventResult) => {
            const details: MatchDetails = JSON.parse(event.details);
            
            return (
              <Card style={{cursor:'pointer'}}
                key={event.id}
                className="result-card-result"
                onClick={() => handleCardClick(event)}
              >
                <div className="card-content-result" style={{cursor:'pointer'}}>
                  <div className="tournament-name-result">{event.title}</div>
                  <div className="team-names-result">
                    <span className="winning-team-result">{details.house1Name} </span>
                    <span className="losing-team-result"> vs {details.house2Name}</span>
                  </div>
                  <div className="score-result">{`${details.house1Score} - ${details.house2Score}`}</div>
                </div>
              </Card>
            );
          })}
        </div>

        <Dialog
          visible={selectedEvent !== null}
          onHide={closeDialog}
          modal
          className="match-details-dialog-result"
          dismissableMask={true}
        >
          {selectedEvent && renderEventDetails(JSON.parse(selectedEvent.details))}
        </Dialog>
      </div>
    </>
  );
};

export default IHResult;
