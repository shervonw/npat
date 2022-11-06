import { useCallback, useState } from "react";
import { useBoolean, useInterval } from "react-use";

const TIMER_VALUE = 60;
const DELAY_VALUE = 1000;

export const useTimer = () => {
  const [seconds, setSeconds] = useState(TIMER_VALUE);
  const [isRunning, toggleIsRunning] = useBoolean(false);

  const stopAndResetTimer = useCallback(() => {
    setSeconds(TIMER_VALUE);
    toggleIsRunning(false);
  }, [toggleIsRunning])

  const startTimer = useCallback(() => {
    toggleIsRunning(true);
  }, [toggleIsRunning])

  useInterval(
    () => {
      setSeconds(seconds - 1);
    },
    isRunning ? DELAY_VALUE : null
  );

  return {
    seconds,
    startTimer,
    stopAndResetTimer,
  }
};
