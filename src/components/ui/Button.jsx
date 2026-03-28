import { motion } from 'framer-motion';
import './Button.css';

export default function Button({ children, variant = 'primary', size = 'md', icon, onClick, disabled, className = '', glow = false }) {
  return (
    <motion.button
      className={`btn btn-${variant} btn-${size} ${glow ? 'btn-glow' : ''} ${className}`}
      onClick={onClick}
      disabled={disabled}
      whileHover={{ scale: 1.05 }}
      whileTap={{ scale: 0.95 }}
    >
      {icon && <span className="btn-icon">{icon}</span>}
      {children}
    </motion.button>
  );
}
