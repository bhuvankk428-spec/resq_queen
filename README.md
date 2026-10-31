# 👑 Save the Queen

### AI-Powered Interactive Learning & Quiz Platform

**Flam — Assignment**

Save the Queen is an AI-powered interactive learning and quiz application built with React. Instead of behaving like a chatbot, the application uses AI to generate **structured JSON data** that is validated and transformed into interactive UI components.

The application combines a story-driven quiz game with an AI-powered learning mode where users can enter any topic and receive structured learning content including cards, summaries, key points, quizzes, and YouTube tutorials.

---

## 🚀 Quick Links

- **Live Demo:** https://resq-queen.vercel.app/
- **GitHub Repository:** https://github.com/bhuvankk428-spec/resq_queen

- **Live Demoestration and youtube explaination:** https://youtu.be/63IO5uWvjC4

---

# 📌 Project Overview

The core idea is to turn AI-generated information into an **interactive product rather than a chatbot**.

The application has two main experiences:

### 🎮 Game Mode

Users select a topic and difficulty and play an AI-generated quiz.

The goal is to answer **7 out of 10 questions correctly** and rescue the queen.

### 📚 Learn Mode

Users can enter a new topic and receive structured AI-generated learning material:

- Summary
- Key Points
- Learning Cards with practical examples
- Questions & Answers
- Interactive Quiz with instant feedback
- YouTube Tutorial Video (when an embeddable video is found)
- A "Start Quest" action that carries the topic back to the game

The AI response is parsed and validated before it is rendered by React.

---

# ✨ Features

## 🎮 Interactive Quiz Game

- Google authentication through Supabase
- Player name, topic and difficulty input
- AI-generated 10-question quiz
- Three lives per run
- Score tracking and a live lives display
- Win/Loss state (7 or more correct answers rescues the queen)
- Queen rescue objective
- Story introduction for new players
- Existing players skip the story from the home screen
- Quiz session saved to `localStorage` and resumed after a refresh
- Fullscreen gate during the quiz; leaving fullscreen ends the run
- Five-second answer feedback before advancing
- Restart quiz with a new topic
- Leaderboard

## 📚 AI Learning Mode

Users can enter any topic (up to 140 characters) and generate:

- Topic summary
- 5-8 key points
- Five learning cards, each with an explanation and a practical example
- 3-5 question/answer pairs in collapsible accordions
- A three-question multiple-choice quiz with instant per-answer feedback
- An embedded YouTube tutorial when an embeddable video is found
- A "Start Quest" button that carries the learned topic back to the home screen
- Loading and error states

## 🤖 AI Integration

- OpenAI GPT-4o-mini for quiz generation through Chat Completions
- OpenAI GPT-5-mini for learning content through the Responses API
- Structured JSON responses
- JSON parsing with code-fence and brace-extraction fallback
- Response validation
- Invalid response detection
- Section-by-section AI repair for learning content (up to two attempts)
- YouTube Data API search for an embeddable tutorial
- Backend API proxy
- API key protection

## 🛡️ Error Handling

The application handles:

- Malformed JSON
- Invalid response shape
- Missing or invalid learning sections
- Invalid quiz options
- Invalid quiz answers
- Empty AI responses
- OpenAI failures
- YouTube API failures (the video section is omitted)
- Network errors
- Aborted quiz requests
- Input validation (topic length, player name, difficulty)
- Loading states
- Error states
- Empty states
- Retry states

## 📱 Responsive UI

The application is designed to work across:

- Desktop
- Tablet
- Mobile

---

# 🏗️ Overall Architecture

```text
                              USER
                                │
                                ▼
                       ┌─────────────────┐
                       │   Google Login  │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  User Detection │
                       │ New / Existing  │
                       └────────┬────────┘
                                │
                 ┌──────────────┴──────────────┐
                 │                             │
                 ▼                             ▼
             NEW USER                    EXISTING USER
                 │                             │
                 ▼                             ▼
          ┌─────────────┐              ┌─────────────┐
          │ Player Setup│              │    Home     │
          │             │              │             │
          │ Name        │              │ Topic       │
          │ Topic       │              │ Difficulty  │
          │ Difficulty  │              │ Learn/Board │
          └──────┬──────┘              └──────┬──────┘
                 │                             │
                 ▼                             │
          ┌─────────────┐                      │
          │    Story    │                      │
          └──────┬──────┘                      │
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │  Generate Quiz  │
                       │  Loading/Error  │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │      Quiz       │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    Win / Loss   │
                       └────────┬────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │    Homepage     │
                       └────────┬────────┘
                                │
               ┌─────────────────┼──────────────────┐
               │                 │                  │
               ▼                 ▼                  ▼
         Topic Input        Leaderboard           Logout
               │
               ▼
          Quiz Again


                       Homepage
                           │
                           ▼
                         Learn
                           │
                           ▼
                  Learning New Topic
                           │
                           ▼
                      Topic Input
                           │
                           ▼
                  ┌─────────────────┐
                  │ React Frontend  │
                  └────────┬────────┘
                           │
                           │ HTTP Request
                           ▼
                  ┌─────────────────┐
                  │ Node + Express  │
                  │    Backend      │
                  └────────┬────────┘
                           │
             ┌─────────────┼─────────────┐
             │             │             │
             ▼             ▼             ▼
          OpenAI        YouTube       Supabase
           API            API        PostgreSQL
             │             │             │
             │             │             ▼
             │             │       Leaderboard
             │             │       Records
             │             │
             ▼             ▼
        AI Learning     Tutorial
          Content        Video
             │
             └─────────────┬─────────────┘
                           ▼
                  ┌──────────────────┐
                  │ Parse & Validate │
                  │   AI Response    │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │ Repair / Retry   │
                  │ if required      │
                  └────────┬─────────┘
                           │
                           ▼
                  ┌──────────────────┐
                  │   Learn Output   │
                  ├──────────────────┤
                  │ Learning Cards   │
                  │ Summary          │
                  │ Key Points       │
                  │ Quiz             │
                  │ YouTube Video    │
                  └──────────────────┘
```

---

# 🧩 System Architecture

The project is divided into three major layers.

## 1. Frontend

```text
React + Vite
    │
    ├── App.jsx
    │
    ├── components/
    │   ├── AuthScreen.jsx
    │   ├── ErrorState.jsx
    │   ├── GameArena.jsx
    │   ├── HomeScreen.jsx
    │   ├── Leaderboard.jsx
    │   ├── LearnPage.jsx
    │   ├── LoadingState.jsx
    │   ├── PlayerSetup.jsx
    │   ├── QuestionCard.jsx
    │   ├── ResultScreen.jsx
    │   ├── SplashScreen.jsx
    │   └── StoryIntro.jsx
    │
    └── lib/
        ├── api.js
        ├── storage.js
        ├── supabase.js
        └── validateResult.js
```

The frontend is responsible for:

- Authentication state
- User input
- Game state
- Quiz interaction
- Score and lives
- Story presentation
- Learning interface
- Loading and error states
- Leaderboard UI
- Responsive UI

---

# ⚙️ Backend Architecture

The backend is built using Node.js and Express.

```text
api/
│
├── index.js
├── generate.js
├── leaderboard.js
└── learn.js

server/
│
├── app.js
│
├── server.js
│
├── routes/
│   ├── generate.js
│   ├── leaderboard.js
│   └── learn.js
│
├── services/
│   ├── llmService.js
│   └── leaderboardService.js
│
└── prompts/
    └── questionPrompt.js
```

Every file in `api/` is a Vercel Serverless Function entry point. They all build
the same Express app from `server/app.js`, so `/api/generate`, `/api/leaderboard`
and `/api/learn` each resolve to a function without any rewrite rules.

### API Routes

| Route              | Method    | Purpose                               |
| ------------------ | --------- | ------------------------------------- |
| `/api/generate`    | POST      | Generates quiz questions              |
| `/api/learn`       | POST      | Generates structured learning content |
| `/api/leaderboard` | GET, POST | Reads and saves leaderboard data      |

The backend keeps the OpenAI API key server-side instead of exposing it in the React application.

---

# 🎮 Game Mode Architecture

```text
Google Login
     │
     ▼
Check User
     │
     ├───────────────────┐
     │                   │
  New User           Existing User
     │                   │
     ▼                   ▼
Player Setup          Home Screen
(Name/Topic/          (Topic/Difficulty/
 Difficulty)           Learn/Leaderboard)
     │                   │
     ▼                   │
   Story                 │
     │                   │
     └─────────┬─────────┘
               ▼
        Generate Quiz
        (loading/error)
               │
               ▼
          Play Quiz
               │
               ▼
        Calculate Score
               │
               ▼
           Win / Loss
               │
               ▼
           Homepage
               │
      ┌────────┼─────────┐
      │        │         │
      ▼        ▼         ▼
   Topic    Leader-   Logout
  Input     board
      │
      ▼
  Quiz Again
```

### Game Objective

The player answers 10 AI-generated questions.

- The player starts with **3 lives**.
- Correct answers increase the score.
- Incorrect answers reduce lives.
- **7 correct answers out of 10** are required to rescue the queen.
- The run ends when the 10th question is answered or lives reach zero.
- Each answer shows feedback for five seconds before advancing.
- The quiz is saved to `localStorage` so a refresh resumes the current question.
- Leaving fullscreen during the quiz ends the run.
- The result screen displays the final Win/Loss state.
- After the game, the user returns to the Homepage.

---

# 📚 Learn Mode Architecture

Learn Mode is a separate path from the main quiz game.

```text
Homepage
    │
    ▼
  Learn
    │
    ▼
Learning New Topic
    │
    ▼
User enters topic
    │
    ▼
React Frontend
    │
    ▼
Node / Express Backend
    │
    ▼
OpenAI API
    │
    ▼
Structured JSON
    │
    ▼
JSON Parsing
    │
    ▼
Response Validation
    │
    ├───────────────┐
    │               │
  Valid           Invalid
    │               │
    │               ▼
    │          AI Repair / Retry
    │               │
    └───────┬───────┘
            ▼
     YouTube Search
            │
            ▼
     Final Learn Data
            │
            ▼
 ┌──────────────────────────┐
 │      Learning Page       │
 ├──────────────────────────┤
 │ Summary                  │
 │ Key Points               │
 │ Learning Cards           │
 │ Questions & Answers      │
 │ Quiz                     │
 │ YouTube Tutorial Video   │
 │ Start Quest →            │
 └──────────────────────────┘
```

---

# 🤖 AI Data Flow

The AI response is never treated as arbitrary UI content.

```text
User Topic
    │
    ▼
React Frontend
    │
    ▼
Backend API
    │
    ▼
OpenAI (GPT-4o-mini / GPT-5-mini)
    │
    ▼
Structured JSON
    │
    ▼
JSON Parsing
    │
    ▼
Shape Validation
    │
    ├── Valid ───────────────┐
    │                        │
    └── Invalid              │
          │                  │
          ▼                  │
     AI Repair / Retry       │
          │                  │
          └──────────────────┘
                    │
                    ▼
             YouTube Search
                    │
                    ▼
             Validated Data
                    │
                    ▼
              React Components
```

This ensures that the application renders **validated structured data**, rather than simply displaying raw model output.

---

# 📦 Structured AI Output

The backend requests structured JSON from the model.

A simplified example:

```json
{
  "title": "Computer Networks",
  "summary": "Computer networks allow devices to communicate...",
  "keyPoints": [
    "Networks connect multiple devices",
    "TCP provides reliable communication",
    "IP handles addressing and routing"
  ],
  "cards": [
    {
      "title": "What is a network?",
      "content": "A network is a group of connected devices that can exchange data.",
      "example": "Your phone and laptop sharing files over Wi-Fi."
    }
  ],
  "questions": [
    {
      "question": "What is TCP?",
      "answer": "A connection-oriented transport protocol."
    }
  ],
  "quiz": [
    {
      "question": "Which protocol provides reliable transport?",
      "options": ["TCP", "IP", "DNS", "HTTP"],
      "answer": "TCP"
    }
  ]
}
```

The actual application validates the generated response before rendering the corresponding UI.

---

# 🛡️ AI Response Validation

The application validates AI output before it reaches the UI.

Validation checks include:

- Valid JSON
- Expected object structure
- Required fields
- Required arrays
- A summary of at least 400 characters
- 5-8 key points
- Exactly 5 learning cards with a title, content and example
- 3-5 question/answer pairs
- Exactly 3 quiz questions
- Exactly 4 distinct options per quiz question
- A quiz answer that matches one of its options
- Non-empty sections

Invalid data is not blindly rendered.

Instead, it is normalized and routed through the repair/retry process, or shown through an appropriate error state.

---

# 🔧 AI Repair / Retry

If the learning model returns incomplete or invalid structured data, the backend normalizes the payload and attempts to repair only the invalid sections, up to two times. Quiz generation does not repair: an invalid payload is rejected with a `502` response.

```text
OpenAI Response
      │
      ▼
   Validate
      │
   ┌──┴──┐
 Valid  Invalid
   │       │
   │       ▼
   │    Repair /
   │     Retry
   │       │
   └───┬───┘
       ▼
 Validated Data
```

This improves reliability when the model does not initially return the expected structure.

---

# ⚠️ Error Handling

Handling unreliable AI output is a major part of the application.

## Malformed JSON

If the model returns invalid JSON:

```text
AI Response
     ↓
JSON.parse()
     ↓
Parse Error
     ↓
Error State
     ↓
Retry
```

The application does not crash.

---

## Wrong Response Shape

Valid JSON does not necessarily mean valid application data.

For example:

```json
{
  "message": "Here is your content"
}
```

may be valid JSON but still not match the expected learning structure.

The response validator detects this before rendering.

---

## Missing Sections

If required sections such as:

- cards
- summary
- key points
- quiz

are missing or invalid, the response is treated as invalid instead of rendering incomplete UI.

---

## Empty Response

An empty AI response is treated as a failure rather than a successful result.

The user receives an appropriate error/retry state.

---

## Slow Response

While the AI request is running, the application displays a loading state.

The UI does not silently appear frozen.

---

## Failed Request

If OpenAI or the backend request fails:

```text
Request
   ↓
Failure
   ↓
Error State
   ↓
Retry
```

---

## YouTube Failure

If the YouTube tutorial search fails, the video section is omitted and the rest of the learning experience still renders.

---

# 🔄 Request Handling / Stale Responses

The application prevents stale AI results from overwriting newer ones.

When a new quiz generation request starts:

- the previous in-flight request is aborted with `AbortController`
- a request id guard ignores responses that belong to an older request

The user therefore cannot start another generation request until the current request finishes with either:

- a successful result, or
- an error.

As a result, multiple user-triggered AI requests cannot compete to update the same result state.

---

# 🔐 API Key Security

The OpenAI API key is **not exposed in the React frontend**.

The architecture is:

```text
React
  │
  │ HTTP request
  ▼
Node / Express
  │
  │ API key stored server-side
  ▼
OpenAI
```

The frontend communicates with the application's backend instead of directly calling OpenAI.

Environment variables are used for sensitive configuration.

---

# 🗄️ Database

The application uses **Supabase with PostgreSQL**.

```text
React
  │
  ▼
Backend
  │
  ▼
Supabase
  │
  ▼
PostgreSQL
```

Supabase/PostgreSQL is used for the shared leaderboard. Player name, wins and
losses are also cached client-side in `localStorage` so returning players skip
setup.

The leaderboard table uses these columns:

| Column       | Notes                                    |
| ------------ | ---------------------------------------- |
| `name`       | Unique player name (upsert conflict key) |
| `wins`       | Integer, non-negative                    |
| `losses`     | Integer, non-negative                    |
| `updated_at` | ISO timestamp written on each save       |

`GET /api/leaderboard` returns the top 50 rows ordered by wins descending, losses
ascending and `updated_at` ascending. `POST /api/leaderboard` upserts by `name`
and requires a valid Supabase access token from the signed-in user.

> PostgreSQL is the database engine, while SQL is the language used to interact with relational data.

---

# 🏆 Leaderboard Flow

```text
Quiz
  │
  ▼
Calculate Result
  │
  ▼
Save Game Result
  │
  ▼
Supabase / PostgreSQL
  │
  ▼
Leaderboard
  │
  ▼
Leaderboard UI
```

The leaderboard allows users to view game performance after completing quizzes.

---

# 📁 Project Structure

```text
resq_queen/
│
├── api/
│   ├── index.js
│   ├── generate.js
│   ├── leaderboard.js
│   └── learn.js
│
├── public/
│   ├── enemy.webp
│   ├── Enemy_home.webp
│   ├── enemy_queen_captured.webp
│   ├── happy_queen_after_meeting_king.webp
│   ├── King.webp
│   ├── logo.webp
│   ├── sad_queen_with_enemy.webp
│   ├── Sword.webp
│   └── sword_2.webp
│
├── server/
│   ├── app.js
│   │
│   ├── server.js
│   │
│   ├── prompts/
│   │   └── questionPrompt.js
│   │
│   ├── routes/
│   │   ├── generate.js
│   │   ├── leaderboard.js
│   │   └── learn.js
│   │
│   └── services/
│       ├── leaderboardService.js
│       └── llmService.js
│
├── src/
│   ├── App.jsx
│   ├── index.css
│   ├── main.jsx
│   │
│   ├── components/
│   │   ├── AuthScreen.jsx
│   │   ├── ErrorState.jsx
│   │   ├── GameArena.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── Leaderboard.jsx
│   │   ├── LearnPage.jsx
│   │   ├── LoadingState.jsx
│   │   ├── PlayerSetup.jsx
│   │   ├── QuestionCard.jsx
│   │   ├── ResultScreen.jsx
│   │   ├── SplashScreen.jsx
│   │   └── StoryIntro.jsx
│   │
│   ├── data/
│   │   └── story.js
│   │
│   └── lib/
│       ├── api.js
│       ├── storage.js
│       ├── supabase.js
│       └── validateResult.js
│
├── .env.example
├── package.json
└── README.md
```

---

# 🛠️ Tech Stack

## Frontend

- React 18
- Vite
- JavaScript
- React Hooks
- CSS
- Lottie animations (`@lottiefiles/dotlottie-react`)

## Backend

- Node.js
- Express.js
- dotenv

## AI

- OpenAI GPT-4o-mini (quiz generation, Chat Completions)
- OpenAI GPT-5-mini (learning content, Responses API)
- Structured JSON generation
- AI response validation
- AI repair/retry

## Tooling

- Prettier (`npm run format`)

## Database

- Supabase
- PostgreSQL

## External API

- YouTube Data API

## Authentication

- Google Authentication through Supabase

## Deployment

- Vercel

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

- Node.js installed
- npm installed
- OpenAI API key
- Supabase project
- YouTube Data API key

---

## Clone the Repository

```bash
git clone https://github.com/bhuvankk428-spec/resq_queen.git

cd resq_queen
```

---

## Install Dependencies

```bash
npm install
```

All dependencies (frontend and backend) live in the root `package.json`.

---

# 🔑 Environment Variables

Create a `.env` file in the project root by copying the template:

```bash
cp .env.example .env
```

`.env` is gitignored.

```env
# Server-side secrets (never sent to the browser)
OPENAI_API_KEY=your_openai_api_key

YOUTUBE_API_KEY=your_youtube_api_key

SUPABASE_URL=your_supabase_project_url

SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Optional server-side overrides
OPENAI_MODEL=gpt-4o-mini

OPENAI_LEARN_MODEL=gpt-5-mini

PORT=3001

# Frontend configuration (baked into the bundle during `vite build`)
VITE_SUPABASE_URL=your_supabase_url

VITE_SUPABASE_PUBLISHABLE_KEY=your_supabase_publishable_key
```

- `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are used by the leaderboard
  API. Without them the leaderboard routes answer `503` with a clear message.
- `VITE_*` values are only read at build time, so they must also be present in
  Vercel before the frontend is built.
- The frontend does not need any API base URL: it calls same-origin
  `/api/...` paths.

Do not commit real API keys to GitHub.

---

# ▶️ Run the Application

Start the backend:

```bash
npm run server
```

Start the frontend in another terminal:

```bash
npm run dev
```

The Vite development server will provide the local frontend URL, and its proxy
forwards `/api/*` to the backend on `http://localhost:3001`.

---

# 🌐 Deployment (Vercel)

The repository deploys as a single Vercel project:

- `vite build` produces the static frontend in `dist/` (Vercel's default for
  this project).
- Every file in `api/` becomes a Serverless Function, so `/api/generate`,
  `/api/leaderboard` and `/api/learn` are served from the same domain as the
  frontend.
- No `vercel.json` rewrite rules are needed: the frontend calls same-origin
  `/api/...` paths and each route maps directly to a function file.

### Deploy

```bash
npx vercel --prod
```

Or connect the GitHub repository to Vercel and push to `main`.

### Configure environment variables

Add every variable from the Environment Variables section under
**Project Settings → Environment Variables** for Production (and Preview).
`VITE_*` values must exist before the build runs.

### Verify the deployment

```bash
curl https://resq-queen.vercel.app/api/leaderboard
```

- `200` with a JSON array — the backend is connected.
- `503` with a JSON error — server-side Supabase variables are missing.
- `404` — the API functions are not part of the deployment.

---

# 🧪 Testing the Application

The main flows to test are:

### New User

```text
Google Login
→ Name + Topic + Difficulty
→ Story
→ Quiz
→ Win/Loss
→ Homepage
```

### Existing User

```text
Google Login
→ Home
→ Topic + Difficulty
→ Quiz
→ Win/Loss
→ Homepage
```

### Quiz Again

```text
Homepage
→ Topic Input
→ New Quiz
```

### Resume After Refresh

```text
Start a quiz
→ Refresh the page
→ Quiz resumes on the same question
→ Enter fullscreen gate
→ Continue
```

### Fullscreen Enforcement

```text
Start a quiz
→ Leave fullscreen (Esc or browser control)
→ Run ends with an explanatory notice
```

### Learn

```text
Homepage
→ Learn
→ Learning New Topic
→ Topic Input
→ AI Output
```

Verify that the AI output contains:

- Summary
- Key Points
- Learning Cards with examples
- Questions & Answers
- Quiz with instant feedback
- YouTube Video (when available)
- Start Quest carries the topic back to Home

---

# 📱 Mobile Responsiveness

The UI is designed to adapt to smaller screens.

Mobile considerations include:

- Responsive layouts
- Flexible cards
- Responsive quiz components
- Mobile-friendly controls
- Responsive learning sections
- Responsive video presentation

---

# 🤖 AI Usage

AI development tools were used during development for:

- Writing full code from pseudocode that describes the desired behavior in English.
- Animation integration.

---

# 🔒 Known Limitations

### AI and content

- AI-generated content can still occasionally require repair/retry.
- AI response quality depends on the selected topic and model response.
- YouTube tutorial availability depends on the YouTube API and search results. When no embeddable video is found, the video section is hidden.
- Quiz generation requests are aborted with `AbortController`, but learning requests are not cancelled yet.
- The Learn page header still references `/Sword.mp4`, but only webp assets ship in `public/`, so that intro animation may not render.
- AI API usage can incur costs depending on provider usage and account limits.

### Quiz resume and fullscreen enforcement

- **Refreshing during a quiz needs one extra click.** Browsers only allow entering fullscreen from a user gesture, so a reload cannot restore fullscreen by itself. The quiz resumes at the exact question it was left on, then shows a "Fullscreen required" gate; one click continues in fullscreen.
- **F11 (browser-chrome fullscreen) is not detectable.** The Fullscreen API cannot observe the F11 state, so enforcement only reacts to fullscreen entered through the API and to leaving that mode (Esc, or the browser's own exit control).
- **iOS Safari has no Fullscreen API**, so `requestFullscreen` does not exist there. The fullscreen gate and the leave-fullscreen rule disable themselves automatically and the quiz plays exactly as before.
- **Game state and answers are client-side.** Questions (including correct answers), the score, and the saved quiz session live in the bundle and in `localStorage`, so they can be read or edited with browser devtools. The leaderboard is therefore not tamper-proof. This is a property of the original design, not of the resume/fullscreen changes.

---

# 🔮 Future Improvements

Potential improvements include:

- Abort in-flight learning requests as well
- Streaming AI responses
- More learning content types
- Save and reload learning sessions
- Personalized learning history
- More advanced quiz analytics
- More animations
- More detailed player statistics

---

# 💡 Product Design Decision

The application intentionally separates **Game Mode** and **Learn Mode**.

### Game Mode

```text
Topic
 ↓
AI Quiz
 ↓
Gameplay
 ↓
Score
 ↓
Win/Loss
```

### Learn Mode

```text
Topic
 ↓
AI Learning Content
 ↓
Cards
 ↓
Summary
 ↓
Key Points
 ↓
Quiz
 ↓
YouTube Tutorial
```

This allows the same AI capability to support both **learning through gameplay** and **direct topic exploration** without turning the product into a conventional chatbot.

---

# 👨‍💻 Author

**Bhuvan K. K.**

BE — Computer Science Engineering
VTU

GitHub:
https://github.com/bhuvankk428-spec

**Core principle:**

> **The AI generates the content. React turns that content into a reliable interactive experience.**
