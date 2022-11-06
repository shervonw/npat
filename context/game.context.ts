import { createReducerContext } from "react-use";
import { updateState } from "./context.utils";

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
              [round]: scores
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
    default:
      return state;
  }
};

const [useGameState, GameStateProvider] =
  createReducerContext(gameStateReducer, {
    categories: [],
    roomCode: "",
    rounds: 0,
    currentLetter: "",
    possibleAlphabet: [],
  });

export { useGameState, GameStateProvider };
