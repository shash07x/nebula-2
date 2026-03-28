import { useState, useRef, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Send, Sparkles, ArrowRight, Volume2, X, MessageCircle } from 'lucide-react';
import './InteractiveRobot.css';

const QUICK_ACTIONS = [
  { label: '🚀 Start next module', action: 'next_module' },
  { label: '📊 My progress', action: 'progress' },
  { label: '🏆 Achievements', action: 'achievements' },
  { label: '❓ What is Nebula?', action: 'about' },
  { label: '📖 Explain phases', action: 'phases' },
];

const RESPONSES = {
  next_module: (n) => ({ text: `Let's keep going, ${n}! 💪 I'll take you to your next module.`, action: { type: 'navigate', path: 'next_module' } }),
  progress: (n) => ({ text: `Here's your journey, ${n}:\n\n📊 Check the Phase Progress cards — they show Spark, Build, Master phases.\n\nI can take you to your Profile for full details!`, action: { type: 'navigate', path: '/profile', label: 'View Profile' } }),
  achievements: () => ({ text: `🏆 You earn badges by completing modules! Each module in the SkillSprint Loop has an XP reward and a unique badge.\n\nLet me show you all your badges.`, action: { type: 'navigate', path: '/profile', label: 'View Badges' } }),
  about: () => ({ text: `🌌 I'm Nebula, your AI robotics companion! This platform is a 45-hour Industrial Robotics course built on the SkillSprint Framework.\n\nYou learn through:\n🔸 Hook → Learn → Practice → Challenge → Real-World → Reflect → Upgrade\n\nEach loop earns XP and badges! 🚀` }),
  phases: () => ({ text: `The 3 phases build you up:\n\n⚡ Spark (1-12h): Curiosity + confidence\n🔧 Build (13-30h): Skill development\n👑 Master (31-45h): Real application\n\nEach phase has modules with the SkillSprint Loop!`, action: { type: 'navigate', path: '/phase/spark', label: 'Start Spark' } }),
  default: (n) => ({ text: `Great question, ${n}! I can help you navigate modules, explain how things work, or track your progress. Try the quick actions or ask me anything! 🤖` }),
};

function speakText(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const clean = text.replace(/[*#🔸⚡🔧👑🏆📊🚀💪🤖❓📖🌌]/g, '').replace(/\n/g, '. ');
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1;
  utterance.pitch = 0.85;
  utterance.volume = 0.8;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

export default function InteractiveRobot({ playerName = 'Cadet', nextModulePath = '/dashboard', compact = false }) {
  const navigate = useNavigate();
  const robotRef = useRef(null);
  const chatEndRef = useRef(null);

  // Mouse tracking
  const [eyeOffset, setEyeOffset] = useState({ x: 0, y: 0 });
  const [headTilt, setHeadTilt] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  // Chat
  const [chatOpen, setChatOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [mood, setMood] = useState('happy'); // happy, thinking, excited, waving

  // Auto-scroll chat
  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  // Mouse tracking — eyes follow cursor, head tilts
  const handleMouseMove = useCallback((e) => {
    if (!robotRef.current) return;
    const rect = robotRef.current.getBoundingClientRect();
    const robotCenterX = rect.left + rect.width / 2;
    const robotCenterY = rect.top + rect.height * 0.3; // eye level

    const dx = e.clientX - robotCenterX;
    const dy = e.clientY - robotCenterY;
    const distance = Math.sqrt(dx * dx + dy * dy);
    const maxOffset = 8;

    const normX = (dx / Math.max(distance, 1)) * Math.min(distance / 50, 1) * maxOffset;
    const normY = (dy / Math.max(distance, 1)) * Math.min(distance / 50, 1) * maxOffset;

    setEyeOffset({ x: normX, y: normY });
    setHeadTilt(normX * 0.3); // slight head tilt
  }, []);

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [handleMouseMove]);

  // Wave on first load
  useEffect(() => {
    setMood('waving');
    const t = setTimeout(() => setMood('happy'), 2500);
    return () => clearTimeout(t);
  }, []);

  const addBotMessage = (text, action) => {
    setIsTyping(true);
    setMood('thinking');
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text, action }]);
      setIsTyping(false);
      setMood('happy');
    }, 600 + Math.random() * 400);
  };

  const handleChatToggle = () => {
    if (!chatOpen) {
      setChatOpen(true);
      setMood('excited');
      setTimeout(() => setMood('happy'), 1000);
      if (messages.length === 0) {
        setTimeout(() => {
          addBotMessage(`Hey ${playerName}! 👋 I'm Nebula, your AI learning companion. Ask me anything or try the quick actions!`);
        }, 300);
      }
    } else {
      setChatOpen(false);
    }
  };

  const handleQuickAction = (key) => {
    const label = QUICK_ACTIONS.find(a => a.action === key)?.label || key;
    setMessages(prev => [...prev, { from: 'user', text: label }]);
    const fn = RESPONSES[key] || RESPONSES.default;
    const res = fn(playerName);
    setTimeout(() => addBotMessage(res.text, res.action), 200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const text = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text }]);
    const lower = text.toLowerCase();
    let key = 'default';
    if (lower.includes('next') || lower.includes('module') || lower.includes('start')) key = 'next_module';
    else if (lower.includes('progress') || lower.includes('how am i')) key = 'progress';
    else if (lower.includes('badge') || lower.includes('achievement')) key = 'achievements';
    else if (lower.includes('nebula') || lower.includes('what') || lower.includes('about')) key = 'about';
    else if (lower.includes('phase') || lower.includes('spark') || lower.includes('build')) key = 'phases';
    const fn = RESPONSES[key] || RESPONSES.default;
    const res = fn(playerName);
    setTimeout(() => addBotMessage(res.text, res.action), 200);
  };

  const handleAction = (action) => {
    if (!action) return;
    if (action.path === 'next_module') navigate(nextModulePath);
    else navigate(action.path);
  };

  const handleSpeak = (text) => {
    setSpeaking(true);
    setMood('excited');
    speakText(text);
    setTimeout(() => { setSpeaking(false); setMood('happy'); }, 3000);
  };

  return (
    <div className={`interactive-robot-section ${compact ? 'compact' : ''}`}>
      {/* ═══ The Robot ═══ */}
      <div
        className={`robot-character ${isHovered ? 'hovered' : ''} ${chatOpen ? 'chatting' : ''}`}
        ref={robotRef}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handleChatToggle}
      >
        <svg
          viewBox="0 0 320 480"
          className="robot-svg"
          style={{ transform: `rotate(${headTilt}deg)` }}
        >
          {/* ── Glow filters ── */}
          <defs>
            <filter id="robotGlow" x="-40%" y="-40%" width="180%" height="180%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <filter id="eyeGlow" x="-60%" y="-60%" width="220%" height="220%">
              <feGaussianBlur stdDeviation="6" result="blur" />
              <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
            </filter>
            <linearGradient id="bodyGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1a1a4e" />
              <stop offset="100%" stopColor="#0d0d2b" />
            </linearGradient>
            <linearGradient id="headGrad" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#1e1e55" />
              <stop offset="100%" stopColor="#12123a" />
            </linearGradient>
          </defs>

          {/* ── Antenna ── */}
          <motion.circle
            cx="160" cy="32" r="10"
            fill="#00e5ff"
            filter="url(#eyeGlow)"
            animate={speaking ? { scale: [1, 1.6, 1], opacity: [1, 0.5, 1] } : { scale: [1, 1.2, 1] }}
            transition={{ duration: speaking ? 0.4 : 2, repeat: Infinity }}
            style={{ transformOrigin: '160px 32px' }}
          />
          <line x1="160" y1="42" x2="160" y2="80" stroke="#4f8cff" strokeWidth="5" strokeLinecap="round" />

          {/* ── Head ── */}
          <rect x="75" y="80" width="170" height="130" rx="30" fill="url(#headGrad)" stroke="#4f8cff" strokeWidth="3" />

          {/* ── Ear lights ── */}
          <motion.rect x="60" y="115" width="15" height="40" rx="7" fill="#a855f7" opacity="0.6"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <motion.rect x="245" y="115" width="15" height="40" rx="7" fill="#a855f7" opacity="0.6"
            animate={{ opacity: [0.3, 0.8, 0.3] }}
            transition={{ duration: 2, repeat: Infinity, delay: 1 }}
          />

          {/* ── Eyes (follow cursor) ── */}
          {/* Eye sockets */}
          <ellipse cx="125" cy="135" rx="26" ry="24" fill="#0a0a1a" />
          <ellipse cx="195" cy="135" rx="26" ry="24" fill="#0a0a1a" />
          {/* Irises */}
          <motion.ellipse
            cx={125 + eyeOffset.x} cy={135 + eyeOffset.y}
            rx="16" ry="15" fill="#00e5ff"
            filter="url(#eyeGlow)"
            animate={speaking ? { scaleY: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 0.5 }}
            style={{ transformOrigin: `${125 + eyeOffset.x}px ${135 + eyeOffset.y}px` }}
          />
          <motion.ellipse
            cx={195 + eyeOffset.x} cy={135 + eyeOffset.y}
            rx="16" ry="15" fill="#00e5ff"
            filter="url(#eyeGlow)"
            animate={speaking ? { scaleY: [1, 0.3, 1] } : {}}
            transition={{ duration: 0.3, repeat: speaking ? Infinity : 0, repeatDelay: 0.5 }}
            style={{ transformOrigin: `${195 + eyeOffset.x}px ${135 + eyeOffset.y}px` }}
          />
          {/* Pupils */}
          <circle cx={125 + eyeOffset.x * 1.2} cy={135 + eyeOffset.y * 1.2} r="5" fill="#fff" />
          <circle cx={195 + eyeOffset.x * 1.2} cy={135 + eyeOffset.y * 1.2} r="5" fill="#fff" />

          {/* ── Mouth ── */}
          <motion.rect
            x="130" y="175" width="60" height={speaking ? 14 : 8} rx="4"
            fill="#a855f7"
            animate={speaking
              ? { height: [8, 20, 8, 16, 8], y: [175, 170, 175, 172, 175], rx: [4, 10, 4, 8, 4] }
              : mood === 'happy'
                ? { width: [50, 60, 50], x: [135, 130, 135] }
                : {}
            }
            transition={{ duration: speaking ? 0.35 : 3, repeat: Infinity }}
          />

          {/* ── Neck ── */}
          <rect x="140" y="210" width="40" height="25" rx="6" fill="#4f8cff" opacity="0.4" />

          {/* ── Body ── */}
          <rect x="60" y="235" width="200" height="155" rx="24" fill="url(#bodyGrad)" stroke="#a855f7" strokeWidth="3" />

          {/* ── Chest panel ── */}
          <rect x="100" y="260" width="120" height="80" rx="14" fill="rgba(79,140,255,0.08)" stroke="rgba(79,140,255,0.2)" strokeWidth="1.5" />
          {/* Core light */}
          <motion.circle
            cx="160" cy="300" r="22" fill="none" stroke="#00e5ff" strokeWidth="2.5"
            filter="url(#robotGlow)"
            animate={{ scale: [0.85, 1.15, 0.85], opacity: [0.3, 0.9, 0.3] }}
            transition={{ duration: 2.5, repeat: Infinity }}
            style={{ transformOrigin: '160px 300px' }}
          />
          <motion.circle
            cx="160" cy="300" r="10" fill="#00e5ff"
            filter="url(#eyeGlow)"
            animate={speaking ? { opacity: [0.5, 1, 0.5], scale: [0.9, 1.2, 0.9] } : { opacity: 0.7 }}
            transition={{ duration: 0.5, repeat: speaking ? Infinity : 0 }}
            style={{ transformOrigin: '160px 300px' }}
          />
          {/* Chest bars */}
          <motion.rect x="112" y="330" width="28" height="4" rx="2" fill="#4f8cff" opacity="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity }}
          />
          <motion.rect x="148" y="330" width="28" height="4" rx="2" fill="#a855f7" opacity="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.3 }}
          />
          <motion.rect x="184" y="330" width="28" height="4" rx="2" fill="#00e5ff" opacity="0.5"
            animate={{ opacity: [0.3, 0.7, 0.3] }} transition={{ duration: 1.5, repeat: Infinity, delay: 0.6 }}
          />

          {/* ── Arms ── */}
          <motion.g
            animate={mood === 'waving'
              ? { rotate: [0, -25, 0, -25, 0] }
              : isHovered ? { rotate: -5 } : { rotate: 0 }
            }
            transition={mood === 'waving' ? { duration: 1.5, repeat: 1 } : { duration: 0.3 }}
            style={{ transformOrigin: '42px 250px' }}
          >
            <rect x="15" y="250" width="40" height="100" rx="16" fill="url(#bodyGrad)" stroke="#4f8cff" strokeWidth="2.5" />
            <circle cx="35" cy="362" r="16" fill="#1a1a4e" stroke="#4f8cff" strokeWidth="2" />
          </motion.g>
          <motion.g
            animate={mood === 'waving'
              ? { rotate: [0, 25, 0, 25, 0] }
              : isHovered ? { rotate: 5 } : { rotate: 0 }
            }
            transition={mood === 'waving' ? { duration: 1.5, repeat: 1, delay: 0.2 } : { duration: 0.3 }}
            style={{ transformOrigin: '278px 250px' }}
          >
            <rect x="265" y="250" width="40" height="100" rx="16" fill="url(#bodyGrad)" stroke="#4f8cff" strokeWidth="2.5" />
            <circle cx="285" cy="362" r="16" fill="#1a1a4e" stroke="#4f8cff" strokeWidth="2" />
          </motion.g>

          {/* ── Legs ── */}
          <rect x="105" y="390" width="36" height="60" rx="14" fill="url(#bodyGrad)" stroke="#a855f7" strokeWidth="2" />
          <rect x="179" y="390" width="36" height="60" rx="14" fill="url(#bodyGrad)" stroke="#a855f7" strokeWidth="2" />
          {/* Feet */}
          <rect x="92" y="442" width="62" height="20" rx="10" fill="#1a1a4e" stroke="#4f8cff" strokeWidth="2" />
          <rect x="166" y="442" width="62" height="20" rx="10" fill="#1a1a4e" stroke="#4f8cff" strokeWidth="2" />
        </svg>

        {/* Robot name label */}
        <div className="robot-name-label">
          <Sparkles size={12} />
          <span>NEBULA</span>
        </div>

        {/* "Click me" hint */}
        <AnimatePresence>
          {!chatOpen && (
            <motion.div
              className="robot-hint"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: [0, 1, 1, 0], y: [10, 0, 0, -5] }}
              transition={{ duration: 3, repeat: Infinity, repeatDelay: 2 }}
            >
              <MessageCircle size={12} /> Click me to chat!
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* ═══ Chat Panel ═══ */}
      <AnimatePresence>
        {chatOpen && (
          <motion.div
            className="robot-chat-panel"
            initial={{ opacity: 0, x: -20, scale: 0.95 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: -20, scale: 0.95 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            <div className="robot-chat-header">
              <div className="robot-chat-title">
                <Sparkles size={14} className="robot-chat-sparkle" />
                <div>
                  <h4>Nebula</h4>
                  <span className="robot-chat-status">AI Learning Companion</span>
                </div>
              </div>
              <button className="robot-chat-close" onClick={() => setChatOpen(false)}>
                <X size={14} />
              </button>
            </div>

            {/* Messages */}
            <div className="robot-chat-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`robot-msg ${msg.from}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                >
                  <div className="robot-msg-content">
                    <p>{msg.text}</p>
                    {msg.action && (
                      <button className="robot-msg-action" onClick={() => handleAction(msg.action)}>
                        <ArrowRight size={11} /> {msg.action.label || 'Go'}
                      </button>
                    )}
                    {msg.from === 'bot' && (
                      <button className="robot-msg-speak" onClick={() => handleSpeak(msg.text)} title="Read aloud">
                        <Volume2 size={10} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="robot-msg bot">
                  <div className="robot-typing"><span /><span /><span /></div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className="robot-quick-actions">
                {QUICK_ACTIONS.map((qa) => (
                  <button key={qa.action} className="robot-quick-btn" onClick={() => handleQuickAction(qa.action)}>
                    {qa.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="robot-chat-input">
              <input
                type="text"
                placeholder="Ask Nebula..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="robot-send-btn" onClick={handleSend} disabled={!input.trim()}>
                <Send size={13} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
