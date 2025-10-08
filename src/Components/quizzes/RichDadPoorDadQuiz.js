import React, { useState, useEffect } from 'react';
import { doc, increment, updateDoc } from 'firebase/firestore';
import { onAuthStateChanged } from 'firebase/auth';
import { auth, db } from '../../firebase';

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
  // All 60 questions from the provided code are included here, unchanged
  { question: "What did Rich Dad teach Robert and Mike about making money when they were kids?",
    options: [
      "A) Save all your pocket money in a bank",
      "B) Work hard for a salary like Poor Dad",
      "C) Make money work for you by creating ideas like a comic book library"
    ],
    answer: 2,
    explanation: "Make money work for you by creating ideas like a comic book library"
  },
  {
    question: "How did Robert turn a small house deal into money in a tough market?",
    options: [
      "A) By borrowing from a bank for a big loan",
      "B) By buying a ₦15,000,000 house and selling it for ₦30,000,000 quickly",
      "C) By saving his salary for years"
    ],
    answer: 1,
    explanation: "By buying a ₦15,000,000 house and selling it for ₦30,000,000 quickly"
  },
  {
    question: "What is a bad habit that keeps people poor, according to Rich Dad?",
    options: [
      "A) Investing in small businesses",
      "B) Paying yourself first before bills",
      "C) Paying bills first and yourself last"
    ],
    answer: 2,
    explanation: "Paying bills first and yourself last"
  },
  {
    question: "Why did Robert join Xerox after his high-paying job?",
    options: [
      "A) To avoid working hard",
      "B) To learn sales skills and overcome fear of rejection",
      "C) To earn more naira immediately"
    ],
    answer: 1,
    explanation: "To learn sales skills and overcome fear of rejection"
  },
  {
    question: "What does \"minding your own business\" mean for building wealth?",
    options: [
      "A) Spending all your naira on fun things",
      "B) Building your asset column like buying a small shop",
      "C) Focusing on your job's salary"
    ],
    answer: 1,
    explanation: "Building your asset column like buying a small shop"
  },
  {
    question: "How can you overcome laziness to build wealth?",
    options: [
      "A) Avoid all investments",
      "B) Use a little desire for a better life, like asking \"What's in it for me?\"",
      "C) Work harder at your job"
    ],
    answer: 1,
    explanation: "Use a little desire for a better life, like asking \"What's in it for me?\""
  },
  {
    question: "What is the power of getting something for nothing in investing?",
    options: [
      "A) Saving in a bank for low interest",
      "B) Borrowing lots of naira from banks",
      "C) Buying an asset and getting your money back fast with extras like free land"
    ],
    answer: 2,
    explanation: "Buying an asset and getting your money back fast with extras like free land"
  },
  {
    question: "Why should you pay yourself first even if short on naira?",
    options: [
      "A) To spend on luxuries right away",
      "B) To make creditors happy",
      "C) To force your brain to find more income, like starting a side hustle"
    ],
    answer: 2,
    explanation: "To force your brain to find more income, like starting a side hustle"
  },
  {
    question: "What did Rich Dad say about corporations for the rich?",
    options: [
      "A) They are only for jobs",
      "B) They help pay less taxes and protect assets",
      "C) They increase taxes a lot"
    ],
    answer: 1,
    explanation: "They help pay less taxes and protect assets"
  },
  {
    question: "How can kids like you start inventing money?",
    options: [
      "A) By spending on toys",
      "B) By spotting opportunities like buying cheap items to resell for profit",
      "C) By saving all allowance in a piggy bank"
    ],
    answer: 1,
    explanation: "By spotting opportunities like buying cheap items to resell for profit"
  },
  {
    question: "What is a key skill to learn besides your main talent?",
    options: [
      "A) Avoid learning new things",
      "B) Just focus on one thing like baking",
      "C) Learn sales and marketing to make your talent earn more naira"
    ],
    answer: 2,
    explanation: "Learn sales and marketing to make your talent earn more naira"
  },
  {
    question: "Why is fear an obstacle to wealth?",
    options: [
      "A) It makes you bold like Texans",
      "B) It helps you save safely",
      "C) It stops you from investing because losing naira hurts more than gaining"
    ],
    answer: 2,
    explanation: "It stops you from investing because losing naira hurts more than gaining"
  },
  {
    question: "What does Rich Dad mean by using assets to buy luxuries?",
    options: [
      "A) Save for years to buy things",
      "B) Let your rental shop pay for a bike with its income",
      "C) Borrow naira for a car"
    ],
    answer: 1,
    explanation: "Let your rental shop pay for a bike with its income"
  },
  {
    question: "How did Robert overcome arrogance?",
    options: [
      "A) By avoiding books",
      "B) By pretending to know everything",
      "C) By admitting what he didn't know and learning from experts"
    ],
    answer: 2,
    explanation: "By admitting what he didn't know and learning from experts"
  },
  {
    question: "What is the first step to awaken your financial genius?",
    options: [
      "A) Spend all your naira",
      "B) Find a high-paying job",
      "C) Find a strong reason to be rich, like wanting freedom"
    ],
    answer: 2,
    explanation: "Find a strong reason to be rich, like wanting freedom"
  },
  {
    question: "Why make lots of offers when buying?",
    options: [
      "A) To pay full price",
      "B) To start negotiations and find great deals like ₦3,000 for a ₦6,000 item",
      "C) To annoy sellers"
    ],
    answer: 1,
    explanation: "To start negotiations and find great deals like ₦3,000 for a ₦6,000 item"
  },
  {
    question: "What is cynicism in building wealth?",
    options: [
      "A) Being bold to invest",
      "B) Doubts like \"What if I lose naira?\" that stop you from acting",
      "C) Saving in a bank"
    ],
    answer: 1,
    explanation: "Doubts like \"What if I lose naira?\" that stop you from acting"
  },
  {
    question: "How can you use corporations to save naira?",
    options: [
      "A) By avoiding assets",
      "B) By spending on business needs before taxes, like ₦5,000 materials",
      "C) By increasing taxes"
    ],
    answer: 1,
    explanation: "By spending on business needs before taxes, like ₦5,000 materials"
  },
  {
    question: "Why pay brokers well important?",
    options: [
      "A) To avoid advice",
      "B) They save time and find deals like a ₦4,500,000 land sold for ₦12,500,000",
      "C) To waste naira"
    ],
    answer: 1,
    explanation: "They save time and find deals like a ₦4,500,000 land sold for ₦12,500,000"
  },
  {
    question: "What does Rich Dad say about choosing friends?",
    options: [
      "A) Only friends who borrow naira",
      "B) To learn investment tips, like a ₦5,000,000 shop earning ₦50,000 monthly",
      "C) Avoid rich friends"
    ],
    answer: 1,
    explanation: "To learn investment tips, like a ₦5,000,000 shop earning ₦50,000 monthly"
  },
  {
    question: "How did Robert invent ₦20,000,000 from a house deal?",
    options: [
      "A) By saving in a bank",
      "B) By working overtime",
      "C) By buying for ₦10,000,000 and selling for ₦30,000,000"
    ],
    answer: 2,
    explanation: "By buying for ₦10,000,000 and selling for ₦30,000,000"
  },
  {
    question: "What is a good habit that keeps people poor, according to Rich Dad?",
    options: [
      "A) Investing in small businesses",
      "B) Paying yourself first before bills",
      "C) Paying bills first and yourself last"
    ],
    answer: 2,
    explanation: "Paying bills first and yourself last"
  },
  {
    question: "Why should you shop for bargains in all markets?",
    options: [
      "A) Buy low during crashes, like a ₦12,500,000 condo worth ₦25,000,000",
      "B) Avoid sales",
      "C) To buy high during booms"
    ],
    answer: 0,
    explanation: "Buy low during crashes, like a ₦12,500,000 condo worth ₦25,000,000"
  },
  {
    question: "What skill did Robert learn at Xerox?",
    options: [
      "A) Flying planes",
      "B) Sales to overcome rejection and start his business",
      "C) Avoiding work"
    ],
    answer: 1,
    explanation: "Sales to overcome rejection and start his business"
  },
  {
    question: "How can you beat arrogance in money matters?",
    options: [
      "A) Stop reading",
      "B) Thinking you know everything, losing naira on bad deals",
      "C) Admit what you don't know and learn from books or experts"
    ],
    answer: 2,
    explanation: "Admit what you don't know and learn from books or experts"
  },
  {
    question: "What is the power of giving in wealth-building?",
    options: [
      "A) Avoid sharing",
      "B) Give first, like teaching money skills, and it comes back multiplied",
      "C) Give nothing"
    ],
    answer: 1,
    explanation: "Give first, like teaching money skills, and it comes back multiplied"
  },
  {
    question: "Why is fear like a Texan attitude helpful?",
    options: [
      "A) It stops all investing",
      "B) Makes you save only",
      "C) Turn losses into wins, like learning from a ₦5,000 failed deal"
    ],
    answer: 2,
    explanation: "Turn losses into wins, like learning from a ₦5,000 failed deal"
  },
  {
    question: "How did Robert use assets for luxuries?",
    options: [
      "A) Borrow naira for a car",
      "B) Let rental properties pay for a fancy car",
      "C) Save for years"
    ],
    answer: 1,
    explanation: "Let rental properties pay for a fancy car"
  },
  {
    question: "What does \"think big\" mean for kids?",
    options: [
      "A) Spend small only",
      "B) Team up for bulk buys, like ₦10,000 supplies for ₦30,000 sales",
      "C) Avoid friends"
    ],
    answer: 1,
    explanation: "Team up for bulk buys, like ₦10,000 supplies for ₦30,000 sales"
  },
  {
    question: "Why find buyers first?",
    options: [
      "A) Buy without selling",
      "B) Sell before buying, like finding classmates for snacks to make ₦10,000",
      "C) To lose naira"
    ],
    answer: 1,
    explanation: "Sell before buying, like finding classmates for snacks to make ₦10,000"
  },
  {
    question: "What is an asset in simple terms?",
    options: [
      "A) A fancy phone costing ₦50,000 in loans",
      "B) Something like a small shop that puts naira in your pocket",
      "C) Something that takes naira out"
    ],
    answer: 1,
    explanation: "Something like a small shop that puts naira in your pocket"
  },
  {
    question: "How can you overcome cynicism?",
    options: [
      "A) Listen to all doubts",
      "B) Analyze deals like a ₦5,000,000 shop instead of criticizing",
      "C) Avoid opportunities"
    ],
    answer: 1,
    explanation: "Analyze deals like a ₦5,000,000 shop instead of criticizing"
  },
  {
    question: "What is a bad habit that keeps people poor, according to Rich Dad?",
    options: [
      "A) Investing in small businesses",
      "B) Paying yourself first before bills",
      "C) Paying bills first and yourself last"
    ],
    answer: 2,
    explanation: "Paying bills first and yourself last"
  },
  {
    question: "Why should you shop for bargains in all markets?",
    options: [
      "A) Buy low during crashes, like a ₦12,500,000 condo worth ₦25,000,000",
      "B) Avoid sales",
      "C) To buy high during booms"
    ],
    answer: 0,
    explanation: "Buy low during crashes, like a ₦12,500,000 condo worth ₦25,000,000"
  },
  {
    question: "What skill did Robert learn at Xerox?",
    options: [
      "A) Flying planes",
      "B) Sales to overcome rejection and start his business",
      "C) Avoiding work"
    ],
    answer: 1,
    explanation: "Sales to overcome rejection and start his business"
  },
  {
    question: "How can you beat arrogance in money matters?",
    options: [
      "A) Stop reading",
      "B) Thinking you know everything, losing naira on bad deals",
      "C) Admit what you don't know and learn from books or experts"
    ],
    answer: 2,
    explanation: "Admit what you don't know and learn from books or experts"
  },
  {
    question: "What is the power of giving in wealth-building?",
    options: [
      "A) Avoid sharing",
      "B) Give first, like teaching money skills, and it comes back multiplied",
      "C) Give nothing"
    ],
    answer: 1,
    explanation: "Give first, like teaching money skills, and it comes back multiplied"
  },
  {
    question: "Why is fear like a Texan attitude helpful?",
    options: [
      "A) It stops all investing",
      "B) Makes you save only",
      "C) Turn losses into wins, like learning from a ₦5,000 failed deal"
    ],
    answer: 2,
    explanation: "Turn losses into wins, like learning from a ₦5,000 failed deal"
  },
  {
    question: "How did Robert use assets for luxuries?",
    options: [
      "A) Borrow naira for a car",
      "B) Let rental properties pay for a fancy car",
      "C) Save for years"
    ],
    answer: 1,
    explanation: "Let rental properties pay for a fancy car"
  },
  {
    question: "What is arrogance in money?",
    options: [
      "A) Learning from experts",
      "B) Thinking you know everything, but it hides ignorance",
      "C) Admitting what you don't know"
    ],
    answer: 1,
    explanation: "Thinking you know everything, but it hides ignorance"
  },
  {
    question: "How can you overcome laziness?",
    options: [
      "A) Stay busy with unimportant things",
      "B) Use a little greed for a better life to motivate you",
      "C) Avoid asking \"How can I afford it?\""
    ],
    answer: 1,
    explanation: "Use a little greed for a better life to motivate you"
  },
  {
    question: "What is the Rat Race?",
    options: [
      "A) A fun game with money",
      "B) Working hard but never getting ahead, like a hamster on a wheel",
      "C) Making money work for you"
    ],
    answer: 1,
    explanation: "Working hard but never getting ahead, like a hamster on a wheel"
  },
  {
    question: "Why is financial literacy important?",
    options: [
      "A) To know how much money you make",
      "B) To understand how to keep and grow your money",
      "C) To spend money on wants"
    ],
    answer: 1,
    explanation: "To understand how to keep and grow your money"
  },
  {
    question: "What is an example of an asset?",
    options: [
      "A) A new toy",
      "B) A lemonade stand that makes money",
      "C) A bike that needs repairs"
    ],
    answer: 1,
    explanation: "A lemonade stand that makes money"
  },
  {
    question: "What did Robert and Mike do with comic books?",
    options: [
      "A) Threw them away",
      "B) Started a library and charged 10 cents to read",
      "C) Sold them for low price"
    ],
    answer: 1,
    explanation: "Started a library and charged 10 cents to read"
  },
  {
    question: "How do rich people use corporations?",
    options: [
      "A) To pay more taxes",
      "B) To spend before taxes and protect wealth",
      "C) To avoid business"
    ],
    answer: 1,
    explanation: "To spend before taxes and protect wealth"
  },
  {
    question: "What is persistence in success?",
    options: [
      "A) Giving up easily",
      "B) Trying again after failure, like rebuilding a fallen tower",
      "C) Avoiding challenges"
    ],
    answer: 1,
    explanation: "Trying again after failure, like rebuilding a fallen tower"
  },
  {
    question: "Why learn from failures?",
    options: [
      "A) To quit",
      "B) They are lessons to get better",
      "C) To blame others"
    ],
    answer: 1,
    explanation: "They are lessons to get better"
  },
  {
    question: "What is compound interest like?",
    options: [
      "A) A snowball growing bigger",
      "B) Spending all at once",
      "C) Hiding money"
    ],
    answer: 0,
    explanation: "A snowball growing bigger"
  },
  {
    question: "What is generosity in money?",
    options: [
      "A) Keeping everything",
      "B) Sharing with others to feel richer",
      "C) Hiding toys"
    ],
    answer: 1,
    explanation: "Sharing with others to feel richer"
  },
  {
    question: "Why track spending?",
    options: [
      "A) To lose money",
      "B) To see where it goes and save more",
      "C) To buy more"
    ],
    answer: 1,
    explanation: "To see where it goes and save more"
  },
  {
    question: "What is a side hustle for kids?",
    options: [
      "A) Napping",
      "B) Selling crafts for extra naira",
      "C) Watching cartoons"
    ],
    answer: 1,
    explanation: "Selling crafts for extra naira"
  },
  {
    question: "Why set small goals first?",
    options: [
      "A) To fail",
      "B) To build confidence with wins",
      "C) To forget big ones"
    ],
    answer: 1,
    explanation: "To build confidence with wins"
  },
  {
    question: "What is debt?",
    options: [
      "A) Free money",
      "B) Borrowed money you must pay back",
      "C) A gift"
    ],
    answer: 1,
    explanation: "Borrowed money you must pay back"
  },
  {
    question: "Why read success books?",
    options: [
      "A) To sleep",
      "B) To learn from others' stories",
      "C) To play"
    ],
    answer: 1,
    explanation: "To learn from others' stories"
  },
  {
    question: "What is an entrepreneur?",
    options: [
      "A) Watching TV",
      "B) Someone who starts a business",
      "C) A teacher"
    ],
    answer: 1,
    explanation: "Someone who starts a business"
  },
  {
    question: "Does money grow in banks?",
    options: [
      "A) True, with interest",
      "B) False",
      "C) Only if hidden"
    ],
    answer: 0,
    explanation: "True, with interest"
  },
  {
    question: "What is persistence?",
    options: [
      "A) Giving up",
      "B) Trying again and again",
      "C) Sleeping"
    ],
    answer: 1,
    explanation: "Trying again and again"
  },
  {
    question: "Why share with others?",
    options: [
      "A) To lose money",
      "B) To build friendships and success",
      "C) To eat less"
    ],
    answer: 1,
    explanation: "To build friendships and success"
  },
  {
    question: "What is a budget?",
    options: [
      "A) A game",
      "B) A plan for money",
      "C) A toy"
    ],
    answer: 1,
    explanation: "A plan for money"
  },
  {
    question: "Do goals help you succeed?",
    options: [
      "A) True",
      "B) False",
      "C) Only big ones"
    ],
    answer: 0,
    explanation: "True"
  },
  {
    question: "How can you earn money as a kid?",
    options: [
      "A) Playing games",
      "B) Doing chores",
      "C) Watching TV"
    ],
    answer: 1,
    explanation: "Doing chores"
  },
  {
    question: "What does 'invest' mean?",
    options: [
      "A) Spend now",
      "B) Put money to work to make more",
      "C) Hide money"
    ],
    answer: 1,
    explanation: "Put money to work to make more"
  },
  {
    question: "What is a 'need'?",
    options: [
      "A) A toy",
      "B) Food and water",
      "C) A video game"
    ],
    answer: 1,
    explanation: "Food and water"
  },
  {
    question: "Are failures bad?",
    options: [
      "A) True",
      "B) False, they are lessons",
      "C) Always"
    ],
    answer: 1,
    explanation: "False, they are lessons"
  },
  {
    question: "What should you do with 10% of your money?",
    options: [
      "A) Spend it all",
      "B) Save it",
      "C) Give it away"
    ],
    answer: 1,
    explanation: "Save it"
  },
  {
    question: "What is a budget?",
    options: [
      "A) A game",
      "B) A plan for money",
      "C) A toy"
    ],
    answer: 1,
    explanation: "A plan for money"
  },
  {
    question: "Why share with others?",
    options: [
      "A) To lose money",
      "B) To build friendships and success",
      "C) To eat less"
    ],
    answer: 1,
    explanation: "To build friendships and success"
  },
  {
    question: "What is persistence?",
    options: [
      "A) Giving up",
      "B) Trying again and again",
      "C) Sleeping"
    ],
    answer: 1,
    explanation: "Trying again and again"
  },
  {
    question: "Does money grow in banks?",
    options: [
      "A) True, with interest",
      "B) False",
      "C) Only if hidden"
    ],
    answer: 0,
    explanation: "True, with interest"
  },
  {
    question: "What is an entrepreneur?",
    options: [
      "A) Watching TV",
      "B) Someone who starts a business",
      "C) A teacher"
    ],
    answer: 1,
    explanation: "Someone who starts a business"
  },
];

function RichDadPoorDadQuiz() {
  const [score, setScore] = useState(0);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [showScore, setShowScore] = useState(false);
  const [shuffledQuestions, setShuffledQuestions] = useState([]);
  const [currentUser, setCurrentUser] = useState(null);
  const [virtualBalance, setVirtualBalance] = useState(0);
  const [selectedOption, setSelectedOption] = useState(null);
  const [showFeedback, setShowFeedback] = useState(false);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setCurrentUser(user);
    });
    return unsubscribe;
  }, []);

  useEffect(() => {
    const shuffledQuestionsList = [...questions].sort(() => Math.random() - 0.5);
    const shuffled = shuffledQuestionsList.map((q) => {
      const shuffledOpts = shuffleOptions(q.options, q.answer);
      return {
        ...q,
        options: shuffledOpts.map((opt) => opt.text),
        answer: shuffledOpts.findIndex((opt) => opt.isCorrect),
      };
    });
    setShuffledQuestions(shuffled);
  }, []);

  const handleAnswer = async (selectedIndex) => {
    if (!shuffledQuestions.length) return;
    setSelectedOption(selectedIndex);
    setShowFeedback(true);
    const isCorrect = selectedIndex === shuffledQuestions[currentQuestion].answer;
    if (isCorrect) {
      setScore(score + 1);
      if (currentUser) {
        const userRef = doc(db, 'users', currentUser.uid);
        await updateDoc(userRef, {
          coins: increment(1),
          quizScore: increment(1),
        });
      }
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

  const handleDeposit = async () => {
    if (!currentUser) {
      alert('Please log in to deposit coins!');
      return;
    }
    const coinsToDeposit = score * 1;
    try {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, {
        virtualBalance: increment(coinsToDeposit),
      });
      setVirtualBalance(virtualBalance + coinsToDeposit);
      alert(`${coinsToDeposit} coins deposited to your virtual savings! Great job!`);
    } catch (error) {
      console.error('Deposit error:', error);
      alert('Deposit failed—try again!');
    }
  };

  if (!shuffledQuestions.length) {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        Loading quiz...
      </div>
    );
  }

  return (
    <div style={{ padding: '20px', textAlign: 'center' }}>
      <h2>Rich Dad Poor Dad Quiz</h2>
      {showScore ? (
        <div>
          <p>Your score: {score} out of {shuffledQuestions.length}</p>
          <button
            style={{
              backgroundColor: '#007bff',
              color: 'white',
              padding: '10px 20px',
              border: 'none',
              borderRadius: '5px',
              cursor: 'pointer',
            }}
            onClick={handleDeposit}
          >
            Deposit {score * 1} Coins to Savings!
          </button>
        </div>
      ) : (
        <div>
          <p>
            Question {currentQuestion + 1}/{shuffledQuestions.length}: {shuffledQuestions[currentQuestion].question}
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
                        ? '#28a745' // Green for correct
                        : selectedOption === index
                        ? '#dc3545' // Red for incorrect
                        : '#007bff' // Default blue
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

export default RichDadPoorDadQuiz;