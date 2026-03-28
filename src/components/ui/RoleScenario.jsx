import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, XCircle } from 'lucide-react';
import './RoleScenario.css';

export default function RoleScenario({ roleData }) {
  const [selected, setSelected] = useState(null);
  const [submitted, setSubmitted] = useState(false);
  const [scenarioIdx, setScenarioIdx] = useState(0);

  if (!roleData) return null;

  const scenario = roleData.scenarios[scenarioIdx];
  if (!scenario) return null;

  const handleSubmit = () => {
    if (selected !== null) setSubmitted(true);
  };

  const nextScenario = () => {
    if (scenarioIdx < roleData.scenarios.length - 1) {
      setScenarioIdx(i => i + 1);
      setSelected(null);
      setSubmitted(false);
    }
  };

  return (
    <div className="rs-card">
      <div className="rs-role-header">
        <span className="rs-role-icon">{roleData.icon}</span>
        <div>
          <h4 className="rs-role-name">Role: {roleData.role}</h4>
          <p className="rs-context">{roleData.context}</p>
        </div>
      </div>

      <div className="rs-situation">
        <p>{scenario.situation}</p>
      </div>

      <div className="rs-options">
        {scenario.options.map((opt, i) => (
          <motion.button
            key={i}
            className={`rs-option ${selected === i ? 'selected' : ''} ${submitted && opt.correct ? 'correct' : ''} ${submitted && selected === i && !opt.correct ? 'wrong' : ''}`}
            onClick={() => !submitted && setSelected(i)}
            whileHover={!submitted ? { scale: 1.01 } : {}}
          >
            <span className="rs-option-text">{opt.text}</span>
            {submitted && opt.correct && <CheckCircle size={16} className="rs-check" />}
            {submitted && selected === i && !opt.correct && <XCircle size={16} className="rs-x" />}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {submitted && (
          <motion.div className="rs-feedback" initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} exit={{ opacity: 0, height: 0 }}>
            <p>{scenario.options[selected]?.feedback}</p>
          </motion.div>
        )}
      </AnimatePresence>

      <div className="rs-actions">
        {!submitted ? (
          <button className="rs-submit" onClick={handleSubmit} disabled={selected === null}>Submit Decision</button>
        ) : scenarioIdx < roleData.scenarios.length - 1 ? (
          <button className="rs-submit" onClick={nextScenario}>Next Scenario →</button>
        ) : (
          <span className="rs-done">✅ All scenarios completed</span>
        )}
      </div>
    </div>
  );
}
