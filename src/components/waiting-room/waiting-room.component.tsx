import { useCallback, useState } from "react";
import { useTimeoutFn } from "react-use";
import { useAppContext } from "../../app.context";
import { StateComponentType } from "../../app.types";
import { UserList } from "../user-list";
import styles from "./waiting-room.module.css";

export const WaitingRoom: StateComponentType = ({
  context,
  send,
  players,
}) => {
  const [copyTimeout, setCopyTimeout] = useState<number>(0);
  const [appContext] = useAppContext();

  const { player } = appContext;

  useTimeoutFn(() => {
    setCopyTimeout(0);
  }, copyTimeout);

  const copyRoomCodeToClipboard = useCallback(() => {
    const roomLink = `${window.location.origin}?code=${context.roomCode}`;
    navigator.clipboard.writeText(roomLink);

    setCopyTimeout(4000);
  }, [context.roomCode]);

  const startGame = useCallback(() => {
    send({ type: "start" });
  }, [send]);

  return (
    <div>
      <h1 className={styles.heading}>Welcome to the Lobby</h1>
      <div className={styles.roomCodeContainer}>
        <p>Your room code is:</p>

        <div className={styles.roomCodeContent}>
          <p className={styles.roomCode}>{context.roomCode}</p>
          <button
            onClick={copyRoomCodeToClipboard}
            disabled={copyTimeout !== 0}
          >
            {copyTimeout !== 0 ? "Copied" : "Copy Link"}
          </button>
        </div>

        <p>Click &quot;Copy Link&quot; button to copy room link to share!</p>
      </div>

      <div className={styles.userListContainer}>
        <h2>Players in the room</h2>
        <UserList players={players} />
      </div>

      <div className={styles.buttonWrapper}>
        {player?.leader ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <p>Waiting for the leader to begin the game...</p>
        )}
      </div>
    </div>
  );
};
