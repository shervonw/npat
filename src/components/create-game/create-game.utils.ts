import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";
import { getRandomNumber } from "../../app.utils";

const uniqueRoomName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals],
  separator: "-",
});

export const generateRoomName = () => `${uniqueRoomName}-${getRandomNumber()}`;

export const getLetterFromAlphabet = (alphabet: string[]) => {
  const alphabetCopy = alphabet.slice();
  const randIdx = getRandomNumber({ max: alphabet.length });

  const letter = alphabetCopy[randIdx];

  alphabetCopy.splice(randIdx, 1);

  return {
    currentLetter: letter,
    possibleAlphabet: alphabetCopy,
  };
};
