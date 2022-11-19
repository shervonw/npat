import { useCallback, useState } from "react";
import styles from "./number-input.module.css"
import { NumberInputProps } from "./number-input.types";

export const NumberInput: React.FC<NumberInputProps> = ({
  category,
  currentScore,
  setCurrentScore,
  value,
}) => {
  const [numberValue, setNumberValue] = useState(value);
  const onMinus = useCallback(() => {
    setCurrentScore(
      Object.assign({}, currentScore, { [category]: numberValue - 5 })
    );
    if (!(numberValue <= 0)) setNumberValue(numberValue - 5);
  }, [category, currentScore, numberValue, setCurrentScore]);

  const onPlus = useCallback( () => { 
    setCurrentScore(
      Object.assign({}, currentScore, { [category]: numberValue + 5 })
    );
    if (!(numberValue >= 10)) setNumberValue(numberValue + 5);
  }, [category, currentScore, numberValue, setCurrentScore]);

  return (
    <div className={styles.container}>
      <button className={styles.button} disabled={numberValue === 0} onClick={onMinus}>
        -
      </button>
      <span>{numberValue}</span>
      <button className={styles.button} disabled={numberValue === 10} onClick={onPlus}>
        +
      </button>
    </div>
  );
};