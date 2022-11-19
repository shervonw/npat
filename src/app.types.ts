import { RealtimeChannel } from "@supabase/supabase-js";
import { EventObject } from "xstate";

interface User {
  id: string;
  name: string;
  leader: boolean;
  emoji: string;
}

export interface Game {
  allResponses: Record<number, Record<string, any>>;
  allScores: Record<number, Record<string, number>>;
  categories: string[];
  currentLetter?: string;
  possibleAlphabet: string[];
  ready: Record<number, Record<string, boolean>>;
  responses: Record<number, any>;
}

export interface StateContext {
  emoji?: string;
  leader?: boolean;
  maxRounds: number;
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

export interface StateComponentProps {
  send: (event: StateEventObject) => void;
  context: StateContext;
}

export type StateComponentType = React.FC<StateComponentProps & {
  channel?: RealtimeChannel;
  isSubscribed?: boolean;
  players: StateContext[];
}>;
