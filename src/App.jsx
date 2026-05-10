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
    clarity: "Excellent articulation of technical concepts with clear business context.",
    depth: "Strong understanding of tradeoffs, though could dive deeper into operational excellence.",
    structure: "Methodical approach to problem-solving, following a logical framework.",
    redFlags: "None identified.",
    weaknessTrackerUpdate: "Strategic alignment and scaling complexities."
  };

  return (
    <div className="App">
      {currentScreen === 'setup' ? (
        <SetupScreen onSetupComplete={handleSetupComplete} />
      ) : (
        <div className="dashboard">
          <aside className="dashboard-sidebar">
            <div className="logo-area">
              <h1>DevPrep.ai</h1>
            </div>
            
            <div className="profile-card">
              <h3>{interviewSettings?.role}</h3>
              <p>{interviewSettings?.level}</p>
              <div className="tech-tag">
                {isTechnicalRole(interviewSettings?.role) ? "Stack: " : "Focus: "}
                {interviewSettings?.domainStack}
              </div>
            </div>

            <nav className="nav-links">
              <button 
                className={`nav-btn ${activeTab === 'interview' ? 'active' : ''}`}
                onClick={() => setActiveTab('interview')}
              >
                <span className="icon">🎙️</span> Mock Interview
              </button>
              <button 
                className={`nav-btn ${activeTab === 'daily' ? 'active' : ''}`}
                onClick={() => setActiveTab('daily')}
              >
                <span className="icon">🧩</span> Daily Scenario
              </button>
              <button 
                className={`nav-btn ${activeTab === 'game' ? 'active' : ''}`}
                onClick={() => setActiveTab('game')}
              >
                <span className="icon">⚡</span> 
                {isTechnicalRole(interviewSettings?.role) ? "Tech Sprint" : "Leadership Sprint"}
              </button>
            </nav>

            <div className="sidebar-footer">
              <button className="reset-btn" onClick={handleResetSettings}>
                <span>🔄</span> Change Profile
              </button>
            </div>
          </aside>

          <main className="dashboard-main">
            <div className="tab-panel">
              {activeTab === 'interview' && (
                <div className="interview-section">
                  {interviewState === 'idle' && (
                    <div className="welcome-box">
                      <h2>Mock Interview</h2>
                      <p>Start a conversational session tailored for <strong>{interviewSettings?.domainStack}</strong>. AI will simulate a real company interview.</p>
                      <button className="primary-btn" onClick={() => setInterviewState('ongoing')}>
                        Launch Session 🚀
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
