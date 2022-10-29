import React from "react"

export const Instructions: React.FC<{
  context: any;
  send: (event: any) => void;
}> = (props) => {
  return (
    <div>
      Instructions for the game

      <button onClick={() => props.send("BACK")}>
        Back
      </button>
    </div>
  );
}