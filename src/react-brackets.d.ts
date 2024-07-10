declare module 'react-brackets' {
    import React from 'react';
  
    export interface SeedTeam {
      name: string;
      winner?: boolean;
    }
  
    export interface Seed {
      id: number | string;
      date: string;
      teams: SeedTeam[];
    }
  
    export interface RoundProps {
      title: string;
      seeds: Seed[];
    }
  
    export interface BracketProps {
      rounds: RoundProps[];
    }
  
    export const Bracket: React.FC<BracketProps>;
  
    export interface SeedItemProps {
      seed: Seed;
      breakpoint: string;
    }
  
    export const SeedItem: React.FC<SeedItemProps>;
  
    export interface SeedTeamProps {
      team: SeedTeam;
    }
  
    export const SeedTeam: React.FC<SeedTeamProps>;
  }