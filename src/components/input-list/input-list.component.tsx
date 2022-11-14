import { pick } from "ramda";
import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAsync, useMount } from "react-use";
import { StateComponentType } from "../../app.types";
import { useGameChannel } from "../../game-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { useTimer } from "../../hooks/timer.hook";
import styles from "./input-list.module.css";

export const InputList: StateComponentType = ({ context, send }) => {
  const { categories, currentLetter, maxRounds } = context.gameState;
  const { seconds, startTimer } = useTimer();
  const { register, getValues } = useForm<any>({
    mode: "onSubmit",
    defaultValues: categories?.reduce(
      (categoryObj, category) => ({
        ...categoryObj,
        [category]: "",
      }),
      {}
    ),
  });

  // const { gameChannel } = useGameChannel({ context, send });

  useMount(() => {
    startTimer();
  })

  useEffect(() => {
    if (context.leader && seconds === 0) {
      onSubmitHanlder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const onSubmitHanlder = useCallback(() => {
    
  }, [])

  // const onSubmitHanlder = useCallback(async () => {
  //   if (gameChannel && context.userId) {
  //     await gameChannel.send({
  //       type: "broadcast",
  //       event: "submit",
  //       payload: {
  //         userId: context.userId,
  //         values: getValues()
  //       },
  //     });

  //     send({ type: "submitResponses", value: getValues() });
  //   }
  // }, [context.userId, gameChannel, getValues, send]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>
            Round:{" "}
            <span>
              #{context.round}/{maxRounds}
            </span>
          </h2>
          <h2>
            Current Letter: <span>{currentLetter}</span>
          </h2>
        </div>

        <p>{seconds}</p>
      </div>

      {categories &&
        categories.map((category: string, index: number) => (
          <div key={index} className={styles.inputListItem}>
            <input
              {...register(category)}
              autoFocus={index === 0}
              maxLength={30}
              placeholder={category}
              type="text"
            />
          </div>
        ))}

      <div className={styles.buttonWrapper}>
        <button onClick={onSubmitHanlder}>Submit Response</button>
      </div>
    </div>
  );
};
// import { RealtimeChannel } from "@supabase/supabase-js";
// import { has, isEmpty } from "ramda";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useForm } from "react-hook-form";
// import { useMount } from "react-use";
// import { useGameState, useUserState } from "../../context";
// import { useCreateChannel } from "../../hooks/create-channel.hook";
// import { useDelay } from "../../hooks/delay.hook";
// import { useTimer } from "../../hooks/timer.hook";
// import styles from "./input-list.module.css";

// export const InputList: React.FC<{
//   context: any;
//   send: (event: any) => void;
// }> = (props) => {
//   const [roundChannel, setRoundChannel] = useState<RealtimeChannel>();
//   const { createPresenceChannel } = useCreateChannel();
//   const [gameState, setGameState] = useGameState();
//   const [userState] = useUserState();
//   const { seconds, startTimer } = useTimer();
//   const [timerValue, setTimerValue] = useState(seconds);
//   const delay = useDelay();

//   const { categories, currentLetter, rounds } = gameState;
//   const { user } = userState;

//   const { register, getValues } = useForm<FormData>({
//    mode: "onSubmit",
//     defaultValues: {},
//  });

//   const currentTimerValue = useMemo(
//     () => (user.leader ? seconds : timerValue),
//     [seconds, timerValue, user.leader]
//   );

//   useMount(() => {
//     const presenceKey = `round-${props.context.round}`;
//     const newRoundChannel = createPresenceChannel(presenceKey, user.id);

//     setRoundChannel(newRoundChannel);

//     newRoundChannel.on("presence", { event: "sync" }, () => {
//       const presenceRoundState = newRoundChannel.presenceState();

//       if (!isEmpty(presenceRoundState) && !has(user.id, presenceRoundState)) {
//         setGameState({
//           type: "RESPONSES",
//           value: { round: props.context.round, responses: getValues() },
//         });

//         props.send("SCORE");
//       }
//     });

//     newRoundChannel.on("broadcast", { event: "submit" }, ({ payload }) => {
//       if (payload.seconds >= 0 && !user.leader) {
//         setTimerValue(payload.seconds);
//       }
//     });

//     newRoundChannel.subscribe();
//   });

//   const onSubmitHanlder = useCallback(async () => {
//     setGameState({
//       type: "RESPONSES",
//       value: { round: props.context.round, responses: getValues() },
//     });

//     await delay();

//     roundChannel?.track({
//       submit: true,
//     });

//     props.send({ type: "SCORE" });
//   }, [setGameState, props, getValues, delay, roundChannel]);

//   useMount(() => {
//     startTimer();
//   });

//   useEffect(() => {
//     if (roundChannel && user.leader) {
//       if (seconds === 0) {
//         onSubmitHanlder();
//       } else {
//         roundChannel.send({
//           type: "broadcast",
//           event: "submit",
//           payload: {
//             seconds,
//           },
//         });
//       }
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [roundChannel, seconds]);

//   return (
//     <div>
//       <div className={styles.header}>
//         <div className={styles.headerContent}>
//           <h2>
//             Round:{" "}
//             <span>
//               #{props.context.round}/{rounds}
//             </span>
//           </h2>
//           <h2>
//             Current Letter: <span>{currentLetter}</span>
//           </h2>
//         </div>

//         <p>{currentTimerValue}</p>
//       </div>

//       {categories &&
//         categories.map((category: any, index: number) => (
//           <div key={index} className={styles.inputListItem}>
//             <input
//               {...register(category)}
//               autoFocus={index === 0}
//               maxLength={30}
//               placeholder={category}
//               type="text"
//             />
//           </div>
//         ))}

//       <div className={styles.buttonWrapper}>
//         <button onClick={onSubmitHanlder}>Submit Response</button>
//       </div>
//     </div>
//   );
// };
