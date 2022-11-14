import { pick } from "ramda";
import { useEffect } from "react";
import { useAsync } from "react-use";
import { ChannelSubscribeStatus, StateComponentType } from "../../app.types";
import { useGameChannel } from "../../game-channel.hook";
import { useDelay } from "../../hooks/delay.hook";

export const Check: StateComponentType = ({ context, send }) => {
  const { gameChannel, subscribeStatus } = useGameChannel({ context, send });
  const delay = useDelay();

  useAsync(async () => {
    await delay(3000);

    if (
      gameChannel &&
      context.leader &&
      subscribeStatus === ChannelSubscribeStatus.SUBSCRIBED
    ) {
      await gameChannel
        .send({
          type: "broadcast",
          event: "start-game",
          payload: {
            userId: context.userId,
            gameState: pick(
              [
                "categories",
                "currentLetter",
                "maxRounds",
                "possibleAlphabet",
                "scoringPartners",
              ],
              context.gameState
            ),
          },
        })
        
        send({ type: "play" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gameChannel, subscribeStatus]);

  return <div>Loading...</div>;
};

