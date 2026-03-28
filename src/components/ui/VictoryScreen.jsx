import { useState, useEffect, useCallback, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Trophy, Star, Sparkles, Music, PartyPopper } from 'lucide-react';
import './VictoryScreen.css';

// Confetti particle component
function Confetti({ count = 50 }) {
  const particles = Array.from({ length: count }, (_, i) => ({
    id: i,
    x: Math.random() * 100,
    delay: Math.random() * 2,
    duration: 2 + Math.random() * 3,
    size: 4 + Math.random() * 8,
    color: ['#4f8cff', '#a855f7', '#00e5ff', '#ffd600', '#e040fb', '#ff6d00', '#00e676'][Math.floor(Math.random() * 7)],
    rotate: Math.random() * 720 - 360,
  }));

  return (
    <div className="victory-confetti">
      {particles.map(p => (
        <motion.div
          key={p.id}
          className="confetti-piece"
          style={{
            left: `${p.x}%`,
            width: p.size,
            height: p.size * (Math.random() > 0.5 ? 1 : 0.6),
            background: p.color,
            borderRadius: Math.random() > 0.5 ? '50%' : '2px',
          }}
          initial={{ y: -20, opacity: 1, rotate: 0 }}
          animate={{
            y: '110vh',
            opacity: [1, 1, 0],
            rotate: p.rotate,
            x: [0, (Math.random() - 0.5) * 200],
          }}
          transition={{
            duration: p.duration,
            delay: p.delay,
            ease: 'easeOut',
            repeat: Infinity,
            repeatDelay: Math.random() * 2,
          }}
        />
      ))}
    </div>
  );
}

// Synthesize victory jingle (Web Audio API)
function playVictoryJingle(duration = 5) {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0.15;

    // Short victory fanfare melody
    const melody = [
      { freq: 523, time: 0, dur: 0.15 },    // C5
      { freq: 659, time: 0.15, dur: 0.15 },  // E5
      { freq: 784, time: 0.3, dur: 0.15 },   // G5
      { freq: 1047, time: 0.5, dur: 0.3 },   // C6
      { freq: 988, time: 0.8, dur: 0.15 },   // B5
      { freq: 1047, time: 1.0, dur: 0.5 },   // C6 (held)
      // Harmonics
      { freq: 392, time: 0, dur: 0.8 },      // G4 bass
      { freq: 523, time: 0.5, dur: 0.8 },    // C5 bass
    ];

    melody.forEach(note => {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(masterGain);
      osc.frequency.value = note.freq;
      osc.type = note.freq < 500 ? 'triangle' : 'sine';
      const t = ctx.currentTime + note.time;
      gain.gain.setValueAtTime(0.2, t);
      gain.gain.exponentialRampToValueAtTime(0.001, t + note.dur);
      osc.start(t);
      osc.stop(t + note.dur + 0.1);
    });

    // Fade out master
    setTimeout(() => {
      masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      setTimeout(() => ctx.close().catch(() => {}), 1000);
    }, (duration - 1) * 1000);

    return ctx;
  } catch (e) {
    return null;
  }
}

// Extended celebration beat (1 minute)
function playFinalCelebration() {
  try {
    const ctx = new (window.AudioContext || window.webkitAudioContext)();
    const masterGain = ctx.createGain();
    masterGain.connect(ctx.destination);
    masterGain.gain.value = 0.12;

    // Rhythmic beat pattern (lo-fi style)
    const bpm = 90;
    const beatDur = 60 / bpm;
    const totalBeats = 60; // ~60 seconds

    for (let i = 0; i < totalBeats; i++) {
      const t = ctx.currentTime + i * beatDur;

      // Kick on 1, 3
      if (i % 4 === 0 || i % 4 === 2) {
        const kick = ctx.createOscillator();
        const kickGain = ctx.createGain();
        kick.connect(kickGain);
        kickGain.connect(masterGain);
        kick.frequency.setValueAtTime(150, t);
        kick.frequency.exponentialRampToValueAtTime(40, t + 0.15);
        kick.type = 'sine';
        kickGain.gain.setValueAtTime(0.4, t);
        kickGain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);
        kick.start(t);
        kick.stop(t + 0.2);
      }

      // Snare on 2, 4
      if (i % 4 === 1 || i % 4 === 3) {
        const noise = ctx.createOscillator();
        const noiseGain = ctx.createGain();
        noise.connect(noiseGain);
        noiseGain.connect(masterGain);
        noise.frequency.value = 200 + Math.random() * 100;
        noise.type = 'triangle';
        noiseGain.gain.setValueAtTime(0.15, t);
        noiseGain.gain.exponentialRampToValueAtTime(0.001, t + 0.1);
        noise.start(t);
        noise.stop(t + 0.15);
      }

      // Melody notes (pentatonic scale)
      if (i % 8 === 0 || i % 8 === 3 || i % 8 === 5) {
        const scale = [262, 294, 330, 392, 440, 523, 587, 659];
        const noteFreq = scale[Math.floor(Math.random() * scale.length)];
        const mel = ctx.createOscillator();
        const melGain = ctx.createGain();
        mel.connect(melGain);
        melGain.connect(masterGain);
        mel.frequency.value = noteFreq;
        mel.type = 'square';
        melGain.gain.setValueAtTime(0.08, t);
        melGain.gain.exponentialRampToValueAtTime(0.001, t + beatDur * 1.5);
        mel.start(t);
        mel.stop(t + beatDur * 2);
      }
    }

    // Auto-close after 60s
    setTimeout(() => {
      masterGain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 2);
      setTimeout(() => ctx.close().catch(() => {}), 3000);
    }, 58000);

    return ctx;
  } catch (e) {
    return null;
  }
}

export default function VictoryScreen({ xpEarned, badgeName, badgeIcon, isFinalCourse = false, onClose }) {
  const [showDetails, setShowDetails] = useState(false);
  const [xpCounter, setXpCounter] = useState(0);
  const audioCtxRef = useRef(null);

  const duration = isFinalCourse ? 60 : 5; // seconds

  useEffect(() => {
    // Play audio
    if (isFinalCourse) {
      audioCtxRef.current = playFinalCelebration();
    } else {
      audioCtxRef.current = playVictoryJingle(duration);
    }

    // XP counter animation
    const steps = 30;
    const increment = xpEarned / steps;
    let step = 0;
    const timer = setInterval(() => {
      step++;
      setXpCounter(Math.min(Math.round(increment * step), xpEarned));
      if (step >= steps) clearInterval(timer);
    }, 50);

    // Show details after delay
    setTimeout(() => setShowDetails(true), 800);

    // Auto-dismiss for non-final
    let dismissTimer;
    if (!isFinalCourse) {
      dismissTimer = setTimeout(() => {
        handleClose();
      }, duration * 1000);
    }

    return () => {
      clearInterval(timer);
      clearTimeout(dismissTimer);
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  const handleClose = useCallback(() => {
    if (audioCtxRef.current) {
      audioCtxRef.current.close().catch(() => {});
    }
    onClose?.();
  }, [onClose]);

  return (
    <motion.div
      className={`victory-overlay ${isFinalCourse ? 'victory-final' : ''}`}
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      onClick={!isFinalCourse ? handleClose : undefined}
    >
      {/* Confetti */}
      <Confetti count={isFinalCourse ? 100 : 50} />

      {/* Fireworks for final course */}
      {isFinalCourse && (
        <div className="victory-fireworks">
          {[...Array(8)].map((_, i) => (
            <motion.div
              key={i}
              className="firework"
              style={{ left: `${10 + Math.random() * 80}%`, top: `${10 + Math.random() * 50}%` }}
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: [0, 1.5, 0], opacity: [0, 1, 0] }}
              transition={{ duration: 1.5, delay: i * 0.5, repeat: Infinity, repeatDelay: 3 }}
            />
          ))}
        </div>
      )}

      {/* Main content */}
      <motion.div
        className="victory-card"
        initial={{ scale: 0.3, opacity: 0, y: 50 }}
        animate={{ scale: 1, opacity: 1, y: 0 }}
        transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
        onClick={e => e.stopPropagation()}
      >
        {/* Trophy / celebration emoji */}
        <motion.div
          className="victory-trophy"
          initial={{ scale: 0, rotate: -30 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ type: 'spring', stiffness: 300, damping: 10, delay: 0.4 }}
        >
          {isFinalCourse ? '🏆' : '🎉'}
        </motion.div>

        <motion.h1
          className="victory-title"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.5 }}
        >
          {isFinalCourse ? 'COURSE COMPLETE!' : 'MODULE COMPLETE!'}
        </motion.h1>

        {isFinalCourse && (
          <motion.p
            className="victory-subtitle"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7 }}
          >
            🎤 You've mastered Industrial Robotics! 🎤
          </motion.p>
        )}

        {/* XP counter */}
        <AnimatePresence>
          {showDetails && (
            <motion.div
              className="victory-details"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
            >
              <div className="victory-xp">
                <Star size={22} className="victory-star" />
                <span className="victory-xp-num">+{xpCounter}</span>
                <span className="victory-xp-label">XP</span>
              </div>

              {badgeName && (
                <motion.div
                  className="victory-badge"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: 'spring', delay: 0.4 }}
                >
                  <span className="victory-badge-icon">{badgeIcon}</span>
                  <span className="victory-badge-name">{badgeName}</span>
                </motion.div>
              )}
            </motion.div>
          )}
        </AnimatePresence>

        {/* Music indicator */}
        <div className="victory-music-indicator">
          <Music size={12} />
          <span>{isFinalCourse ? 'Celebration beat playing...' : 'Victory jingle!'}</span>
        </div>

        {/* Dismiss */}
        <motion.button
          className="victory-dismiss"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: isFinalCourse ? 3 : 1.5 }}
          onClick={handleClose}
        >
          {isFinalCourse ? 'Continue to Certificate →' : 'Click anywhere to continue'}
        </motion.button>
      </motion.div>
    </motion.div>
  );
}
