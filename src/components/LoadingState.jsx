import React from "react";
import { DotLottieReact } from "@lottiefiles/dotlottie-react";

export default function LoadingState() {
  return (
    <section className="state">
      <img
        className="waiting"
        src="/King.png"
        alt="King waiting"
        style={{
          width: "180px",
          height: "180px",
          objectFit: "contain",
          marginBottom: "10px",
        }}
      />

      <h2>The enemy is forging your challenge…</h2>

      <p>This can take a few moments. Your King waits patiently.</p>

      <div
        style={{
          width: "120px",
          height: "80px",
          margin: "5px auto 0",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          overflow: "hidden",
          background: "transparent",
        }}
      >
        <DotLottieReact
          src="https://lottie.host/b314eabf-db8b-459d-a568-cf50283842f3/Ow3vouBBvv.lottie"
          loop
          autoplay
          style={{
            width: "120px",
            height: "80px",
            background: "transparent",
          }}
        />
      </div>
    </section>
  );
}
