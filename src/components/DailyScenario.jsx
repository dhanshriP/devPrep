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
      const systemPrompt = `You are an elite Hiring Partner at a global tech firm in 2026. 
      Generate a real-world, high-stakes situational intelligence scenario for a ${role} focusing on ${domainStack}.
      
      UNIQUENESS GUIDELINES:
      - NEVER say "I am your AI interviewer".
      - Context is 2026: AI-augmented workflows, high-scale distributed systems, or complex remote leadership.
      - If role is ${role} (Strategic/Leadership/Analytics), focus on: Stakeholder paralysis, requirements volatility, cross-team friction, or AI-driven delivery bottlenecks.
      - If role is Technical, focus on: 2026-scale architectural drift, edge-case failure modes, or emerging stack trade-offs.
      - NO generic questions like "Design a Caching Strategy" for management/BA roles.
      
      Return ONLY a JSON object:
      {
        "title": "A sharp, realistic title",
        "description": "A complex 2-3 sentence situational challenge.",
        "solution": "A structured 2-3 sentence 'Bar Raiser' level response."
      }`;
      
      const raw = await callLLM(`Generate a 2026 elite situational challenge for ${role} with focus on ${domainStack}`, systemPrompt);
      const data = safeParseJSON(raw);
      setCurrentChallenge(data);
      setGameState('idle');
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
      timer = setInterval(() => setTimeLeft((prev) => setTimeLeft(prev - 1)), 1000);
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
        <div className="loader-ring"></div>
        <p>Analyzing 2026 industry trends for {role}...</p>
      </div>
    );
  }

  return (
    <div className="daily-scenario-pro">
      <div className="badge-row">
        <span className="elite-badge">SITUATIONAL INTELLIGENCE • 2026</span>
        {gameState === 'active' && <div className="timer-pill">STAY FOCUSED • {formatTime(timeLeft)}</div>}
      </div>

      {currentChallenge && (
        <div className="challenge-display">
          <h2 className="display-title">{currentChallenge.title}</h2>
          
          {gameState === 'idle' && (
            <div className="view-intro">
              <p className="scenario-text">{currentChallenge.description}</p>
              <div className="button-group">
                <button className="primary-btn elite" onClick={() => setGameState('active')}>
                  Enter the Arena
                </button>
                <button className="ghost-btn" onClick={fetchChallenge}>Next Scenario</button>
              </div>
            </div>
          )}

          {gameState === 'active' && (
            <div className="view-active">
              <p className="scenario-text subtle">{currentChallenge.description}</p>
              <textarea 
                className="input-textarea-premium" 
                placeholder="Draft your executive response..."
              ></textarea>
              <button className="primary-btn elite" onClick={() => setGameState('completed')}>Finalize Solution</button>
            </div>
          )}

          {gameState === 'completed' && (
            <div className="view-completed">
              <div className="feedback-card">
                <div className="status-indicator">EVALUATION COMPLETE</div>
                <h4>Hiring Partner's Insight:</h4>
                <p>{currentChallenge.solution}</p>
              </div>
              <button className="primary-btn elite" onClick={fetchChallenge}>Next Challenge</button>
            </div>
          )}
        </div>
      )}
      {error && <p className="error-text">{error}</p>}
    </div>
  );
};

export default DailyScenario;
