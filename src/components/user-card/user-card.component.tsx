import { Player } from "../../app.types";
import styles from "./user-card.module.css";

interface PlayerWithScore extends Player {
  ready?: boolean;
  score?: number;
}

interface UserCardProps {
  player: PlayerWithScore;
}

export const UserCard: React.FC<UserCardProps> = ({ player }) => {
  return (
    <div className={styles.userCard}>
      <div className={styles.emoji}>{player.emoji}</div>
      <p>
        {player.leader && <span>👑</span>} {player.name}
      </p>
      {player.score !== undefined && <p>{player.score}</p>}
      {player.ready && <span>✅</span>}
    </div>
  );
};
