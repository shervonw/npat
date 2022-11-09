import { RealtimeChannel } from "@supabase/supabase-js";
import React, { useCallback, useEffect, useMemo, useState } from "react";
import { useAsync, useMount } from "react-use";
import { useGameState, useUserState } from "../../context";
import { useCreateChannel } from "../../hooks/create-channel.hook";
import { useDelay } from "../../hooks/delay.hook";
import { NumberInput } from "./number-input";
import styles from "./score.module.css";
import { transformReponses } from "./score.utils";

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
  const { user: currentUser, users } = userState;

  const playerIdToScore = useMemo(
    () => scoringPartners?.[currentUser.id],
    [scoringPartners, currentUser.id]
  );

  const responseList = useMemo(
    () =>
      transformReponses(
        allResponses,
        props.context.round,
        playerIdToScore,
        users
      ),
    [allResponses, playerIdToScore, props.context.round, users]
  );

  const similarityCheck = useCallback(
    (category: string, currentUserId: string) => {
      const { responses: currentResponses } = responseList.find(
        ({ user }) => user.id === currentUserId
      );
      const currentUserResponse = currentResponses[category];

      return responseList
        .filter(({ user }) => user.id !== currentUserId)
        .some(({ responses }) => {
          const otherResponse = responses[category]
            ? responses[category].toLowerCase().trim()
            : null;

          return (
            currentUserResponse &&
            otherResponse &&
            currentUserResponse === otherResponse
          );
        });
    },
    [responseList]
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
    if (channel && currentUser.leader) {
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
    if (playerIdToScore) {
      const initialScore: Record<string, number> = {};

      categories.forEach((category: string) => {
        const similar = similarityCheck(category, playerIdToScore);

        if (similar) {
          initialScore[category] = 5;
        } else {
          initialScore[category] = 0;
        }
      });

      setCurrentScore(initialScore);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [playerIdToScore, responseList]);

  useEffect(() => {
    if (Object.keys(currentScore).length) {
      setGameState({
        type: "SCORES",
        value: {
          round: props.context.round,
          scores: currentScore,
          userId: playerIdToScore,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [currentScore]);

  return (
    <div className={styles.container}>
      <h1>Time to score!</h1>
      <div className={styles.legend}>
        <div className={styles.yellowBox} />
        <span>- means duplicate answer</span>
      </div>
      {responseList.map(({ user, responses }, userIndex) => {
        const isScoring = user.id === playerIdToScore;

        return (
          <>
            <div key={`${user.id}}-${userIndex}`} className={styles.card}>
              <h2>
                {isScoring ? (
                  <span>
                    You&apos;re scoring for <span>{user.name}</span>
                  </span>
                ) : currentUser.id === user.id ? (
                  "Your responses"
                ) : (
                  `${user.name}'s responses`
                )}
              </h2>
              <div className={styles.scoreLayout}>
                {categories &&
                  categories.map((category: any, index: number) => {
                    const similar = similarityCheck(category, user.id);
                    const response = responses?.[category];

                    return (
                      <div
                        key={`${user.id}-${category}-${index}`}
                        className={styles.scoreListItem}
                      >
                        <div
                          className={
                            similar ? styles.scoreListItemHighlight : ""
                          }
                        >
                          {category}: {response || "-"}
                        </div>
                        {response && isScoring && (
                          <NumberInput
                            category={category}
                            currentScore={currentScore}
                            setCurrentScore={setCurrentScore}
                            value={similar ? 5 : 0}
                          />
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
            {userIndex === 0 && (
              <>
                <div className={styles.buttonWrapper}>
                  <button onClick={() => props.send("NEXT")}>Next Round</button>
                </div>
                {responseList.length > 1 && <h3>Other responses</h3>}
              </>
            )}
          </>
        );
      })}
    </div>
  );
};
