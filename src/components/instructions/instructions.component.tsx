import { StateComponentType } from "../../app.types";

export const Instructions: StateComponentType = (props) => {
  return (
    <div>
      <h2>How To Play</h2>
      <p>
        The game is simple. The game creator sets the number of rounds and
        chooses the word categories. The game is player over a couple of rounds.
        At the beginning of every round, players get a new alphabet. Your job is
        to think of words that begin with that letter and fit the categories in
        the game. Each game round is timed at 60 seconds, but the game also end
        as soon as the first person submits their response. Think fast!
      </p>

      <h2>Creating A Game and Game Setup</h2>
      <p>
        Head on over to the &quot;Create New Game&quot; section on the previous
        page to create a new game. You will be able to specify the number of
        rounds you would like to play as well as any additional categories you
        would want to include besides, &quot;Name&quot;, &quot;Place&quot;,
        &quot;Animal&quot; and &quot;Thing&quot;. You can also define
        &quot;scoring mechanics&quot;. Once you have created the game, you will get a
        &quot;Game Code&quot;. Create the room and send the Game Code to your
        friends who will be able to use it join the room. Once your friends have
        joined, the creator will be able to start the game!
      </p>

      <h2>Scoring Rules</h2>
      <p>
        Scoring Rules are simple: +10 points for each unique answer +5 points
        for each non-unique answer +0 points for no answer
      </p>

      <button onClick={() => props.send({ type: "back" })}>Back</button>
    </div>
  );
};
