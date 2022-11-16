import { createStateContext } from "react-use";
import { Game } from "./app.types";
import { ALPHABET } from "./components/create-game/create-game.constants";

const [useAppContext, AppContextProvider] = createStateContext<Game>({
  maxRounds: 5,
  possibleAlphabet: ALPHABET,
});

export { useAppContext, AppContextProvider };
