import { createReducerContext } from "react-use";
import { updateState } from "./context.utils";


const stateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "SET_CATEGORIES":
      return updateState("categories", action.value, state);
    case "SET_ROOM_CODE":
      return updateState("roomCode", action.value, state);
    case "SET_USER_KEYS":
        return updateState("userKeys", action.value, state);
    case "CURRENT_USER":
      return updateState("user", action.value, state);
    case "CURRENT_LETTER":
      return updateState("letter", action.value, state);
    case "ADD_ANSWERS": {
      const { currentRoom, answers } = action.value;

      return updateState(
        "answers",
        {
          ...state.answers,
          [currentRoom]: answers,
        },
        state
      );
    }
    default:
      return state;
  }
};

const [useReducerContext, StateReducerProvider, StateReducerContext] =
  createReducerContext(stateReducer, {});

export { useReducerContext, StateReducerProvider, StateReducerContext };
