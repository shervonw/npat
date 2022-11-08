import React, { useCallback } from "react";
import { useForm } from "react-hook-form";
import { v4 as uuidv4 } from "uuid";
import { useUserState } from "../../context";
import { useGameState } from "../../context/game.context";
import { StateContext } from "../../state-machine";
import { getEmoji } from "../../utils";
import styles from "./join-game.module.css";

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
    mode: "onSubmit",
    defaultValues: {
      roomCode: props.context.roomCode,
      user: "",
    },
  });

  const onSubmitHanlder = useCallback(
    async (formData: FormData) => {
      const newUser = {
        id: uuidv4(),
        name: formData.user,
        leader: false,
        emoji: getEmoji(),
      };

      setGameState({ type: "ROOM_CODE", value: formData.roomCode });

      setUserState({ type: "CURRENT_USER", value: newUser });

      props.send("READY");
    },
    [props, setGameState, setUserState]
  );

  return (
    <form onSubmit={handleSubmit(onSubmitHanlder)}>
      <div className={styles.inputContainer}>
        <label>Your Name:</label>
        <input {...register("user", { required: true, maxLength: 20 })} type="text" />
      </div>

      <div className={styles.inputContainer}>
        <label>Room Code:</label>
        <input {...register("roomCode", { required: true })} type="text" />
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit">Join Game</button>
        <button onClick={() => props.send("BACK")}>Cancel</button>
      </div>
    </form>
  );
};
