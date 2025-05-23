// src/components/SeabedSection.jsx
import React, { useRef, useState, Suspense, useEffect } from 'react'; // Added useEffect
import { useFrame, useThree } from '@react-three/fiber';
import { SpotLight, Text, useGLTF } from '@react-three/drei';
import * as THREE from 'three';

// Simple placeholder for starfish or other seabed creatures
function SeabedCreature({ position = [0,0,0], modelUrl = null, sectionOpacity }) { // Added sectionOpacity
  const meshRef = useRef(); // For fallback geometry
  let displayObject;

  if (modelUrl) {
    const { scene } = useGLTF(modelUrl);
    displayObject = <primitive object={scene.clone()} position={position} scale={0.5} />;
    // Note: Applying opacity to GLTF models requires traversing their materials, similar to group.
    // This is a simplified example; for GLTFs, you'd traverse `scene.children` in a useEffect.
  } else {
    displayObject = (
      <mesh ref={meshRef} position={position}>
        <icosahedronGeometry args={[0.3, 0]} />
        <meshStandardMaterial color="sandybrown" transparent opacity={1} />
      </mesh>
    );
  }
  
  useEffect(() => {
    const applyOpacityToMaterial = (material) => {
      if (!material.userData_opacityCloned) {
        material = material.clone();
        material.userData_opacityCloned = true;
      }
      material.transparent = true;
      material.opacity = sectionOpacity;
    };

    if (meshRef.current && meshRef.current.material) { // Fallback geometry
       applyOpacityToMaterial(meshRef.current.material)
    } else if (displayObject && displayObject.props.object) { // GLTF
        displayObject.props.object.traverse(child => {
            if(child.isMesh && child.material) {
                if (Array.isArray(child.material)) {
                    child.material.forEach(applyOpacityToMaterial);
                } else {
                    applyOpacityToMaterial(child.material);
                }
            }
        });
    }
  }, [sectionOpacity, displayObject]);


  return displayObject;
}

export function SeabedSection({ opacity, isVisible }) { // Added opacity prop
  const groupRef = useRef();
  const { viewport, camera } = useThree();
  const [mousePosition, setMousePosition] = useState(new THREE.Vector3(0, 0, 0));
  const spotLightRef = useRef();
  const spotLightTargetRef = useRef();
  const baseSpotlightIntensity = 150; // Store base intensity

  // Mouse move handler (remains largely the same)
  React.useEffect(() => {
    const handleMouseMove = (event) => {
      const x = (event.clientX / window.innerWidth) * 2 - 1;
      const y = -(event.clientY / window.innerHeight) * 2 + 1;
      const planeZ = -28; 
      const vec = new THREE.Vector3(x * viewport.width / 2, y * viewport.height / 2, camera.near);
      vec.unproject(camera);
      const dir = vec.sub(camera.position).normalize();
      const distance = (planeZ - camera.position.z) / dir.z;
      const pos = camera.position.clone().add(dir.multiplyScalar(distance));
      setMousePosition(new THREE.Vector3(pos.x, -20, pos.z));
    };

    if (isVisible) {
      window.addEventListener('mousemove', handleMouseMove);
    } else {
      window.removeEventListener('mousemove', handleMouseMove);
    }
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, [isVisible, viewport, camera]);
  
  // Apply opacity to all materials in the group
  useEffect(() => {
    if (groupRef.current) {
      groupRef.current.traverse((child) => {
        if (child.isMesh && child.material && !child.userData_isSeabedCreature && !child.userData_isSpotlightRelated) { // Avoid double-applying to creatures
          if (!child.material.userData_opacityCloned) {
             child.material = child.material.clone();
             child.material.userData_opacityCloned = true;
          }
          child.material.transparent = true;
          child.material.opacity = opacity;
        }
      });
      groupRef.current.visible = isVisible;
      if (spotLightRef.current) {
        spotLightRef.current.intensity = opacity * baseSpotlightIntensity; // Modulate spotlight intensity
      }
    }
  }, [opacity, isVisible]);

  useFrame(() => {
    // Visibility & spotlight target movement (remains largely the same)
    if (isVisible && spotLightTargetRef.current) {
      spotLightTargetRef.current.position.lerp(mousePosition, 0.1);
      if (spotLightRef.current) {
        spotLightRef.current.position.x = mousePosition.x;
        spotLightRef.current.position.z = mousePosition.z;
        // Intensity is now handled in useEffect with opacity
      }
    }
  });

  if (!isVisible && opacity === 0) return null;

  return (
    <group ref={groupRef}>
      <Text position={[0, -18, -5]} fontSize={0.5} color="gray" anchorY="bottom" fillOpacity={opacity} material-transparent material-opacity={opacity}>
        Section 4: Seabed - Use mouse to explore
      </Text>

      <object3D ref={spotLightTargetRef} position={[0, -20, 0]} userData={{isSpotlightRelated: true}} /> 

      <SpotLight
        ref={spotLightRef}
        target={spotLightTargetRef.current}
        position={[mousePosition.x, -10, mousePosition.z]}
        color={0xffffff}
        intensity={opacity * baseSpotlightIntensity} // Initial intensity based on opacity
        distance={40}
        angle={Math.PI / 8}
        penumbra={0.3}
        decay={2}
        castShadow
        userData={{isSpotlightRelated: true}}
      />
      
      <mesh position={[0, -22, 0]} rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
        <planeGeometry args={[50, 50]} />
        <meshStandardMaterial color="#403020" roughness={0.8} transparent opacity={1}/> {/* Base opacity 1, modulated by group effect */}
      </mesh>

      <Suspense fallback={null}>
        {/* Pass sectionOpacity to creatures */}
        <SeabedCreature position={[2, -21.8, -3]} sectionOpacity={opacity} />
        <SeabedCreature position={[-3, -21.8, -6]} sectionOpacity={opacity} />
        <SeabedCreature position={[5, -21.8, 2]} sectionOpacity={opacity} />
        {[...Array(10)].map((_,i) => (
          <mesh key={i} position={[(Math.random()-0.5)*30, -21.9, (Math.random()-0.5)*30]} castShadow receiveShadow userData={{isSeabedCreature: false /* This is a generic rock, handled by group opacity */}}>
             <boxGeometry args={[Math.random()*2+0.5, Math.random()*2+0.5, Math.random()*2+0.5]} />
             <meshStandardMaterial color="dimgray" roughness={1} transparent opacity={1}/> {/* Base opacity 1, modulated by group effect */}
          </mesh>
        ))}
      </Suspense>
    </group>
  );
}
