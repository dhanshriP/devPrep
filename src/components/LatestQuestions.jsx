import React, { useState, useEffect, useCallback } from 'react';
import { callLLM, safeParseJSON } from '../api';

const LatestQuestions = ({ role, domainStack }) => {
  const [loading, setLoading] = useState(true);
  const [trends, setTrends] = useState([]);
  const [error, setError] = useState(null);

  const fetchTrends = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const randomSeed = Math.floor(Math.random() * 10000);
      const systemPrompt = `You are a Global Talent Intelligence Lead. 
      Generate a list of 5 MOST RECENT and FREQUENTLY ASKED interview questions for a ${role} focusing on ${domainStack}.
      Seed ID: ${randomSeed}.
      
      UNIQUENESS GUIDELINES:
      - Focus on questions asked in the last 6 months at top tech firms (FAANG, Tier-1 Startups).
      - If ${role} is Strategic (TPM, BA, SM, DM), focus on modern delivery, stakeholder complexity, and AI-era requirements.
      - If ${role} is Technical, focus on current high-scale architecture and modern framework trade-offs.
      
      Return ONLY a JSON array with this structure:
      [
        { "question": "The question text", "trend_insight": "Why this is trending now and what hiring partners look for." },
        ...
      ]`;

      const raw = await callLLM(`Analyze current market trends for ${role} in ${domainStack}`, systemPrompt);
      const data = safeParseJSON(raw);
      
      if (Array.isArray(data)) {
        setTrends(data);
      } else {
        throw new Error("Data sync failure.");
      }
    } catch (err) {
      setError("Market intelligence link unstable. Please try a Force Sync.");
    } finally {
      setLoading(false);
    }
  }, [role, domainStack]);

  useEffect(() => {
    fetchTrends();
  }, [fetchTrends]);

  return (
    <div className="latest-trends-view fade-in">
      <div className="trends-header-elite">
        <div className="live-status">
           <span className="pulse-dot-green"></span>
           LIVE MARKET INTELLIGENCE
        </div>
        <h2>Trending Evaluation Probes</h2>
        <p>Current high-frequency queries for <strong>{role}</strong> roles in <strong>{domainStack}</strong>.</p>
      </div>

      {loading ? (
        <div className="loading-state-pro">
          <div className="binary-loader"></div>
          <p>Syncing with Global Hiring Databases...</p>
        </div>
      ) : error ? (
        <div className="error-card-pro">
          <p>{error}</p>
          <button className="primary-btn-elite" onClick={fetchTrends}>🔄 Force Sync</button>
        </div>
      ) : (
        <div className="trends-list-elite">
          {trends.map((item, idx) => (
            <div key={idx} className="trend-card-elite">
              <div className="trend-rank">#{idx + 1}</div>
              <div className="trend-info">
                <h3>{item.question}</h3>
                <div className="insight-box">
                  <span className="insight-label">MARKET SIGNAL</span>
                  <p>{item.trend_insight}</p>
                </div>
              </div>
            </div>
          ))}
          <div className="refresh-action">
            <button className="ghost-btn-sync" onClick={fetchTrends}>
               🔄 Refresh Market Data
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default LatestQuestions;
