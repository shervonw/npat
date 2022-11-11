import { EventObject } from "xstate";

interface User {
  id: string;
  name: string;
  leader: boolean;
}

export interface StateContext {
  gameState: {
    allResponses?: Record<string, any>;
    allScores?: Record<string, any>;
    categories?: string[];
    currentLetter?: string;
    maxRounds: number;
    possibleAlphabet: string[];
    responses?: Record<number, any>;
    scores?: Record<number, any>;
    scoringPartners?: Record<string, string>;
  };
  player?: User;
  players?: User[];
  roomCode?: string;
  round: number;
  timerValue: number;
}

export type ComponentType = React.FC<{
  send: (event: EventObject) => void;
  context: StateContext;
}>;
