import React, { useState, useEffect, useCallback } from 'react';
import { callLLM, safeParseJSON } from '../api';

const SkillGame = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'loading', 'playing', 'result'
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentIdx, setCurrentIdx] = useState(0);
  const [timeLeft, setTimeLeft] = useState(30); // Updated to 30s
  const [selectedOption, setSelectedOption] = useState(null);
  const [streak, setStreak] = useState(0);
  const [error, setError] = useState(null);
  const [feedback, setFeedback] = useState(null); // 'correct', 'wrong'

  const isStrategic = ["TPM", "Scrum Master", "Delivery Manager", "Business Analyst"].includes(role);

  const fetchQuestions = async () => {
    setGameState('loading');
    setError(null);
    try {
      const systemPrompt = `You are an Elite Assessment Designer. 
      Generate 5 hyper-relevant, high-stakes multiple-choice questions for a ${role} with expertise in ${domainStack}.
      
      INTENSITY GUIDELINES:
      - Context is high-scale, AI-integrated environments.
      - ROLE ACCURACY: If role is ${role} (Strategic), focus on Situational Leadership, Requirements Volatility, Risk Mitigation, and Delivery Metrics. NO CODING/CACHING questions.
      - If Technical, focus on high-order trade-offs and modern architecture.
      - Each question must have 4 options and 1 correct answer (index 0-3).
      - Return ONLY a JSON array: [{"question": "...", "options": ["...", "..."], "answer": 0}, ...]`;
      
      const raw = await callLLM(`Generate an elite evaluation for ${role}`, systemPrompt);
      const data = safeParseJSON(raw);
      setQuestions(data);
      setGameState('playing');
      setCurrentIdx(0);
      setScore(0);
      setStreak(0);
      setTimeLeft(30);
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
    setFeedback(correct ? 'correct' : 'wrong');
    
    if (correct) {
      const timeBonus = Math.floor(timeLeft / 2);
      const streakBonus = streak * 10;
      setScore(prev => prev + 50 + timeBonus + streakBonus);
      setStreak(prev => prev + 1);
    } else {
      setStreak(0);
    }

    setTimeout(() => {
      setFeedback(null);
      if (currentIdx < questions.length - 1) {
        setCurrentIdx(prev => prev + 1);
        setSelectedOption(null);
        setTimeLeft(30); // Reset to 30s for next question
      } else {
        setGameState('result');
      }
    }, 1500);
  };

  return (
    <div className="elite-sprint-container interactive-game">
      <div className="sprint-header">
        <div className="sprint-identity">
           <h2>{isStrategic ? 'Strategic Sprint' : 'Technical Sprint'}</h2>
           <span className="year-tag">ELITE EDITION</span>
        </div>
        {gameState === 'playing' && (
          <div className="sprint-stats">
            <div className={`stat-item streak-pulse ${streak > 2 ? 'hot' : ''}`}>
              <span className="label">STREAK</span>
              <span className="value streak">{streak}x</span>
            </div>
            <div className="stat-item">
              <span className="label">POINTS</span>
              <span className="value">{score}</span>
            </div>
            <div className={`timer-ring ${timeLeft < 10 ? 'critical' : ''}`}>
              {timeLeft}
            </div>
          </div>
        )}
      </div>

      {gameState === 'start' && (
        <div className="sprint-intro">
          <div className="hero-visual">{isStrategic ? '🛡️' : '⚡'}</div>
          <h3>Initiate {role} Evaluation</h3>
          <p>5 Rapid scenarios. 30 seconds each. Speed and accuracy generate massive multipliers.</p>
          {error && <p className="error-msg">{error}</p>}
          <button className="primary-btn elite-glow" onClick={fetchQuestions}>Start Evaluation</button>
        </div>
      )}

      {gameState === 'loading' && (
        <div className="sprint-loading">
          <div className="binary-loader"></div>
          <p>Compiling Industry Assessment Data...</p>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className={`sprint-playboard ${feedback ? `fade-out-${feedback}` : ''}`}>
          <div className="progress-track">
            <div className="progress-bar-fill" style={{ width: `${((currentIdx + 1) / questions.length) * 100}%` }}></div>
          </div>
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
          {feedback === 'correct' && <div className="feedback-overlay plus-points">+50 Points!</div>}
          {feedback === 'wrong' && <div className="feedback-overlay minus-streak">Streak Broken</div>}
        </div>
      )}

      {gameState === 'result' && (
        <div className="sprint-summary">
          <div className="summary-card">
            <div className="rank-medal">{score > 300 ? '🏆' : '🏅'}</div>
            <h3>Evaluation Finalized</h3>
            <div className="score-breakdown">
              <div className="score-main">
                <span className="label">FINAL SCORE</span>
                <span className="value">{score}</span>
              </div>
              <div className="score-sub">
                <p>Performance: <strong>{score > 300 ? 'Mastery' : 'Professional'}</strong></p>
              </div>
            </div>
            <button className="primary-btn elite-glow" onClick={fetchQuestions}>New Evaluation</button>
          </div>
        </div>
      )}
    </div>
  );
};

export default SkillGame;
