import { StateComponentType } from "../../app.types";

export const Instructions: StateComponentType = (props) => {
  return (
    <div>
      <h2>How To Play</h2>
      <p>
        The game creator will set the number of rounds and chooses the
        categories.
      </p>
      <p>
        At the start of each round, a unique letter from the alphabet will be
        shown.
      </p>
      <p>
        Now, you have think of a word for each category, starting with that
        unique letter.
      </p>
      <p>Each round last 60 seconds, but there&apos;s a twist!</p>
      <p>
        The round can also end as soon as the first person submits their
        responses.
      </p>

      <h2>Creating a Game</h2>
      <p>
        On the home page, clicking &quot;Create Game&quot; the button will take
        you to the game setup page. There, you can set the number of rounds and
        the categories.
      </p>
      <p>When you&apos;re finished click &quot;Create Game&quot;.</p>
      <p>
        You will be taken to the room lobby where you will be able to copy a
        link with the room code that can be shared with your friends. Once your
        friends have joined, as the creator, you will be able to start the game!
      </p>

      <h2>Scoring</h2>
      <p>
        Scoring is simple: +10 points for each unique answer; +5 points for
        common answers; +0 points for no answer or incomplete answer (incomplete
        answers may be debated).
      </p>

      <button onClick={() => props.send({ type: "back" })}>Back</button>
    </div>
  );
};
