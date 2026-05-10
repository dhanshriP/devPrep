import React, { useState, useEffect, useCallback } from 'react';
import { callLLM, safeParseJSON } from '../api';

const DailyScenario = ({ role, domainStack }) => {
  const [gameState, setGameState] = useState('loading'); // 'loading', 'idle', 'active', 'completed'
  const [currentChallenge, setCurrentChallenge] = useState(null);
  const [timeLeft, setTimeLeft] = useState(180);
  const [error, setError] = useState(null);
  const [userDraft, setUserDraft] = useState('');

  const fetchChallenge = useCallback(async () => {
    if (!role || !domainStack) return;
    
    setGameState('loading');
    setError(null);
    try {
      const randomSeed = Math.floor(Math.random() * 1000000);
      const isStrategic = ["TPM", "Scrum Master", "Delivery Manager", "Business Analyst"].includes(role);
      
      const userPrompt = `System Context ID: ${randomSeed}. Generate an elite career scenario for a ${role} specializing in ${domainStack}.`;
      const systemPrompt = `You are a Senior Hiring Partner at a global tech firm. 
      Generate a UNIQUE, high-stakes situational intelligence scenario for a ${role} focusing on ${domainStack}. 
      Seed ID for randomness: ${randomSeed}.
      
      UNIQUENESS GUIDELINES:
      - NEVER say "I am an AI". Act as an elite hiring professional.
      - Scenarios should involve modern challenges: AI-augmented teams, large-scale systems, or high-stakes stakeholder negotiations.
      - If role is Strategic (${role}), focus on leadership, outcomes, and complex trade-offs. NO coding/caching questions.
      
      Return ONLY a raw JSON object with NO other text:
      {
        "title": "A sharp situational title",
        "description": "A complex 2-3 sentence problem requiring high-level judgment.",
        "solution": "A structured 2-3 sentence elite hiring committee approach."
      }`;
      
      const raw = await callLLM(userPrompt, systemPrompt);
      const data = safeParseJSON(raw);
      
      if (data && data.title && data.description) {
        setCurrentChallenge(data);
        setGameState('idle');
        setTimeLeft(180);
        setUserDraft('');
      } else {
        throw new Error("Data sync failure.");
      }
    } catch (err) {
      console.error("Scenario Fetch Error:", err);
      setError("Unable to sync with latest industry data. Please click 'Force Sync' to reconnect.");
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
      <div className="daily-scenario-container loading-state">
        <div className="binary-loader"></div>
        <p className="loading-message">Synthesizing Market Dynamics...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-pro glass-container">
      <div className="scenario-meta">
        <span className="badge-elite">SITUATIONAL INTELLIGENCE</span>
        {gameState === 'active' && <div className="timer-pill critical-pulse">⏳ {formatTime(timeLeft)}</div>}
      </div>

      {error ? (
        <div className="error-card">
          <p>{error}</p>
          <button className="primary-btn elite-glow" onClick={fetchChallenge}>🔄 Force Sync</button>
        </div>
      ) : currentChallenge && (
        <div className="scenario-content">
          <h2 className="display-title-elite">{currentChallenge.title}</h2>
          
          {gameState === 'idle' && (
            <div className="view-pane-elite fade-in">
              <p className="scenario-text">{currentChallenge.description}</p>
              <div className="action-row-elite">
                <button className="primary-btn elite-glow" onClick={() => setGameState('active')}>
                  Accept Mission
                </button>
                <button className="ghost-btn-elite" onClick={fetchChallenge}>
                   <span>🔄</span> Skip Scenario
                </button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="view-pane-elite fade-in">
              <p className="scenario-text subtle">{currentChallenge.description}</p>
              <textarea 
                className="input-textarea-executive" 
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder="Draft your executive solution..."
                autoFocus
              ></textarea>
              <div className="action-row-elite">
                <button className="primary-btn elite-glow" onClick={() => setGameState('completed')}>Finalize Solution</button>
                <button className="ghost-btn-elite" onClick={() => setGameState('idle')}>Back</button>
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="view-pane-elite fade-in">
              <div className="feedback-card-elite">
                <div className="status-label">✓ EVALUATION COMPLETE</div>
                <h4 className="insight-header">Hiring Partner's Core Insight:</h4>
                <p className="insight-text">{currentChallenge.solution}</p>
              </div>
              <div className="centered-action">
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
