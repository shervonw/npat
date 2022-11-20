import { indexBy, map, pipe, prop, toPairs } from "ramda";
import { StateContext } from "../../app.types";

export const sortUserList = (scoringId: string) => (allResponses: [string, any][]) => {
  const index = allResponses.findIndex(([userId]) => userId === scoringId);

  if (index !== -1) {
    const allResponsesCopy = allResponses.slice();
    const first = allResponsesCopy.splice(index, 1)[0];
    allResponsesCopy.unshift(first);
    return allResponsesCopy;
  }

  return allResponses;
};

export const transformReponses = (
  allResponses: Record<string, any> = {},
  playerIdToScore: string,
  players: StateContext[],
) => {
  const playersIndexByUserId = indexBy(prop("userId"), players);

  return pipe(
    toPairs,
    sortUserList(playerIdToScore),
    map(([userId, responses]) => ({
      user: playersIndexByUserId?.[userId],
      responses,
    })),
  )(allResponses)
};
