import { RealtimeChannel } from "@supabase/supabase-js";
import { equals, pluck, pipe, prop, sortBy } from "ramda";
import React, { useCallback, useMemo, useState } from "react";
import { useEffectOnce } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { useGetLetter } from "../../hooks/get-letter.hook";
import { calculateTotalScore, getUserIds } from "../../utils";

export const ScoreReview: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [usersInWaitingRoom, setUsersInWaitingRoom] = useState<any[]>([]);
  const { createPresenceChannel } = useCreateChannel();
  const delay = useDelay();
  const getLetter = useGetLetter();
  const [gameState] = useGameState();
  const [userState] = useUserState();

  const { user, users } = userState;

  const usersWithScore = useMemo(
    () =>
      usersInWaitingRoom.map((user) => ({
        ...user,
        score: calculateTotalScore(user, gameState.allScores),
      })),
    [gameState.allScores, usersInWaitingRoom]
  );

  const canStartGame = useMemo(() => {
    const userIdsInWaitingRoom = getUserIds(usersInWaitingRoom);
    const userIdsInGame = getUserIds(users);

    return equals(userIdsInWaitingRoom, userIdsInGame);
  }, [users, usersInWaitingRoom]);

  useEffectOnce(() => {
    const newChannel = createPresenceChannel("waiting");

    setChannel(newChannel);

    newChannel.on("presence", { event: "join" }, (presence) => {
      setUsersInWaitingRoom([
        ...presence.currentPresences,
        ...presence.newPresences,
      ]);
    });

    newChannel.on("presence", { event: "leave" }, (presence) => {
      setUsersInWaitingRoom(presence.currentPresences);
    });

    newChannel.on("broadcast", { event: "start" }, () => {
      props.send("NEXT");
    });

    newChannel.subscribe().track(user);

    return () => {
      newChannel.untrack();
      newChannel.unsubscribe();
    };
  });

  const startGame = useCallback(async () => {
    getLetter();

    await delay();

    props.send("NEXT");
    channel?.send({
      type: "broadcast",
      event: "start",
      payload: true,
    });
  }, [channel, delay, getLetter, props]);

  return (
    <div>
      Waiting For Players
      {usersWithScore.map(
        (user: { name: string; score: number }, index: number) => (
          <div key={index}>
            <h4>
              {user.name} - {user.score}
            </h4>
          </div>
        )
      )}
      {canStartGame && user?.leader && (
        <button onClick={startGame}>Ready</button>
      )}
    </div>
  );
};
