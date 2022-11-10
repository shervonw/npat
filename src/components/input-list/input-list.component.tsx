import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useMount } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { useTimer } from "../../hooks/timer.hook";
import styles from "./input-list.module.css";

export const InputList: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [roundChannel, setRoundChannel] = useState<RealtimeChannel>();
  const { createPresenceChannel } = useCreateChannel();
  const [gameState, setGameState] = useGameState();
  const [userState] = useUserState();
  const { seconds, startTimer } = useTimer();
  const [timerValue, setTimerValue] = useState(seconds);
  const delay = useDelay();

  const { categories, currentLetter, rounds } = gameState;
  const { user } = userState;

  const { handleSubmit, register, getValues } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {},
  });

  const currentTimerValue = useMemo(
    () => (user.leader ? seconds : timerValue),
    [seconds, timerValue, user.leader]
  );

  useMount(() => {
    const presenceKey = `round-${props.context.round}`;
    const newRoundChannel = createPresenceChannel(presenceKey);

    setRoundChannel(newRoundChannel);

    newRoundChannel.on("presence", { event: "sync" }, () => {
      const presenceRoundState = newRoundChannel.presenceState()[presenceKey];

      if (presenceRoundState?.length > 0) {
        setGameState({
          type: "RESPONSES",
          value: { round: props.context.round, responses: getValues() },
        });

        props.send("SCORE");
      }
    })

    newRoundChannel.on("broadcast", { event: "submit" }, ({ payload }) => {
      if (payload.seconds >= 0 && !user.leader) {
        setTimerValue(payload.seconds);
      }
    });

    newRoundChannel.subscribe();
  });

  const onSubmitHanlder = useCallback(
    async (formData: FormData) => {
      setGameState({
        type: "RESPONSES",
        value: { round: props.context.round, responses: formData },
      });

      await delay();

      roundChannel?.track({
        submit: true,
      });

      props.send({ type: "SCORE" });
    },
    [delay, roundChannel, props, setGameState]
  );

  useMount(() => {
    startTimer();
  });

  useEffect(() => {
    if (roundChannel && user.leader) {
      if (seconds === 0) {
        onSubmitHanlder(getValues());
      } else {
        roundChannel.send({
          type: "broadcast",
          event: "submit",
          payload: {
            seconds,
          },
        });
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roundChannel, seconds]);

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>
            Round:{" "}
            <span>
              #{props.context.round}/{rounds}
            </span>
          </h2>
          <h2>
            Current Letter: <span>{currentLetter}</span>
          </h2>
        </div>

        <p>{currentTimerValue}</p>
      </div>

      <form onSubmit={handleSubmit(onSubmitHanlder)}>
        {categories &&
          categories.map((category: any, index: number) => (
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
          <button type="submit">Submit Response</button>
        </div>
      </form>
    </div>
  );
};
