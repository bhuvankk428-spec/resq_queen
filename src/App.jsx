import { useEffect, useRef, useState } from "react";

import {
  generateQuestions,
  syncLeaderboard,
} from "./lib/api";

import {
  getPlayer,
  savePlayer,
  recordResult,
  loadQuizSession,
  saveQuizSession,
  clearQuizSession,
} from "./lib/storage";

import { supabase } from "./lib/supabase";

import Splash from "./components/SplashScreen";
import Home from "./components/HomeScreen";
import Setup from "./components/PlayerSetup";
import Story from "./components/StoryIntro";
import Loading from "./components/LoadingState";
import ErrorState from "./components/ErrorState";
import Arena from "./components/GameArena";
import QuestionCard from "./components/QuestionCard";
import Result from "./components/ResultScreen";
import Leaderboard from "./components/Leaderboard";
import AuthScreen from "./components/AuthScreen";
import LearnPage from "./components/LearnPage";


export default function App() {
  

  const [user, setUser] = useState(undefined);

  

  const [session] =
    useState(loadQuizSession);

  const [view, setView] = useState(
    () => session?.view || "splash"
  );


  

  const [player, setPlayer] = useState(null);

  const [name, setName] = useState("");


  

  const [topic, setTopic] = useState(
    () => session?.topic || ""
  );

  const [difficulty, setDifficulty] =
    useState(() => session?.difficulty || "Mixed");


  

  const [questions, setQuestions] =
    useState(() => session?.questions || []);

  const [current, setCurrent] =
    useState(() => session?.current || 0);

  const [score, setScore] =
    useState(() => session?.score || 0);

  const [lives, setLives] =
    useState(() => session?.lives ?? 3);

  const [selected, setSelected] =
    useState(() => session?.selected ?? null);

  const [answered, setAnswered] =
    useState(() => session?.answered === true);

  const [answers, setAnswers] =
    useState(() => session?.answers || []);


  

  const [fsActive, setFsActive] =
    useState(false);

  const [fsGateDismissed, setFsGateDismissed] =
    useState(false);

  const [endReason, setEndReason] =
    useState("");


  

  const [storyStep, setStoryStep] =
    useState(0);


  

  const [error, setError] =
    useState("");


  

  const requestId =
    useRef(0);

  const aborter =
    useRef();

  const playerRef =
    useRef(null);

  const restorePendingRef =
    useRef(session?.answered === true);

  const viewRef = useRef();

  const scoreRef = useRef();

  const fsEnteredRef =
    useRef(false);

  const teardownRef =
    useRef(false);


  viewRef.current = view;

  scoreRef.current = score;


  const fsSupported =
    typeof document !== "undefined" &&
    !!(
      document.documentElement
        .requestFullscreen ||
      document.documentElement
        .webkitRequestFullscreen
    );


  const requestFullscreenNow = (onFail) => {
    try {
      const el = document.documentElement;

      const fn =
        el.requestFullscreen ||
        el.webkitRequestFullscreen;

      if (!fn) {
        onFail?.();
        return;
      }

      const p = fn.call(el);

      if (p && typeof p.catch === "function") {
        p.catch(() => onFail?.());
      }
    } catch {
      onFail?.();
    }
  };


  const leaveFullscreen = () => {
    fsEnteredRef.current = false;

    try {
      const el =
        document.fullscreenElement ||
        document.webkitFullscreenElement;

      if (!el) return;

      const p = (
        document.exitFullscreen ||
        document.webkitExitFullscreen
      )?.call(document);

      if (p && typeof p.catch === "function") {
        p.catch(() => {});
      }
    } catch {
      /* ignore */
    }
  };


  const endQuiz = (reason) => {
    if (
      teardownRef.current ||
      viewRef.current !== "game"
    ) {
      return;
    }


    const saved = playerRef.current;

    const won = scoreRef.current >= 7;


    const updated = saved
      ? recordResult(saved, won)
      : null;


    if (updated) {
      playerRef.current = updated;

      setPlayer(updated);

      syncLeaderboard(updated).catch((e) => {
        console.warn(
          "Leaderboard sync:",
          e.message
        );
      });
    }


    setEndReason(reason || "");

    clearQuizSession();

    leaveFullscreen();

    setView("result");
  };


  

  useEffect(() => {
    playerRef.current = player;
  }, [player]);


  

  useEffect(() => {
    const markGone = () => {
      teardownRef.current = true;
    };

    const onFsChange = () => {
      const active = !!(
        document.fullscreenElement ||
        document.webkitFullscreenElement
      );

      if (active) {
        fsEnteredRef.current = true;

        setFsActive(true);

        return;
      }

      const wasIn = fsEnteredRef.current;

      fsEnteredRef.current = false;

      setFsActive(false);

      if (
        !wasIn ||
        teardownRef.current ||
        viewRef.current !== "game"
      ) {
        return;
      }

      setTimeout(() => {
        if (teardownRef.current) return;

        endQuiz(
          "You left fullscreen mode, so the quest has ended."
        );
      }, 0);
    };


    window.addEventListener("pagehide", markGone);

    window.addEventListener(
      "beforeunload",
      markGone
    );

    document.addEventListener(
      "fullscreenchange",
      onFsChange
    );

    document.addEventListener(
      "webkitfullscreenchange",
      onFsChange
    );

    return () => {
      window.removeEventListener("pagehide", markGone);

      window.removeEventListener(
        "beforeunload",
        markGone
      );

      document.removeEventListener(
        "fullscreenchange",
        onFsChange
      );

      document.removeEventListener(
        "webkitfullscreenchange",
        onFsChange
      );
    };
  }, []);


  

  useEffect(() => {
    if (view !== "game") return;

    if (
      document.fullscreenElement ||
      document.webkitFullscreenElement
    ) {
      return;
    }

    requestFullscreenNow();
  }, [view]);


  

  useEffect(() => {
    if (
      view === "game" ||
      view === "loading" ||
      view === "story"
    ) {
      return;
    }

    leaveFullscreen();
  }, [view]);




  useEffect(() => {
    if (!supabase) {
      setUser(null);
      return;
    }

    supabase.auth
      .getSession()
      .then(({ data }) => {
        setUser(
          data.session?.user || null
        );
      });

    const {
      data: { subscription },
    } =
      supabase.auth.onAuthStateChange(
        (_event, session) => {
          setUser(
            session?.user || null
          );
        }
      );

    return () =>
      subscription.unsubscribe();
  }, []);


  

  useEffect(() => {
    if (!user) return;

    const saved =
      getPlayer(user.id);

    setPlayer(saved);

    setName(
      saved?.playerName ||
        user.user_metadata?.full_name ||
        user.user_metadata?.name ||
        "King"
    );


    const s =
      loadQuizSession();

    if (
      s &&
      s.userId &&
      s.userId !== user.id
    ) {

      setView("splash");

      setTopic("");

      setDifficulty("Mixed");

      setQuestions([]);

      setCurrent(0);

      setScore(0);

      setLives(3);

      setSelected(null);

      setAnswered(false);

      setAnswers([]);
    }
  }, [user]);


  

  useEffect(() => {
    if (!user) return;

    if (view === "game") {

      const stored =
        loadQuizSession();

      if (
        stored &&
        stored.userId &&
        stored.userId !== user.id
      ) {
        return;
      }

      saveQuizSession({
        userId: user.id,

        view,

        topic,

        difficulty,

        questions,

        current,

        score,

        lives,

        answers,

        selected,

        answered,
      });

    } else {

      clearQuizSession();
    }
  }, [
    user,
    view,
    topic,
    difficulty,
    questions,
    current,
    score,
    lives,
    answers,
    selected,
    answered,
  ]);


  

  const start = () => {
    setView(
      player
        ? "home"
        : "setup"
    );
  };


  

  const resetGame = () => {
    setCurrent(0);

    setScore(0);

    setLives(3);

    setSelected(null);

    setAnswered(false);

    setAnswers([]);
  };


  

  const launch = async () => {

    if (!topic.trim()) {
      setError(
        "Please enter a topic before beginning your quest."
      );

      setView("error");

      return;
    }


    clearQuizSession();

    resetGame();

    teardownRef.current = false;

    setFsGateDismissed(false);

    setEndReason("");

    requestFullscreenNow();

    setView("loading");


    const id =
      ++requestId.current;


    

    aborter.current?.abort();

    aborter.current =
      new AbortController();


    try {

      const quest =
        await generateQuestions(
          topic,
          difficulty,
          aborter.current.signal
        );


      

      if (
        id !== requestId.current
      ) {
        return;
      }


      setQuestions(
        quest.questions
      );

      setView("game");

    } catch (e) {

      if (
        id !== requestId.current ||
        e.name === "AbortError"
      ) {
        return;
      }


      setError(
        e.message ||
          "A network error stopped the quest."
      );

      setView("error");
    }
  };



  const setupDone = () => {

    if (
      !name.trim() ||
      !topic.trim()
    ) {

      setError(
        "Please add both your name and a study topic."
      );

      setView("error");

      return;
    }


    const p = {
      userId: user.id,

      playerName:
        name.trim(),

      wins: 0,

      losses: 0,
    };


    savePlayer(p);

    setPlayer(p);

    setStoryStep(0);

    setView("story");
  };


  

  const proceed = (finalScore, finalLives) => {

    if (viewRef.current !== "game") {
      return;
    }


    if (
      finalLives === 0 ||
      current === 9
    ) {

      const saved =
        playerRef.current;


      const updated = saved
        ? recordResult(
            saved,
            finalScore >= 7
          )
        : null;


      if (updated) {

        playerRef.current = updated;

        setPlayer(updated);


        syncLeaderboard(
          updated
        ).catch((e) => {

          console.warn(
            "Leaderboard sync:",
            e.message
          );

        });
      }


      setView("result");

    } else {

      setCurrent(
        (c) => c + 1
      );

      setSelected(null);

      setAnswered(false);
    }
  };


  

  useEffect(() => {
    if (
      !user ||
      !restorePendingRef.current
    ) {
      return;
    }

    const t = setTimeout(() => {
      restorePendingRef.current = false;

      proceed(score, lives);
    }, 5000);

    return () => clearTimeout(t);
  }, [user]);


  

  const answer = (i) => {

    if (answered) {
      return;
    }


    setSelected(i);

    setAnswered(true);


    const correct =
      i ===
      questions[current]
        .correctAnswer;


    const nextScore =
      score +
      (correct ? 1 : 0);


    const nextLives =
      lives -
      (correct ? 0 : 1);


    setScore(nextScore);

    setLives(nextLives);

    setAnswers((prev) => {
      const next = Array.isArray(prev)
        ? [...prev]
        : [];

      next[current] = i;

      return next;
    });


    setTimeout(
      () =>
        proceed(
          nextScore,
          nextLives
        ),
      5000
    );
  };


 

  if (user === undefined) {

    return (
      <main className="state">

        <p>
          Preparing your quest…
        </p>

      </main>
    );
  }


  if (!user) {
    return <AuthScreen />;
  }



  if (view === "splash") {

    return (
      <Splash
        start={start}
      />
    );
  }



  if (view === "setup") {

    return (
      <Setup
        name={name}
        setName={setName}

        topic={topic}
        setTopic={setTopic}

        difficulty={difficulty}
        setDifficulty={
          setDifficulty
        }

        continueToStory={
          setupDone
        }
      />
    );
  }



  if (view === "story") {

    return (
      <Story
        step={storyStep}

        next={() => {

          if (storyStep === 4) {

            launch();

          } else {

            setStoryStep(
              (s) => s + 1
            );

          }

        }}
      />
    );
  }



  if (view === "loading") {
    return <Loading />;
  }


  if (view === "error") {

    return (
      <ErrorState
        error={error}

        retry={launch}

        home={() =>
          setView(
            player
              ? "home"
              : "setup"
          )
        }
      />
    );
  }



  if (view === "home") {

    return (
      <Home
        player={player}

        topic={topic}

        setTopic={setTopic}

        difficulty={difficulty}

        setDifficulty={
          setDifficulty
        }

        

        begin={launch}



        leaderboard={() =>
          setView(
            "leaderboard"
          )
        }


    

        learn={() => {

          console.log(
            "Opening Learning Chamber..."
          );

          setView("learn");

        }}



        logout={async () => {

          await supabase?.auth.signOut();

          clearQuizSession();

          setPlayer(null);

          setView("splash");

        }}
      />
    );
  }



  if (view === "learn") {

    return (
      <LearnPage



        home={() =>
          setView("home")
        }


        startQuest={(
          learnedTopic
        ) => {

        

          if (
            learnedTopic &&
            learnedTopic.trim()
          ) {

            setTopic(
              learnedTopic.trim()
            );

          }



          setView("home");

        }}
      />
    );
  }



  if (
    view === "leaderboard"
  ) {

    return (
      <Leaderboard
        home={() =>
          setView("home")
        }
      />
    );
  }



  if (view === "result") {

    return (
      <Result
        won={
          score >= 7
        }

        score={score}

        lives={lives}

        notice={endReason}

        again={launch}

        home={() =>
          setView("home")
        }
      />
    );
  }



  const showFsGate =
    fsSupported &&
    view === "game" &&
    !fsActive &&
    !fsGateDismissed;


  return (
    <main className="game">

      <Arena
        score={score}
      />

      <QuestionCard
        question={
          questions[current]
        }

        index={current}

        score={score}

        lives={lives}

        selected={selected}

        answered={answered}

        onAnswer={answer}
      />

      {showFsGate && (
        <div className="fs-gate">
          <div className="card fs-gate-card">
            <p className="eyebrow">
              FULLSCREEN REQUIRED
            </p>

            <h2>The quest waits for you</h2>

            <p>
              Save the Queen only runs in fullscreen.
              Entering fullscreen will resume question{" "}
              {current + 1}. Leaving fullscreen ends the
              run.
            </p>

            <button
              onClick={() =>
                requestFullscreenNow(() =>
                  setFsGateDismissed(true)
                )
              }
            >
              Enter fullscreen &amp; continue
            </button>
          </div>
        </div>
      )}

    </main>
  );
}