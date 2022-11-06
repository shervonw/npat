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
  const [channel, setChannel] = useState<RealtimeChannel>();
  const { createBroadcastChannel } = useCreateChannel();
  const [gameState, setGameState] = useGameState();
  const [userState] = useUserState();
  const delay = useDelay();
  const { seconds, startTimer } = useTimer();
  const [timerValue, setTimerValue] = useState(seconds);
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
    const newChannel = createBroadcastChannel("inputListRound");

    setChannel(newChannel);

    newChannel.on("broadcast", { event: "submit" }, () => {
      setGameState({
        type: "RESPONSES",
        value: { round: props.context.round, responses: getValues() },
      });

      props.send("NEXT");
    });

    newChannel.on("broadcast", { event: "timer" }, (payload) => {
      setTimerValue(payload.payload);
    });

    newChannel.subscribe();

    return () => {
      newChannel.untrack();
      newChannel.unsubscribe();
    };
  });

  const onSubmitHanlder = useCallback(
    async (formData: FormData) => {
      setGameState({
        type: "RESPONSES",
        value: { round: props.context.round, responses: formData },
      });

      await delay();

      channel?.send({
        type: "broadcast",
        event: "submit",
        payload: true,
      });

      props.send({ type: "NEXT" });
    },
    [channel, delay, props, setGameState]
  );

  useEffectOnce(() => {
    startTimer();
  });

  useEffect(() => {
    if (channel && user.leader) {
      channel.send({
        type: "broadcast",
        event: "timer",
        payload: seconds,
      });

      if (seconds === 0) {
        onSubmitHanlder(getValues());
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, seconds]);

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
