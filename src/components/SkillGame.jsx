import React, { useState, useEffect } from 'react';
import { callLLM, safeParseJSON } from '../api';

const SkillGame = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'loading', 'playing', 'result'
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(12);
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState(null);

  const isStrategic = ["TPM", "Scrum Master", "Delivery Manager", "Business Analyst"].includes(role);

  const fetchQuestions = async () => {
    setGameState('loading');
    setError(null);
    try {
      const systemPrompt = `You are an Elite Assessment Designer in 2026. 
      Generate 5 hyper-relevant, high-stakes multiple-choice questions for a ${role} with expertise in ${domainStack}.
      
      INTENSITY GUIDELINES:
      - YEAR: 2026. Context is high-scale, AI-integrated environments.
      - ROLE ACCURACY: If role is ${role} (Strategic), focus on Situational Leadership, Requirements Volatility, Risk Mitigation, and Delivery Metrics. NO CODING/CACHING questions.
      - If Technical, focus on high-order trade-offs and 2026 architecture.
      - Each question must have 4 options and 1 correct answer (index 0-3).
      - Return ONLY a JSON array: [{"question": "...", "options": ["...", "..."], "answer": 0}, ...]`;
      
      const raw = await callLLM(`Generate an elite 2026 evaluation for ${role}`, systemPrompt);
      const data = safeParseJSON(raw);
      setQuestions(data);
      setGameState('playing');
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
      setTimeLeft(12);
    } catch (err) {
      setError("Grid sync failed. Retrying...");
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
      const timeBonus = timeLeft * 2;
      const streakBonus = streak * 5;
      setScore(prev => prev + 10 + timeBonus + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(12);
      } else {
        setGameState('result');
      }
    }, 1000);
  };

  return (
    <div className="elite-sprint-container">
      <div className="sprint-header">
        <div className="sprint-identity">
           <h2>{isStrategic ? 'Strategic Sprint' : 'Technical Sprint'}</h2>
           <span className="year-tag">2026 EDITION</span>
        </div>
        {gameState === 'playing' && (
          <div className="sprint-stats">
            <div className="stat-item"><span className="label">STREAK</span><span className="value streak">{streak}x</span></div>
            <div className="stat-item"><span className="label">POINTS</span><span className="value">{score}</span></div>
            <div className={`timer-ring ${timeLeft < 4 ? 'critical' : ''}`}>{timeLeft}</div>
          </div>
        )}
      </div>

      {gameState === 'start' && (
        <div className="sprint-intro">
          <div className="hero-visual">{isStrategic ? '🛡️' : '⚡'}</div>
          <h3>Initiate {role} Evaluation</h3>
          <p>5 Rapid scenarios. High precision required. Speed and accuracy generate multipliers.</p>
          {error && <p className="error-msg">{error}</p>}
          <button className="primary-btn elite-glow" onClick={fetchQuestions}>Start Evaluation</button>
        </div>
      )}

      {gameState === 'loading' && (
        <div className="sprint-loading">
          <div className="binary-loader"></div>
          <p>Compiling 2026 {role} Assessment Data...</p>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className="sprint-playboard">
          <div className="question-zone">
            <span className="q-index">QUESTION {currentIdx + 1}/5</span>
            <h3 className="question-text">{questions[currentIdx].question}</h3>
            <div className="options-matrix">
              {questions[currentIdx].options.map((opt, i) => (
                <button 
                  key={i} 
                  className={`opt-tile ${selectedOption === i ? (i === questions[currentIdx].answer ? 'correct' : 'wrong') : ''} ${selectedOption !== null && i === questions[currentIdx].answer ? 'reveal' : ''}`}
                  onClick={() => handleAnswer(i)}
                  disabled={selectedOption !== null}
                >
                  <span className="opt-letter">{String.fromCharCode(65 + i)}</span>
                  <span className="opt-text">{opt}</span>
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="sprint-summary">
          <div className="summary-card">
            <div className="rank-medal">{score > 150 ? '🏆' : '🏅'}</div>
            <h3>Evaluation Finalized</h3>
            <div className="score-breakdown">
              <div className="score-main"><span className="label">FINAL SCORE</span><span className="value">{score}</span></div>
            </div>
            <button className="primary-btn elite-glow" onClick={fetchQuestions}>New Evaluation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGame;
