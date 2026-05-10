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
      const isStrategic = ["TPM", "Scrum Master", "Delivery Manager", "Business Analyst"].includes(role);
      // Random seed to ensure unique scenarios every time
      const randomSeed = Math.floor(Math.random() * 10000);
      const systemPrompt = `You are a Tier-1 Hiring Partner in 2026. 
      Generate a UNIQUE, high-stakes situational scenario for a ${role} focused on ${domainStack}. 
      Seed ID: ${randomSeed}.
      
      UNIQUENESS RULES:
      - NO generic coding/caching questions.
      - 2026 Context: AI-driven development, high-frequency market shifts, or global-scale cloud governance.
      - If role is Strategic (${role}), focus on stakeholder alignment, requirement volatility, or delivery risks.
      - Do NOT mention being an AI.
      
      Return ONLY a JSON object:
      {
        "title": "A sharp, industry-relevant title",
        "description": "A 2-3 sentence complex situational problem.",
        "solution": "A 2-3 sentence executive-level strategy for the Hiring Committee."
      }`;
      
      const raw = await callLLM(`Generate a fresh 2026 challenge for ${role} with focus on ${domainStack}. Seed: ${randomSeed}`, systemPrompt);
      const data = safeParseJSON(raw);
      setCurrentChallenge(data);
      setGameState('idle');
      setTimeLeft(180);
    } catch (err) {
      setError("Unable to sync with industry data. Please refresh.");
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
      <div className="daily-scenario-pro loading-state">
        <div className="binary-loader"></div>
        <p>Analyzing 2026 industry trends for {role}...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-pro fade-in">
      <div className="badge-row">
        <span className="elite-badge">SITUATIONAL INTELLIGENCE • 2026</span>
        {gameState === 'active' && <div className="timer-pill pulse-red">⏳ {formatTime(timeLeft)}</div>}
      </div>

      {currentChallenge && (
        <div className="challenge-content-area">
          <h2 className="display-title">{currentChallenge.title}</h2>
          
          {gameState === 'idle' && (
            <div className="view-pane">
              <p className="scenario-text">{currentChallenge.description}</p>
              <div className="button-group-pro">
                <button className="primary-btn elite-glow" onClick={() => setGameState('active')}>
                  Accept Mission
                </button>
                <button className="reset-btn-glass" onClick={fetchChallenge}>
                   <span>🔄</span> Skip
                </button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="view-pane">
              <p className="scenario-text subtle">{currentChallenge.description}</p>
              <textarea 
                className="input-textarea-premium" 
                placeholder="Formulate your executive strategy..."
              ></textarea>
              <div className="button-group-pro">
                <button className="primary-btn elite-glow" onClick={() => setGameState('completed')}>Finalize Solution</button>
                <button className="ghost-btn" onClick={() => setGameState('idle')}>Cancel</button>
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="view-pane">
              <div className="feedback-card-elite">
                <div className="indicator">✓ EVALUATION COMPLETE</div>
                <h4>Hiring Partner's Insight:</h4>
                <p className="solution-text">{currentChallenge.solution}</p>
              </div>
              <div className="button-group-pro">
                <button className="primary-btn elite-glow" onClick={fetchChallenge}>Next Scenario</button>
              </div>
            </div>
          )}
        </div>
      )}
      {error && <p className="error-text-pro">{error}</p>}
    </div>
  );
};

export default DailyScenario;
