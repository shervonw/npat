import { RealtimeChannel } from "@supabase/supabase-js";
import { EventObject } from "xstate";

export interface Player {
  userId: string;
  name: string;
  leader: boolean;
  emoji: string;
}

export interface Game {
  allResponses: Record<number, Record<string, any>>;
  allScores: Record<number, Record<string, number>>;
  categories: string[];
  currentLetter?: string;
  maxRounds: number;
  player?: Player;
  possibleAlphabet: string[];
  ready: Record<number, Record<string, boolean>>;
  scoringPartners: Record<string, string>;
}

export interface StateContext {
  maxRounds: number;
  roomCode: string;
  round: number;
}

export interface StateEventObject extends EventObject {
  value?: any;
}

export interface StateComponentProps {
  send: (event: StateEventObject) => void;
  context: StateContext;
}

export type StateComponentType = React.FC<StateComponentProps & {
  channel?: RealtimeChannel;
  isSubscribed?: boolean;
  players: Player[];
}>;
