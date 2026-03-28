import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Clock, CheckCircle, XCircle, ArrowRight, Trophy, RotateCcw } from 'lucide-react';
import GlassCard from './GlassCard';
import Button from './Button';
import './MasteryQuiz.css';

const TIME_PER_QUESTION = 10; // seconds

export default function MasteryQuiz({ questions, moduleName, onPass, onFail, onComplete }) {
  const [currentQ, setCurrentQ] = useState(0);
  const [selected, setSelected] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [timeLeft, setTimeLeft] = useState(TIME_PER_QUESTION);
  const [phase, setPhase] = useState('quiz'); // 'quiz' | 'result'
  const [locked, setLocked] = useState(false);
  const timerRef = useRef(null);

  const totalQ = questions.length;
  const passThreshold = Math.ceil(totalQ * 0.6);

  // Timer countdown
  useEffect(() => {
    if (phase !== 'quiz') return;
    setTimeLeft(TIME_PER_QUESTION);
    timerRef.current = setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          clearInterval(timerRef.current);
          handleTimeout();
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [currentQ, phase]);

  const handleTimeout = useCallback(() => {
    if (locked) return;
    setLocked(true);
    const q = questions[currentQ];
    const newAnswers = [...answers, {
      selected: -1, correct: q.correct, isCorrect: false,
      question: q.question, options: q.options,
    }];
    setAnswers(newAnswers);
    setTimeout(() => advanceQuestion(newAnswers), 1200);
  }, [currentQ, answers, locked, questions]);

  const handleSelect = (optIndex) => {
    if (locked || phase !== 'quiz') return;
    setSelected(optIndex);
    setLocked(true);
    clearInterval(timerRef.current);
    const q = questions[currentQ];
    const isCorrect = optIndex === q.correct;
    const newAnswers = [...answers, {
      selected: optIndex, correct: q.correct, isCorrect,
      question: q.question, options: q.options,
    }];
    setAnswers(newAnswers);
    setTimeout(() => advanceQuestion(newAnswers), 1000);
  };

  const advanceQuestion = (newAnswers) => {
    if (currentQ + 1 >= totalQ) {
      setPhase('result');
      // Fire onComplete with full quiz details
      const finalScore = newAnswers.filter(a => a.isCorrect).length;
      const passed = finalScore >= passThreshold;
      onComplete?.({ answers: newAnswers, score: finalScore, total: totalQ, passed });
    } else {
      setCurrentQ(prev => prev + 1);
      setSelected(null);
      setLocked(false);
    }
  };

  const score = answers.filter(a => a.isCorrect).length;
  const passed = score >= passThreshold;
  const percentage = totalQ > 0 ? Math.round((score / totalQ) * 100) : 0;

  if (phase === 'result') {
    return (
      <motion.div className="mq-result" initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }}>
        <GlassCard className={`mq-result-card ${passed ? 'passed' : 'failed'}`} glow={passed ? 'green' : 'orange'}>
          <div className="mq-result-icon">
            {passed ? <Trophy size={48} /> : <RotateCcw size={48} />}
          </div>
          <h3>{passed ? '🎉 Mastery Confirmed!' : '📚 Needs More Practice'}</h3>
          <div className="mq-score-display">
            <span className="mq-score-num">{score}/{totalQ}</span>
            <span className="mq-score-pct">{percentage}%</span>
          </div>
          <p className="mq-result-msg">
            {passed
              ? `Excellent work! You've demonstrated strong understanding of ${moduleName}. You're ready to move forward.`
              : `You scored below 60%. We recommend reviewing the module content before proceeding. Practice makes perfect!`}
          </p>
          <div className="mq-result-actions">
            {passed ? (
              <Button variant="primary" glow onClick={onPass} icon={<ArrowRight size={14} />}>
                Continue to Completion
              </Button>
            ) : (
              <>
                <Button variant="secondary" onClick={onFail} icon={<RotateCcw size={14} />}>
                  Review Module
                </Button>
                <Button variant="ghost" onClick={onPass}>
                  Continue Anyway
                </Button>
              </>
            )}
          </div>
        </GlassCard>
      </motion.div>
    );
  }

  const q = questions[currentQ];
  const timerPct = (timeLeft / TIME_PER_QUESTION) * 100;
  const timerColor = timeLeft > 6 ? 'var(--accent-green)' : timeLeft > 3 ? 'var(--accent-orange)' : 'var(--accent-magenta)';

  return (
    <div className="mastery-quiz">
      <div className="mq-header">
        <span className="mq-progress">Question {currentQ + 1} of {totalQ}</span>
        <div className="mq-timer">
          <Clock size={14} style={{ color: timerColor }} />
          <span style={{ color: timerColor }}>{timeLeft}s</span>
        </div>
      </div>

      <div className="mq-timer-bar">
        <motion.div
          className="mq-timer-fill"
          animate={{ width: `${timerPct}%` }}
          transition={{ duration: 0.3 }}
          style={{ background: timerColor }}
        />
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={currentQ}
          className="mq-question-area"
          initial={{ opacity: 0, x: 30 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -30 }}
          transition={{ duration: 0.25 }}
        >
          <GlassCard className="mq-question-card">
            <p className="mq-question">{q.question}</p>
            <div className="mq-options">
              {q.options.map((opt, oi) => {
                let cls = 'mq-option';
                if (locked) {
                  if (oi === q.correct) cls += ' correct';
                  else if (oi === selected && oi !== q.correct) cls += ' wrong';
                } else if (oi === selected) {
                  cls += ' selected';
                }
                return (
                  <motion.button
                    key={oi}
                    className={cls}
                    onClick={() => handleSelect(oi)}
                    disabled={locked}
                    whileHover={!locked ? { scale: 1.01 } : {}}
                    whileTap={!locked ? { scale: 0.99 } : {}}
                  >
                    <span className="mq-opt-letter">{String.fromCharCode(65 + oi)}</span>
                    <span className="mq-opt-text">{opt}</span>
                    {locked && oi === q.correct && <CheckCircle size={16} className="mq-opt-icon correct" />}
                    {locked && oi === selected && oi !== q.correct && <XCircle size={16} className="mq-opt-icon wrong" />}
                  </motion.button>
                );
              })}
            </div>
          </GlassCard>
        </motion.div>
      </AnimatePresence>

      <div className="mq-dots">
        {questions.map((_, i) => (
          <div
            key={i}
            className={`mq-dot ${i === currentQ ? 'active' : ''} ${
              answers[i] ? (answers[i].isCorrect ? 'correct' : 'wrong') : ''
            }`}
          />
        ))}
      </div>
    </div>
  );
}
