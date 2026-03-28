import { motion } from 'framer-motion';
import { Lock, ArrowRight, Clock, Target } from 'lucide-react';
import { NEXT_SKILL_PIPELINES } from '../../data/courseData';
import './NextSkillPipeline.css';

export default function NextSkillPipeline({ unlocked = false }) {
  return (
    <div className="nsp-section">
      <div className="nsp-header">
        <h3>🚀 What's Next?</h3>
        <p className="nsp-subtitle">
          {unlocked
            ? 'Congratulations! You\'ve unlocked advanced learning pipelines.'
            : 'Complete the capstone project to unlock your next learning journey.'}
        </p>
      </div>
      <div className="nsp-grid">
        {NEXT_SKILL_PIPELINES.map((pipeline, i) => (
          <motion.div
            key={pipeline.id}
            className={`nsp-card ${!unlocked ? 'locked' : ''}`}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            whileHover={unlocked ? { scale: 1.02, y: -4 } : {}}
          >
            <div className="nsp-card-icon">{pipeline.icon}</div>
            <h4>{pipeline.title}</h4>
            <p className="nsp-card-desc">{pipeline.description}</p>
            <div className="nsp-card-meta">
              <span><Clock size={12} /> {pipeline.duration}</span>
              <span><Target size={12} /> {pipeline.suitedFor}</span>
            </div>
            {!unlocked ? (
              <div className="nsp-locked-overlay">
                <Lock size={20} />
                <span>Complete Capstone to Unlock</span>
              </div>
            ) : (
              <button className="nsp-start-btn">
                Explore <ArrowRight size={14} />
              </button>
            )}
          </motion.div>
        ))}
      </div>
    </div>
  );
}
