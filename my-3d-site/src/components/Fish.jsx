// src/components/Fish.jsx
import React, { useRef, useMemo, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

export function Fish({ initialPosition = [0,0,0], color = 'orange', sectionOpacity = 1 }) { // Added sectionOpacity
  const meshRef = useRef();
  const targetPosition = useMemo(() => new THREE.Vector3(
    initialPosition[0] + (Math.random() - 0.5) * 10,
    initialPosition[1] + (Math.random() - 0.5) * 5,
    initialPosition[2] + (Math.random() - 0.5) * 10
  ), [initialPosition]);
  const speed = useMemo(() => 0.5 + Math.random() * 1.0, []);

  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      // Clone material if not already cloned
      if (!meshRef.current.material.userData_opacityCloned) {
        meshRef.current.material = meshRef.current.material.clone();
        meshRef.current.material.userData_opacityCloned = true;
      }
      meshRef.current.material.transparent = true;
      meshRef.current.material.opacity = sectionOpacity; // Apply section's opacity directly
    }
  }, [sectionOpacity]); // Rerun when sectionOpacity changes

  useFrame((state, delta) => {
    if (meshRef.current) {
      meshRef.current.position.lerp(targetPosition, delta * speed * 0.1);
      meshRef.current.lookAt(targetPosition);
      if (meshRef.current.position.distanceTo(targetPosition) < 1) {
        targetPosition.set(
          initialPosition[0] + (Math.random() - 0.5) * 15,
          initialPosition[1] + (Math.random() - 0.5) * 8,
          initialPosition[2] + (Math.random() - 0.5) * 15
        );
      }
    }
  });

  return (
    <mesh ref={meshRef} position={initialPosition}>
      <coneGeometry args={[0.1, 0.5, 8]} />
      {/* Base material properties. Opacity will be controlled by useEffect. */}
      <meshStandardMaterial color={color} transparent opacity={1} /> 
    </mesh>
  );
}
