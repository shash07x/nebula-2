import { motion } from 'framer-motion';
import './Badge.css';

export default function Badge({ icon, name, earned = false, size = 'md', description }) {
  return (
    <motion.div
      className={`badge badge-${size} ${earned ? 'earned' : 'locked'}`}
      whileHover={earned ? { scale: 1.1, rotate: 5 } : {}}
      initial={{ scale: 0 }}
      animate={{ scale: 1 }}
      transition={{ type: 'spring', stiffness: 260, damping: 20 }}
      title={description || name}
    >
      <div className="badge-icon-wrap">
        <span className="badge-icon">{icon}</span>
        {earned && <div className="badge-ring" />}
      </div>
      {name && <span className="badge-name">{name}</span>}
    </motion.div>
  );
}
