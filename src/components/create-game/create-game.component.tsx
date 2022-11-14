import { useCallback } from "react";
import { useForm } from "react-hook-form";
import { StateComponentType } from "../../app.types";
import {
  CATEGORIES,
  DEFAULT_CATEGORIES,
  DEFAULT_MAX_ROUNDS,
  ROUND_SELECTIONS,
} from "../../constants";
import styles from "./create-game.module.css";

type FormValues = {
  categories: Array<string>;
  rounds: string;
  user: string;
};

export const CreateGame: StateComponentType = ({ context, send }) => {
  const { handleSubmit, register } = useForm<FormValues>({
    mode: "onSubmit",
    defaultValues: {
      categories: DEFAULT_CATEGORIES,
      rounds: DEFAULT_MAX_ROUNDS.toString(),
    },
  });

  const onSubmitHanlder = useCallback(
    async (formData: FormValues) => {
      const { categories, rounds, user } = formData;

      send({ type: "createPlayer", value: user });
      send({ type: "updateCategories", value: categories });
      send({ type: "updateMaxRounds", value: parseInt(rounds) });
      send({ type: "ready" });
    },
    [send]
  );

  return (
    <div className={styles.container}>
      <form onSubmit={handleSubmit(onSubmitHanlder)}>
        <div className={styles.inputContainer}>
          <label>Your Name:</label>
          <input
            {...register("user", { required: true })}
            maxLength={20}
            type="text"
          />
        </div>

        <div className={styles.optionsContainer}>
          <h2>Select number of rounds:</h2>
          <div className={styles.roundSelectionList}>
            {ROUND_SELECTIONS.map((round, index) => (
              <div key={index}>
                <input
                  type="radio"
                  id={round.toString()}
                  value={round}
                  {...register("rounds")}
                />
                <label htmlFor={round.toString()}>{round.toString()}</label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.optionsContainer}>
          <h2>Select categories:</h2>
          <div className={styles.categoriesList}>
            {CATEGORIES.map((category, index) => (
              <div key={index}>
                <input
                  type="checkbox"
                  id={category.id}
                  value={category.value}
                  {...register("categories")}
                />
                <label htmlFor={category.id}>{category.value}</label>
              </div>
            ))}
          </div>
        </div>

        <div className={styles.buttonWrapper}>
          <button type="submit">Create Game</button>
          <button onClick={() => send({ type: "back" })}>Cancel</button>
        </div>
      </form>
    </div>
  );
};
// import React, { useCallback } from "react";
// import { useForm } from "react-hook-form";
// import { v4 as uuidv4 } from "uuid";
// import {
//   CATEGORIES,
//   DEFAULT_CATEGORIES,
//   DEFAULT_MAX_ROUNDS,
//   ROUND_SELECTIONS,
// } from "../../constants";
// import { useUserState } from "../../context";
// import { useGameState } from "../../context/game.context";
// import { getEmoji } from "../../utils";
// import { ALPHABET } from "./create-game.constants";
// import styles from "./create-game.module.css";
// import { generateRoomName } from "./create-game.utils";

// type FormData = {
//   categories: Array<string>;
//   rounds: string;
//   user: string;
// };

// export const CreateGame: React.FC<{
//   context: any;
//   send: (event: any) => void;
// }> = (props) => {
//   const [, setGameState] = useGameState();
//   const [, setUserState] = useUserState();

//   const { handleSubmit, register } = useForm<FormData>({
//     mode: "onSubmit",
//     defaultValues: {
//       categories: DEFAULT_CATEGORIES,
//       rounds: DEFAULT_MAX_ROUNDS.toString(),
//     },
//   });

//   const onSubmitHanlder = useCallback(
//     async (formData: FormData) => {
//       const { categories, rounds, user } = formData;
//       const newUser = {
//         id: uuidv4(),
//         name: user,
//         leader: true,
//         emoji: getEmoji(),
//       };

//       setUserState({ type: "CURRENT_USER", value: newUser });

//       setGameState({ type: "CATEGORIES", value: categories });
//       setGameState({ type: "POSSIBLE_ALPHABET", value: ALPHABET });
//       setGameState({ type: "ROOM_CODE", value: generateRoomName() });
//       setGameState({ type: "ROUNDS", value: parseInt(rounds) });

//       props.send({ type: "UPDATE_MAX_ROUNDS", value: parseInt(rounds) });
//       props.send("READY");
//     },
//     [setGameState, props, setUserState]
//   );

//   return (
//     <div className={styles.container}>
//       <form onSubmit={handleSubmit(onSubmitHanlder)}>
//         <div className={styles.inputContainer}>
//           <label>Your Name:</label>
//           <input
//             {...register("user", { required: true })}
//             maxLength={20}
//             type="text"
//           />
//         </div>

//         <div className={styles.optionsContainer}>
//           <h2>Select number of rounds:</h2>
//           <div className={styles.roundSelectionList}>
//             {ROUND_SELECTIONS.map((round, index) => (
//               <div key={index}>
//                 <input
//                   type="radio"
//                   id={round.toString()}
//                   value={round}
//                   {...register("rounds")}
//                 />
//                 <label htmlFor={round.toString()}>{round.toString()}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.optionsContainer}>
//           <h2>Select categories:</h2>
//           <div className={styles.categoriesList}>
//             {CATEGORIES.map((category, index) => (
//               <div key={index}>
//                 <input
//                   type="checkbox"
//                   id={category.id}
//                   value={category.value}
//                   {...register("categories")}
//                 />
//                 <label htmlFor={category.id}>{category.value}</label>
//               </div>
//             ))}
//           </div>
//         </div>

//         <div className={styles.buttonWrapper}>
//           <button type="submit">Create Game</button>
//           <button onClick={() => props.send("BACK")}>Cancel</button>
//         </div>
//       </form>
//     </div>
//   );
// };
