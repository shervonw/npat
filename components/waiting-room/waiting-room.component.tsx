import React, { useCallback, useState } from "react";
import { useAsync, useMount } from "react-use";
import { RealtimeChannel } from "@supabase/supabase-js";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useGetLetter } from "../../hooks/get-letter.hook";
import { useDelay } from "../../hooks/delay.hook";

export const WaitingRoom: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const { createPresenceChannel } = useCreateChannel()
  const [gameState, setGameState] = useGameState();
  const [userState] = useUserState();
  const getLetter = useGetLetter()
  const delay = useDelay()

  const { user, users } = userState;
  const { roomCode } = gameState;

  useMount(() => {
    const newChannel = createPresenceChannel("startGame")

    setChannel(newChannel)

    newChannel.on("presence", { event: "sync" }, () => {
      const presenceState = newChannel.presenceState();

      if (presenceState?.startGame?.[0]) {
        const presenceGameState = presenceState.startGame[0];

        props.send({ type: "UPDATE_MAX_ROUNDS", value: parseInt(presenceGameState.rounds) })
      }
    })

    newChannel.on("broadcast", { event: "start", }, () => {
      props.send("READY")
    })

    newChannel.subscribe()
  })

  const startGame = useCallback(async () => {
    getLetter()

    await delay()

    channel?.send({
      type: "broadcast",
      event: "start",
      payload: true,
    })

    props.send("READY")
  }, [channel, delay, getLetter, props])

  return (
    <div>
      <p>Waiting For Players</p>

      <div>
        <p>Copy room code: {roomCode}</p>
      </div>

      {users && users.map((user: { name: string }, index: number) => (
        <div key={index}>
          <h4>{(user.name)}</h4>
        </div>
      ))}

      {user?.leader && (
        <button onClick={startGame}>
          Ready
        </button>
      )}
    </div>
  );
}