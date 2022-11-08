import { useMachine } from '@xstate/react';
import type { NextPage } from 'next';
import { Game } from '../src/components/game';
import { GameStateProvider, UserStateProvider } from '../src/context';
import { getStateMeta, stateMachine } from '../src/state-machine';

const Home: NextPage<{ code: string }> = ({ code }) => {
  const [state, send] = useMachine(stateMachine, {
    context: {
      roomCode: code,
    }
  });

  const { Component } = getStateMeta(state);

  return (
    <UserStateProvider>
      <GameStateProvider initialState={{ roomCode: code }}>
        <Game send={send}>
          <div>
            {state.value === "home" && (
              <>
                <button onClick={() => send({ type: 'INSTRUCTIONS' })}>
                  Instructions
                </button>
                <button onClick={() => send({ type: 'CREATE' })}>
                  Create Game
                </button>
                <button onClick={() => send({ type: 'JOIN' })}>
                  Join
                </button>
              </>
            )}
          </div>

          {Component && <Component context={state.context} send={send} />}
        </Game>
      </GameStateProvider>
    </UserStateProvider>
  )
}

Home.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
}

export default Home
