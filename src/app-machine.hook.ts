import { useMachine } from "@xstate/react";
import { useMemo } from "react";
import { EventObject, StateValue } from "xstate";
import { componentsMap } from "./app.constants";
import { appStateMachine } from "./app.machine";
import { ComponentType, StateContext } from "./app.types";

const convertStateValueToString = (value: StateValue): string => {
  if (typeof value === "object") {
    const key = Object.keys(value)[0];
    return `${key}.${convertStateValueToString(value[key])}`;
  }
  return value;
};

interface UseWizardResult {
  step: StateValue;
  context: StateContext;
  send: (event: EventObject) => void;
  Component?: ComponentType;
}

export const useAppMachine = (code: string): UseWizardResult => {
  const [state, send] = useMachine(appStateMachine, {
    context: {
      roomCode: code,
    },
  });

  return useMemo(
    () => ({
      context: state.context,
      send,
      step: state.value,
      Component: componentsMap.get(convertStateValueToString(state.value))
    }),
    [send, state]
  );
};
