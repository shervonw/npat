import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAsync, useMount } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";

const NumberInput = ({
  category,
  currentScore,
  setCurrentScore,
  value,
}: {
  category: string;
  currentScore: Record<string, number>;
  setCurrentScore: (score: Record<string, number>) => void;
  value: number;
}) => {
  const [numberValue, setNumberValue] = useState(value);
  const onMinus = useCallback(() => {
    setCurrentScore(
      Object.assign({}, currentScore, { [category]: numberValue - 5 })
    );
    if (!(numberValue <= 0)) setNumberValue(numberValue - 5);
  }, [category, currentScore, numberValue, setCurrentScore]);

  const onPlus = useCallback( () => { 
    setCurrentScore(
      Object.assign({}, currentScore, { [category]: numberValue + 5 })
    );
    if (!(numberValue >= 10)) setNumberValue(numberValue + 5);
  }, [category, currentScore, numberValue, setCurrentScore]);

  return (
    <>
      <button disabled={numberValue === 0} onClick={onMinus}>
        -
      </button>
      {numberValue}
      <button disabled={numberValue === 10} onClick={onPlus}>
        +
      </button>
    </>
  );
};

export const Score: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [channel, setChannel] = useState<RealtimeChannel>();
  const [currentScore, setCurrentScore] = useState({});
  const { createPresenceChannel } = useCreateChannel();
  const [gameState, setGameState] = useGameState();
  const [userState] = useUserState();
  const delay = useDelay();

  const { allResponses, categories, scoringPartners } = gameState;
  const { user, users } = userState;

  const playerIdToScore = useMemo(
    () => scoringPartners?.[user.id],
    [scoringPartners, user.id]
  );

  const playerResponses = useMemo(() => {
    return allResponses?.[playerIdToScore]?.[props.context.round];
  }, [allResponses, playerIdToScore, props.context.round]);

  const similarityCheck = useCallback(
    (category: string) => {
      if (!allResponses || !playerResponses) {
        return false;
      }

      for (const [userIdForResponse, responses] of Object.entries(
        allResponses
      )) {
        const _responses = responses as any;
        const categoryResponse =
          _responses?.[props.context.round]?.[category]?.trim();
        const playerCategoryResponse = playerResponses?.[category]?.trim();

        if (
          !categoryResponse ||
          !playerCategoryResponse ||
          userIdForResponse !== user.id
        ) {
          continue;
        }

        if (
          categoryResponse.toLowerCase() ===
          playerCategoryResponse.toLowerCase()
        ) {
          return true;
        }
      }

      return false;
    },
    [allResponses, playerResponses, props.context.round, user.id]
  );

  useMount(() => {
    const newChannel = createPresenceChannel("scoringPartners");

    setChannel(newChannel);

    newChannel.on("presence", { event: "sync" }, () => {
      const presenceState = newChannel.presenceState();

      if (presenceState?.scoringPartners?.[0]) {
        const presenceGameState = presenceState.scoringPartners[0];

        setGameState({ type: "SCORING_PARTNERS", value: presenceGameState });
      }
    });

    newChannel.on("broadcast", { event: "start" }, () => {
      props.send("NEXT");
    });

    newChannel.subscribe();
  });

  useAsync(async () => {
    if (channel && user.leader) {
      let scoringPartners: Record<string, string> = {};

      const userIdList1 = users.slice().map((user: any) => user.id);
      const userIdList2 = userIdList1.slice();

      userIdList1.sort(() => 0.5 - Math.random());
      userIdList2.sort(() => 0.5 - Math.random());

      while (userIdList1.length) {
        const user1 = userIdList1.pop();
        const user2 =
          userIdList2[0] == user1 ? userIdList2.pop() : userIdList2.shift();

        scoringPartners[user1] = user2;
      }

      setGameState({ type: "SCORING_PARTNERS", value: scoringPartners });

      await delay();

      channel.track(scoringPartners);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel]);

  useEffect(() => {
    if (playerIdToScore && playerResponses) {
      const initialScore: Record<string, number> = {};

      categories.forEach((category: string) => {
        const similar = similarityCheck(category);
        if (similar) {
          initialScore[category] = 5;
        } else {
          initialScore[category] = 0;
        }
      });

      setCurrentScore(initialScore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerIdToScore, playerResponses, scoringPartners]);

  useEffect(() => {
    if (Object.keys(currentScore).length) {
      setGameState({ type: "SCORES", value: { round: props.context.round, scores: currentScore, userId: playerIdToScore } })
    }  
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore])

  return (
    <div>
      Score
      {categories &&
        categories.map((category: any, index: number) => {
          const similar = similarityCheck(category);
          const resp = playerResponses?.[category];

          return (
            <div key={index}>
              <span>
                {category}: {resp || "-"}
              </span>
              {resp && (
                <span>
                  <NumberInput
                    category={category}
                    currentScore={currentScore}
                    setCurrentScore={setCurrentScore}
                    value={similar ? 5 : 0}
                  />
                </span>
              )}
            </div>
          );
        })}
      <button onClick={() => props.send("NEXT")}>Next Round</button>
    </div>
  );
};
