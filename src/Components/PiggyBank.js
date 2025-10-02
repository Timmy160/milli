import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { onAuthStateChanged } from 'firebase/auth';
import { doc, getDoc, updateDoc, arrayUnion } from 'firebase/firestore';
import { auth, db } from '../firebase'; 

function PiggyBank() {
  const [savings, setSavings] = useState(0);
  const [addAmount, setAddAmount] = useState(0);
  const [realSavings, setRealSavings] = useState(0); // Real savings from rewards
  const [rewardHistory, setRewardHistory] = useState([]); // List of rewards
  const [currentUser, setCurrentUser] = useState(null); // User for fetching data
  const [goals, setGoals] = useState([]); // NEW: Array for saved goals
  const [goalText, setGoalText] = useState(''); // NEW: Input for goal description
  const [goalPrice, setGoalPrice] = useState(0); // NEW: Input for goal price

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        setCurrentUser(user);
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          const data = userDoc.data();
          setRealSavings(data?.realSavings || 0);
          setRewardHistory(data?.rewardHistory || []);
          setSavings(data?.savings || 0); // Keep manual savings
          setGoals(data?.goals || []); // Load goals from Firebase
        } catch (error) {
          console.error('Load error:', error);
        }
      }
    });
    return unsubscribe;
  }, []);

  const addSavings = () => {
    const newSavings = savings + addAmount;
    setSavings(newSavings);
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      updateDoc(userRef, { savings: newSavings });
    } else {
      localStorage.setItem('savings', newSavings);
    }
    setAddAmount(0);
  };

  const addGoal = async () => {
    if (!goalText.trim() || goalPrice <= 0) {
      alert('Please enter a goal and valid price!');
      return;
    }
    const newGoal = { text: goalText, price: goalPrice, date: new Date().toLocaleDateString() };
    if (currentUser) {
      const userRef = doc(db, 'users', currentUser.uid);
      await updateDoc(userRef, { goals: arrayUnion(newGoal) });
      setGoals([...goals, newGoal]); // Update local state
    }
    setGoalText('');
    setGoalPrice(0);
  };

  return (
    <div>
      <Link to="/home" className="back-button">Back</Link>
      <h2>Piggy Bank</h2>
      <p>Real Savings: ₦{realSavings}</p>
      <p>Manual Add: ₦{savings}</p>
      <input 
        type="number" 
        value={addAmount} 
        onChange={(e) => setAddAmount(parseInt(e.target.value) || 0)} 
        placeholder="Add amount (₦)"
      />
      <button onClick={addSavings}>Add Savings</button>

      <h3>Add a Goal</h3>
      <input 
        type="text" 
        value={goalText} 
        onChange={(e) => setGoalText(e.target.value)} 
        placeholder="Goal (e.g., buy a bicycle)"
      />
      <input 
        type="number" 
        value={goalPrice} 
        onChange={(e) => setGoalPrice(parseInt(e.target.value) || 0)} 
        placeholder="Price (₦)"
      />
      <button onClick={addGoal}>Save Goal</button>

      <h3>Your Goals</h3>
      {goals.length > 0 ? (
        <ul>
          {goals.map((goal, index) => (
            <li key={index}>
              {goal.text} - ₦{goal.price} (Added: {goal.date})
              <div className="progress-bar" style={{ width: `${(realSavings / goal.price * 100) > 100 ? 100 : (realSavings / goal.price * 100)}%` }}></div>
              <p>Progress: {((realSavings / goal.price) * 100).toFixed(1)}%</p>
            </li>
          ))}
        </ul>
      ) : (
        <p>No goals yet—add one to start saving!</p>
      )}

      <h3>Reward History</h3>
      <ul>
        {rewardHistory.map((reward, index) => (
          <li key={index}>Rewarded ₦{reward.amount} on {reward.date}</li>
        ))}
      </ul>
    </div>
  );
}

export default PiggyBank;