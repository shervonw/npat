import { assign, createMachine } from "xstate";
import { StateContext } from "./app.types";
import { createPlayer, generateRoomName } from "./app.utils";

const DEFAULT_CONTEXT = {
  maxRounds: 5,
  round: 0,
};

export const appStateMachine = createMachine<StateContext>(
  {
    preserveActionOrder: true,
    predictableActionArguments: true,
    id: "npat-game",
    initial: "initial",
    context: DEFAULT_CONTEXT,
    states: {
      initial: {
        always: [
          { target: "#Home.join", cond: "checkForRoomCode" },
          { target: "#Home.index" },
        ],
      },
      home: {
        id: "Home",
        states: {
          index: {
            entry: ["resetContext"],
            on: {
              instructions: { target: "instructions" },
              create: { target: "create" },
              join: { target: "join" },
            },
          },
          instructions: {
            on: {
              back: { target: "index" },
            },
          },
          join: {
            on: {
              back: { target: "index" },
              ready: {
                target: "#Game.waitingRoom",
              },
              createPlayer: {
                actions: ["createPlayer"],
              },
              updateRoomCode: {
                actions: ["updateRoomCode"],
              },
            },
          },
          create: {
            on: {
              back: { target: "index" },
              ready: {
                target: "#Game.waitingRoom",
                actions: ["createRoomCode"],
              },
              updateCategories: {
                actions: ["updateCategories"],
              },
              updateMaxRounds: {
                actions: ["updateMaxRounds"],
              },
              createPlayer: {
                actions: ["createLeader"],
              },
            },
          },
        },
      },
      game: {
        id: "Game",
        states: {
          waitingRoom: {
            on: {
              start: {
                target: "playing",
                actions: ["incrementRounds"],
              },
            },
          },
          playing: {
            always: [{ target: "scoreboard", cond: "isAllRoundsCompleted" }],
            on: {
              submitResponses: {
                target: "score",
              },
            },
          },
          score: {
            on: {
              submitScores: {
                target: "scoreReview",
              },
            },
          },
          scoreReview: {
            entry: ["readyUp"],
            on: {
              start: {
                target: "playing",
                actions: ["incrementRounds"],
              },
            },
          },
          scoreboard: {
            exit: assign({ maxRounds: 5, rounds: 0 }),
          },
        },
      },
    },
  },
  {
    actions: {
      createRoomCode: assign({
        roomCode: (c, e) => generateRoomName(),
      }),
      updateRoomCode: assign({
        roomCode: (_, e) => e.value,
      }),
      assignRoomCode: assign({
        roomCode: (_, e) => e.value,
      }),
      incrementRounds: assign({
        round: (context, _) => context.round + 1,
      }),
      updateMaxRounds: assign({
        maxRounds: (c, e) => e.value,
      }),
      createLeader: assign((_, e) => createPlayer(e.value, true)),
      createPlayer: assign((_, e) => createPlayer(e.value)),
      resetContext: assign(() => DEFAULT_CONTEXT),
      readyUp: assign({
        ready: (context, e) => ({
          ...context.ready,
          [context.round]: true,
        }),
      }),
    },
    guards: {
      checkForRoomCode: (ctx) => !!ctx.roomCode,
      isAllRoundsCompleted: (ctx) => ctx.round === ctx.maxRounds,
    },
  }
);
