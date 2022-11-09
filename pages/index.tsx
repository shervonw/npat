import { useMachine } from "@xstate/react";
import type { NextPage } from "next";
import NoSleep from "nosleep.js";
import { useMount } from "react-use";
import { Game } from "../src/components/game";
import { Home } from "../src/components/home";
import { GameStateProvider, UserStateProvider } from "../src/context";
import { getStateMeta, stateMachine } from "../src/state-machine";

const Index: NextPage<{ code: string }> = ({ code }) => {
  const [state, send] = useMachine(stateMachine, {
    context: {
      roomCode: code,
    },
  });

  const { Component } = getStateMeta(state);

  useMount(() => {
    var noSleep = new NoSleep();

    // Enable wake lock.
    window.addEventListener(
      "click",
      () => {
        noSleep.enable();
      },
      false
    );
  });

  return (
    <UserStateProvider>
      <GameStateProvider>
        <Game send={send}>
          {state.value === "home" && <Home send={send} />}

          {Component && <Component context={state.context} send={send} />}
        </Game>
      </GameStateProvider>
    </UserStateProvider>
  );
};

Index.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
};

export default Index;
