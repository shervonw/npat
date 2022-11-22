import { createMachine } from "xstate";
import { createModel } from "xstate/lib/model";
import { StateContext, StateEventObject } from "./app.types";

const appModel = createModel<StateContext, StateEventObject>({
  maxRounds: 5,
  roomCode: "",
  round: 0,
});

export const appStateMachine = createMachine(
  {
    preserveActionOrder: true,
    predictableActionArguments: true,
    id: "npat-game",
    initial: "initial",
    context: appModel.initialContext,
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
                actions: ["assignRoomCode"],
              },
            },
          },
          create: {
            on: {
              back: { target: "index" },
              ready: {
                target: "#Game.waitingRoom",
                actions: ["assignRoomCode"],
              },
            },
          },
        },
      },
      game: {
        id: "Game",
        on: {
          updateMaxRounds: {
            actions: ["updateMaxRounds"],
          },
        },
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
            on: {
              start: {
                target: "playing",
                actions: ["incrementRounds"],
              },
            },
          },
          scoreboard: {
            on: {
              home: {
                target: "#Home.index",
              },
            },
            exit: ["reset"],
          },
        },
      },
    },
  },
  {
    actions: {
      assignRoomCode: appModel.assign({
        roomCode: (_, event) => event.value,
      }),
      incrementRounds: appModel.assign({
        round: (context, _) => context.round + 1,
      }),
      reset: appModel.reset(),
      updateMaxRounds: appModel.assign({
        maxRounds: (_, event) => event.value,
      }),
    },
    guards: {
      checkForRoomCode: (context) => Boolean(context.roomCode),
      isAllRoundsCompleted: (context) => context.round > context.maxRounds,
    },
  }
);
