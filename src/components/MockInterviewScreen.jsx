import React, { useState, useEffect, useRef } from 'react';

const MAX_CONVERSATION_TURNS = 6; // AI + User exchanges

const MockInterviewScreen = ({ interviewSettings, onEndInterview }) => {
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [conversationTurns, setConversationTurns] = useState(0);
  const messagesEndRef = useRef(null);

  // Simulate initial AI greeting and first question
  useEffect(() => {
    if (interviewSettings && messages.length === 0) {
      setMessages([
        {
          sender: 'ai',
          text: `Hello! I'm your AI interviewer. Today we'll be discussing ${interviewSettings.domainStack} for a ${interviewSettings.level} ${interviewSettings.role} role at a ${interviewSettings.companyStyle} company.`
        },
        {
          sender: 'ai',
          text: 'Let\'s start with your experience. Could you tell me about a challenging project you\'ve worked on in this domain?'
        }
      ]);
      setConversationTurns(1); // Initial question is the first turn
    }
  }, [interviewSettings, messages.length]);

  // Scroll to the bottom of messages on new message
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const getSimulatedAIResponse = () => {
    const responses = [
      'That\'s interesting. Can you elaborate on the specific technical challenges you faced in that project and how you overcame them?',
      'Could you dive deeper into the design choices you made and the trade-offs involved?',
      'How would you have approached that problem differently if you had more resources or a different timeline?',
      'What was your role in resolving that issue, and what was the impact on the project?',
      'Suppose you encountered a similar problem with a stricter performance requirement. How would your solution change?',
      'Let\'s consider scalability. How would your proposed solution handle a significant increase in load or data?',
      'From an architectural perspective, where does this solution fit into a larger system, and what are its dependencies?',
      'That sounds complex. Can you walk me through the debugging steps or diagnostic process you used?',
      'How do you ensure the quality and reliability of your code in such a scenario?',
      'What kind of metrics or monitoring would you put in place to track the success or health of this solution?'
    ];
    return responses[Math.floor(Math.random() * responses.length)];
  };

  const handleSendMessage = (e) => {
    e.preventDefault();
    if (input.trim() && conversationTurns < MAX_CONVERSATION_TURNS) {
      const newUserMessage = { sender: 'user', text: input.trim() };
      setMessages(prevMessages => [...prevMessages, newUserMessage]);
      setInput('');

      // Increment turns for the user's message
      const nextTurns = conversationTurns + 1;
      setConversationTurns(nextTurns);

      if (nextTurns >= MAX_CONVERSATION_TURNS) {
        // If max turns reached after user's message, end interview
        setTimeout(() => {
          onEndInterview();
        }, 1500); // Give a moment before ending
      } else {
        // Simulate AI response after a short delay
        setTimeout(() => {
          setMessages(prevMessages => [
            ...prevMessages,
            { sender: 'ai', text: getSimulatedAIResponse() }
          ]);
        }, 1000);
      }
    }
  };

  // Display a message when max turns are reached and interview is ending
  const isInterviewEnding = conversationTurns >= MAX_CONVERSATION_TURNS && messages[messages.length - 1]?.sender !== 'ai';

  return (
    <div className="mock-interview-screen">
      <h2>Mock Interview Session</h2>
      <p>Role: {interviewSettings.role} | Level: {interviewSettings.level} | Domain: {interviewSettings.domainStack}</p>
      <p>Turns remaining: {MAX_CONVERSATION_TURNS - conversationTurns}</p>
      
      <div className="chat-container">
        <div className="messages-display">
          {messages.map((msg, index) => (
            <div key={index} className={`message ${msg.sender}`}>
              <strong>{msg.sender === 'user' ? 'You' : 'AI'}:</strong> {msg.text}
            </div>
          ))}
          {isInterviewEnding && (
            <div className="message ai">
              <strong>AI:</strong> Thank you for your responses. This concludes our interview session.
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
        <form onSubmit={handleSendMessage} className="message-input-form">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            placeholder={isInterviewEnding ? "Interview ended" : "Type your answer..."}
            disabled={isInterviewEnding}
          />
          <button type="submit" disabled={isInterviewEnding}>Send</button>
        </form>
      </div>

      <button onClick={onEndInterview} className="end-interview-button" disabled={isInterviewEnding}>
        End Interview Now
      </button>
    </div>
  );
};

export default MockInterviewScreen;
