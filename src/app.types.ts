import { EventObject } from "xstate";

interface User {
  id: string;
  name: string;
  leader: boolean;
  emoji: string;
}

export interface Game {
  categories?: string[];
  currentLetter?: string;
  maxRounds: number;
  possibleAlphabet: string[];
}

export interface StateContext {
  game: Game;
  emoji?: string;
  leader?: boolean;
  name?: string;
  roomCode?: string;
  round: number;
  userId?: string;
  ready?: Record<number, boolean>;
  responses?: Record<number, any>;
  scores?: Record<number, any>;
  totalScore?: number;
}

export interface StateEventObject extends EventObject {
  value?: any;
}

export type StateComponentProps = {
  send: (event: StateEventObject) => void;
  context: StateContext;
}

export type StateComponentType = React.FC<StateComponentProps>;

export type SubscribeStatus = "CHANNEL_ERROR" | "CLOSED" | "SUBSCRIBED" |"TIMED_OUT";
