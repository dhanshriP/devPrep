import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import MockInterviewScreen from './components/MockInterviewScreen';
import ScorecardScreen from './components/ScorecardScreen';
import DailyScenario from './components/DailyScenario';
import SkillGame from './components/SkillGame';
import './App.css';

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup' or 'dashboard'
  const [activeTab, setActiveTab] = useState('interview'); // 'interview', 'daily', 'game'
  const [interviewSettings, setInterviewSettings] = useState(null);
  const [currentScorecard, setCurrentScorecard] = useState(null);
  const [interviewState, setInterviewState] = useState('idle'); // 'idle', 'ongoing', 'result'

  const handleSetupComplete = (settings) => {
    setInterviewSettings(settings);
    setCurrentScreen('dashboard');
  };

  const handleEndInterview = (scorecardData) => {
    setCurrentScorecard(scorecardData);
    setInterviewState('result');
  };

  const handleStartNewInterview = () => {
    setInterviewState('idle');
    setCurrentScorecard(null);
  };

  const handleResetSettings = () => {
    setCurrentScreen('setup');
    setInterviewSettings(null);
    setInterviewState('idle');
    setCurrentScorecard(null);
  };

  const dummyScorecard = {
    clarity: "Good clarity in explaining concepts, though some explanations lacked concrete examples.",
    depth: "Demonstrated good surface-level understanding, but struggled when probed for deeper technical details.",
    structure: "Responses were generally well-structured. Could improve on summarizing key takeaways.",
    redFlags: "No major red flags identified.",
    weaknessTrackerUpdate: "Added 'Scalability' and 'Memory Management' to weakness tracker."
  };

  return (
    <div className="App">
      {currentScreen === 'setup' ? (
        <SetupScreen onSetupComplete={handleSetupComplete} />
      ) : (
        <div className="dashboard">
          <header className="dashboard-header">
            <div className="profile-summary">
              <h1>DevPrep Dashboard</h1>
              <p>{interviewSettings?.role} • {interviewSettings?.level} • {interviewSettings?.domainStack}</p>
            </div>
            <button className="reset-btn" onClick={handleResetSettings}>Change Profile</button>
          </header>

          <nav className="dashboard-nav">
            <button 
              className={activeTab === 'interview' ? 'active' : ''} 
              onClick={() => setActiveTab('interview')}
            >
              Interview Prep
            </button>
            <button 
              className={activeTab === 'daily' ? 'active' : ''} 
              onClick={() => setActiveTab('daily')}
            >
              Daily Challenge
            </button>
            <button 
              className={activeTab === 'game' ? 'active' : ''} 
              onClick={() => setActiveTab('game')}
            >
              Tech Sprint Game
            </button>
          </nav>

          <main className="dashboard-main">
            {activeTab === 'interview' && (
              <div className="tab-content">
                {interviewState === 'idle' && (
                  <div className="welcome-box">
                    <h2>Ready for your Mock Interview?</h2>
                    <p>Based on your profile, I've prepared a conversational session to test your knowledge in {interviewSettings?.domainStack}.</p>
                    <button className="primary-btn" onClick={() => setInterviewState('ongoing')}>Start Mock Session</button>
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
                    onStartNewInterview={handleStartNewInterview} 
                  />
                )}
              </div>
            )}

            {activeTab === 'daily' && (
              <div className="tab-content">
                <DailyScenario />
              </div>
            )}

            {activeTab === 'game' && (
              <div className="tab-content">
                <SkillGame techStack={interviewSettings?.domainStack} />
              </div>
            )}
          </main>
        </div>
      )}
    </div>
  );
};

export default App;
