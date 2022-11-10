import React, { useCallback, useMemo } from "react";
import { useGameState, useUserState } from "../../context";
import { calculateTotalScore, sortByScore } from "../../utils";
import styles from "./scoreboard.module.css";

export const Scoreboard: React.FC = () => {
  const [gameState] = useGameState();
  const [userState] = useUserState();

  const { user: currentUser, users } = userState;

  const usersWithScore = useMemo(
    () =>
      sortByScore(
        users.slice().map((user: any) => ({
          ...user,
          score: calculateTotalScore(user, gameState.allScores),
        }))
      ),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const position = useMemo(
    () => usersWithScore.findIndex((user) => user.id === currentUser.id),
    [currentUser.id, usersWithScore]
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
            Congratulations, <br /> you won!
          </span>
          <span>👑</span>
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
          <div className={styles.finalScore}>Final Score</div>
        </div>
        {usersWithScore.map((user, index) => {
          const scoreboardItemStyles =
            position === index
              ? styles.scoreboardItemHighlight
              : styles.scoreboardItem;

          return (
            <div key={user.id} className={scoreboardItemStyles}>
              <div className={styles.position}>{index + 1}.</div>
              <div className={styles.name}>{user.name}</div>
              <div className={styles.finalScore}>{user.score}</div>
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
