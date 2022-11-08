import {
  keys,
  map,
  pipe,
  pluck,
  prop,
  reduce,
  sort,
  sortBy,
  values
} from "ramda";
import { EMOJIS } from "../constants";

export const getRandomInt = (max: number): number => {
  return Math.floor(Math.random() * max);
};

const aggregateScore = (scores: any): number =>
  pipe(
    keys,
    map((category) => scores[category]),
    reduce((a, b) => a + b, 0)
  )(scores);

export const calculateTotalScore = (
  user: any,
  allScores: Record<string, any>
) => {
  const userScores = allScores?.[user.id] ?? {};

  return pipe(
    values,
    reduce<any, any>(
      (totalScore: number, scores: any) => totalScore + aggregateScore(scores),
      0
    )
  )(userScores);
};

export const sortByScore = (list: any[]) =>
  sort((a, b) => {
    return b - a;
  }, list);

export const getUserIds = (users: any) =>
  pipe<any[], any[], string[]>(sortBy(prop("id")), pluck("id"))(users);

export const getEmoji = (excludeList: any[] = []) => {
  const uniqueEmojiList = EMOJIS.filter((emoji) => !excludeList.includes(emoji))  
  const randomIndex = getRandomInt(uniqueEmojiList.length - 1);

  return uniqueEmojiList[randomIndex];
}