import { createReducerContext } from "react-use";
import { updateState } from "./context.utils";

export type User = {
  id: string;
  name: string;
  leader: boolean;
};

const defaultUserState = {
  user: {},
  users: undefined,
};

const userStateReducer = (state: any, action: any) => {
  switch (action.type) {
    case "CURRENT_USER":
      return updateState("user", action.value, state);
    case "USERS":
      return updateState("users", action.value, state);
    case "RESET":
      return defaultUserState;
    default:
      return state;
  }
};

const [useUserState, UserStateProvider] = createReducerContext(
  userStateReducer,
  defaultUserState
);

export { useUserState, UserStateProvider };
