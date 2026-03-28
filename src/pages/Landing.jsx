import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Rocket, Zap, Layers, Crown, Timer, BookOpen, Award, Play, ArrowRight } from 'lucide-react';
import HeroScene from '../components/3d/HeroScene';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';
import useGameStore from '../store/gameStore';
import './Landing.css';

// Robot SVG for welcome animation
function WelcomeRobot({ speaking }) {
  return (
    <svg viewBox="0 0 300 400" className="welcome-robot-svg" xmlns="http://www.w3.org/2000/svg">
      {/* Antenna */}
      <motion.circle
        cx="150" cy="28" r="8"
        fill="var(--accent-cyan)"
        animate={speaking ? { scale: [1, 1.4, 1], opacity: [1, 0.5, 1] } : {}}
        transition={{ duration: 0.6, repeat: Infinity }}
        filter="url(#glow)"
      />
      <line x1="150" y1="36" x2="150" y2="70" stroke="var(--accent-blue)" strokeWidth="4" strokeLinecap="round" />

      {/* Head */}
      <rect x="80" y="70" width="140" height="110" rx="24" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-blue)" strokeWidth="3" />

      {/* Eyes */}
      <motion.circle
        cx="120" cy="120" r="16"
        fill="var(--accent-cyan)"
        animate={speaking ? { scaleY: [1, 0.2, 1] } : { scaleY: [1, 0.1, 1] }}
        transition={{ duration: speaking ? 0.3 : 3, repeat: Infinity, repeatDelay: speaking ? 0.8 : 2 }}
        style={{ transformOrigin: '120px 120px' }}
        filter="url(#glow)"
      />
      <motion.circle
        cx="180" cy="120" r="16"
        fill="var(--accent-cyan)"
        animate={speaking ? { scaleY: [1, 0.2, 1] } : { scaleY: [1, 0.1, 1] }}
        transition={{ duration: speaking ? 0.3 : 3, repeat: Infinity, repeatDelay: speaking ? 0.8 : 2 }}
        style={{ transformOrigin: '180px 120px' }}
        filter="url(#glow)"
      />

      {/* Mouth */}
      <motion.rect
        x="115" y="152" width="70" height="8" rx="4"
        fill="var(--accent-purple)"
        animate={speaking
          ? { height: [8, 20, 8, 16, 8], y: [152, 146, 152, 148, 152] }
          : {}
        }
        transition={{ duration: 0.4, repeat: Infinity }}
      />

      {/* Neck */}
      <rect x="135" y="180" width="30" height="20" rx="4" fill="var(--accent-blue)" opacity="0.5" />

      {/* Body */}
      <rect x="65" y="200" width="170" height="130" rx="20" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-purple)" strokeWidth="3" />

      {/* Chest light */}
      <motion.circle
        cx="150" cy="250" r="18"
        fill="none"
        stroke="var(--accent-cyan)"
        strokeWidth="3"
        animate={{ opacity: [0.4, 1, 0.4], scale: [0.9, 1.1, 0.9] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '150px 250px' }}
        filter="url(#glow)"
      />
      <motion.circle
        cx="150" cy="250" r="8"
        fill="var(--accent-cyan)"
        animate={speaking ? { opacity: [0.6, 1, 0.6] } : { opacity: 0.6 }}
        transition={{ duration: 0.5, repeat: Infinity }}
        filter="url(#glow)"
      />

      {/* Arms */}
      <motion.rect
        x="20" y="215" width="35" height="80" rx="14"
        fill="var(--bg-secondary, #0f0f2e)"
        stroke="var(--accent-blue)"
        strokeWidth="2"
        animate={speaking ? { rotate: [0, -8, 0, 8, 0] } : { rotate: 0 }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '37px 215px' }}
      />
      <motion.rect
        x="245" y="215" width="35" height="80" rx="14"
        fill="var(--bg-secondary, #0f0f2e)"
        stroke="var(--accent-blue)"
        strokeWidth="2"
        animate={speaking ? { rotate: [0, 8, 0, -8, 0] } : { rotate: 0 }}
        transition={{ duration: 1.2, repeat: Infinity }}
        style={{ transformOrigin: '263px 215px' }}
      />

      {/* Hands */}
      <circle cx="37" cy="305" r="12" fill="var(--accent-blue)" opacity="0.6" />
      <circle cx="263" cy="305" r="12" fill="var(--accent-blue)" opacity="0.6" />

      {/* Legs */}
      <rect x="100" y="330" width="30" height="50" rx="10" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-purple)" strokeWidth="2" />
      <rect x="170" y="330" width="30" height="50" rx="10" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-purple)" strokeWidth="2" />

      {/* Feet */}
      <rect x="90" y="375" width="50" height="16" rx="8" fill="var(--accent-blue)" opacity="0.5" />
      <rect x="160" y="375" width="50" height="16" rx="8" fill="var(--accent-blue)" opacity="0.5" />

      {/* Glow filter */}
      <defs>
        <filter id="glow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feMerge>
            <feMergeNode in="blur" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function getVoices() {
  return new Promise((resolve) => {
    let voices = speechSynthesis.getVoices();
    if (voices.length > 0) {
      resolve(voices);
      return;
    }
    // Chrome loads voices asynchronously
    const handler = () => {
      voices = speechSynthesis.getVoices();
      resolve(voices);
      speechSynthesis.removeEventListener('voiceschanged', handler);
    };
    speechSynthesis.addEventListener('voiceschanged', handler);
    // Fallback timeout
    setTimeout(() => resolve(speechSynthesis.getVoices()), 1500);
  });
}

function speakText(text) {
  return new Promise(async (resolve) => {
    if (!('speechSynthesis' in window)) {
      setTimeout(resolve, 2000);
      return;
    }

    // Cancel any ongoing speech
    speechSynthesis.cancel();

    const voices = await getVoices();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.rate = 0.9;
    utterance.pitch = 0.85;
    utterance.volume = 1;

    // Pick best available voice
    const preferred = voices.find(v =>
      v.name.includes('Microsoft Zira') || v.name.includes('Google US') ||
      v.name.includes('Microsoft David') || v.name.includes('Samantha') ||
      v.name.includes('Google UK')
    ) || voices.find(v => v.lang.startsWith('en')) || voices[0];

    if (preferred) utterance.voice = preferred;

    utterance.onend = resolve;
    utterance.onerror = () => resolve();

    // Safety timeout - resolve if speech takes too long
    const timeout = setTimeout(() => {
      speechSynthesis.cancel();
      resolve();
    }, 8000);

    utterance.onend = () => { clearTimeout(timeout); resolve(); };

    speechSynthesis.speak(utterance);
  });
}

export default function Landing() {
  const navigate = useNavigate();
  const [nameInput, setNameInput] = useState('');
  const [showNameInput, setShowNameInput] = useState(false);
  const [showWelcome, setShowWelcome] = useState(false);
  const [robotSpeaking, setRobotSpeaking] = useState(false);
  const [welcomeName, setWelcomeName] = useState('');
  const { setPlayerName, playerName, updateStreak } = useGameStore();

  const handleStart = async () => {
    if (!nameInput.trim()) return;
    const name = nameInput.trim();
    setPlayerName(name);
    setWelcomeName(name);
    updateStreak();
    setShowWelcome(true);

    // Small delay then speak
    await new Promise(r => setTimeout(r, 800));
    setRobotSpeaking(true);
    await speakText(`Welcome to Nebula, ${name}! Let's begin your robotics journey.`);
    setRobotSpeaking(false);

    // Short pause then navigate
    await new Promise(r => setTimeout(r, 600));
    navigate('/dashboard');
  };

  const handleContinue = () => {
    updateStreak();
    navigate('/dashboard');
  };

  const stats = [
    { icon: <Timer size={20} />, value: '45', label: 'Hours' },
    { icon: <BookOpen size={20} />, value: '20+', label: 'Modules' },
    { icon: <Award size={20} />, value: '20', label: 'Badges' },
    { icon: <Layers size={20} />, value: '3', label: 'Phases' },
  ];

  const phases = [
    { icon: <Zap />, name: '', hours: '1-12', desc: 'Curiosity + Confidence', gradient: '', klass: 'spark' },
    { icon: <Layers />, name: '', hours: '13-30', desc: 'Skill Development', gradient: '', klass: 'build' },
    { icon: <Crown />, name: '', hours: '31-45', desc: 'Real Application', gradient: '', klass: 'master' },
  ];
  const features = [
    { icon: '🎮', title: '3D Gamified', desc: 'Immersive 3D environments with interactive robot models' },
    { icon: '🤖', title: 'AI Powered', desc: 'Gemini AI voice narration and adaptive learning paths' },
    { icon: '🏆', title: 'Earn Rewards', desc: 'Badges, XP, levels, streaks, and unlockable challenges' },
    { icon: '🔧', title: 'Hands-On', desc: '70-80% practical — learn by doing, not just watching' },
  ];

  return (
    <div className="landing">
      {/* Background */}
      <div className="landing-bg">
        <div className="landing-nebula" />
        <div className="landing-stars" />
      </div>

      {/* ═══ Welcome Robot Overlay ═══ */}
      <AnimatePresence>
        {showWelcome && (
          <motion.div
            className="welcome-overlay"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
          >
            <div className="welcome-particles">
              {[...Array(20)].map((_, i) => (
                <motion.div
                  key={i}
                  className="welcome-particle"
                  initial={{
                    x: 0, y: 0, opacity: 0, scale: 0
                  }}
                  animate={{
                    x: (Math.random() - 0.5) * 600,
                    y: (Math.random() - 0.5) * 400,
                    opacity: [0, 1, 0],
                    scale: [0, 1, 0],
                  }}
                  transition={{
                    duration: 2 + Math.random() * 2,
                    delay: 0.3 + Math.random() * 0.5,
                    repeat: Infinity,
                  }}
                />
              ))}
            </div>

            <motion.div
              className="welcome-robot-container"
              initial={{ scale: 0.3, y: 100, opacity: 0 }}
              animate={{ scale: 1, y: 0, opacity: 1 }}
              transition={{ type: 'spring', stiffness: 150, damping: 15, delay: 0.2 }}
            >
              <WelcomeRobot speaking={robotSpeaking} />
            </motion.div>

            <AnimatePresence>
              {robotSpeaking && (
                <motion.div
                  className="welcome-speech-bubble"
                  initial={{ opacity: 0, scale: 0.5, y: 20 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 0.8 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                >
                  <span className="speech-text">Welcome to <strong>Nebula</strong>, {welcomeName}!</span>
                  <span className="speech-sub">Let's begin your robotics journey 🚀</span>
                  <div className="speech-tail" />
                </motion.div>
              )}
            </AnimatePresence>

            <motion.div
              className="welcome-name-glow"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.5 }}
            >
              <span className="welcome-greeting">Hello, {welcomeName}!</span>
            </motion.div>

            <motion.div
              className="welcome-sound-waves"
              initial={{ opacity: 0 }}
              animate={{ opacity: robotSpeaking ? 1 : 0 }}
            >
              {[...Array(5)].map((_, i) => (
                <motion.div
                  key={i}
                  className="sound-wave"
                  animate={robotSpeaking ? {
                    scaleY: [0.3, 1, 0.3],
                    opacity: [0.4, 1, 0.4],
                  } : {}}
                  transition={{
                    duration: 0.4,
                    delay: i * 0.08,
                    repeat: Infinity,
                  }}
                />
              ))}
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Hero */}
      <section className="landing-hero">
        <div className="landing-hero-content">
          <motion.div
            className="landing-hero-text"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
          >
            <div className="landing-badge-pill">
              <Rocket size={14} />
              <span>Industrial Robotics Course Platform</span>
            </div>
            <h1 className="landing-title">
              Welcome to <span className="glow-text">NEBULA</span>
            </h1>
            <p className="landing-subtitle">
              Master industrial robotics through an immersive 3D gamified learning experience.
              45 hours of structured content, from curious beginner to confident professional.
            </p>

            <div className="landing-stats">
              {stats.map((stat, i) => (
                <motion.div
                  key={stat.label}
                  className="landing-stat"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 + i * 0.1 }}
                >
                  {stat.icon}
                  <span className="landing-stat-value">{stat.value}</span>
                  <span className="landing-stat-label">{stat.label}</span>
                </motion.div>
              ))}
            </div>

            <div className="landing-actions">
              {playerName !== 'Cadet' ? (
                <Button variant="primary" size="lg" glow onClick={handleContinue} icon={<Play size={18} />}>
                  Continue Journey
                </Button>
              ) : !showNameInput ? (
                <Button variant="primary" size="lg" glow onClick={() => setShowNameInput(true)} icon={<Rocket size={18} />}>
                  Begin Your Journey
                </Button>
              ) : (
                <motion.div
                  className="landing-name-input"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                >
                  <input
                    type="text"
                    placeholder="Enter your name, Cadet..."
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && handleStart()}
                    autoFocus
                  />
                  <Button variant="primary" onClick={handleStart} disabled={!nameInput.trim()} icon={<ArrowRight size={16} />}>
                    Launch
                  </Button>
                </motion.div>
              )}
            </div>
          </motion.div>

          <motion.div
            className="landing-hero-3d"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, delay: 0.3 }}
          >
            <HeroScene />
          </motion.div>
        </div>
      </section>

      {/* Phases */}
      <section className="landing-section">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Three Phases to <span className="glow-text">Mastery</span>
        </motion.h2>
        <div className="landing-phases">
          {phases.map((phase, i) => (
            <motion.div
              key={phase.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.15 }}
            >
              <GlassCard glow={phase.klass === 'spark' ? 'blue' : phase.klass === 'build' ? 'purple' : 'orange'} className={`landing-phase-card phase-${phase.klass}`}>
                <div className="landing-phase-icon">{phase.icon}</div>
                {phase.name && <h3>{phase.name}</h3>}
                <p>{phase.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Features */}
      <section className="landing-section">
        <motion.h2
          className="landing-section-title"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
        >
          Why <span className="glow-text">NEBULA</span>?
        </motion.h2>
        <div className="landing-features">
          {features.map((feat, i) => (
            <motion.div
              key={feat.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
            >
              <GlassCard className="landing-feature-card">
                <span className="landing-feature-icon">{feat.icon}</span>
                <h4>{feat.title}</h4>
                <p>{feat.desc}</p>
              </GlassCard>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Footer */}
      <footer className="landing-footer">
        <p>NEBULA — SkillSprint Industrial Learning Framework (SILF-45)</p>
      </footer>
    </div>
  );
}
