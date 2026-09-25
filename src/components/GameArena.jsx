export default function GameArena({ score, won }) {
  const progress = Math.min(score, 7) / 7;

  const kingLeft = 5 + progress * 65;

  return (
    <div className={`arena ${won ? "rescued" : ""}`}>

      {}
      <div className="arena-sky">
        <div className="moon" />

        <div className="cloud cloud-1" />
        <div className="cloud cloud-2" />
        <div className="cloud cloud-3" />

        <div className="mountains mountains-back" />
        <div className="mountains mountains-front" />

        {}
        <div className="particles">
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
          <span />
        </div>
      </div>

      {}
      {!won && (
        <>
          {}
          <div
            className="castle-glow"
            style={{
              opacity: 0.25 + progress * 0.45,
              transform: `scale(${1 + progress * 0.08})`,
            }}
          />

          {}
          <div
            className="castle"
            style={{
              right: "4%",
              bottom: "52px",
              transform: `scale(${0.82 + progress * 0.12})`,
            }}
          >
            <img
              src="/Enemy_home.png"
              alt="Enemy castle"
            />

            {}
            <div className="fire fire-1" />
            <div className="fire fire-2" />
            <div className="fire fire-3" />
          </div>

          {}
          <div className="road">
            <div className="road-light" />
          </div>

          {}
          <div
            className="king-wrapper"
            style={{
              left: `${kingLeft}%`,
            }}
          >
            <div className="king-shadow" />

            <img
              className="king"
              src="/King.png"
              alt="King"
            />

            {}
            {progress > 0 && (
              <>
                <span className="dust dust-1" />
                <span className="dust dust-2" />
                <span className="dust dust-3" />
              </>
            )}
          </div>

          {}
          <div className="journey">
            <div className="journey-track">
              <div
                className="journey-progress"
                style={{
                  width: `${progress * 100}%`,
                }}
              />
            </div>

            <span className="journey-text">
              {score === 0
                ? "The journey begins..."
                : score < 7
                ? "The King is approaching..."
                : "The castle is within reach!"}
            </span>
          </div>
        </>
      )}

      {}
      {won && (
        <div className="victory-scene">

          <div className="victory-glow" />

          <img
            src="/happy_queen_after_meeting_king.png.png"
            alt="King and Queen reunited"
            className="victory-image"
          />

          <div className="victory-content">
            <h2>QUEEN RESCUED!</h2>

            <p>
              The King and Queen are finally reunited ❤️
            </p>

            <div className="victory-stars">
              ✦ ✦ ✦
            </div>
          </div>
        </div>
      )}

      {}
      <div className="ground">
        <div className="grass-layer" />
        <div className="ground-shadow" />
      </div>

      {}
      <div className="vignette" />
    </div>
  );
}