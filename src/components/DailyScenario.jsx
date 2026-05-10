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
      
      const userPrompt = `System Context ID: ${randomSeed}. Generate a 2026 elite career scenario for a ${role} specializing in ${domainStack}.`;
      const systemPrompt = `You are an elite Hiring Partner at a global tech firm in 2026. 
      Generate a UNIQUE, high-stakes situational intelligence scenario for a ${role} focusing on ${domainStack}. 
      
      UNIQUENESS GUIDELINES:
      - NEVER say "I am your AI interviewer".
      - NO generic questions. Focus on 2026 specific challenges: AI-native team friction, extreme scale reliability, or strategic requirements drift.
      - If role is Strategic (${role}), focus on leadership/outcomes. NO technical design like caching.
      
      Return ONLY a raw JSON object with NO other text:
      {
        "title": "A sharp 2026 title",
        "description": "A complex 2-3 sentence situational problem.",
        "solution": "A structured 2-3 sentence executive-level strategy."
      }`;
      
      const raw = await callLLM(userPrompt, systemPrompt);
      const data = safeParseJSON(raw);
      
      if (data && data.title && data.description && data.solution) {
        setCurrentChallenge(data);
        setGameState('idle');
        setTimeLeft(180);
        setUserDraft('');
      } else {
        throw new Error("Data parsing failed");
      }
    } catch (err) {
      console.error("Scenario Fetch Error:", err);
      setError("Unable to sync with industry data. Industry stream is unstable. Please click 'Force Sync' to reconnect.");
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
        <p className="loading-message">Synthesizing 2026 Market Dynamics...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-pro glass-card">
      <div className="scenario-meta">
        <span className="elite-badge">SITUATIONAL INTELLIGENCE • 2026</span>
        {gameState === 'active' && <div className="timer-pill-pro critical-pulse">⏳ {formatTime(timeLeft)}</div>}
      </div>

      {error ? (
        <div className="error-card-v2">
          <p className="error-text-pro">{error}</p>
          <button className="primary-btn elite-glow" onClick={fetchChallenge}>🔄 Force Sync</button>
        </div>
      ) : currentChallenge && (
        <div className="scenario-content">
          <h2 className="display-title-elite">{currentChallenge.title}</h2>
          
          {gameState === 'idle' && (
            <div className="view-pane-pro fade-in">
              <p className="scenario-text-pro">{currentChallenge.description}</p>
              <div className="action-row-pro">
                <button className="primary-btn elite-glow" onClick={() => setGameState('active')}>
                  Accept Mission
                </button>
                <button className="ghost-btn-sync" onClick={fetchChallenge}>
                   <span>🔄</span> Skip
                </button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="view-pane-pro fade-in">
              <p className="scenario-text-pro dimmed">{currentChallenge.description}</p>
              <textarea 
                className="input-textarea-executive" 
                value={userDraft}
                onChange={(e) => setUserDraft(e.target.value)}
                placeholder="Draft your executive strategy here..."
                autoFocus
              ></textarea>
              <div className="action-row-pro">
                <button className="primary-btn elite-glow" onClick={() => setGameState('completed')}>Finalize Solution</button>
                <button className="ghost-btn-sync" onClick={() => setGameState('idle')}>Cancel</button>
              </div>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="view-pane-pro fade-in">
              <div className="feedback-card-elite">
                <div className="status-label-pro">✓ EVALUATION COMPLETE</div>
                <h4 className="insight-label-pro">Hiring Partner's Core Insight:</h4>
                <p className="solution-text-pro">{currentChallenge.solution}</p>
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
