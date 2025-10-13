import React, { useState, useEffect } from 'react';
import { doc, getDoc, setDoc, updateDoc, increment } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';
import { Link } from 'react-router-dom';

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
    explanation: "Saving helps your money grow over time!"
  },
  {
    question: "True or False: Failures are bad.",
    options: ["True", "False"],
    answer: 1,
    explanation: "Failures are chances to learn and get better."
  },
  {
    question: "What's a 'need'?",
    options: ["A toy", "Food and water", "A video game"],
    answer: 1,
    explanation: "Needs are things you must have to live."
  },
  {
    question: "How can you earn money as a kid?",
    options: ["By playing games", "Doing chores", "Watching TV"],
    answer: 1,
    explanation: "Chores like cleaning can earn allowance."
  },
  {
    question: "What does 'invest' mean?",
    options: ["Spend now", "Put money to work to make more", "Hide money"],
    answer: 1,
    explanation: "Like planting a seed to grow a tree."
  },
  {
    question: "True or False: Goals help you succeed.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Goals give you a target to aim for."
  },
  {
    question: "What's a budget?",
    options: ["A game", "A plan for money", "A toy"],
    answer: 1,
    explanation: "It tells you how to spend and save."
  },
  {
    question: "Why share with others?",
    options: ["To lose money", "To build friendships and success", "To eat less"],
    answer: 1,
    explanation: "Helping others can lead to help in return."
  },
  {
    question: "What is persistence?",
    options: ["Giving up", "Trying again and again", "Sleeping"],
    answer: 1,
    explanation: "Like climbing a hill—keep going!"
  },
  {
    question: "True or False: Money grows in banks.",
    options: ["True", "False"],
    answer: 0,
    explanation: "With interest, it can grow a little."
  },
  {
    question: "What's an entrepreneur?",
    options: ["Someone who watches TV", "Someone who starts a business", "A teacher"],
    answer: 1,
    explanation: "Like selling lemonade to make money."
  },
  {
    question: "Why read books on success?",
    options: ["To sleep", "To learn from others' stories", "To play"],
    answer: 1,
    explanation: "Books share secrets to being rich and happy."
  },
  {
    question: "What is debt?",
    options: ["Free money", "Borrowed money you must pay back", "A gift"],
    answer: 1,
    explanation: "Avoid bad debt; it's like owing a friend."
  },
  {
    question: "True or False: Attitude matters for success.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Positive thinking helps you achieve more."
  },
  {
    question: "What's compound interest?",
    options: ["Simple math", "Money earning money on itself", "A game"],
    answer: 1,
    explanation: "Like a snowball growing bigger."
  },
  {
    question: "Why set small goals first?",
    options: ["To fail", "To build confidence with wins", "To forget big ones"],
    answer: 1,
    explanation: "Small wins lead to big successes."
  },
  {
    question: "What is generosity?",
    options: ["Keeping everything", "Sharing with others", "Hiding toys"],
    answer: 1,
    explanation: "It makes you and others happy."
  },
  {
    question: "True or False: Learning never stops.",
    options: ["True", "False"],
    answer: 0,
    explanation: "Successful people always learn new things."
  },
  {
    question: "What's a side hustle for kids?",
    options: ["Napping", "Selling crafts", "Watching cartoons"],
    answer: 1,
    explanation: "Extra ways to earn, like drawing pictures."
  },
  {
    question: "Why track spending?",
    options: ["To lose money", "To see where it goes and save more", "To buy more"],
    answer: 1,
    explanation: "Like a map for your money journey."
  },
];

function GeneralQuiz() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const shuffledQuestionsList = [...questions].sort(() => Math.random() - 0.5);
    const shuffled = shuffledQuestionsList.map(q => {
      const shuffledOpts = shuffleOptions(q.options, q.answer);
      return {
        ...q,
        options: shuffledOpts.map(opt => opt.text),
        answer: shuffledOpts.findIndex(opt => opt.isCorrect),
      };
    });
    setShuffledQuestions(shuffled);
  }, []);

  useEffect(() => {
    if (showScore) {
      const savedData = JSON.parse(localStorage.getItem("quizProgress")) || {
        totalCorrect: 0,
        totalQuestions: 0,
      };

      const updatedData = {
        totalCorrect: savedData.totalCorrect + score,
        totalQuestions: savedData.totalQuestions + shuffledQuestions.length,
      };

      localStorage.setItem("quizProgress", JSON.stringify(updatedData));
    }
  }, [showScore, score, shuffledQuestions]);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setCurrentUser(user);
      } else {
        setCurrentUser(null);
      }
    });
    return unsubscribe;
  }, []);

  const handleAnswer = async (selectedIndex) => {
    if (!shuffledQuestions.length) return;
    setSelectedOption(selectedIndex);
    setShowFeedback(true);

    const isCorrect = selectedIndex === shuffledQuestions[currentQuestion].answer;

    if (isCorrect && currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);

      try {
        const userSnap = await getDoc(userRef);

        if (!userSnap.exists()) {
          await setDoc(userRef, { coins: 1, virtualBalance: 0 });
        } else {
          await updateDoc(userRef, { coins: increment(1) });
        }
      } catch (error) {
        console.error('Error updating coins:', error);
      }
      setScore(score + 1);
    }

    setTimeout(() => {
      setShowFeedback(false);
      setSelectedOption(null);
      const nextQuestion = currentQuestion + 1;
      if (nextQuestion < shuffledQuestions.length) {
        setCurrentQuestion(nextQuestion);
      } else {
        setShowScore(true);
      }
    }, 2000);
  };

  // ✅ Updated handleDeposit: no alerts, always redirect to /home
  const handleDeposit = async () => {
    if (!currentUser) {
      window.location.href = '/home';
      return;
    }

    const coinsToDeposit = score * 1;
    const userRef = doc(db, 'users', currentUser.uid);

    try {
      const userSnap = await getDoc(userRef);

      if (!userSnap.exists()) {
        await setDoc(userRef, { coins: 0, virtualBalance: coinsToDeposit });
      } else {
        await updateDoc(userRef, { virtualBalance: increment(coinsToDeposit) });
      }

      setVirtualBalance(virtualBalance + coinsToDeposit);
    } catch (error) {
      console.error('Deposit error:', error);
      // silently fail
    } finally {
      window.location.href = '/home';
    }
  };

  if (!shuffledQuestions.length) return null;

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Financial Literacy Quiz</h2>
      {showScore ? (
        <div>
          <p>Your score: {score} out of {shuffledQuestions.length}</p>

          <Link to="/home">
            <button
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                padding: '10px 20px',
                border: 'none',
                borderRadius: '5px',
                cursor: 'pointer'
              }}
              onClick={handleDeposit}
            >
              Deposit {score * 1} Coins to Savings!
            </button>
          </Link>

        </div>
      ) : (
        <div>
          <p>
            Question {currentQuestion + 1}/{shuffledQuestions.length}:{' '}
            {shuffledQuestions[currentQuestion].question}
          </p>
          <ul style={{ listStyle: 'none', padding: 0 }}>
            {shuffledQuestions[currentQuestion].options.map((option, index) => (
              <li key={index} style={{ margin: '10px 0' }}>
                <button
                  onClick={() => handleAnswer(index)}
                  disabled={showFeedback}
                  style={{
                    backgroundColor: showFeedback
                      ? index === shuffledQuestions[currentQuestion].answer
                        ? '#28a745'
                        : selectedOption === index
                        ? '#dc3545'
                        : '#007bff'
                      : '#007bff',
                    color: 'white',
                    padding: '10px 20px',
                    border: 'none',
                    borderRadius: '5px',
                    cursor: showFeedback ? 'default' : 'pointer',
                    width: '200px',
                    textAlign: 'left',
                  }}
                >
                  {showFeedback && index === shuffledQuestions[currentQuestion].answer
                    ? `Correct! ${shuffledQuestions[currentQuestion].explanation}`
                    : showFeedback && selectedOption === index && selectedOption !== shuffledQuestions[currentQuestion].answer
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
