import { useCallback, useMemo, useState } from "react";
import { useTimeoutFn } from "react-use";
import { StateComponentType } from "../../app.types";
import { useUsersChannel } from "../../users-channel.hook";
import { UserList } from "../user-list";
import styles from "./waiting-room.module.css";

export const WaitingRoom: StateComponentType = ({ context, send }) => {
  const [copyTimeout, setCopyTimeout] = useState<number>(0);
  const [clickedStartGame, setClickedStartGame] = useState<boolean>(false);

  useTimeoutFn(() => {
    setCopyTimeout(0);
  }, copyTimeout);

  const { subscribeStatus, usersChannel, users } = useUsersChannel({
    context,
    send,
  });

  const allReady = useMemo(() => {
    if (context.round === 0) {
      return true;
    } 

    return users
      .map((user) => user.ready?.[context.round] ?? false)
      .every((flag) => flag === true);
  }, [context.round, users]);

  const copyRoomCodeToClipboard = useCallback(() => {
    const roomLink = `${window.location.origin}?code=${context.roomCode}`;
    navigator.clipboard.writeText(roomLink);

    setCopyTimeout(4000);
  }, [context.roomCode]);

  const startGame = useCallback(async () => {
    if (subscribeStatus === "SUBSCRIBED" && usersChannel && context.userId) {
      setClickedStartGame(true);

      await usersChannel.send({
        type: "broadcast",
        event: "ready",
        payload: {
          userId: context.userId,
        },
      });

      send({ type: "ready" });
    }
  }, [context.userId, send, subscribeStatus, usersChannel]);

  return (
    <div>
      <h1 className={styles.heading}>Welcome to the Lobby</h1>

      {context.round === 0 && (
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
      )}

      <div className={styles.userListContainer}>
        <h2>Players in the room</h2>
        <UserList users={users} />
      </div>

      <div className={styles.buttonWrapper}>
        {context.leader && allReady ? (
          <button disabled={clickedStartGame} onClick={startGame}>
            Start Game
          </button>
        ) : (
          <p>Waiting for the leader to begin the game...</p>
        )}
      </div>
    </div>
  );
};
