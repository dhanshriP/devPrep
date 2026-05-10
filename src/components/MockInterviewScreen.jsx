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

  // Initial prompt to start the interview
  useEffect(() => {
    const startInterview = async () => {
      setIsAiThinking(true);
      try {
        const systemPrompt = `You are a professional interviewer from a ${interviewSettings.companyStyle} company. 
        You are interviewing a ${interviewSettings.level} candidate for a ${interviewSettings.role} position.
        The candidate's focus area is ${interviewSettings.domainStack}.
        
        IMPORTANT: 
        1. If the role is non-technical (TPM, SM, Delivery Manager), do NOT ask deep coding or system design questions like caching. 
        2. Focus on role-specific challenges (e.g., Stakeholder management for TPM, Agile processes for SM).
        3. Be conversational. Start by introducing yourself and asking a specific, recent real-world interview question relevant to their profile.
        4. Keep your responses concise and professional.`;

        const greeting = await callLLM(`Start the interview for a ${interviewSettings.level} ${interviewSettings.role}`, systemPrompt);
        setMessages([{ sender: 'ai', text: greeting }]);
        setTurns(1);
      } catch (err) {
        setMessages([{ sender: 'ai', text: "I'm having trouble connecting. Let's try to start again." }]);
      } finally {
        setIsAiThinking(false);
      }
    };

    if (messages.length === 0) {
      startInterview();
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
      const history = messages.map(m => `${m.sender === 'ai' ? 'Interviewer' : 'Candidate'}: ${m.text}`).join('\n');
      const systemPrompt = `You are a professional interviewer for a ${interviewSettings.role} role at ${interviewSettings.companyStyle}. 
      Current interview focus: ${interviewSettings.domainStack} at ${interviewSettings.level} level.
      
      CRITICAL ROLE GUIDELINES:
      - For TPM/SM/DM: Ask about roadmaps, blockers, metrics, or team dynamics. NO CACHING/DATABASE questions.
      - For SDE/Principal: Ask about architecture, trade-offs, and recent high-scale problems.
      
      Interview Progress: ${turns}/${MAX_CONVERSATION_TURNS} turns.
      
      Your Goal: 
      1. Analyze the candidate's response.
      2. PUSH BACK or ask a challenging follow-up if their answer is generic.
      3. If they are doing well, move to a deeper technical or situational question.
      4. Keep the tone professional.`;

      const aiResponse = await callLLM(`Candidate Answer: ${input}\n\nInterview History:\n${history}`, systemPrompt);
      
      setMessages(prev => [...prev, { sender: 'ai', text: aiResponse }]);
      setTurns(prev => prev + 1);

      if (turns + 1 >= MAX_CONVERSATION_TURNS) {
        setTimeout(() => onEndInterview(), 3000);
      }
    } catch (err) {
      setMessages(prev => [...prev, { sender: 'ai', text: "Sorry, I lost my train of thought. Can you repeat that?" }]);
    } finally {
      setIsAiThinking(false);
    }
  };

  return (
    <div className="mock-interview-screen-pro">
      <div className="interview-header">
        <div className="session-info">
          <span className="live-indicator">● LIVE SESSION</span>
          <h2>{interviewSettings.role} Interview</h2>
        </div>
        <div className="progress-pills">
          <span className="turn-count">Exchange {turns}/{MAX_CONVERSATION_TURNS}</span>
          <button className="end-session-btn" onClick={onEndInterview}>End Session</button>
        </div>
      </div>

      <div className="chat-window">
        <div className="messages-list">
          {messages.map((msg, idx) => (
            <div key={idx} className={`chat-bubble-wrapper ${msg.sender}`}>
              <div className="avatar">{msg.sender === 'ai' ? '🤖' : '👤'}</div>
              <div className="chat-bubble">
                {msg.text}
              </div>
            </div>
          ))}
          {isAiThinking && (
            <div className="chat-bubble-wrapper ai">
              <div className="avatar">🤖</div>
              <div className="chat-bubble thinking">
                <span className="dot"></span><span className="dot"></span><span className="dot"></span>
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
            placeholder={turns >= MAX_CONVERSATION_TURNS ? "Interview concluding..." : "Share your response..."}
            disabled={isAiThinking || turns >= MAX_CONVERSATION_TURNS}
          />
          <button type="submit" className="send-btn" disabled={!input.trim() || isAiThinking}>
            {isAiThinking ? '...' : 'Send'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default MockInterviewScreen;
