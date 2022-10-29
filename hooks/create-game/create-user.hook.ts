import { useCallback } from "react";
import { supabase } from "../../client/supabase-client";

export const useCreateUser = () => {
  return useCallback(
    async (name: string, roomCode: string) => {
      const newUser = await supabase
        .from("npat_users")
        .insert({
          name,
          room_code: roomCode,
        })
        .select()
        .limit(1)
        .single()

      if (newUser.error) {
        throw newUser.error;
      }

      return newUser?.data;
    },
    []
  );
};
