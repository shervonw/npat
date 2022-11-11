import { EventObject } from "xstate";
import { CreateGame } from "./components/create-game";
import { InputList } from "./components/input-list";
import { Instructions } from "./components/instructions";
import { JoinGame } from "./components/join-game";
import { Score } from "./components/score";
import { ScoreReview } from "./components/score-review";
import { Scoreboard } from "./components/scoreboard";
import { WaitingRoom } from "./components/waiting-room";
import { appStateMachine } from "./app.machine";
import { Home } from "./components/home";
import { StateComponentType } from "./app.types";


export const componentsMap: Map<string, StateComponentType> = new Map([
  ["home.index", Home],
  ["home.join", JoinGame]
]);