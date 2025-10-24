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

// === QUESTIONS: FIXED A), B), C) — RANDOM CORRECT ANSWER ===
const questions = [
  {
    question: "What is money, according to Chapter 1?",
    options: [
      "A) A toy for playing games",
      "B) An item used to pay for goods and services",
      "C) A type of food",
    ],
    answer: 1, // B is correct
    explanation: "Money is a variable or item used to pay for goods and services in an economy, acting as a medium of exchange.",
  },
  {
    question: "Why is learning about money important for financial independence?",
    options: [
      "A) It helps you depend on others for money",
      "B) It allows you to manage finances and reduce dependency",
      "C) It makes you spend more",
    ],
    answer: 0, // A is correct
    explanation: "Understanding money empowers you to manage finances effectively, reducing dependency on others.",
  },
  {
    question: "What is one benefit of financial literacy mentioned in Chapter 1?",
    options: [
      "A) Avoiding all spending",
      "B) Building an emergency fund for unexpected setbacks",
      "C) Buying more toys",
    ],
    answer: 2, // C is correct
    explanation: "Financial literacy helps you plan for the future and build an emergency fund for financial security.",
  },
  {
    question: "What was a limitation of the barter system?",
    options: [
      "A) It was too easy to use",
      "B) It required both parties to want what the other offered",
      "C) It used paper money",
    ],
    answer: 1, // B
    explanation: "The barter system needed a “double coincidence of wants,” making trade difficult.",
  },
  {
    question: "What is fiat money?",
    options: [
      "A) Money backed by gold or silver",
      "B) Currency with no intrinsic value, established by government decree",
      "C) Money made from seashells",
    ],
    answer: 0, // A
    explanation: "Fiat money, like the Naira, has value because the government says so, not because of intrinsic worth.",
  },
  {
    question: "What is one function of money?",
    options: [
      "A) It makes you happy all the time",
      "B) It acts as a medium of exchange for transactions",
      "C) It replaces food and shelter",
    ],
    answer: 2, // C
    explanation: "Money simplifies trade by acting as a medium of exchange, one of its three essential functions.",
  },
  {
    question: "What does Chapter 2 say about the saying “money is the root of all evil”?",
    options: [
      "A) It’s completely true",
      "B) It’s a misquote; the love of money causes problems",
      "C) It means money is always good",
    ],
    answer: 1, // B
    explanation: "The actual saying is “the love of money is the root of all evil,” focusing on attitude, not money itself.",
  },
  {
    question: "How can money contribute to personal growth?",
    options: [
      "A) By buying more clothes",
      "B) By opening doors to education and experiences",
      "C) By replacing hard work",
    ],
    answer: 0, // A
    explanation: "Money can fund education and self-improvement, helping you reach your full potential.",
  },
  {
    question: "Why is wealth good for generosity, according to Chapter 2?",
    options: [
      "A) It lets you keep all your money",
      "B) It enables you to help others, like funding education",
      "C) It stops you from helping others",
    ],
    answer: 2, // C
    explanation: "Wealth allows you to be generous, like philanthropists who fund education or poverty relief.",
  },
  {
    question: "What is a key benefit of saving money, as per Chapter 3?",
    options: [
      "A) It lets you spend more on wants",
      "B) It provides security for emergencies",
      "C) It stops you from earning money",
    ],
    answer: 1, // B
    explanation: "Saving creates a safety net for unexpected expenses, like a broken phone.",
  },
  {
    question: "What is one way to set savings goals?",
    options: [
      "A) Spend all your money first",
      "B) Identify specific financial objectives, like saving for a gift",
      "C) Avoid thinking about money",
    ],
    answer: 0, // A
    explanation: "Setting savings goals involves identifying specific objectives, like saving for a gift or phone.",
  },
  {
    question: "What is a scale of preference in saving?",
    options: [
      "A) A list of toys you want",
      "B) A table ranking goals by importance and urgency",
      "C) A way to spend money quickly",
    ],
    answer: 2, // C
    explanation: "A scale of preference ranks savings goals by importance, like prioritizing phone repairs over clothes.",
  },
  {
    question: "How can you start saving smart, according to Chapter 3?",
    options: [
      "A) Spend all your allowance",
      "B) Use a piggy bank for different goals",
      "C) Ignore your savings",
    ],
    answer: 1, // B
    explanation: "Using a piggy bank or saving box for specific goals helps you save regularly and stay motivated.",
  },
  {
    question: "What lesson did Amina learn about saving in Chapter 3?",
    options: [
      "A) Spending is better than saving",
      "B) Saving provides a safety net for emergencies",
      "C) Concerts are more important than phones",
    ],
    answer: 0, // A
    explanation: "Amina learned that saving could have helped her avoid stress when her phone broke.",
  },
  {
    question: "What is earned income, as explained in Chapter 4?",
    options: [
      "A) Money from investments",
      "B) Money from jobs, businesses, or skills",
      "C) Money from gifts only",
    ],
    answer: 2, // C
    explanation: "Earned income comes from labor or services, like jobs, businesses, or skills.",
  },
  {
    question: "Why is a job not the path to wealth, according to Chapter 4?",
    options: [
      "A) It provides no money",
      "B) It doesn’t allow you to control your profit",
      "C) It’s the only way to get rich",
    ],
    answer: 1, // B
    explanation: "A job offers survival and savings but not wealth, as you don’t control the profit.",
  },
  {
    question: "What is an entrepreneur?",
    options: [
      "A) Someone who works for a boss",
      "B) Someone who creates and manages a business for profit",
      "C) Someone who avoids work",
    ],
    answer: 0, // A
    explanation: "An entrepreneur organizes resources to create a business, aiming for profit and value.",
  },
  {
    question: "How can skills generate income?",
    options: [
      "A) By keeping them secret",
      "B) Through talents like drawing or writing",
      "C) By avoiding learning",
    ],
    answer: 2, // C
    explanation: "Skills like drawing or writing can be monetized through freelance work or services.",
  },
  {
    question: "What is passive income?",
    options: [
      "A) Money earned with active work daily",
      "B) Money earned with minimal effort, like dividends",
      "C) Money spent on toys",
    ],
    answer: 1, // B
    explanation: "Passive income, like dividends or rental income, requires minimal ongoing effort.",
  },
  {
    question: "What is one example of passive income from Chapter 4?",
    options: [
      "A) Working as a teacher",
      "B) Earning dividends from stocks",
      "C) Selling snacks at school",
    ],
    answer: 0, // A
    explanation: "Dividend stocks provide passive income by paying a share of a company’s profits.",
  },
  {
    question: "What is budgeting, according to Chapter 4?",
    options: [
      "A) Spending all your money",
      "B) Creating a plan to manage income and expenses",
      "C) Ignoring your finances",
    ],
    answer: 2, // C
    explanation: "Budgeting involves planning how to manage income, expenses, and financial goals.",
  },
  {
    question: "Why is an emergency fund important in budgeting?",
    options: [
      "A) It helps you buy more wants",
      "B) It covers unexpected expenses",
      "C) It replaces all income",
    ],
    answer: 1, // B
    explanation: "An emergency fund provides financial security for unexpected costs, like medical bills.",
  },
  {
    question: "What is an asset, as defined in Chapter 5?",
    options: [
      "A) Something that takes money out of your pocket",
      "B) A resource that generates income or value",
      "C) A toy you play with",
    ],
    answer: 0, // A
    explanation: "Assets, like stocks or rental property, generate income or appreciate in value.",
  },
  {
    question: "According to “Rich Dad Poor Dad” in Chapter 5, why is a car not an asset?",
    options: [
      "A) It generates income",
      "B) It depreciates and takes money out of your pocket",
      "C) It always increases in value",
    ],
    answer: 2, // C
    explanation: "A car is a liability because it depreciates and requires maintenance costs.",
  },
  {
    question: "What is a liability, as per Chapter 5?",
    options: [
      "A) Something that puts money in your pocket",
      "B) A debt or obligation that reduces your wealth",
      "C) A gift from family",
    ],
    answer: 1, // B
    explanation: "Liabilities, like loans or credit card debt, take money out of your pocket.",
  },
  {
    question: "What lesson did Papa Ade learn in Chapter 5?",
    options: [
      "A) Buy more flashy cars",
      "B) Invest in assets, not liabilities, for long-term wealth",
      "C) Avoid all spending",
    ],
    answer: 0, // A
    explanation: "Papa Ade learned to invest in income-generating assets like real estate to build wealth.",
  },
  {
    question: "What is a need, according to Chapter 6?",
    options: [
      "A) A toy you want to play with",
      "B) Something essential for survival, like food",
      "C) A new video game",
    ],
    answer: 2, // C
    explanation: "Needs, like food or shelter, are essential for living and staying healthy.",
  },
  {
    question: "What is a want, as described in Chapter 6?",
    options: [
      "A) A school textbook",
      "B) A fun extra, like ice cream",
      "C) Medical care",
    ],
    answer: 1, // B
    explanation: "Wants, like ice cream or toys, are desirable but not necessary for survival.",
  },
  {
    question: "What did Ahmed learn about needs vs. wants in Chapter 6?",
    options: [
      "A) Spend all money on wants",
      "B) Prioritize needs and save for wants",
      "C) Ignore needs completely",
    ],
    answer: 0, // A
    explanation: "Ahmed learned to prioritize needs, like school shoes, over wants to avoid regret.",
  },
  {
    question: "Why should you avoid gambling, according to Chapter 7?",
    options: [
      "A) It always makes you rich",
      "B) It often leads to financial losses and addiction",
      "C) It’s the best way to save",
    ],
    answer: 2, // C
    explanation: "Gambling is risky, often leading to losses and addiction, harming your finances.",
  },
  {
    question: "What is a sign of gambling addiction?",
    options: [
      "A) Saving money regularly",
      "B) Constantly thinking about gambling",
      "C) Helping others with money",
    ],
    answer: 1, // B
    explanation: "Preoccupation with gambling is a sign of addiction, as noted in Chapter 7.",
  },
  {
    question: "What did Kola learn about gambling in Chapter 7?",
    options: [
      "A) It’s a safe way to make money",
      "B) It can lead to stress and neglected responsibilities",
      "C) It’s better than saving",
    ],
    answer: 0, // A
    explanation: "Kola realized gambling caused anxiety and neglected studies, leading him to stop.",
  },
  {
    question: "What is compound interest, as explained in Chapter 8?",
    options: [
      "A) Spending money quickly",
      "B) Earning returns on your initial investment and its returns",
      "C) Borrowing money for toys",
    ],
    answer: 2, // C
    explanation: "Compound interest grows your money by earning returns on both the principal and previous returns.",
  },
  {
    question: "How did Warren Buffett use compound interest?",
    options: [
      "A) By spending all his money",
      "B) By starting to invest early at age 11",
      "C) By avoiding investments",
    ],
    answer: 1, // B
    explanation: "Buffett started investing at 11, giving his money more time to compound and grow.",
  },
  {
    question: "What is one lesson from Warren Buffett in Chapter 8?",
    options: [
      "A) Invest with borrowed money",
      "B) Diversify your investments to reduce risk",
      "C) Sell stocks quickly",
    ],
    answer: 0, // A
    explanation: "Buffett emphasizes diversification to spread risk across different investments.",
  },
  {
    question: "What is an entrepreneur, according to Chapter 9?",
    options: [
      "A) Someone who avoids risks",
      "B) Someone who starts and manages a business",
      "C) Someone who only works for others",
    ],
    answer: 2, // C
    explanation: "An entrepreneur creates and manages a business, taking risks for profit.",
  },
  {
    question: "How did Zara start her business in Chapter 9?",
    options: [
      "A) By selling snacks at school",
      "B) By making and selling beaded bracelets",
      "C) By working for a shop",
    ],
    answer: 1, // B
    explanation: "Zara started “AfriCrafts,” selling handmade beaded bracelets at local markets.",
  },
  {
    question: "Why is entrepreneurship great for young ones?",
    options: [
      "A) It stops you from learning",
      "B) It teaches money management and creativity",
      "C) It avoids all work",
    ],
    answer: 0, // A
    explanation: "Entrepreneurship teaches skills like money management and boosts creativity.",
  },
  {
    question: "Why does giving matter, according to Chapter 10?",
    options: [
      "A) It makes you spend more",
      "B) It helps others and brings fulfillment",
      "C) It stops you from saving",
    ],
    answer: 2, // C
    explanation: "Giving helps others, creates positive change, and brings joy to the giver.",
  },
  {
    question: "How can young ones give, as suggested in Chapter 10?",
    options: [
      "A) By keeping all their toys",
      "B) By donating unused toys or clothes",
      "C) By avoiding charity",
    ],
    answer: 1, // B
    explanation: "Donating toys or clothes to charity is a way young ones can give back.",
  },
  {
    question: "What is a financial goal, as per Chapter 11?",
    options: [
      "A) A random wish with no plan",
      "B) A specific, achievable objective for managing money",
      "C) A way to spend all your money",
    ],
    answer: 0, // A
    explanation: "Financial goals are specific objectives, like saving for a bike, to guide money management.",
  },
  {
    question: "What does the “S” in SMART goals stand for?",
    options: [
      "A) Simple",
      "B) Specific",
      "C) Slow",
    ],
    answer: 2, // C
    explanation: "SMART goals are Specific, Measurable, Achievable, Relevant, and Time-bound.",
  },
  {
    question: "What financial goal did Warren Buffett set, according to Chapter 11?",
    options: [
      "A) To spend all his money by age 30",
      "B) To become a millionaire by age 30",
      "C) To avoid investing",
    ],
    answer: 1, // B
    explanation: "Buffett set a goal to become a millionaire by age 30 and achieved it through investing.",
  },
  {
    question: "Why is starting early important for investing, per Chapter 12?",
    options: [
      "A) It reduces the need to save",
      "B) It allows more time for compound interest to work",
      "C) It makes you spend faster",
    ],
    answer: 0, // A
    explanation: "Starting early gives compound interest more time to grow your money significantly.",
  },
  {
    question: "What does Chapter 12 say about money and happiness?",
    options: [
      "A) Money directly buys happiness",
      "B) Money offers choices that shape your life",
      "C) Money should be your only goal",
    ],
    answer: 2, // C
    explanation: "Money provides choices to pursue your aspirations, not happiness itself.",
  },
  {
    question: "Why are you your most valuable asset, according to Chapter 12?",
    options: [
      "A) Because you can spend money",
      "B) Because your skills and health help you earn money",
      "C) Because you don’t need skills",
    ],
    answer: 1, // B
    explanation: "Your skills and health are your “human capital,” enabling you to earn money.",
  },
  {
    question: "What is good debt, as described in Chapter 12?",
    options: [
      "A) Borrowing for video games",
      "B) Borrowing for things that grow in value, like a house",
      "C) Borrowing for snacks",
    ],
    answer: 0, // A
    explanation: "Good debt is used for assets that can appreciate, like a house, if managed well.",
  },
  {
    question: "What is inflation, according to Chapter 12?",
    options: [
      "A) When money grows stronger",
      "B) When money loses value over time",
      "C) When money stays the same",
    ],
    answer: 2, // C
    explanation: "Inflation means money loses value over time, like buying less with the same amount.",
  },
  {
    question: "Why is writing down goals important, per Chapter 14?",
    options: [
      "A) It makes you spend more",
      "B) It clarifies your ambitions and tracks progress",
      "C) It stops you from planning",
    ],
    answer: 1, // B
    explanation: "Writing down goals makes them concrete, helps track progress, and reinforces commitment.",
  },
  {
    question: "What did Tolu learn from writing down his goals in Chapter 14?",
    options: [
      "A) Goals are not important",
      "B) Written goals guided him to entrepreneurial success",
      "C) Writing goals wastes time",
    ],
    answer: 0, // A
    explanation: "Tolu’s written goals acted as a compass, leading him to build a successful business.",
  },
];

// === COMPONENT (UNCHANGED) ===
const MillionaireChildQuiz = () => {
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
            virtualBalance: increment(score),
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
      ? "Outstanding! You're a true Millionaire Child!"
      : percentage >= 50
      ? "Great job! Keep learning!"
      : "Good effort! Try again to master it.";

  if (finished) {
    return (
      <div style={{ maxWidth: "500px", margin: "40px auto", padding: "20px", textAlign: "center", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderTop: "4px solid #007bff" }}>
        <h2 style={{ color: "#007bff", fontSize: "22px", marginBottom: "10px" }}>Quiz Complete</h2>
        <p style={{ fontSize: "16px", margin: "5px 0" }}>This quiz: {score} / {questions.length}</p>
        <p style={{ color: "#555", marginBottom: "10px" }}>({percentage}%)</p>
        <p style={{ fontWeight: "500", color: "#333", marginBottom: "20px" }}>{message}</p>

        <div style={{ display: "flex", justifyContent: "center", gap: "10px", flexWrap: "wrap" }}>
          <button onClick={handleRestart} style={{ backgroundColor: "#007bff", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Retake Quiz
          </button>
          <button onClick={() => navigate("/home")} style={{ backgroundColor: "#28a745", color: "white", padding: "10px 20px", border: "none", borderRadius: "5px", cursor: "pointer" }}>
            Deposit {score} Coins & Go Home
          </button>
        </div>
      </div>
    );
  }

  return (
    <div style={{ maxWidth: "500px", margin: "30px auto", padding: "20px", textAlign: "center", backgroundColor: "white", borderRadius: "10px", boxShadow: "0 2px 10px rgba(0,0,0,0.1)", borderTop: "4px solid #007bff" }}>
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
                    ? idx === questions[current].answer
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
        <div style={{ marginTop: "15px", backgroundColor: "#f0f8ff", borderLeft: "4px solid #007bff", padding: "10px", borderRadius: "5px", color: "#333" }}>
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

export default MillionaireChildQuiz;