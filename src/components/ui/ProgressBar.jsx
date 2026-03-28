import { motion } from 'framer-motion';
import './ProgressBar.css';

export default function ProgressBar({ value = 0, max = 100, gradient, height = 8, label, showValue = true }) {
  const percentage = Math.min((value / max) * 100, 100);
  const gradientStyle = gradient || 'linear-gradient(90deg, #4f8cff, #a855f7)';

  return (
    <div className="progress-bar-container">
      {(label || showValue) && (
        <div className="progress-bar-header">
          {label && <span className="progress-bar-label">{label}</span>}
          {showValue && <span className="progress-bar-value">{Math.round(percentage)}%</span>}
        </div>
      )}
      <div className="progress-bar-track" style={{ height }}>
        <motion.div
          className="progress-bar-fill"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ duration: 1, ease: 'easeOut' }}
          style={{ background: gradientStyle }}
        />
        <div className="progress-bar-glow" style={{
          width: `${percentage}%`,
          background: gradientStyle,
        }} />
      </div>
    </div>
  );
}
