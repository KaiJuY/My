import { Canvas, useFrame } from '@react-three/fiber';
import { ScrollControls, useScroll, OrbitControls, Html, useCursor, useGLTF, Stats } from '@react-three/drei';
import { useRef, useState } from 'react';

function ModelBox({ url, position = [0, 0, 0], scale = [1, 1, 1], rotation = [0, 0, 0], castShadow = true, receiveShadow = true, onPointerOver, onPointerOut, onClick }) {
  const { scene } = useGLTF(url);
  const ref = useRef();
  
  useFrame(() => {
    ref.current.rotation.y += 0.005;
  });

  return (
    <primitive
      ref={ref}
      object={scene}
      position={position}
      scale={scale}
      rotation={rotation}
      castShadow={castShadow}
      receiveShadow={receiveShadow}
      onPointerOver={onPointerOver}
      onPointerOut={onPointerOut}
      onClick={onClick}
    />
  );
}

function InteractiveScene() {
  const refa = useRef();
  const ref = useRef();
  const scroll = useScroll();
  const [hovered, setHovered] = useState(false);
  const [clicked, setClicked] = useState(false);

  // Scroll-driven rotation
  useFrame(() => {
    const progress = scroll.range(0, 1);
    if (refa.current) {
        refa.current.rotation.x = progress * Math.PI * 2;
        refa.current.rotation.y = progress * Math.PI * 2;
    }
    if (ref.current) {
        ref.current.rotation.x = -progress * Math.PI * 1;
        ref.current.rotation.y = -progress * Math.PI * 1;
    }
  });

  useCursor(hovered);

  return (
    <>
      <ModelBox
        url={`${import.meta.env.BASE_URL}models/example.glb`}
        position={[2, 0, 0]}
        scale={[0.8, 0.8, 0.8]}
        rotation={[0, Math.PI / 4, 0]}
        castShadow
        receiveShadow
        onPointerOver={() => console.log('Model hover')}
        onPointerOut={() => console.log('Model out')}
        onClick={() => console.log('Model clicked')}
      />
      <mesh
        ref={refa}
        position={[-2, 0, 0]}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'hotpink' : clicked ? 'lightgreen' : 'orange'} />
        {clicked && (
          <Html position={[0, 1.2, 0]}>
            <div style={{ color: 'white', background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '0.25rem' }}>
              🎉 You clicked the box!
            </div>
          </Html>
        )}
      </mesh>
      <mesh
        ref={ref}
        position={[-4, 0, 0]}
        scale={hovered ? 1.2 : 1}
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
        onClick={() => setClicked(!clicked)}
        castShadow
        receiveShadow
      >
        <boxGeometry args={[1, 1, 1]} />
        <meshStandardMaterial color={hovered ? 'darkblue' : clicked ? 'lightgreen' : 'gray'} />
        {clicked && (
          <Html position={[0, 1.2, 0]}>
            <div style={{ color: 'white', background: 'rgba(0,0,0,0.6)', padding: '0.5rem', borderRadius: '0.25rem' }}>
              🎉 You clicked the box!
            </div>
          </Html>
        )}
      </mesh>
      <Stats /> {/* optional performance stats */}
    </>
  );
}


export default function Scene() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <directionalLight position={[5, 5, 5]} castShadow />
      <ScrollControls pages={3} damping={4}>
        <InteractiveScene />
      </ScrollControls>
      <OrbitControls enablePan={false} />
    </Canvas>
  );
}
