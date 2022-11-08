import styles from "./user-list.module.css";

export const UserList = ({
  users,
}: {
  users: { emoji: string; name: string; leader: boolean }[];
}) => {
  return (
    <div className={styles.userList}>
      {users &&
        users.map((user, index: number) => (
          <div key={index}>
            <div className={styles.emoji}>{user.emoji}</div>
            <h4>
              {user.leader && <span>👑</span>} {user.name}
            </h4>
          </div>
        ))}
    </div>
  );
};
