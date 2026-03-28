import { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, CheckCircle, Clock, Zap, ChevronRight, RotateCcw } from 'lucide-react';
import './TroubleshootingGame.css';

export default function TroubleshootingGame({ scenario }) {
  const [selectedBranch, setSelectedBranch] = useState(null);
  const [checkIndex, setCheckIndex] = useState(0);
  const [foundCauses, setFoundCauses] = useState([]);
  const [score, setScore] = useState(0);
  const [checksPerformed, setChecksPerformed] = useState(0);
  const [investigated, setInvestigated] = useState({});  // per-check tracking: { "branchIdx-checkIdx": true }
  const [complete, setComplete] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef = useRef(null);

  useEffect(() => {
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
    return () => clearInterval(timerRef.current);
  }, []);

  if (!scenario) return null;

  const checkKey = (bi, ci) => `${bi}-${ci}`;

  const handleCheck = (check) => {
    const key = checkKey(selectedBranch, checkIndex);
    if (investigated[key]) return; // already investigated
    setInvestigated(prev => ({ ...prev, [key]: true }));
    setChecksPerformed(c => c + 1);
    if (check.isRootCause && !foundCauses.includes(check.question)) {
      setFoundCauses(prev => [...prev, check.question]);
      setScore(s => s + 100);
    }
  };

  const advance = () => {
    const branch = scenario.branches[selectedBranch];
    if (checkIndex < branch.checks.length - 1) {
      setCheckIndex(i => i + 1);
    } else {
      setSelectedBranch(null);
      setCheckIndex(0);
    }
  };

  const finish = () => {
    clearInterval(timerRef.current);
    const timeBonus = Math.max(0, scenario.timeBonus - elapsed) * 2;
    setScore(s => s + timeBonus);
    setComplete(true);
  };

  const totalCauses = scenario.branches.reduce((sum, b) => sum + b.checks.filter(c => c.isRootCause).length, 0);
  const allFound = foundCauses.length >= totalCauses;

  const reset = () => {
    setSelectedBranch(null);
    setCheckIndex(0);
    setFoundCauses([]);
    setScore(0);
    setChecksPerformed(0);
    setInvestigated({});
    setComplete(false);
    setElapsed(0);
    timerRef.current = setInterval(() => setElapsed(e => e + 1), 1000);
  };

  const currentKey = selectedBranch !== null ? checkKey(selectedBranch, checkIndex) : null;
  const isCurrentInvestigated = currentKey ? investigated[currentKey] : false;

  return (
    <div className="ts-game">
      <div className="ts-header">
        <div className="ts-header-left">
          <AlertTriangle size={18} className="ts-alert-icon" />
          <div>
            <h3>{scenario.title}</h3>
            <p className="ts-description">{scenario.description}</p>
          </div>
        </div>
        <div className="ts-stats">
          <span className="ts-stat"><Clock size={14} /> {elapsed}s</span>
          <span className="ts-stat"><Zap size={14} /> {score} pts</span>
          <span className="ts-stat">{foundCauses.length}/{totalCauses} causes</span>
        </div>
      </div>

      {complete ? (
        <motion.div className="ts-result" initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
          <CheckCircle size={40} className="ts-result-icon" />
          <h3>Investigation Complete!</h3>
          <div className="ts-result-stats">
            <div className="ts-result-row"><span>Root causes found</span><strong>{foundCauses.length}/{totalCauses}</strong></div>
            <div className="ts-result-row"><span>Checks performed</span><strong>{checksPerformed}</strong></div>
            <div className="ts-result-row"><span>Time taken</span><strong>{elapsed}s</strong></div>
            <div className="ts-result-row highlight"><span>Total Score</span><strong>{score} pts</strong></div>
          </div>
          <button className="ts-reset-btn" onClick={reset}><RotateCcw size={14} /> Try Again</button>
        </motion.div>
      ) : selectedBranch !== null ? (
        <div className="ts-investigation">
          <button className="ts-back-btn" onClick={() => { setSelectedBranch(null); setCheckIndex(0); }}>← Back to branches</button>
          <div className="ts-branch-name">{scenario.branches[selectedBranch].icon} {scenario.branches[selectedBranch].name}</div>
          <AnimatePresence mode="wait">
            <motion.div key={`${selectedBranch}-${checkIndex}`} className="ts-check-card" initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }}>
              <p className="ts-check-question">{scenario.branches[selectedBranch].checks[checkIndex].question}</p>
              {!isCurrentInvestigated ? (
                <button className="ts-investigate-btn" onClick={() => handleCheck(scenario.branches[selectedBranch].checks[checkIndex])}>
                  🔍 Investigate
                </button>
              ) : (
                <>
                  <div className={`ts-check-answer ${scenario.branches[selectedBranch].checks[checkIndex].isRootCause ? 'root-cause' : ''}`}>
                    <p>{scenario.branches[selectedBranch].checks[checkIndex].answer}</p>
                    {scenario.branches[selectedBranch].checks[checkIndex].isRootCause && (
                      <div className="ts-root-cause-badge">⚠️ ROOT CAUSE FOUND! {scenario.branches[selectedBranch].checks[checkIndex].explanation}</div>
                    )}
                  </div>
                  <button className="ts-next-check" onClick={advance}>
                    {checkIndex < scenario.branches[selectedBranch].checks.length - 1 ? 'Next Check →' : '← Return to Branches'}
                  </button>
                </>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      ) : (
        <div className="ts-branches">
          <p className="ts-instruction">Select a diagnostic branch to investigate:</p>
          <div className="ts-branch-grid">
            {scenario.branches.map((branch, i) => (
              <motion.button key={i} className="ts-branch-card" onClick={() => setSelectedBranch(i)} whileHover={{ scale: 1.02, y: -4 }}>
                <span className="ts-branch-icon">{branch.icon}</span>
                <span className="ts-branch-label">{branch.name}</span>
                <ChevronRight size={16} className="ts-branch-arrow" />
              </motion.button>
            ))}
          </div>
          {allFound && (
            <motion.button className="ts-finish-btn" onClick={finish} initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
              ✅ Submit Investigation Report
            </motion.button>
          )}
        </div>
      )}
    </div>
  );
}
