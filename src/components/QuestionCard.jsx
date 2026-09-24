const letters = ["A", "B", "C", "D"];
export default function QuestionCard({
  question,
  index,
  score,
  lives,
  selected,
  onAnswer,
  answered,
}) {
  return (
    <section className="card question-card">
      <div className="stats">
        <span>Question {index + 1} / 10</span>
        <span>⚔ Score {score}</span>
        <span>♥ {lives} lives</span>
      </div>
      <h2>{question.question}</h2>
      <div className="answers">
        {question.options.map((o, i) => {
          let c = "";
          if (answered && i === question.correctAnswer) c = "correct";
          else if (answered && i === selected) c = "wrong";
          return (
            <button
              disabled={answered}
              className={c}
              onClick={() => onAnswer(i)}
            >
              <b>{letters[i]}</b>
              {o}
            </button>
          );
        })}
      </div>
      {answered && (
        <p
          className={
            selected === question.correctAnswer
              ? "feedback good"
              : "feedback bad"
          }
        >
          {selected === question.correctAnswer
            ? "Correct! The King advances."
            : "Not quite — the enemy steals a life."}
        </p>
      )}
    </section>
  );
}
