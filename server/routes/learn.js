import express from "express";
import OpenAI from "openai";

const router = express.Router();

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});



router.post("/", async (req, res) => {
  try {
    const { topic } = req.body;

    

    if (
      !topic ||
      typeof topic !== "string" ||
      !topic.trim()
    ) {
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


    let learning = await generateLearningContent(
      cleanTopic
    );

    if (!learning) {
      return res.status(502).json({
        error: "AI returned an invalid learning format.",
      });
    }

    
    learning = normalizeLearningContent(
      learning,
      cleanTopic
    );


    learning = await repairInvalidSections(
      learning,
      cleanTopic
    );

    let youtube = null;

    try {
      youtube = await searchYouTube(cleanTopic);
    } catch (youtubeError) {
      console.error(
        "YouTube search failed:",
        youtubeError
      );
    }

    const youtubeSearchUrl =
      createYouTubeSearchUrl(cleanTopic);

   

    return res.json({
      ...learning,

      youtubeTitle:
        youtube?.title || null,

      youtubeVideoId:
        youtube?.videoId || null,

      youtubeChannel:
        youtube?.channelTitle || null,

      youtubeSearchUrl,
    });
  } catch (error) {
    console.error(
      "Learn API error:",
      error
    );

    return res.status(500).json({
      error:
        "Failed to generate learning content.",
    });
  }
});



async function generateLearningContent(topic) {
  try {
    const response =
      await openai.responses.create({
        model: "gpt-5-mini",

        input: [
          {
            role: "system",
            content: `
You are an expert educational tutor.

Create a complete learning lesson for the requested topic.

The purpose is to TEACH the user, not just provide information.

The lesson should progress from basic concepts to more advanced concepts.

The content must be understandable to someone learning the topic for the first time.

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

STRICT REQUIREMENTS:

1. summary:
   - approximately 100-150 words
   - explain the topic clearly

2. keyPoints:
   - exactly 5-8 points
   - important concepts only
   - progress from basic to advanced

3. cards:
   - exactly 5 learning cards
   - progress from basic to advanced
   - every card must have:
     title
     content
     example

4. questions:
   - 3-5 questions
   - each question must have an accurate answer

5. quiz:
   - exactly 3 questions
   - exactly 4 options per question
   - answer MUST exactly match one of the options

6. General:
   - start with fundamental concepts
   - gradually introduce advanced concepts
   - include practical examples
   - explain technical terms when first introduced
   - avoid unnecessary repetition
   - keep explanations clear and useful
   - adapt depth to the requested topic
   - do not assume advanced knowledge
   - do not make up facts
   - do not include markdown outside JSON strings
   - do not include commentary before or after JSON
`,
          },

          {
            role: "user",
            content: `Teach me: ${topic}`,
          },
        ],
      });

    const rawOutput =
      response.output_text?.trim();

    if (!rawOutput) {
      console.error(
        "AI returned empty response."
      );

      return null;
    }

    return parseAIJson(rawOutput);
  } catch (error) {
    console.error(
      "OpenAI generation error:",
      error
    );

    return null;
  }
}


function parseAIJson(rawOutput) {
  if (
    !rawOutput ||
    typeof rawOutput !== "string"
  ) {
    return null;
  }

  let text = rawOutput.trim();

  
  text = text
    .replace(/^```json\s*/i, "")
    .replace(/^```\s*/i, "")
    .replace(/\s*```$/i, "")
    .trim();



  try {
    return JSON.parse(text);
  } catch {
    // Continue
  }

  
  const firstBrace =
    text.indexOf("{");

  const lastBrace =
    text.lastIndexOf("}");

  if (
    firstBrace !== -1 &&
    lastBrace !== -1 &&
    lastBrace > firstBrace
  ) {
    const possibleJson =
      text.slice(
        firstBrace,
        lastBrace + 1
      );

    try {
      return JSON.parse(
        possibleJson
      );
    } catch {
      return null;
    }
  }

  return null;
}



function normalizeLearningContent(
  data,
  topic
) {
  const result = {
    title:
      typeof data?.title === "string" &&
      data.title.trim()
        ? data.title.trim()
        : topic,

    summary:
      typeof data?.summary === "string"
        ? data.summary.trim()
        : "",

    keyPoints: [],

    cards: [],

    questions: [],

    quiz: [],
  };

  
  if (
    Array.isArray(data?.keyPoints)
  ) {
    result.keyPoints =
      data.keyPoints
        .filter(
          (point) =>
            typeof point === "string"
        )
        .map(
          (point) =>
            point.trim()
        )
        .filter(Boolean)
        .slice(0, 8);
  }

  if (
    Array.isArray(data?.cards)
  ) {
    result.cards =
      data.cards
        .filter(
          (card) =>
            card &&
            typeof card === "object"
        )
        .map((card) => ({
          title:
            typeof card.title ===
            "string"
              ? card.title.trim()
              : "Concept",

          content:
            typeof card.content ===
            "string"
              ? card.content.trim()
              : "",

          example:
            typeof card.example ===
            "string"
              ? card.example.trim()
              : "",
        }))
        .filter(
          (card) =>
            card.title &&
            card.content
        )
        .slice(0, 5);
  }

  if (
    Array.isArray(data?.questions)
  ) {
    result.questions =
      data.questions
        .filter(
          (item) =>
            item &&
            typeof item === "object"
        )
        .map((item) => ({
          question:
            typeof item.question ===
            "string"
              ? item.question.trim()
              : "",

          answer:
            typeof item.answer ===
            "string"
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

 

  if (
    Array.isArray(data?.quiz)
  ) {
    result.quiz =
      data.quiz
        .filter(
          (question) =>
            question &&
            typeof question === "object"
        )
        .map((question) => {
          const options =
            Array.isArray(
              question.options
            )
              ? question.options
                  .filter(
                    (option) =>
                      typeof option ===
                      "string"
                  )
                  .map(
                    (option) =>
                      option.trim()
                  )
                  .filter(Boolean)
                  .slice(0, 4)
              : [];

          const answer =
            typeof question.answer ===
            "string"
              ? question.answer.trim()
              : "";

          return {
            question:
              typeof question.question ===
              "string"
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
            question.options.includes(
              question.answer
            )
        )
        .slice(0, 3);
  }

  return result;
}



function validateLearningContent(
  data
) {
  const errors = [];


  if (
    typeof data.summary !== "string" ||
    data.summary.trim().length < 400
  ) {
    errors.push("summary");
  }

  

  if (
    !Array.isArray(data.keyPoints) ||
    data.keyPoints.length < 5 ||
    data.keyPoints.length > 8
  ) {
    errors.push("keyPoints");
  }


  if (
    !Array.isArray(data.cards) ||
    data.cards.length !== 5
  ) {
    errors.push("cards");
  } else {
    const invalidCard =
      data.cards.some(
        (card) =>
          !card.title ||
          !card.content ||
          !card.example
      );

    if (invalidCard) {
      errors.push("cards");
    }
  }

  

  if (
    !Array.isArray(data.questions) ||
    data.questions.length < 3 ||
    data.questions.length > 5
  ) {
    errors.push("questions");
  }

  

  if (
    !Array.isArray(data.quiz) ||
    data.quiz.length !== 3
  ) {
    errors.push("quiz");
  } else {
    const invalidQuiz =
      data.quiz.some(
        (question) =>
          !question.question ||
          !Array.isArray(
            question.options
          ) ||
          question.options.length !== 4 ||
          !question.answer ||
          !question.options.includes(
            question.answer
          )
      );

    if (invalidQuiz) {
      errors.push("quiz");
    }
  }

  return [
    ...new Set(errors),
  ];
}


async function repairInvalidSections(
  learning,
  topic
) {
  

  for (
    let attempt = 0;
    attempt < 2;
    attempt++
  ) {
    const invalidSections =
      validateLearningContent(
        learning
      );

    if (
      invalidSections.length === 0
    ) {
      break;
    }

    console.log(
      `AI repair attempt ${
        attempt + 1
      }:`,
      invalidSections
    );

    

    for (
      const section of invalidSections
    ) {
      try {
        const repaired =
          await repairSection(
            section,
            learning,
            topic
          );

        if (
          repaired &&
          repaired[section]
        ) {
          learning[section] =
            repaired[section];
        }
      } catch (error) {
        console.error(
          `Failed to repair ${section}:`,
          error
        );
      }
    }


    learning =
      normalizeLearningContent(
        learning,
        topic
      );
  }

  return learning;
}


async function repairSection(
  section,
  currentData,
  topic
) {
  const prompts = {
    summary: `
The summary section is invalid.

Topic:
${topic}

Current summary:
${JSON.stringify(
  currentData.summary
)}

Fix ONLY the summary.

Requirements:
- approximately 100-150 words
- educational
- clear
- beginner friendly
- technically accurate

Return ONLY:

{
  "summary": "..."
}
`,

    keyPoints: `
The keyPoints section is invalid.

Topic:
${topic}

Current keyPoints:
${JSON.stringify(
  currentData.keyPoints
)}

Fix ONLY keyPoints.

Requirements:
- exactly 5-8 points
- important concepts
- progress from basic to advanced
- useful for learning

Return ONLY:

{
  "keyPoints": [
    "...",
    "..."
  ]
}
`,

    cards: `
The cards section is invalid.

Topic:
${topic}

Current cards:
${JSON.stringify(
  currentData.cards
)}

Fix ONLY cards.

Requirements:
- exactly 5 cards
- progress from basic to advanced
- every card must contain:
  title
  content
  example

Return ONLY:

{
  "cards": [
    {
      "title": "...",
      "content": "...",
      "example": "..."
    }
  ]
}
`,

    questions: `
The questions section is invalid.

Topic:
${topic}

Current questions:
${JSON.stringify(
  currentData.questions
)}

Fix ONLY questions.

Requirements:
- 3-5 questions
- test understanding
- accurate answers
- useful for learning

Return ONLY:

{
  "questions": [
    {
      "question": "...",
      "answer": "..."
    }
  ]
}
`,

    quiz: `
The quiz section is invalid.

Topic:
${topic}

Current quiz:
${JSON.stringify(
  currentData.quiz
)}

Fix ONLY quiz.

Requirements:
- exactly 3 questions
- exactly 4 options per question
- answer MUST exactly match one option
- no duplicate options
- questions must test understanding
- answers must be factually correct

Return ONLY:

{
  "quiz": [
    {
      "question": "...",
      "options": [
        "...",
        "...",
        "...",
        "..."
      ],
      "answer": "..."
    }
  ]
}
`,
  };

  const prompt =
    prompts[section];

  if (!prompt) {
    return null;
  }

  const response =
    await openai.responses.create({
      model: "gpt-5-mini",

      input: [
        {
          role: "system",
          content: `
You are an expert educational content validator.

Your job is to repair ONE invalid section.

Do not modify other sections.

Return ONLY valid JSON.

Do not include markdown.
Do not include explanations.
Do not include commentary.
`,
        },

        {
          role: "user",
          content: prompt,
        },
      ],
    });

  const rawOutput =
    response.output_text?.trim();

  if (!rawOutput) {
    return null;
  }

  return parseAIJson(
    rawOutput
  );
}


async function searchYouTube(
  topic
) {
  if (
    !process.env.YOUTUBE_API_KEY
  ) {
    console.warn(
      "YOUTUBE_API_KEY is not configured."
    );

    return null;
  }

  const query =
    encodeURIComponent(
      `${topic} tutorial explained`
    );

  const url =
    "https://www.googleapis.com/youtube/v3/search" +
    `?part=snippet` +
    `&q=${query}` +
    `&type=video` +
    `&maxResults=5` +
    `&order=relevance` +
    `&relevanceLanguage=en` +
    `&videoEmbeddable=true` +
    `&key=${process.env.YOUTUBE_API_KEY}`;

  const response =
    await fetch(url);

  if (!response.ok) {
    console.error(
      "YouTube API error:",
      response.status,
      await response.text()
    );

    return null;
  }

  const data =
    await response.json();

  const video =
    data.items?.find(
      (item) =>
        item.id?.videoId
    );

  if (!video) {
    return null;
  }

  return {
    videoId:
      video.id.videoId,

    title:
      video.snippet?.title ||
      null,

    channelTitle:
      video.snippet?.channelTitle ||
      null,
  };
}


function createYouTubeSearchUrl(
  topic
) {
  return (
    "https://www.youtube.com/results?search_query=" +
    encodeURIComponent(
      `${topic} tutorial explained`
    )
  );
}


export default router;