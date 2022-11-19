export interface NumberInputProps {
  category: string;
  currentScore: Record<string, number>;
  setCurrentScore: (score: Record<string, number>) => void;
  value: number;
}