// src/components/DeepWaterSection.jsx
import React, { useRef, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Fish } from './Fish';
import { CurrentParticles } from './CurrentParticles';

const FISH_COUNT = 20;

export function DeepWaterSection({ opacity, isVisible }) { // Added opacity, isVisible props
  const groupRef = useRef();

  const fishData = React.useMemo(() => {
    return [...Array(FISH_COUNT)].map(() => ({
      position: [
        (Math.random() - 0.5) * 20,
        (Math.random() - 0.5) * 10 - 15,
        (Math.random() - 0.5) * 15 - 10
      ],
      color: Math.random() > 0.5 ? 'lightblue' : 'lightgreen'
    }));
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.visible = isVisible;
      // Opacity for Text is handled by its own props
      // Opacity for Fish and CurrentParticles is passed as props to those components
    }
  }, [opacity, isVisible]);

  if (!isVisible && opacity === 0) return null;

  return (
    <group ref={groupRef}>
      <Text 
        position={[0, -12, -2]} 
        fontSize={0.5} 
        color="white" 
        anchorY="bottom"
        fillOpacity={opacity} // Apply opacity to Text
        material-transparent={true}
        material-opacity={opacity}
      >
        Section 3: Deep Water Fish & Currents
      </Text>
      <CurrentParticles opacity={opacity} /> {/* Pass opacity */}
      {fishData.map((data, i) => (
        <Fish key={i} initialPosition={data.position} color={data.color} sectionOpacity={opacity} /> // Pass opacity
      ))}
    </group>
  );
}
