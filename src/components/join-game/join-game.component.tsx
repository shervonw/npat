import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { StateComponentType } from "../../app.types";
import styles from "./join-game.module.css";

type FormData = {
  roomCode: string;
  user: string;
};

export const JoinGame: StateComponentType = ({ context, send }) => {
  const { handleSubmit, register } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {
      roomCode: context.roomCode,
      user: "",
    },
  });

  const onSubmitHanlder = useCallback(
    async (formData: FormData) => {
      send({ type: "updateRoomCode", value: formData.roomCode });
      send({ type: "createPlayer", value: formData.user });
      send({ type: "ready" });
    },
    [send]
  );

  return (
    <form onSubmit={handleSubmit(onSubmitHanlder)}>
      <div className={styles.inputContainer}>
        <label>Your Name:</label>
        <input
          {...register("user", { required: true })}
          maxLength={30}
          type="text"
        />
      </div>

      <div className={styles.inputContainer}>
        <label>Room Code:</label>
        <input {...register("roomCode", { required: true })} type="text" />
      </div>

      <div className={styles.buttonWrapper}>
        <button type="submit">Join Game</button>
        <button onClick={() => send({ type: "back" })}>Cancel</button>
      </div>
    </form>
  );
};
