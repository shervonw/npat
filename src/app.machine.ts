import { assign, createMachine } from "xstate";
import { StateContext } from "./app.types";
import { ALPHABET } from "./components/create-game/create-game.constants";
import { generateScoringPartners } from "./utils";

const startTimer = (context: StateContext) => {
  return new Promise((resolve) => {
    let count = context.timerValue;
    setInterval(() => {
      count -= 1;

      if (count <= 0) {
        resolve("done");
      }
    }, 1000);
  })
}

const createPlayer = (name: string, leader: boolean = false) => {
  return {
    id: Math.floor(Math.random() * 100000000).toString(),
    name,
    leader,
  };
};

export const appStateMachine = createMachine<StateContext>(
  {
    predictableActionArguments: true,
    id: "npat-game",
    initial: "initial",
    context: {
      round: 0,
      timerValue: 60,
      gameState: {
        maxRounds: 5,
        possibleAlphabet: ALPHABET,
      }
    },
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
          create: {
            on: {
              back: { target: "index" },
              ready: {
                target: "#Game.waitForGameStart",
                actions: ["createLeader"],
              },
              updateMaxRounds: {
                actions: ["updateMaxRounds"],
              },
            },
          },
          join: {
            on: {
              back: { target: "index" },
              ready: {
                target: "#Game.waitForGameStart",
                actions: ["createPlayer"],
              },
            },
          },
        },
      },
      game: {
        id: "Game",
        initial: "check",
        states: {
          waitForGameStart: {
            on: {
              ready: { target: "check" },
            },
          },
          check: {
            always: [
              {
                target: "scoreboard",
                cond: "isAllRoundsCompleted",
              },
              {
                target: "playing",
                actions: ["getLetterFromAlphabet", "incrementRounds"],
              },
            ],
          },
          playing: {
            invoke: {
              id: "startTimer",
              src: startTimer,
              onDone: {
                target: "score",
                // actions: ["updateResponses"],
              },
            },
            on: {
              submitResponses: {
                target: "score",
                // actions: ["updateResponses"],
              },
              updatePlayers: {
                actions: ["updatePlayerList"],
              },
            },
            exit: ["updateResponses", "generateScorePartners"],
          },
          score: {
            on: {
              submitScores: {
                target: "waitForNextRound",
                actions: ["updateScores"],
              },
              updatePlayers: {
                actions: ["updatePlayerList", "generateScorePartners"],
              },
            },
          },
          waitForNextRound: {
            exit: assign({ scoringPartners: {} }),
            on: {
              nextRound: {
                target: "check",
              },
              updatePlayers: {
                actions: ["updatePlayerList"],
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
      incrementRounds: assign({
        round: (context, _) => context.round + 1,
      }),
      updateMaxRounds: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          maxRounds: e.value,
        }),
      }),
      getLetterFromAlphabet: assign({
        gameState: (context, _) => {
          if (!context.player?.leader) {
            return context.gameState;
          }

          return {
            ...context.gameState,
            currentLetter: "letter",
            possibleAlphabet: ["alphabet"],
          }
        },
      }),
      createLeader: assign({
        player: (_, e) => createPlayer(e.name, true),
      }),
      createPlayer: assign({
        player: (_, e) => createPlayer(e.name),
      }),
      updateResponses: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          responses: {
            ...context.gameState.responses,
            [context.round]: e.value,         
          }
        }),
      }),
      updateScores: assign({
        gameState: (context, e) => ({
          ...context.gameState,
          scores: {
            ...context.gameState.scores,
            [context.round]: e.value,         
          }
        }),
      }),
      generateScorePartners: assign({
        gameState: (context: StateContext, __) => ({
          ...context.gameState,
          scoringPartners: generateScoringPartners((context?.players ?? []).map((user) => user.id)),
        })
      }),
      updatePlayerList: assign({
        players: (_, e) => e.players,
      }),
    },
    guards: {
      checkForRoomCode: (ctx) => !!ctx.roomCode,
      isAllRoundsCompleted: (ctx) => ctx.round === ctx.gameState.maxRounds,
    },
  }
);
