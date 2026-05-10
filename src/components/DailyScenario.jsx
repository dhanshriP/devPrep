import React, { useState, useEffect } from 'react';
import { callLLM, safeParseJSON } from '../api';

const DailyScenario = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'idle', 'active', 'completed'
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState(null);

  const fetchChallenge = async () => {
    setGameState('loading');
    setError(null);
    try {
      const isManagement = ["TPM", "Scrum Master", "Delivery Manager"].includes(role);
      const systemPrompt = `You are an expert technical interviewer. Generate a REAL-WORLD, latest (2024) interview scenario for a ${role} specializing in ${domainStack}. 
      ${isManagement ? "CRITICAL: This is a management/leadership role. Do NOT ask about coding, caching, or low-level system design. Ask about roadmaps, stakeholder conflict, delivery risks, or agile bottlenecks." : "Focus on high-level architecture and technical trade-offs."}
      Return ONLY a JSON object:
      {
        "title": "A short catchy title",
        "description": "A detailed 2-3 sentence challenge description based on a real company scenario.",
        "solution": "A structured 2-3 sentence recommended elite approach."
      }`;
      
      const raw = await callLLM(`Generate a 2024 interview challenge for ${role}`, systemPrompt);
      const data = safeParseJSON(raw);
      setCurrentChallenge(data);
      setGameState('idle');
    } catch (err) {
      setError("AI is busy analyzing industry trends. Please refresh.");
      setGameState('idle');
    }
  };

  useEffect(() => {
    fetchChallenge();
  }, [role, domainStack]);

  useEffect(() => {
    let timer;
    if (gameState === 'active' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft((prev) => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'active') {
      setGameState('completed');
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
  };

  if (gameState === 'loading') {
    return (
      <div className="daily-scenario-container">
        <div className="loader-ring"></div>
        <p>Analyzing latest 2024 trends for {role}...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-container">
      <div className="badge">2024 INDUSTRY CHALLENGE</div>
      
      {currentChallenge && (
        <div className="challenge-card-pro">
          <div className="header-row">
            <h2 className="challenge-title">{currentChallenge.title}</h2>
            {gameState === 'active' && <div className="timer-pill">⏳ {formatTime(timeLeft)}</div>}
          </div>
          
          {gameState === 'idle' && (
            <div className="intro-view">
              <p className="challenge-desc">{currentChallenge.description}</p>
              <div className="action-row">
                <button className="primary-btn" onClick={() => setGameState('active')}>Accept Mission</button>
                <button className="reset-btn" onClick={fetchChallenge}>Skip Challenge</button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="active-view">
              <p className="challenge-desc">{currentChallenge.description}</p>
              <textarea 
                className="challenge-textarea-pro" 
                placeholder="Draft your solution... (Trade-offs, Risks, Strategy)"
              ></textarea>
              <button className="primary-btn" onClick={() => setGameState('completed')}>Finalize Solution</button>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="completed-view">
              <div className="success-banner">✓ CHALLENGE COMPLETED</div>
              <div className="solution-section">
                <h4>Elite Solution Strategy:</h4>
                <p>{currentChallenge.solution}</p>
              </div>
              <button className="primary-btn" onClick={fetchChallenge}>Get New Mission</button>
            </div>
          )}
        </div>
      )}
      {error && <p className="error-msg">{error}</p>}
    </div>
  );
};

export default DailyScenario;
