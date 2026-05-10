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
      solution: "Solution for Refactor Legacy Code: Focus on extracting helper methods, using clearer variable names, and optimizing loop iterations. Example code provided..."
    },
    {
      id: 2,
      title: "Design a Caching Strategy",
      description: "Propose a caching strategy for a high-traffic e-commerce product catalog API. Consider consistency, eviction policies, and invalidation.",
      solution: "Solution for Design a Caching Strategy: Discuss CDN, in-memory caches (Redis), write-through/write-back, LRU/LFU, and cache invalidation strategies like time-to-live or publish/subscribe. Example architecture diagram..."
    },
    {
      id: 3,
      title: "Debug a Frontend Performance Issue",
      description: "A React component is re-rendering excessively. Identify potential causes and suggest two ways to optimize its rendering performance.",
      solution: "Solution for Debug a Frontend Performance Issue: Look for unnecessary state updates, prop changes, or context changes. Suggest React.memo, useCallback, useMemo, or optimizing data structures passed as props. Example code snippets..."
    }
  ];

  // For simplicity, let's pick a random challenge each time the component mounts
  const [currentChallenge, setCurrentChallenge] = useState(() => 
    challenges[Math.floor(Math.random() * challenges.length)]
  );

  useEffect(() => {
    let timer;
    if (challengeActive && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0 && challengeActive) {
      setChallengeCompleted(true);
      setChallengeActive(false);
    }
    return () => clearTimeout(timer);
  }, [challengeActive, timeLeft]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes.toString().padStart(2, '0')}:${remainingSeconds.toString().padStart(2, '0')}`;
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
    // Pick a new random challenge for variety
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
          <textarea placeholder="Your thoughts or solution... (not saved)" rows="4" readOnly={timeLeft === 0}></textarea>
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

      {(challengeActive || challengeCompleted) && (
         <button onClick={handleResetChallenge} disabled={challengeActive && timeLeft > 0}>
            {challengeActive && timeLeft > 0 ? 'Reset' : 'New Daily Challenge'}
         </button>
      )}
    </div>
  );
};

export default DailyScenario;
