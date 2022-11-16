import { type } from "os";
import { assoc, mergeDeepRight } from "ramda";
import { createReducerContext } from "react-use";
import { Game } from "./app.types";
import { ALPHABET } from "./components/create-game/create-game.constants";

type AppStateReducerAction = {
  type: "SCORE" | "SET_STATE";
  value: any;
};

interface AppContextState extends Game {
  score: number;
}

type AppStateReducerType = (
  state: AppContextState,
  action: AppStateReducerAction
) => AppContextState;

const appStateReducer: AppStateReducerType = (state, action) => {
  switch (action.type) {
    case "SCORE":
      return assoc("score", action.value, state);
    case "SET_STATE":
      return mergeDeepRight(state, action.value);
    default:
      state;
  }
};

const [useAppContext, AppContextProvider] =
  createReducerContext<AppStateReducerType>(appStateReducer, {
    score: 0,
    maxRounds: 5,
    possibleAlphabet: ALPHABET,
  });

export { useAppContext, AppContextProvider };
