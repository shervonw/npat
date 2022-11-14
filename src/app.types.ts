import { EventObject } from "xstate";

interface User {
  id: string;
  name: string;
  leader: boolean;
  emoji: string;
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
  leader?: boolean;
  name?: string;
  players?: User[];
  roomCode?: string;
  round: number;
  timerValue: number;
  userId?: string;
  emoji?: string;
}

export interface StateEventObject extends EventObject {
  value?: any;
}

export type StateComponentProps = {
  send: (event: StateEventObject) => void;
  context: StateContext;
}

export type StateComponentType = React.FC<StateComponentProps>;

export enum ChannelSubscribeStatus {
  CHANNEL_ERROR = "CHANNEL_ERROR",
  CLOSED = "CLOSED",
  SUBSCRIBED = "SUBSCRIBED",
  TIMED_OUT = "TIMED_OUT",
};


export type SubscribeStatus = keyof typeof ChannelSubscribeStatus;
