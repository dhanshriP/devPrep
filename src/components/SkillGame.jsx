import React, { useState, useEffect } from 'react';
import { callLLM, safeParseJSON } from '../api';

const SkillGame = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'loading', 'playing', 'result'
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState(null);

  const isTechnical = ["SDE", "Principal Engineer", "EM"].includes(role);

  const fetchQuestions = async () => {
    setGameState('loading');
    setError(null);
    try {
      const systemPrompt = `You are a technical game designer for a developer portal. 
      Generate 5 challenging, unique multiple-choice questions for a ${role} with expertise in ${domainStack}.
      
      RULES:
      - If role is TPM/Scrum Master/Delivery Manager, focus on scenarios: "A stakeholder demands X, what do you do?", "Velocity dropped by 20%, what's the first step?", etc. NO CODING.
      - If role is SDE/Principal, focus on high-level architecture and deep tech trade-offs.
      - Each question must have 4 options and 1 correct answer (index 0-3).
      - Return ONLY a JSON array of objects: [{"question": "...", "options": ["...", "..."], "answer": 0}, ...]`;
      
      const raw = await callLLM(`Generate a "Tech Sprint" game for ${role} / ${domainStack}`, systemPrompt);
      const data = safeParseJSON(raw);
      setQuestions(data);
      setGameState('playing');
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
      setTimeLeft(15);
    } catch (err) {
      setError("AI was too busy playing games. Try again!");
      setGameState('start');
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleAnswer(-1); // Timeout
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleAnswer = (idx) => {
    if (selectedOption !== null) return;
    
    setSelectedOption(idx);
    const correct = idx === questions[currentIdx].answer;
    
    if (correct) {
      const bonus = streak * 2;
      setScore(prev => prev + 10 + bonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(15);
      } else {
        setGameState('result');
      }
    }, 1200);
  };

  return (
    <div className="game-container-pro">
      <div className="game-header-pro">
        <div className="game-title">
           <h2>{isTechnical ? 'Tech Sprint' : 'Leadership Sprint'}</h2>
           <p className="game-subtitle">Speed & Accuracy Challenge</p>
        </div>
        {gameState === 'playing' && (
          <div className="game-meta">
            <div className="stat-badge">🔥 {streak} Streak</div>
            <div className="stat-badge">⭐ {score} Pts</div>
            <div className={`timer-circle ${timeLeft < 5 ? 'urgent' : ''}`}>{timeLeft}</div>
          </div>
        )}
      </div>

      {gameState === 'start' && (
        <div className="start-screen">
          <div className="game-hero-icon">{isTechnical ? '⚡' : '🛡️'}</div>
          <h3>Ready for the Sprint?</h3>
          <p>5 questions. 15 seconds each. Bonus points for streaks.</p>
          {error && <p className="error-msg">{error}</p>}
          <button className="primary-btn pulse" onClick={fetchQuestions}>Start Engine</button>
        </div>
      )}

      {gameState === 'loading' && (
        <div className="loading-screen">
          <div className="loader-ring"></div>
          <p>AI is generating custom challenges...</p>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className="play-screen">
          <div className="q-number">Question {currentIdx + 1} of {questions.length}</div>
          <h3 className="game-question">{questions[currentIdx].question}</h3>
          <div className="game-options">
            {questions[currentIdx].options.map((opt, i) => (
              <button 
                key={i} 
                className={`game-opt-btn ${selectedOption === i ? (i === questions[currentIdx].answer ? 'correct' : 'wrong') : ''} ${selectedOption !== null && i === questions[currentIdx].answer ? 'correct' : ''}`}
                onClick={() => handleAnswer(i)}
                disabled={selectedOption !== null}
              >
                {opt}
              </button>
            ))}
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="result-screen">
          <div className="medal">{score > 30 ? '🥇' : '🥈'}</div>
          <h3>Sprint Finished!</h3>
          <div className="final-stats">
            <div className="stat"><span>Final Score</span><strong>{score}</strong></div>
            <div className="stat"><span>Max Streak</span><strong>{streak}</strong></div>
          </div>
          <button className="primary-btn" onClick={fetchQuestions}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SkillGame;
