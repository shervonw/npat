import React from "react";
import { useUsers } from "../../context";
import { useReducerContext } from "../../context/game.context";

export const WaitingRoom: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  const [state] = useReducerContext();
  const [users] = useUsers();

  const { roomCode, user } = state;

  return (
    <div>
      <p>Waiting For Players</p>

      <div>
        <p>Copy room code: {roomCode}</p>
      </div>

      {users.map((user, index) => (
        <div key={index}>
          <h4>{(user.name)}</h4>
        </div>
      ))}

      {user?.is_leader && (<button onClick={() => props.send("READY")}>
        Ready
      </button>)}
    </div>
  );
}