import React from "react"

export const Game: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  console.log({ round: props.context.round })

  return (
    <div>
      Game
      <button onClick={() => props.send("NEXT")}>
        Next Round
      </button>
    </div>
  );
}