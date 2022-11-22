import { Player } from "../../app.types";
import styles from "./user-list.module.css";

interface PlayerWithScore extends Player {
  ready?: boolean;
  score?: number;
}

interface UserListProps {
  players: PlayerWithScore[];
}

export const UserList: React.FC<UserListProps> = ({
  players,
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
            {player.score !== undefined && <p>{player.score}</p>}
            {player.ready && <span>✅</span>}
          </div>
        ))}
    </div>
  );
};
