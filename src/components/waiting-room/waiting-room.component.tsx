import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useCallback, useState } from "react";
import { useMount } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { useGetLetter } from "../../hooks/get-letter.hook";
import { UserList } from "../user-list";
import styles from "./waiting-room.module.css";

export const WaitingRoom: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const { createPresenceChannel } = useCreateChannel();
  const [gameState] = useGameState();
  const [userState] = useUserState();
  const getLetter = useGetLetter();
  const delay = useDelay();

  const { user, users } = userState;
  const { roomCode } = gameState;

  useMount(() => {
    const newChannel = createPresenceChannel("startGame");

    setChannel(newChannel);

    newChannel.on("presence", { event: "sync" }, () => {
      const presenceState = newChannel.presenceState();

      if (presenceState?.startGame?.[0]) {
        const presenceGameState = presenceState.startGame[0];

        props.send({
          type: "UPDATE_MAX_ROUNDS",
          value: parseInt(presenceGameState.rounds),
        });
      }
    });

    newChannel.on("broadcast", { event: "start" }, () => {
      props.send("READY");
    });

    newChannel.subscribe();
  });

  const startGame = useCallback(async () => {
    getLetter();

    await delay();

    channel?.send({
      type: "broadcast",
      event: "start",
      payload: true,
    });

    props.send("READY");
  }, [channel, delay, getLetter, props]);

  const copyRoomCodeToClipboard = useCallback(() => {
    const roomLink = `${window.location.origin}?code=${roomCode}`;
    navigator.clipboard.writeText(roomLink);
  }, [roomCode]);

  return (
    <div>
      <h2 className={styles.heading}>Welcome to the Lobby</h2>

      <div className={styles.roomCodeContainer}>
        <p>Your room code is:</p>

        <div className={styles.roomCodeContent}>
          <p className={styles.roomCode}>{roomCode}</p>
          <button onClick={copyRoomCodeToClipboard}>Copy Link</button>
        </div>

        <p>Click &quot;Copy Link&quot; button to copy room link to share!</p>
      </div>

      <div className={styles.userListContainer}>
        <h3>Players in room</h3>
        <UserList users={users} />
      </div>

      <div className={styles.buttonWrapper}>
        {user?.leader ? (
          <button onClick={startGame}>Start Game</button>
        ) : (
          <p>Waiting for the leader to begin the game...</p>
        )}
      </div>
    </div>
  );
};
