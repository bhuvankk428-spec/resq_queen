import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/*
  POST /api/learn

  Body:
  {
    "topic": "JavaScript Promises"
  }
*/

router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    // -----------------------------
    // Validate topic
    // -----------------------------

    if (!topic || typeof topic !== "string" || !topic.trim()) {
      return res.status(400).json({
        error: "Please provide a valid topic.",
      });
    }

    const cleanTopic = topic.trim();

    if (cleanTopic.length > 140) {
      return res.status(400).json({
        error: "Topic must be less than 140 characters.",
      });
    }

    // -----------------------------
    // Generate learning content
    // -----------------------------

    const response = await openai.responses.create({
      model: "gpt-5-mini",

      input: [
        {
          role: "system",
          content: `
You are an expert educational tutor.

Create a complete learning lesson for the requested topic.

The purpose is to TEACH the user, not just provide information.

The lesson should progress from basic concepts to more advanced
concepts and should be understandable to someone learning the topic.

Return ONLY valid JSON.

Use exactly this structure:

{
  "title": "string",
  "summary": "string",
  "keyPoints": [
    "string"
  ],
  "cards": [
    {
      "title": "string",
      "content": "string",
      "example": "string"
    }
  ],
  "questions": [
    {
      "question": "string",
      "answer": "string"
    }
  ],
  "quiz": [
    {
      "question": "string",
      "options": [
        "string",
        "string",
        "string",
        "string"
      ],
      "answer": "string"
    }
  ]
}

STRICT CONTENT REQUIREMENTS:

- summary: approximately 100-150 words
- keyPoints: exactly 5-8 important points
- cards: exactly 5 learning cards
- questions: 3-5 questions
- quiz: exactly 3 questions
- Every quiz question must have exactly 4 options
- The answer must exactly match one of the 4 options
- Start with fundamental concepts
- Progress gradually toward advanced concepts
- Include practical examples
- Explain technical terms when first introduced
- Avoid unnecessary repetition
- Keep explanations clear and useful
- Adapt the depth to the requested topic
- Do not assume the learner already knows advanced concepts
- Do not make up facts
- Do not include markdown outside JSON strings
- Do not include commentary before or after the JSON
`,
        },

        {
          role: "user",
          content: `Teach me: ${cleanTopic}`,
        },
      ],
    });

    // -----------------------------
    // Extract AI output
    // -----------------------------

    const rawOutput = response.output_text?.trim();

    if (!rawOutput) {
      return res.status(502).json({
        error: "AI returned an empty response.",
      });
    }

    // -----------------------------
    // Parse AI output safely
    // -----------------------------

    const learning = parseAIJson(rawOutput);

    if (!learning) {
      console.error("Unable to parse AI response:");
      console.error(rawOutput);

      return res.status(502).json({
        error: "AI returned an invalid learning format.",
      });
    }

    // -----------------------------
    // Normalize / repair structure
    // -----------------------------

    const normalizedLearning = normalizeLearningContent(
      learning,
      cleanTopic
    );

    // -----------------------------
    // YouTube
    // -----------------------------

    let youtube = null;

    try {
      youtube = await searchYouTube(cleanTopic);
    } catch (youtubeError) {
      console.error("YouTube search failed:", youtubeError);
    }

    // -----------------------------
    // Final response
    // -----------------------------

    return res.json({
      ...normalizedLearning,

      youtubeTitle: youtube?.title || null,
      youtubeVideoId: youtube?.videoId || null,
      youtubeChannel: youtube?.channelTitle || null,
    });
  } catch (error) {
    console.error("Learn API error:", error);

    return res.status(500).json({
      error: "Failed to generate learning content.",
    });
  }
});


/*
=========================================================
SAFE AI JSON PARSER
=========================================================
*/

function parseAIJson(rawOutput) {
  let text = rawOutput.trim();

  // Case 1:
  // ```json
  // {...}
  // ```
  if (text.startsWith("```")) {
    text = text
      .replace(/^```json\s*/i, "")
      .replace(/^```\s*/i, "")
      .replace(/\s*```$/i, "")
      .trim();
  }

  // Try normal JSON first
  try {
    return JSON.parse(text);
  } catch {
    // Continue
  }

  /*
    Sometimes the model may return additional text:

    Here is your lesson:
    {
       ...
    }

    Try extracting the JSON object.
  */

  const firstBrace = text.indexOf("{");
  const lastBrace = text.lastIndexOf("}");

  if (firstBrace !== -1 && lastBrace !== -1) {
    const possibleJson = text.slice(
      firstBrace,
      lastBrace + 1
    );

    try {
      return JSON.parse(possibleJson);
    } catch {
      return null;
    }
  }

  return null;
}


/*
=========================================================
NORMALIZE LEARNING CONTENT
=========================================================
*/

function normalizeLearningContent(data, topic) {
  const result = {
    title:
      typeof data.title === "string" && data.title.trim()
        ? data.title.trim()
        : topic,

    summary:
      typeof data.summary === "string"
        ? data.summary.trim()
        : "",

    keyPoints: [],

    cards: [],

    questions: [],

    quiz: [],
  };


  // --------------------------------
  // Key Points
  // --------------------------------

  if (Array.isArray(data.keyPoints)) {
    result.keyPoints = data.keyPoints
      .filter((point) => typeof point === "string")
      .map((point) => point.trim())
      .filter(Boolean)
      .slice(0, 8);
  }


  // --------------------------------
  // Learning Cards
  // --------------------------------

  if (Array.isArray(data.cards)) {
    result.cards = data.cards
      .filter(
        (card) =>
          card &&
          typeof card === "object"
      )
      .map((card) => ({
        title:
          typeof card.title === "string"
            ? card.title.trim()
            : "Concept",

        content:
          typeof card.content === "string"
            ? card.content.trim()
            : "",

        example:
          typeof card.example === "string"
            ? card.example.trim()
            : "",
      }))
      .filter((card) => card.content)
      .slice(0, 5);
  }


  // --------------------------------
  // Questions & Answers
  // --------------------------------

  if (Array.isArray(data.questions)) {
    result.questions = data.questions
      .filter(
        (item) =>
          item &&
          typeof item === "object"
      )
      .map((item) => ({
        question:
          typeof item.question === "string"
            ? item.question.trim()
            : "",

        answer:
          typeof item.answer === "string"
            ? item.answer.trim()
            : "",
      }))
      .filter(
        (item) =>
          item.question &&
          item.answer
      )
      .slice(0, 5);
  }


  // --------------------------------
  // Quiz
  // --------------------------------

  if (Array.isArray(data.quiz)) {
    result.quiz = data.quiz
      .filter(
        (question) =>
          question &&
          typeof question === "object"
      )
      .map((question) => {
        const options = Array.isArray(question.options)
          ? question.options
              .filter(
                (option) =>
                  typeof option === "string"
              )
              .map((option) => option.trim())
              .filter(Boolean)
              .slice(0, 4)
          : [];

        let answer =
          typeof question.answer === "string"
            ? question.answer.trim()
            : "";

        /*
          Make sure answer actually exists
          inside the options.
        */

        if (
          answer &&
          !options.includes(answer)
        ) {
          answer = options[0] || "";
        }

        return {
          question:
            typeof question.question === "string"
              ? question.question.trim()
              : "",

          options,

          answer,
        };
      })
      .filter(
        (question) =>
          question.question &&
          question.options.length === 4 &&
          question.answer &&
          question.options.includes(question.answer)
      )
      .slice(0, 3);
  }


  return result;
}


/*
=========================================================
YOUTUBE SEARCH
=========================================================
*/

async function searchYouTube(topic) {
  if (!process.env.YOUTUBE_API_KEY) {
    console.warn(
      "YOUTUBE_API_KEY is not configured."
    );

    return null;
  }

  const query = encodeURIComponent(
    `${topic} tutorial explained`
  );

  const url =
    `https://www.googleapis.com/youtube/v3/search` +
    `?part=snippet` +
    `&q=${query}` +
    `&type=video` +
    `&maxResults=5` +
    `&order=relevance` +
    `&relevanceLanguage=en` +
    `&videoEmbeddable=true` +
    `&key=${process.env.YOUTUBE_API_KEY}`;

  const response = await fetch(url);

  if (!response.ok) {
    console.error(
      "YouTube API error:",
      response.status,
      await response.text()
    );

    return null;
  }

  const data = await response.json();

  const video = data.items?.find(
    (item) => item.id?.videoId
  );

  if (!video) {
    return null;
  }

  return {
    videoId: video.id.videoId,
    title: video.snippet.title,
    channelTitle: video.snippet.channelTitle,
  };
}


export default router;