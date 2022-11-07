import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useForm } from "react-hook-form";
import { useEffectOnce } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { useTimer } from "../../hooks/timer.hook";

export const InputList: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [roundChannel, setRoundChannel] = useState<RealtimeChannel>();
  const { createBroadcastChannel } = useCreateChannel();
  const [gameState, setGameState] = useGameState();
  const [userState] = useUserState();
  const { seconds, startTimer } = useTimer();
  const [timerValue, setTimerValue] = useState(seconds);
  const delay = useDelay();

  const { categories, currentLetter } = gameState;
  const { user } = userState;

  const { handleSubmit, register, getValues } = useForm<FormData>({
    mode: "onSubmit",
    defaultValues: {},
  });

  const currentTimerValue = useMemo(
    () => (user.leader ? seconds : timerValue),
    [seconds, timerValue, user.leader]
  );

  useEffectOnce(() => {
    const newRoundChannel = createBroadcastChannel("round");

    setRoundChannel(newRoundChannel);

    newRoundChannel.on("broadcast", { event: "submit" }, ({ payload }) => {
      if (payload.seconds >= 0 && !user.leader) {
        setTimerValue(payload.seconds);
      }

      if (payload.submit || payload.seconds === 0) {
        setGameState({
          type: "RESPONSES",
          value: { round: props.context.round, responses: getValues() },
        });

        props.send("NEXT");
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

      roundChannel?.send({
        type: "broadcast",
        event: "submit",
        payload: {
          seconds: 0,
          submit: true,
        },
      });

      props.send({ type: "NEXT" });
    },
    [delay, roundChannel, props, setGameState]
  );

  useEffectOnce(() => {
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
      <p>Current Letter: {currentLetter}</p>
      <p>Timer: {currentTimerValue}</p>
      <form onSubmit={handleSubmit(onSubmitHanlder)}>
        {categories &&
          categories.map((category: any, index: number) => (
            <div key={index}>
              <input
                {...register(category, { maxLength: 30 })}
                placeholder={category}
              />
            </div>
          ))}

        <button type="submit">Ready</button>
      </form>
    </div>
  );
};
