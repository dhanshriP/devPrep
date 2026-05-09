import { useState } from 'react';
import { callLLM } from '../api.js';
import styles from './QuestionCard.module.css';

export default function QuestionCard({ question, stack, role, type, index }) {
  const [open, setOpen]         = useState(false);
  const [answer, setAnswer]     = useState('');
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState('');
  const [copied, setCopied]     = useState(false);

  async function toggle() {
    if (open) { setOpen(false); return; }
    setOpen(true);
    if (answer) return;
    setLoading(true);
    setError('');
    try {
      const res = await callLLM(
        `Interview question: "${question}"\nStack: ${stack} | Role: ${role} | Type: ${type}\n\nGive a thorough but concise answer (under 250 words). Include a code snippet if relevant, wrapped in triple backticks with the language tag.`,
        'You are a senior developer giving interview answers. Be direct, practical, and include real-world nuance. Use plain text with optional code blocks.'
      );
      setAnswer(res);
    } catch (e) {
      setError('Failed to load answer. Try again.');
    }
    setLoading(false);
  }

  function copyQuestion() {
    navigator.clipboard.writeText(question);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  // Render answer with code block highlighting
  function renderAnswer(text) {
    const parts = text.split(/(```[\s\S]*?```)/g);
    return parts.map((part, i) => {
      if (part.startsWith('```')) {
        const lines = part.split('\n');
        const code = lines.slice(1, -1).join('\n');
        return <pre key={i} className={styles.codeBlock}><code>{code}</code></pre>;
      }
      return <p key={i} className={styles.answerText}>{part}</p>;
    });
  }

  return (
    <div
      className={styles.card}
      style={{ animationDelay: `${index * 0.055}s` }}
    >
      <div className={styles.header} onClick={toggle}>
        <div className={styles.num}>{String(index + 1).padStart(2, '0')}</div>
        <div className={styles.content}>
          <div className={styles.question}>{question}</div>
          <div className={styles.tags}>
            <span className={styles.tagStack}>{stack}</span>
            <span className={styles.tagType}>{type}</span>
            <span className={styles.tagRole}>{role}</span>
          </div>
        </div>
        <div className={styles.actions}>
          <button
            className={styles.copyBtn}
            onClick={e => { e.stopPropagation(); copyQuestion(); }}
            title="Copy question"
          >
            {copied ? '✓' : '⎘'}
          </button>
          <span className={`${styles.chevron} ${open ? styles.open : ''}`}>▾</span>
        </div>
      </div>

      {open && (
        <div className={styles.answerWrap}>
          {loading && (
            <div className={styles.loading}>
              <span className={styles.spinner} />
              <span>Loading answer...</span>
            </div>
          )}
          {error && <div className={styles.error}>{error}</div>}
          {!loading && answer && renderAnswer(answer)}
        </div>
      )}
    </div>
  );
}
