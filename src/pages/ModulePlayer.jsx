import { useState, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  ChevronLeft, ChevronRight, Lightbulb, BookOpen, Target, Brain,
  Award, Star, Check, X, Volume2, Play, Eye, EyeOff, Zap, Gift,
  Sparkles, RotateCcw, ThumbsUp, ThumbsDown, ArrowRight, Lock, MessageCircle
} from 'lucide-react';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import ProgressBar from '../components/ui/ProgressBar';
import Badge from '../components/ui/Badge';
import RobotViewer from '../components/3d/RobotViewer';
import RobotEmbed from '../components/3d/RobotEmbed';
import LabeledRobotModel from '../components/3d/LabeledRobotModel';
import SpinWheel from '../components/ui/SpinWheel';
import VictoryScreen from '../components/ui/VictoryScreen';
import ConfidenceMeter from '../components/ui/ConfidenceMeter';
import MasteryQuiz from '../components/ui/MasteryQuiz';
import useGameStore from '../store/gameStore';
import { getModuleById, PHASES, BADGES, QUIZ_QUESTIONS, SPIN_WHEEL_CONTENT, MASTERY_QUESTIONS, PRACTICAL_EXAMPLES, VISUAL_ID_EXERCISES, TROUBLESHOOTING_SCENARIOS, ROLE_SCENARIOS } from '../data/courseData';
import TroubleshootingGame from '../components/ui/TroubleshootingGame';
import VisualIdentification from '../components/ui/VisualIdentification';
import RoleScenario from '../components/ui/RoleScenario';
import CourseContentSidebar from '../components/layout/CourseContentSidebar';
import AIAssistant from '../components/ui/AIAssistant';
import './ModulePlayer.css';

const STEPS = ['hook', 'learn', 'practice', 'challenge', 'realworld', 'reflect', 'upgrade'];
const STEP_LABELS = {
  hook: 'Hook', learn: 'Micro Learning', practice: 'Guided Practice',
  challenge: 'Challenge Task', realworld: 'Real-World Case',
  reflect: 'Reflection', upgrade: 'Upgrade',
};
const STEP_ICONS = {
  hook: <Lightbulb size={16} />, learn: <BookOpen size={16} />,
  practice: <Target size={16} />, challenge: <Brain size={16} />,
  realworld: <Star size={16} />, reflect: <Brain size={16} />,
  upgrade: <Award size={16} />,
};

// Rich content paragraphs for each topic
const TOPIC_CONTENT = {
  'Industry 4.0': {
    paragraphs: [
      'Industry 4.0 represents the fourth industrial revolution — a fusion of digital technology, AI, IoT, and robotics that\'s transforming manufacturing forever.',
      'Smart factories use interconnected machines that share data in real-time, enabling autonomous decision-making and self-optimizing production lines.',
      'Key technologies include: cyber-physical systems, cloud computing, edge computing, digital twins, and of course — industrial robotics at the core.',
    ],
    funFact: '💡 By 2030, Industry 4.0 technologies are expected to add $3.7 trillion to the global economy.',
    emoji: '🏭',
  },
  'Robot applications': {
    paragraphs: [
      'Industrial robots are used in nearly every manufacturing sector — from welding car bodies to packaging pharmaceuticals.',
      'Top applications include: spot/arc welding, material handling, painting, assembly, palletizing, machine tending, and quality inspection.',
      'Modern robots can handle payloads from 0.5 kg to over 2,300 kg, with repeatability as precise as ±0.02 mm.',
    ],
    funFact: '🤖 Over 3.9 million industrial robots are in operation worldwide as of 2024.',
    emoji: '⚙️',
  },
  'Market trends': {
    paragraphs: [
      'The global industrial robotics market is growing at 12% CAGR, driven by labor shortages and automation demands.',
      'Collaborative robots (cobots) are the fastest-growing segment, making automation accessible to small businesses.',
      'Asia-Pacific leads with 73% of all new robot installations, with China alone installing more robots than the rest of the world combined.',
    ],
    funFact: '📈 The average payback period for an industrial robot is now under 2 years.',
    emoji: '📊',
  },
  'Career paths': {
    paragraphs: [
      'Robotics engineers are among the most in-demand professionals, with salaries 30-50% above average engineering roles.',
      'Career paths include: Robot Programmer, Integration Engineer, Automation Consultant, Cell Designer, and Robotics R&D.',
      'Certifications from manufacturers like FANUC, ABB, KUKA, and Yaskawa significantly boost employability.',
    ],
    funFact: '💼 The robotics talent gap is projected to reach 2.4 million unfilled positions by 2028.',
    emoji: '🚀',
  },
};

const getTopicContent = (topic) => {
  if (TOPIC_CONTENT[topic]) return TOPIC_CONTENT[topic];
  return {
    paragraphs: [
      `${topic} is a core concept in industrial robotics that every practitioner must understand deeply.`,
      `This topic covers the fundamental principles, real-world applications, and best practices that professionals use daily in manufacturing environments.`,
      `Mastering ${topic.toLowerCase()} will give you a significant advantage in designing, programming, and troubleshooting industrial robot systems.`,
    ],
    funFact: `💡 Understanding ${topic.toLowerCase()} can reduce robot programming time by up to 40%.`,
    emoji: '🔧',
  };
};

// Tap-to-reveal accordion card for hook intro sections
function HookRevealCard({ title, phaseColor, defaultOpen = false, children, style }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <div className="hook-reveal-card" style={style}>
      <button
        className="hook-reveal-header"
        onClick={() => setOpen(o => !o)}
        style={{ borderLeft: `3px solid ${phaseColor}` }}
      >
        <span>{title}</span>
        <span style={{ fontSize: '1.1rem', transform: open ? 'rotate(90deg)' : 'rotate(0deg)', transition: 'transform 0.25s', display: 'inline-block' }}>›</span>
      </button>
      <AnimatePresence initial={false}>
        {open && (
          <motion.div
            className="hook-reveal-body"
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.28, ease: 'easeInOut' }}
            style={{ overflow: 'hidden' }}
          >
            <div style={{ padding: '14px 16px 10px' }}>{children}</div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default function ModulePlayer() {
  const { moduleId } = useParams();
  const navigate = useNavigate();
  const module = getModuleById(moduleId);
  const { currentStep, setCurrentStep, completeModule, addXP, earnBadge, setConfidence, saveMasteryResult, saveQuizResult, completedModules, markModuleStep } = useGameStore();
  const [quizAnswers, setQuizAnswers] = useState({});
  const [quizSubmitted, setQuizSubmitted] = useState(false);
  const [currentQuizQuestion, setCurrentQuizQuestion] = useState(0);
  const [selectedJoint, setSelectedJoint] = useState(null);
  const [confidence, setConfidenceLocal] = useState(3);
  const [reflection, setReflection] = useState('');
  const [challengeLevel, setChallengeLevel] = useState(1);
  const [badgeAwarded, setBadgeAwarded] = useState(false);
  const [showSpinWheel, setShowSpinWheel] = useState(false);
  const [showVictory, setShowVictory] = useState(false);
  const [reflectPhase, setReflectPhase] = useState('rating'); // 'rating' | 'low-confidence' | 'mastery-quiz'
  const [showChatbot, setShowChatbot] = useState(false);

  // Sequential step unlock tracking — step 0 (hook) always unlocked
  const [completedSteps, setCompletedSteps] = useState(new Set());
  const highestUnlocked = completedSteps.size; // next index after all completed

  const markStepComplete = (stepIndex) => {
    setCompletedSteps(prev => {
      const next = new Set(prev);
      next.add(stepIndex);
      return next;
    });
    // Persist to store for phase ring calculations
    markModuleStep(moduleId, stepIndex);
  };

  // Gamified learning state
  const [revealedCards, setRevealedCards] = useState({});
  const [flippedCards, setFlippedCards] = useState({});
  const [cardXPClaimed, setCardXPClaimed] = useState({});
  const [reactions, setReactions] = useState({});
  const [showFunFact, setShowFunFact] = useState({});
  const [learnXP, setLearnXP] = useState(0);

  // AI narration state
  const [isNarrating, setIsNarrating] = useState(false);

  const isCompleted = completedModules.includes(moduleId);

  // Build narration text from module content
  const buildNarrationText = useCallback(() => {
    const parts = [];
    parts.push(`Welcome to ${module.title}. ${module.description}`);
    parts.push(module.hook);
    module.topics.forEach((topic) => {
      const content = getTopicContent(topic);
      parts.push(`${topic}. ${content.paragraphs.join(' ')}`);
    });
    return parts.join('. ');
  }, [module]);

  // Speak module content using Web Speech API
  const speakModuleContent = useCallback(() => {
    if (!('speechSynthesis' in window)) {
      alert('Speech synthesis is not supported in this browser.');
      return;
    }

    if (isNarrating) {
      speechSynthesis.cancel();
      setIsNarrating(false);
      return;
    }

    speechSynthesis.cancel();
    const text = buildNarrationText();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.95;
    utterance.pitch = 0.9;
    utterance.volume = 0.9;

    const trySpeak = () => {
      const voices = speechSynthesis.getVoices();
      const voice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
        || voices.find(v => v.lang.startsWith('en'))
        || voices[0];
      if (voice) utterance.voice = voice;
      utterance.onstart = () => setIsNarrating(true);
      utterance.onend = () => setIsNarrating(false);
      utterance.onerror = () => setIsNarrating(false);
      speechSynthesis.speak(utterance);
    };

    const voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      trySpeak();
    } else {
      speechSynthesis.addEventListener('voiceschanged', trySpeak, { once: true });
      setTimeout(() => { trySpeak(); }, 500);
    }
  }, [isNarrating, buildNarrationText]);

  // Cancel narration on unmount
  useEffect(() => {
    return () => {
      if ('speechSynthesis' in window) speechSynthesis.cancel();
    };
  }, []);

  if (!module) return <div className="module-player">Module not found</div>;

  const phase = PHASES[module.phase];
  const step = STEPS[currentStep];
  const progress = ((currentStep + 1) / STEPS.length) * 100;

  const nextStep = () => {
    // Mark current step as complete, then advance
    markStepComplete(currentStep);
    if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
  };
  const prevStep = () => {
    if (currentStep > 0) setCurrentStep(currentStep - 1);
  };

  const handleComplete = () => {
    completeModule(moduleId);
    addXP(module.xpReward);
    if (module.badge) earnBadge(module.badge);
    setConfidence(moduleId, confidence);
    setBadgeAwarded(true);
    setShowVictory(true);
  };

  // Listen for 3D Roadmap completion
  useEffect(() => {
    const handleMessage = (e) => {
      if (e.data?.type === 'ROADMAP_COMPLETE') {
        // Unlock reflection step when 3D roadmap finishes natively
        markStepComplete(currentStep);
        if (currentStep < STEPS.length - 1) setCurrentStep(currentStep + 1);
      }
    };
    window.addEventListener('message', handleMessage);
    return () => window.removeEventListener('message', handleMessage);
  }, [currentStep]);

  const isFinalCourse = moduleId === 'mod-10';

  const handleRevealCard = (index) => {
    setRevealedCards(prev => ({ ...prev, [index]: true }));
  };

  const handleFlipCard = (index) => {
    setFlippedCards(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const handleClaimCardXP = (index) => {
    if (!cardXPClaimed[index]) {
      setCardXPClaimed(prev => ({ ...prev, [index]: true }));
      const xp = 5 + index * 3;
      setLearnXP(prev => prev + xp);
    }
  };

  const handleReaction = (index, type) => {
    setReactions(prev => ({ ...prev, [index]: type }));
  };

  const toggleFunFact = (index) => {
    setShowFunFact(prev => ({ ...prev, [index]: !prev[index] }));
  };

  const quizData = QUIZ_QUESTIONS[moduleId] || [];

  // ── HOOK ──────────────────────────────────────
  const renderHook = () => (
    <div className="step-content hook-content">
      <div className="hook-scenario">
        <div className="hook-icon">💡</div>
        <blockquote>{module.hook}</blockquote>
      </div>
      <div className="hook-image" style={{ backgroundImage: `url(${phase.image})` }}>
        <div className="hook-image-overlay" />
      </div>
      <div className="hook-intro">
        {/* Tap-to-reveal card: What You Will Learn */}
        <HookRevealCard
          title="📚 In this module, you will learn about:"
          phaseColor={phase.color}
          defaultOpen={false}
        >
          {module.learningPath ? (
            <div className="hook-learning-path">
              {module.learningPath.map((section, si) => (
                <div key={si} className="hook-path-section" style={{ marginBottom: 14 }}>
                  <h4 style={{ color: phase.color, marginBottom: 6, fontSize: '0.82rem', textTransform: 'uppercase', letterSpacing: '0.5px' }}>
                    {section.phase}
                  </h4>
                  <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
                    {section.items.map((item, ii) => (
                      <motion.li
                        key={ii}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: ii * 0.04 }}
                        style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: '0.9rem' }}
                      >
                        <Check size={13} style={{ color: phase.color, marginTop: 4, flexShrink: 0 }} />
                        <span>{item}</span>
                      </motion.li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
          ) : (
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {module.topics.map((topic, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: '0.9rem' }}>
                  <Check size={13} style={{ color: phase.color, marginTop: 4, flexShrink: 0 }} />
                  <span>{topic}</span>
                </motion.li>
              ))}
            </ul>
          )}
        </HookRevealCard>

        {/* Tap-to-reveal card: Learning Outcomes */}
        {module.learningOutcomes && (
          <HookRevealCard
            title="🎯 Learning Outcomes"
            phaseColor={phase.color}
            defaultOpen={false}
            style={{ marginTop: 12 }}
          >
            <ul style={{ paddingLeft: 0, listStyle: 'none' }}>
              {module.learningOutcomes.items.map((item, i) => (
                <motion.li key={i} initial={{ opacity: 0, x: -10 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.06 }}
                  style={{ display: 'flex', gap: 10, marginBottom: 4, fontSize: '0.9rem' }}>
                  <Check size={13} style={{ color: phase.color, marginTop: 4, flexShrink: 0 }} />
                  <span>{item}</span>
                </motion.li>
              ))}
            </ul>
            {module.learningOutcomes.summary && (
              <div style={{ marginTop: 14, padding: '10px 14px', borderRadius: 8, background: `rgba(255,255,255,0.04)`, border: `1px solid ${phase.color}40`, fontSize: '0.85rem', color: 'var(--text-secondary)', fontStyle: 'italic' }}>
                <strong style={{ color: phase.color }}>Outcome: </strong>{module.learningOutcomes.summary}
              </div>
            )}
          </HookRevealCard>
        )}
      </div>

      {/* Interactive Robot Embed */}
      <div className="hook-robot-section">
        <h3>🤖 Explore a 3D Robot</h3>
        <p className="hook-robot-desc">Interact with this 3D industrial robot — drag to rotate, scroll to zoom!</p>
        <RobotEmbed compact />
      </div>

      <div className="hook-voice">
        <Button
          variant={isNarrating ? 'primary' : 'secondary'}
          size="sm"
          icon={<Volume2 size={14} />}
          onClick={speakModuleContent}
        >
          {isNarrating ? 'Stop Narration' : 'Listen to AI Narration'}
        </Button>
        <span className="hook-voice-label">{isNarrating ? '🔊 Speaking...' : 'Powered by Gemini AI'}</span>
      </div>
    </div>
  );

  // ── GAMIFIED MICRO LEARNING ──────────────────
  const renderLearn = () => {
    const totalCards = module.topics.length;
    const revealedCount = Object.keys(revealedCards).length;
    const allRevealed = revealedCount >= totalCards;

    return (
      <div className="step-content learn-content gamified-learn">
        {/* XP tracker */}
        <div className="learn-xp-tracker">
          <div className="learn-xp-left">
            <Sparkles size={18} className="learn-xp-icon" />
            <span className="learn-xp-amount">+{learnXP} XP earned</span>
          </div>
          <div className="learn-xp-right">
            <span className="learn-cards-progress">{revealedCount}/{totalCards} cards revealed</span>
            <ProgressBar
              value={revealedCount}
              max={totalCards}
              gradient={phase.gradient}
              height={4}
              showValue={false}
            />
          </div>
        </div>

        {/* Course Video + AI Narration */}
        <div className="learn-video-section">
          <div className="learn-video-header">
            <h3>🎬 Watch & Learn</h3>
            <div className="learn-narration-btn">
              <Button
                variant={isNarrating ? 'primary' : 'secondary'}
                size="sm"
                icon={<Volume2 size={14} />}
                onClick={speakModuleContent}
              >
                {isNarrating ? 'Stop AI Narration' : 'AI Narration'}
              </Button>
              <span className="learn-narration-label">{isNarrating ? '🔊 Speaking...' : 'Powered by Gemini AI'}</span>
            </div>
          </div>
          <div className="learn-video-embed">
            <iframe
              src={`https://www.youtube.com/embed/${(() => {
                const title = (module.title || '').toLowerCase();
                if (title.includes('component') || title.includes('joint')) return 'DFBfYYoiJyg';
                if (title.includes('safety')) return '0bMk3FVT_jE';
                if (title.includes('sensor')) return 'posBLKtKuXI';
                if (title.includes('kinematic')) return 'Im28YGPxGBI';
                if (title.includes('program')) return 'WFl2G0hOWOc';
                if (title.includes('plc') || title.includes('integration')) return 'E_QuKdTRxU4';
                if (title.includes('vision') || title.includes('ai')) return 'MIcQ5bsLfGE';
                if (title.includes('cobot') || title.includes('collaboration')) return 'E_QuKdTRxU4';
                return 'fn3KWM1kuAw';
              })()}?rel=0&modestbranding=1`}
              title={`${module.title} - Video Lesson`}
              allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
              allowFullScreen
            />
          </div>
        </div>

        {/* 3D Labeled Robot Model */}
        <div className="learn-3d-section">
          <h3>🤖 Explore the Robot</h3>
          <p className="learn-intro-text">Click on any part of the 3D robot to learn about it. Selected parts are highlighted in the list.</p>
          <LabeledRobotModel />
        </div>

        <h3>Core Concepts</h3>
        <p className="learn-intro-text">
          Reveal each knowledge card to explore the concepts. Flip cards for deeper insights, claim XP, and unlock the full picture! ✨
        </p>

        <div className="learn-cards-grid">
          {module.topics.map((topic, i) => {
            const isRevealed = revealedCards[i];
            const isFlipped = flippedCards[i];
            const xpClaimed = cardXPClaimed[i];
            const reaction = reactions[i];
            const funFactVisible = showFunFact[i];
            const content = getTopicContent(topic);
            const cardXP = 5 + i * 3;
            const isLocked = i > 0 && !revealedCards[i - 1];

            return (
              <motion.div
                key={i}
                className="learn-card-wrapper"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.12 }}
              >
                {!isRevealed ? (
                  // Unrevealed card
                  <motion.div
                    className={`learn-mystery-card ${isLocked ? 'locked' : ''}`}
                    whileHover={!isLocked ? { scale: 1.02, y: -4 } : {}}
                    onClick={!isLocked ? () => handleRevealCard(i) : undefined}
                  >
                    <div className="mystery-card-inner">
                      {isLocked ? (
                        <>
                          <Lock size={28} className="mystery-lock" />
                          <span className="mystery-text">Reveal previous card first</span>
                        </>
                      ) : (
                        <>
                          <motion.div
                            className="mystery-icon"
                            animate={{ rotate: [0, 10, -10, 0], scale: [1, 1.1, 1] }}
                            transition={{ duration: 2, repeat: Infinity }}
                          >
                            <Eye size={28} />
                          </motion.div>
                          <span className="mystery-number">{String(i + 1).padStart(2, '0')}</span>
                          <span className="mystery-text">Tap to reveal</span>
                          <div className="mystery-xp-preview">
                            <Zap size={12} /> +{cardXP} XP
                          </div>
                        </>
                      )}
                    </div>
                    <div className="mystery-shimmer" />
                  </motion.div>
                ) : (
                  // Revealed card — with flip mechanic
                  <div className={`learn-revealed-card ${isFlipped ? 'flipped' : ''}`}>
                    {/* Front face */}
                    <motion.div
                      className="learn-card-face learn-card-front"
                      initial={{ rotateY: 180 }}
                      animate={{ rotateY: isFlipped ? 180 : 0 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="lc-header">
                        <span className="lc-emoji">{content.emoji}</span>
                        <div className="lc-number" style={{ color: phase.color }}>
                          {String(i + 1).padStart(2, '0')}
                        </div>
                      </div>
                      <h4>{topic}</h4>
                      <div className="lc-paragraphs">
                        {content.paragraphs.map((p, pi) => (
                          <motion.p
                            key={pi}
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            transition={{ delay: pi * 0.3 }}
                          >
                            {p}
                          </motion.p>
                        ))}
                      </div>

                      {/* Fun fact toggle */}
                      <button className="lc-fun-fact-btn" onClick={() => toggleFunFact(i)}>
                        <Gift size={14} />
                        {funFactVisible ? 'Hide Fun Fact' : 'Show Fun Fact'}
                      </button>
                      <AnimatePresence>
                        {funFactVisible && (
                          <motion.div
                            className="lc-fun-fact"
                            initial={{ opacity: 0, height: 0 }}
                            animate={{ opacity: 1, height: 'auto' }}
                            exit={{ opacity: 0, height: 0 }}
                          >
                            {content.funFact}
                          </motion.div>
                        )}
                      </AnimatePresence>

                      {/* Card actions */}
                      <div className="lc-actions">
                        <button
                          className="lc-flip-btn"
                          onClick={() => handleFlipCard(i)}
                        >
                          <RotateCcw size={14} /> Flip for Details
                        </button>

                        <div className="lc-reactions">
                          <button
                            className={`lc-reaction ${reaction === 'got-it' ? 'active green' : ''}`}
                            onClick={() => handleReaction(i, 'got-it')}
                          >
                            <ThumbsUp size={14} />
                            <span>Got it!</span>
                          </button>
                          <button
                            className={`lc-reaction ${reaction === 'confused' ? 'active orange' : ''}`}
                            onClick={() => handleReaction(i, 'confused')}
                          >
                            <ThumbsDown size={14} />
                            <span>Confused</span>
                          </button>
                        </div>

                        {!xpClaimed ? (
                          <motion.button
                            className="lc-claim-xp"
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => handleClaimCardXP(i)}
                          >
                            <Zap size={14} /> Claim +{cardXP} XP
                          </motion.button>
                        ) : (
                          <div className="lc-xp-claimed">
                            <Check size={14} /> +{cardXP} XP Earned!
                          </div>
                        )}
                      </div>
                    </motion.div>

                    {/* Back face */}
                    <motion.div
                      className="learn-card-face learn-card-back"
                      initial={{ rotateY: 0 }}
                      animate={{ rotateY: isFlipped ? 0 : -180 }}
                      transition={{ duration: 0.5 }}
                    >
                      <div className="lcb-header">
                        <span>🧠 Deep Dive</span>
                        <button className="lcb-flip-back" onClick={() => handleFlipCard(i)}>
                          <RotateCcw size={14} /> Back
                        </button>
                      </div>
                      <h4>Key Takeaways: {topic}</h4>
                      <ul className="lcb-takeaways">
                        <li>This concept is fundamental for any robotics professional</li>
                        <li>Practical applications span across all major industries</li>
                        <li>Understanding this deeply will help in troubleshooting</li>
                        <li>This knowledge directly applies to the capstone project</li>
                      </ul>
                      <div className="lcb-quiz-teaser">
                        <Target size={16} />
                        <span>You'll be tested on this in the Practice step!</span>
                      </div>
                    </motion.div>
                  </div>
                )}
              </motion.div>
            );
          })}
        </div>

        {/* Completion banner */}
        <AnimatePresence>
          {allRevealed && (
            <motion.div
              className="learn-complete-banner"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <div className="lcb-content">
                <Sparkles size={24} className="lcb-sparkle" />
                <div>
                  <h4>All Cards Revealed! 🎉</h4>
                  <p>You've explored all concepts. Total XP earned from reading: <strong>+{learnXP}</strong></p>
                </div>
              </div>
              <Button variant="primary" size="sm" onClick={nextStep} icon={<ArrowRight size={14} />}>
                Continue to Practice
              </Button>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="learn-timer">
          <span>⏱️ Estimated time: 10-15 minutes · Interactive learning mode</span>
        </div>
      </div>
    );
  };

  // ── PRACTICE ──────────────────────────────────
  const renderPractice = () => (
    <div className="step-content practice-content">
      <h3>Guided Practice</h3>

      {/* Interactive 3D robot viewer */}
      <div>
        <h3 style={{ marginBottom: 8 }}>🤖 Explore the interactive robot model</h3>
        <p className="practice-desc">
          {moduleId === 'mod-3'
            ? 'Click on different parts of the 3D robot to identify its sensor locations.'
            : moduleId === 'mod-2'
            ? 'Explore the mechanical architecture. Click on parts to see how they connect.'
            : 'Click on joints and links to learn about each part.'}
        </p>
        <GlassCard className="practice-3d-area" glow="blue">
          <RobotViewer onJointClick={(name) => setSelectedJoint(name)} />
          <AnimatePresence>
            {selectedJoint && (
              <motion.div className="joint-info-popup" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                <strong>{selectedJoint}</strong>
                <p>This is the {selectedJoint} of the robot arm. It plays a critical role in the robot's range of motion and precision.</p>
                <Button variant="ghost" size="sm" onClick={() => setSelectedJoint(null)}>
                  <X size={14} /> Close
                </Button>
              </motion.div>
            )}
          </AnimatePresence>
        </GlassCard>
      </div>

      {/* Visual Identification Exercise (drag & drop) */}
      {VISUAL_ID_EXERCISES[moduleId] && (
        <div style={{ marginTop: 24 }}>
          <VisualIdentification exercise={VISUAL_ID_EXERCISES[moduleId]} />
        </div>
      )}

      {/* Robot Types Interactive Visualizer */}
      <div style={{ marginTop: 28 }}>
        <h3 style={{ marginBottom: 8 }}>🤖 Robot Types & Familiarization</h3>
        <p className="practice-desc">Explore 6 robot types with interactive joint controls — rotate, zoom, and adjust each axis in real time.</p>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a0a0a' }}>
          <iframe
            src={`${import.meta.env.BASE_URL}robot-types.html`}
            title="Robot Types & Familiarization"
            style={{ width: '100%', height: 550, border: 'none', display: 'block' }}
            allow="accelerometer; gyroscope; fullscreen"
            allowFullScreen
          />
        </div>
      </div>

      {/* MCQ Quiz */}
      <div style={{ marginTop: 32 }}>
        <h3 style={{ marginBottom: 16 }}>Test Your Knowledge</h3>
        {quizData.length > 0 ? (
          <div className="quiz-container">
            {!quizSubmitted ? (
              <GlassCard className="quiz-card" glow="blue">
                <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: 12, fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                  <span>Question {currentQuizQuestion + 1} of {quizData.length}</span>
                  <span>{Math.round(((currentQuizQuestion) / quizData.length) * 100)}% completed</span>
                </div>
                <ProgressBar value={((currentQuizQuestion) / quizData.length) * 100} height={4} showValue={false} gradient="linear-gradient(90deg, #0ea5e9, #8b5cf6)" />
                <div style={{ marginTop: 20 }}>
                  {quizData[currentQuizQuestion].image && (
                    <div className="quiz-image-wrap">
                      <img src={quizData[currentQuizQuestion].image} alt={quizData[currentQuizQuestion].imageCaption || 'Quiz reference image'} className="quiz-image" />
                      {quizData[currentQuizQuestion].imageCaption && <span className="quiz-image-caption">{quizData[currentQuizQuestion].imageCaption}</span>}
                    </div>
                  )}
                  <p className="quiz-question" style={{ fontSize: '1.1rem', fontWeight: 600, marginTop: 16 }}>
                    {currentQuizQuestion + 1}. {quizData[currentQuizQuestion].question}
                  </p>
                  <div className="quiz-options" style={{ marginTop: 20 }}>
                    {quizData[currentQuizQuestion].options.map((opt, oi) => {
                      const isSelected = quizAnswers[currentQuizQuestion] === oi;
                      const hasAnswered = quizAnswers[currentQuizQuestion] !== undefined;
                      const isCorrect = oi === quizData[currentQuizQuestion].correct;
                      let btnClass = 'quiz-option';
                      if (hasAnswered) {
                        if (isCorrect) btnClass += ' correct';
                        else if (isSelected) btnClass += ' wrong';
                        else btnClass += ' disabled';
                      }
                      return (
                        <button key={oi} className={btnClass}
                          onClick={() => { if (!hasAnswered) setQuizAnswers({ ...quizAnswers, [currentQuizQuestion]: oi }); }}
                          disabled={hasAnswered}>
                          <span className="quiz-opt-letter">{String.fromCharCode(65 + oi)}</span>
                          {opt}
                        </button>
                      );
                    })}
                  </div>
                  <AnimatePresence>
                    {quizAnswers[currentQuizQuestion] !== undefined && (
                      <motion.div
                        initial={{ opacity: 0, height: 0, y: 10 }}
                        animate={{ opacity: 1, height: 'auto', y: 0 }}
                        className="quiz-feedback-area"
                        style={{ marginTop: 20, padding: 16, borderRadius: 8, background: quizAnswers[currentQuizQuestion] === quizData[currentQuizQuestion].correct ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)', border: `1px solid ${quizAnswers[currentQuizQuestion] === quizData[currentQuizQuestion].correct ? 'rgba(34, 197, 94, 0.3)' : 'rgba(239, 68, 68, 0.3)'}` }}
                      >
                        <h4 style={{ color: quizAnswers[currentQuizQuestion] === quizData[currentQuizQuestion].correct ? 'var(--accent-green)' : 'var(--accent-orange)', display: 'flex', alignItems: 'center', gap: 8, marginBottom: 8 }}>
                          {quizAnswers[currentQuizQuestion] === quizData[currentQuizQuestion].correct ? <Check size={16} /> : <X size={16} />}
                          {quizAnswers[currentQuizQuestion] === quizData[currentQuizQuestion].correct ? 'Correct!' : 'Incorrect'}
                        </h4>
                        <p style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{quizData[currentQuizQuestion].explanation}</p>
                        <div style={{ marginTop: 16, display: 'flex', justifyContent: 'flex-end' }}>
                          {currentQuizQuestion < quizData.length - 1 ? (
                            <Button variant="primary" onClick={() => setCurrentQuizQuestion(prev => prev + 1)}>Next Question <ArrowRight size={16} /></Button>
                          ) : (
                            <Button variant="primary" onClick={() => setQuizSubmitted(true)}>See Final Score <ArrowRight size={16} /></Button>
                          )}
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              </GlassCard>
            ) : (
              <GlassCard className="quiz-result-card" glow="green" style={{ textAlign: 'center', padding: '40px 20px' }}>
                <div style={{ display: 'inline-flex', alignItems: 'center', justifyContent: 'center', width: 64, height: 64, borderRadius: '50%', background: 'rgba(34, 197, 94, 0.1)', color: 'var(--accent-green)', marginBottom: 16 }}>
                  <Award size={32} />
                </div>
                <h3 style={{ fontSize: '1.5rem', marginBottom: 8 }}>Quiz Completed!</h3>
                <p style={{ fontSize: '1.1rem', color: 'var(--text-secondary)', marginBottom: 24 }}>
                  You scored <strong>{quizData.filter((q, i) => quizAnswers[i] === q.correct).length}</strong> out of {quizData.length}
                </p>
                <div style={{ display: 'flex', gap: 12, justifyContent: 'center' }}>
                  <Button variant="outline" onClick={() => { setQuizSubmitted(false); setQuizAnswers({}); setCurrentQuizQuestion(0); }}>
                    <RotateCcw size={16} /> Retry Quiz
                  </Button>
                </div>
              </GlassCard>
            )}
          </div>
        ) : (
          <GlassCard className="practice-placeholder" glow="blue">
            <p>🔧 Interactive practice activity for this module is coming soon!</p>
            <p className="practice-hint">For now, consider the concepts from the learning section and think about how you'd apply them.</p>
          </GlassCard>
        )}
      </div>
    </div>
  );

  // ── CHALLENGE ─────────────────────────────────
  const renderChallenge = () => (
    <div className="step-content challenge-content">
      <h3>Challenge Task</h3>
      <GlassCard className="challenge-task" glow="blue" style={{ marginBottom: 24 }}>
        <h4>🧩 Robotic Workcell component identification</h4>
        <p style={{ marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Identify the components in the robotic workcell by dragging and snapping the labels to the correct parts on the 3D model.
        </p>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a0f1a' }}>
          <iframe
            src={`${import.meta.env.BASE_URL}Robot_Component_Match_3D.html`}
            title="Interactive Component Match"
            style={{ width: '100%', height: 600, border: 'none', borderRadius: 8 }}
            allow="accelerometer; gyroscope; fullscreen"
            allowFullScreen
          />
        </div>
      </GlassCard>

      {/* 3D Interactive Challenge Quiz */}
      <GlassCard className="challenge-task" glow="purple">
        <h4>🤖 3D Interactive Robotics Challenge</h4>
        <p style={{ marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Complete hands-on challenges across 3 difficulty levels — identify robot parts, select grippers, and design robotic cell layouts in an interactive 3D environment.
        </p>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a0a0a', marginTop: 16 }}>
          <iframe src={`${import.meta.env.BASE_URL}robotics-challenge.html`} title="Robotics Challenge" style={{ width: '100%', height: 600, border: 'none' }} allow="accelerometer; gyroscope; fullscreen" allowFullScreen />
        </div>
      </GlassCard>

      {/* Troubleshooting Game */}
      {TROUBLESHOOTING_SCENARIOS.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <TroubleshootingGame scenario={TROUBLESHOOTING_SCENARIOS[Math.floor(Math.random() * TROUBLESHOOTING_SCENARIOS.length)]} />
        </div>
      )}

      {/* Match the Following – Robotics */}
      <GlassCard className="challenge-task" glow="cyan" style={{ marginTop: 24 }}>
        <h4>🔗 Match the Following – Robotics</h4>
        <p style={{ marginBottom: 12, fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
          Match each 3D robot model on the left with its correct name on the right. Click a model, then click the matching label to draw a connection line.
        </p>
        <div style={{ borderRadius: 12, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a0a0a', marginTop: 16 }}>
          <iframe src={`${import.meta.env.BASE_URL}match-the-following.html`} title="Match the Following" style={{ width: '100%', height: 700, border: 'none' }} allow="accelerometer; gyroscope; fullscreen" allowFullScreen />
        </div>
      </GlassCard>
    </div>
  );

  // ── REAL WORLD ────────────────────────────────
  const renderRealWorld = () => (
    <div className="step-content realworld-content">
      <h3>Real-World Case Study</h3>
      <p style={{ marginBottom: 16, fontSize: '0.9rem', color: 'var(--text-secondary)' }}>
        Apply what you've learned in an interactive Systems Integrator simulation. Guide the factory transition to automate the welding station.
      </p>
      
      <div style={{ borderRadius: 16, overflow: 'hidden', border: '1px solid var(--border-subtle)', background: '#0a0f1a', height: 'calc(100vh - 200px)', minHeight: 700 }}>
        <iframe 
          src={`${import.meta.env.BASE_URL}roadmap-3d-builder.html`}
          title="Interactive Roadmap"
          style={{ width: '100%', height: 'calc(100vh - 120px)', border: 'none', display: 'block' }}
          allow="accelerometer; gyroscope; fullscreen"
          allowFullScreen
        />
      </div>

    </div>
  );

  // ── REFLECT ───────────────────────────────────
  const handleConfidenceContinue = () => {
    if (confidence <= 2) {
      setReflectPhase('low-confidence');
    } else {
      setReflectPhase('mastery-quiz');
    }
  };

  const handleMasteryPass = () => {
    nextStep();
  };

  const handleMasteryFail = () => {
    setCurrentStep(0); // go back to hook
    setReflectPhase('rating');
  };

  const handleMasteryComplete = (result) => {
    // Save to both mastery results and quiz history for Recap panel
    saveMasteryResult(moduleId, { score: result.score, total: result.total, passed: result.passed });
    saveQuizResult({
      moduleId,
      type: 'mastery',
      score: result.score,
      total: result.total,
      passed: result.passed,
      answers: result.answers,
    });
  };

  const renderReflect = () => {
    const masteryQuestions = MASTERY_QUESTIONS[moduleId] || [];
    const practicalExamples = PRACTICAL_EXAMPLES[moduleId] || [];

    // Phase 1: Rating
    if (reflectPhase === 'rating') {
      return (
        <div className="step-content reflect-content">
          <h3>Reflection</h3>
          <GlassCard className="reflect-card" glow="purple">
            <p className="reflect-prompt">What part of <strong>{module.title}</strong> was most challenging or still feels confusing?</p>
            <textarea
              className="reflect-textarea"
              placeholder="Write your reflection here..."
              value={reflection}
              onChange={(e) => setReflection(e.target.value)}
              rows={4}
            />
          </GlassCard>
          <ConfidenceMeter
            value={confidence}
            onChange={(val) => setConfidenceLocal(val)}
            label={`How confident do you feel about ${module.title}?`}
          />
          <div style={{ display: 'flex', justifyContent: 'center', marginTop: '1rem' }}>
            <Button variant="primary" onClick={handleConfidenceContinue} icon={<ArrowRight size={14} />}>
              Continue
            </Button>
          </div>
        </div>
      );
    }

    // Phase 2a: Low confidence — retake suggestion + practical examples
    if (reflectPhase === 'low-confidence') {
      return (
        <div className="step-content reflect-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <GlassCard className="reflect-low-card" glow="orange">
              <div className="reflect-low-header">
                <span className="reflect-low-icon">📚</span>
                <h3>Let's Strengthen Your Understanding</h3>
              </div>
              <p className="reflect-low-msg">
                It looks like you're not fully confident with <strong>{module.title}</strong> yet — and that's completely okay!
                Here are some practical exercises to help solidify your understanding before moving on.
              </p>
              <div className="reflect-examples">
                <h4>🔧 Practical Exercises</h4>
                {practicalExamples.map((ex, i) => (
                  <div key={i} className="reflect-example-card">
                    <span className="reflect-example-num">{String(i + 1).padStart(2, '0')}</span>
                    <div>
                      <strong>{ex.title}</strong>
                      <p>{ex.description}</p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="reflect-low-actions">
                <Button variant="primary" onClick={() => { setCurrentStep(0); setReflectPhase('rating'); }} icon={<RotateCcw size={14} />}>
                  Retake Module
                </Button>
                <Button variant="ghost" onClick={() => setReflectPhase('mastery-quiz')}>
                  I want to try the Mastery Quiz anyway
                </Button>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      );
    }

    // Phase 2b: High confidence — mastery quiz
    if (reflectPhase === 'mastery-quiz') {
      return (
        <div className="step-content reflect-content">
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
            <div className="reflect-mastery-header">
              <h3>🏆 Mastery Challenge</h3>
              <p>Answer these questions within 10 seconds each to prove your mastery of <strong>{module.title}</strong>.</p>
            </div>
            <MasteryQuiz
              questions={masteryQuestions}
              moduleName={module.title}
              onPass={handleMasteryPass}
              onFail={handleMasteryFail}
              onComplete={handleMasteryComplete}
            />
          </motion.div>
        </div>
      );
    }

    return null;
  };

  // ── UPGRADE ───────────────────────────────────
  const renderUpgrade = () => {
    const badge = module.badge ? BADGES[module.badge] : null;
    return (
      <div className="step-content upgrade-content">
        {!badgeAwarded && !isCompleted ? (
          <div className="upgrade-ready">
            <h3>Ready to Complete!</h3>
            <p>You've worked through all steps of this module. Claim your reward!</p>
            <div className="upgrade-rewards">
              <GlassCard className="reward-card" glow="green">
                <span className="reward-value">+{module.xpReward}</span>
                <span className="reward-label">XP Points</span>
              </GlassCard>
              {badge && (
                <GlassCard className="reward-card" glow="purple">
                  <span className="reward-icon">{badge.icon}</span>
                  <span className="reward-label">{badge.name}</span>
                </GlassCard>
              )}
            </div>
            <Button variant="primary" size="lg" glow onClick={handleComplete} icon={<Award size={18} />}>
              Complete Module
            </Button>
          </div>
        ) : (
          <>
            <motion.div className="upgrade-complete" initial={{ scale: 0.5, opacity: 0 }} animate={{ scale: 1, opacity: 1 }} transition={{ type: 'spring', stiffness: 200 }}>
              <div className="upgrade-celebration">🎉</div>
              <h2>Module Complete!</h2>
              <p className="upgrade-msg">You've earned <strong>{module.xpReward} XP</strong></p>
              {badge && (
                <div className="upgrade-badge-area">
                  <Badge icon={badge.icon} name={badge.name} earned size="lg" description={badge.description} />
                </div>
              )}
              <div className="upgrade-actions">
                <Button variant="primary" onClick={() => navigate(`/phase/${module.phase}`)}>Back to Phase</Button>
                <Button variant="secondary" onClick={() => navigate('/dashboard')}>Dashboard</Button>
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="upgrade-spin-btn"
                onClick={() => setShowSpinWheel(true)}
                icon={<Gift size={16} />}
              >
                🎡 Spin the Wheel for Bonus Content!
              </Button>
              <AnimatePresence>
                {showSpinWheel && (
                  <SpinWheel
                    segments={SPIN_WHEEL_CONTENT[moduleId] || SPIN_WHEEL_CONTENT.default}
                    moduleId={moduleId}
                    onClose={() => setShowSpinWheel(false)}
                  />
                )}
              </AnimatePresence>
            </motion.div>
            <AnimatePresence>
              {showVictory && (
                <VictoryScreen
                  xpEarned={module.xpReward}
                  badgeName={module.badge ? BADGES[module.badge]?.name : null}
                  badgeIcon={module.badge ? BADGES[module.badge]?.icon : null}
                  isFinalCourse={isFinalCourse}
                  onClose={() => setShowVictory(false)}
                />
              )}
            </AnimatePresence>
          </>
        )}
      </div>
    );
  };

  const renderStep = () => {
    switch (step) {
      case 'hook': return renderHook();
      case 'learn': return renderLearn();
      case 'practice': return renderPractice();
      case 'challenge': return renderChallenge();
      case 'realworld': return renderRealWorld();
      case 'reflect': return renderReflect();
      case 'upgrade': return renderUpgrade();
      default: return null;
    }
  };

  return (
    <div className="module-player">
      {/* Header */}
      <div className="mp-header">
        <div className="mp-header-left">
          <button className="mp-back" onClick={() => navigate(`/phase/${module.phase}`)}>
            <ChevronLeft size={18} />
          </button>
          <div>
            <span className="mp-phase-tag" style={{ color: phase.color }}>{phase.name}</span>
            <h2>{module.title}</h2>
          </div>
        </div>
        <div className="mp-header-right">
          <span className="mp-xp-badge">+{module.xpReward} XP</span>
        </div>
      </div>


      {/* Step navigation moved to Course Content sidebar */}

      {/* Content + Sidebar layout */}
      <div className="mp-content-layout">
        {/* Main Content */}
        <div className="mp-content">
          <AnimatePresence mode="wait">
            <motion.div key={step} initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -20 }} transition={{ duration: 0.3 }}>
              {renderStep()}
            </motion.div>
          </AnimatePresence>
        </div>

        {/* Course Content Sidebar */}
        <CourseContentSidebar currentModuleId={moduleId} currentStep={currentStep} completedSteps={completedSteps} onStepChange={(step) => {
          if (step <= highestUnlocked) setCurrentStep(step);
        }} />
      </div>

      {/* Floating Chatbot FAB */}
      {showChatbot && (
        <motion.div
          className="mp-chat-overlay"
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.9 }}
        >
          <AIAssistant playerName={module?.title || 'Cadet'} />
          <button className="mp-chat-close" onClick={() => setShowChatbot(false)}><X size={16} /></button>
        </motion.div>
      )}
      <motion.div
        className="mp-chatbot-fab-wrap"
        drag
        dragMomentum={false}
      >
        <button
          className="mp-chatbot-fab"
          onClick={() => setShowChatbot(!showChatbot)}
          title="Chat with Nebula"
        >
          <MessageCircle size={22} />
        </button>
      </motion.div>

      {/* Navigation */}
      <div className="mp-nav">
        <Button variant="secondary" size="sm" onClick={prevStep} disabled={currentStep === 0} icon={<ChevronLeft size={14} />}>
          Previous
        </Button>
        <span className="mp-nav-step">{currentStep + 1} / {STEPS.length}</span>
        {currentStep < STEPS.length - 1 && (
          <Button variant="primary" size="sm" onClick={nextStep} icon={<ChevronRight size={14} />}>
            Next Step
          </Button>
        )}
      </div>
    </div>
  );
}
