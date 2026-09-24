
import { useState } from "react";

export default function LearnPage() {
  const [topic, setTopic] = useState("");
  const [learning, setLearning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const generateLearning = async () => {
    if (!topic.trim()) return;

    setLoading(true);
    setError("");

    try {
      const response = await fetch("http://localhost:5000/api/learn", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          topic: topic.trim(),
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to generate learning content");
      }

      const data = await response.json();
      setLearning(data);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="learn-page">
      {/* Topic Search */}
      <section className="learn-hero">
        <p className="eyebrow">KNOWLEDGE CHAMBER</p>

        <h1>What do you want to learn?</h1>

        <p className="muted">
          Enter any topic and build your own learning quest.
        </p>

        <div className="topic-search">
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                generateLearning();
              }
            }}
            placeholder="e.g. JavaScript Promises"
            maxLength={140}
          />

          <button
            onClick={generateLearning}
            disabled={loading || !topic.trim()}
          >
            {loading ? "Preparing..." : "Start Learning"}
          </button>
        </div>

        {error && <p className="error-message">{error}</p>}
      </section>

      {/* Loading */}
      {loading && (
        <section className="learning-loading">
          <div className="loader" />
          <h2>Preparing your learning chamber...</h2>
          <p>
            Creating explanations, learning cards, questions and a quiz.
          </p>
        </section>
      )}

      {/* Generated Learning Content */}
      {learning && !loading && (
        <section className="learning-room">

          {/* Summary */}
          <article className="learning-card summary-card">
            <p className="eyebrow">QUICK SUMMARY</p>
            <h2>{learning.title}</h2>

            <p>{learning.summary}</p>
          </article>

          {/* Key Points */}
          <article className="learning-card">
            <p className="eyebrow">KEY KNOWLEDGE</p>
            <h2>Things You Should Know</h2>

            <div className="key-points">
              {learning.keyPoints?.map((point, index) => (
                <div className="key-point" key={index}>
                  <span>{index + 1}</span>
                  <p>{point}</p>
                </div>
              ))}
            </div>
          </article>

          {/* Learning Cards */}
          <article className="learning-card">
            <p className="eyebrow">LEARNING CARDS</p>
            <h2>Master the Concepts</h2>

            <div className="learning-cards">
              {learning.cards?.map((card, index) => (
                <div className="study-card" key={index}>
                  <span className="card-number">
                    {String(index + 1).padStart(2, "0")}
                  </span>

                  <h3>{card.title}</h3>

                  <p>{card.content}</p>

                  {card.example && (
                    <div className="example-box">
                      <strong>Example</strong>
                      <p>{card.example}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </article>

          {/* YouTube */}
          {learning.youtubeVideoId && (
            <article className="learning-card video-card">
              <p className="eyebrow">WATCH & LEARN</p>
              <h2>{learning.youtubeTitle}</h2>

              <div className="video-wrapper">
                <iframe
                  src={`https://www.youtube.com/embed/${learning.youtubeVideoId}`}
                  title={learning.youtubeTitle}
                  allowFullScreen
                />
              </div>
            </article>
          )}

          {/* Q&A */}
          <article className="learning-card">
            <p className="eyebrow">QUESTIONS & ANSWERS</p>
            <h2>Check Your Understanding</h2>

            <div className="qa-list">
              {learning.questions?.map((item, index) => (
                <details className="qa-item" key={index}>
                  <summary>
                    <span>Q{index + 1}</span>
                    {item.question}
                  </summary>

                  <div className="answer">
                    <strong>Answer</strong>
                    <p>{item.answer}</p>
                  </div>
                </details>
              ))}
            </div>
          </article>

          {/* Quiz */}
          <article className="learning-card quiz-card">
            <p className="eyebrow">FINAL CHALLENGE</p>
            <h2>Test Yourself</h2>

            {learning.quiz?.map((question, index) => (
              <div className="quiz-question" key={index}>
                <h3>
                  {index + 1}. {question.question}
                </h3>

                <div className="quiz-options">
                  {question.options?.map((option, optionIndex) => (
                    <button
                      className="quiz-option"
                      key={optionIndex}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
            ))}
          </article>

        </section>
      )}
    </main>
  );
}