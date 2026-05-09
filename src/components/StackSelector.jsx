import { TECH_STACKS } from '../constants.js';
import styles from './StackSelector.module.css';

export default function StackSelector({ selected, onSelect, multi = false }) {
  function handleClick(id) {
    if (multi) {
      if (selected.includes(id)) {
        onSelect(selected.filter(s => s !== id));
      } else {
        onSelect([...selected, id]);
      }
    } else {
      onSelect(id);
    }
  }

  function isSelected(id) {
    return multi ? selected.includes(id) : selected === id;
  }

  return (
    <div className={styles.grid}>
      {TECH_STACKS.map(s => (
        <button
          key={s.id}
          className={`${styles.chip} ${isSelected(s.id) ? styles.selected : ''}`}
          onClick={() => handleClick(s.id)}
        >
          <span className={styles.icon}>{s.icon}</span>
          <span className={styles.label}>{s.label}</span>
        </button>
      ))}
    </div>
  );
}
