import { isEmpty } from "ramda";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useAsync } from "react-use";
import { useAppContext } from "../../app.context";
import { StateComponentType } from "../../app.types";
import { generateScoringPartners } from "../../app.utils";
import { useDelay } from "../../hooks/delay.hook";
import { ScoreCardBody } from "./card-body";
import { ScoreCardHeader } from "./card-header";
import styles from "./score.module.css";
import { transformReponses } from "./score.utils";

export const Score: StateComponentType = ({
  channel,
  context,
  players,
  send,
}) => {
  const [appContext, setAppContext] = useAppContext();
  const { round, userId = "" } = context;
  const delay = useDelay();

  const { allResponses, categories = [] } = appContext;

  const userResponseForRound = useMemo(() => {
    return allResponses[round]?.[userId];
  }, [allResponses, round, userId]);

  const { loading } = useAsync(async () => {
    await delay(1000);
  }, []);

  useEffect(() => {
    if (!loading && channel && userResponseForRound) {
      channel.send({
        type: "broadcast",
        event: "responses",
        payload: {
          userId,
          round,
          values: userResponseForRound,
        },
      });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [channel, loading, userResponseForRound]);

  const scoringPartners = useMemo(() => {
    return generateScoringPartners(
      players.map((player) => player?.userId ?? "")
    );
  }, [players]);

  const [currentScore, setCurrentScore] = useState<Record<string, number>>({});

  const playerIdToScore = useMemo(() => {
    return scoringPartners?.[userId];
  }, [scoringPartners, userId]);

  const allResponsesForRound = useMemo(
    () => allResponses[context.round] ?? {},
    [allResponses, context.round]
  );

  const responseList = useMemo(() => {
    return transformReponses(allResponsesForRound, playerIdToScore, players);
  }, [allResponsesForRound, playerIdToScore, players]);

  const similarityCheck = useCallback(
    (userId: string) => (category: string) => {
      const currentUserResponse = allResponsesForRound?.[userId]?.[category];
      const currentUserResponseValue = currentUserResponse
        ? currentUserResponse.toLowerCase().trim()
        : null;

      return Object.entries(allResponsesForRound)
        .filter(([currentUserId]) => userId !== currentUserId)
        .some(([, responses]: [string, Record<string, string>]) => {
          const otherResponse = responses?.[category];
          const otherResponseValue = otherResponse
            ? otherResponse.toLowerCase().trim()
            : null;

          return (
            currentUserResponseValue &&
            otherResponseValue &&
            currentUserResponseValue === otherResponseValue
          );
        });
    },
    [allResponsesForRound]
  );

  useEffect(() => {
    const playerToScoreResponses = allResponsesForRound[playerIdToScore];

    if (isEmpty(currentScore) && playerToScoreResponses) {
      const initialScores = Object.entries(playerToScoreResponses).reduce((scores, [category]) => {
        const isSimilar = similarityCheck(playerIdToScore)(category);

        return {
          ...scores,
          [category]: isSimilar ? 5 : 0,
        }
      }, {});

      setCurrentScore(initialScores);
    }
  }, [allResponsesForRound, currentScore, playerIdToScore, similarityCheck]);

  const onReadyClick = useCallback(async () => {
    if (channel) {
      const totalScore = Object.values<number>(currentScore).reduce(
        (total, score) => (total += score),
        0
      );

      const payload = {
        round: context.round,
        score: totalScore,
        userId: playerIdToScore,
      }

      await channel.send({
        type: "broadcast",
        event: "score",
        payload,
      });

      setAppContext({
        type: "allScores",
        value: payload,
      });

      send({ type: "submitScores" });
    }
  }, [channel, context.round, currentScore, playerIdToScore, send, setAppContext]);

  if (loading) {
    return <div>Submit Responses...</div>;
  }

  return (
    <div className={styles.container}>
      <h1>Time to score!</h1>
      <div className={styles.legend}>
        <div className={styles.yellowBox} />
        <span>- means duplicate answer</span>
      </div>
      {responseList.map(({ user, responses }, userIndex) => {
        const currentUserId = user.userId ?? "";
        const isScoring = currentUserId === playerIdToScore;
        const similarCheckFn = similarityCheck(currentUserId);

        return (
          <>
            <div key={userIndex} className={styles.card}>
              <ScoreCardHeader
                isCurrentUser={context.userId === currentUserId}
                isScoring={isScoring}
                name={user.name || ""}
              />
              <div className={styles.scoreLayout}>
                {categories.map((category) => {
                  return (
                    <ScoreCardBody
                      key={`${currentUserId}-${category}`}
                      category={category}
                      currentScore={currentScore || {}}
                      isScoring={isScoring}
                      isSimilar={similarCheckFn(category)}
                      response={responses?.[category]}
                      setCurrentScore={setCurrentScore}
                    />
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
