import { sort } from "ramda";

export const sortByScore = (list: any[]) =>
  sort((a, b) => b.score - a.score, list);
