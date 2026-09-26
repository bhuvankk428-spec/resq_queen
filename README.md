# 👑 Save the Queen

### AI-Powered Interactive Learning & Quiz Platform

**Flam —  Assignment**

Save the Queen is an AI-powered interactive learning and quiz application built with React. Instead of behaving like a chatbot, the application uses AI to generate **structured JSON data** that is validated and transformed into interactive UI components.

The application combines a story-driven quiz game with an AI-powered learning mode where users can enter any topic and receive structured learning content including cards, summaries, key points, quizzes, and YouTube tutorials.

---

## 🚀 Quick Links

* **Live Demo:** https://resq-queen.vercel.app/
* **GitHub Repository:** https://github.com/bhuvankk428-spec/resq_queen

* **Live Demoestration and youtube explaination:** https://youtu.be/63IO5uWvjC4

---

# 📌 Project Overview

The core idea is to turn AI-generated information into an **interactive product rather than a chatbot**.

The application has two main experiences:

### 🎮 Game Mode

Users select a topic and difficulty and play an AI-generated quiz.

The goal is to answer **7 out of 10 questions correctly** and rescue the queen.

### 📚 Learn Mode

Users can enter a new topic and receive structured AI-generated learning material:

* Learning Cards
* Summary
* Key Points
* Interactive Quiz
* YouTube Tutorial Video

The AI response is parsed and validated before it is rendered by React.

---

# ✨ Features

## 🎮 Interactive Quiz Game

* Google authentication
* Player name, topic and difficulty input
* AI-generated quiz questions
* 10-question quiz
* Lives-based gameplay
* Score tracking
* Win/Loss state
* Queen rescue objective
* New user story introduction
* Existing users skip the story
* Restart quiz with a new topic
* Leaderboard

## 📚 AI Learning Mode

Users can enter any topic and generate:

* Learning cards
* Topic summary
* Key points
* Quiz questions
* Quiz score
* Retry quiz
* Progress indicator
* YouTube tutorial
* YouTube search fallback

## 🤖 AI Integration

* OpenAI GPT-4o-mini (quiz) and GPT-5-mini (learning)
* Structured JSON responses
* JSON parsing
* Response validation
* Invalid response detection
* AI repair/retry mechanism
* Backend API proxy
* API key protection

## 🛡️ Error Handling

The application handles:

* Malformed JSON
* Invalid response shape
* Missing sections
* Invalid quiz options
* Invalid quiz answers
* Empty AI responses
* OpenAI failures
* YouTube API failures
* YouTube fallback
* Network errors
* Request timeouts
* Loading states
* Error states
* Empty states
* Retry states

## 📱 Responsive UI

The application is designed to work across:

* Desktop
* Tablet
* Mobile


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
                 ▼                             │
          ┌─────────────┐                      │
          │    Story    │                      │
          └──────┬──────┘                      │
                 │                             │
                 └──────────────┬──────────────┘
                                │
                                ▼
                       ┌─────────────────┐
                       │   Player Input  │
                       │                 │
                       │ Name            │
                       │ Topic           │
                       │ Difficulty      │
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
             │             │       Users / Scores /
             │             │       Game Results /
             │             │       Leaderboard
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

* Authentication state
* User input
* Game state
* Quiz interaction
* Score and lives
* Story presentation
* Learning interface
* Loading and error states
* Leaderboard UI
* Responsive UI

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

| Route              | Purpose                               |
| ------------------ | ------------------------------------- |
| `/api/generate`    | Generates quiz questions              |
| `/api/learn`       | Generates structured learning content |
| `/api/leaderboard` | Handles leaderboard data              |

The backend keeps the OpenAI API key server-side instead of exposing it in the React application.

---

# 🎮 Game Mode Architecture

```text
Google Login
     │
     ▼
Check User
     │
     ├───────────────┐
     │               │
  New User       Existing User
     │               │
     ▼               │
   Story             │
     │               │
     └───────┬───────┘
             ▼
      Player Setup
             │
       ┌─────┼─────┐
       ▼     ▼     ▼
      Name  Topic Difficulty
             │
             ▼
       Generate Quiz
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
     ┌───────┼─────────┐
     │       │         │
     ▼       ▼         ▼
   Topic   Leader-   Logout
  Input    board
     │
     ▼
 Quiz Again
```

### Game Objective

The player answers 10 AI-generated questions.

* Correct answers increase the score.
* Incorrect answers reduce lives.
* **7 correct answers out of 10** are required to rescue the queen.
* The result screen displays the final Win/Loss state.
* After the game, the user returns to the Homepage.

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
 │ Learning Cards           │
 │ Summary                  │
 │ Key Points               │
 │ Quiz                     │
 │ YouTube Tutorial Video   │
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
  "topic": "Computer Networks",
  "summary": "Computer networks allow devices to communicate...",
  "keyPoints": [
    "Networks connect multiple devices",
    "TCP provides reliable communication",
    "IP handles addressing and routing"
  ],
  "cards": [
    {
      "question": "What is TCP?",
      "answer": "A connection-oriented transport protocol."
    }
  ],
  "quiz": [
    {
      "question": "Which protocol provides reliable transport?",
      "options": [
        "TCP",
        "IP",
        "DNS",
        "HTTP"
      ],
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

* Valid JSON
* Expected object structure
* Required fields
* Required arrays
* Valid learning cards
* Valid quiz questions
* Valid quiz options
* Valid answers
* Non-empty sections

Invalid data is not blindly rendered.

Instead, it can be routed through the repair/retry process or shown through an appropriate error state.

---

# 🔧 AI Repair / Retry

If the model returns incomplete or invalid structured data, the backend can attempt to repair the response.

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

* cards
* summary
* key points
* quiz

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

If the YouTube tutorial search fails, the application uses a fallback search approach rather than allowing the entire learning experience to fail.

---

#  Request Handling / Stale Responses

The application prevents stale AI results from overwriting newer ones.

When a new quiz generation request starts:

* the previous in-flight request is aborted with `AbortController`
* a request id guard ignores responses that belong to an older request

The user therefore cannot start another generation request until the current request finishes with either:

* a successful result, or
* an error.

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

Supabase/PostgreSQL is used for persistent application data such as:

* Player information
* Game results
* Scores
* Leaderboard data

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
│   ├── enemy.png
│   ├── Enemy_home.png
│   ├── enemy_queen_captured.png
│   ├── happy_queen_after_meeting_king.png.png
│   ├── King.png
│   ├── logo.png
│   ├── sad_queen_with_enemy.png
│   ├── Sword.mp4
│   └── sword.png
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

* React
* Vite
* JavaScript
* React Hooks
* CSS

## Backend

* Node.js
* Express.js

## AI

* OpenAI GPT-4o-mini (quiz generation)
* OpenAI GPT-5-mini (learning content)
* Structured JSON generation
* AI response validation
* AI repair/retry

## Database

* Supabase
* PostgreSQL

## External API

* YouTube Data API

## Authentication

* Google Authentication through Supabase

## Deployment

* Vercel

---

# 🚀 Getting Started

## Prerequisites

Make sure you have:

* Node.js installed
* npm installed
* OpenAI API key
* Supabase project
* YouTube Data API key

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

* `SUPABASE_URL` and `SUPABASE_SERVICE_ROLE_KEY` are used by the leaderboard
  API. Without them the leaderboard routes answer `503` with a clear message.
* `VITE_*` values are only read at build time, so they must also be present in
  Vercel before the frontend is built.
* The frontend does not need any API base URL: it calls same-origin
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

* `vite build` produces the static frontend in `dist/` (Vercel's default for
  this project).
* Every file in `api/` becomes a Serverless Function, so `/api/generate`,
  `/api/leaderboard` and `/api/learn` are served from the same domain as the
  frontend.
* No `vercel.json` rewrite rules are needed: the frontend calls same-origin
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

* `200` with a JSON array — the backend is connected.
* `503` with a JSON error — server-side Supabase variables are missing.
* `404` — the API functions are not part of the deployment.

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
→ Name + Topic + Difficulty
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

### Learn

```text
Homepage
→ Learn
→ Learning New Topic
→ Topic Input
→ AI Output
```

Verify that the AI output contains:

* Cards
* Summary
* Key Points
* Quiz
* YouTube Video

---

# 📱 Mobile Responsiveness

The UI is designed to adapt to smaller screens.

Mobile considerations include:

* Responsive layouts
* Flexible cards
* Responsive quiz components
* Mobile-friendly controls
* Responsive learning sections
* Responsive video presentation

---

# 🤖 AI Usage

AI development tools were used during development for:

* Debugging React and backend issues
* Writing full code if peudocode with what needs to be done is given in english.
* Troubleshooting deployment issues.
* Animations integration.

---

# 🔒 Known Limitations

### AI and content

* AI-generated content can still occasionally require repair/retry.
* AI response quality depends on the selected topic and model response.
* YouTube tutorial availability depends on the YouTube API and search results.
* Quiz generation requests are aborted with `AbortController`, but learning requests are not cancelled yet.

* AI API usage can incur costs depending on provider usage and account limits.

### Quiz resume and fullscreen enforcement

* **Refreshing during a quiz needs one extra click.** Browsers only allow entering fullscreen from a user gesture, so a reload cannot restore fullscreen by itself. The quiz resumes at the exact question it was left on, then shows a "Fullscreen required" gate; one click continues in fullscreen.
* **F11 (browser-chrome fullscreen) is not detectable.** The Fullscreen API cannot observe the F11 state, so enforcement only reacts to fullscreen entered through the API and to leaving that mode (Esc, or the browser's own exit control).
* **iOS Safari has no Fullscreen API**, so `requestFullscreen` does not exist there. The fullscreen gate and the leave-fullscreen rule disable themselves automatically and the quiz plays exactly as before.
* **Game state and answers are client-side.** Questions (including correct answers), the score, and the saved quiz session live in the bundle and in `localStorage`, so they can be read or edited with browser devtools. The leaderboard is therefore not tamper-proof. This is a property of the original design, not of the resume/fullscreen changes.
* **The resume/fullscreen work in `App.jsx` includes incidental whitespace churn** from formatting. It is cosmetic only and does not affect behavior.

---

# 🔮 Future Improvements

Potential improvements include:

* Abort in-flight learning requests as well
* Streaming AI responses
* More learning content types
* Save and reload learning sessions
* Personalized learning history
* More advanced quiz analytics
* More animations
* More detailed player statistics

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
