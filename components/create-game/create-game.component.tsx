import React, { useCallback } from "react";
import { useForm } from 'react-hook-form';
import { v4 as uuidv4 } from "uuid";
import { CATEGORIES, DEFAULT_CATEGORIES, DEFAULT_MAX_ROUNDS, ROUND_SELECTIONS } from "../../constants";
import { useUserState } from "../../context";
import { useGameState } from "../../context/game.context";
import { generateRoomName } from "./create-game.utils";

const alphabet = ['A', 'B', 'C', 'D', 'E', 'F', 'G', 'H', 'I', 'J', 'K', 'L', 'M', 'N', 'O', 'P', 'Q', 'R', 'S', 'T', 'U', 'V', 'W', 'Y', 'Z']

type FormData = {
  categories: Array<string>;
  rounds: string;
  user: string;
};

export const CreateGame: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [, setGameState] = useGameState();
  const [, setUserState] = useUserState();

  const { handleSubmit, register } = useForm<FormData>({
    mode: 'onSubmit',
    defaultValues: {
      categories: DEFAULT_CATEGORIES,
      rounds: DEFAULT_MAX_ROUNDS.toString(),
    }
  });

  const onSubmitHanlder = useCallback(async (formData: FormData) => {
    try {
      const { categories, rounds, user } = formData
      const newUser = { id: uuidv4(), name: user, leader: true }

      setUserState({ type: "CURRENT_USER", value: newUser })

      setGameState({ type: "CATEGORIES", value: categories });
      setGameState({ type: "POSSIBLE_ALPHABET", value: alphabet })
      setGameState({ type: "ROOM_CODE", value: generateRoomName() });
      setGameState({ type: "ROUNDS", value: parseInt(rounds) });

      props.send({ type: "UPDATE_MAX_ROUNDS", value: parseInt(rounds) })
      props.send("READY")
    } catch (error) {
      console.log({ error })
    }
  }, [setGameState, props, setUserState]);

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