import { assoc, assocPath, mergeRight } from "ramda";
import { createReducerContext } from "react-use";
import { Game } from "./app.types";
import { ALPHABET } from "./components/create-game/create-game.constants";

type AppContextReducer = (
  state: Game,
  action: {
    type: keyof Game | "maxRounds" | "newLetter";
    value?: any;
  }
) => Game;

const appContextReducer: AppContextReducer = (state, action) => {
  switch (action.type) {
    case "categories":
      return assoc("categories", action.value, state);
    case "maxRounds":
      return assoc("maxRounds", action.value, state);
    case "newLetter":
      return mergeRight(state, action.value);
    case "responses":
      return assocPath(
        ["responses", action.value.round],
        action.value.values,
        state
      );
    case "allResponses":
      return assocPath(
        ["allResponses", action.value.round, action.value.userId],
        action.value.values,
        state
      );
    case "allScores":
      return assocPath(
        ["allScores", action.value.round, action.value.userId],
        action.value.score,
        state
      );
    case "ready":
      return assocPath(
        ["ready", action.value.round, action.value.userId],
        true,
        state
      );
    default:
      return state;
  }
};

const [useAppContext, AppContextProvider] =
  createReducerContext<AppContextReducer>(appContextReducer, {
    allResponses: {},
    allScores: {},
    categories: [],
    possibleAlphabet: ALPHABET,
    ready: {},
    responses: {},
  });

export { useAppContext, AppContextProvider };
