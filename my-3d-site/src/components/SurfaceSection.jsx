// src/components/SurfaceSection.jsx
import React, { useRef, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import { Text } from '@react-three/drei';
import * as THREE from 'three'; // Make sure THREE is available

export function SurfaceSection({ opacity, isVisible }) { // Added opacity prop
  const groupRef = useRef();

  // Apply opacity to all materials in the group
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material) {
          // Clone material if not already cloned for this opacity adjustment
          if (!child.material.userData_opacityCloned) {
             child.material = child.material.clone();
             child.material.userData_opacityCloned = true;
          }
          child.material.transparent = true; // Materials must be transparent to have opacity
          
          // If the material is a basic material for god rays or the water plane,
          // its original opacity should be modulated by the section's opacity.
          if (child.userData_isGodRay) {
            child.material.opacity = opacity * 0.1; // Modulate base opacity for god rays
          } else if (child.userData_isWaterSurface) {
            child.material.opacity = opacity * 0.7; // Modulate base opacity for water
          } else {
            child.material.opacity = opacity; // Default for other meshes
          }
        }
      });
      groupRef.current.visible = isVisible; // Still use isVisible to hide if fully transparent
    }
  }, [opacity, isVisible]); // Rerun when opacity or visibility changes

  if (!isVisible && opacity === 0) return null; // Optimization: don't render if fully out

  return (
    <group ref={groupRef}>
      <Text position={[0, 2, -2]} fontSize={0.5} color="white" fillOpacity={opacity} material-transparent material-opacity={opacity}>
        Section 1: Sunlit Surface
      </Text>
      <mesh position={[0, 3, 0]} rotation={[-Math.PI / 2, 0, 0]} userData={{isWaterSurface: true}}>
        <planeGeometry args={[20, 20, 32, 32]} />
        {/* Original material values set here, opacity will be controlled by useEffect */}
        <meshStandardMaterial color="#2c72d8" transparent opacity={0.7} />
      </mesh>
      
      {[...Array(5)].map((_, i) => (
         <mesh key={i} position={[(i - 2) * 3, 6, -5 - i*2]} rotation={[0,0,0]} userData={{isGodRay: true}}>
             <planeGeometry args={[0.5, 10]} />
             {/* Original material values set here, opacity will be controlled by useEffect */}
             <meshBasicMaterial color="white" transparent opacity={0.1} />
         </mesh>
      ))}
    </group>
  );
}
