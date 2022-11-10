export { EMOJIS } from "./emojis";

export const CATEGORIES = [
  { id: "name", value: "Name" },
  { id: "place", value: "Place" },
  { id: "animal", value: "Animal" },
  { id: "thing", value: "Thing" },
  { id: "tv-show", value: "TV show" },
  { id: "movie", value: "Movie" },
  { id: "fruit", value: "Fruit" },
  { id: "vegetable", value: "Vegetable" },
  { id: "book", value: "Book" },
  { id: "subject", value: "Subject" },
  { id: "celebrity", value: "Celebrity" },
];

export const ROUND_SELECTIONS = [5, 7, 10];

export const DEFAULT_MAX_ROUNDS = ROUND_SELECTIONS[0];

export const DEFAULT_CATEGORIES = CATEGORIES.slice(0, 5).map(
  (category) => category.value
);
