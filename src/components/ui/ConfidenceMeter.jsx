import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { TrendingUp, Shield, AlertCircle, Star, ChevronUp } from 'lucide-react';
import './ConfidenceMeter.css';

const LEVELS = [
  { min: 0,  max: 1,  label: 'Not Confident',    color: '#ff5252', icon: AlertCircle,  emoji: '😰' },
  { min: 1,  max: 2,  label: 'Slightly Confident', color: '#ff9800', icon: AlertCircle,  emoji: '🤔' },
  { min: 2,  max: 3,  label: 'Moderately Confident', color: '#ffd600', icon: Shield,      emoji: '😊' },
  { min: 3,  max: 4,  label: 'Confident',          color: '#4caf50', icon: TrendingUp,   emoji: '💪' },
  { min: 4,  max: 5,  label: 'Very Confident',     color: '#00e676', icon: Star,         emoji: '🚀' },
];

function getLevel(value) {
  return LEVELS.find(l => value >= l.min && value < l.max) || LEVELS[LEVELS.length - 1];
}

export default function ConfidenceMeter({ value, onChange, label = 'How confident do you feel?', compact = false }) {
  const [hoveredVal, setHoveredVal] = useState(null);
  const displayVal = hoveredVal !== null ? hoveredVal : value;
  const level = getLevel(displayVal);
  const percentage = (displayVal / 5) * 100;

  if (compact) {
    return (
      <div className="confidence-compact">
        <div className="confidence-compact-bar">
          <motion.div
            className="confidence-compact-fill"
            animate={{ width: `${percentage}%` }}
            style={{ background: level.color }}
          />
        </div>
        <span className="confidence-compact-label" style={{ color: level.color }}>
          {level.emoji} {level.label}
        </span>
      </div>
    );
  }

  return (
    <div className="confidence-meter">
      <div className="cm-header">
        <span className="cm-label">{label}</span>
        <motion.span
          className="cm-value"
          key={displayVal}
          initial={{ scale: 0.8 }}
          animate={{ scale: 1 }}
          style={{ color: level.color }}
        >
          {level.emoji} {level.label}
        </motion.span>
      </div>

      {/* Visual gauge */}
      <div className="cm-gauge">
        <div className="cm-gauge-track">
          <motion.div
            className="cm-gauge-fill"
            animate={{ width: `${percentage}%` }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
            style={{ background: `linear-gradient(90deg, #ff5252, ${level.color})` }}
          />
          <div className="cm-gauge-markers">
            {LEVELS.map((lvl, i) => (
              <div key={i} className="cm-marker" style={{ left: `${(i / LEVELS.length) * 100}%` }}>
                <div className="cm-marker-line" />
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Clickable stars */}
      <div className="cm-stars">
        {[1, 2, 3, 4, 5].map(star => (
          <motion.button
            key={star}
            className={`cm-star ${displayVal >= star ? 'active' : ''}`}
            onClick={() => onChange?.(star)}
            onMouseEnter={() => setHoveredVal(star)}
            onMouseLeave={() => setHoveredVal(null)}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            style={{
              color: displayVal >= star ? level.color : 'rgba(255,255,255,0.1)',
              filter: displayVal >= star ? `drop-shadow(0 0 6px ${level.color}60)` : 'none',
            }}
          >
            <Star size={24} fill={displayVal >= star ? 'currentColor' : 'none'} />
          </motion.button>
        ))}
      </div>

      {/* Comparative text */}
      <div className="cm-footer">
        <ChevronUp size={12} style={{ color: level.color }} />
        <span className="cm-footer-text">
          {value <= 2 ? 'Keep learning — you\'ll get there!' :
           value <= 3 ? 'Good progress! Practice will build mastery.' :
           value <= 4 ? 'Strong confidence! Nearly there.' :
                        'Outstanding mastery! You\'re ready to teach others.'}
        </span>
      </div>
    </div>
  );
}
