import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageCircle, X, Send, Sparkles, ArrowRight, Bot, Volume2 } from 'lucide-react';
import './AIAssistant.css';

const QUICK_ACTIONS = [
  { label: '🚀 Start next module', action: 'next_module' },
  { label: '📊 Show my progress', action: 'progress' },
  { label: '🏆 View achievements', action: 'achievements' },
  { label: '❓ What is Nebula?', action: 'about' },
  { label: '🔧 How does Practice work?', action: 'practice_help' },
  { label: '📖 Explain the 3 phases', action: 'phases' },
];

const RESPONSES = {
  next_module: (name) => ({
    text: `Let's keep your momentum going, ${name}! 💪 I'll take you to your next module right away.`,
    action: { type: 'navigate', path: 'next_module' },
  }),
  progress: (name) => ({
    text: `Here's a quick look at your journey, ${name}:\n\n📊 Check your Phase Progress cards on the dashboard — they show how far you've come in Spark, Build, and Master phases.\n\nWant to see your full details? I can take you to your Profile!`,
    action: { type: 'navigate', path: '/profile', label: 'View Profile' },
  }),
  achievements: () => ({
    text: `🏆 You earn badges by completing modules! Each module in the SkillSprint Loop has an XP reward and a unique badge.\n\nKeep completing modules to fill your collection! Let me show you all your badges.`,
    action: { type: 'navigate', path: '/profile', label: 'View Badges' },
  }),
  about: () => ({
    text: `🌌 **Nebula** is a 45-hour Industrial Robotics course built on the SkillSprint Framework (SILF-45).\n\nYou learn through a repeating loop:\n🔸 Hook → Learn → Practice → Challenge → Real-World → Reflect → Upgrade\n\nEach loop earns you XP and badges as you progress from beginner to professional! 🚀`,
  }),
  practice_help: () => ({
    text: `🔧 The **Practice** step has two modes:\n\n1. **3D Robot Viewer** — Click on joints to learn about each part of an industrial robot\n2. **Quiz Mode** — Answer questions to test your understanding\n\nBoth modes give you hands-on experience! Try clicking on the robot joints to explore.`,
    action: { type: 'navigate', path: 'next_module', label: 'Try Practice' },
  }),
  phases: () => ({
    text: `The 3 phases build your skills progressively:\n\n⚡ **Spark** (Hours 1-12): Curiosity + confidence — "I can understand robotics"\n🔧 **Build** (Hours 13-30): Skill development — "I'm getting better"\n👑 **Master** (Hours 31-45): Real application — "I can do this professionally"\n\nEach phase has modules that guide you through the SkillSprint Loop!`,
    action: { type: 'navigate', path: '/phase/spark', label: 'Start with Spark' },
  }),
  default: (name) => ({
    text: `Great question, ${name}! 🤖 I'm your Nebula learning assistant. I can help you:\n\n• Navigate to modules and phases\n• Explain how the learning system works\n• Track your progress\n• Answer robotics questions\n\nTry one of the quick actions below or ask me anything!`,
  }),
};

// Simple SVG robot for the assistant
function MiniRobot({ speaking, size = 40 }) {
  return (
    <svg viewBox="0 0 100 120" width={size} height={size * 1.2} className="mini-robot-svg">
      <motion.circle cx="50" cy="10" r="4" fill="var(--accent-cyan)"
        animate={speaking ? { scale: [1, 1.5, 1] } : {}}
        transition={{ duration: 0.5, repeat: Infinity }}
        filter="url(#miniGlow)"
      />
      <line x1="50" y1="14" x2="50" y2="25" stroke="var(--accent-blue)" strokeWidth="2" strokeLinecap="round" />
      <rect x="25" y="25" width="50" height="40" rx="10" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-blue)" strokeWidth="2" />
      <motion.circle cx="38" cy="42" r="6" fill="var(--accent-cyan)"
        animate={speaking ? { scaleY: [1, 0.3, 1] } : { scaleY: [1, 0.1, 1] }}
        transition={{ duration: speaking ? 0.25 : 3, repeat: Infinity, repeatDelay: speaking ? 0.5 : 2 }}
        style={{ transformOrigin: '38px 42px' }}
        filter="url(#miniGlow)"
      />
      <motion.circle cx="62" cy="42" r="6" fill="var(--accent-cyan)"
        animate={speaking ? { scaleY: [1, 0.3, 1] } : { scaleY: [1, 0.1, 1] }}
        transition={{ duration: speaking ? 0.25 : 3, repeat: Infinity, repeatDelay: speaking ? 0.5 : 2 }}
        style={{ transformOrigin: '62px 42px' }}
        filter="url(#miniGlow)"
      />
      <motion.rect x="38" y="55" width="24" height="4" rx="2" fill="var(--accent-purple)"
        animate={speaking ? { height: [4, 10, 4], y: [55, 52, 55] } : {}}
        transition={{ duration: 0.3, repeat: Infinity }}
      />
      <rect x="20" y="70" width="60" height="40" rx="8" fill="var(--bg-secondary, #0f0f2e)" stroke="var(--accent-purple)" strokeWidth="2" />
      <motion.circle cx="50" cy="88" r="6" fill="none" stroke="var(--accent-cyan)" strokeWidth="1.5"
        animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.4, 1, 0.4] }}
        transition={{ duration: 2, repeat: Infinity }}
        style={{ transformOrigin: '50px 88px' }}
      />
      <defs>
        <filter id="miniGlow" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="2" result="blur" />
          <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
        </filter>
      </defs>
    </svg>
  );
}

function speakAssistant(text) {
  if (!('speechSynthesis' in window)) return;
  speechSynthesis.cancel();
  const clean = text.replace(/[*#🔸⚡🔧👑🏆📊🚀💪🤖❓📖🌌]/g, '').replace(/\n/g, '. ');
  const utterance = new SpeechSynthesisUtterance(clean);
  utterance.rate = 1;
  utterance.pitch = 0.9;
  utterance.volume = 0.8;
  const voices = speechSynthesis.getVoices();
  const voice = voices.find(v => v.lang.startsWith('en')) || voices[0];
  if (voice) utterance.voice = voice;
  speechSynthesis.speak(utterance);
}

export default function AIAssistant({ playerName = 'Cadet', nextModulePath }) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [input, setInput] = useState('');
  const [isTyping, setIsTyping] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const chatEndRef = useRef(null);

  useEffect(() => {
    chatEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const addBotMessage = (text, action) => {
    setIsTyping(true);
    setTimeout(() => {
      setMessages(prev => [...prev, { from: 'bot', text, action, time: new Date() }]);
      setIsTyping(false);
    }, 600 + Math.random() * 400);
  };

  const handleOpen = () => {
    setIsOpen(true);
    if (messages.length === 0) {
      setTimeout(() => {
        addBotMessage(
          `Hey ${playerName}! 👋 I'm **Nebu**, your AI learning assistant. How can I help you today?`,
        );
      }, 300);
    }
  };

  const handleQuickAction = (actionKey) => {
    const userLabel = QUICK_ACTIONS.find(a => a.action === actionKey)?.label || actionKey;
    setMessages(prev => [...prev, { from: 'user', text: userLabel, time: new Date() }]);

    const responseFn = RESPONSES[actionKey] || RESPONSES.default;
    const response = responseFn(playerName);

    setTimeout(() => addBotMessage(response.text, response.action), 200);
  };

  const handleSend = () => {
    if (!input.trim()) return;
    const userText = input.trim();
    setInput('');
    setMessages(prev => [...prev, { from: 'user', text: userText, time: new Date() }]);

    // Simple keyword matching for responses
    const lowerText = userText.toLowerCase();
    let responseKey = 'default';
    if (lowerText.includes('next') || lowerText.includes('module') || lowerText.includes('start')) {
      responseKey = 'next_module';
    } else if (lowerText.includes('progress') || lowerText.includes('how am i')) {
      responseKey = 'progress';
    } else if (lowerText.includes('badge') || lowerText.includes('achievement')) {
      responseKey = 'achievements';
    } else if (lowerText.includes('nebula') || lowerText.includes('what is') || lowerText.includes('about')) {
      responseKey = 'about';
    } else if (lowerText.includes('practice') || lowerText.includes('quiz') || lowerText.includes('3d')) {
      responseKey = 'practice_help';
    } else if (lowerText.includes('phase') || lowerText.includes('spark') || lowerText.includes('build') || lowerText.includes('master')) {
      responseKey = 'phases';
    }

    const responseFn = RESPONSES[responseKey] || RESPONSES.default;
    const response = responseFn(playerName);
    setTimeout(() => addBotMessage(response.text, response.action), 200);
  };

  const handleActionClick = (action) => {
    if (!action) return;
    if (action.type === 'navigate') {
      if (action.path === 'next_module' && nextModulePath) {
        navigate(nextModulePath);
      } else {
        navigate(action.path);
      }
    }
  };

  const handleSpeak = (text) => {
    setSpeaking(true);
    speakAssistant(text);
    setTimeout(() => setSpeaking(false), 3000);
  };

  return (
    <>
      {/* Floating button */}
      <AnimatePresence>
        {!isOpen && (
          <motion.button
            className="ai-fab"
            onClick={handleOpen}
            initial={{ scale: 0 }}
            animate={{ scale: 1 }}
            exit={{ scale: 0 }}
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
          >
            <MiniRobot speaking={false} size={28} />
            <motion.div
              className="ai-fab-pulse"
              animate={{ scale: [1, 1.5, 1], opacity: [0.5, 0, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
            />
            <span className="ai-fab-label">Ask Nebu</span>
          </motion.button>
        )}
      </AnimatePresence>

      {/* Chat panel */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            className="ai-chat"
            initial={{ opacity: 0, y: 20, scale: 0.9 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.9 }}
            transition={{ type: 'spring', stiffness: 300, damping: 25 }}
          >
            {/* Header */}
            <div className="ai-chat-header">
              <div className="ai-chat-avatar">
                <MiniRobot speaking={speaking} size={32} />
              </div>
              <div className="ai-chat-info">
                <h4>Nebu <Sparkles size={12} className="ai-sparkle" /></h4>
                <span className="ai-status">AI Learning Assistant</span>
              </div>
              <button className="ai-close" onClick={() => setIsOpen(false)}>
                <X size={16} />
              </button>
            </div>

            {/* Messages */}
            <div className="ai-chat-messages">
              {messages.map((msg, i) => (
                <motion.div
                  key={i}
                  className={`ai-msg ${msg.from}`}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.05 }}
                >
                  {msg.from === 'bot' && (
                    <div className="ai-msg-avatar">
                      <Bot size={14} />
                    </div>
                  )}
                  <div className="ai-msg-content">
                    <p>{msg.text}</p>
                    {msg.action && (
                      <button className="ai-action-btn" onClick={() => handleActionClick(msg.action)}>
                        <ArrowRight size={12} />
                        {msg.action.label || 'Go'}
                      </button>
                    )}
                    {msg.from === 'bot' && (
                      <button className="ai-speak-btn" onClick={() => handleSpeak(msg.text)} title="Read aloud">
                        <Volume2 size={11} />
                      </button>
                    )}
                  </div>
                </motion.div>
              ))}
              {isTyping && (
                <div className="ai-msg bot">
                  <div className="ai-msg-avatar"><Bot size={14} /></div>
                  <div className="ai-typing">
                    <span /><span /><span />
                  </div>
                </div>
              )}
              <div ref={chatEndRef} />
            </div>

            {/* Quick actions */}
            {messages.length <= 1 && (
              <div className="ai-quick-actions">
                {QUICK_ACTIONS.map((qa) => (
                  <button key={qa.action} className="ai-quick-btn" onClick={() => handleQuickAction(qa.action)}>
                    {qa.label}
                  </button>
                ))}
              </div>
            )}

            {/* Input */}
            <div className="ai-chat-input">
              <input
                type="text"
                placeholder="Ask Nebu anything..."
                value={input}
                onChange={(e) => setInput(e.target.value)}
                onKeyDown={(e) => e.key === 'Enter' && handleSend()}
              />
              <button className="ai-send" onClick={handleSend} disabled={!input.trim()}>
                <Send size={14} />
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
