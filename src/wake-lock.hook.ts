import NoSleep from "nosleep.js";
import { useEffect, useState } from "react";

export const useWakeLock = () => {
  const [wakeLock, setWakeLock] = useState<NoSleep>();

  useEffect(() => {
    if (!wakeLock) {
      setWakeLock(new NoSleep());
    }
  }, [wakeLock]);
}