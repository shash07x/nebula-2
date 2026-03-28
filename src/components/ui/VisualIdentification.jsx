import { useState } from 'react';
import { motion } from 'framer-motion';
import { CheckCircle, XCircle, HelpCircle, RotateCcw, GripVertical } from 'lucide-react';
import './VisualIdentification.css';

export default function VisualIdentification({ exercise }) {
  const [placements, setPlacements] = useState({});
  const [dragItem, setDragItem] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [score, setScore] = useState(0);

  if (!exercise) return null;

  const availableLabels = exercise.items.filter(item => !Object.values(placements).includes(item.id));

  const handleDragStart = (itemId) => {
    setDragItem(itemId);
  };

  const handleDrop = (zoneId) => {
    if (dragItem && !submitted) {
      setPlacements(prev => {
        const cleaned = {};
        for (const [k, v] of Object.entries(prev)) {
          if (v !== dragItem) cleaned[k] = v;
        }
        cleaned[zoneId] = dragItem;
        return cleaned;
      });
      setDragItem(null);
    }
  };

  const handleRemove = (zoneId) => {
    if (!submitted) {
      setPlacements(prev => {
        const copy = { ...prev };
        delete copy[zoneId];
        return copy;
      });
    }
  };

  const handleSubmit = () => {
    let correct = 0;
    exercise.items.forEach(item => {
      if (placements[item.zone] === item.id) correct++;
    });
    setScore(correct);
    setSubmitted(true);
  };

  const reset = () => {
    setPlacements({});
    setSubmitted(false);
    setScore(0);
    setDragItem(null);
  };

  const getItemById = (id) => exercise.items.find(i => i.id === id);

  // Visual descriptors for each zone position
  const zoneDescriptions = exercise.items.map((item, i) => ({
    zone: item.zone,
    number: i + 1,
    description: item.hint || `Position ${i + 1}`,
  }));

  return (
    <div className="vi-exercise">
      <div className="vi-header">
        <h3>{exercise.title}</h3>
        <p className="vi-instruction">{exercise.instruction}</p>
      </div>

      {/* Available labels pool */}
      <div className="vi-labels-pool">
        <span className="vi-pool-title">⬇️ Drag labels to the matching descriptions below:</span>
        <div className="vi-labels-row">
          {availableLabels.map(item => (
            <motion.div
              key={item.id}
              className={`vi-label ${dragItem === item.id ? 'dragging' : ''}`}
              draggable={!submitted}
              onDragStart={() => handleDragStart(item.id)}
              whileHover={!submitted ? { scale: 1.04 } : {}}
            >
              <GripVertical size={12} className="vi-grip" />
              {item.label}
            </motion.div>
          ))}
          {availableLabels.length === 0 && !submitted && (
            <span className="vi-all-placed">All labels placed — ready to check ✓</span>
          )}
        </div>
      </div>

      {/* Drop zones with descriptions */}
      <div className="vi-zones-grid">
        {zoneDescriptions.map((zd) => {
          const placedId = placements[zd.zone];
          const placedItem = placedId ? getItemById(placedId) : null;
          const correctItem = exercise.items.find(item => item.zone === zd.zone);
          const isCorrect = submitted && placedId === correctItem.id;
          const isWrong = submitted && placedId && placedId !== correctItem.id;

          return (
            <div
              key={zd.zone}
              className={`vi-zone ${placedId ? 'filled' : ''} ${isCorrect ? 'correct' : ''} ${isWrong ? 'wrong' : ''} ${dragItem ? 'drop-ready' : ''}`}
              onDragOver={(e) => e.preventDefault()}
              onDrop={() => handleDrop(zd.zone)}
            >
              <div className="vi-zone-left">
                <span className="vi-zone-number">{zd.number}</span>
                <span className="vi-zone-desc">{zd.description}</span>
              </div>
              <div className="vi-zone-right">
                {placedItem ? (
                  <div className="vi-zone-content">
                    <span className="vi-placed-label">{placedItem.label}</span>
                    {!submitted && (
                      <button className="vi-remove-btn" onClick={() => handleRemove(zd.zone)} title="Remove">✕</button>
                    )}
                    {submitted && isCorrect && <CheckCircle size={16} className="vi-correct" />}
                    {submitted && isWrong && (
                      <>
                        <XCircle size={16} className="vi-wrong" />
                        <span className="vi-correct-answer">→ {correctItem.label}</span>
                      </>
                    )}
                  </div>
                ) : (
                  <span className="vi-zone-placeholder">Drop label here</span>
                )}
              </div>
            </div>
          );
        })}
      </div>

      {/* Actions */}
      <div className="vi-actions">
        {!submitted ? (
          <button className="vi-submit-btn" onClick={handleSubmit} disabled={Object.keys(placements).length < exercise.items.length}>
            ✅ Check Answers ({Object.keys(placements).length}/{exercise.items.length})
          </button>
        ) : (
          <div className="vi-result">
            <span className={`vi-score ${score === exercise.items.length ? 'perfect' : ''}`}>
              {score === exercise.items.length ? '🎉 Perfect! ' : ''}{score}/{exercise.items.length} correct
            </span>
            <button className="vi-retry-btn" onClick={reset}><RotateCcw size={14} /> Try Again</button>
          </div>
        )}
      </div>
    </div>
  );
}
