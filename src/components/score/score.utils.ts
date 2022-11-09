import { find, map, pipe, toPairs } from "ramda";

const sortUserList = (scoringId: string) => (users: any[]) => {
  const index = users.findIndex(
    ({ user }: { user: { id: string } }) => user.id === scoringId
  );

  if (index !== -1) {
    const first = users.splice(index, 1)[0];
    users.unshift(first);
    return users;
  }
  return users;
};

export const transformReponses = (
  allResponses: any,
  round: number,
  playerIdToScore: string,
  users: any[]
) => {
  return pipe(
    toPairs,
    map(([userId, responses]: [string, any]) => ({
      responses: responses?.[round],
      user: find((user) => userId === user.id, users),
    })),
    sortUserList(playerIdToScore)
  )(allResponses);
};
