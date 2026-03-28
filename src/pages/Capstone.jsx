import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ChevronLeft, CheckCircle, Cpu, Move, Wrench, Code, Timer, Shield, FileText, Video, Play, AlertTriangle, TrendingUp, BarChart3 } from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import FullscreenProctor from '../components/ui/FullscreenProctor';
import useGameStore from '../store/gameStore';
import InteractiveCapstoneWizard from '../components/ui/InteractiveCapstoneWizard';
import './Capstone.css';

const DELIVERABLES = [
  { icon: <Cpu size={18} />, title: 'Select Robot Type', desc: 'Choose the appropriate robot for a pick-and-place application' },
  { icon: <Move size={18} />, title: 'Define Work Envelope', desc: 'Calculate and define the required workspace for the operation' },
  { icon: <Wrench size={18} />, title: 'Choose EOAT', desc: 'Design or select end-of-arm tooling for the application' },
  { icon: <Code size={18} />, title: 'Program Task Sequence', desc: 'Create the motion path and program logic' },
  { icon: <Timer size={18} />, title: 'Optimize Cycle Time', desc: 'Analyze and reduce cycle time through path optimization' },
  { icon: <Shield size={18} />, title: 'Safety Measures', desc: 'Implement appropriate safety systems and procedures' },
];

const OUTPUTS = [
  { icon: <Cpu size={16} />, title: 'Simulation', desc: 'Working robot cell simulation' },
  { icon: <FileText size={16} />, title: 'Documentation', desc: 'Complete project documentation' },
  { icon: <Video size={16} />, title: 'Explanation Video', desc: 'Video walkthrough of your design' },
];

// Final assessment questions sourced from course content
const ASSESSMENT_QUESTIONS = [
  {
    question: 'A robot cell needs to palletize 40kg boxes at 12 cycles/minute. Which robot type is most suitable?',
    options: ['SCARA robot', '4-axis palletizing robot', 'Delta robot', 'Collaborative cobot'],
    correct: 1,
  },
  {
    question: 'When designing a robotic work cell, what must be determined FIRST?',
    options: ['The PLC brand', 'Robot reach envelope and material flow analysis', 'Paint color of safety fencing', 'HMI screen size'],
    correct: 1,
  },
  {
    question: 'A welding robot produces inconsistent welds after a tool change. The most likely cause is:',
    options: ['Incorrect TCP calibration', 'Wrong paint type', 'PLC memory full', 'Conveyor speed too high'],
    correct: 0,
  },
  {
    question: 'Which motion type follows the most efficient path between two points in joint space?',
    options: ['Linear motion', 'Circular motion', 'Joint motion', 'Spline motion'],
    correct: 2,
  },
  {
    question: 'To reduce cycle time by 15% without hardware changes, you should:',
    options: [
      'Remove safety systems',
      'Optimize paths, use blending, and enable concurrent I/O',
      'Increase robot payload beyond capacity',
      'Skip quality checks',
    ],
    correct: 1,
  },
  {
    question: 'In a safety-rated monitored stop, the robot:',
    options: [
      'Continues at reduced speed',
      'Stops all motion but remains powered with brakes engaged',
      'Powers off completely',
      'Reverses its last motion',
    ],
    correct: 1,
  },
  {
    question: 'A vision system misidentifies parts in the afternoon but works in the morning. The cause is likely:',
    options: ['Software bug', 'Changing ambient light conditions', 'Robot overheating', 'Network latency'],
    correct: 1,
  },
  {
    question: 'Forward kinematics calculates:',
    options: [
      'Joint angles from end-effector position',
      'End-effector position from joint angles',
      'Motor current from velocity',
      'Cycle time from path length',
    ],
    correct: 1,
  },
  {
    question: 'Which ISO standard specifically addresses industrial robot safety requirements?',
    options: ['ISO 9001', 'ISO 10218', 'ISO 14001', 'ISO 27001'],
    correct: 1,
  },
  {
    question: 'The DH (Denavit-Hartenberg) parameters are used for:',
    options: ['Safety zone calculation', 'Systematic kinematic modeling of robot links', 'Network configuration', 'Cycle time analysis'],
    correct: 1,
  },
];

export default function Capstone() {
  const navigate = useNavigate();
  const { completedModules, badges, preAssessmentScores, savePostAssessment } = useGameStore();
  const masterProgress = completedModules.length;
  const isUnlocked = masterProgress >= 10;

  const handleForceUnlock = () => {
    const allModuleIds = ['mod-1', 'mod-2', 'mod-3', 'mod-4', 'mod-5', 'mod-6', 'mod-7', 'mod-8', 'mod-9', 'mod-10'];
    const fullProgress = {};
    allModuleIds.forEach(id => {
      fullProgress[id] = [0, 1, 2, 3, 4, 5, 6];
    });
    
    useGameStore.setState({ 
      completedModules: allModuleIds,
      unlockedModules: allModuleIds,
      moduleProgress: fullProgress,
      badges: [
        'robotics-explorer', 'component-architect', 'sensor-specialist',
        'actuator-master', 'kinematics-solver', 'robot-programmer',
        'control-engineer', 'application-expert', 'automation-architect',
        'capstone-champion'
      ]
    });
  };

  const [assessmentMode, setAssessmentMode] = useState(false);
  const [assessAnswers, setAssessAnswers] = useState({});
  const [assessSubmitted, setAssessSubmitted] = useState(false);
  const [tabSwitches, setTabSwitches] = useState(0);

  const assessScore = ASSESSMENT_QUESTIONS.reduce((acc, q, i) => {
    return acc + (assessAnswers[i] === q.correct ? 1 : 0);
  }, 0);

  const assessPercentage = Math.round((assessScore / ASSESSMENT_QUESTIONS.length) * 100);

  // Assessment content (wrapped in FullscreenProctor)
  if (assessmentMode && !assessSubmitted) {
    return (
      <FullscreenProctor onTabSwitch={(count) => setTabSwitches(count)}>
        <div className="capstone-page capstone-assessment">
          <h2>Final Assessment</h2>
          <p className="capstone-assess-desc">
            Answer all {ASSESSMENT_QUESTIONS.length} questions. Tab switches are recorded.
          </p>

          <div className="capstone-assess-questions">
            {ASSESSMENT_QUESTIONS.map((q, qi) => (
              <GlassCard key={qi} className="capstone-assess-q" glow={assessAnswers[qi] !== undefined ? 'blue' : undefined}>
                <p className="assess-q-text">{qi + 1}. {q.question}</p>
                <div className="assess-q-options">
                  {q.options.map((opt, oi) => (
                    <button
                      key={oi}
                      className={`assess-q-opt ${assessAnswers[qi] === oi ? 'selected' : ''}`}
                      onClick={() => setAssessAnswers(prev => ({ ...prev, [qi]: oi }))}
                    >
                      <span className="assess-q-letter">{String.fromCharCode(65 + oi)}</span>
                      {opt}
                    </button>
                  ))}
                </div>
              </GlassCard>
            ))}
          </div>

          <div className="capstone-assess-footer">
            {tabSwitches > 0 && (
              <div className="capstone-tab-warning">
                <AlertTriangle size={14} />
                {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''} recorded
              </div>
            )}
            <Button
              variant="primary"
              size="lg"
              glow
              onClick={() => {
                setAssessSubmitted(true);
                // Save post-assessment scores
                savePostAssessment({
                  score: Object.entries(assessAnswers).reduce((acc, [qi, ai]) => {
                    return acc + (ASSESSMENT_QUESTIONS[qi]?.correct === ai ? 1 : 0);
                  }, 0),
                  total: ASSESSMENT_QUESTIONS.length,
                  tabSwitches,
                  timestamp: Date.now(),
                });
                if (document.fullscreenElement) {
                  document.exitFullscreen().catch(() => {});
                }
              }}
              disabled={Object.keys(assessAnswers).length < ASSESSMENT_QUESTIONS.length}
            >
              Submit Assessment ({Object.keys(assessAnswers).length}/{ASSESSMENT_QUESTIONS.length} answered)
            </Button>
          </div>
        </div>
      </FullscreenProctor>
    );
  }

  // Assessment result
  if (assessSubmitted) {
    return (
      <div className="capstone-page capstone-result">
        <motion.div
          className="capstone-result-card"
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
        >
          <h2>Assessment Complete!</h2>
          <div className="capstone-score">
            <span className="capstone-score-num">{assessScore}</span>
            <span className="capstone-score-total">/ {ASSESSMENT_QUESTIONS.length}</span>
          </div>
          <div className="capstone-score-percent">{assessPercentage}%</div>
          <p>{assessPercentage >= 70 ? '🎉 Congratulations! You passed!' : '📚 Keep studying and try again.'}</p>
          {tabSwitches > 0 && (
            <p className="capstone-result-tabs">
              <AlertTriangle size={14} /> {tabSwitches} tab switch{tabSwitches > 1 ? 'es' : ''} recorded during assessment
            </p>
          )}
          <div className="capstone-result-actions">
            <Button variant="primary" onClick={() => navigate('/dashboard')}>Back to Dashboard</Button>
            <Button variant="secondary" onClick={() => { setAssessmentMode(false); setAssessSubmitted(false); setAssessAnswers({}); setTabSwitches(0); }}>
              Retake Assessment
            </Button>
          </div>
        </motion.div>

        {/* Pre vs Post Assessment Comparison */}
        {preAssessmentScores && (
          <motion.div
            className="capstone-comparison"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
          >
            <div className="capstone-compare-header">
              <BarChart3 size={18} />
              <h3>Your Growth Journey</h3>
            </div>

            <div className="capstone-compare-bars">
              {/* Pre-assessment */}
              <div className="capstone-compare-row">
                <span className="capstone-compare-label">Pre-Assessment</span>
                <div className="capstone-compare-bar">
                  <motion.div
                    className="capstone-compare-fill pre"
                    initial={{ width: 0 }}
                    animate={{ width: `${Math.round((preAssessmentScores.score / preAssessmentScores.total) * 100)}%` }}
                    transition={{ duration: 1, delay: 0.5 }}
                  />
                </div>
                <span className="capstone-compare-score">{preAssessmentScores.score}/{preAssessmentScores.total}</span>
              </div>

              {/* Post-assessment */}
              <div className="capstone-compare-row">
                <span className="capstone-compare-label">Final Assessment</span>
                <div className="capstone-compare-bar">
                  <motion.div
                    className="capstone-compare-fill post"
                    initial={{ width: 0 }}
                    animate={{ width: `${assessPercentage}%` }}
                    transition={{ duration: 1, delay: 0.8 }}
                  />
                </div>
                <span className="capstone-compare-score">{assessScore}/{ASSESSMENT_QUESTIONS.length}</span>
              </div>
            </div>

            {/* Improvement indicator */}
            {(() => {
              const prePercent = Math.round((preAssessmentScores.score / preAssessmentScores.total) * 100);
              const improvement = assessPercentage - prePercent;
              return improvement > 0 ? (
                <div className="capstone-improvement">
                  <TrendingUp size={16} />
                  <span>+{improvement}% improvement — Great progress! 🎉</span>
                </div>
              ) : improvement === 0 ? (
                <div className="capstone-improvement neutral">
                  <span>Same score — consider reviewing tricky topics</span>
                </div>
              ) : null;
            })()}
          </motion.div>
        )}
      </div>
    );
  }

  return (
    <div className="capstone-page">
      <button className="capstone-back" onClick={() => navigate('/dashboard')}>
        <ChevronLeft size={20} />
        <span>Dashboard</span>
      </button>

      <motion.div
        className="capstone-hero"
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="capstone-hero-badge">👑 CAPSTONE PROJECT</div>
        <h1>Design an Industrial <span className="glow-text">Robotic Work Cell</span></h1>
        <p>Demonstrate your skills by designing a complete pick-and-place robotic cell from concept to deployment-ready documentation.</p>
        
        <div style={{ display: 'flex', justifyContent: 'center', marginTop: '16px', marginBottom: '16px' }}>
          <Button variant="secondary" size="sm" onClick={handleForceUnlock}>
            🔓 Dev Backdoor: Force Unlock Capstone
          </Button>
        </div>

        {!isUnlocked && (
          <div className="capstone-lock-msg">
            <span>🔒 Complete all 10 modules to unlock the Capstone Project</span>
            <ProgressBar value={masterProgress} max={10} gradient="var(--gradient-master)" height={6} label={`${masterProgress}/10 modules complete`} showValue={false} />
          </div>
        )}
      </motion.div>

      <div className="capstone-sections">
        {isUnlocked ? (
          <div>
            <h2>Interactive Phase Challenge</h2>
            <p className="capstone-section-desc">Design your workcell and prove your robotics mastery to access the final assessment.</p>
            <InteractiveCapstoneWizard onComplete={() => setAssessmentMode(true)} />
          </div>
        ) : (
          <div>
            <h2>Deliverables</h2>
            <p className="capstone-section-desc">Your capstone must demonstrate mastery of all these areas:</p>
            <div className="capstone-deliverables">
              {DELIVERABLES.map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.08 }}
                >
                  <GlassCard className="capstone-deliverable">
                    <div className="capstone-del-icon" style={{ color: 'var(--accent-cyan)' }}>{item.icon}</div>
                    <div>
                      <h4>{item.title}</h4>
                      <p>{item.desc}</p>
                    </div>
                  </GlassCard>
                </motion.div>
              ))}
            </div>
          </div>
        )}

        <div>
          <h2>Expected Outputs</h2>
          <div className="capstone-outputs">
            {OUTPUTS.map((item, i) => (
              <GlassCard key={i} className="capstone-output" glow="purple">
                <div className="capstone-out-icon">{item.icon}</div>
                <h4>{item.title}</h4>
                <p>{item.desc}</p>
              </GlassCard>
            ))}
          </div>
        </div>

        {isUnlocked && (
          <div>
            <h2>Submit Your Project</h2>
            <GlassCard className="capstone-submit-area" glow="green">
              <p>Upload your simulation files, documentation, and explanation video.</p>
              <div className="capstone-upload-zones">
                <div className="upload-zone">
                  <Cpu size={24} />
                  <span>Simulation File</span>
                </div>
                <div className="upload-zone">
                  <FileText size={24} />
                  <span>Documentation</span>
                </div>
                <div className="upload-zone">
                  <Video size={24} />
                  <span>Video</span>
                </div>
              </div>
              <Button variant="primary" size="lg" glow disabled>
                Submit for Review (Coming Soon)
              </Button>
            </GlassCard>
          </div>
        )}
      </div>
    </div>
  );
}
