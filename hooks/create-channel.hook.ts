import { useCallback } from "react";
import { supabase } from "../client/supabase-client";
import { useGameState } from "../context";

export const useCreateChannel = () => {
  const [gameState] = useGameState();

  const { roomCode } = gameState;

  const createPresenceChannel = useCallback(
    (key: string, presenceKey?: string) =>
      supabase.channel(`${roomCode}#${key}`, {
        config: {
          presence: { key: presenceKey || key },
        },
      }),
    [roomCode]
  );

  const createBroadcastChannel = useCallback(
    (key: string) => supabase.channel(`${roomCode}#${key}`),
    [roomCode]
  );

  return {
    createBroadcastChannel,
    createPresenceChannel,
  };
};
