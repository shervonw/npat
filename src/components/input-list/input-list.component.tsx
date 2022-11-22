import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAsync } from "react-use";
import { useAppContext } from "../../app.context";
import { Game, StateComponentType } from "../../app.types";
import { useDelay } from "../../hooks/delay.hook";
import { useTimer } from "../../hooks/timer.hook";
import { getLetterFromAlphabet } from "../create-game/create-game.utils";
import styles from "./input-list.module.css";

export const InputList: StateComponentType = ({
  channel,
  context,
  isSubscribed,
  send,
}) => {
  const delay = useDelay();
  const [appContext, setAppContext] = useAppContext();
  const { categories, currentLetter, maxRounds, player, possibleAlphabet } =
    appContext;

  const { isRunning: isTimerRunning, seconds, startTimer } = useTimer();
  const { register, getValues } = useForm<any>({
    mode: "onSubmit",
    defaultValues: (categories ?? []).reduce(
      (categoryObj, category) => ({
        ...categoryObj,
        [category]: "",
      }),
      {}
    ),
  });

  const { loading } = useAsync(async () => {
    await delay();

    if (channel && player?.leader) {
      const letter = getLetterFromAlphabet(possibleAlphabet);
      let payload: Partial<Game> = letter;

      if (context.round === 1) {
        payload.categories = categories;
        payload.maxRounds = maxRounds;
      }

      await channel.send({
        type: "broadcast",
        event: "start",
        payload,
      });

      setAppContext({ type: "currentLetter", value: letter.currentLetter });
      setAppContext({
        type: "possibleAlphabet",
        value: letter.possibleAlphabet,
      });

      send({ type: "updateMaxRounds", value: maxRounds });
    }
  }, []);

  useEffect(() => {
    if (channel && isSubscribed) {
      channel.on("broadcast", { event: "submit" }, () => {
        setAppContext({
          type: "allResponses",
          value: {
            round: context.round,
            userId: player?.userId,
            values: getValues(),
          },
        });

        send({ type: "submitResponses" });
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, isSubscribed, send]);

  const onSubmitHanlder = useCallback(async () => {
    if (channel) {
      await channel.send({
        type: "broadcast",
        event: "submit",
      });

      setAppContext({
        type: "allResponses",
        value: {
          round: context.round,
          userId: player?.userId,
          values: getValues(),
        },
      });

      send({ type: "submitResponses" });
    }
  }, [channel, context.round, getValues, player?.userId, send, setAppContext]);

  useEffect(() => {
    if (player?.leader && seconds === 0) {
      onSubmitHanlder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  useEffect(() => {
    if (categories && currentLetter && !isTimerRunning) {
      startTimer();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [categories, currentLetter, isTimerRunning]);

  if (loading) {
    return <div>Starting Round...</div>;
  }

  return (
    <div>
      <div className={styles.header}>
        <div className={styles.headerContent}>
          <h2>
            Round:{" "}
            <span>
              #{context.round}/{context.maxRounds}
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
        <button disabled={seconds === 0} onClick={onSubmitHanlder}>
          Submit
        </button>
      </div>
    </div>
  );
};
