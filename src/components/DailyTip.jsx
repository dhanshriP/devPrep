import { useState } from 'react';
import StackSelector from './StackSelector.jsx';
import { TECH_STACKS } from '../constants.js';
import { callLLM, safeParseJSON } from '../api.js';
import styles from './DailyTip.module.css';

const today = new Date().toLocaleDateString('en-US', {
  weekday: 'long', month: 'long', day: 'numeric', year: 'numeric',
});

export default function DailyTip() {
  const [stack, setStack]   = useState('android');
  const [tip, setTip]       = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError]   = useState('');
  const [history, setHistory] = useState([]);

  const stackLabel = TECH_STACKS.find(s => s.id === stack)?.label || stack;

  async function generate() {
    setLoading(true);
    setError('');
    setTip(null);
    try {
      const raw = await callLLM(
        `Generate one insightful daily developer tip for ${stackLabel}.\n\nRespond ONLY with this exact JSON (no markdown, no extra text):\n{"title":"...","body":"2-3 sentence explanation that is specific and non-obvious...","code":"short code snippet or empty string","category":"Performance|Best Practice|Pattern|Tooling|Gotcha|Architecture","tldr":"one line takeaway"}`,
        'You are a senior developer sharing hard-earned daily wisdom. Tips must be specific, actionable, and non-obvious — not generic advice. Return ONLY valid JSON, no markdown fences, no extra text.'
      );
      const parsed = safeParseJSON(raw);
      setTip(parsed);
      setHistory(h => [{ stack: stackLabel, title: parsed.title }, ...h].slice(0, 5));
    } catch (e) {
      setError('Failed to generate tip. Check your connection.');
    }
    setLoading(false);
  }

  return (
    <div className={styles.wrap}>
      {/* Stack selector */}
      <div className={styles.section}>
        <div className={styles.label}>Your Stack</div>
        <StackSelector selected={stack} onSelect={setStack} />
      </div>

      <div className={styles.btnRow}>
        <button className={styles.generateBtn} onClick={generate} disabled={loading}>
          {loading ? 'Generating…' : tip ? 'New Tip →' : "Get Today's Tip →"}
        </button>
      </div>

      {error && <div className={styles.error}>⚠ {error}</div>}

      {loading && (
        <div className={styles.loadingWrap}>
          <span className={styles.spinner} />
          <span className={styles.loadingText}>brewing today's {stackLabel} insight…</span>
        </div>
      )}

      {!loading && !tip && !error && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>🌱</div>
          <div className={styles.emptyTitle}>Get today's dev insight</div>
          <div className={styles.emptySub}>Pick a stack and generate a focused daily tip</div>
        </div>
      )}

      {!loading && tip && (
        <div className={styles.tipCard}>
          <div className={styles.tipMeta}>
            <span className={styles.date}>{today}</span>
            <span className={styles.badge}>{tip.category}</span>
          </div>

          <h2 className={styles.title}>{tip.title}</h2>
          <p className={styles.body}>{tip.body}</p>

          {tip.code && (
            <pre className={styles.code}><code>{tip.code}</code></pre>
          )}

          {tip.tldr && (
            <div className={styles.tldr}>
              <span className={styles.tldrLabel}>TL;DR</span>
              {tip.tldr}
            </div>
          )}
        </div>
      )}

      {/* History */}
      {history.length > 1 && (
        <div className={styles.historySection}>
          <div className={styles.label}>Previous Tips This Session</div>
          <div className={styles.historyList}>
            {history.slice(1).map((h, i) => (
              <div key={i} className={styles.historyItem}>
                <span className={styles.historyStack}>{h.stack}</span>
                <span className={styles.historyTitle}>{h.title}</span>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
