// src/components/Jellyfish.jsx
import React, { useRef, useMemo, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Jellyfish({ initialPosition = [0,0,0], sectionOpacity = 1 }) { // Added sectionOpacity
  const meshRef = useRef();
  const speed = useMemo(() => 0.1 + Math.random() * 0.2, []);
  const phase = useMemo(() => Math.random() * Math.PI * 2, []);
  const baseMaterialOpacity = 0.7; // Original opacity of the jellyfish material

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      // Clone material if not already cloned for this opacity adjustment
      if (!meshRef.current.material.userData_opacityCloned) {
        meshRef.current.material = meshRef.current.material.clone();
        meshRef.current.material.userData_opacityCloned = true;
      }
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = sectionOpacity * baseMaterialOpacity;
    }
  }, [sectionOpacity]); // Rerun when sectionOpacity changes

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.y += speed * delta;
      meshRef.current.position.x = initialPosition[0] + Math.sin(state.clock.elapsedTime * 0.5 + phase) * 0.2;
      meshRef.current.position.z = initialPosition[2] + Math.cos(state.clock.elapsedTime * 0.5 + phase) * 0.2;
      if (meshRef.current.position.y > initialPosition[1] + 10) {
        meshRef.current.position.y = initialPosition[1] - 5;
      }
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <capsuleGeometry args={[0.2, 0.5, 4, 8]} />
      {/* Base material properties defined here. Opacity will be controlled by useEffect. */}
      <meshStandardMaterial 
        color="rgba(255, 105, 180, 0.7)" 
        transparent 
        opacity={baseMaterialOpacity} // Set initial opacity, will be modulated
        emissive="pink" 
        emissiveIntensity={0.5}
      />
    </mesh>
  );
}
