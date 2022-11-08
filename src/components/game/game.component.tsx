import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useEffect, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import styles from "./game.module.css"

export const Game: React.FC<{
  children: any;
  send: any;
}> = ({ children }) => {
  const [gameStateChannel, setGameStateChannel] = useState<RealtimeChannel>();
  const [responsesChannel, setResponsesChannel] = useState<RealtimeChannel>();
  const [scoringChannel, setScoringChannel] = useState<RealtimeChannel>();
  const delay = useDelay();
  const [gameState, setGameState] = useGameState();
  const [userState, setUserState] = useUserState();

  const { user } = userState;

  const { createPresenceChannel } = useCreateChannel();

  const canInitialize = useMemo(() => gameState.roomCode && user, [gameState.roomCode, user])

  useEffect(() => {
    if (canInitialize) {
      const usersChannel = createPresenceChannel("users");

      usersChannel.on("presence", { event: "join" }, (presence) => {
        setUserState({
          type: "USERS",
          value: [...presence.currentPresences, ...presence.newPresences],
        });
      });

      usersChannel.on("presence", { event: "leave" }, (presence) => {
        const exitedUser = presence.leftPresences[0];

        if (exitedUser.leader) {
          const newLeader = presence.currentPresences[0];

          if (newLeader?.id === user.id) {
            setUserState({
              type: "CURRENT_USER",
              value: { ...user, leader: true },
            });
          }

          setUserState({
            type: "USERS",
            value: presence.currentPresences.map((user) => ({
              ...user,
              leader: newLeader.id === user.id,
            })),
          });
        } else {
          setUserState({
            type: "USERS",
            value: presence.currentPresences,
          });
        }
      });

      usersChannel.subscribe().track(user);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInitialize]);

  useAsync(async () => {
    if (canInitialize) {
      if (!gameStateChannel) {
        await delay();
      }

      const newGameStateChannel = createPresenceChannel("gameState");

      setGameStateChannel(newGameStateChannel);

      newGameStateChannel.on("presence", { event: "sync" }, () => {
        const presenceGameState =
          newGameStateChannel.presenceState().gameState?.[0];

        if (presenceGameState && !user.leader) {
          setGameState({ type: "CATEGORIES", value: presenceGameState?.categories });

          setGameState({
            type: "CURRENT_LETTER",
            value: presenceGameState?.currentLetter,
          });

          setGameState({
            type: "POSSIBLE_ALPHABET",
            value: presenceGameState?.possibleAlphabet,
          });

          setGameState({
            type: "ROUNDS",
            value: presenceGameState?.rounds,
          });
        }
      });

      newGameStateChannel.subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInitialize]);

  useEffect(() => {
    if (gameStateChannel && user.leader) {
      gameStateChannel.track(gameState);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    gameStateChannel,
    gameState.categories,
    gameState.currentLetter,
    gameState.possibleAlphabet,
    gameState.rounds,
  ]);

  useAsync(async () => {
    if (canInitialize) {
      if (!responsesChannel) {
        await delay(750);
      }

      const newResponsesChannel = createPresenceChannel("responses", user.id);

      setResponsesChannel(newResponsesChannel);

      newResponsesChannel.on("presence", { event: "sync" }, () => {
        const presenceState = newResponsesChannel.presenceState();

        setGameState({
          type: "ALL_RESPONSES",
          value: Object.entries(presenceState)
            .map(([userId, state]) => ({ userId, responses: state[0] }))
            .reduce((responseMapByUserId, response) => {
              return {
                ...responseMapByUserId,
                [response.userId]: response.responses,
              };
            }, {}),
        });
      });

      newResponsesChannel.subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInitialize]);

  useEffect(() => {
    if (responsesChannel && gameState.responses) {
      responsesChannel.track(gameState.responses);
    }
  }, [responsesChannel, gameState.responses]);

  useAsync(async () => {
    if (canInitialize) {
      if (!scoringChannel) {
        await delay(1000);
      }

      const newScoringChannel = createPresenceChannel("scoring");

      setScoringChannel(newScoringChannel);

      newScoringChannel.on("presence", { event: "sync" }, () => {
        const presenceState = newScoringChannel.presenceState();

        if (presenceState.scoring) {
          setGameState({
            type: "ALL_SCORES",
            value: presenceState.scoring.reduce((acc: any, score) => {
              const [[userId, state]] = Object.entries(score);

              return {
                ...acc,
                [userId]: {
                  ...acc?.[userId],
                  ...state,
                },
              };
            }, {}),
          });
        }
      });

      newScoringChannel.subscribe();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [canInitialize]);

  useEffect(() => {
    if (scoringChannel && gameState.scores) {
      scoringChannel.track(gameState.scores);
    }
  }, [scoringChannel, gameState.scores]);

  return <div className={styles.container}>{children}</div>;
};
