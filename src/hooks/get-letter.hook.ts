import { useCallback } from "react";
import { useGameState } from "../context";

export const useGetLetter = () => {
  const [gameState, setGameState] = useGameState();
  const { possibleAlphabet } = gameState;

  return useCallback(() => {
    const alphabet = possibleAlphabet.slice().sort(() => 0.5 - Math.random());

    const letter = alphabet.shift();

    setGameState({ type: "CURRENT_LETTER", value: letter });
    setGameState({ type: "POSSIBLE_ALPHABET", value: alphabet });

    return {
      currentLetter: letter,
      possibleAlphabet: alphabet,
    };
  }, [possibleAlphabet, setGameState]);
};
