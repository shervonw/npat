import { useCallback, useEffect, useMemo } from "react";
import { useAsync } from "react-use";
import { useAppContext } from "../../app.context";
import { StateComponentType } from "../../app.types";
import { useDelay } from "../../hooks/delay.hook";
import { ScoreTable, usePlayersWithScore } from "../score-table";
import styles from "./score-review.module.css";

export const ScoreReview: StateComponentType = ({
  channel,
  context,
  players,
  send,
}) => {
  const [appContext, setAppContext] = useAppContext();
  const delay = useDelay();

  const { player } = appContext;
  const { round } = context;

  const { loading } = useAsync(async () => {
    await delay(1000);
  }, []);

  useEffect(() => {
    if (!loading && channel) {
      const payload = {
        userId: player?.userId,
        round,
      };

      channel.send({
        type: "broadcast",
        event: "ready",
        payload,
      });

      setAppContext({
        type: "ready",
        value: payload,
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, loading]);

  const allReady = useMemo(() => {
    return players
      .map((player) => {
        const { userId = "" } = player;
        return appContext.ready?.[round]?.[userId] ?? false;
      })
      .every((flag) => flag === true);
  }, [appContext.ready, players, round]);

  const startGame = useCallback(async () => {
    if (channel) {
      await channel.send({
        type: "broadcast",
        event: "start",
      });
    }

    send({ type: "start" });
  }, [channel, send]);

  const { playersWithScore, position } = usePlayersWithScore(player?.userId ?? "", players);  

  if (loading) {
    return <div>Submitting scores...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Current Leaderboard</h1>

      <h3>
        {allReady && !player?.leader
          ? "Waiting for admin to start the next round..."
          : "Waiting for all players to finish scoring..."}
      </h3>

      <ScoreTable players={playersWithScore} position={position} />

      <div className={styles.buttonWrapper}>
        {player?.leader && allReady && (
          <button onClick={startGame}>Start Next Round</button>
        )}
      </div>
    </div>
  );
};
