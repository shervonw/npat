import { adjectives, animals, uniqueNamesGenerator } from "unique-names-generator";

const getRandomNumber = (min = 0, max = 99) => (Math.random() * (max - min) + min).toFixed(0)

const uniqueRoomName = uniqueNamesGenerator({
  dictionaries: [adjectives, animals],
  separator: '-',
})

export const generateRoomName = () => `${uniqueRoomName}-${getRandomNumber()}`
