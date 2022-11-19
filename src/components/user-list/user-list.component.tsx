import { StateContext } from "../../app.types";
import styles from "./user-list.module.css";

export const UserList = ({
  players,
}: {
  players: StateContext[];
}) => {
  return (
    <div className={styles.userList}>
      {players &&
        players.map((player) => (
          <div key={player.userId}>
            <div className={styles.emoji}>{player.emoji}</div>
            <p>
              {player.leader && <span>👑</span>} {player.name}
            </p>
          </div>
        ))}
    </div>
  );
};
