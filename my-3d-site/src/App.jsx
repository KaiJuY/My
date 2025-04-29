import { useState } from "react";
import './App.css';
import { Canvas } from "@react-three/fiber";
import { ExpC } from "./components/ExpC";
import { AttackToyModel } from "./components/AttackToy";
import { WhiteSharkModel } from "./components/WhiteShark";

function App() {
  return (
    <Canvas>     
      <ambientLight intensity={0.5}/>
      <pointLight position={[0, 0, 0]} intensity={1}/>     
      <WhiteSharkModel/>
    </Canvas>
  )
}

export default App;
