import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, BookOpen, Brain, BarChart3, CheckCircle, Clock, Star, ChevronDown, ChevronRight } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import { MODULES, PHASES, QUIZ_QUESTIONS } from '../../data/courseData';
import './RecapPanel.css';

export default function RecapPanel({ isOpen, onClose }) {
  const [activeTab, setActiveTab] = useState('modules');
  const [expandedId, setExpandedId] = useState(null);
  const { completedModules, confidenceRatings, quizHistory, stars } = useGameStore();

  const completedData = MODULES.filter(m => completedModules.includes(m.id));

  const tabs = [
    { id: 'modules', label: 'Modules', icon: BookOpen },
    { id: 'quizzes', label: 'Quiz History', icon: Brain },
    { id: 'confidence', label: 'Confidence', icon: BarChart3 },
  ];

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          className="recap-overlay"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          onClick={onClose}
        >
          <motion.div
            className="recap-panel"
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', stiffness: 300, damping: 30 }}
            onClick={e => e.stopPropagation()}
          >
            {/* Header */}
            <div className="recap-header">
              <div className="recap-header-left">
                <BookOpen size={18} />
                <h2>Recap</h2>
              </div>
              <button className="recap-close" onClick={onClose}>
                <X size={16} />
              </button>
            </div>

            {/* Tabs */}
            <div className="recap-tabs">
              {tabs.map(tab => (
                <button
                  key={tab.id}
                  className={`recap-tab ${activeTab === tab.id ? 'active' : ''}`}
                  onClick={() => setActiveTab(tab.id)}
                >
                  <tab.icon size={13} />
                  {tab.label}
                </button>
              ))}
            </div>

            {/* Content */}
            <div className="recap-content">
              {activeTab === 'modules' && (
                <div className="recap-modules">
                  {completedData.length === 0 ? (
                    <p className="recap-empty">No completed modules yet. Start learning!</p>
                  ) : (
                    completedData.map(mod => {
                      const isExpanded = expandedId === mod.id;
                      const phase = PHASES[mod.phase];
                      return (
                        <div key={mod.id} className="recap-module-card">
                          <button
                            className="recap-module-header"
                            onClick={() => setExpandedId(isExpanded ? null : mod.id)}
                          >
                            <CheckCircle size={14} className="recap-check" />
                            <div className="recap-module-info">
                              <span className="recap-module-phase" style={{ color: phase.color }}>
                                {phase.name.toUpperCase()}
                              </span>
                              <span className="recap-module-title">{mod.title}</span>
                            </div>
                            {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                          </button>
                          <AnimatePresence>
                            {isExpanded && (
                              <motion.div
                                className="recap-module-detail"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                <p>{mod.description}</p>
                                <div className="recap-module-meta">
                                  <span><Clock size={10} /> {mod.duration}</span>
                                  <span><Star size={10} /> +{mod.xpReward} XP</span>
                                  {confidenceRatings[mod.id] && (
                                    <span>⭐ {confidenceRatings[mod.id]}/5</span>
                                  )}
                                </div>
                                <div className="recap-topics">
                                  {mod.topics.map((t, i) => (
                                    <span key={i} className="recap-topic">{t}</span>
                                  ))}
                                </div>
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'quizzes' && (
                <div className="recap-quizzes">
                  {quizHistory.length === 0 ? (
                    <p className="recap-empty">No quiz history yet. Complete module mastery quizzes to see results here.</p>
                  ) : (
                    quizHistory.map((quiz, idx) => {
                      const mod = MODULES.find(m => m.id === quiz.moduleId);
                      const isExpanded = expandedId === `quiz-${idx}`;
                      const scoreColor = quiz.passed ? 'var(--accent-green)' : 'var(--accent-orange)';
                      return (
                        <div key={idx} className="recap-quiz-card">
                          <button
                            className="recap-quiz-header"
                            onClick={() => setExpandedId(isExpanded ? null : `quiz-${idx}`)}
                          >
                            <div className="recap-quiz-left">
                              <span className={`recap-quiz-badge ${quiz.passed ? 'pass' : 'fail'}`}>
                                {quiz.passed ? '✅' : '❌'}
                              </span>
                              <div>
                                <span className="recap-quiz-module">{mod?.title || quiz.moduleId}</span>
                                <span className="recap-quiz-date">
                                  {new Date(quiz.timestamp).toLocaleDateString()} · {quiz.type === 'mastery' ? 'Mastery Quiz' : 'Quiz'}
                                </span>
                              </div>
                            </div>
                            <div className="recap-quiz-right">
                              <span className="recap-quiz-score" style={{ color: scoreColor }}>
                                {quiz.score}/{quiz.total}
                              </span>
                              {isExpanded ? <ChevronDown size={12} /> : <ChevronRight size={12} />}
                            </div>
                          </button>
                          <AnimatePresence>
                            {isExpanded && quiz.answers && (
                              <motion.div
                                className="recap-quiz-detail"
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                              >
                                {quiz.answers.map((ans, ai) => (
                                  <div key={ai} className={`recap-qa-item ${ans.isCorrect ? 'correct' : 'wrong'}`}>
                                    <div className="recap-qa-header">
                                      <span className="recap-qa-num">Q{ai + 1}</span>
                                      <span className={`recap-qa-status ${ans.isCorrect ? 'correct' : 'wrong'}`}>
                                        {ans.isCorrect ? '✓ Correct' : ans.selected === -1 ? '⏱ Timed Out' : '✗ Wrong'}
                                      </span>
                                    </div>
                                    <p className="recap-qa-question">{ans.question}</p>
                                    <div className="recap-qa-answers">
                                      {ans.options?.map((opt, oi) => {
                                        let cls = 'recap-qa-option';
                                        if (oi === ans.correct) cls += ' correct-answer';
                                        if (oi === ans.selected && oi !== ans.correct) cls += ' wrong-answer';
                                        return (
                                          <div key={oi} className={cls}>
                                            <span className="recap-qa-letter">{String.fromCharCode(65 + oi)}</span>
                                            <span>{opt}</span>
                                            {oi === ans.correct && <CheckCircle size={11} className="recap-qa-icon correct" />}
                                            {oi === ans.selected && oi !== ans.correct && <X size={11} className="recap-qa-icon wrong" />}
                                          </div>
                                        );
                                      })}
                                    </div>
                                  </div>
                                ))}
                              </motion.div>
                            )}
                          </AnimatePresence>
                        </div>
                      );
                    })
                  )}
                </div>
              )}

              {activeTab === 'confidence' && (
                <div className="recap-confidence">
                  {completedData.length === 0 ? (
                    <p className="recap-empty">Complete modules to see your confidence ratings.</p>
                  ) : (
                    completedData.map(mod => {
                      const rating = confidenceRatings[mod.id] || 0;
                      const percentage = (rating / 5) * 100;
                      return (
                        <div key={mod.id} className="recap-conf-item">
                          <span className="recap-conf-name">{mod.title}</span>
                          <div className="recap-conf-bar">
                            <div className="recap-conf-fill" style={{ width: `${percentage}%` }} />
                          </div>
                          <span className="recap-conf-val">{rating}/5</span>
                        </div>
                      );
                    })
                  )}
                </div>
              )}
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
