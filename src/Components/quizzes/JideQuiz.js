import React, { useState, useEffect } from "react";
import {
  doc,
  getDoc,
  setDoc,
  updateDoc,
  increment,
} from "firebase/firestore";
import { onAuthStateChanged } from "firebase/auth";
import { useNavigate } from "react-router-dom";
import { auth, db } from "../../firebase";

// === QUESTIONS: FIXED ORDER, RANDOM CORRECT ANSWER ===
const questions = [
  {
    question: "What was Jide’s dream in the story?",
    options: [
      "A) To buy a new football",
      "B) To own a Super Eagles jersey with Osimhen’s name",
      "C) To play for a football team",
    ],
    answer: 1, // B
    explanation: "Jide dreamed of owning a green Super Eagles jersey with the number '9' and 'OSIMHEN' on the back, costing ₦8,000.",
  },
  {
    question: "Where did Jide work to earn his money?",
    options: [
      "A) At a sports shop",
      "B) At his mother’s food stall in Obalende market",
      "C) At a school canteen",
    ],
    answer: 1, // B
    explanation: "Jide earned money by helping his mother at her food stall after school, saving ₦4,500 in a biscuit tin.",
  },
  {
    question: "How much had Jide saved in his biscuit tin at the start?",
    options: ["A) ₦2,000", "B) ₦4,500", "C) ₦8,000"],
    answer: 1, // B
    explanation: "Jide had saved ₦4,500 from helping his mother.",
  },
  {
    question: "Who tempted Jide with a faster way to make money?",
    options: ["A) His mother", "B) Tunde", "C) His father"],
    answer: 1, // B
    explanation: "Tunde, an older boy, tempted Jide with “faster ways” to make money, planting the idea of a shortcut.",
  },
  {
    question: "What was Tunde’s “fast money” game?",
    options: [
      "A) Selling meat pies",
      "B) Shuffling three cups with a stone",
      "C) Playing football for bets",
    ],
    answer: 1, // B
    explanation: "Tunde ran a game with three tin cups and a stone, promising, promising to double money if players picked the right cup.",
  },
  {
    question: "How much money did Jide use to try Tunde’s game the first time?",
    options: ["A) ₦200", "B) ₦500", "C) ₦1,000"],
    answer: 0, // A
    explanation: "Jide used ₦200, meant for a snack, to try Tunde’s game and won ₦400.",
  },
  {
    question: "What happened when Jide first played Tunde’s game?",
    options: [
      "A) He lost his money",
      "B) He doubled his money to ₦400",
      "C) He refused to play",
    ],
    answer: 1, // B
    explanation: "Jide won ₦400 when he correctly picked the middle cup, making the game seem easy.",
  },
  {
    question: "What did Jide do with the ₦400 he won?",
    options: [
      "A) Spent it on a snack",
      "B) Saved it in his biscuit tin",
      "C) Gave it to Tunde",
    ],
    answer: 1, // B
    explanation: "Jide saved the ₦400 he won, which fueled his idea to risk more money in the game.",
  },
  {
    question: " ulteriore Why did Jide decide to risk all his savings?",
    options: [
      "A) To help his mother",
      "B) To turn ₦4,500 into ₦9,000",
      "C) To buy new sandals",
    ],
    answer: 1, // B
    explanation: "Jide thought he could double his ₦4,500 savings to ₦9,000 to buy the jersey and have extra money.",
  },
  {
    question: "How much money did Jide risk in Tunde’s game the second time?",
    options: ["A) ₦200", "B) ₦4,500", "C) ₦8,000"],
    answer: 1, // B
    explanation: "Jide risked all his ₦4,500 savings, hoping to double it.",
  },
  {
    question: "What happened when Jide played Tunde’s game with all his savings?",
    options: [
      "A) He won ₦9,000",
      "B) He lost all his money",
      "C) The game was stopped",
    ],
    answer: 1, // B
    explanation: "Jide lost his entire ₦4,500 when he picked the wrong cup, leaving him with nothing.",
  },
  {
    question: "How did Jide feel after losing his savings?",
    options: [
      "A) Excited and hopeful",
      "B) Ashamed and empty",
      "C) Angry at his mother",
    ],
    answer: 1, // B
    explanation: "Jide felt ashamed and empty, taking a slow walk home with heavy, empty pockets.",
  },
  {
    question: "What did Jide’s father say about shortcuts?",
    options: [
      "A) “Shortcuts are always safe.”",
      "B) “Shortcuts are where snakes hide.”",
      "C) “Shortcuts make you rich.”",
    ],
    answer: 1, // B
    explanation: "Jide’s father warned that shortcuts often lead to trouble, saying, “Shortcuts are where snakes hide.”",
  },
  {
    question: "What did Jide’s father say about honest work?",
    options: [
      "A) It builds a house",
      "B) It’s too slow",
      "C) It’s not worth it",
    ],
    answer: 0, // A
    explanation: "Jide’s father said money from honest work “builds a house,” meaning it creates lasting value.",
  },
  {
    question: "What did Jide do after confessing to his father?",
    options: [
      "A) Stopped working",
      "B) Asked to work at his mother’s stall again",
      "C) Played Tunde’s game again",
    ],
    answer: 1, // B
    explanation: "Jide apologized to his mother and asked to work at her stall again, starting from zero.",
  },
  {
    question: "How did Jide come up with a new way to earn money?",
    options: [
      "A) By noticing thirsty shoppers",
      "B) By copying Tunde’s game",
      "C) By asking his father for ideas",
    ],
    answer: 0, // A
    explanation: "Jide noticed hot, tired shoppers and decided to sell ice blocks and water to meet their needs.",
  },
  {
    question: "What did Jide call himself when selling water?",
    options: [
      "A) Jide the Water Boy",
      "B) Jide the Market King",
      "C) Jide the Football Star",
    ],
    answer: 0, // A
    explanation: "Jide became “Jide the Water Boy,” selling cold water to thirsty customers in the market.",
  },
  {
    question: "How much money did Jide borrow from his mother to start?",
    options: ["A) ₦200", "B) ₦500", "C) ₦1,000"],
    answer: 1, // B
    explanation: "Jide borrowed ₦500 from his mother to buy ice blocks and water sachets for his business.",
  },
  {
    question: "How did Jide save to finally buy the jersey?",
    options: ["A) ₦4,500", "B) ₦8,000", "C) ₦9,000"],
    answer: 1, // B
    explanation: "After weeks of selling water, Jide saved ₦8,000, enough to buy the Super Eagles jersey.",
  },
  {
    question: "What was the real prize Jide gained?",
    options: [
      "A) The Super Eagles jersey",
      "B) The wisdom of honest work",
      "C) Tunde’s friendship",
    ],
    answer: 1, // B
    explanation: "While Jide got the jersey, the real prize was the wisdom he gained about earning money honestly.",
  },
];

// === COMPONENT ===
const JideQuiz = () => {
  const [user, setUser] = useState(null);
  const [current, setCurrent] = useState(0);
  const [options, setOptions] = useState(
    questions[0].options.map((opt, idx) => ({
      text: opt,
      isCorrect: idx === questions[0].answer,
    }))
  );
  const [selected, setSelected] = useState(null);
  const [score, setScore] = useState(0);
  const [showExplanation, setShowExplanation] = useState(false);
  const [finished, setFinished] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const unsub = onAuthStateChanged(auth, (u) => setUser(u));
    return () => unsub();
  }, []);

  const handleSelect = async (option, idx) => {
    if (selected !== null) return;
    setSelected(idx);
    setShowExplanation(true);

    if (option.isCorrect) {
      setScore((p) => p + 1);
      if (user) {
        const userRef = doc(db, "users", user.uid);
        await updateDoc(userRef, {
          points: increment(1),
          "quizProgress.totalCorrect": increment(1),
        });
      }
    }
  };

  const handleNext = async () => {
    const next = current + 1;
    if (next < questions.length) {
      setCurrent(next);
      setOptions(
        questions[next].options.map((opt, idx) => ({
          text: opt,
          isCorrect: idx === questions[next].answer,
        }))
      );
      setSelected(null);
      setShowExplanation(false);
    } else {
      setFinished(true);

      if (user) {
        const userRef = doc(db, "users", user.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists() || !snap.data().quizProgress) {
            await setDoc(
              userRef,
              { quizProgress: { totalCorrect: 0, totalQuestions: 0 } },
              { merge: true }
            );
          }

          await updateDoc(userRef, {
            "quizProgress.totalQuestions": increment(questions.length),
            virtualBalance: increment(score), // 1 coin per correct
          });
        } catch (err) {
          console.error("Failed to save quiz progress:", err);
        }
      }
    }
  };

  const handleRestart = () => {
    setScore(0);
    setCurrent(0);
    setOptions(
      questions[0].options.map((opt, idx) => ({
        text: opt,
        isCorrect: idx === questions[0].answer,
      }))
    );
    setSelected(null);
    setShowExplanation(false);
    setFinished(false);
  };

  const percentage = Math.round((score / questions.length) * 100);
  const message =
    percentage >= 80
      ? "Excellent! You really understood Jide’s story."
      : percentage >= 50
      ? "Nice effort! You learned a lot, keep it up!"
      : "Don’t worry! Try again to learn more.";

  if (finished) {
    return (
      <div
        style={{
          maxWidth: "500px",
          margin: "40px auto",
          padding: "20px",
          textAlign: "center",
          backgroundColor: "white",
          borderRadius: "10px",
          boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
          borderTop: "4px solid #007bff",
        }}
      >
        <h2 style={{ color: "#007bff", fontSize: "22px", marginBottom: "10px" }}>
          Quiz Complete
        </h2>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>
          This quiz: {score} / {questions.length}
        </p>
        <p style={{ color: "#555", marginBottom: "10px" }}>
          ({percentage}%)
        </p>
        <p style={{ fontWeight: "500", color: "#333", marginBottom: "20px" }}>
          {message}
        </p>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            gap: "10px",
            flexWrap: "wrap",
          }}
        >
          <button
            onClick={handleRestart}
            style={{
              backgroundColor: "#007bff",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Retake Quiz
          </button>

          <button
            onClick={() => navigate("/home")}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "10px 20px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer",
            }}
          >
            Deposit {score} Coins & Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div
      style={{
        maxWidth: "500px",
        margin: "30px auto",
        padding: "20px",
        textAlign: "center",
        backgroundColor: "white",
        borderRadius: "10px",
        boxShadow: "0 2px 10px rgba(0,0,0,0.1)",
        borderTop: "4px solid #007bff",
      }}
    >
      <h2 style={{ color: "#333", fontSize: "18px", marginBottom: "10px" }}>
        Question {current + 1} of {questions.length}
      </h2>
      <p style={{ color: "#555", marginBottom: "15px", fontWeight: "500" }}>
        {questions[current].question}
      </p>

      <ul style={{ listStyle: "none", padding: 0 }}>
        {options.map((opt, idx) => (
          <li key={idx} style={{ margin: "10px 0" }}>
            <button
              onClick={() => handleSelect(opt, idx)}
              disabled={selected !== null}
              style={{
                backgroundColor:
                  selected !== null
                    ? opt.isCorrect
                      ? "#28a745"
                      : selected === idx
                      ? "#dc3545"
                      : "#007bff"
                    : "#007bff",
                color: "white",
                padding: "10px 20px",
                border: "none",
                borderRadius: "5px",
                cursor: selected !== null ? "default" : "pointer",
                width: "100%",
                maxWidth: "300px",
              }}
            >
              {opt.text}
            </button>
          </li>
        ))}
      </ul>

      {showExplanation && (
        <div
          style={{
            marginTop: "15px",
            backgroundColor: "#f0f8ff",
            borderLeft: "4px solid #007bff",
            padding: "10px",
            borderRadius: "5px",
            color: "#333",
          }}
        >
          <strong>Explanation:</strong> {questions[current].explanation}
        </div>
      )}

      {selected !== null && (
        <button
          onClick={handleNext}
          style={{
            marginTop: "20px",
            backgroundColor: "#007bff",
            color: "white",
            padding: "10px 20px",
            border: "none",
            borderRadius: "5px",
            cursor: "pointer",
          }}
        >
          {current + 1 === questions.length ? "Finish Quiz" : "Next Question"}
        </button>
      )}
    </div>
  );
};

export default JideQuiz;