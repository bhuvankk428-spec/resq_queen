import "dotenv/config";
import express from "express";
import cors from "cors";

import generate from "./routes/generate.js";
import leaderboard from "./routes/leaderboard.js";
import learn from "./routes/learn.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.use("/api/generate", generate);
app.use("/api/leaderboard", leaderboard);
app.use("/api/learn", learn);

app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Quest server ready on http://localhost:${PORT}`);
  });
}

export default app;