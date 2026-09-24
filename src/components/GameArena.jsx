export default function GameArena({ score, won }) {
  const progress = (Math.min(score, 7) / 7) * 72;

  return (
    <div
      className={`arena ${won ? "rescued" : ""}`}
      style={{
        position: "relative",
        overflow: "hidden",
        height: won ? "380px" : "320px",
        minHeight: won ? "380px" : "320px",
      }}
    >
      {/* GAMEPLAY */}
      {!won && (
        <>
          {/* KING */}
          <img
            className="king"
            src="/King.png"
            alt="King"
            style={{
              position: "absolute",
              left: `${5 + progress}%`,
              bottom: "40px",
              width: "150px",
              height: "190px",
              objectFit: "contain",
              zIndex: 5,
              transition: "left 0.8s ease-in-out",
              filter: "drop-shadow(0 8px 10px rgba(0, 0, 0, 0.45))",
            }}
          />

          {/* CAPTURED QUEEN */}
          <div
            className="castle"
            style={{
              position: "absolute",
              right: "5%",
              bottom: "35px",
              width: "240px",
              height: "210px",
              display: "flex",
              alignItems: "flex-end",
              justifyContent: "center",
              zIndex: 4,
            }}
          >
            <img
              src="/enemy_queen_captured.png"
              alt="Queen captured"
              style={{
                width: "230px",
                height: "auto",
                maxHeight: "200px",
                objectFit: "contain",
                display: "block",
                filter:
                  "drop-shadow(0 10px 12px rgba(0, 0, 0, 0.45))",
              }}
            />
          </div>
        </>
      )}

      {/* VICTORY */}
      {won && (
        <div
          style={{
            position: "absolute",
            inset: 0,
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "flex-start",
            paddingTop: "20px",
            zIndex: 10,
          }}
        >
          <img
            src="/happy_queen_after_meeting_king.png.png"
            alt="King and Queen reunited"
            style={{
              width: "min(560px, 75vw)",
              height: "auto",
              maxHeight: "250px",
              objectFit: "contain",
              display: "block",
              borderRadius: "14px",
              boxShadow: "0 10px 30px rgba(0, 0, 0, 0.45)",
            }}
          />

          <h2
            style={{
              margin: "10px 0 0",
              color: "#ffe08a",
              fontFamily: "Georgia, serif",
              fontSize: "clamp(28px, 4vw, 44px)",
              lineHeight: "1",
              textShadow: "0 4px 12px rgba(0, 0, 0, 0.7)",
            }}
          >
            QUEEN RESCUED!
          </h2>

          <p
            style={{
              margin: "7px 0 0",
              color: "#fff",
              fontSize: "15px",
            }}
          >
            The King and Queen are finally reunited ❤️
          </p>
        </div>
      )}

      {/* GROUND */}
      <div
        className="ground"
        style={{
          position: "absolute",
          bottom: 0,
          left: 0,
          right: 0,
          height: "60%",
          zIndex: 2,
        }}
      />
    </div>
  );
}