import "dotenv/config";
import express from "express";
import cors from "cors";

import generate from "./routes/generate.js";
import leaderboard from "./routes/leaderboard.js";

const app = express();

app.use(cors());
app.use(express.json({ limit: "20kb" }));

app.use("/api/generate", generate);
app.use("/api/leaderboard", leaderboard);

app.use((err, req, res, next) => {
  console.error(err);

  res.status(400).json({
    error: "Invalid JSON request.",
  });
});

export default app;