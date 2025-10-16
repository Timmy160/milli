import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

function ProgressTracker() {
  const [goals, setGoals] = useState(() => {
    const savedGoals = localStorage.getItem('goals');
    return savedGoals ? JSON.parse(savedGoals) : [];
  });
  const [newGoal, setNewGoal] = useState('');
  const [editingIndex, setEditingIndex] = useState(null);

  useEffect(() => {
    localStorage.setItem('goals', JSON.stringify(goals));
  }, [goals]);

  const handleAddGoal = () => {
    if (newGoal.trim()) {
      setGoals([...goals, { text: newGoal, done: false }]);
      setNewGoal('');
    }
  };

  const handleDeleteGoal = (index) => {
    const updated = goals.filter((_, i) => i !== index);
    setGoals(updated);
  };

  const handleEditGoal = (index) => {
    setEditingIndex(index);
    setNewGoal(goals[index].text);
  };

  const handleUpdateGoal = () => {
    const updated = goals.map((goal, i) =>
      i === editingIndex ? { ...goal, text: newGoal } : goal
    );
    setGoals(updated);
    setEditingIndex(null);
    setNewGoal('');
  };

  const toggleDone = (index) => {
    const updated = goals.map((goal, i) =>
      i === index ? { ...goal, done: !goal.done } : goal
    );
    setGoals(updated);
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        backgroundColor: '#f5faf6',
        padding: '20px',
        fontFamily: '"Poppins", sans-serif',
        textAlign: 'center',
      }}
    >
      <Link
        to="/home"
        style={{
          backgroundColor: '#1a362b',
          color: 'white',
          padding: '8px 16px',
          borderRadius: '8px',
          textDecoration: 'none',
          fontSize: '14px',
          fontWeight: '500',
          marginBottom: '20px',
          display: 'inline-block',
        }}
      >
        Back
      </Link>

      <h2
        style={{
          backgroundColor: '#c8e6c9',
          color: '#1a362b',
          padding: '10px 20px',
          borderRadius: '10px',
          fontSize: '22px',
          fontWeight: '600',
          marginBottom: '20px',
          display: 'inline-block',
        }}
      >
        Progress Tracker 🌱
      </h2>

      <p
        style={{
          color: '#1a362b',
          fontSize: '14px',
          marginBottom: '25px',
          maxWidth: '350px',
          margin: '0 auto 25px auto',
        }}
      >
        Stay consistent and focused. Write down your goals, track your progress, and celebrate every small win!
      </p>

      {/* Input Section */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          gap: '10px',
          marginBottom: '20px',
          flexWrap: 'wrap',
        }}
      >
        <textarea
          value={newGoal}
          onChange={(e) => setNewGoal(e.target.value)}
          placeholder="Write your goal here..."
          style={{
            width: '95%',
            maxWidth: '700px',
            minHeight: '150px', // Increased textarea height
            padding: '8px',
            borderRadius: '10px',
            border: '1px solid #94BD0A',
            fontSize: '14px',
            resize: 'none',
            lineHeight: '1.5',
            outline: 'none',
          }}
        />
        {editingIndex !== null ? (
          <button
            onClick={handleUpdateGoal}
            style={{
              backgroundColor: '#94BD0A',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              alignSelf: 'center',
            }}
          >
            Update
          </button>
        ) : (
          <button
            onClick={handleAddGoal}
            style={{
              backgroundColor: '#1A362B',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              padding: '14px 20px',
              fontWeight: '600',
              cursor: 'pointer',
              alignSelf: 'center',
            }}
          >
            Add
          </button>
        )}
      </div>

      {/* Goals List */}
      <div
        style={{
          width: '95%',
          maxWidth: '500px',
          margin: '0 auto',
          textAlign: 'left',
        }}
      >
        {goals.map((goal, index) => (
          <div
            key={index}
            style={{
              backgroundColor: '#fff',
              borderRadius: '12px',
              padding: '15px',
              marginBottom: '12px',
              boxShadow: '0 2px 6px rgba(0,0,0,0.1)',
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              flexWrap: 'wrap',
              gap: '10px',
              wordBreak: 'break-word',
              overflowWrap: 'break-word',
            }}
          >
            <div
              style={{
                flex: '1 1 60%',
                wordWrap: 'break-word',
                textDecoration: goal.done ? 'line-through' : 'none',
                color: goal.done ? 'gray' : '#1A362B',
                fontSize: '14px',
                overflowWrap: 'anywhere',
              }}
            >
              {goal.text}
            </div>

            <div
              style={{
                display: 'flex',
                gap: '8px',
                alignItems: 'center',
                flexShrink: 0,
              }}
            >
              <input
                type="checkbox"
                checked={goal.done}
                onChange={() => toggleDone(index)}
                style={{
                  transform: 'scale(1.2)',
                  cursor: 'pointer',
                }}
              />
              <div
                style={{
                  display: 'flex',
                  gap: '2px', // Ensure buttons are side by side
                }}
              >
                <button
                  onClick={() => handleEditGoal(index)}
                  style={{
                    backgroundColor: '#94BD0A',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '6px 12px', // Slightly larger padding for better appearance
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: '1', // Ensure buttons take equal space
                    minWidth: '60px', // Minimum width for consistency
                  }}
                >
                  Edit
                </button>
                <button
                  onClick={() => handleDeleteGoal(index)}
                  style={{
                    backgroundColor: '#d9534f',
                    color: 'white',
                    border: 'none',
                    borderRadius: '8px',
                    padding: '10px 12px', // Slightly larger padding for better appearance
                    fontSize: '12px',
                    cursor: 'pointer',
                    flex: '1', // Ensure buttons take equal space
                    minWidth: '60px', // Minimum width for consistency
                  }}
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default ProgressTracker;