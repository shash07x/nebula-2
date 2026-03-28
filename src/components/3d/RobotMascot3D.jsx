import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { Sparkles, Trophy, RotateCcw, GitBranch, X } from 'lucide-react';
import './RobotMascot3D.css';

// Programmatic 3D Humanoid Robot — sleek, modern design
function Robot3DBody() {
  const bodyRef = useRef();
  const headRef = useRef();
  const leftArmRef = useRef();
  const rightArmRef = useRef();

  useFrame(({ clock }) => {
    const t = clock.getElapsedTime();
    if (bodyRef.current) {
      bodyRef.current.position.y = Math.sin(t * 0.8) * 0.08;
      bodyRef.current.rotation.y = Math.sin(t * 0.3) * 0.12;
    }
    if (headRef.current) {
      headRef.current.rotation.z = Math.sin(t * 1.2) * 0.04;
      headRef.current.rotation.x = Math.sin(t * 0.7) * 0.03;
    }
    if (leftArmRef.current) {
      leftArmRef.current.rotation.x = Math.sin(t * 0.5) * 0.12;
    }
    if (rightArmRef.current) {
      rightArmRef.current.rotation.x = Math.sin(t * 0.5 + 1.5) * 0.12;
    }
  });

  // Modern robot colors — white/silver for light theme
  const bodyMain = '#c8d0da';      // Light silver
  const bodyAccent = '#a0b0c0';    // Slightly darker silver
  const visorColor = '#3b6de0';    // Blue visor
  const jointColor = '#8094a8';    // Joint color
  const glowColor = '#00d4e5';     // Teal glow
  const chestColor = '#3b6de0';    // Blue chest accent

  return (
    <group ref={bodyRef} position={[0, -0.2, 0]}>
      {/* Torso — rounded capsule shape */}
      <mesh position={[0, 0, 0]}>
        <capsuleGeometry args={[0.3, 0.6, 8, 16]} />
        <meshStandardMaterial color={bodyMain} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Chest panel — blue accent strip */}
      <mesh position={[0, 0.1, 0.31]}>
        <boxGeometry args={[0.25, 0.15, 0.01]} />
        <meshStandardMaterial color={chestColor} emissive={chestColor} emissiveIntensity={0.5} metalness={0.7} roughness={0.2} />
      </mesh>

      {/* Core light */}
      <mesh position={[0, -0.05, 0.31]}>
        <sphereGeometry args={[0.06, 16, 16]} />
        <meshStandardMaterial color={glowColor} emissive={glowColor} emissiveIntensity={3} />
      </mesh>

      {/* Head — smooth rounded */}
      <group ref={headRef} position={[0, 0.85, 0]}>
        {/* Skull */}
        <mesh>
          <sphereGeometry args={[0.32, 24, 24]} />
          <meshStandardMaterial color={bodyMain} metalness={0.5} roughness={0.3} />
        </mesh>

        {/* Visor — single wide eye piece */}
        <mesh position={[0, 0.02, 0.26]}>
          <boxGeometry args={[0.4, 0.12, 0.08]} />
          <meshStandardMaterial color={visorColor} emissive={visorColor} emissiveIntensity={2} metalness={0.8} roughness={0.1} />
        </mesh>

        {/* Forehead ridge */}
        <mesh position={[0, 0.15, 0.22]}>
          <boxGeometry args={[0.35, 0.03, 0.06]} />
          <meshStandardMaterial color={bodyAccent} metalness={0.6} roughness={0.3} />
        </mesh>

        {/* Neck */}
        <mesh position={[0, -0.3, 0]}>
          <cylinderGeometry args={[0.08, 0.12, 0.15, 12]} />
          <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
        </mesh>
      </group>

      {/* Shoulders — sphere joints */}
      <mesh position={[-0.42, 0.3, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
      </mesh>
      <mesh position={[0.42, 0.3, 0]}>
        <sphereGeometry args={[0.1, 12, 12]} />
        <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Left Arm */}
      <group ref={leftArmRef} position={[-0.5, 0.15, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <capsuleGeometry args={[0.05, 0.2, 6, 12]} />
          <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
        </mesh>
        {/* Hand */}
        <mesh position={[0, -0.85, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={bodyMain} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Right Arm */}
      <group ref={rightArmRef} position={[0.5, 0.15, 0]}>
        <mesh position={[0, -0.2, 0]}>
          <capsuleGeometry args={[0.06, 0.3, 6, 12]} />
          <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.45, 0]}>
          <sphereGeometry args={[0.06, 12, 12]} />
          <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.65, 0]}>
          <capsuleGeometry args={[0.05, 0.2, 6, 12]} />
          <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
        </mesh>
        <mesh position={[0, -0.85, 0]}>
          <sphereGeometry args={[0.07, 12, 12]} />
          <meshStandardMaterial color={bodyMain} metalness={0.5} roughness={0.3} />
        </mesh>
      </group>

      {/* Hip */}
      <mesh position={[0, -0.55, 0]}>
        <boxGeometry args={[0.4, 0.15, 0.3]} />
        <meshStandardMaterial color={bodyAccent} metalness={0.5} roughness={0.3} />
      </mesh>

      {/* Legs */}
      {[-0.15, 0.15].map((xOff, i) => (
        <group key={i} position={[xOff, -0.7, 0]}>
          <mesh position={[0, -0.05, 0]}>
            <sphereGeometry args={[0.06, 12, 12]} />
            <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.25, 0]}>
            <capsuleGeometry args={[0.06, 0.25, 6, 12]} />
            <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.45, 0]}>
            <sphereGeometry args={[0.05, 12, 12]} />
            <meshStandardMaterial color={jointColor} metalness={0.6} roughness={0.4} />
          </mesh>
          <mesh position={[0, -0.6, 0]}>
            <capsuleGeometry args={[0.05, 0.15, 6, 12]} />
            <meshStandardMaterial color={bodyAccent} metalness={0.4} roughness={0.4} />
          </mesh>
          {/* Foot */}
          <mesh position={[0, -0.78, 0.04]}>
            <boxGeometry args={[0.14, 0.06, 0.22]} />
            <meshStandardMaterial color={bodyMain} metalness={0.5} roughness={0.3} />
          </mesh>
        </group>
      ))}
    </group>
  );
}

export default function RobotMascot3D({ onOpenSpinWheel, onOpenRecap }) {
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [minimized, setMinimized] = useState(false);

  const actions = [
    { key: 'spin', label: 'Spin Wheel', icon: <Sparkles size={16} />, color: '#ff6d00', onClick: () => { setMenuOpen(false); onOpenSpinWheel?.(); } },
    { key: 'skill', label: 'Skill Tree', icon: <GitBranch size={16} />, color: '#4f8cff', onClick: () => { setMenuOpen(false); navigate('/skill-tree'); } },
    { key: 'recap', label: 'Recap', icon: <RotateCcw size={16} />, color: '#a855f7', onClick: () => { setMenuOpen(false); onOpenRecap?.(); } },
    { key: 'leader', label: 'Leaderboard', icon: <Trophy size={16} />, color: '#ffd700', onClick: () => { setMenuOpen(false); navigate('/leaderboard'); } },
  ];

  if (minimized) {
    return (
      <motion.button
        className="mascot-mini-btn"
        initial={{ scale: 0 }}
        animate={{ scale: 1 }}
        onClick={() => setMinimized(false)}
        whileHover={{ scale: 1.1 }}
      >
        🤖
      </motion.button>
    );
  }

  return (
    <div className="mascot-container">
      {/* 3D Canvas */}
      <div className="mascot-canvas" onClick={() => setMenuOpen(!menuOpen)}>
        <Canvas camera={{ position: [0, 0, 3.5], fov: 45 }} style={{ cursor: 'pointer' }}>
          <ambientLight intensity={0.7} />
          <directionalLight position={[3, 5, 3]} intensity={1.2} color="#ffffff" />
          <pointLight position={[-2, 2, 2]} intensity={0.5} color="#a78bfa" />
          <pointLight position={[0, -1, 3]} intensity={0.4} color="#00e5ff" />
          <Suspense fallback={null}>
            <Float speed={1.5} rotationIntensity={0.1} floatIntensity={0.3}>
              <Robot3DBody />
            </Float>
          </Suspense>
          <OrbitControls enableZoom={false} enablePan={false} maxPolarAngle={Math.PI / 1.8} minPolarAngle={Math.PI / 3} />
        </Canvas>
      </div>

      {/* Name tag */}
      <div className="mascot-name">
        <span>NEBULA</span>
        <button className="mascot-minimize" onClick={() => setMinimized(true)}><X size={10} /></button>
      </div>

      {/* Action menu */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            className="mascot-menu"
            initial={{ opacity: 0, scale: 0.8, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 25 }}
          >
            {actions.map((action, i) => (
              <motion.button
                key={action.key}
                className="mascot-action"
                style={{ '--action-color': action.color }}
                onClick={action.onClick}
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.06 }}
                whileHover={{ scale: 1.05 }}
              >
                <span className="mascot-action-icon" style={{ color: action.color }}>{action.icon}</span>
                <span>{action.label}</span>
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
