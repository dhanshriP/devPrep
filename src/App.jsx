import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import MockInterviewScreen from './components/MockInterviewScreen';
import ScorecardScreen from './components/ScorecardScreen';
import DailyScenario from './components/DailyScenario';
import SkillGame from './components/SkillGame';
import './App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('setup'); 
  const [activeTab, setActiveTab] = useState('interview'); 
  const [interviewSettings, setInterviewSettings] = useState(null);
  const [currentScorecard, setCurrentScorecard] = useState(null);
  const [interviewState, setInterviewState] = useState('idle');

  const isTechnicalRole = (role) => ["SDE", "Principal Engineer", "EM"].includes(role);

  const handleSetupComplete = (settings) => {
    setInterviewSettings(settings);
    setCurrentScreen('dashboard');
  };

  const handleEndInterview = (scorecardData) => {
    setCurrentScorecard(scorecardData);
    setInterviewState('result');
  };

  const handleResetSettings = () => {
    setCurrentScreen('setup');
    setInterviewSettings(null);
    setInterviewState('idle');
    setCurrentScorecard(null);
  };

  const dummyScorecard = {
    clarity: "Strong executive presence. You moved beyond tactical implementation to business outcomes.",
    depth: "Demonstrated 2026-scale architectural maturity. Excellent risk-mitigation strategy.",
    structure: "Methodical and framework-driven. Very little fluff in the responses.",
    redFlags: "None. You are currently trending in the top 5% of candidates.",
    weaknessTrackerUpdate: "Consider deepening cross-region AI orchestration trade-offs."
  };

  return (
    <div className="App">
      {currentScreen === 'setup' ? (
        <SetupScreen onSetupComplete={handleSetupComplete} />
      ) : (
        <div className="dashboard-grid">
          <aside className="sidebar-elite">
            <div className="sidebar-brand">
              <h1>DevPrep<span>.ai</span></h1>
            </div>
            
            <div className="profile-widget">
              <div className="profile-header">
                <h3>{interviewSettings?.role}</h3>
                <span className="pill-badge">{interviewSettings?.level}</span>
              </div>
              <div className="tech-context">
                <span className="context-tag">
                  {isTechnicalRole(interviewSettings?.role) ? "Stack: " : "Focus: "}
                  {interviewSettings?.domainStack}
                </span>
              </div>
            </div>

            <nav className="sidebar-nav">
              <button 
                className={`nav-link ${activeTab === 'interview' ? 'active' : ''}`}
                onClick={() => setActiveTab('interview')}
              >
                <span className="nav-icon">🎙️</span> 
                <span className="nav-text">Evaluation</span>
              </button>
              <button 
                className={`nav-link ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                <span className="nav-icon">🧩</span> 
                <span className="nav-text">Scenarios</span>
              </button>
              <button 
                className={`nav-link ${activeTab === 'game' ? 'active' : ''}`}
                onClick={() => setActiveTab('game')}
              >
                <span className="nav-icon">⚡</span> 
                <span className="nav-text">The Sprint</span>
              </button>
            </nav>

            <div className="sidebar-bottom">
              <button className="change-profile-btn" onClick={handleResetSettings}>
                <span className="btn-icon">🔄</span>
                <span>Reset Assessment</span>
              </button>
            </div>
          </aside>

          <main className="main-viewport">
            <div className="content-container-pro">
              {activeTab === 'interview' && (
                <div className="module-view">
                  {interviewState === 'idle' && (
                    <div className="welcome-glass-card">
                      <div className="card-decorator">READY</div>
                      <h2>Executive Evaluation</h2>
                      <p>A conversational session calibrated for <strong>{interviewSettings?.domainStack}</strong>. No generic Q&A.</p>
                      <button className="primary-action-btn" onClick={() => setInterviewState('ongoing')}>
                        Begin Evaluation 🚀
                      </button>
                    </div>
                  )}
                  {interviewState === 'ongoing' && (
                    <MockInterviewScreen 
                      interviewSettings={interviewSettings} 
                      onEndInterview={() => handleEndInterview(dummyScorecard)} 
                    />
                  )}
                  {interviewState === 'result' && (
                    <ScorecardScreen 
                      interviewSettings={interviewSettings} 
                      scorecard={currentScorecard} 
                      onStartNewInterview={() => setInterviewState('idle')} 
                    />
                  )}
                </div>
              )}

              {activeTab === 'daily' && (
                <DailyScenario 
                  role={interviewSettings?.role} 
                  domainStack={interviewSettings?.domainStack} 
                />
              )}

              {activeTab === 'game' && (
                <SkillGame 
                  role={interviewSettings?.role} 
                  domainStack={interviewSettings?.domainStack} 
                />
              )}
            </div>
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
