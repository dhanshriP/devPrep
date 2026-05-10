import React, { useState, useEffect } from 'react';

const SkillGame = ({ techStack }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'playing', 'result'
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(15);
  const [selectedOption, setSelectedOption] = useState(null);

  const gameData = {
    "Android (Kotlin, Jetpack Compose)": [
      {
        question: "Which of these is NOT a Jetpack Compose side-effect API?",
        options: ["LaunchedEffect", "SideEffect", "DisposableEffect", "StateEffect"],
        answer: 3
      },
      {
        question: "What is the default visibility modifier in Kotlin?",
        options: ["Private", "Protected", "Public", "Internal"],
        answer: 2
      }
    ],
    "React (Node.js)": [
      {
        question: "What is the purpose of 'useMemo'?",
        options: ["To perform side effects", "To memoize expensive calculations", "To manage global state", "To reference DOM elements"],
        answer: 1
      },
      {
        question: "Which lifecycle method is equivalent to useEffect with an empty dependency array?",
        options: ["componentDidUpdate", "componentWillUnmount", "componentDidMount", "shouldComponentUpdate"],
        answer: 2
      }
    ],
    "General": [
      {
        question: "Which data structure uses LIFO (Last-In-First-Out)?",
        options: ["Queue", "Stack", "Linked List", "Tree"],
        answer: 1
      }
    ]
  };

  const currentQuestions = gameData[techStack] || gameData["General"];

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setGameState('playing');
    setScore(0);
    setCurrentQuestionIndex(0);
    setTimeLeft(15);
  };

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === currentQuestions[currentQuestionIndex].answer) {
      setScore(prev => prev + 10);
    }
    setTimeout(handleNextQuestion, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < currentQuestions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(15);
    } else {
      setGameState('result');
    }
  };

  return (
    <div className="skill-game">
      <h2>Tech Sprint Game: {techStack || 'General'}</h2>
      
      {gameState === 'start' && (
        <div className="game-start">
          <p>Quick fire round! Solve questions related to your stack to earn points.</p>
          <button className="primary-btn" onClick={startGame}>Start Sprint</button>
        </div>
      )}

      {gameState === 'playing' && (
        <div className="game-playing">
          <div className="game-header">
            <span>Question {currentQuestionIndex + 1}/{currentQuestions.length}</span>
            <span className="timer">Time Left: {timeLeft}s</span>
            <span>Score: {score}</span>
          </div>
          <div className="question-box">
            <h3>{currentQuestions[currentQuestionIndex].question}</h3>
            <div className="options-grid">
              {currentQuestions[currentQuestionIndex].options.map((opt, i) => (
                <button 
                  key={i} 
                  className={`option-btn ${selectedOption === i ? (i === currentQuestions[currentQuestionIndex].answer ? 'correct' : 'wrong') : ''}`}
                  onClick={() => handleOptionClick(i)}
                  disabled={selectedOption !== null}
                >
                  {opt}
                </button>
              ))}
            </div>
          </div>
        </div>
      )}

      {gameState === 'result' && (
        <div className="game-result">
          <h3>Sprint Complete!</h3>
          <p className="final-score">Your Score: {score}</p>
          <p>Great job! These points contribute to your technical proficiency profile.</p>
          <button className="primary-btn" onClick={startGame}>Play Again</button>
        </div>
      )}
    </div>
  );
};

export default SkillGame;
