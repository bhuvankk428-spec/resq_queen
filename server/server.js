import "dotenv/config";
import express from "express";
import cors from "cors";

import generate from "./routes/generate.js";
import leaderboard from "./routes/leaderboard.js";
import learn from "./routes/learn.js";

const app = express();

const allowedOrigins = [
  "http://localhost:5173",
  "https://resq-queen.vercel.app",
  "https://resq-queen-git-main-bhuvans-projects-414816cf.vercel.app",
];

const corsOptions = {
  origin: function (origin, callback) {
    // Allow requests without Origin
    if (!origin) {
      return callback(null, true);
    }

    if (allowedOrigins.includes(origin)) {
      return callback(null, true);
    }

    console.log("Blocked CORS origin:", origin);
    return callback(new Error("Not allowed by CORS"));
  },

  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],

  allowedHeaders: ["Content-Type", "Authorization"],

  credentials: false,
};

// CORS
app.use(cors(corsOptions));

// JSON
app.use(express.json({ limit: "20kb" }));

// Routes
app.use("/api/generate", generate);
app.use("/api/leaderboard", leaderboard);
app.use("/api/learn", learn);

// Error handler
app.use((err, req, res, next) => {
  console.error("Server error:", err);

  res.status(500).json({
    error: err.message || "Internal server error",
  });
});

// Local development
if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Quest server ready on http://localhost:${PORT}`);
  });
}

export default app;