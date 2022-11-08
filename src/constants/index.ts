export const CATEGORIES = [
  { id: 'name', value: 'Name' },
  { id: 'place', value: 'Place' },
  { id: 'animal', value: 'Animal' },
  { id: 'thing', value: 'Thing' },
  { id: 'tv-shows', value: 'TV shows' },
  { id: 'movies', value: 'Movies' },
  { id: 'fruits', value: 'Fruits' },
  { id: 'vegetables', value: 'Vegetables' },
  { id: 'books', value: 'Books' },
  { id: 'subjects', value: 'Subjects' },
  { id: 'celebrities', value: 'Celebrities' },
  { id: 'musicians', value: 'Musicians' },
  { id: 'instruments', value: 'Instruments' },
]

export const ROUND_SELECTIONS = [5, 7, 10]

export const DEFAULT_MAX_ROUNDS = ROUND_SELECTIONS[0]

export const DEFAULT_CATEGORIES = CATEGORIES.slice(0, 5).map((category) => category.value)