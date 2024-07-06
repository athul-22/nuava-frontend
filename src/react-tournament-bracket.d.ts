declare module 'react-tournament-bracket' {
    import React from 'react';
  
    export interface MatchProps {
      id: string;
      name: string;
      scheduled: string;
      sides: {
        home: {
          team: {
            id: string;
            name: string;
          };
          score: {
            score: number;
          };
        };
        visitor: {
          team: {
            id: string;
            name: string;
          };
          score: {
            score: number;
          };
        };
      };
    }
  
    export interface RoundProps {
      title: string;
      seeds: MatchProps[];
    }
  
    export interface BracketProps {
      rounds: RoundProps[];
    }
  
    export const Bracket: React.FC<BracketProps>;
  }