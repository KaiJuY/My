// src/components/JellyfishSection.jsx
import React, { useRef, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import { Jellyfish } from './Jellyfish';

const JELLYFISH_COUNT = 15;

export function JellyfishSection({ opacity, isVisible }) { // Added opacity, isVisible props
  const groupRef = useRef();

  const jellyfishPositions = React.useMemo(() => {
    return [...Array(JELLYFISH_COUNT)].map(() => [
      (Math.random() - 0.5) * 15,
      (Math.random() - 0.5) * 8 - 5,
      (Math.random() - 0.5) * 10 - 5
    ]);
  }, []);

  useEffect(() => {
    if (groupRef.current) {
      // For the Text element within this section
      groupRef.current.traverse((child) => {
        if (child instanceof Text) { // Or check by name/userData if more specific needed
          // This is a direct way if Text is a direct child and you know its structure.
          // For more complex Text objects or if they are nested, you might need a more robust approach.
          // The fillOpacity and material-opacity props on Text are generally preferred.
        }
      });
      groupRef.current.visible = isVisible;
    }
  }, [opacity, isVisible]);

  if (!isVisible && opacity === 0) return null;

  return (
    <group ref={groupRef}>
      <Text 
        position={[0, -2, -2]} 
        fontSize={0.5} 
        color="white" 
        anchorY="bottom"
        fillOpacity={opacity} // Apply opacity to Text
        material-transparent={true} // Ensure material is transparent
        material-opacity={opacity}  // Apply opacity to Text material
      >
        Section 2: Mid-Water Jellyfish
      </Text>
      {jellyfishPositions.map((pos, i) => (
        <Jellyfish key={i} initialPosition={pos} sectionOpacity={opacity} /> // Pass opacity
      ))}
    </group>
  );
}
