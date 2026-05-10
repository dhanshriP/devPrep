import React from 'react';

const ScorecardScreen = ({ interviewSettings, scorecard, onStartNewInterview }) => {
  return (
    <div className="scorecard-screen">
      <h1>Interview Scorecard</h1>
      {interviewSettings && (
        <div className="interview-summary">
          <h3>Interview Summary</h3>
          <p><strong>Role:</strong> {interviewSettings.role}</p>
          <p><strong>Level:</strong> {interviewSettings.level}</p>
          <p><strong>Domain/Stack:</strong> {interviewSettings.domainStack}</p>
          <p><strong>Company Style:</strong> {interviewSettings.companyStyle}</p>
        </div>
      )}

      {scorecard ? (
        <div className="feedback-section">
          <h3>Performance Breakdown</h3>
          <div className="feedback-item">
            <h4>Clarity:</h4>
            <p>{scorecard.clarity}</p>
          </div>
          <div className="feedback-item">
            <h4>Depth:</h4>
            <p>{scorecard.depth}</p>
          </div>
          <div className="feedback-item">
            <h4>Structure:</h4>
            <p>{scorecard.structure}</p>
          </div>
          <div className="feedback-item">
            <h4>Red Flags:</h4>
            <p>{scorecard.redFlags}</p>
          </div>
          {scorecard.weaknessTrackerUpdate && (
            <div className="weakness-tracker">
              <h4>Weakness Tracker Update:</h4>
              <p>{scorecard.weaknessTrackerUpdate}</p>
            </div>
          )}
        </div>
      ) : (
        <p>No scorecard data available for this session.</p>
      )}

      <button onClick={onStartNewInterview} className="start-new-interview-button">
        Start New Interview
      </button>
    </div>
  );
};

export default ScorecardScreen;
