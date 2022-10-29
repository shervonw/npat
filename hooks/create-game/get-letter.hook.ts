import { useCallback } from "react";
import { supabase } from "../../client/supabase-client";
import { useReducerContext } from "../../context";

function getRandomInt(max: number) {
  return Math.floor(Math.random() * max);
}

export const useGetLetter = () => {
  const [, dispatch] = useReducerContext();

  return useCallback(async (roomCode: string) => {
    const npatRooms = await supabase.from("npat_rooms");
    const response = await npatRooms
      .select("possible_alphabets")
      .eq("room_code", roomCode)
      .limit(1)
      .single();

    console.log(response.data);

    const { possible_alphabets: alphabets = [] } = response.data || {};

    const randomIndex = getRandomInt(alphabets.length - 1);

    const letter = alphabets[randomIndex];

    console.log({ letter });

    alphabets.splice(randomIndex, 1);

    await npatRooms
      .update({
        possible_alphabets: alphabets,
      })
      .eq("room_code", roomCode);

    dispatch({ type: "CURRENT_LETTER", value: letter })
  }, [dispatch]);
};
