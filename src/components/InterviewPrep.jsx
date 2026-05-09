import { useState } from 'react';
import StackSelector from './StackSelector.jsx';
import QuestionCard from './QuestionCard.jsx';
import { TECH_STACKS, ROLES, QUESTION_TYPES } from '../constants.js';
import { callLLM, safeParseJSON } from '../api.js';
import styles from './InterviewPrep.module.css';

export default function InterviewPrep() {
  const [stack, setStack]         = useState('android');
  const [role, setRole]           = useState('Senior');
  const [qtype, setQtype]         = useState('practical');
  const [count, setCount]         = useState(6);
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading]     = useState(false);
  const [error, setError]         = useState('');
  const [history, setHistory]     = useState([]);

  const stackLabel = TECH_STACKS.find(s => s.id === stack)?.label || stack;
  const qtypeLabel = QUESTION_TYPES.find(t => t.id === qtype)?.label || qtype;

  async function generate() {
    setLoading(true);
    setError('');
    setQuestions([]);
    try {
      const raw = await callLLM(
        `Generate ${count} interview questions for a ${role} developer focused on ${stackLabel}.\nQuestion type: ${qtypeLabel}.\n\nRespond ONLY with a valid JSON array — no markdown, no preamble:\n[{"question": "..."}]`,
        'You are an expert technical interviewer. Generate realistic, non-trivial, varied questions. Return ONLY a valid JSON array. No markdown fences, no extra text whatsoever.'
      );
      const parsed = safeParseJSON(raw);
      setQuestions(parsed.map(q => q.question || q));
      const key = `${stackLabel} · ${role} · ${qtypeLabel}`;
      setHistory(h => [key, ...h.filter(x => x !== key)].slice(0, 5));
    } catch (e) {
      setError('Failed to generate questions. Check your connection or API key config.');
    }
    setLoading(false);
  }

  return (
    <div className={styles.wrap}>
      {/* Stack */}
      <div className={styles.section}>
        <div className={styles.label}>Tech Stack</div>
        <StackSelector selected={stack} onSelect={setStack} />
      </div>

      {/* Controls */}
      <div className={styles.controls}>
        <div className={styles.field}>
          <label className={styles.label}>Role Level</label>
          <select value={role} onChange={e => setRole(e.target.value)} className={styles.select}>
            {ROLES.map(r => <option key={r}>{r}</option>)}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Question Type</label>
          <select value={qtype} onChange={e => setQtype(e.target.value)} className={styles.select}>
            {QUESTION_TYPES.map(t => (
              <option key={t.id} value={t.id}>{t.label} — {t.desc}</option>
            ))}
          </select>
        </div>

        <div className={styles.field}>
          <label className={styles.label}>Count</label>
          <select value={count} onChange={e => setCount(Number(e.target.value))} className={styles.select}>
            {[4, 6, 8, 10].map(n => <option key={n}>{n}</option>)}
          </select>
        </div>

        <button
          className={styles.generateBtn}
          onClick={generate}
          disabled={loading}
        >
          {loading ? 'Generating…' : 'Generate →'}
        </button>
      </div>

      {/* Recent history */}
      {history.length > 0 && (
        <div className={styles.historyRow}>
          {history.map((h, i) => (
            <span key={i} className={styles.historyChip}>{h}</span>
          ))}
        </div>
      )}

      {/* Error */}
      {error && <div className={styles.error}>⚠ {error}</div>}

      {/* Loading */}
      {loading && (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span className={styles.loadingText}>
            crafting {count} {qtypeLabel.toLowerCase()} questions for {stackLabel}…
          </span>
        </div>
      )}

      {/* Empty state */}
      {!loading && questions.length === 0 && !error && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🎯</div>
          <div className={styles.emptyTitle}>Ready when you are</div>
          <div className={styles.emptySub}>Select a stack, role, and type — then generate</div>
        </div>
      )}

      {/* Questions */}
      {questions.length > 0 && (
        <div className={styles.list}>
          {questions.map((q, i) => (
            <QuestionCard
              key={i}
              index={i}
              question={q}
              stack={stackLabel}
              role={role}
              type={qtypeLabel}
            />
          ))}
        </div>
      )}
    </div>
  );
}
