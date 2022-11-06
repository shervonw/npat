import { AnyState, assign, createMachine } from "xstate";
import { CreateGame } from "../components/create-game";
import { InputList } from "../components/input-list";
import { Instructions } from "../components/instructions";
import { JoinGame } from "../components/join-game";
import { Score } from "../components/score";
import { ScoreReview } from "../components/score-review";
import { Scoreboard } from "../components/scoreboard";
import { WaitingRoom } from "../components/waiting-room";
import { DEFAULT_MAX_ROUNDS } from "../constants";

export interface StateContext {
  maxRounds: number;
  roomCode: string;
  round: number;
}

const STATE_MACHINE_NAME = "npat-game";

export const getStateMeta = (state: AnyState) => {
  const currentStateId = Object.keys(state.meta).sort().reverse()[0];
  return state.meta?.[currentStateId] ?? {};
};

export const stateMachine = createMachine<StateContext>(
  {
    predictableActionArguments: true,
    id: STATE_MACHINE_NAME,
    initial: "unknown",
    context: {
      maxRounds: DEFAULT_MAX_ROUNDS,
      roomCode: "",
      round: 1,
    },
    states: {
      unknown: {
        always: [
          { target: "join", cond: "checkForRoomCode" },
          { target: "home" },
        ],
      },
      home: {
        on: {
          INSTRUCTIONS: { target: "instructions" },
          CREATE: { target: "create" },
          JOIN: { target: "join" },
        },
      },
      instructions: {
        on: {
          BACK: { target: "home" },
        },
        meta: {
          Component: Instructions,
        },
      },
      create: {
        on: {
          BACK: { target: "home" },
          READY: { target: "wait" },
          UPDATE_MAX_ROUNDS: {
            actions: { type: "updateMaxRounds" },
          },
        },
        meta: {
          Component: CreateGame,
        },
      },
      join: {
        on: {
          BACK: { target: "home" },
          READY: { target: "wait" },
        },
        meta: {
          Component: JoinGame,
        },
      },
      wait: {
        on: {
          READY: { target: "game" },
        },
        meta: {
          Component: WaitingRoom,
        },
      },
      game: {
        type: "compound",
        initial: "playing",
        states: {
          playing: {
            on: {
              NEXT: {
                target: "score",
              },
            },
            meta: {
              Component: InputList,
            },
          },
          score: {
            always: {
              target: "completed",
              cond: "isAllRoundsCompleted",
            },
            on: {
              NEXT: {
                target: "wait",
                actions: {
                  type: "incrementRounds",
                },
              },
            },
            meta: {
              Component: Score,
            },
          },
          wait: {
            on: {
              NEXT: { target: "playing" },
            },
            meta: {
              Component: ScoreReview,
            },
          },
          completed: {
            type: "final",
          },
        },
        onDone: { target: "scoreboard" },
      },
      scoreboard: {
        exit: assign({ rounds: 0 }),
        on: {
          RESTART: { target: "home" },
        },
        meta: {
          Component: Scoreboard,
        },
      },
    },
  },
  {
    actions: {
      incrementRounds: assign({
        round: (ctx) => ctx.round + 1,
      }),
      updateMaxRounds: assign({
        maxRounds: (_, e) => e.value
      }),
    },
    guards: {
      checkForRoomCode: (ctx) => !!ctx.roomCode,
      isAllRoundsCompleted: (ctx) => ctx.round === ctx.maxRounds + 1,
    },
  }
);
