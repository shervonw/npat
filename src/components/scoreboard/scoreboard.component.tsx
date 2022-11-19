import { all, equals, pipe, pluck } from "ramda";
import React, { useCallback, useMemo } from "react";
import { StateComponentType } from "../../app.types";
import { ScoreTable, usePlayersWithScore } from "../score-table";
import { sortByScore } from "../score-table/score-table.utils";
import styles from "./scoreboard.module.css";

export const Scoreboard: StateComponentType = ({ context, players }) => {
  const { userId = "" } = context;

  const { playersWithScore, position } = usePlayersWithScore(userId, players);

  // eslint-disable-next-line react-hooks/exhaustive-deps
  const staticPlayers = useMemo(() => playersWithScore, []);

  // TODO: Fix when score are tied. Ensure they have correct positioning
  const winner = useMemo(() => {
    const allEqual = pipe(
      pluck("score"),
      all(equals(staticPlayers[0].score))
    )(staticPlayers);

    if (!allEqual) {
      return staticPlayers[0].userId;
    }
  }, [staticPlayers]);

  const resetGame = useCallback(() => {
    location.reload();
  }, []);

  return (
    <div className={styles.container}>
      <h1>Final Scores</h1>
      <h2>
        {winner === userId ? (
          <>
            <span>⭐</span>
            <span>
              Congratulations,
              <br />
              you won!
            </span>
            <span>🏆</span>
          </>
        ) : winner === undefined ? (
          <>
            <span></span>
            <span>It&apos;s a tie 👔</span>
            <span></span>
          </>
        ) : (
          <>
            <span></span>
            <span>You placed #{position + 1}</span>
            <span></span>
          </>
        )}
      </h2>

      <ScoreTable
        players={staticPlayers}
        position={position}
        showPosition={Boolean(winner)}
      />

      <div className={styles.buttonWrapper}>
        <button onClick={resetGame}>New Game</button>
      </div>
    </div>
  );
};
