import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ChevronRight, CheckCircle, Clock, Star, BookOpen } from 'lucide-react';
import { MODULES } from '../../data/courseData';
import useGameStore from '../../store/gameStore';
import './TableOfContents.css';

export default function TableOfContents({ currentModuleId, onNavigate }) {
  const [expandedModule, setExpandedModule] = useState(null);
  const completedModules = useGameStore(s => s.completedModules);

  const totalDone = completedModules.length;

  const toggleModule = (moduleId) => {
    setExpandedModule(expandedModule === moduleId ? null : moduleId);
  };

  return (
    <div className="toc-container">
      <div className="toc-header">
        <BookOpen size={16} />
        <h3>Table of Contents</h3>
        <span style={{ fontSize: '0.7rem', color: 'var(--text-secondary)', marginLeft: 'auto' }}>{totalDone}/{MODULES.length} done</span>
      </div>

      <div className="toc-phases">
        {MODULES.map((mod, i) => {
          const isCompleted = completedModules.includes(mod.id);
          const isCurrent = mod.id === currentModuleId;
          const isModExpanded = expandedModule === mod.id;

          return (
            <div key={mod.id} className={`toc-module ${isCurrent ? 'current' : ''} ${isCompleted ? 'completed' : ''}`}>
              <button
                className="toc-module-header"
                onClick={() => toggleModule(mod.id)}
              >
                <div className="toc-module-status">
                  {isCompleted ? (
                    <CheckCircle size={14} className="toc-check" />
                  ) : isCurrent ? (
                    <div className="toc-current-dot" style={{ background: '#0ea5e9' }} />
                  ) : (
                    <div className="toc-lock-dot" />
                  )}
                </div>
                <div className="toc-module-info">
                  <span className="toc-module-title">{mod.title}</span>
                  <span className="toc-module-meta">
                    <Clock size={10} /> {mod.duration} · <Star size={10} /> +{mod.xpReward} XP
                  </span>
                </div>
                {isModExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
              </button>

              <AnimatePresence>
                {isModExpanded && (
                  <motion.div
                    className="toc-module-detail"
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <p className="toc-module-desc">{mod.description}</p>
                    <div className="toc-module-topics">
                      {mod.topics.map((topic, j) => (
                        <span key={j} className="toc-topic-tag">{topic}</span>
                      ))}
                    </div>
                    {onNavigate && mod.id !== currentModuleId && (
                      <button
                        className="toc-go-btn"
                        onClick={() => onNavigate(mod.id)}
                      >
                        Go to Module →
                      </button>
                    )}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
}
