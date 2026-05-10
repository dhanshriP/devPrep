import React, { useState, useEffect, useRef } from 'react';
import { callLLM } from '../api';

const MAX_CONVERSATION_TURNS = 7;

const MockInterviewScreen = ({ interviewSettings, onEndInterview }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isAiThinking, setIsAiThinking] = useState(false);
  const [turns, setTurns] = useState(0);
  const messagesEndRef = useRef(null);

  const isTechnical = ["SDE", "Principal Engineer", "EM"].includes(interviewSettings.role);
  const isBA = interviewSettings.role === "Business Analyst";

  // Initial prompt to start the session as a Hiring Partner in 2026
  useEffect(() => {
    const startSession = async () => {
      setIsAiThinking(true);
      try {
        const systemPrompt = `You are an elite Hiring Partner at a global tech leader in 2026. 
        You are conducting a high-stakes assessment for a ${interviewSettings.level} ${interviewSettings.role} candidate specializing in ${interviewSettings.domainStack}.
        
        UNIQUENESS & TONE:
        - NEVER say "I am an AI" or "I am your AI interviewer".
        - Act as a real person. Be direct, professional, and slightly skeptical.
        - In 2026, the bar is extremely high. Move past basics immediately.
        
        ROLE-SPECIFIC GUARDRAILS:
        - For TPM/Scrum Master/Delivery Manager/Business Analyst: Focus on 2026 challenges—AI-augmented delivery risks, complex stakeholder alignment, or requirements volatility in volatile markets. 
        - NEVER ask these roles about coding, caching, or low-level technical implementation.
        - For SDE/Principal: Focus on 2026-scale architecture, extreme scalability, and emerging tech trade-offs.
        
        Your Goal: Open the session with a sharp, context-rich situational question that probes their experience in ${interviewSettings.domainStack}.`;

        const greeting = await callLLM(`Begin the evaluation for a ${interviewSettings.role}`, systemPrompt);
        setMessages([{ sender: 'ai', text: greeting }]);
        setTurns(1);
      } catch (err) {
        setMessages([{ sender: 'ai', text: "Connection error. Let's restart the link." }]);
      } finally {
        setIsAiThinking(false);
      }
    };

    if (messages.length === 0) {
      startSession();
    }
  }, [interviewSettings, messages.length]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!input.trim() || isAiThinking || turns >= MAX_CONVERSATION_TURNS) return;

    const userMessage = { sender: 'user', text: input.trim() };
    setMessages(prev => [...prev, userMessage]);
    setInput('');
    setIsAiThinking(true);

    try {
      const history = messages.map(m => `${m.sender === 'ai' ? 'Hiring Partner' : 'Candidate'}: ${m.text}`).join('\n');
      const systemPrompt = `You are an elite Hiring Partner in 2026. Evaluation for: ${interviewSettings.role} (${interviewSettings.level}).
      Context: ${interviewSettings.domainStack}.
      
      CORE INSTRUCTIONS:
      1. Analyze the candidate's response deeply.
      2. If the response is generic, PUSH BACK. Challenge their assumptions or ask for specific 2026-scale metrics/trade-offs.
      3. For TPM/BA/Management: Focus on outcomes, risks, requirements accuracy, and leadership. NO TECH IMPLEMENTATION.
      4. If they give a strong answer, pivot to a more complex, unforeseen problem in that area.
      5. Maintain the persona. Keep it conversational but intense.
      
      Current Progress: ${turns}/${MAX_CONVERSATION_TURNS} exchanges.`;

      const aiResponse = await callLLM(`Candidate Response: ${input}\n\nSession History:\n${history}`, systemPrompt);
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setTurns(prev => prev + 1);

      if (turns + 1 >= MAX_CONVERSATION_TURNS) {
        setTimeout(() => onEndInterview(), 4000);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "The link is unstable. Can you summarize your last point?" }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="mock-interview-screen-pro">
      <div className="interview-header">
        <div className="session-info">
          <div className="live-pulse"></div>
          <span className="live-label">2026 EXECUTIVE EVALUATION</span>
        </div>
        <div className="header-meta">
          <span className="exchange-tag">Level: {interviewSettings.level}</span>
          <button className="terminate-btn" onClick={onEndInterview}>Terminate Session</button>
        </div>
      </div>

      <div className="chat-window">
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-wrapper ${msg.sender}`}>
              <div className="sender-name">{msg.sender === 'ai' ? 'HIRING PARTNER' : 'YOU'}</div>
              <div className="chat-bubble">
                <p>{msg.text}</p>
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="chat-wrapper ai">
              <div className="chat-bubble thinking">
                <div className="typing-loader"><span></span><span></span><span></span></div>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>

        <form className="chat-input-area" onSubmit={handleSendMessage}>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={turns >= MAX_CONVERSATION_TURNS ? "Evaluation concluding..." : "Provide your perspective..."}
            disabled={isAiThinking || turns >= MAX_CONVERSATION_TURNS}
          />
          <button type="submit" className="send-btn-pro" disabled={!input.trim() || isAiThinking}>
            {isAiThinking ? '...' : '→'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MockInterviewScreen;
