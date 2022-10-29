import React, { useCallback } from "react";
import { useForm } from 'react-hook-form';
import { supabase } from "../../client/supabase-client";
import { useCreateUser } from "../../hooks/create-game/create-user.hook";
import { StateContext } from "../../pages/state-machine";
import { useReducerContext } from "../../context/game.context";

type FormData = {
  roomCode: string;
  user: string;
};

export const JoinGame: React.FC<{
  context: StateContext;
  send: (event: any) => void;
}> = (props) => {
  const [, dispatch] = useReducerContext();

  const { formState: { errors }, handleSubmit, register } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      roomCode: props.context.roomCode,
      user: '',
    }
  });

  const createUser = useCreateUser();

  const onSubmitHanlder = useCallback(async (formData: FormData) => {
    dispatch({ type: "SET_ROOM_CODE", value: formData.roomCode })

    try {
      const newUser = await createUser(formData.user, formData.roomCode)
      const room = await supabase
        .from("npat_rooms")
        .select()
        .eq("room_code", formData.roomCode)
        .limit(1)
        .single()

      console.log(room.data)

      dispatch({ type: "SET_CATEGORIES", value: room.data.categories });
      dispatch({ type: "CURRENT_USER", value: newUser })
      props.send("READY")
    } catch (error) {

    }
  }, [createUser, dispatch, props])

  return (
    <div>
      Join

      <form onSubmit={handleSubmit(onSubmitHanlder)}>
        <input {...register("user", { required: true, maxLength: 20 })} />
        <input {...register("roomCode", { required: true })} />

        <div>
          <button onClick={() => props.send("BACK")}>
            Back
          </button>
          <button type="submit">
            Ready
          </button>
        </div>
      </form >
    </div>
  );
}