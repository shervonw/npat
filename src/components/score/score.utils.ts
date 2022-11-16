import { RealtimePresenceState } from "@supabase/supabase-js";
import { indexBy, map, pipe, prop, toPairs } from "ramda";
import { StateContext } from "../../app.types";

const sortUserList = (scoringId: string) => (users: any[]) => {
  const index = users.findIndex(
    ({ user }: { user: { userId: string } }) => user.userId === scoringId
  );

  if (index !== -1) {
    const first = users.splice(index, 1)[0];
    users.unshift(first);
    return users;
  }
  return users;
};

export const transformReponses = (
  players: StateContext[],
  context: StateContext,
  playerIdToScore: string,
) => {
  const { round, userId = "" } = context;

  return pipe(
    map((player: StateContext) => ({
      user: {
        name: player.name,
        userId: player.userId,
      },
      responses: player.responses?.[round] ?? {},
    })),
    sortUserList(playerIdToScore)
  )(players);
};
