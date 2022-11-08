import { useCallback } from "react";
import { useGameState } from "../context";
import { getRandomInt } from "../utils";

export const useGetLetter = () => {
  const [gameState, setGameState] = useGameState();
  const { possibleAlphabet } = gameState

  return useCallback(() => {
    const alphabet = possibleAlphabet.slice();
    const randomIndex = getRandomInt(alphabet.length - 1);

    const letter = alphabet[randomIndex];

    alphabet.splice(randomIndex, 1);

    setGameState({ type: "CURRENT_LETTER", value: letter })
    setGameState({ type: "POSSIBLE_ALPHABET", value: alphabet })

    return {
      currentLetter: letter,
      possibleAlphabet: alphabet,
    }
  }, [possibleAlphabet, setGameState]);
};