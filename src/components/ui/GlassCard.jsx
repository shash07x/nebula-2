import { motion } from 'framer-motion';
import './GlassCard.css';

export default function GlassCard({ children, className = '', glow, onClick, animate = true, style }) {
  const Component = animate ? motion.div : 'div';
  const animateProps = animate ? {
    initial: { opacity: 0, y: 20 },
    animate: { opacity: 1, y: 0 },
    transition: { duration: 0.4 },
    whileHover: onClick ? { scale: 1.02, y: -4 } : undefined,
  } : {};

  return (
    <Component
      className={`glass-card ${glow ? `glow-${glow}` : ''} ${onClick ? 'clickable' : ''} ${className}`}
      onClick={onClick}
      style={style}
      {...animateProps}
    >
      {children}
    </Component>
  );
}
