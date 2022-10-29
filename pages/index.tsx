import { useMachine } from '@xstate/react';
import type { NextPage } from 'next';
import { useSubscribeToRoom } from '../hooks/subscribe-to-room.hook';
import { useUserManagement } from '../hooks/user-management.hook';
import { getStateMeta, stateMachine } from './state-machine';

const Home: NextPage<{ code: string }> = ({ code }) => {
  const [state, send] = useMachine(stateMachine, {
    context: {
      roomCode: code,
    }
  });

  const { Component } = getStateMeta(state);

  useSubscribeToRoom()
  useUserManagement()

  return (
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
      {Component && (
        <Component context={state.context} send={send} />
      )}
    </div>

  )
}

Home.getInitialProps = async (context): Promise<{ code: string }> => {
  return {
    code: (context.query?.code ?? "") as string,
  };
}

export default Home
