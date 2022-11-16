import { useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { useAsync, useMount } from "react-use";
import { useAppContext } from "../../app.context";
import { StateComponentType } from "../../app.types";
import { useDelay } from "../../hooks/delay.hook";
import { useTimer } from "../../hooks/timer.hook";
import { useUsersChannel } from "../../users-channel.hook";
import styles from "./input-list.module.css";

export const InputList: StateComponentType = ({ context, send }) => {
  const [appContext] = useAppContext();
  const { seconds, startTimer } = useTimer();
  const { register, getValues } = useForm<any>({
    mode: "onSubmit",
    defaultValues: appContext.categories?.reduce(
      (categoryObj, category) => ({
        ...categoryObj,
        [category]: "",
      }),
      {}
    ),
  });
  const delay = useDelay();

  const onSubmitHandler = useCallback(async () => {
    send({ type: "submitResponses", value: getValues() });
  }, [getValues, send]);

  const { usersChannel } = useUsersChannel({
    context,
    onSubmit: onSubmitHandler,
    send,
  });

  const { categories, currentLetter, maxRounds } = appContext;

  useMount(() => {
    startTimer();
  });

  const onSubmitHanlder= useCallback(async () => {
    if (usersChannel && context.userId) {
      await usersChannel.send({
        type: "broadcast",
        event: "submit",
        payload: {
          userId: context.userId,
        },
      });

      send({ type: "submitResponses", value: getValues() });
    }
  }, [context.userId, getValues, send, usersChannel]);

  useEffect(() => {
    if (context.leader && seconds === 0) {
      onSubmitHanlder();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seconds]);

  const { loading } = useAsync(async() => {
    await delay(1000)
  })

  if (loading) {
    return <div>Starting Round...</div>
  }

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
        {!loading ? (
          <button disabled={seconds === 0} onClick={onSubmitHanlder}>
            Submit
          </button>
        ) : (
          <p>Submitting responses...</p>
        )}
      </div>
    </div>
  );
};
