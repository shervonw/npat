import { useCallback } from "react"

export const useDelay = () => {
  return useCallback(async (timeout = 500) => {
    // delay
    await new Promise<void>((resolve) => setTimeout(() => {
      resolve();
    }, timeout))
  }, [])
}