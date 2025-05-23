// src/components/CurrentParticles.jsx
import React, { useRef, useMemo, useEffect } from 'react'; // Added useEffect
import { useFrame } from '@react-three/fiber';
import * as THREE from 'three';

const PARTICLE_COUNT = 200;
const BASE_PARTICLE_OPACITY = 0.3; // Original opacity of particles

export function CurrentParticles({ opacity }) { // Add opacity prop
  const meshRef = useRef();
  
  const particles = useMemo(() => {
     const temp = [];
     for (let i = 0; i < PARTICLE_COUNT; i++) {
         const time = Math.random() * 100;
         const factor = 20 + Math.random() * 100;
         const speed = 0.01 + Math.random() / 200;
         const x = (Math.random() - 0.5) * 25;
         const y = (Math.random() - 0.5) * 25;
         const z = (Math.random() - 0.5) * 25;
         temp.push({ time, factor, speed, x, y, z });
     }
     return temp;
  }, []);

  const dummy = useMemo(() => new THREE.Object3D(), []);

  // Effect to update material opacity when the section's opacity prop changes
  useEffect(() => {
    if (meshRef.current && meshRef.current.material) {
      // Clone material if not already cloned (though for InstancedMesh, usually one material)
      if (!meshRef.current.material.userData_opacityCloned) {
        meshRef.current.material = meshRef.current.material.clone();
        meshRef.current.material.userData_opacityCloned = true;
      }
      meshRef.current.material.transparent = true; // Ensure material is transparent
      meshRef.current.material.opacity = opacity * BASE_PARTICLE_OPACITY; // Modulate base opacity
    }
  }, [opacity]); // Rerun when opacity changes

  useFrame(() => {
     particles.forEach((particle, i) => {
         let { factor, speed, x, y, z } = particle;
         const t = (particle.time += speed);
         dummy.position.set(
             x + Math.cos(t) * factor,
             y + Math.sin(t / 2) * factor,
             z + Math.sin(t) * factor
         );
         dummy.updateMatrix();
         meshRef.current.setMatrixAt(i, dummy.matrix);
     });
     meshRef.current.instanceMatrix.needsUpdate = true;
     // The material opacity is now set via useEffect, so no need to set it here in useFrame
  });

  return (
     <instancedMesh ref={meshRef} args={[null, null, PARTICLE_COUNT]}>
         <sphereGeometry args={[0.05, 8, 8]} />
         {/* Set initial material properties. Opacity will be controlled by useEffect. */}
         <meshBasicMaterial 
            color="rgba(255, 255, 255, 0.3)" 
            transparent 
            opacity={BASE_PARTICLE_OPACITY} // Initial opacity, will be modulated
        />
     </instancedMesh>
  );
}
