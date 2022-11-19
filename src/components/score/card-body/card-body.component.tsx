import { NumberInput } from "../number-input";
import { NumberInputProps } from "../number-input/number-input.types";
import styles from "../score.module.css";

interface ScoreCardBodyProps extends Omit<NumberInputProps, "value"> {
  response: string;
  isScoring: boolean;
  isSimilar: boolean;
}

export const ScoreCardBody: React.FC<ScoreCardBodyProps> = ({
  category,
  currentScore,
  response,
  isScoring,
  isSimilar,
  setCurrentScore,
}) => {
  const similarStyle = isSimilar ? styles.scoreListItemHighlight : "";

  return (
    <div className={styles.scoreListItem}>
      <p className={similarStyle}>
        {category}: {response || "-"}
      </p>

      {isScoring && response && (
        <div>
          <NumberInput
            category={category}
            currentScore={currentScore || {}}
            setCurrentScore={setCurrentScore}
            value={currentScore?.[category] ?? 0}
          />
        </div>
      )}
    </div>
  );
};
