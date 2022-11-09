import { createReducerContext } from "react-use";
import { ALPHABET } from "../components/create-game/create-game.constants";
import { updateState } from "./context.utils";

const defaultGameState = {
  allResponses: undefined,
  allScores: undefined,
  categories: undefined,
  currentLetter: undefined,
  possibleAlphabet: ALPHABET,
  responses: undefined,
  roomCode: undefined,
  rounds: 0,
  scores: undefined,
  scoringPartners: undefined,
};

const gameStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CATEGORIES":
      return updateState("categories", action.value, state);
    case "ROOM_CODE":
      return updateState("roomCode", action.value, state);
    case "ROUNDS":
      return updateState("rounds", action.value, state);
    case "CURRENT_LETTER":
      return updateState("currentLetter", action.value, state);
    case "POSSIBLE_ALPHABET":
      return updateState("possibleAlphabet", action.value, state);
    case "RESPONSES": {
      const { responses, round } = action.value;

      return updateState(
        "responses",
        {
          ...state.responses,
          [round]: responses,
        },
        state
      );
    }
    case "SCORES": {
      const { scores, round, userId } = action.value;

      return updateState(
        "scores",
        {
          ...state.scores,
          [userId]: {
            ...state.scores?.[userId],
            [round]: scores,
          },
        },
        state
      );
    }
    case "ALL_RESPONSES":
      return updateState("allResponses", action.value, state);
    case "ALL_SCORES":
      return updateState("allScores", action.value, state);
    case "SCORING_PARTNERS":
      return updateState("scoringPartners", action.value, state);
    case "SET_GAME_STATE":
      return {
        ...state,
        ...action.value,
      };
    case "RESET":
      return defaultGameState;
    default:
      return state;
  }
};

const [useGameState, GameStateProvider] = createReducerContext(
  gameStateReducer,
  defaultGameState
);

export { useGameState, GameStateProvider };
