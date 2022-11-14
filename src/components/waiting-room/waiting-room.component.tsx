import { useCallback, useState } from "react";
import { useTimeoutFn } from "react-use";
import { ChannelSubscribeStatus, StateComponentType } from "../../app.types";
import { useDelay } from "../../hooks/delay.hook";
import { useUsersChannel } from "../../users-channel.hook";
import { UserList } from "../user-list";
import styles from "./waiting-room.module.css";

export const WaitingRoom: StateComponentType = ({ context, send }) => {
  const [copyTimeout, setCopyTimeout] = useState<number>(0);

  useTimeoutFn(() => {
    setCopyTimeout(0);
  }, copyTimeout);

  const { subscribeStatus, usersChannel } = useUsersChannel({ context, send });

  console.log({ subscribeStatus });

  const copyRoomCodeToClipboard = useCallback(() => {
    const roomLink = `${window.location.origin}?code=${context.roomCode}`;
    navigator.clipboard.writeText(roomLink);

    setCopyTimeout(4000);
  }, [context.roomCode]);

  const startGame = useCallback(async () => {
    if (
      subscribeStatus === ChannelSubscribeStatus.SUBSCRIBED &&
      usersChannel &&
      context.userId
    ) {
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
        <UserList users={context?.players ?? []} />
      </div>

      <div className={styles.buttonWrapper}>
        {context.leader ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <p>Waiting for the leader to begin the game...</p>
        )}
      </div>
    </div>
  );
};
