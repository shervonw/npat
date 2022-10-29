import { RealtimeChannel } from "@supabase/supabase-js";
import { useEffect, useState } from "react";
import { useUnmount } from "react-use";
import { supabase } from "../client/supabase-client";
import { useReducerContext } from "../context/game.context";

export const useSubscribeToRoom = () => {
  const [state, dispatch] = useReducerContext();
  const [presenceChannel, setPresenceChannel] = useState<RealtimeChannel>();

  useEffect(() => {
    const { roomCode, user } = state;

    if (roomCode && user && !presenceChannel) {
      const channel = supabase.channel(roomCode, {
        config: {
          presence: { key: user.user_id },
        },
      });

      setPresenceChannel(channel);

      channel
        .on("presence", { event: "sync" }, () => {
          const presenceState = channel.presenceState();
          console.log({ presenceState });
          dispatch({
            type: "SET_USER_KEYS",
            value: Object.keys(presenceState),
          })
        })
        .subscribe();
    }
  }, [dispatch, presenceChannel, state]);

  useEffect(() => {
    if (presenceChannel) {
      presenceChannel.track(state);
    }
  }, [presenceChannel, state]);

  useUnmount(() => {
    if (presenceChannel) {
      presenceChannel.untrack();
      presenceChannel.unsubscribe();
    }
  });
};
