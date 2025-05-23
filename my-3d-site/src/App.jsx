import './App.css';
import { Canvas } from "@react-three/fiber";
import { ScrollControls } from "@react-three/drei"; // Removed Html, it's not used here
import { UnderwaterJourney } from "./components/UnderwaterJourney"; // Import the new component

function App() {
  return (
    <Canvas camera={{ position: [0, 0, 5], fov: 75 }}> {/* Adjusted camera for better view */}
      <ambientLight name="globalAmbient" intensity={0.5} />
      <pointLight name="globalPoint" position={[10, 10, 10]} intensity={1} />
      <ScrollControls pages={4} damping={0.3}> {/* Added ScrollControls, 4 pages */}
        <UnderwaterJourney />
      </ScrollControls>
    </Canvas>
  );
}

export default App;
