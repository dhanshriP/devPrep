import React, { useState, useEffect, useCallback } from 'react';
import { callLLM, safeParseJSON } from '../api';

const DailyScenario = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'idle', 'active', 'completed'
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState(null);
  const [userSolution, setUserSolution] = useState('');

  const fetchChallenge = useCallback(async () => {
    if (!role || !domainStack) return;
    
    setGameState('loading');
    setError(null);
    try {
      const randomSeed = Math.floor(Math.random() * 100000);
      
      const systemPrompt = `You are a Tier-1 Hiring Partner. 
      Generate a UNIQUE, high-stakes situational scenario for a ${role} focused on ${domainStack}. 
      Seed ID: ${randomSeed}.
      
      UNIQUENESS RULES:
      - Context: High-scale modern tech environments.
      - ROLE: If ${role} is non-technical (BA, TPM, SM, DM), focus on leadership/strategy/requirements. NO technical design (like caching).
      - Do NOT mention being an AI.
      
      Return ONLY a JSON object:
      {
        "title": "A sharp situational title",
        "description": "A complex 2-3 sentence situational problem.",
        "solution": "A structured 2-3 sentence recommended approach."
      }`;
      
      const raw = await callLLM(`Generate unique situational challenge for ${role} focus ${domainStack}. Seed: ${randomSeed}`, systemPrompt);
      const data = safeParseJSON(raw);
      
      if (data && data.title && data.description) {
        setCurrentChallenge(data);
        setGameState('idle');
        setTimeLeft(180);
        setUserSolution('');
      } else {
        throw new Error("Invalid format");
      }
    } catch (err) {
      console.error("Scenario Fetch Error:", err);
      setError("Unable to sync with industry data. Please click 'Force Sync' to reconnect.");
      setGameState('idle');
    }
  }, [role, domainStack]);

  useEffect(() => {
    fetchChallenge();
  }, [fetchChallenge]);

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
      <div className="daily-scenario-pro-v2 loading-state">
        <div className="binary-loader"></div>
        <p className="loading-text">Analyzing market dynamics for {role}...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-pro-v2 fade-in">
      <div className="badge-row">
        <span className="elite-badge">SITUATIONAL INTELLIGENCE</span>
        {gameState === 'active' && <div className="timer-badge-pro critical-pulse">⏳ {formatTime(timeLeft)}</div>}
      </div>

      {error ? (
        <div className="error-card-v2">
          <p>{error}</p>
          <button className="primary-btn elite-glow" onClick={fetchChallenge}>🔄 Force Sync</button>
        </div>
      ) : currentChallenge && (
        <div className="scenario-card-body">
          <h2 className="challenge-display-title">{currentChallenge.title}</h2>
          
          {gameState === 'idle' && (
            <div className="view-pane-v2">
              <p className="scenario-text-premium">{currentChallenge.description}</p>
              <div className="button-group-v2">
                <button className="primary-btn elite-glow" onClick={() => setGameState('active')}>
                  Accept Mission
                </button>
                <button className="reset-btn-glass" onClick={fetchChallenge}>
                   <span>🔄</span> Skip Scenario
                </button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="view-pane-v2">
              <p className="scenario-text-premium subtle">{currentChallenge.description}</p>
              <textarea 
                className="input-textarea-executive" 
                value={userSolution}
                onChange={(e) => setUserSolution(e.target.value)}
                placeholder="Draft your executive solution..."
                autoFocus
              ></textarea>
              <div className="button-group-v2">
                <button className="primary-btn elite-glow" onClick={() => setGameState('completed')}>Finalize Solution</button>
                <button className="ghost-btn-pro" onClick={() => setGameState('idle')}>Back</button>
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="view-pane-v2">
              <div className="feedback-card-premium">
                <div className="status-label-pro">✓ EVALUATION COMPLETE</div>
                <h4 className="insight-header">Hiring Partner's Core Insight:</h4>
                <p className="insight-text-pro">{currentChallenge.solution}</p>
              </div>
              <div className="centered-action-pro">
                <button className="primary-btn elite-glow" onClick={fetchChallenge}>Next Scenario</button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default DailyScenario;
