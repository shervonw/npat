import { RealtimeChannel } from "@supabase/supabase-js";
import { omit } from "ramda";
import { useCallback, useEffect, useState } from "react";
import { useAppContext } from "./app.context";
import { StateComponentProps, SubscribeStatus } from "./app.types";
import { useChannel } from "./hooks/channel.hook";

interface UseChannelProps extends StateComponentProps {
  onSubmit?: (channel: RealtimeChannel) => void;
}

export const useUsersChannel = ({
  context,
  onSubmit,
  send,
}: UseChannelProps) => {
  const getChannel = useChannel();
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>();
  const [usersChannel, setUsersChannel] = useState<RealtimeChannel>();
  const [users, setUsers] = useState<any[]>([]);
  const [lastLeftPlayer, setLastLeftPlayer] = useState<any>(null);
  const [, setAppContext] = useAppContext();

  const updatePlayers = useCallback((newUsers: any[]) => {
    setUsers(newUsers);
  }, []);

  useEffect(() => {
    let channel: RealtimeChannel;

    if (context.roomCode) {
      channel = getChannel(context.roomCode, context.userId);

      setUsersChannel(channel);

      channel.on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const players = Object.values(presenceState).map((player) => player[0]);

        for (const player of players) {
          if (player.game) setAppContext(player.game);
        }

        updatePlayers(players);
      });

      channel.on("presence", { event: "leave" }, (presence) => {
        const exitedPlayer = presence.leftPresences[0];
        setLastLeftPlayer(exitedPlayer);
      });

      channel.on("broadcast", { event: "ready" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          send({ type: "ready" });
        }
      });

      channel.on("broadcast", { event: "submit" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          onSubmit && onSubmit(channel);
        }
      });

      channel.subscribe(setSubscribeStatus);
    }

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.roomCode]);

  useEffect(() => {
    if (subscribeStatus === "SUBSCRIBED" && usersChannel) {
      usersChannel.track(
        context.leader ? context : omit(["game", "roomCode", "round"], context)
      );
    }
  }, [context, subscribeStatus, usersChannel]);

  // useEffect(() => {
  //   if (lastLeftPlayer && lastLeftPlayer?.leader) {
  //     setLastLeftPlayer(null);

  //     const newLeader = users?.[0];

  //     if (newLeader?.userId === context.userId && usersChannel) {
  //       usersChannel.track({ ...context, leader: true });
  //       send({ type: "reAssignLeader" });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lastLeftPlayer]);

  return { subscribeStatus, users, usersChannel };
};
