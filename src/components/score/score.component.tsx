import { isEmpty } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useAppContext } from "../../app.context";
import { StateComponentType } from "../../app.types";
import { generateScoringPartners } from "../../app.utils";
import { useDelay } from "../../hooks/delay.hook";
import { useUsersChannel } from "../../users-channel.hook";
import { NumberInput } from "./number-input";
import styles from "./score.module.css";
import { transformReponses } from "./score.utils";

export const Score: StateComponentType = ({ context, send }) => {
  const [appContext] = useAppContext();
  const { round, userId = "" } = context;
  const { users } = useUsersChannel({
    context,
    send,
  });
  const delay = useDelay();

  const { categories } = appContext;

  const scoringPartners = useMemo(() => {
    return generateScoringPartners(users.map(({ userId }) => userId));
  }, [users]);

  const [currentScore, setCurrentScore] = useState<Record<string, number>>();

  const playerIdToScore = useMemo(() => {
    return scoringPartners?.[userId];
  }, [scoringPartners, userId]);

  const yourScores = useMemo(() => {
    const yourScorerId = Object.entries(scoringPartners).find(
      ([, uid2]) => uid2 === context.userId
    )?.[0];

    return users.find(({ userId }) => userId === yourScorerId)?.scores?.[round] ?? {};
  }, [context.userId, round, scoringPartners, users]);

  const responseList = useMemo(
    () => transformReponses(users, context, playerIdToScore),
    [context, playerIdToScore, users]
  );

  const similarityCheck = useCallback(
    (category: string, currentUserId: string) => {
      const { responses: currentResponses = {} } =
        responseList.find(({ user }) => user.userId === currentUserId) || {};

      const currentUserResponse = currentResponses?.[category]
        ? currentResponses[category].toLowerCase().trim()
        : null;

      return responseList
        .filter(({ user }) => user.userId !== currentUserId)
        .some(({ responses = {} } = {}) => {
          const otherResponse = responses?.[category]
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

  useEffect(() => {
    if (!isEmpty(currentScore)) {
      send({ type: "updateScores", value: currentScore });
    }
  }, [currentScore, send]);

  const onReadyClick = useCallback(() => {
    send({
      type: "submitScores",
      value: Object.values<number>(yourScores).reduce(
        (total, score) => (total += score),
        0
      ),
    });
  }, [send, yourScores]);

  const { loading } = useAsync(async() => {
    await delay(1000)
  })

  if (loading) {
    return <div>Submit Responses...</div>
  }

  return (
    <div className={styles.container}>
      <h1>Time to score!</h1>
      <div className={styles.legend}>
        <div className={styles.yellowBox} />
        <span>- means duplicate answer</span>
      </div>
      {responseList.map(({ user, responses }, userIndex) => {
        const isScoring = user.userId === playerIdToScore;

        return (
          <>
            <div key={userIndex} className={styles.card}>
              <h2>
                {isScoring ? (
                  <span>
                    You&apos;re scoring for <span>{user.name}</span>
                  </span>
                ) : context.userId === user.userId ? (
                  "Your response"
                ) : (
                  `${user.name}'s response`
                )}
              </h2>
              <div className={styles.scoreLayout}>
                {categories &&
                  categories.map((category: any) => {
                    const similar = similarityCheck(category, user.userId);
                    const response = responses?.[category];
                    const key = `${user.userId}-${category}`;
                    const similarStyle = similar
                      ? styles.scoreListItemHighlight
                      : "";

                    return (
                      <div key={key} className={styles.scoreListItem}>
                        <p className={similarStyle}>
                          {category}: {response || "-"}
                        </p>
                        {response && isScoring && (
                          <div>
                            <NumberInput
                              category={category}
                              currentScore={currentScore || {}}
                              setCurrentScore={setCurrentScore}
                              value={similar ? 5 : 0}
                            />
                          </div>
                        )}
                      </div>
                    );
                  })}
              </div>
            </div>
            {userIndex === 0 && (
              <>
                <div className={styles.buttonWrapper}>
                  <button onClick={onReadyClick}>Ready</button>
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
