import React, { useState, useEffect } from 'react';

const DailyScenario = () => {
  const [challengeActive, setChallengeActive] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180); // 3 minutes = 180 seconds
  const [challengeCompleted, setChallengeCompleted] = useState(false);

  const challenges = [
    {
      id: 1,
      title: "Refactor Legacy Code",
      description: "Identify and refactor a section of a given legacy Java method to improve readability and performance without changing its core functionality.",
      solution: "Solution: Focus on extracting helper methods, using clearer variable names, and optimizing loop iterations."
    },
    {
      id: 2,
      title: "Design a Caching Strategy",
      description: "Propose a caching strategy for a high-traffic e-commerce product catalog API. Consider consistency, eviction policies, and invalidation.",
      solution: "Solution: Discuss CDN, in-memory caches (Redis), write-through/write-back, and LRU/LFU eviction."
    },
    {
      id: 3,
      title: "Debug a Frontend Performance Issue",
      description: "A React component is re-rendering excessively. Identify potential causes and suggest ways to optimize performance.",
      solution: "Solution: Use React.memo, useCallback, useMemo, and avoid inline object/function definitions in props."
    }
  ];

  const [currentChallenge, setCurrentChallenge] = useState(() => 
    challenges[Math.floor(Math.random() * challenges.length)]
  );

  useEffect(() => {
    let timer;
    if (challengeActive && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    } else if (timeLeft === 0 && challengeActive) {
      setChallengeCompleted(true);
      setChallengeActive(false);
    }
    return () => clearInterval(timer);
  }, [challengeActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? '0' : ''}${remainingSeconds}`;
  };

  const handleStartChallenge = () => {
    setChallengeActive(true);
    setChallengeCompleted(false);
    setTimeLeft(180);
  };

  const handleResetChallenge = () => {
    setChallengeActive(false);
    setChallengeCompleted(false);
    setTimeLeft(180);
    setCurrentChallenge(challenges[Math.floor(Math.random() * challenges.length)]);
  };

  return (
    <div className="daily-scenario-container">
      <div className="header-row">
         <h3>Daily Challenge</h3>
         {challengeActive && <span className="timer-pill">Time Left: {formatTime(timeLeft)}</span>}
      </div>
      
      <div className="challenge-body">
        <h4>{currentChallenge.title}</h4>
        
        {!challengeActive && !challengeCompleted && (
          <>
            <p className="description">{currentChallenge.description}</p>
            <button className="primary-btn" onClick={handleStartChallenge}>Start 3-Min Challenge</button>
          </>
        )}

        {challengeActive && (
          <div className="active-ui">
            <p className="description">{currentChallenge.description}</p>
            <textarea 
              placeholder="Draft your solution here..." 
              className="challenge-textarea"
            ></textarea>
            <div className="actions">
               <button className="reset-btn" onClick={handleResetChallenge}>Give Up</button>
            </div>
          </div>
        )}

        {challengeCompleted && (
          <div className="completed-ui">
            <div className="success-badge">Challenge Completed!</div>
            <div className="solution-box">
              <h5>Recommended Approach:</h5>
              <p>{currentChallenge.solution}</p>
            </div>
            <button className="primary-btn" onClick={handleResetChallenge}>Next Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
};

export default DailyScenario;
