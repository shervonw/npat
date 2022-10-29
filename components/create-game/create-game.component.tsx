import React, { useCallback } from "react";
import { useForm } from 'react-hook-form';
import { CATEGORIES, DEFAULT_CATEGORIES, DEFAULT_MAX_ROUNDS, ROUND_SELECTIONS } from "../../constants";
import { useCreateGame } from "../../hooks/create-game/create-game.hook";
import { useReducerContext } from "../../context/game.context";
import { generateRoomName } from "./create-game.utils";

type FormData = {
  categories: Array<string>;
  rounds: string;
  user: string;
};

export const CreateGame: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [, dispatch] = useReducerContext();

  const { handleSubmit, register } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      categories: DEFAULT_CATEGORIES,
      rounds: DEFAULT_MAX_ROUNDS.toString(),
    }
  });

  const createGame = useCreateGame()

  const onSubmitHanlder = useCallback(async (formData: FormData) => {
    try {
      const { categories, rounds, user } = formData
      const roomCode = generateRoomName()

      const newUser = await createGame(roomCode, categories, user)

      dispatch({ type: "CURRENT_USER", value: newUser })
      dispatch({ type: "SET_CATEGORIES", value: categories });
      dispatch({ type: "SET_ROOM_CODE", value: roomCode });

      props.send({ type: "UPDATE_MAX_ROUNDS", value: parseInt(rounds) })
      props.send("READY")
    } catch (error) {
      console.log({ error })
    }
  }, [createGame, dispatch, props]);

  return (
    <div>
      Create Game

      <form onSubmit={handleSubmit(onSubmitHanlder)}>
        <input {...register("user", { required: true, maxLength: 20 })} />

        <div>
          {ROUND_SELECTIONS.map((round, index) => (
            <div key={index}>
              <input type="radio" id={round.toString()} value={round} {...register("rounds")} />
              <label htmlFor={round.toString()}>{round.toString()}</label>
            </div>
          ))}
        </div>

        <div>
          {CATEGORIES.map((category, index) => (
            <div key={index}>
              <input type="checkbox" id={category.id} value={category.value} {...register("categories")} />
              <label htmlFor={category.id}>{category.value}</label>
            </div>
          ))}
        </div>

        <div>
          <button onClick={() => props.send("BACK")}>
            Back
          </button>
          <button type="submit">
            Ready
          </button>
        </div>
      </form>
    </div>
  );
}