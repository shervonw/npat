import { assign, createMachine } from "xstate";
import { StateContext } from "./app.types";
import {
  createPlayer,
  generateRoomName
} from "./app.utils";
import { ALPHABET } from "./components/create-game/create-game.constants";

const DEFAULT_CONTEXT = {
  game: {
    maxRounds: 5,
    possibleAlphabet: ALPHABET,
  },
  round: 0,
};

export const appStateMachine = createMachine<StateContext>(
  {
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
            entry: ["readyUp"],
            on: {
              ready: {
                target: "playing",
              },
              updatePlayers: {
                actions: ["updatePlayers"],
              },
              reAssignLeader: {
                actions: ["reAssignLeader"],
              },
            },
          },
          playing: {
            entry: ["getLetterFromAlphabet", "incrementRounds"],
            on: {
              submitResponses: {
                target: "score",
                actions: ["updateResponses"],
              },
            },
          },
          score: {
            on: {
              submitScores: {
                target: "waitingRoom",
                actions: ["updateTotalScore"],
              },
              updateScores: {
                actions: ["updateScores"],
              },
            },
          },
          scoreboard: {
            exit: assign({ rounds: 0 }),
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
      incrementRounds: assign({
        round: (context, _) => context.round + 1,
      }),
      updateMaxRounds: assign({
        game: (context, e) => ({
          ...context.game,
          maxRounds: e.value,
        }),
      }),
      updateCategories: assign({
        game: (context, e) => ({
          ...context.game,
          categories: e.value,
        }),
      }),
      getLetterFromAlphabet: assign({
        game: (context, _) => {
          if (!context?.leader) {
            return context.game;
          }

          const alphabet = context.game.possibleAlphabet.slice();

          alphabet.sort(() => 0.5 - Math.random());

          const letter = alphabet.shift();

          return {
            ...context.game,
            currentLetter: letter,
            possibleAlphabet: alphabet,
          };
        },
      }),
      createLeader: assign((_, e) => createPlayer(e.value, true)),
      createPlayer: assign((_, e) => createPlayer(e.value)),
      updateResponses: assign({
        responses: (context, e) => ({
          ...context.responses,
          [context.round]: e.value,
        }),
      }),
      updateScores: assign({
        scores: (context, e) => ({
          ...context.scores,
          [context.round]: e.value,
        }),
      }),
      resetContext: assign(() => DEFAULT_CONTEXT),
      updategame: assign({
        game: (_, e) => e.value,
      }),
      assignPlayerAsLeader: assign({
        leader: (c, e) => true,
      }),
      updateTotalScore: assign({
        totalScore: (context, e) => (context.totalScore || 0) + e.value,
      }),
      readyUp: assign({
        ready: (context, e) => ({
          ...context.ready,
          [context.round]: true,
        }),
      }),
    },
    guards: {
      checkForRoomCode: (ctx) => !!ctx.roomCode,
      isAllRoundsCompleted: (ctx) => ctx.round === ctx.game.maxRounds,
    },
  }
);
