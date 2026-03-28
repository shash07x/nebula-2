import { useState, useCallback, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Star, Gift, Crown, ChevronRight, RotateCw } from 'lucide-react';
import useGameStore from '../../store/gameStore';
import './SpinWheel.css';

const DEFAULT_SEGMENTS = [
  { id: 'fun-fact', label: '🎯 Fun Fact', type: 'fact', color: 'var(--wheel-teal)',
    content: 'The first industrial robot, Unimate, was installed at a GM plant in 1961 to lift hot metal parts.' },
  { id: 'pro-tip', label: '💡 Pro Tip', type: 'tip', color: 'var(--wheel-plum)',
    content: 'Always back up your robot programs before making changes. One wrong move can cost hours of reprogramming.' },
  { id: 'industry-story', label: '🏭 Industry Story', type: 'story', color: 'var(--wheel-rust)',
    content: 'Tesla\'s Fremont factory uses over 1,000 robots. During Model 3 production ramp-up, they learned that too much automation can be worse than too little.' },
  { id: 'mini-challenge', label: '⚡ Mini Challenge', type: 'challenge', color: 'var(--wheel-wine)',
    content: 'Can you name 5 different types of industrial robots and one unique application for each? Time yourself — 60 seconds!' },
  { id: 'career-insight', label: '🚀 Career Insight', type: 'career', color: 'var(--wheel-slate)',
    content: 'Robot integrators earn 20-40% more than general automation engineers. Specializing in a robot brand (FANUC, ABB, KUKA) boosts your market value.' },
  { id: 'pro-course', label: '👑 Pro Content', type: 'pro', color: 'var(--wheel-crimson)',
    content: 'Unlock the Pro version for advanced simulation exercises, real robot programming challenges, and industry-certified assessments.' },
];

export default function SpinWheel({ segments = DEFAULT_SEGMENTS, moduleId, onClose }) {
  const [isSpinning, setIsSpinning] = useState(false);
  const [rotation, setRotation] = useState(0);
  const [selectedSegment, setSelectedSegment] = useState(null);
  const [showContent, setShowContent] = useState(false);
  const [hasSpun, setHasSpun] = useState(false);
  const addSpinResult = useGameStore(s => s.addSpinResult);
  const wheelRef = useRef(null);
  const audioCtxRef = useRef(null);

  const segmentAngle = 360 / segments.length;

  // Tick sound using Web Audio API
  const playTickSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.frequency.value = 800 + Math.random() * 400;
      osc.type = 'sine';
      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.05);
      osc.start(ctx.currentTime);
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) { /* silent fail */ }
  }, []);

  // Win sound
  const playWinSound = useCallback(() => {
    try {
      if (!audioCtxRef.current) {
        audioCtxRef.current = new (window.AudioContext || window.webkitAudioContext)();
      }
      const ctx = audioCtxRef.current;
      const notes = [523, 659, 784, 1047]; // C5, E5, G5, C6
      notes.forEach((freq, i) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.frequency.value = freq;
        osc.type = 'sine';
        const t = ctx.currentTime + i * 0.12;
        gain.gain.setValueAtTime(0.15, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);
        osc.start(t);
        osc.stop(t + 0.3);
      });
    } catch (e) { /* silent fail */ }
  }, []);

  const handleSpin = useCallback(() => {
    if (isSpinning) return;
    setIsSpinning(true);
    setSelectedSegment(null);
    setShowContent(false);

    // Random landing: 3-5 full rotations + random segment
    const fullRotations = 3 + Math.floor(Math.random() * 3);
    const landingIndex = Math.floor(Math.random() * segments.length);
    const landingAngle = landingIndex * segmentAngle + segmentAngle / 2;
    const totalRotation = rotation + (fullRotations * 360) + (360 - landingAngle);

    setRotation(totalRotation);

    // Tick sounds during spin
    let tickCount = 0;
    const tickInterval = setInterval(() => {
      playTickSound();
      tickCount++;
      if (tickCount > 25) clearInterval(tickInterval);
    }, 120);

    // After spin completes
    setTimeout(() => {
      clearInterval(tickInterval);
      setIsSpinning(false);
      setSelectedSegment(segments[landingIndex]);
      setShowContent(true);
      setHasSpun(true);
      playWinSound();

      // Save to store
      addSpinResult({
        moduleId,
        segmentIndex: landingIndex,
        contentId: `${moduleId}-${segments[landingIndex].id}`,
        content: segments[landingIndex],
      });
    }, 4000);
  }, [isSpinning, rotation, segments, segmentAngle, moduleId, addSpinResult, playTickSound, playWinSound]);

  // Cleanup audio context
  useEffect(() => {
    return () => {
      if (audioCtxRef.current) {
        audioCtxRef.current.close().catch(() => {});
      }
    };
  }, []);

  return (
    <motion.div
      className="spin-wheel-overlay"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <motion.div
        className="spin-wheel-container"
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        exit={{ scale: 0.8, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 250, damping: 25 }}
      >
        {/* Close button */}
        <button className="sw-close" onClick={onClose}>
          <X size={18} />
        </button>

        {/* Header */}
        <div className="sw-header">
          <Gift size={22} className="sw-header-icon" />
          <div>
            <h2>Spin the Wheel!</h2>
            <p>Unlock bonus learning content</p>
          </div>
        </div>

        <div className="sw-body">
          {/* Wheel Section */}
          <div className="sw-wheel-section">
            {/* Pointer/indicator */}
            <div className="sw-pointer">▼</div>

            {/* The wheel */}
            <div className="sw-wheel-wrapper" ref={wheelRef}>
              <motion.svg
                viewBox="0 0 400 400"
                className="sw-wheel-svg"
                animate={{ rotate: rotation }}
                transition={{
                  duration: 4,
                  ease: [0.12, 0.8, 0.2, 1], // Custom ease for realistic spin
                }}
              >
                {segments.map((seg, i) => {
                  const startAngle = i * segmentAngle;
                  const endAngle = startAngle + segmentAngle;
                  const startRad = (startAngle - 90) * (Math.PI / 180);
                  const endRad = (endAngle - 90) * (Math.PI / 180);
                  const cx = 200, cy = 200, r = 180;

                  const x1 = cx + r * Math.cos(startRad);
                  const y1 = cy + r * Math.sin(startRad);
                  const x2 = cx + r * Math.cos(endRad);
                  const y2 = cy + r * Math.sin(endRad);
                  const largeArc = segmentAngle > 180 ? 1 : 0;

                  // Text position (midpoint of arc)
                  const midAngle = ((startAngle + endAngle) / 2 - 90) * (Math.PI / 180);
                  const textR = r * 0.6;
                  const tx = cx + textR * Math.cos(midAngle);
                  const ty = cy + textR * Math.sin(midAngle);
                  const textRotation = (startAngle + endAngle) / 2;

                  // Resolve CSS variable colors to static for SVG
                  const colorMap = {
                    'var(--wheel-teal)': '#335a64',
                    'var(--wheel-plum)': '#592d58',
                    'var(--wheel-rust)': '#a63826',
                    'var(--wheel-wine)': '#3f1932',
                    'var(--wheel-slate)': '#686779',
                    'var(--wheel-crimson)': '#7a232e',
                    'var(--wheel-silver)': '#bdd1cf',
                    'var(--wheel-mauve)': '#c7a699',
                    'var(--wheel-pewter)': '#9ca4a6',
                    'var(--wheel-blush)': '#c9c1be',
                  };
                  const fill = colorMap[seg.color] || seg.color;

                  return (
                    <g key={seg.id}>
                      <path
                        d={`M ${cx} ${cy} L ${x1} ${y1} A ${r} ${r} 0 ${largeArc} 1 ${x2} ${y2} Z`}
                        fill={fill}
                        stroke="rgba(255,255,255,0.15)"
                        strokeWidth="2"
                      />
                      <text
                        x={tx}
                        y={ty}
                        fill="#fff"
                        fontSize="11"
                        fontWeight="700"
                        fontFamily="'Orbitron', sans-serif"
                        textAnchor="middle"
                        dominantBaseline="middle"
                        transform={`rotate(${textRotation}, ${tx}, ${ty})`}
                      >
                        {seg.label.replace(/[^\w\s]/g, '').trim().substring(0, 12)}
                      </text>
                    </g>
                  );
                })}
                {/* Center circle */}
                <circle cx="200" cy="200" r="30" fill="#0a0a1a" stroke="rgba(79,140,255,0.3)" strokeWidth="3" />
                <text x="200" y="200" fill="#fff" fontSize="10" fontWeight="700" fontFamily="'Orbitron'" textAnchor="middle" dominantBaseline="middle">
                  SPIN
                </text>
              </motion.svg>
            </div>

            {/* Spin button */}
            <motion.button
              className={`sw-spin-btn ${isSpinning ? 'spinning' : ''}`}
              onClick={handleSpin}
              disabled={isSpinning}
              whileHover={!isSpinning ? { scale: 1.05 } : {}}
              whileTap={!isSpinning ? { scale: 0.95 } : {}}
            >
              <RotateCw size={18} className={isSpinning ? 'sw-spin-icon' : ''} />
              {isSpinning ? 'Spinning...' : hasSpun ? 'Spin Again!' : 'SPIN!'}
            </motion.button>
          </div>

          {/* Content Panel */}
          <AnimatePresence mode="wait">
            {showContent && selectedSegment ? (
              <motion.div
                key={selectedSegment.id}
                className="sw-content-panel"
                initial={{ opacity: 0, x: 40 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -40 }}
                transition={{ type: 'spring', stiffness: 300, damping: 30 }}
              >
                <div className="sw-content-badge" style={{ background: selectedSegment.color.startsWith('var') ? undefined : selectedSegment.color }}>
                  <span className="sw-content-emoji">{selectedSegment.label.split(' ')[0]}</span>
                  <span className="sw-content-type">
                    {selectedSegment.type === 'pro' ? 'PRO' : selectedSegment.type.toUpperCase()}
                  </span>
                </div>

                <h3 className="sw-content-title">{selectedSegment.label.replace(/^\S+\s/, '')}</h3>

                <div className="sw-content-body">
                  <p>{selectedSegment.content}</p>
                </div>

                {selectedSegment.type === 'pro' && (
                  <motion.div
                    className="sw-pro-banner"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.3 }}
                  >
                    <Crown size={16} />
                    <span>Upgrade to Pro for full access</span>
                    <ChevronRight size={14} />
                  </motion.div>
                )}

                <div className="sw-content-xp">
                  <Star size={14} />
                  <span>+10 XP for exploring bonus content!</span>
                </div>
              </motion.div>
            ) : (
              <motion.div
                className="sw-content-panel sw-content-placeholder"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
              >
                <div className="sw-placeholder-inner">
                  <Gift size={40} className="sw-placeholder-icon" />
                  <h3>Spin to Discover</h3>
                  <p>Hit the spin button to unlock bonus learning content related to your module!</p>
                  <div className="sw-placeholder-segments">
                    {segments.map(seg => (
                      <span key={seg.id} className="sw-placeholder-tag">
                        {seg.label}
                      </span>
                    ))}
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </motion.div>
    </motion.div>
  );
}
