import { adjust, assoc } from "ramda";
import { useMemo } from "react";
import { useAppContext } from "../../app.context";
import { StateContext } from "../../app.types";

export const usePlayersWithScore = (
  currentUserId: string,
  players: StateContext[]
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
    const sortedPlayers = players
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

      return prevPlayer.score === player.score
          ? adjust(index, assoc("place", prevPlayer.place), allPlayers)
          : adjust(index, assoc("place", index + 1), allPlayers);
    }, sortedPlayers);
  }, [playerScoreMap, players]);

  const position = useMemo(
    () =>
      playersWithScore.findIndex((player: any) => player.userId === currentUserId),
    [currentUserId, playersWithScore]
  );

  return {
    playersWithScore,
    position,
  };
};
