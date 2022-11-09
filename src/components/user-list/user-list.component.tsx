import styles from "./user-list.module.css";

export const UserList = ({
  users,
}: {
  users: {
    id: string;
    emoji: string;
    name: string;
    score?: number;
    leader: boolean;
  }[];
}) => {
  return (
    <div className={styles.userList}>
      {users &&
        users.map((user) => (
          <div key={user.id}>
            <div className={styles.emoji}>{user.emoji}</div>
            <p>
              {user.leader && <span>👑</span>} {user.name}
            </p>
            {user.score !== undefined && <p className={styles.score}>{user.score}</p>}
          </div>
        ))}
    </div>
  );
};
