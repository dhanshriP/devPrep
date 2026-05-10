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
      <h3>Daily Challenge: {currentChallenge.title}</h3>
      {!challengeActive && !challengeCompleted && (
        <p>{currentChallenge.description}</p>
      )}
      
      {!challengeActive && !challengeCompleted && (
        <button onClick={handleStartChallenge}>Start 3-Min Challenge</button>
      )}

      {challengeActive && (
        <div className="challenge-active">
          <p>Time Left: {formatTime(timeLeft)}</p>
          <p className="challenge-description">{currentChallenge.description}</p>
          <textarea 
            placeholder="Your thoughts..." 
            rows="4" 
            className="challenge-textarea"
          ></textarea>
          {timeLeft === 0 && <p>Time's up!</p>}
        </div>
      )}

      {challengeCompleted && (
        <div className="challenge-completed">
          <p>Challenge completed!</p>
          <h4>Solution:</h4>
          <p>{currentChallenge.solution}</p>
          <button onClick={handleResetChallenge}>New Daily Challenge</button>
        </div>
      )}

      {(challengeActive || challengeCompleted) && !challengeCompleted && (
         <button onClick={handleResetChallenge} style={{ marginTop: "10px" }}>
            Reset
         </button>
      )}
    </div>
  );
};

export default DailyScenario;
