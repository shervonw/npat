interface CardHeaderProps {
  isCurrentUser: boolean;
  isScoring: boolean;
  name: string;
}

export const ScoreCardHeader: React.FC<CardHeaderProps> = ({
  isCurrentUser,
  isScoring,
  name,
}) => {
  return (
    <h2>
      {isScoring ? (
        <>
          You&apos;re scoring for <span>{name}</span>
        </>
      ) : isCurrentUser ? (
        "Your response"
      ) : (
        `${name}'s response`
      )}
    </h2>
  );
};
