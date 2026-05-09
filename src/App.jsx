import { useState } from 'react';
import InterviewPrep from './components/InterviewPrep.jsx';
import DailyTip from './components/DailyTip.jsx';

const styles = `
  .app {
    min-height: 100vh;
    background: var(--bg);
    background-image:
      radial-gradient(ellipse at 15% 0%, rgba(232,255,71,0.035) 0%, transparent 55%),
      radial-gradient(ellipse at 85% 100%, rgba(255,107,53,0.035) 0%, transparent 55%);
  }

  .header {
    position: sticky;
    top: 0;
    z-index: 10;
    background: rgba(10,10,15,0.85);
    backdrop-filter: blur(16px);
    -webkit-backdrop-filter: blur(16px);
    border-bottom: 1px solid var(--border);
    padding: 0 32px;
    display: flex;
    align-items: center;
    justify-content: space-between;
    height: 64px;
  }

  .logo {
    display: flex;
    align-items: center;
    gap: 10px;
    text-decoration: none;
  }

  .logo-mark {
    width: 34px; height: 34px;
    background: var(--accent);
    border-radius: 8px;
    display: flex; align-items: center; justify-content: center;
    font-size: 17px;
    color: #000;
    font-weight: 900;
    flex-shrink: 0;
  }

  .logo-name {
    font-size: 17px;
    font-weight: 800;
    letter-spacing: -0.5px;
    color: var(--text);
    font-family: 'Syne', sans-serif;
  }

  .logo-name span { color: var(--accent); }

  .logo-tag {
    font-size: 10px;
    font-weight: 600;
    color: var(--muted);
    font-family: 'JetBrains Mono', monospace;
    letter-spacing: 0.5px;
    background: var(--surface2);
    border: 1px solid var(--border);
    padding: 2px 7px;
    border-radius: 4px;
    margin-left: 2px;
  }

  .tabs {
    display: flex;
    gap: 2px;
    background: var(--surface);
    border: 1px solid var(--border);
    border-radius: 10px;
    padding: 3px;
  }

  .tab {
    padding: 7px 18px;
    border-radius: 7px;
    border: none;
    background: transparent;
    color: var(--muted);
    font-family: 'Syne', sans-serif;
    font-size: 13px;
    font-weight: 700;
    cursor: pointer;
    transition: all 0.18s;
    display: flex;
    align-items: center;
    gap: 6px;
  }

  .tab:hover { color: var(--text); }
  .tab.active { background: var(--accent); color: #000; }

  .main {
    max-width: 1000px;
    margin: 0 auto;
    padding: 32px 32px 80px;
  }

  .page-title {
    font-size: 13px;
    font-weight: 700;
    color: var(--muted);
    text-transform: uppercase;
    letter-spacing: 2px;
    margin-bottom: 24px;
    font-family: 'JetBrains Mono', monospace;
  }

  @media (max-width: 640px) {
    .header { padding: 0 16px; }
    .main { padding: 20px 16px 60px; }
    .logo-tag { display: none; }
    .tab { padding: 7px 12px; font-size: 12px; }
  }
`;

const TABS = [
  { id: 'interview', label: 'Interview Prep', icon: '🎯' },
  { id: 'daily',     label: 'Daily Tip',      icon: '💡' },
];

export default function App() {
  const [tab, setTab] = useState('interview');

  return (
    <>
      <style>{styles}</style>
      <div className="app">
        <header className="header">
          <div className="logo">
            <div className="logo-mark">⚡</div>
            <div className="logo-name">Dev<span>Prep</span>.ai</div>
            <span className="logo-tag">beta</span>
          </div>

          <nav className="tabs">
            {TABS.map(t => (
              <button
                key={t.id}
                className={`tab ${tab === t.id ? 'active' : ''}`}
                onClick={() => setTab(t.id)}
              >
                <span>{t.icon}</span>
                <span>{t.label}</span>
              </button>
            ))}
          </nav>
        </header>

        <main className="main">
          <div className="page-title">
            {tab === 'interview' ? '// interview questions' : '// daily insight'}
          </div>
          {tab === 'interview' ? <InterviewPrep /> : <DailyTip />}
        </main>
      </div>
    </>
  );
}
