import { useMemo } from "react";
import { useAppContext } from "../../app.context";
import { StateContext } from "../../app.types";
import styles from "./score-table.module.css";
import { sortByScore } from "./score-table.utils";

interface ScoreTableProps {
  currentUserId: string;
  players: StateContext[];
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  currentUserId,
  players,
}) => {
  const [appContext] = useAppContext();

  const position = useMemo(
    () => players.findIndex((player) => player.userId === currentUserId),
    [currentUserId, players]
  );

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

  return (
    <div className={styles.scoreTable}>
      <div key="header" className={styles.scoreboardItem}>
        <div className={styles.position} />
        <div className={styles.name}>Name</div>
        <div className={styles.finalScore}>Score</div>
      </div>
      {playersWithScore.map((player: any, index: number) => {
        const scoreboardItemStyles =
          position === index
            ? styles.scoreboardItemHighlight
            : styles.scoreboardItem;

        return (
          <div key={index} className={scoreboardItemStyles}>
            <div className={styles.position}>{index + 1}.</div>
            <div className={styles.name}>{player.name}</div>
            <div className={styles.finalScore}>{player.score}</div>
          </div>
        );
      })}
    </div>
  );
};
