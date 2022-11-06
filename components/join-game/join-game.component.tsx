import React, { useCallback } from "react";
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from "uuid";
import { useUserState } from "../../context";
import { useGameState } from "../../context/game.context";
import { StateContext } from "../../pages/state-machine";

type FormData = {
  roomCode: string;
  user: string;
};

export const JoinGame: React.FC<{
  context: StateContext;
  send: (event: any) => void;
}> = (props) => {
  const [, setGameState] = useGameState();
  const [, setUserState] = useUserState();

  const { handleSubmit, register } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      roomCode: props.context.roomCode,
      user: '',
    }
  });

  const onSubmitHanlder = useCallback(async (formData: FormData) => {
    setGameState({ type: "ROOM_CODE", value: formData.roomCode })
    const newUser = { id: uuidv4(), name: formData.user, leader: false }
    setUserState({ type: "CURRENT_USER", value: newUser })
    props.send("READY")
  }, [props, setGameState, setUserState])

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