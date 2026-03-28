import { useRef, useMemo } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { OrbitControls, Float, Stars } from '@react-three/drei';
import * as THREE from 'three';

function RobotArm() {
  const groupRef = useRef();
  const joint1Ref = useRef();
  const joint2Ref = useRef();

  useFrame((state) => {
    const t = state.clock.elapsedTime;
    if (joint1Ref.current) {
      joint1Ref.current.rotation.y = Math.sin(t * 0.5) * 0.5;
    }
    if (joint2Ref.current) {
      joint2Ref.current.rotation.z = Math.sin(t * 0.7 + 1) * 0.4 - 0.2;
    }
    if (groupRef.current) {
      groupRef.current.rotation.y = Math.sin(t * 0.15) * 0.1;
    }
  });

  return (
    <group ref={groupRef} position={[0, -1.5, 0]}>
      {/* Base */}
      <mesh position={[0, 0.2, 0]}>
        <cylinderGeometry args={[1.2, 1.4, 0.4, 32]} />
        <meshStandardMaterial color="#1a1a3e" metalness={0.9} roughness={0.2} />
      </mesh>
      <mesh position={[0, 0.05, 0]}>
        <cylinderGeometry args={[1.5, 1.5, 0.1, 32]} />
        <meshStandardMaterial color="#4f8cff" metalness={0.8} roughness={0.3} emissive="#4f8cff" emissiveIntensity={0.3} />
      </mesh>

      {/* Joint 1 - Rotation base */}
      <group ref={joint1Ref} position={[0, 0.5, 0]}>
        <mesh position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.4, 32, 32]} />
          <meshStandardMaterial color="#a855f7" metalness={0.7} roughness={0.3} emissive="#a855f7" emissiveIntensity={0.2} />
        </mesh>

        {/* Link 1 */}
        <mesh position={[0, 1.2, 0]}>
          <cylinderGeometry args={[0.2, 0.25, 1.4, 16]} />
          <meshStandardMaterial color="#1e1e4a" metalness={0.8} roughness={0.2} />
        </mesh>

        {/* Joint 2 */}
        <group ref={joint2Ref} position={[0, 1.9, 0]}>
          <mesh>
            <sphereGeometry args={[0.3, 32, 32]} />
            <meshStandardMaterial color="#00e5ff" metalness={0.7} roughness={0.3} emissive="#00e5ff" emissiveIntensity={0.2} />
          </mesh>

          {/* Link 2 */}
          <mesh position={[0, 0.8, 0]}>
            <cylinderGeometry args={[0.15, 0.2, 1.2, 16]} />
            <meshStandardMaterial color="#1e1e4a" metalness={0.8} roughness={0.2} />
          </mesh>

          {/* End effector */}
          <group position={[0, 1.5, 0]}>
            <mesh>
              <sphereGeometry args={[0.2, 32, 32]} />
              <meshStandardMaterial color="#e040fb" metalness={0.7} roughness={0.3} emissive="#e040fb" emissiveIntensity={0.3} />
            </mesh>
            {/* Gripper fingers */}
            <mesh position={[-0.15, 0.3, 0]} rotation={[0, 0, 0.2]}>
              <boxGeometry args={[0.06, 0.3, 0.08]} />
              <meshStandardMaterial color="#4f8cff" metalness={0.8} roughness={0.2} emissive="#4f8cff" emissiveIntensity={0.2} />
            </mesh>
            <mesh position={[0.15, 0.3, 0]} rotation={[0, 0, -0.2]}>
              <boxGeometry args={[0.06, 0.3, 0.08]} />
              <meshStandardMaterial color="#4f8cff" metalness={0.8} roughness={0.2} emissive="#4f8cff" emissiveIntensity={0.2} />
            </mesh>
          </group>
        </group>
      </group>
    </group>
  );
}

function FloatingParticles({ count = 50 }) {
  const mesh = useRef();
  const positions = useMemo(() => {
    const pos = new Float32Array(count * 3);
    for (let i = 0; i < count; i++) {
      pos[i * 3] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 1] = (Math.random() - 0.5) * 20;
      pos[i * 3 + 2] = (Math.random() - 0.5) * 20;
    }
    return pos;
  }, [count]);

  useFrame((state) => {
    if (mesh.current) {
      mesh.current.rotation.y = state.clock.elapsedTime * 0.02;
      mesh.current.rotation.x = Math.sin(state.clock.elapsedTime * 0.01) * 0.1;
    }
  });

  return (
    <points ref={mesh}>
      <bufferGeometry>
        <bufferAttribute
          attach="attributes-position"
          count={count}
          array={positions}
          itemSize={3}
        />
      </bufferGeometry>
      <pointsMaterial size={0.05} color="#4f8cff" transparent opacity={0.6} sizeAttenuation />
    </points>
  );
}

function GridFloor() {
  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -1.7, 0]}>
      <planeGeometry args={[30, 30, 30, 30]} />
      <meshStandardMaterial
        color="#4f8cff"
        wireframe
        transparent
        opacity={0.08}
      />
    </mesh>
  );
}

export default function HeroScene({ className, style }) {
  return (
    <div className={className} style={{ width: '100%', height: '100%', ...style }}>
      <Canvas
        camera={{ position: [4, 3, 6], fov: 50 }}
        gl={{ antialias: true, alpha: true }}
        style={{ background: 'transparent' }}
      >
        <ambientLight intensity={0.3} />
        <pointLight position={[5, 5, 5]} intensity={1} color="#4f8cff" />
        <pointLight position={[-5, 3, -5]} intensity={0.8} color="#a855f7" />
        <pointLight position={[0, -2, 3]} intensity={0.5} color="#e040fb" />
        <spotLight
          position={[0, 8, 0]}
          angle={0.3}
          penumbra={1}
          intensity={1}
          color="#fff"
        />

        <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={1} />
        <FloatingParticles count={80} />
        <GridFloor />

        <Float speed={1.5} rotationIntensity={0.2} floatIntensity={0.5}>
          <RobotArm />
        </Float>

        <OrbitControls
          enableZoom={false}
          enablePan={false}
          autoRotate
          autoRotateSpeed={0.5}
          maxPolarAngle={Math.PI / 2}
          minPolarAngle={Math.PI / 4}
        />
      </Canvas>
    </div>
  );
}
