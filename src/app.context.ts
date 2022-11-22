import { assoc, assocPath, mergeRight } from "ramda";
import { createReducerContext } from "react-use";
import { Game } from "./app.types";
import { ALPHABET } from "./components/create-game/create-game.constants";

type AppContextReducer = (
  state: Game,
  action: {
    type: keyof Game | "reset";
    value?: any;
  }
) => Game;

const DEFAULT_CONTEXT = {
  allResponses: {},
  allScores: {},
  categories: [],
  currentLetter: "",
  maxRounds: 5,
  possibleAlphabet: ALPHABET,
  ready: {},
  scoringPartners: {},
};

const appContextReducer: AppContextReducer = (state, action) => {
  switch (action.type) {
    case "categories":
    case "currentLetter":
    case "maxRounds":
    case "player":
    case "possibleAlphabet":
      return assoc(action.type, action.value, state);
    case "allResponses":
      return assocPath<any, Game>(
        ["allResponses", action.value.round, action.value.userId],
        action.value.values
      )(state);
    case "allScores":
      return assocPath<number, Game>(
        ["allScores", action.value.round, action.value.userId],
        action.value.score
      )(state);
    case "ready":
      return assocPath<boolean, Game>(
        ["ready", action.value.round, action.value.userId],
        true
      )(state);
    case "scoringPartners":
      return assoc("scoringPartners", action.value, state);
    case "reset":
      return DEFAULT_CONTEXT;
    default:
      return state;
  }
};

const [useAppContext, AppContextProvider] =
  createReducerContext<AppContextReducer>(appContextReducer, DEFAULT_CONTEXT);

export { useAppContext, AppContextProvider };
