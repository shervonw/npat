import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StateComponentProps, SubscribeStatus } from "./app.types";
import { useChannel } from "./hooks/channel.hook";

export const useGameChannel = ({ context, send }: StateComponentProps) => {
  const [gameChannel, setGameChannel] = useState<RealtimeChannel>();
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>();
  const getChannel = useChannel();

  useEffect(() => {
    let channel: RealtimeChannel;

    if (context.roomCode) {
      channel = getChannel(context.roomCode, "gameState");

      setGameChannel(channel);

      channel.on("broadcast", { event: "submit" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          send({ type: "submitResponses", value: payload.values });
        }
      });

      channel.on("broadcast", { event: "start-game" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          send({ type: "updateGameState", value: payload.gameState });
          send({ type: "play" });
        }
      });

      channel.on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState().gameState?.[0];
  
        console.log(channel.presenceState());

        if (presenceState && !context.leader) {
          send({ type: "updateGameState", value: presenceState });
        }
      });

      channel.subscribe(setSubscribeStatus);
    }

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.roomCode]);

  return { gameChannel, subscribeStatus };
};
