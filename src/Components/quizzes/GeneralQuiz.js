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

function shuffleOptions(options, answerIndex) {
  const arr = options.map((option, idx) => ({
    text: option,
    isCorrect: idx === answerIndex,
  }));
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

const questions = [
  {
    question: "What should you do with 10% of your money?",
    options: ["Spend it all", "Save it", "Give it away"],
    answer: 1,
    explanation: "Saving helps your money grow over time!",
  },
  {
    question: "True or False: Failures are bad.",
    options: ["True", "False"],
    answer: 1,
    explanation: "Failures are chances to learn and get better.",
  },
  {
    question: "What's a 'need'?",
    options: ["A toy", "Food and water", "A video game"],
    answer: 1,
    explanation: "Needs are things you must have to live.",
  },
  {
    question: "How can you earn money as a kid?",
    options: ["By playing games", "Doing chores", "Watching TV"],
    answer: 1,
    explanation: "Chores like cleaning can earn allowance.",
  },
  {
    question: "What does 'invest' mean?",
    options: ["Spend now", "Put money to work to make more", "Hide money"],
    answer: 1,
    explanation: "Like planting a seed to grow a tree.",
  },
  {
    question: "True or False: Goals help you succeed.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Goals give you a target to aim for.",
  },
  {
    question: "What's a budget?",
    options: ["A game", "A plan for money", "A toy"],
    answer: 1,
    explanation: "It tells you how to spend and save.",
  },
  {
    question: "Why share with others?",
    options: ["To lose money", "To build friendships and success", "To eat less"],
    answer: 1,
    explanation: "Helping others can lead to help in return.",
  },
  {
    question: "What is persistence?",
    options: ["Giving up", "Trying again and again", "Sleeping"],
    answer: 1,
    explanation: "Like climbing a hill—keep going!",
  },
  {
    question: "True or False: Money grows in banks.",
    options: ["True", "False"],
    answer: 0,
    explanation: "With interest, it can grow a little.",
  },
  {
    question: "What's an entrepreneur?",
    options: ["Someone who watches TV", "Someone who starts a business", "A teacher"],
    answer: 1,
    explanation: "Like selling lemonade to make money.",
  },
  {
    question: "Why read books on success?",
    options: ["To sleep", "To learn from others' stories", "To play"],
    answer: 1,
    explanation: "Books share secrets to being rich and happy.",
  },
  {
    question: "What is debt?",
    options: ["Free money", "Borrowed money you must pay back", "A gift"],
    answer: 1,
    explanation: "Avoid bad debt; it's like owing a friend.",
  },
  {
    question: "True or False: Attitude matters for success.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Positive thinking helps you achieve more.",
  },
  {
    question: "What's compound interest?",
    options: ["Simple math", "Money earning money on itself", "A game"],
    answer: 1,
    explanation: "Like a snowball growing bigger.",
  },
  {
    question: "Why set small goals first?",
    options: ["To fail", "To build confidence with wins", "To forget big ones"],
    answer: 1,
    explanation: "Small wins lead to big successes.",
  },
  {
    question: "What is generosity?",
    options: ["Keeping everything", "Sharing with others", "Hiding toys"],
    answer: 1,
    explanation: "It makes you and others happy.",
  },
  {
    question: "True or False: Learning never stops.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Successful people always learn new things.",
  },
  {
    question: "What's a side hustle for kids?",
    options: ["Napping", " Selling crafts", "Watching cartoons"],
    answer: 1,
    explanation: "Extra ways to earn, like drawing pictures.",
  },
  {
    question: "Why track spending?",
    options: ["To lose money", "To see where it goes and save more", "To buy more"],
    answer: 1,
    explanation: "Like a map for your money journey.",
  },
];

function GeneralQuiz() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);
  const navigate = useNavigate();

  // Shuffle questions on mount
  useEffect(() => {
    const shuffleQuestions = [...questions].sort(() => Math.random() - 0.5);
    const shuffled = shuffleQuestions.map((q) => {
      const shuffledOpts = shuffleOptions(q.options, q.answer);
      return {
        ...q,
        options: shuffledOpts.map((opt) => opt.text),
        answer: shuffledOpts.findIndex((opt) => opt.isCorrect),
      };
    });
    setShuffledQuestions(shuffled);
  }, []);

  // Auth listener
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  const handleAnswer = async (selectedIndex) => {
    if (showFeedback || !shuffledQuestions.length) return;

    setSelectedOption(selectedIndex);
    setShowFeedback(true);

    const isCorrect = selectedIndex === shuffledQuestions[currentQuestion].answer;

    if (isCorrect) {
      setScore((prev) => prev + 1);

      // Award coin for correct answer
      if (currentUser) {
        const userRef = doc(db, "users", currentUser.uid);
        try {
          const snap = await getDoc(userRef);
          if (!snap.exists()) {
            await setDoc(userRef, { coins: 1 });
          } else {
            await updateDoc(userRef, { coins: increment(1) });
          }
        } catch (err) {
          console.error("Coin update failed:", err);
        }
      }
    }

    // Move to next question after delay
    setTimeout(() => {
      const next = currentQuestion + 1;
      if (next < shuffledQuestions.length) {
        setCurrentQuestion(next);
        setSelectedOption(null);
        setShowFeedback(false);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  // Final save: Add score to lifetime quizProgress
  const handleDeposit = async () => {
    if (!currentUser) {
      navigate("/home");
      return;
    }

    const userRef = doc(db, "users", currentUser.uid);

    try {
      const snap = await getDoc(userRef);

      // Initialize if user doc doesn't exist
      if (!snap.exists() || !snap.data().quizProgress) {
        await setDoc(
          userRef,
          {
            quizProgress: { totalCorrect: 0, totalQuestions: 0 },
            virtualBalance: 0,
          },
          { merge: true }
        );
      }

      // Increment lifetime totals
      await updateDoc(userRef, {
        "quizProgress.totalCorrect": increment(score),
        "quizProgress.totalQuestions": increment(shuffledQuestions.length),
        virtualBalance: increment(score * 1), // 1 coin per correct answer
      });
    } catch (err) {
      console.error("Final save failed:", err);
    } finally {
      navigate("/home");
    }
  };

  if (!shuffledQuestions.length) return <div>Loading...</div>;

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
      <h2 style={{ color: "#333", fontSize: "20px", marginBottom: "15px" }}>
        Financial Literacy Quiz
      </h2>

      {showScore ? (
        <div>
          <p style={{ fontSize: "18px", fontWeight: "600" }}>
            Your Score: {score} / {shuffledQuestions.length}
          </p>
          <p style={{ color: "#555", margin: "10px 0" }}>
            {score >= shuffledQuestions.length * 0.8
              ? "Excellent! You're a money pro!"
              : score >= shuffledQuestions.length * 0.5
              ? "Great job! Keep learning!"
              : "Nice try! You'll get better!"}
          </p>

          <button
            onClick={handleDeposit}
            style={{
              backgroundColor: "#28a745",
              color: "white",
              padding: "12px 24px",
              border: "none",
              borderRadius: "6px",
              fontSize: "16px",
              fontWeight: "600",
              cursor: "pointer",
              marginTop: "15px",
            }}
          >
            Deposit {score} Coins & Go Home
          </button>
        </div>
      ) : (
        <div>
          <p style={{ fontWeight: "500", color: "#444" }}>
            Question {currentQuestion + 1} of {shuffledQuestions.length}
          </p>
          <p style={{ margin: "15px 0", fontSize: "17px" }}>
            {shuffledQuestions[currentQuestion].question}
          </p>

          <ul style={{ listStyle: "none", padding: 0 }}>
            {shuffledQuestions[currentQuestion].options.map((option, idx) => (
              <li key={idx} style={{ margin: "10px 0" }}>
                <button
                  onClick={() => handleAnswer(idx)}
                  disabled={showFeedback}
                  style={{
                    backgroundColor:
                      showFeedback && idx === shuffledQuestions[currentQuestion].answer
                        ? "#28a745"
                        : showFeedback && selectedOption === idx
                        ? "#dc3545"
                        : "#007bff",
                    color: "white",
                    padding: "12px 20px",
                    border: "none",
                    borderRadius: "6px",
                    width: "100%",
                    maxWidth: "320px",
                    textAlign: "left",
                    cursor: showFeedback ? "default" : "pointer",
                    fontSize: "15px",
                  }}
                >
                  {showFeedback && idx === shuffledQuestions[currentQuestion].answer
                    ? `Correct! ${shuffledQuestions[currentQuestion].explanation}`
                    : showFeedback && selectedOption === idx
                    ? `Incorrect! ${shuffledQuestions[currentQuestion].explanation}`
                    : option}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}

export default GeneralQuiz;