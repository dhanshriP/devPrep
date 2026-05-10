import React, { useState } from 'react';
import SetupScreen from './components/SetupScreen';
import MockInterviewScreen from './components/MockInterviewScreen';
import ScorecardScreen from './components/ScorecardScreen';
import DailyScenario from './components/DailyScenario'; // Import the new component
import './App.css'; // Assuming you have some basic styling

const App = () => {
  const [currentScreen, setCurrentScreen] = useState('setup'); // 'setup', 'interview', 'scorecard'
  const [interviewSettings, setInterviewSettings] = useState(null);
  const [currentScorecard, setCurrentScorecard] = useState(null); // State to hold the scorecard data

  const handleSetupComplete = (settings) => {
    setInterviewSettings(settings);
    setCurrentScreen('interview');
  };

  const handleEndInterview = (scorecardData) => {
    setCurrentScorecard(scorecardData); // Save the generated scorecard
    setCurrentScreen('scorecard');
  };

  const handleStartNewInterview = () => {
    setCurrentScreen('setup');
    setInterviewSettings(null);
    setCurrentScorecard(null);
  };

  // Dummy scorecard data for testing
  const dummyScorecard = {
    clarity: "Good clarity in explaining concepts, though some explanations lacked concrete examples.",
    depth: "Demonstrated good surface-level understanding, but struggled when probed for deeper technical details and trade-offs.",
    structure: "Responses were generally well-structured, starting with an overview and then diving into specifics. Could improve on summarizing key takeaways.",
    redFlags: "No major red flags identified. Some hesitation on follow-up questions suggests areas for review.",
    weaknessTrackerUpdate: "Added 'Deep dive into data structures' and 'System design scalability patterns' to weakness tracker."
  };

  return (
    <div className="App">
      <div className="main-content">
        {currentScreen === 'setup' && (
          <SetupScreen onSetupComplete={handleSetupComplete} />
        )}

        {currentScreen === 'interview' && interviewSettings && (
          <MockInterviewScreen 
            interviewSettings={interviewSettings} 
            onEndInterview={() => handleEndInterview(dummyScorecard)} 
          />
        )}

        {currentScreen === 'scorecard' && (
          <ScorecardScreen 
            interviewSettings={interviewSettings} 
            scorecard={currentScorecard} 
            onStartNewInterview={handleStartNewInterview} 
          />
        )}
      </div>
      
      {/* Daily Scenario, always visible */}
      <DailyScenario />
    </div>
  );
};

export default App;
