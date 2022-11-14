import { useCallback } from "react";
import { supabase } from "../client/supabase-client";

export const useChannel = () => {
  return useCallback((roomCode: string, presenceKey?: string) => {
    return supabase.channel(roomCode, {
      config: {
        broadcast: { ack: true },
        presence: { key: presenceKey || "game" },
      },
    });
  }, [])
};
