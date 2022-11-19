import React, { useCallback, useMemo } from "react";
import { StateComponentType } from "../../app.types";
import { sortByScore } from "../score-table/score-table.utils";
import styles from "./scoreboard.module.css";

export const Scoreboard: StateComponentType = ({ context, players, send }) => {
  const { userId = "" } = context;

  const sortedPlayers = useMemo(
    () => sortByScore(players),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const position = useMemo(
    () => sortedPlayers.findIndex((player) => player.userId === userId),
    [sortedPlayers, userId]
  );

  const resetGame = useCallback(() => {
    location.reload();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Final Scores</h1>
      {position === 0 ? (
        <h2>
          <span>⭐</span>
          <span>
            Congratulations,
            <br />
            you won!
          </span>
          <span>🏆</span>
        </h2>
      ) : (
        <h2>
          <span></span>
          <span>You placed #{position + 1}</span>
          <span></span>
        </h2>
      )}
      <div className={styles.scoreTable}>
        <div key="header" className={styles.scoreboardItem}>
          <div className={styles.position} />
          <div className={styles.name}>Name</div>
          <div className={styles.finalScore}>Score</div>
        </div>
        {sortedPlayers.map((player, index) => {
          const scoreboardItemStyles =
            position === index
              ? styles.scoreboardItemHighlight
              : styles.scoreboardItem;

          return (
            <div key={player.id} className={scoreboardItemStyles}>
              <div className={styles.position}>{index + 1}.</div>
              <div className={styles.name}>{player.name}</div>
              <div className={styles.finalScore}>{player.totalScore}</div>
            </div>
          );
        })}
      </div>

      <div className={styles.buttonWrapper}>
        <button onClick={resetGame}>New Game</button>
      </div>
    </div>
  );
};
