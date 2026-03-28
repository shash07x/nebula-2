import { useState } from 'react';
import { motion } from 'framer-motion';
import { RotateCw, Maximize2, Minimize2, Info } from 'lucide-react';
import './RobotEmbed.css';

// Verified real Sketchfab models
const ROBOT_MODELS = [
  {
    id: 'industrial-arm',
    name: 'Industrial Robot Arm',
    src: 'https://sketchfab.com/models/b4b5931851754747a734f72234c87e38/embed?autostart=1&ui_theme=dark&dnt=1',
    desc: 'Interactive 3D industrial robot arm — drag to rotate, scroll to zoom',
  },
  {
    id: '6-axis-robot',
    name: '6-Axis Robot Arm',
    src: 'https://sketchfab.com/models/3ecc74c22c584b2b8295f17dedcdb89f/embed?autostart=1&ui_theme=dark&dnt=1',
    desc: '6-axis industrial robot arm for manufacturing',
  },
];

export default function RobotEmbed({ className, compact = false }) {
  const [activeModel, setActiveModel] = useState(0);
  const [fullscreen, setFullscreen] = useState(false);
  const [showInfo, setShowInfo] = useState(false);
  const [iframeError, setIframeError] = useState(false);
  const model = ROBOT_MODELS[activeModel] || ROBOT_MODELS[0];

  return (
    <motion.div
      className={`robot-embed ${fullscreen ? 'fullscreen' : ''} ${compact ? 'compact' : ''} ${className || ''}`}
      layout
    >
      <div className="robot-embed-header">
        <div className="robot-embed-title">
          <span className="robot-embed-badge">🤖 3D MODEL</span>
          <h4>{model.name}</h4>
        </div>
        <div className="robot-embed-controls">
          <button
            className="robot-ctrl-btn"
            onClick={() => setShowInfo(!showInfo)}
            title="Info"
          >
            <Info size={14} />
          </button>
          <button
            className="robot-ctrl-btn"
            onClick={() => {
              setIframeError(false);
              setActiveModel((activeModel + 1) % ROBOT_MODELS.length);
            }}
            title="Switch Model"
          >
            <RotateCw size={14} />
          </button>
          <button
            className="robot-ctrl-btn"
            onClick={() => setFullscreen(!fullscreen)}
            title={fullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {fullscreen ? <Minimize2 size={14} /> : <Maximize2 size={14} />}
          </button>
        </div>
      </div>

      {showInfo && (
        <motion.div
          className="robot-embed-info"
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
        >
          <p>{model.desc}</p>
          <p className="robot-embed-tip">🖱️ <strong>Drag</strong> to rotate · <strong>Scroll</strong> to zoom · <strong>Right-click</strong> to pan</p>
        </motion.div>
      )}

      <div className="robot-embed-frame">
        {!iframeError ? (
          <iframe
            key={model.id}
            title={model.name}
            src={model.src}
            frameBorder="0"
            allow="autoplay; fullscreen; xr-spatial-tracking"
            allowFullScreen
            loading="lazy"
            onError={() => setIframeError(true)}
          />
        ) : (
          <div className="robot-embed-fallback">
            <div className="fallback-robot">🤖</div>
            <p>3D model preview unavailable</p>
            <p className="fallback-sub">Use the interactive 3D viewer in the Practice step instead</p>
            <button className="fallback-retry" onClick={() => setIframeError(false)}>
              <RotateCw size={12} /> Retry
            </button>
          </div>
        )}
        <div className="robot-embed-glow" />
      </div>

      <div className="robot-embed-dots">
        {ROBOT_MODELS.map((_, i) => (
          <button
            key={i}
            className={`robot-dot ${i === activeModel ? 'active' : ''}`}
            onClick={() => { setIframeError(false); setActiveModel(i); }}
          />
        ))}
      </div>
    </motion.div>
  );
}
