import { adjust, assoc, mergeLeft, mergeRight, pipe } from "ramda";
import { useMemo } from "react";
import { useAppContext } from "../../app.context";
import { Player } from "../../app.types";

interface PlayerWithScore extends Player {
  place: number;
  score: number;
  tied: boolean;
}

export const usePlayersWithScore = (
  currentUserId: string,
  players: Player[]
) => {
  const [appContext] = useAppContext();

  const playerScoreMap = useMemo(
    () =>
      Object.entries(appContext.allScores).reduce(
        (scoreMap: any, [, userScores]) => {
          for (const [userId, score] of Object.entries(userScores)) {
            if (scoreMap[userId]) {
              scoreMap[userId] = scoreMap[userId] + score;
            } else {
              scoreMap[userId] = score;
            }
          }

          return scoreMap;
        },
        {}
      ),
    [appContext.allScores]
  );

  const playersWithScore = useMemo(() => {
    const sortedPlayers: PlayerWithScore[] = players
      .map((player: any) => ({
        ...player,
        score: playerScoreMap[player.userId ?? ""] ?? 0,
      }))
      .sort((a, b) => b.score - a.score);

    return sortedPlayers.reduce((allPlayers, player, index) => {
      if (index === 0) {
        return adjust(index, assoc("place", index + 1), allPlayers);
      }

      const prevPlayer = allPlayers[index - 1];

      if (prevPlayer.score === player.score) {
        return pipe(
          adjust<PlayerWithScore>(
            index,
            mergeLeft({
              place: prevPlayer.place,
              tied: true,
            })
          ),
          adjust<PlayerWithScore>(index - 1, assoc("tied", true))
        )(allPlayers);
      }

      return adjust<PlayerWithScore>(
        index,
        mergeLeft({
          place: index + 1,
          tied: false,
        }),
        allPlayers
      );
    }, sortedPlayers);
  }, [playerScoreMap, players]);

  const position = useMemo(
    () =>
      playersWithScore.findIndex(
        (player: any) => player.userId === currentUserId
      ),
    [currentUserId, playersWithScore]
  );

  return {
    playersWithScore,
    position,
  };
};
