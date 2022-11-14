import { RealtimeChannel } from "@supabase/supabase-js";
import { isEmpty } from "ramda";
import { useEffect, useState } from "react";
import { StateComponentProps, SubscribeStatus } from "./app.types";
import { useChannel } from "./hooks/channel.hook";

export const useUsersChannel = ({ context, send }: StateComponentProps) => {
  const getChannel = useChannel();
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>();
  const [usersChannel, setUsersChannel] = useState<RealtimeChannel>();

  useEffect(() => {
    let channel: RealtimeChannel;

    if (context.roomCode) {
      channel = getChannel(context.roomCode, "users");

      setUsersChannel(channel);

      channel.on("presence", { event: "join" }, (presence) => {
        send({
          type: "updatePlayers",
          value: [...presence.currentPresences, ...presence.newPresences],
        });
      });

      channel.on("presence", { event: "leave" }, (presence) => {
        const exitedUser = presence.leftPresences[0];

        if (exitedUser.leader) {
          const newLeader = presence.currentPresences[0];

          if (newLeader?.id === context.userId) {
            send({ type: "assignPlayerAsLeader" });
          }

          send({
            type: "updatePlayers",
            value: presence.currentPresences,
          });
        }
      });

      channel.on("broadcast", { event: "ready" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          send({ type: "ready" });
        }
      });

      channel.subscribe(setSubscribeStatus);

      channel.track({
        id: context.userId,
        leader: context.leader,
        name: context.name,
        emoji: context.emoji,
      });
    }

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.roomCode]);

  return { subscribeStatus, usersChannel };
};
