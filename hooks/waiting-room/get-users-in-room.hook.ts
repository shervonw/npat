import { useCallback, useEffect, useState } from "react";
import { RealtimeChannel, RealtimePresenceState } from "@supabase/supabase-js";
import { supabase } from "../../client/supabase-client";

export const useGetUsersInRoom = ({
  roomCode,
  user,
}: {
  roomCode: string;
  user: Record<string, string>;
}) => {
  const [users, setUsers] = useState<Array<{ name: string }>>([]);

  const [channel, setChannel] = useState<RealtimeChannel>();

  const onPresenceStateChanged = useCallback((presenceState: RealtimePresenceState) => {
    console.log(presenceState)
    setUsers(Object.values(presenceState).map((data: any) => data[0]));
  }, []);

  useEffect(() => {
    let presenceChannel: RealtimeChannel;

    if (roomCode && user) {
      const presenceChannel = supabase.channel(roomCode, {
        config: {
          presence: { key: user.user_id },
        },
      });

      setChannel(presenceChannel);

      presenceChannel
        .on("presence", { event: "sync" }, () => {
          onPresenceStateChanged(presenceChannel.presenceState());
        })
        .subscribe()
        .track({ name: user.name });
    }

    return () => {
      presenceChannel?.untrack?.();
      presenceChannel?.unsubscribe?.();
    };
  }, [onPresenceStateChanged, roomCode, user]);

  const setPresenceState = useCallback((data: any) => {
   if (user?.name) {
    channel?.track({
      name: user.name,
      ...data,
    });
   }
  }, [channel, user?.name])

  return { setPresenceState, users };
};
