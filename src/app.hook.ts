import { useCallback, useEffect, useMemo, useState } from "react";
import { useAppContext } from "./app.context";
import { Player, StateComponentProps } from "./app.types";
import { useChannel } from "./hooks/channel.hook";

export const useAppChannel = ({ context, send }: StateComponentProps) => {
  const getChannel = useChannel();
  const [isSubscribed, setIsSubscribed] = useState<boolean>();
  const [players, setPlayers] = useState<Player[]>([]);
  const [lastLeftPlayer, setLastLeftPlayer] = useState<Player>();
  const [appContext, setAppContext] = useAppContext();

  const { player, } = appContext;

  const channel = useMemo(() => {
    if (context.roomCode && player?.userId) {
      return getChannel(context.roomCode, player?.userId);
    }
  }, [context.roomCode, getChannel, player?.userId]);

  const updatePlayers = useCallback((newPlayers: Player[]) => {
    setPlayers(newPlayers);
  }, []);

  useEffect(() => {
    if (channel) {
      channel.on("presence", { event: "sync" }, () => {
        const presenceState = channel.presenceState();
        const players = Object.values(presenceState).map(
          (player) => player[0]
        ) as unknown as Player[];

        updatePlayers(players);
      });

      channel.on("presence", { event: "leave" }, (presence) => {
        const exitedPlayer = presence.leftPresences[0] as unknown as Player;
        // console.log("exit", exitedPlayer);
        setLastLeftPlayer(exitedPlayer);
      });

      channel.on("broadcast", { event: "start" }, ({ payload }) => {
        if (payload.categories) {
          setAppContext({ type: "categories", value: payload.categories });
        }
        if (payload.maxRounds) {
          setAppContext({ type: "maxRounds", value: payload.maxRounds });
          send({ type: "updateMaxRounds", value: payload.maxRounds });
        }
        if (payload.newLetter) {
          setAppContext({ type: "currentLetter", value: payload.currentLetter });
          setAppContext({ type: "possibleAlphabet", value: payload.possibleAlphabet });
        }

        send({ type: "start" });
      });

      channel.on("broadcast", { event: "responses" }, ({ payload }) => {
        setAppContext({
          type: "allResponses",
          value: payload,
        });
      });

      channel.on("broadcast", { event: "scoringPartners" }, ({ payload }) => {
        setAppContext({
          type: "scoringPartners",
          value: payload,
        });
      });

      channel.on("broadcast", { event: "score" }, ({ payload }) => {
        setAppContext({
          type: "allScores",
          value: payload,
        });
      });

      channel.on("broadcast", { event: "ready" }, ({ payload }) => {
        setAppContext({
          type: "ready",
          value: payload,
        });
      });

      channel.subscribe((status) => {
        setIsSubscribed(status === "SUBSCRIBED");
        channel.track(player || {});
      });
    }

    return () => {
      if (channel) channel.unsubscribe();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  // useEffect(() => {
  //   if (lastLeftPlayer && lastLeftPlayer?.leader) {
  //     setLastLeftPlayer(null);

  //     const newLeader = users?.[0];

  //     if (newLeader?.userId === context.userId && channel) {
  //       channel.track({ ...context, leader: true });
  //       send({ type: "reAssignLeader" });
  //     }
  //   }
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [lastLeftPlayer]);

  return {
    channel,
    isSubscribed,
    players,
  };
};
