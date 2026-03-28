import { useState, useRef, Suspense } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float } from '@react-three/drei';
import { motion, AnimatePresence } from 'framer-motion';
import './LabeledRobotModel.css';

// Robot part definitions with 3D positions and descriptions
const ROBOT_PARTS = [
  { id: 'base', label: 'Base Plate', pos: [0, -1.3, 0], color: '#6b94c4', desc: 'Heavy foundation that anchors the robot to the floor. Absorbs vibration and provides stability during high-speed operation.' },
  { id: 'waist', label: 'J1 – Waist', pos: [0, -0.8, 0], color: '#5b83b3', desc: 'Joint 1 (Waist): Rotates the entire upper body 360°. This is the most powerful joint, handling the full payload.' },
  { id: 'shoulder', label: 'J2 – Shoulder', pos: [0, -0.2, 0], color: '#4a6f99', desc: 'Joint 2 (Shoulder): Tilts the main arm forward and backward. Critical for reach and lifting capacity.' },
  { id: 'elbow', label: 'J3 – Elbow', pos: [0.6, 0.3, 0], color: '#a78bfa', desc: 'Joint 3 (Elbow): Extends and retracts the forearm. Works with J2 for vertical positioning.' },
  { id: 'forearm', label: 'J4 – Forearm', pos: [1.0, 0.5, 0], color: '#7c3aed', desc: 'Joint 4 (Forearm Roll): Rotates the forearm along its axis. Enables wrist orientation adjustments.' },
  { id: 'wrist-bend', label: 'J5 – Wrist Bend', pos: [1.3, 0.6, 0], color: '#00e5ff', desc: 'Joint 5 (Wrist Bend): Tilts the end-effector up/down. Provides fine angular control for tool positioning.' },
  { id: 'wrist-twist', label: 'J6 – Wrist Twist', pos: [1.5, 0.65, 0], color: '#0097a7', desc: 'Joint 6 (Wrist Twist): Rotates the tool flange 360°. The fastest joint, used for screw driving and part orientation.' },
  { id: 'flange', label: 'Tool Flange', pos: [1.7, 0.7, 0], color: '#ff6d00', desc: 'Mounting interface for end-of-arm tooling (EOAT). Standardized bolt pattern (ISO 9409) for interchangeable grippers and tools.' },
];

// Simple 3D robot arm
function RobotArm3D({ selectedPart, onSelectPart }) {
  const groupRef = useRef();

  useFrame(({ clock }) => {
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(clock.getElapsedTime() * 0.15) * 0.3;
    }
  });

  const partColor = (partId, defaultColor) => {
    if (selectedPart === partId) return '#3b6de0';
    return defaultColor;
  };

  const partEmissive = (partId) => selectedPart === partId ? 0.4 : 0;

  return (
    <group ref={groupRef} position={[0, 0, 0]}>
      {/* Base */}
      <mesh position={[0, -1.3, 0]} onClick={() => onSelectPart('base')}>
        <cylinderGeometry args={[0.6, 0.7, 0.2, 32]} />
        <meshStandardMaterial color={partColor('base', '#6b94c4')} emissiveIntensity={partEmissive('base')} emissive="#3b6de0" />
      </mesh>

      {/* Waist joint */}
      <mesh position={[0, -0.9, 0]} onClick={() => onSelectPart('waist')}>
        <cylinderGeometry args={[0.3, 0.4, 0.6, 24]} />
        <meshStandardMaterial color={partColor('waist', '#5b83b3')} emissiveIntensity={partEmissive('waist')} emissive="#3b6de0" />
      </mesh>

      {/* Shoulder */}
      <mesh position={[0, -0.3, 0]} onClick={() => onSelectPart('shoulder')}>
        <sphereGeometry args={[0.25, 16, 16]} />
        <meshStandardMaterial color={partColor('shoulder', '#4a6f99')} emissiveIntensity={partEmissive('shoulder')} emissive="#3b6de0" />
      </mesh>

      {/* Upper arm */}
      <mesh position={[0.3, 0.05, 0]} rotation={[0, 0, -0.8]} onClick={() => onSelectPart('elbow')}>
        <boxGeometry args={[0.12, 0.7, 0.12]} />
        <meshStandardMaterial color={partColor('elbow', '#a78bfa')} emissiveIntensity={partEmissive('elbow')} emissive="#7c3aed" />
      </mesh>

      {/* Elbow joint */}
      <mesh position={[0.55, 0.3, 0]} onClick={() => onSelectPart('elbow')}>
        <sphereGeometry args={[0.15, 16, 16]} />
        <meshStandardMaterial color={partColor('elbow', '#a78bfa')} emissiveIntensity={partEmissive('elbow')} emissive="#7c3aed" />
      </mesh>

      {/* Forearm */}
      <mesh position={[0.85, 0.45, 0]} rotation={[0, 0, -0.3]} onClick={() => onSelectPart('forearm')}>
        <boxGeometry args={[0.1, 0.55, 0.1]} />
        <meshStandardMaterial color={partColor('forearm', '#7c3aed')} emissiveIntensity={partEmissive('forearm')} emissive="#7c3aed" />
      </mesh>

      {/* Wrist bend joint */}
      <mesh position={[1.1, 0.55, 0]} onClick={() => onSelectPart('wrist-bend')}>
        <sphereGeometry args={[0.1, 16, 16]} />
        <meshStandardMaterial color={partColor('wrist-bend', '#0097a7')} emissiveIntensity={partEmissive('wrist-bend')} emissive="#0097a7" />
      </mesh>

      {/* Wrist twist */}
      <mesh position={[1.3, 0.6, 0]} rotation={[0, 0, -0.15]} onClick={() => onSelectPart('wrist-twist')}>
        <cylinderGeometry args={[0.06, 0.08, 0.2, 16]} />
        <meshStandardMaterial color={partColor('wrist-twist', '#0097a7')} emissiveIntensity={partEmissive('wrist-twist')} emissive="#0097a7" />
      </mesh>

      {/* Tool flange */}
      <mesh position={[1.45, 0.63, 0]} onClick={() => onSelectPart('flange')}>
        <cylinderGeometry args={[0.08, 0.08, 0.06, 16]} />
        <meshStandardMaterial color={partColor('flange', '#ff6d00')} emissiveIntensity={partEmissive('flange')} emissive="#ff6d00" />
      </mesh>
    </group>
  );
}

export default function LabeledRobotModel({ selectedPart: externalSelected, onSelectPart: externalOnSelect }) {
  const [internalSelectedPart, setInternalSelectedPart] = useState(null);
  const selectedPart = externalSelected !== undefined ? externalSelected : internalSelectedPart;
  const onSelectPart = externalOnSelect || ((id) => setInternalSelectedPart(id === internalSelectedPart ? null : id));

  const selectedInfo = ROBOT_PARTS.find(p => p.id === selectedPart);

  return (
    <div className="labeled-robot-container">
      <div className="labeled-robot-3d">
        <Canvas camera={{ position: [2, 0.5, 3], fov: 40 }}>
          <ambientLight intensity={0.6} />
          <directionalLight position={[3, 5, 3]} intensity={1} />
          <pointLight position={[-2, 1, 3]} intensity={0.4} color="#a78bfa" />
          <Suspense fallback={null}>
            <RobotArm3D selectedPart={selectedPart} onSelectPart={onSelectPart} />
          </Suspense>
          <OrbitControls enableZoom={true} enablePan={false} maxPolarAngle={Math.PI / 1.5} minPolarAngle={Math.PI / 4} />
        </Canvas>
      </div>

      <div className="labeled-robot-info">
        <h4>Robot Components</h4>
        <div className="labeled-parts-list">
          {ROBOT_PARTS.map(part => (
            <button
              key={part.id}
              className={`labeled-part-item ${selectedPart === part.id ? 'selected' : ''}`}
              onClick={() => onSelectPart(part.id)}
            >
              <span className="labeled-part-dot" style={{ background: part.color }} />
              <span className="labeled-part-name">{part.label}</span>
            </button>
          ))}
        </div>

        {/* Selected part detail */}
        <AnimatePresence>
          {selectedInfo && (
            <motion.div
              className="labeled-part-detail"
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
            >
              <h5>{selectedInfo.label}</h5>
              <p>{selectedInfo.desc}</p>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
