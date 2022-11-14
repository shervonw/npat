import { StateComponentType } from "../../app.types";

export const ScoreReview: StateComponentType = ({ context, send }) => {

  return <div />
}

// import { RealtimeChannel } from "@supabase/supabase-js";
// import { equals } from "ramda";
// import React, { useCallback, useMemo, useState } from "react";
// import { useEffectOnce, useAsync, useUnmount } from "react-use";
// import { StateComponentType } from "../../app.types";
// import { useGameState, useUserState } from "../../context";
// import { useCreateChannel } from "../../hooks/create-channel.hook";
// import { useDelay } from "../../hooks/delay.hook";
// import { useGetLetter } from "../../hooks/get-letter.hook";
// import { calculateTotalScore, getUserIds, sortByScore } from "../../utils";
// import { UserList } from "../user-list";
// import styles from "./score-review.module.css";

// export const ScoreReview: StateComponentType = ({ context, send }) => {
//   const [channel, setChannel] = useState<RealtimeChannel>();
//   const [usersInWaitingRoom, setUsersInWaitingRoom] = useState<any[]>([]);
//   const { createPresenceChannel } = useCreateChannel();
//   const delay = useDelay();
//   const getLetter = useGetLetter();
//   const [gameState] = useGameState();
//   const [userState] = useUserState();

//   const { user, users } = userState;

//   const usersWithScore = useMemo(
//     () =>
//       sortByScore(
//         usersInWaitingRoom.map((user) => ({
//           ...user,
//           score: calculateTotalScore(user, gameState.allScores),
//         }))
//       ),
//     [gameState.allScores, usersInWaitingRoom]
//   );

//   const canStartGame = useMemo(() => {
//     const userIdsInWaitingRoom = getUserIds(usersInWaitingRoom);
//     const userIdsInGame = getUserIds(users);

//     return equals(userIdsInWaitingRoom, userIdsInGame);
//   }, [users, usersInWaitingRoom]);

//   useAsync(async () => {
//     await delay()

//     const newChannel = createPresenceChannel("waiting");

//     setChannel(newChannel);

//     newChannel.on("presence", { event: "join" }, (presence) => {
//       setUsersInWaitingRoom([
//         ...presence.currentPresences,
//         ...presence.newPresences,
//       ]);
//     });

//     newChannel.on("presence", { event: "leave" }, (presence) => {
//       setUsersInWaitingRoom(presence.currentPresences);
//     });

//     newChannel.on("broadcast", { event: "start" }, () => {
//       props.send("NEXT");
//     });

//     newChannel.subscribe().track(user);
//   });

//   useUnmount(() =>{
//     if (channel) {
//       channel.untrack();
//       channel.unsubscribe();
//     }
//   })

//   const startGame = useCallback(async () => {
//     getLetter();

//     await delay();

//     props.send("NEXT");

//     channel?.send({
//       type: "broadcast",
//       event: "start",
//       payload: true,
//     });
//   }, [channel, delay, getLetter, props]);

//   return (
//     <div className={styles.container}>
//       <h2>Waiting for players to finish scoring</h2>
//       <p>Here are the current scores:</p>
//       <UserList users={usersWithScore} />

//       {canStartGame && user?.leader && (
//         <div className={styles.buttonWrapper}>
//           <button onClick={startGame}>Ready</button>
//         </div>
//       )}
//     </div>
//   );
// };
