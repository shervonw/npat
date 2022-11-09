import styles from "./home.module.css";

const BUTTON_CONFIG = [
  {
    label: "Instructions",
    type: "INSTRUCTIONS",
  },
  {
    label: "Join",
    type: "JOIN",
  },
  {
    label: "Create Game",
    type: "CREATE",
  },
];

export const Home = ({ send }: { send: any }) => {
  return (
    <div className={styles.container}>
      <h1 className={styles.heading}>Name, Place, Animal, Thing</h1>
      <div className={styles.buttonList}>
        {BUTTON_CONFIG.map((buttonConfig, index) => (
          <button key={index} onClick={() => send({ type: buttonConfig.type })}>
            {buttonConfig.label}
          </button>
        ))}
      </div>
    </div>
  );
};
