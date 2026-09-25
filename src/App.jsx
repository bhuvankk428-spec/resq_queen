import { useEffect, useRef, useState } from "react";

import {
  generateQuestions,
  syncLeaderboard,
} from "./lib/api";

import {
  getPlayer,
  savePlayer,
  recordResult,
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

  

  const [view, setView] = useState("splash");


  

  const [player, setPlayer] = useState(null);

  const [name, setName] = useState("");


  

  const [topic, setTopic] = useState("");

  const [difficulty, setDifficulty] =
    useState("Mixed");


  

  const [questions, setQuestions] =
    useState([]);

  const [current, setCurrent] =
    useState(0);

  const [score, setScore] =
    useState(0);

  const [lives, setLives] =
    useState(3);

  const [selected, setSelected] =
    useState(null);

  const [answered, setAnswered] =
    useState(false);


  

  const [storyStep, setStoryStep] =
    useState(0);


  

  const [error, setError] =
    useState("");


  

  const requestId =
    useRef(0);

  const aborter =
    useRef();


  

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
  }, [user]);


  

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
  };


  

  const launch = async () => {

    if (!topic.trim()) {
      setError(
        "Please enter a topic before beginning your quest."
      );

      setView("error");

      return;
    }


    resetGame();

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


    

    setTimeout(() => {

      
      if (
        nextLives === 0 ||
        current === 9
      ) {

        const updated =
          recordResult(
            player,
            nextScore >= 7
          );


        setPlayer(updated);


        syncLeaderboard(
          updated
        ).catch((e) => {

          console.warn(
            "Leaderboard sync:",
            e.message
          );

        });


        setView("result");

      } else {

       

        setCurrent(
          (c) => c + 1
        );

        setSelected(null);

        setAnswered(false);
      }

    }, 5000);
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

        again={launch}

        home={() =>
          setView("home")
        }
      />
    );
  }



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

    </main>
  );
}