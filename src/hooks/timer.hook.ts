import { useCallback, useEffect, useState } from "react";
import { useBoolean, useInterval } from "react-use";

const TIMER_VALUE = 60;
const DELAY_VALUE = 1000;

const SOUND_SRC = {
  timer: "/assets/audio/tick-tock.mp3",
  ending: "/assets/audio/fast-tick-tock.mp3",
};

export const useTimer = () => {
  const [seconds, setSeconds] = useState(TIMER_VALUE);
  const [timerAudio] = useState(new Audio(SOUND_SRC.timer));
  const [endingAudio] = useState(new Audio(SOUND_SRC.ending));
  const [isTimerSoundPlaying, setIsTimerSoundPlaying] = useState(false);
  const [isRunning, toggleIsRunning] = useState(false);
  const [mute, toggleMute] = useBoolean(false);

  const stopAndResetTimer = useCallback(() => {
    setSeconds(TIMER_VALUE);
    toggleIsRunning(false);
  }, [toggleIsRunning]);

  const startTimer = useCallback(() => {
    toggleIsRunning(true);
  }, [toggleIsRunning]);

  useInterval(
    () => {
      if (seconds > 0) {
        setSeconds(seconds - 1);
      }
    },
    isRunning ? DELAY_VALUE : null
  );

  useEffect(() => {
    if (!isTimerSoundPlaying && isRunning) {
      timerAudio.loop = true;
      timerAudio.play();
      setIsTimerSoundPlaying(true);
    }

    if (seconds === 4) {
      timerAudio.pause();
    }
  }, [isRunning, isTimerSoundPlaying, seconds, timerAudio]);

  useEffect(() => {
    if (seconds === 4 && !mute) {
      endingAudio.play();
    }
  }, [endingAudio, mute, seconds]);

  useEffect(() => {
    if (isRunning && !mute) {
      timerAudio.play();
    } else {
      timerAudio.pause();
    }
  }, [isRunning, mute, seconds, timerAudio])

  useEffect(() => {
    return () => {
      if (!timerAudio.paused) {
        timerAudio.pause();
      }

      if (!endingAudio.paused) {
        endingAudio.pause();
      }
    };
  }, [endingAudio, timerAudio]);

  return {
    isRunning,
    mute,
    seconds,
    startTimer,
    stopAndResetTimer,
    toggleMute,
  };
};
