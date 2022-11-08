import React from "react"

export const Scoreboard: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  return (
    <div>
      Scoreboard

      <button onClick={() => props.send("RESTART")}>
        New Game
      </button>
    </div>
  );
}