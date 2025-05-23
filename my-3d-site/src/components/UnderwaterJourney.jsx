// src/components/UnderwaterJourney.jsx
import React, { Suspense } from 'react';
import { useScroll, Html, Stats } from '@react-three/drei'; // Added Stats
import { useFrame, useThree } from '@react-three/fiber';
import * as THREE from 'three';
import { SurfaceSection } from './SurfaceSection';
import { JellyfishSection } from './JellyfishSection';
import { DeepWaterSection } from './DeepWaterSection';
import { SeabedSection } from './SeabedSection';

// Helper function to calculate opacity with overlap
function calculateOpacity(offset, sectionStart, sectionEnd, fadeDuration = 0.05) {
  // Ensure sectionEnd is greater than sectionStart to prevent division by zero or negative results
  if (sectionEnd <= sectionStart) return 0;

  const sectionLength = sectionEnd - sectionStart;
  const currentPosInSection = (offset - sectionStart) / sectionLength;

  if (currentPosInSection < 0 || currentPosInSection > 1) return 0; // Fully outside

  // Fade in
  if (currentPosInSection < fadeDuration) return Math.max(0, currentPosInSection / fadeDuration);
  // Fade out
  if (currentPosInSection > 1 - fadeDuration) return Math.max(0, (1 - currentPosInSection) / fadeDuration);
  
  return 1; // Fully visible
}

export function UnderwaterJourney() {
  const scroll = useScroll();
  const { scene, camera, gl } = useThree();

  // Opacity states
  const [surfaceOpacity, setSurfaceOpacity] = React.useState(0);
  const [jellyfishOpacity, setJellyfishOpacity] = React.useState(0);
  const [deepWaterOpacity, setDeepWaterOpacity] = React.useState(0);
  const [seabedOpacity, setSeabedOpacity] = React.useState(0);

  useFrame(() => {
    const offset = scroll.offset;
    const sectionDuration = 0.25; // Each section takes up 1/4 of the scroll
    const fadeDuration = 0.1; // Adjusted fade duration for more noticeable fades

    // Calculate opacities for each section with overlap
    setSurfaceOpacity(calculateOpacity(offset, 0.0, sectionDuration, fadeDuration));
    setJellyfishOpacity(calculateOpacity(offset, sectionDuration - fadeDuration, sectionDuration * 2, fadeDuration));
    setDeepWaterOpacity(calculateOpacity(offset, sectionDuration * 2 - fadeDuration, sectionDuration * 3, fadeDuration));
    setSeabedOpacity(calculateOpacity(offset, sectionDuration * 3 - fadeDuration, sectionDuration * 4, fadeDuration));
    
    const globalAmbient = scene.getObjectByName('globalAmbient');
    const globalPoint = scene.getObjectByName('globalPoint');

    // Fog and Lighting
    if (offset < sectionDuration) { // Surface Section Dominant
      scene.fog.color.lerp(new THREE.Color(0x87ceeb), 0.1);
      gl.setClearColor(scene.fog.color);
      if (globalAmbient) globalAmbient.intensity = THREE.MathUtils.lerp(globalAmbient.intensity, 0.6, 0.1);
      if (globalPoint) globalPoint.intensity = THREE.MathUtils.lerp(globalPoint.intensity, 1.2, 0.1);
    } else if (offset < sectionDuration * 2) { // Jellyfish Section Dominant
      scene.fog.color.lerp(new THREE.Color(0x1a237e), 0.1);
      gl.setClearColor(scene.fog.color);
      if (globalAmbient) globalAmbient.intensity = THREE.MathUtils.lerp(globalAmbient.intensity, 0.3, 0.1);
      if (globalPoint) globalPoint.intensity = THREE.MathUtils.lerp(globalPoint.intensity, 0.5, 0.1);
    } else if (offset < sectionDuration * 3) { // Deep Water Section Dominant
      scene.fog.color.lerp(new THREE.Color(0x050A19), 0.1);
      gl.setClearColor(scene.fog.color);
      if (globalAmbient) globalAmbient.intensity = THREE.MathUtils.lerp(globalAmbient.intensity, 0.1, 0.1);
      if (globalPoint) globalPoint.intensity = THREE.MathUtils.lerp(globalPoint.intensity, 0.2, 0.1);
    } else { // Seabed Section Dominant
      scene.fog.color.lerp(new THREE.Color(0x000000), 0.1);
      gl.setClearColor(scene.fog.color);
      if (globalAmbient) globalAmbient.intensity = THREE.MathUtils.lerp(globalAmbient.intensity, 0.05, 0.1);
      if (globalPoint) globalPoint.intensity = THREE.MathUtils.lerp(globalPoint.intensity, 0, 0.1);
    }
    
    // Fog density can also be transitioned if desired, e.g.,
    // scene.fog.density = THREE.MathUtils.lerp(scene.fog.density, targetDensity, 0.1);

    camera.position.y = -offset * 60;
  });

  return (
    <Suspense fallback={<Html center>Loading...</Html>}>
      <Stats /> {/* Add Stats component here */}
      <Html style={{ position: 'absolute', top: '5vh', left: '5vw', color: 'white', width: '300px' }}> {/* Increased width for new text */}
        Offset: {scroll.offset.toFixed(2)} <br />
        Op1: {surfaceOpacity.toFixed(2)} Op2: {jellyfishOpacity.toFixed(2)} <br />
        Op3: {deepWaterOpacity.toFixed(2)} Op4: {seabedOpacity.toFixed(2)}
      </Html>

      <SurfaceSection opacity={surfaceOpacity} isVisible={surfaceOpacity > 0.001} />
      <JellyfishSection opacity={jellyfishOpacity} isVisible={jellyfishOpacity > 0.001} />
      <DeepWaterSection opacity={deepWaterOpacity} isVisible={deepWaterOpacity > 0.001} />
      <SeabedSection opacity={seabedOpacity} isVisible={seabedOpacity > 0.001} />
    </Suspense>
  );
}
