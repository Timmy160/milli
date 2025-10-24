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
    question: "What was Ada’s financial goal in the story?",
    options: [
      "A) To buy a new storybook",
      "B) To save ₦15,000 for a pink bicycle",
      "C) To start a puff-puff stall",
    ],
    answer: 1, // B
    explanation: "Ada wanted to buy a pink bicycle costing ₦15,000, which she saw in the market.",
  },
  {
    question: "How much pocket money did Ada receive daily from her father?",
    options: ["A) ₦200", "B) ₦500", "C) ₦1,000"],
    answer: 1, // B
    explanation: "Ada’s father gave her ₦500 daily for food and small things at school.",
  },
  {
    question: "How much of her daily pocket money did Ada save for her bicycle?",
    options: ["A) ₦200", "B) ₦300", "C) ₦500"],
    answer: 1, // B
    explanation: "Ada saved ₦300 of her ₦500 daily pocket money, keeping ₦200 for snacks.",
  },
  {
    question: "What financial habit did Ada develop to reach her goal?",
    options: [
      "A) Spending all her money on snacks",
      "B) Saving before spending",
      "C) Borrowing money from friends",
    ],
    answer: 1, // B
    explanation: "Ada learned to save ₦300 daily before spending, which helped her make progress toward her bicycle.",
  },
  {
    question: "Why did Ada’s friends call her stingy?",
    options: [
      "A) She stopped buying snacks like Fanta and meat pie",
      "B) She wouldn’t share her storybooks",
      "C) She refused to play ten-ten",
    ],
    answer: 0, // A
    explanation: "Ada’s friends thought she was stingy because she cut back on buying snacks to save for her bicycle.",
  },
  {
    question: "What did Mama Rose give Ada to help her save?",
    options: [
      "A) A piggy bank shaped like a house",
      "B) A new notebook for drawing",
      "C) A basket for puff-puff",
    ],
    answer: 0, // A
    explanation: "Mama Rose gave Ada a blue piggy bank shaped like a house to store her savings.",
  },
  {
    question: "How did Ada earn ₦200 from Mama Nkechi?",
    options: [
      "A) By selling puff-puff",
      "B) By helping carry Mama Nkechi’s tray",
      "C) By drawing a picture for the stall",
    ],
    answer: 1, // B
    explanation: "Ada earned ₦200 by helping Mama Nkechi carry her heavy tray to the puff-puff stall.",
  },
  {
    question: "What did Ada do when tempted to buy puff-puff with her ₦200?",
    options: [
      "A) Bought the puff-puff",
      "B) Saved it in her piggy bank",
      "C) Gave it to her friend",
    ],
    answer: 1, // B
    explanation: "Ada resisted buying puff-puff and saved the ₦200, prioritizing her bicycle goal.",
  },
  {
    question: "How much money did Ada receive as birthday gifts?",
    options: ["A) ₦2,000", "B) ₦4,000", "C) ₦6,000"],
    answer: 1, // B
    explanation: "Ada collected ₦4,000 from her uncles and aunties during her eleventh birthday celebration.",
  },
  {
    question: "What did Ada do with her birthday money?",
    options: [
      "A) Spent it on Fanta and sweets",
      "B) Saved it in her piggy bank",
      "C) Bought a new storybook",
    ],
    answer: 1, // B
    explanation: "Ada saved all ₦4,000 of her birthday money in her piggy bank for her bicycle.",
  },
  {
    question: "How did Ada use her drawing talent to earn money?",
    options: [
      "A) By teaching art at school",
      "B) By making birthday cards for ₦100 each",
      "C) By selling drawings to Mama Nkechi",
    ],
    answer: 1, // B
    explanation: "Ada earned ₦700 by making birthday cards for her classmates at ₦100 each.",
  },
  {
    question: "What financial lesson did Ada learn from making birthday cards?",
    options: [
      "A) Talents can help you earn money",
      "B) Borrowing is the best way to earn",
      "C) Spending is better than saving",
    ],
    answer: 0, // A
    explanation: "Ada learned that using her drawing talent could earn extra money to grow her savings.",
  },
  {
    question: "What tempted Ada when she went to buy soap?",
    options: [
      "A) A shiny new storybook",
      "B) A bag of puff-puff",
      "C) A new school bag",
    ],
    answer: 0, // A
    explanation: "Ada was tempted by a colourful storybook but chose not to buy it to stay focused on her goal.",
  },
  {
    question: "What did Mama Rose say about resisting temptation?",
    options: [
      "A) “Temptation makes you stronger.”",
      "B) “Patience is the seed of success.”",
      "C) “Buy what you want today.”",
    ],
    answer: 1, // B
    explanation: "Mama Rose told Ada that patience is key to achieving dreams by saying no to small temptations.",
  },
  {
    question: "How much had Ada saved after three months?",
    options: ["A) ₦5,000", "B) ₦10,500", "C) ₦15,000"],
    answer: 1, // B
    explanation: "Ada counted ₦10,500 in her piggy bank after three months of saving.",
  },
  {
    question: "How much more did Ada need to buy the bicycle after saving ₦10,500?",
    options: ["A) ₦4,500", "B) ₦2,000", "C) ₦7,000"],
    answer: 0, // A
    explanation: "The bicycle cost ₦15,000, so Ada needed ₦4,500 more after saving ₦10,500.",
  },
  {
    question: "Who gave Ada ₦500 to add to her savings?",
    options: ["A) Her father", "B) Mama Nkechi", "C) Her teacher"],
    answer: 1, // B
    explanation: "Mama Nkechi gave Ada ₦500 after being inspired by her discipline and savings.",
  },
  {
    question: "What did Ada’s father contribute to her bicycle goal?",
    options: ["A) ₦500", "B) ₦4,000", "C) ₦11,000"],
    answer: 1, // B
    explanation: "Ada’s father added ₦4,000 to her ₦11,000 savings to help her buy the ₦15,000 bicycle.",
  },
  {
    question: "What financial lesson Ada learn about patience?",
    options: [
      "A) Money grows slowly, like maize",
      "B) Rushing is the best way to succeed",
      "C) Saving is not important",
    ],
    answer: 0, // A
    explanation: "Ada learned that money grows slowly with patience, just like maize in a farm, as Mama Rose taught her.",
  },
  {
    question: "What was the most important financial lesson from Ada’s story?",
    options: [
      "A) Spending money is the key to happiness",
      "B) Saving and discipline make dreams come true",
      "C) Only gifts can help you reach goals",
    ],
    answer: 1, // B
    explanation: "Ada’s journey showed that saving, discipline, and hard work are essential to achieving big dreams like her bicycle.",
  },
];

// === COMPONENT ===
const AdaQuiz = () => {
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
      ? "Excellent! You really understood Ada’s story."
      : percentage >= 50
      ? "Great effort! Keep learning!"
      : "Don’t give up! Try again.";

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

export default AdaQuiz;