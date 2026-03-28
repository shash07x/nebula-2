import { useState, useRef, useEffect } from 'react';
import { useFrame } from '@react-three/fiber';
import { Box, Sphere, Cylinder, Text, Line, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Basic procedural robots to avoid external loading requirements
const SCARARobot = ({ color }) => (
  <group position={[0, 0, 0]}>
    <Cylinder args={[0.4, 0.5, 0.4]} position={[0, 0.2, 0]} material-color="#333" />
    <Cylinder args={[0.2, 0.2, 1.2]} position={[0, 1.0, 0]} material-color={color} />
    <Box args={[1.5, 0.2, 0.3]} position={[0.75, 1.5, 0]} material-color={color} />
    <Cylinder args={[0.15, 0.15, 0.4]} position={[1.4, 1.5, 0]} material-color="#333" />
    <Box args={[1.2, 0.2, 0.25]} position={[2.0, 1.5, 0]} material-color={color} />
    <Cylinder args={[0.08, 0.08, 0.8]} position={[2.5, 1.1, 0]} material-color="#888" />
  </group>
);

const ArticulatedRobot = ({ color }) => (
  <group position={[0, 0, 0]}>
    <Cylinder args={[0.5, 0.6, 0.3]} position={[0, 0.15, 0]} material-color="#333" />
    <Box args={[0.6, 0.8, 0.6]} position={[0, 0.7, 0]} material-color={color} />
    <Box args={[0.3, 1.6, 0.3]} position={[0, 1.6, 0]} rotation={[0, 0, 0.3]} material-color={color} />
    <Cylinder args={[0.2, 0.2, 0.4]} position={[0.25, 2.3, 0]} rotation={[Math.PI/2, 0, 0]} material-color="#222" />
    <Box args={[1.4, 0.25, 0.25]} position={[0.9, 2.4, 0]} rotation={[0, 0, -0.2]} material-color={color} />
    <Cylinder args={[0.1, 0.1, 0.4]} position={[1.5, 2.2, 0]} material-color="#888" />
  </group>
);

const DeltaRobot = ({ color }) => (
  <group position={[0, 3, 0]}>
    <Cylinder args={[0.8, 0.8, 0.2]} position={[0, 0, 0]} material-color="#333" />
    {[0, Math.PI*2/3, Math.PI*4/3].map((angle, i) => (
      <group key={i} rotation={[0, angle, 0]}>
        <Box args={[0.1, 0.1, 1.5]} position={[0, -0.7, 0.6]} rotation={[-0.5, 0, 0]} material-color={color} />
        <Cylinder args={[0.05, 0.05, 1.6]} position={[0, -2.0, 0.9]} rotation={[0.2, 0, 0]} material-color="#888" />
      </group>
    ))}
    <Cylinder args={[0.3, 0.3, 0.1]} position={[0, -2.8, 0]} material-color="#555" />
  </group>
);

export default function CapstoneWorkcell({ 
  phase, 
  robotType, setRobotType,
  envelopeRadius, setEnvelopeRadius,
  eoat, setEoat,
  pathPoints, setPathPoints,
  animationSpeed, setAnimationSpeed,
  safetyPlaced, setSafetyPlaced 
}) {
  const robotRef = useRef();
  const time = useRef(0);
  const [hovered, setHovered] = useState(null);

  useFrame((state, delta) => {
    if (phase === 4 && pathPoints.length > 1) { 
      time.current = (time.current + delta * animationSpeed) % 1;
      if (robotRef.current) {
        const t = time.current < 0.5 ? time.current * 2 : 2 - (time.current * 2);
        const angle = THREE.MathUtils.lerp(-Math.PI/4, Math.PI/4, t);
        robotRef.current.rotation.y = angle;
      }
    } else {
      if (robotRef.current) robotRef.current.rotation.y = 0;
    }
  });

  const cursorStyle = (isHovered) => {
    document.body.style.cursor = isHovered ? 'pointer' : 'auto';
  };

  // Phase 0: Render options
  const renderRobotSelection = () => {
    if (phase !== 0) return null;
    return (
      <group>
        {[
          { type: 'SCARA', pos: [-3, 0, -2], Comp: SCARARobot },
          { type: 'Articulated', pos: [0, 0, -2], Comp: ArticulatedRobot },
          { type: 'Delta', pos: [3, 0, -2], Comp: DeltaRobot }
        ].map(({ type, pos, Comp }) => {
          const isSelected = type === robotType;
          const isHovered = hovered === type;
          return (
            <group 
              key={type} 
              position={pos}
              onClick={() => setRobotType(type)}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(type); cursorStyle(true); }}
              onPointerOut={(e) => { setHovered(null); cursorStyle(false); }}
            >
              {/* Podium */}
              <Cylinder args={[1, 1, 0.2]} position={[0, 0.1, 0]} material-color={isSelected ? '#4f8cff' : '#333'} />
              <Comp color={isSelected ? 'var(--accent-orange, #ff6d00)' : (isHovered ? '#ffb74d' : '#888')} />
              {(isSelected || isHovered) && (
                <Text position={[0, type === 'Delta' ? 3.5 : 3, 0]} fontSize={0.3} color="#fff">
                  {type}
                </Text>
              )}
            </group>
          )
        })}
      </group>
    );
  };

  // Main Robot (Phase >= 1)
  const renderMainRobot = () => {
    if (phase === 0) return null;
    const color = "var(--accent-orange, #ff6d00)";
    
    // Cycle speed on click during phase 4
    const handleRobotClick = (e) => {
      if (phase === 4) {
        e.stopPropagation();
        setAnimationSpeed(prev => prev >= 3 ? 0.5 : prev + 0.5);
      }
    };

    const isHoverPhase4 = hovered === 'robot_speed' && phase === 4;

    return (
      <group 
        ref={robotRef}
        onClick={handleRobotClick}
        onPointerOver={(e) => { if (phase === 4) { e.stopPropagation(); setHovered('robot_speed'); cursorStyle(true); } }}
        onPointerOut={() => { if (phase === 4) { setHovered(null); cursorStyle(false); } }}
      >
        {robotType === 'SCARA' && <SCARARobot color={isHoverPhase4 ? '#ffb74d' : color} />}
        {robotType === 'Delta' && <DeltaRobot color={isHoverPhase4 ? '#ffb74d' : color} />}
        {robotType === 'Articulated' && <ArticulatedRobot color={isHoverPhase4 ? '#ffb74d' : color} />}
        
        {/* Attached EOAT */}
        {phase >= 2 && eoat && (
          <group position={robotType === 'Delta' ? [0, -3.1, 0] : [2.5, 0.8, 0]}>
            {eoat === 'gripper' && <Box args={[0.2, 0.4, 0.1]} material-color="#555" />}
            {eoat === 'suction' && <Cylinder args={[0.15, 0.1, 0.2]} material-color="#2a8af6" />}
            {eoat === 'welder' && <Cylinder args={[0.05, 0.02, 0.5]} rotation={[Math.PI/4, 0, 0]} material-color="#a855f7" />}
          </group>
        )}
      </group>
    );
  };

  // Phase 2: Render EOAT selection
  const renderEoatSelection = () => {
    if (phase !== 2) return null;
    return (
      <group position={[0, 1, 3]}>
        {[
          { type: 'gripper', pos: [-1.5, 0, 0], color: '#555', Comp: () => <Box args={[0.4, 0.8, 0.2]} /> },
          { type: 'suction', pos: [0, 0, 0], color: '#2a8af6', Comp: () => <Cylinder args={[0.3, 0.2, 0.4]} /> },
          { type: 'welder', pos: [1.5, 0, 0], color: '#a855f7', Comp: () => <Cylinder args={[0.1, 0.04, 1]} rotation={[Math.PI/4, 0, 0]} /> }
        ].map(({ type, pos, color, Comp }) => {
          const isSelected = type === eoat;
          const isHovered = hovered === `eoat_${type}`;
          return (
            <group 
              key={type} 
              position={pos}
              onClick={(e) => { e.stopPropagation(); setEoat(type); }}
              onPointerOver={(e) => { e.stopPropagation(); setHovered(`eoat_${type}`); cursorStyle(true); }}
              onPointerOut={(e) => { setHovered(null); cursorStyle(false); }}
            >
              <group material-color={isSelected ? color : (isHovered ? '#fff' : '#888')}>
                <Comp />
              </group>
              {(isSelected || isHovered) && (
                <Text position={[0, -0.8, 0]} fontSize={0.2} color="#fff">
                  {type.toUpperCase()}
                </Text>
              )}
            </group>
          )
        })}
      </group>
    );
  };

  return (
    <group>
      {/* Floor */}
      <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -0.01, 0]} receiveShadow>
        <planeGeometry args={[15, 15]} />
        <meshStandardMaterial color="#f0f0f5" roughness={0.8} />
      </mesh>
      
      {/* Grid */}
      <gridHelper args={[15, 30]} position={[0, 0.01, 0]} material-color="#ccc" />

      {renderRobotSelection()}
      {renderMainRobot()}
      {renderEoatSelection()}

      {/* Phase 1: Work Envelope Interaction */}
      {phase >= 1 && (
        <Sphere 
          args={[envelopeRadius, 32, 16]} 
          position={[0, envelopeRadius/2, 0]}
          onClick={(e) => { 
            if (phase === 1) {
              e.stopPropagation();
              setEnvelopeRadius(prev => prev >= 4 ? 1 : prev + 0.5);
            }
          }}
          onPointerOver={(e) => { if (phase === 1) { e.stopPropagation(); setHovered('envelope'); cursorStyle(true); } }}
          onPointerOut={() => { if (phase === 1) { setHovered(null); cursorStyle(false); } }}
        >
          <meshBasicMaterial 
            color="#4f8cff" 
            transparent 
            opacity={phase === 1 && hovered === 'envelope' ? 0.3 : 0.15} 
            wireframe 
          />
        </Sphere>
      )}

      {/* Phase 3 & 4: Path & Environment */}
      {phase >= 3 && (
        <>
          {/* Pick point */}
          <Box 
            args={[0.6, 0.6, 0.6]} 
            position={pathPoints[0]} 
            onClick={(e) => {
              if (phase === 3) {
                e.stopPropagation();
                let nx = pathPoints[0][0] - 0.5;
                if (nx < -4) nx = -1;
                setPathPoints([[nx, 0.5, 0], pathPoints[1]]);
              }
            }}
            onPointerOver={(e) => { if (phase === 3) { e.stopPropagation(); setHovered('pick'); cursorStyle(true); } }}
            onPointerOut={() => { if (phase === 3) { setHovered(null); cursorStyle(false); } }}
          >
            <meshStandardMaterial color="#a855f7" opacity={hovered === 'pick' ? 1 : 0.8} transparent />
          </Box>
          <Text position={[pathPoints[0][0], pathPoints[0][1] + 0.5, pathPoints[0][2]]} fontSize={0.3} color="#fff">PICK</Text>
          
          {/* Place point */}
          <Box 
            args={[0.6, 0.6, 0.6]} 
            position={pathPoints[1]} 
            onClick={(e) => {
              if (phase === 3) {
                e.stopPropagation();
                let nx = pathPoints[1][0] + 0.5;
                if (nx > 4) nx = 1;
                setPathPoints([pathPoints[0], [nx, 0.5, 0]]);
              }
            }}
            onPointerOver={(e) => { if (phase === 3) { e.stopPropagation(); setHovered('place'); cursorStyle(true); } }}
            onPointerOut={() => { if (phase === 3) { setHovered(null); cursorStyle(false); } }}
          >
            <meshStandardMaterial color="#00e676" opacity={hovered === 'place' ? 1 : 0.8} transparent />
          </Box>
          <Text position={[pathPoints[1][0], pathPoints[1][1] + 0.5, pathPoints[1][2]]} fontSize={0.3} color="#fff">PLACE</Text>

          {/* Path Line */}
          <Line 
            points={[
              pathPoints[0], 
              [0, Math.max(pathPoints[0][1], pathPoints[1][1]) + 2, 0],
              pathPoints[1]
            ]} 
            color="#ff6d00" 
            lineWidth={3} 
            dashed 
          />
        </>
      )}

      {/* Phase 5: Safety */}
      {phase >= 5 && (
        <group>
          {/* Invisible click targets for phase 5 if not placed */}
          {!safetyPlaced && phase === 5 && (
            <Box 
              args={[14, 0.5, 12]} 
              position={[0, 0.25, 0]} 
              visible={false}
              onClick={(e) => { e.stopPropagation(); setSafetyPlaced(true); }}
              onPointerOver={(e) => { e.stopPropagation(); setHovered('safety'); cursorStyle(true); }}
              onPointerOut={() => { setHovered(null); cursorStyle(false); }}
            />
          )}

          {/* Perimeter visualization to guide user */}
          {!safetyPlaced && phase === 5 && (
            <Line 
              points={[ [-4, 0.1, -4], [4, 0.1, -4], [4, 0.1, 4], [-4, 0.1, 4], [-4, 0.1, -4] ]}
              color={hovered === 'safety' ? "#ff6d00" : "#eab308"} 
              lineWidth={hovered === 'safety' ? 5 : 2} 
            />
          )}

          {safetyPlaced && (
            <group>
              {[-4, 4].map(x => (
                <Box key={`fence-x-${x}`} args={[0.1, 1.5, 8]} position={[x, 0.75, 0]} material-color="#eab308" opacity={0.6} transparent />
              ))}
              {[-4, 4].map(z => (
                <Box key={`fence-z-${z}`} args={[8, 1.5, 0.1]} position={[0, 0.75, z]} material-color="#eab308" opacity={0.6} transparent />
              ))}
              {/* Light curtain visible effect */}
              <Box args={[7.8, 1.2, 0.05]} position={[0, 0.8, 3.9]} material-color="#ff0000" opacity={0.2} transparent />
            </group>
          )}
        </group>
      )}
      
      {/* Lights */}
      <ambientLight intensity={0.6} />
      <directionalLight position={[5, 10, 5]} intensity={1.5} castShadow />
      <pointLight position={[-5, 5, -5]} intensity={0.5} color="#4f8cff" />
    </group>
  );
}
