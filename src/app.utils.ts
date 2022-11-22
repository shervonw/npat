import { zipObj } from "ramda";
import { EMOJIS } from "./constants";

type GetRandomNumberFn = (input?: { min?: number; max?: number }) => number;
export const getRandomNumber: GetRandomNumberFn = ({ min = 0, max = 99 } = {}) =>
  Math.floor(Math.random() * (max - min) + min);

export const getEmoji = (excludeList: any[] = []) => {
  const uniqueEmojiList = EMOJIS.filter(
    (emoji) => !excludeList.includes(emoji)
  );
  const randomIndex = getRandomNumber({ max: uniqueEmojiList.length });

  return uniqueEmojiList[randomIndex];
};

export const createPlayer = (name: string, leader: boolean = false) => ({
  userId: Math.floor(Math.random() * 100000000).toString(),
  name,
  leader,
  emoji: getEmoji(),
});

const doesAnyPairCollide = (list1: string[], list2: string[]) => {
  for (let i = 0; i <= list1.length - 1; i++) {
    if (list1[i] === list2[i]) {
      return true;
    }
  }

  return false;
};

export const generateScoringPartners = (users: string[]) => {
  if (users.length >= 2) {
    const userList1 = users.slice();
    const userList2 = userList1.slice();

    while (true) {
      userList1.sort(() => 0.5 - Math.random());
      userList2.sort(() => 0.5 - Math.random());

      const hasCollision = doesAnyPairCollide(userList1, userList2);

      if (!hasCollision) {
        break;
      }
    }

    return zipObj(userList1, userList2);
  }

  return {
    [users[0]]: users[0],
  };
};

