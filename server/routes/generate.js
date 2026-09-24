import { Router } from "express";
import { createQuest } from "../services/llmService.js";
const router = Router();
router.post("/", async (req, res) => {
  const { topic, difficulty = "Mixed" } = req.body || {};
  if (
    typeof topic !== "string" ||
    topic.trim().length < 2 ||
    topic.length > 140
  )
    return res
      .status(400)
      .json({ error: "Enter a topic between 2 and 140 characters." });
  try {
    res.json(await createQuest(topic.trim(), difficulty));
  } catch (e) {
    console.error("Generation failed:", e.message);
    res
      .status(e.status || 500)
      .json({ error: e.message || "Question generation failed." });
  }
});
export default router;
