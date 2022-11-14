import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { StateComponentProps, SubscribeStatus } from "./app.types";
import { useChannel } from "./hooks/channel.hook";

interface UseChannelProps extends StateComponentProps {
  onPresenceStateSynced?: (presenceState: RealtimePresenceState) => void;
}

export const useUserChannel = ({
  context,
  onPresenceStateSynced,
  send,
}: UseChannelProps) => {
  const getChannel = useChannel();
  const [subscribeStatus, setSubscribeStatus] = useState<SubscribeStatus>();
  const [userChannel, setUserChannel] = useState<RealtimeChannel>();

  useEffect(() => {
    let channel: RealtimeChannel;

    if (context.roomCode) {
      channel = getChannel(context.roomCode, context.userId);

      setUserChannel(channel);

      channel.on("presence", { event: "sync" }, () => {
        onPresenceStateSynced && onPresenceStateSynced(channel.presenceState());
      });

      channel.on("broadcast", { event: "start" }, ({ payload }) => {
        if (payload.userId !== context.userId) {
          send({ type: "ready" });
        }
      });

      channel.subscribe(setSubscribeStatus);
    }

    return () => {
      channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [context.roomCode]);

  return { subscribeStatus, userChannel };
};
