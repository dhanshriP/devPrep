import React, { useState, useEffect } from 'react';
import { callLLM, safeParseJSON } from '../api';

const SkillGame = ({ techStack }) => {
  const [gameState, setGameState] = useState('start'); // 'start', 'loading', 'playing', 'result'
  const [questions, setQuestions] = useState([]);
  const [score, setScore] = useState(0);
  const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
  const [timeLeft, setTimeLeft] = useState(20);
  const [selectedOption, setSelectedOption] = useState(null);
  const [error, setError] = useState(null);

  const fetchQuestions = async () => {
    setGameState('loading');
    setError(null);
    try {
      const systemPrompt = `You are a technical interviewer assistant. Generate a JSON array of 5 challenging multiple-choice questions for a developer skilled in ${techStack}. 
      Each object must have:
      "question": "The question text",
      "options": ["Option A", "Option B", "Option C", "Option D"],
      "answer": index_of_correct_option (0-3).
      Return ONLY the raw JSON array. No markdown, no prose.`;
      
      const raw = await callLLM(`Generate 5 technical questions for ${techStack}`, systemPrompt);
      const data = safeParseJSON(raw);
      
      if (Array.isArray(data) && data.length > 0) {
        setQuestions(data);
        setGameState('playing');
        setCurrentQuestionIndex(0);
        setScore(0);
        setTimeLeft(20);
      } else {
        throw new Error("Invalid format received from AI");
      }
    } catch (err) {
      console.error(err);
      setError("Failed to generate questions. Please try again.");
      setGameState('start');
    }
  };

  useEffect(() => {
    let timer;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    } else if (timeLeft === 0 && gameState === 'playing') {
      handleNextQuestion();
    }
    return () => clearInterval(timer);
  }, [gameState, timeLeft]);

  const handleOptionClick = (index) => {
    if (selectedOption !== null) return;
    setSelectedOption(index);
    if (index === questions[currentQuestionIndex].answer) {
      setScore(prev => prev + 20);
    }
    setTimeout(handleNextQuestion, 1000);
  };

  const handleNextQuestion = () => {
    setSelectedOption(null);
    if (currentQuestionIndex < questions.length - 1) {
      setCurrentQuestionIndex(prev => prev + 1);
      setTimeLeft(20);
    } else {
      setGameState('result');
    }
  };

  return (
    <div className="skill-game-container">
      <div className="game-header-row">
        <h2>Tech Sprint: {techStack}</h2>
        {gameState === 'playing' && (
          <div className="game-stats">
            <span className="score-pill">Score: {score}</span>
            <span className="timer-pill">Time: {timeLeft}s</span>
          </div>
        )}
      </div>

      {gameState === 'start' && (
        <div className="game-start-view">
          <div className="game-icon">⚡</div>
          <p>Ready to test your expertise in <strong>{techStack}</strong>?</p>
          <p className="sub-text">AI will generate 5 custom questions based on your profile.</p>
          {error && <p className="error-text">{error}</p>}
          <button className="primary-btn" onClick={fetchQuestions}>Generate & Start</button>
        </div>
      )}

      {gameState === 'loading' && (
        <div className="loading-view">
          <div className="loader"></div>
          <p>AI is crafting your technical challenges...</p>
        </div>
      )}

      {gameState === 'playing' && questions.length > 0 && (
        <div className="game-play-view">
          <div className="progress-bar">
            <div 
              className="progress-fill" 
              style={{ width: `${((currentQuestionIndex + 1) / questions.length) * 100}%` }}
            ></div>
          </div>
          <div className="question-card">
            <span className="q-count">Question {currentQuestionIndex + 1} of {questions.length}</span>
            <h3>{questions[currentQuestionIndex].question}</h3>
            <div className="options-grid">
              {questions[currentQuestionIndex].options.map((opt, i) => (
                <button 
                  key={i} 
                  className={`option-btn ${selectedOption === i ? (i === questions[currentQuestionIndex].answer ? 'correct' : 'wrong') : ''}`}
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
        <div className="game-result-view">
          <div className="trophy">🏆</div>
          <h3>Sprint Complete!</h3>
          <div className="final-score-box">
            <span className="label">Total Score</span>
            <span className="value">{score}</span>
          </div>
          <p>Your performance in {techStack} has been recorded.</p>
          <button className="primary-btn" onClick={fetchQuestions}>New Sprint</button>
        </div>
      )}
    </div>
  );
};

export default SkillGame;
