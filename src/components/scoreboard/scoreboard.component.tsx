import React, { useCallback, useMemo } from "react";
import { useGameState, useUserState } from "../../context";
import { calculateTotalScore, sortByScore } from "../../utils";
import { UserList } from "../user-list";
import styles from "./scoreboard.module.css";

export const Scoreboard: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [gameState, setGameState] = useGameState();
  const [userState, setUserState] = useUserState();

  const { user, users } = userState;

  const usersWithScore = useMemo(
    () =>
      sortByScore(
        users.map((user: any) => ({
          ...user,
          score: calculateTotalScore(user, gameState.allScores),
        }))
      ),
    [gameState.allScores, users]
  );

  const winner = useMemo(() => usersWithScore[0], [usersWithScore]);

  const resetGame = useCallback(() => {
    location.reload();
  }, []);

  return (
    <div className={styles.container}>
      <h2>Final Scores</h2>
      {user.id === winner?.id && (
        <h1>
          <span>⭐</span> Congratulations you are the winner <span>👑</span>
        </h1>
      )}
      <div className={styles.scoreTable}>
        {usersWithScore.map((user, index) => {
          return (
            <div key={user.id} className={styles.scoreboardItem}>
              <div className={styles.position}>{index + 1}.</div>
              <div className={styles.name}>{user.name} </div>
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
