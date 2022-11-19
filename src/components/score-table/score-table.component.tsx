import { useMemo } from "react";
import { StateContext } from "../../app.types";
import { usePlayersWithScore } from "./players-with-scores.hook";
import styles from "./score-table.module.css";
import { sortByScore } from "./score-table.utils";

interface ScoreTableProps {
  players: StateContext[];
  position: number;
  showPosition?: boolean;
}

export const ScoreTable: React.FC<ScoreTableProps> = ({
  position,
  players,
  showPosition,
}) => {
  return (
    <div className={styles.scoreTable}>
      <div key="header" className={styles.scoreboardItem}>
        <div className={styles.position} />
        <div className={styles.name}>Name</div>
        <div className={styles.finalScore}>Score</div>
      </div>
      {players.map((player: any, index: number) => {
        const scoreboardItemStyles =
          position === index
            ? styles.scoreboardItemHighlight
            : styles.scoreboardItem;

        return (
          <div key={index} className={scoreboardItemStyles}>
            <div className={styles.position}>
              {showPosition ? `${index + 1}.` : "-"}
            </div>
            <div className={styles.name}>{player.name}</div>
            <div className={styles.finalScore}>{player.score}</div>
          </div>
        );
      })}
    </div>
  );
};
