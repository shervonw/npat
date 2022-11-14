import { assign, createMachine } from "xstate";
import { StateContext } from "./app.types";
import {
  createPlayer,
  generateRoomName,
  generateScoringPartners,
  startTimer,
} from "./app.utils";
import { ALPHABET } from "./components/create-game/create-game.constants";

const DEFAULT_CONTEXT = {
  gameState: {
    maxRounds: 5,
    possibleAlphabet: ALPHABET,
  },
  round: 0,
  timerValue: 60,
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
        initial: "check",
        states: {
          waitingRoom: {
            on: {
              ready: {
                target: "check",
              },
              updatePlayers: {
                actions: ["updatePlayers"],
              },
              reAssignLeader: {
                actions: ["reAssignLeader"],
              },
            },
          },
          check: {
            entry: ["getLetterFromAlphabet", "incrementRounds"],
            always: [
              {
                target: "scoreboard",
                cond: "isAllRoundsCompleted",
              },
            ],
            on: {
              updateGameState: {
                actions: ["updateGameState"],
              },
              play: {
                target: "playing",
              }
            }
          },
          playing: {
            on: {
              submitResponses: {
                target: "score",
                actions: ["updateResponses"],
              },
              updatePlayers: {
                actions: ["updatePlayers"],
              },
              updateTimer: {
                actions: ["updateTimer"],
              },
            },
          },
          score: {
            entry: ["generateScorePartners"],
            on: {
              submitScores: {
                target: "waitingRoom",
                actions: ["updateScores"],
              },
              updatePlayers: {
                actions: ["updatePlayers", "generateScorePartners"],
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
        gameState: (context, e) => ({
          ...context.gameState,
          maxRounds: e.value,
        }),
      }),
      updateCategories: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          categories: e.value,
        }),
      }),
      getLetterFromAlphabet: assign({
        gameState: (context, _) => {
          if (!context?.leader) {
            return context.gameState;
          }

          const alphabet = context.gameState.possibleAlphabet.slice();

          alphabet.sort(() => 0.5 - Math.random());

          const letter = alphabet.shift();

          return {
            ...context.gameState,
            currentLetter: letter,
            possibleAlphabet: alphabet,
          };
        },
      }),
      createLeader: assign((_, e) => createPlayer(e.value, true)),
      createPlayer: assign((_, e) => createPlayer(e.value)),
      updateResponses: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          responses: {
            ...context.gameState.responses,
            [context.round]: e.value,
          },
        }),
      }),
      updateScores: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          scores: {
            ...context.gameState.scores,
            [context.round]: e.value,
          },
        }),
      }),
      generateScorePartners: assign({
        gameState: (context: StateContext, __) => ({
          ...context.gameState,
          scoringPartners: generateScoringPartners(
            (context?.players ?? []).map((user) => user.id)
          ),
        }),
      }),
      updatePlayers: assign({
        players: (_, e) => e.value,
      }),
      resetContext: assign(() => DEFAULT_CONTEXT),
      updateGameState: assign({
        gameState: (_, e) => e.value,
      }),
      assignPlayerAsLeader: assign({
        leader: (c, e) => true,
      }),
      resetTimer: assign({
        timerValue: (c, e) => 60,
      }),
      updateTimer: assign({
        timerValue: (_, e) => e.value,
      }),
      addPlayer: assign({
        players: (context, e) => [...(context?.players ?? []), e.value],
      }),
      removePlayer: assign({
        players: (context, e) =>
          (context?.players ?? []).filter((player) => player.id !== e.value),
      }),
    },
    guards: {
      checkForRoomCode: (ctx) => !!ctx.roomCode,
      isAllRoundsCompleted: (ctx) => ctx.round === ctx.gameState.maxRounds,
    },
  }
);
