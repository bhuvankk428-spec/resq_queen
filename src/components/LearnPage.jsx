import { useState } from "react";

export default function LearnPage({
  home,
  startQuest,
}) {
  const [topic, setTopic] = useState("");
  const [learning, setLearning] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const [quizAnswers, setQuizAnswers] = useState({});
  const [showAnswers, setShowAnswers] = useState({});

  const generateLearning = async () => {
    const cleanTopic = topic.trim();

    if (!cleanTopic) {
      setError("Please enter a topic to learn.");
      return;
    }

    setLoading(true);
    setError("");
    setLearning(null);
    setQuizAnswers({});
    setShowAnswers({});

    try {
      const response = await fetch(
        "http://localhost:3001/api/learn",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            topic: cleanTopic,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(
          data.error ||
            "Failed to generate learning content."
        );
      }

      setLearning(data);
    } catch (err) {
      console.error("Learning error:", err);

      setError(
        err.message ||
          "Something went wrong while creating your lesson."
      );
    } finally {
      setLoading(false);
    }
  };

  const handleQuizAnswer = (
    questionIndex,
    option
  ) => {
    setQuizAnswers((previous) => ({
      ...previous,
      [questionIndex]: option,
    }));

    setShowAnswers((previous) => ({
      ...previous,
      [questionIndex]: true,
    }));
  };

  const isQuizCorrect = (
    questionIndex,
    option
  ) => {
    const question =
      learning?.quiz?.[questionIndex];

    return (
      question &&
      option === question.answer
    );
  };

  return (
    <main
      style={{
        minHeight: "100vh",
        width: "100%",
        boxSizing: "border-box",
        padding: "32px 20px 70px",
        background:
          "linear-gradient(135deg, #0d1b2a 0%, #16263d 48%, #0b1726 100%)",
        color: "#f8fafc",
        fontFamily:
          "Inter, system-ui, -apple-system, BlinkMacSystemFont, 'Segoe UI', sans-serif",
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: "1050px",
          margin: "0 auto",
        }}
      >

        {/* =================================================
            TOP NAVIGATION
        ================================================= */}

        <div
          style={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "28px",
            gap: "15px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={home}
            style={{
              border: "1px solid rgba(255,255,255,0.15)",
              background:
                "rgba(255,255,255,0.07)",
              color: "#f8fafc",
              borderRadius: "12px",
              padding: "10px 16px",
              cursor: "pointer",
              fontSize: "14px",
              fontWeight: "600",
              backdropFilter: "blur(10px)",
            }}
          >
            ← Back to Quest
          </button>

          <div
            style={{
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "2px",
              color: "#f4bd61",
            }}
          >
            KNOWLEDGE CHAMBER
          </div>
        </div>


        {/* =================================================
            HERO
        ================================================= */}

        <section
          style={{
            position: "relative",
            overflow: "hidden",
            borderRadius: "28px",
            padding: "45px 30px",
            marginBottom: "28px",
            textAlign: "center",
            background:
              "linear-gradient(145deg, rgba(42,60,84,0.95), rgba(20,35,55,0.98))",
            border:
              "1px solid rgba(255,255,255,0.12)",
            boxShadow:
              "0 25px 70px rgba(0,0,0,0.28)",
          }}
        >

          <div
            style={{
              position: "absolute",
              width: "220px",
              height: "220px",
              borderRadius: "50%",
              background:
                "rgba(244,189,97,0.08)",
              top: "-100px",
              right: "-70px",
              filter: "blur(5px)",
            }}
          />
<div
  style={{
    width: "70px",
    height: "70px",
    margin: "0 auto 12px",
    borderRadius: "16px",
    overflow: "hidden",
  }}
>
  <video
    src="/Sword.mp4"
    autoPlay
    loop
    muted
    playsInline
    style={{
      width: "100%",
      height: "100%",
      objectFit: "cover",
    }}
  />
</div>
          <p
            style={{
              margin: "0 0 10px",
              fontSize: "12px",
              fontWeight: "800",
              letterSpacing: "3px",
              color: "#f4bd61",
            }}
          >
            LEARN BEFORE YOU QUEST
          </p>

          <h1
            style={{
              margin: "0 auto 12px",
              fontFamily:
                "Georgia, 'Times New Roman', serif",
              fontSize:
                "clamp(32px, 5vw, 52px)",
              lineHeight: "1.05",
              color: "#fff",
              maxWidth: "750px",
            }}
          >
            What do you want to learn?
          </h1>

          <p
            style={{
              margin:
                "0 auto 28px",
              maxWidth: "650px",
              color: "#b9c7d8",
              lineHeight: "1.7",
              fontSize: "16px",
            }}
          >
            Enter any topic and your AI tutor
            will create a complete learning
            experience with explanations,
            examples, questions, a quiz and a
            useful video.
          </p>


          {/* TOPIC INPUT */}

          <div
            style={{
              display: "flex",
              maxWidth: "720px",
              margin: "0 auto",
              padding: "6px",
              gap: "8px",
              borderRadius: "16px",
              background:
                "rgba(0,0,0,0.2)",
              border:
                "1px solid rgba(255,255,255,0.12)",
            }}
          >

            <input
              value={topic}
              onChange={(e) =>
                setTopic(e.target.value)
              }
              onKeyDown={(e) => {
                if (e.key === "Enter") {
                  generateLearning();
                }
              }}
              placeholder="e.g. JavaScript Promises"
              maxLength={140}
              style={{
                flex: 1,
                minWidth: 0,
                border: "none",
                outline: "none",
                background: "transparent",
                color: "#fff",
                padding:
                  "14px 16px",
                fontSize: "15px",
              }}
            />

            <button
              onClick={generateLearning}
              disabled={
                loading ||
                !topic.trim()
              }
              style={{
                border: "none",
                borderRadius: "12px",
                padding:
                  "0 22px",
                minHeight: "48px",
                background:
                  loading ||
                  !topic.trim()
                    ? "#536174"
                    : "linear-gradient(135deg, #f4bd61, #d99a35)",
                color: "#111827",
                fontWeight: "800",
                fontSize: "14px",
                cursor:
                  loading ||
                  !topic.trim()
                    ? "not-allowed"
                    : "pointer",
                whiteSpace: "nowrap",
              }}
            >
              {loading
                ? "Preparing..."
                : "Start Learning"}
            </button>

          </div>

          {error && (
            <div
              style={{
                margin:
                  "18px auto 0",
                maxWidth: "720px",
                padding: "12px 15px",
                borderRadius: "10px",
                background:
                  "rgba(239,68,68,0.12)",
                border:
                  "1px solid rgba(239,68,68,0.25)",
                color: "#fca5a5",
                fontSize: "14px",
              }}
            >
              {error}
            </div>
          )}

        </section>


        {/* =================================================
            LOADING
        ================================================= */}

        {loading && (
          <section
            style={{
              textAlign: "center",
              padding: "50px 20px",
              borderRadius: "22px",
              background:
                "rgba(255,255,255,0.05)",
              border:
                "1px solid rgba(255,255,255,0.08)",
            }}
          >

            <div
              style={{
                width: "44px",
                height: "44px",
                margin: "0 auto 20px",
                border:
                  "4px solid rgba(255,255,255,0.15)",
                borderTopColor:
                  "#f4bd61",
                borderRadius: "50%",
                animation:
                  "learnSpin 0.9s linear infinite",
              }}
            />

            <h2
              style={{
                margin: "0 0 8px",
                fontSize: "22px",
              }}
            >
              Preparing your learning chamber...
            </h2>

            <p
              style={{
                margin: 0,
                color: "#9fb0c5",
              }}
            >
              Creating your summary, learning
              cards, questions, quiz and video.
            </p>

          </section>
        )}


        {/* =================================================
            GENERATED CONTENT
        ================================================= */}

        {learning && !loading && (
          <section
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "22px",
            }}
          >

            {/* =================================================
                SUMMARY
            ================================================= */}

            <article
              style={{
                ...cardStyle,
                padding: "30px",
              }}
            >

              <SectionLabel>
                QUICK SUMMARY
              </SectionLabel>

              <h2
                style={{
                  margin:
                    "8px 0 14px",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize: "30px",
                  color: "#fff",
                }}
              >
                {learning.title}
              </h2>

              <p
                style={{
                  margin: 0,
                  color: "#c6d2df",
                  fontSize: "16px",
                  lineHeight: "1.8",
                }}
              >
                {learning.summary}
              </p>

            </article>


            {/* =================================================
                KEY POINTS
            ================================================= */}

            <article
              style={{
                ...cardStyle,
                padding: "30px",
              }}
            >

              <SectionLabel>
                KEY KNOWLEDGE
              </SectionLabel>

              <h2 style={sectionHeadingStyle}>
                Things You Should Know
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(250px, 1fr))",
                  gap: "12px",
                  marginTop: "20px",
                }}
              >

                {learning.keyPoints?.map(
                  (point, index) => (
                    <div
                      key={index}
                      style={{
                        display: "flex",
                        alignItems:
                          "flex-start",
                        gap: "13px",
                        padding: "16px",
                        borderRadius: "14px",
                        background:
                          "rgba(255,255,255,0.045)",
                        border:
                          "1px solid rgba(255,255,255,0.07)",
                      }}
                    >

                      <span
                        style={{
                          flexShrink: 0,
                          width: "30px",
                          height: "30px",
                          display: "flex",
                          alignItems:
                            "center",
                          justifyContent:
                            "center",
                          borderRadius: "50%",
                          background:
                            "rgba(244,189,97,0.14)",
                          color: "#f4bd61",
                          fontSize: "13px",
                          fontWeight: "800",
                        }}
                      >
                        {index + 1}
                      </span>

                      <p
                        style={{
                          margin: 0,
                          color: "#c8d3df",
                          lineHeight: "1.6",
                          fontSize: "14px",
                        }}
                      >
                        {point}
                      </p>

                    </div>
                  )
                )}

              </div>

            </article>


            {/* =================================================
                LEARNING CARDS
            ================================================= */}

            <article
              style={{
                ...cardStyle,
                padding: "30px",
              }}
            >

              <SectionLabel>
                LEARNING CARDS
              </SectionLabel>

              <h2 style={sectionHeadingStyle}>
                Master the Concepts
              </h2>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns:
                    "repeat(auto-fit, minmax(280px, 1fr))",
                  gap: "16px",
                  marginTop: "20px",
                }}
              >

                {learning.cards?.map(
                  (card, index) => (
                    <div
                      key={index}
                      style={{
                        position:
                          "relative",
                        padding: "23px",
                        borderRadius: "18px",
                        background:
                          "linear-gradient(145deg, rgba(255,255,255,0.07), rgba(255,255,255,0.035))",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >

                      <div
                        style={{
                          display: "flex",
                          justifyContent:
                            "space-between",
                          alignItems:
                            "center",
                          marginBottom:
                            "15px",
                        }}
                      >

                        <span
                          style={{
                            fontSize: "11px",
                            fontWeight: "900",
                            letterSpacing:
                              "2px",
                            color:
                              "#f4bd61",
                          }}
                        >
                          CONCEPT
                        </span>

                        <span
                          style={{
                            color:
                              "rgba(255,255,255,0.25)",
                            fontSize:
                              "20px",
                            fontWeight:
                              "800",
                          }}
                        >
                          {String(
                            index + 1
                          ).padStart(2, "0")}
                        </span>

                      </div>

                      <h3
                        style={{
                          margin:
                            "0 0 10px",
                          color: "#fff",
                          fontSize:
                            "19px",
                        }}
                      >
                        {card.title}
                      </h3>

                      <p
                        style={{
                          margin:
                            "0 0 17px",
                          color:
                            "#b9c7d8",
                          lineHeight:
                            "1.65",
                          fontSize:
                            "14px",
                        }}
                      >
                        {card.content}
                      </p>

                      {card.example && (
                        <div
                          style={{
                            padding:
                              "13px 14px",
                            borderRadius:
                              "11px",
                            background:
                              "rgba(244,189,97,0.08)",
                            border:
                              "1px solid rgba(244,189,97,0.15)",
                          }}
                        >

                          <strong
                            style={{
                              display:
                                "block",
                              marginBottom:
                                "5px",
                              color:
                                "#f4bd61",
                              fontSize:
                                "12px",
                            }}
                          >
                            PRACTICAL EXAMPLE
                          </strong>

                          <p
                            style={{
                              margin: 0,
                              color:
                                "#d5dee8",
                              fontSize:
                                "13px",
                              lineHeight:
                                "1.6",
                            }}
                          >
                            {card.example}
                          </p>

                        </div>
                      )}

                    </div>
                  )
                )}

              </div>

            </article>


            {/* =================================================
                YOUTUBE
            ================================================= */}

            {learning.youtubeVideoId && (
              <article
                style={{
                  ...cardStyle,
                  padding: "30px",
                }}
              >

                <SectionLabel>
                  WATCH & LEARN
                </SectionLabel>

                <h2 style={sectionHeadingStyle}>
                  {learning.youtubeTitle}
                </h2>

                {learning.youtubeChannel && (
                  <p
                    style={{
                      margin:
                        "-8px 0 18px",
                      color:
                        "#8fa1b5",
                      fontSize:
                        "13px",
                    }}
                  >
                    {learning.youtubeChannel}
                  </p>
                )}

                <div
                  style={{
                    position:
                      "relative",
                    width: "100%",
                    paddingTop:
                      "56.25%",
                    overflow:
                      "hidden",
                    borderRadius:
                      "16px",
                    background:
                      "#000",
                  }}
                >

                  <iframe
                    src={`https://www.youtube.com/embed/${learning.youtubeVideoId}`}
                    title={
                      learning.youtubeTitle ||
                      "Learning video"
                    }
                    allow="
                      accelerometer;
                      autoplay;
                      clipboard-write;
                      encrypted-media;
                      gyroscope;
                      picture-in-picture;
                      web-share
                    "
                    allowFullScreen
                    style={{
                      position:
                        "absolute",
                      inset: 0,
                      width: "100%",
                      height: "100%",
                      border: "none",
                    }}
                  />

                </div>

              </article>
            )}


            {/* =================================================
                Q&A
            ================================================= */}

            <article
              style={{
                ...cardStyle,
                padding: "30px",
              }}
            >

              <SectionLabel>
                QUESTIONS & ANSWERS
              </SectionLabel>

              <h2 style={sectionHeadingStyle}>
                Check Your Understanding
              </h2>

              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "10px",
                  marginTop: "20px",
                }}
              >

                {learning.questions?.map(
                  (item, index) => (
                    <details
                      key={index}
                      style={{
                        borderRadius:
                          "14px",
                        overflow:
                          "hidden",
                        background:
                          "rgba(255,255,255,0.045)",
                        border:
                          "1px solid rgba(255,255,255,0.08)",
                      }}
                    >

                      <summary
                        style={{
                          cursor:
                            "pointer",
                          listStyle:
                            "none",
                          padding:
                            "18px 20px",
                          color:
                            "#edf2f7",
                          fontWeight:
                            "600",
                          fontSize:
                            "15px",
                        }}
                      >

                        <span
                          style={{
                            display:
                              "inline-flex",
                            alignItems:
                              "center",
                            justifyContent:
                              "center",
                            width:
                              "30px",
                            height:
                              "30px",
                            marginRight:
                              "12px",
                            borderRadius:
                              "8px",
                            background:
                              "rgba(244,189,97,0.12)",
                            color:
                              "#f4bd61",
                            fontSize:
                              "11px",
                            fontWeight:
                              "900",
                          }}
                        >
                          Q{index + 1}
                        </span>

                        {item.question}

                      </summary>

                      <div
                        style={{
                          padding:
                            "0 20px 20px 62px",
                        }}
                      >

                        <div
                          style={{
                            padding:
                              "15px",
                            borderRadius:
                              "11px",
                            background:
                              "rgba(0,0,0,0.14)",
                          }}
                        >

                          <strong
                            style={{
                              color:
                                "#f4bd61",
                              fontSize:
                                "12px",
                            }}
                          >
                            ANSWER
                          </strong>

                          <p
                            style={{
                              margin:
                                "7px 0 0",
                              color:
                                "#c5d1dd",
                              lineHeight:
                                "1.6",
                              fontSize:
                                "14px",
                            }}
                          >
                            {item.answer}
                          </p>

                        </div>

                      </div>

                    </details>
                  )
                )}

              </div>

            </article>


            {/* =================================================
                QUIZ
            ================================================= */}

            <article
              style={{
                ...cardStyle,
                padding: "30px",
              }}
            >

              <SectionLabel>
                FINAL CHALLENGE
              </SectionLabel>

              <h2 style={sectionHeadingStyle}>
                Test Yourself
              </h2>

              <p
                style={{
                  margin:
                    "0 0 24px",
                  color:
                    "#94a6ba",
                  fontSize:
                    "14px",
                }}
              >
                Choose an answer for each
                question. You will immediately
                see whether you are correct.
              </p>


              <div
                style={{
                  display: "flex",
                  flexDirection:
                    "column",
                  gap: "24px",
                }}
              >

                {learning.quiz?.map(
                  (question, index) => {

                    const selected =
                      quizAnswers[index];

                    const answered =
                      showAnswers[index];

                    return (
                      <div
                        key={index}
                        style={{
                          padding:
                            "22px",
                          borderRadius:
                            "17px",
                          background:
                            "rgba(255,255,255,0.04)",
                          border:
                            "1px solid rgba(255,255,255,0.08)",
                        }}
                      >

                        <div
                          style={{
                            display:
                              "flex",
                            gap:
                              "12px",
                            alignItems:
                              "flex-start",
                            marginBottom:
                              "18px",
                          }}
                        >

                          <span
                            style={{
                              flexShrink:
                                0,
                              width:
                                "32px",
                              height:
                                "32px",
                              display:
                                "flex",
                              alignItems:
                                "center",
                              justifyContent:
                                "center",
                              borderRadius:
                                "9px",
                              background:
                                "rgba(244,189,97,0.13)",
                              color:
                                "#f4bd61",
                              fontWeight:
                                "900",
                              fontSize:
                                "12px",
                            }}
                          >
                            {index + 1}
                          </span>

                          <h3
                            style={{
                              margin: 0,
                              fontSize:
                                "16px",
                              lineHeight:
                                "1.5",
                              color:
                                "#f8fafc",
                            }}
                          >
                            {question.question}
                          </h3>

                        </div>


                        <div
                          style={{
                            display:
                              "grid",
                            gridTemplateColumns:
                              "repeat(auto-fit, minmax(220px, 1fr))",
                            gap:
                              "10px",
                          }}
                        >

                          {question.options?.map(
                            (
                              option,
                              optionIndex
                            ) => {

                              const correct =
                                option ===
                                question.answer;

                              const chosen =
                                option ===
                                selected;

                              let background =
                                "rgba(255,255,255,0.05)";

                              let border =
                                "1px solid rgba(255,255,255,0.08)";

                              let color =
                                "#d8e1ea";

                              if (
                                answered &&
                                correct
                              ) {
                                background =
                                  "rgba(34,197,94,0.13)";

                                border =
                                  "1px solid rgba(34,197,94,0.35)";

                                color =
                                  "#86efac";
                              }

                              if (
                                answered &&
                                chosen &&
                                !correct
                              ) {
                                background =
                                  "rgba(239,68,68,0.13)";

                                border =
                                  "1px solid rgba(239,68,68,0.35)";

                                color =
                                  "#fca5a5";
                              }

                              return (
                                <button
                                  key={
                                    optionIndex
                                  }
                                  onClick={() =>
                                    handleQuizAnswer(
                                      index,
                                      option
                                    )
                                  }
                                  disabled={
                                    answered
                                  }
                                  style={{
                                    textAlign:
                                      "left",
                                    padding:
                                      "14px 15px",
                                    border,
                                    borderRadius:
                                      "11px",
                                    background,
                                    color,
                                    cursor:
                                      answered
                                        ? "default"
                                        : "pointer",
                                    fontSize:
                                      "14px",
                                    lineHeight:
                                      "1.45",
                                    transition:
                                      "0.2s ease",
                                  }}
                                >
                                  <span
                                    style={{
                                      marginRight:
                                        "9px",
                                      opacity:
                                        0.6,
                                    }}
                                  >
                                    {String.fromCharCode(
                                      65 +
                                        optionIndex
                                    )}
                                    .
                                  </span>

                                  {option}
                                </button>
                              );
                            }
                          )}

                        </div>


                        {answered && (
                          <div
                            style={{
                              marginTop:
                                "15px",
                              padding:
                                "12px 14px",
                              borderRadius:
                                "10px",
                              background:
                                isQuizCorrect(
                                  index,
                                  selected
                                )
                                  ? "rgba(34,197,94,0.08)"
                                  : "rgba(239,68,68,0.08)",
                              color:
                                isQuizCorrect(
                                  index,
                                  selected
                                )
                                  ? "#86efac"
                                  : "#fca5a5",
                              fontSize:
                                "13px",
                              fontWeight:
                                "600",
                            }}
                          >
                            {isQuizCorrect(
                              index,
                              selected
                            )
                              ? "✓ Correct! Well done."
                              : `✗ Not quite. Correct answer: ${question.answer}`}
                          </div>
                        )}

                      </div>
                    );
                  }
                )}

              </div>

            </article>


            {/* =================================================
                START QUEST
            ================================================= */}

            <section
              style={{
                ...cardStyle,
                textAlign:
                  "center",
                padding:
                  "40px 25px",
                background:
                  "linear-gradient(145deg, rgba(244,189,97,0.12), rgba(255,255,255,0.04))",
              }}
            >

              <div
                style={{
                  fontSize:
                    "38px",
                  marginBottom:
                    "10px",
                }}
              >
                ⚔️
              </div>

              <SectionLabel>
                READY FOR THE QUEST?
              </SectionLabel>

              <h2
                style={{
                  margin:
                    "10px 0",
                  fontFamily:
                    "Georgia, 'Times New Roman', serif",
                  fontSize:
                    "30px",
                  color:
                    "#fff",
                }}
              >
                Put your knowledge to the test.
              </h2>

              <p
                style={{
                  maxWidth:
                    "560px",
                  margin:
                    "0 auto 22px",
                  color:
                    "#b9c7d8",
                  lineHeight:
                    "1.7",
                }}
              >
                You've learned the concepts.
                Now face the challenge and see
                how much you remember.
              </p>

              <button
                onClick={() =>
                  startQuest?.(topic)
                }
                style={{
                  border:
                    "none",
                  borderRadius:
                    "13px",
                  padding:
                    "14px 30px",
                  background:
                    "linear-gradient(135deg, #f4bd61, #d99a35)",
                  color:
                    "#111827",
                  fontWeight:
                    "900",
                  fontSize:
                    "15px",
                  cursor:
                    "pointer",
                  boxShadow:
                    "0 10px 30px rgba(217,154,53,0.22)",
                }}
              >
                ⚔️ Start Quest →
              </button>

            </section>

          </section>
        )}

      </div>


      {/* =================================================
          ANIMATION
      ================================================= */}

      <style>
        {`
          @keyframes learnSpin {
            from {
              transform: rotate(0deg);
            }

            to {
              transform: rotate(360deg);
            }
          }

          button:hover:not(:disabled) {
            filter: brightness(1.08);
          }

          details summary::-webkit-details-marker {
            display: none;
          }

          input::placeholder {
            color: #7f91a6;
          }

          @media (max-width: 650px) {
            .learn-page {
              padding: 20px 12px !important;
            }
          }
        `}
      </style>

    </main>
  );
}


/*
=========================================================
REUSABLE INLINE STYLES
=========================================================
*/

const cardStyle = {
  borderRadius: "22px",
  background:
    "linear-gradient(145deg, rgba(39,56,78,0.92), rgba(21,36,55,0.94))",
  border:
    "1px solid rgba(255,255,255,0.09)",
  boxShadow:
    "0 15px 45px rgba(0,0,0,0.18)",
};


const sectionHeadingStyle = {
  margin:
    "8px 0 0",
  color: "#fff",
  fontSize: "26px",
  fontFamily:
    "Georgia, 'Times New Roman', serif",
};


function SectionLabel({ children }) {
  return (
    <p
      style={{
        margin: 0,
        color: "#f4bd61",
        fontSize: "11px",
        fontWeight: "900",
        letterSpacing: "2.5px",
      }}
    >
      {children}
    </p>
  );
}