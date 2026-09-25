import "dotenv/config";
import express from "express";
import cors from "cors";

import generate from "./routes/generate.js";
import leaderboard from "./routes/leaderboard.js";
import learn from "./routes/learn.js";

const ROUTES = { generate, leaderboard, learn };

function isAllowedOrigin(origin) {
  try {
    const { protocol, hostname } = new URL(origin);
    if (protocol !== "http:" && protocol !== "https:") return false;
    return (
      hostname === "localhost" ||
      hostname === "127.0.0.1" ||
      hostname.endsWith(".vercel.app")
    );
  } catch {
    return false;
  }
}

const corsOptions = {
  origin: function (origin, callback) {
    callback(null, !origin || isAllowedOrigin(origin));
  },
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: false,
};

export function createApp(names = Object.keys(ROUTES)) {
  const app = express();

  app.use(cors(corsOptions));
  app.use(express.json({ limit: "20kb" }));

  for (const name of names) {
    const router = ROUTES[name];
    if (!router) throw new Error(`Unknown API route: ${name}`);
    app.use(`/api/${name}`, router);
    app.use(`/${name}`, router);
  }

  app.use((req, res) => {
    res.status(404).json({ error: `Cannot ${req.method} ${req.path}` });
  });

  app.use((err, req, res, next) => {
    if (err.type === "entity.parse.failed") {
      return res
        .status(400)
        .json({ error: "The request body is not valid JSON." });
    }

    if (err.type === "entity.too.large") {
      return res.status(413).json({ error: "The request body is too large." });
    }

    console.error("Server error:", err);

    res.status(err.status || 500).json({
      error: err.message || "Internal server error",
    });
  });

  return app;
}
