import React from "react";
import { useGetUsersInRoom } from "../../hooks/waiting-room/get-users-in-room.hook";
import { useReducerContext } from "../../context/game.context";

export const InGameWaitingRoom: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [state] = useReducerContext();
  
  const { roomCode, user } = state;

  return (
    <div>
      Waiting For Players

      {/* {users.map((user, index) => (
        <div key={index}>
          <h4 style={{color: "#fff"}}>{user.name}</h4>
        </div>
      ))} */}

      <button onClick={() => props.send("NEXT")}>
        Ready
      </button>
    </div>
  );
}