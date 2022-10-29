import { useCallback } from "react";
import { supabase } from "../../client/supabase-client";

export const useCreateGame = () => {
  return useCallback(
    async (code: string, categories: Array<string>, name: string) => {
      const response = await supabase.rpc("create_game", {
        game_categories: categories,
        new_room_code: code,
        name,
      });

      if (response.error) {
        throw response.error
      }

      return response.data[0]
    },
    []
  );
};
