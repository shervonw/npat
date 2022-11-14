import { RealtimePresenceState } from "@supabase/supabase-js";
import { pick } from "ramda";
import { useState } from "react";
import { useAsync } from "react-use";
import { StateComponentType } from "../../app.types";
import { useDelay } from "../../hooks/delay.hook";
import { useUserChannel } from "../../user-channel.hook";
import styles from "./score.module.css";

export const Score: StateComponentType = ({ context, send }) => {
  const [presenceState, setPresenceState] = useState<RealtimePresenceState>();
  const { userChannel } = useUserChannel({
    context,
    send,
    onPresenceStateSynced: setPresenceState,
  });

  const delay = useDelay();

  useAsync(async () => {
    if (userChannel) {
      await delay();
      await userChannel.track(pick(["responses", "scores"], context.gameState));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userChannel]);

  console.log({presenceState})

  return (
    <div className={styles.container}>
      <h1>Time to score!</h1>
      <div className={styles.legend}>
        <div className={styles.yellowBox} />
        <span>- means duplicate answer</span>
      </div>
      {/* {responseList.map(({ user, responses }, userIndex) => {
        const isScoring = user.id === playerIdToScore;

        return (
          <>
            <div key={userIndex} className={styles.card}>
              <h2>
                {isScoring ? (
                  <span>
                    You&apos;re scoring for <span>{user.name}</span>
                  </span>
                ) : currentUser.id === user.id ? (
                  "Your response"
                ) : (
                  `${user.name}'s response`
                )}
              </h2>
              <div className={styles.scoreLayout}>
                {categories &&
                  categories.map((category: any) => {
                    const similar = similarityCheck(category, user.id);
                    const response = responses?.[category];
                    const key = `${user.id}-${category}`;
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
                              currentScore={currentScore}
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
                  <button onClick={transitionToNext}>Next Round</button>
                </div>
                {responseList.length > 1 && <h3>Other responses</h3>}
              </>
            )}
          </>
        );
      })} */}
    </div>
  );
};

// import { RealtimeChannel } from "@supabase/supabase-js";
// import { has, isEmpty } from "ramda";
// import React, { useCallback, useEffect, useMemo, useState } from "react";
// import { useAsync, useMount } from "react-use";
// import { useGameState, useUserState } from "../../context";
// import { useCreateChannel } from "../../hooks/create-channel.hook";
// import { useDelay } from "../../hooks/delay.hook";
// import { generateScoringPartners } from "../../utils";
// import { NumberInput } from "./number-input";
// import styles from "./score.module.css";
// import { transformReponses } from "./score.utils";

// export const Score: React.FC<{
//   context: any;
//   send: (event: any) => void;
// }> = (props) => {
//   const [channel, setChannel] = useState<RealtimeChannel>();
//   const [currentScore, setCurrentScore] = useState({});
//   const [playerIdToScore, setPlayerIdToScore] = useState("");
//   const [isScorePartnersGenerating, setIsScorePartnersGenerating] =
//     useState(true);
//   const { createPresenceChannel } = useCreateChannel();
//   const [gameState, setGameState] = useGameState();
//   const [userState] = useUserState();
//   const delay = useDelay();

//   const { allResponses, categories, scoringPartners } = gameState;
//   const { user: currentUser, users } = userState;

//   const responseList = useMemo(
//     () =>
//       transformReponses(
//         allResponses,
//         props.context.round,
//         playerIdToScore,
//         users
//       ),
//     [allResponses, playerIdToScore, props.context.round, users]
//   );

//   const similarityCheck = useCallback(
//     (category: string, currentUserId: string) => {
//       const { responses: currentResponses = {} } =
//         responseList.find(({ user }) => user.id === currentUserId) || {};

//       const currentUserResponse = currentResponses?.[category]
//         ? currentResponses[category].toLowerCase().trim()
//         : null;

//       return responseList
//         .filter(({ user }) => user.id !== currentUserId)
//         .some(({ responses = {} } = {}) => {
//           const otherResponse = responses?.[category]
//             ? responses[category].toLowerCase().trim()
//             : null;

//           return (
//             currentUserResponse &&
//             otherResponse &&
//             currentUserResponse === otherResponse
//           );
//         });
//     },
//     [responseList]
//   );

//   useMount(() => {
//     const newChannel = createPresenceChannel("scoringPartners");

//     setChannel(newChannel);

//     newChannel.on("presence", { event: "sync" }, () => {
//       const presenceState = newChannel.presenceState();

//       if (presenceState?.scoringPartners?.[0]) {
//         const scoringPartners = presenceState.scoringPartners[0];

//         setGameState({ type: "SCORING_PARTNERS", value: scoringPartners });
//         setPlayerIdToScore(scoringPartners[currentUser.id])
//       }
//     });

//     newChannel.on("broadcast", { event: "start" }, () => {
//       props.send("NEXT");
//     });

//     newChannel.subscribe();
//   });

//   useAsync(async () => {
//     if (channel && currentUser.leader) {
//       const scoringPartners: Record<string, string> = generateScoringPartners(
//         users.map((user: any) => user.id)
//       );

//       setGameState({ type: "SCORING_PARTNERS", value: scoringPartners });

//       await delay();

//       channel.track(scoringPartners);

//       setPlayerIdToScore(scoringPartners[currentUser.id])
//     }
//     // eslint-disable-next-line react-hooks/exhaustive-deps
//   }, [channel, isScorePartnersGenerating]);

//   useEffect(() => {
//     if (
//       playerIdToScore &&
//       has(playerIdToScore, allResponses) &&
//       isEmpty(currentScore)
//     ) {
//       const initialScore: Record<string, number> = {};

//       categories.forEach((category: string) => {
//         const similar = similarityCheck(category, playerIdToScore);

//         if (similar) {
//           initialScore[category] = 5;
//         } else {
//           initialScore[category] = 0;
//         }
//       });

//       setCurrentScore(initialScore);
//     }
//   }, [
//     allResponses,
//     categories,
//     currentScore,
//     playerIdToScore,
//     similarityCheck,
//   ]);

//   const transitionToNext = useCallback(() => {
//     setGameState({
//       type: "SCORES",
//       value: {
//         round: props.context.round,
//         scores: currentScore,
//         userId: playerIdToScore,
//       },
//     });

//     props.send("NEXT");
//   }, [currentScore, playerIdToScore, props, setGameState]);

//   if (isEmpty(currentScore) || !playerIdToScore) {
//     return (
//       <div className={styles.loading}>
//         <h3>Getting responses...</h3>
//       </div>
//     );
//   }

//   return (
//     <div className={styles.container}>
//       <h1>Time to score!</h1>
//       <div className={styles.legend}>
//         <div className={styles.yellowBox} />
//         <span>- means duplicate answer</span>
//       </div>
//       {responseList.map(({ user, responses }, userIndex) => {
//         const isScoring = user.id === playerIdToScore;

//         return (
//           <>
//             <div key={userIndex} className={styles.card}>
//               <h2>
//                 {isScoring ? (
//                   <span>
//                     You&apos;re scoring for <span>{user.name}</span>
//                   </span>
//                 ) : currentUser.id === user.id ? (
//                   "Your response"
//                 ) : (
//                   `${user.name}'s response`
//                 )}
//               </h2>
//               <div className={styles.scoreLayout}>
//                 {categories &&
//                   categories.map((category: any) => {
//                     const similar = similarityCheck(category, user.id);
//                     const response = responses?.[category];
//                     const key = `${user.id}-${category}`;
//                     const similarStyle = similar
//                       ? styles.scoreListItemHighlight
//                       : "";

//                     return (
//                       <div key={key} className={styles.scoreListItem}>
//                         <p className={similarStyle}>
//                           {category}: {response || "-"}
//                         </p>
//                         {response && isScoring && (
//                           <div>
//                             <NumberInput
//                               category={category}
//                               currentScore={currentScore}
//                               setCurrentScore={setCurrentScore}
//                               value={similar ? 5 : 0}
//                             />
//                           </div>
//                         )}
//                       </div>
//                     );
//                   })}
//               </div>
//             </div>
//             {userIndex === 0 && (
//               <>
//                 <div className={styles.buttonWrapper}>
//                   <button onClick={transitionToNext}>Next Round</button>
//                 </div>
//                 {responseList.length > 1 && <h3>Other responses</h3>}
//               </>
//             )}
//           </>
//         );
//       })}
//     </div>
//   );
// };
