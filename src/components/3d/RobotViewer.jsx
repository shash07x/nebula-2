import { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Float, OrbitControls } from '@react-three/drei';
import * as THREE from 'three';

function RobotArmInteractive({ onJointClick }) {
  const groupRef = useRef();
  const joint1Ref = useRef();
  const joint2Ref = useRef();
  const joint3Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (joint1Ref.current) joint1Ref.current.rotation.y = Math.sin(t * 0.3) * 0.3;
    if (joint2Ref.current) joint2Ref.current.rotation.z = Math.sin(t * 0.4 + 0.5) * 0.3 - 0.1;
    if (joint3Ref.current) joint3Ref.current.rotation.z = Math.sin(t * 0.5 + 1) * 0.2;
  });

  const handleClick = (partName, e) => {
    e.stopPropagation();
    if (onJointClick) onJointClick(partName);
  };

  return (
    <group ref={groupRef} position={[0, -2.5, 0]}>
      {/* Base Platform */}
      <mesh position={[0, 0.25, 0]} onClick={(e) => handleClick('Base Plate', e)}>
        <cylinderGeometry args={[1.0, 1.2, 0.5, 32]} />
        <meshStandardMaterial color="#cbd5e1" metalness={0.6} roughness={0.4} />
      </mesh>

      {/* Joint 1 (Waist) */}
      <group ref={joint1Ref} position={[0, 0.7, 0]}>
        <mesh onClick={(e) => handleClick('Joint 1 (Waist)', e)}>
          <cylinderGeometry args={[0.6, 0.6, 0.4, 32]} />
          <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Link 1 (Shoulder Pivot) */}
        <mesh position={[0, 0.4, 0]} onClick={(e) => handleClick('Joint 2 (Shoulder)', e)}>
          <sphereGeometry args={[0.5, 32, 32]} />
          <meshStandardMaterial color="#f97316" metalness={0.3} roughness={0.5} />
        </mesh>

        {/* Arm 1 (Bicep) - attached at shoulder height */}
        <group position={[0, 0.4, 0]}>
          <mesh position={[0, 0.75, 0]} onClick={(e) => handleClick('Link 1 (Upper Arm)', e)}>
            <cylinderGeometry args={[0.2, 0.25, 1.5, 16]} />
            <meshStandardMaterial color="#f97316" metalness={0.3} roughness={0.5} />
          </mesh>

          {/* Joint 2 (Elbow) */}
          <group ref={joint2Ref} position={[0, 1.5, 0]}>
            <mesh onClick={(e) => handleClick('Joint 3 (Elbow)', e)}>
              <sphereGeometry args={[0.35, 32, 32]} />
              <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
            </mesh>

            {/* Arm 2 (Forearm) */}
            <mesh position={[0, 0.6, 0]} onClick={(e) => handleClick('Link 2 (Forearm)', e)}>
              <cylinderGeometry args={[0.15, 0.2, 1.2, 16]} />
              <meshStandardMaterial color="#f97316" metalness={0.3} roughness={0.5} />
            </mesh>

            {/* Joint 3 (Wrist) */}
            <group ref={joint3Ref} position={[0, 1.2, 0]}>
              <mesh onClick={(e) => handleClick('Joint 4 (Wrist)', e)}>
                <sphereGeometry args={[0.2, 32, 32]} />
                <meshStandardMaterial color="#334155" metalness={0.8} roughness={0.2} />
              </mesh>

              {/* End Effector (Welding Tool/Gripper) */}
              <group position={[0, 0.3, 0]} rotation={[0, 0, Math.PI / 4]} onClick={(e) => handleClick('End Effector (Tooling)', e)}>
                <mesh>
                  <coneGeometry args={[0.15, 0.6, 16]} />
                  <meshStandardMaterial color="#f1f5f9" metalness={0.9} roughness={0.1} />
                </mesh>
                {/* Simulated thick cables */}
                <mesh position={[-0.1, -0.2, 0.1]} rotation={[0, 0, Math.PI / -6]}>
                  <cylinderGeometry args={[0.03, 0.03, 0.5, 8]} />
                  <meshStandardMaterial color="#1e293b" />
                </mesh>
              </group>
            </group>
          </group>
        </group>
      </group>

      {/* Axis indicators */}
      <mesh position={[2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
        <meshStandardMaterial color="#ef4444" emissive="#ef4444" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 2, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
        <meshStandardMaterial color="#22c55e" emissive="#22c55e" emissiveIntensity={0.5} />
      </mesh>
      <mesh position={[0, 0, 2]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.02, 0.02, 4, 8]} />
        <meshStandardMaterial color="#3b82f6" emissive="#3b82f6" emissiveIntensity={0.5} />
      </mesh>
    </group>
  );
}

export default function RobotViewer({ onJointClick, style }) {
  return (
    <div style={{ width: '100%', height: '100%', minHeight: 400, ...style }}>
      <Canvas
        camera={{ position: [5, 4, 7], fov: 45 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent', borderRadius: 20 }}
      >
        <ambientLight intensity={0.4} />
        <pointLight position={[5, 5, 5]} intensity={1.2} color="#4f8cff" />
        <pointLight position={[-5, 3, -5]} intensity={0.8} color="#a855f7" />
        <pointLight position={[0, 8, 0]} intensity={0.6} color="#ffffff" />

        <Float speed={0.8} rotationIntensity={0} floatIntensity={0.3}>
          <RobotArmInteractive onJointClick={onJointClick} />
        </Float>

        <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2.1, 0]}>
          <planeGeometry args={[20, 20, 20, 20]} />
          <meshStandardMaterial color="#4f8cff" wireframe transparent opacity={0.06} />
        </mesh>

        <OrbitControls
          enableZoom
          enablePan={false}
          minDistance={5}
          maxDistance={15}
          maxPolarAngle={Math.PI / 2}
        />
      </Canvas>
    </div>
  );
}
