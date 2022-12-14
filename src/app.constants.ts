import { StateComponentType } from "./app.types";
import { CreateGame } from "./components/create-game";
import { Home } from "./components/home";
import { InputList } from "./components/input-list";
import { Instructions } from "./components/instructions";
import { JoinGame } from "./components/join-game";
import { Score } from "./components/score";
import { ScoreReview } from "./components/score-review";
import { Scoreboard } from "./components/scoreboard";
import { WaitingRoom } from "./components/waiting-room";


export const componentsMap: Map<string, StateComponentType> = new Map([
  ["home.index", Home],
  ["home.join", JoinGame],
  ["home.create", CreateGame],
  ["home.instructions", Instructions],
  ["game.waitingRoom", WaitingRoom],
  ["game.playing", InputList],
  ["game.score", Score],
  ["game.scoreReview", ScoreReview],
  ["game.scoreboard", Scoreboard],
]);