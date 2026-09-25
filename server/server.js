import "dotenv/config";
import { createApp } from "./app.js";

const app = createApp();

if (!process.env.VERCEL) {
  const PORT = process.env.PORT || 3001;

  app.listen(PORT, () => {
    console.log(`Quest server ready on http://localhost:${PORT}`);
  });
}

export default app;
