import { useMemo } from "react";
import { useAppContext } from "../../app.context";
import { StateContext } from "../../app.types";
import { sortByScore } from "./score-table.utils";

export const usePlayersWithScore = (currentUserId: string, players: StateContext[]) => {
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
    return sortByScore(
      players.map((player) => ({
        ...player,
        score: playerScoreMap[player.userId ?? ""] ?? 0,
      }))
    );
  }, [playerScoreMap, players]);

  const position = useMemo(
    () => playersWithScore.findIndex((player) => player.userId === currentUserId),
    [currentUserId, playersWithScore]
  );

  return {
    playersWithScore,
    position,
  }
}