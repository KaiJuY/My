import { OrbitControls } from "@react-three/drei";
export const ExpC = () => {
  return(
    <mesh position={[2, 0, 0]}>
      <boxGeometry args={[2,2,2]}/>
      <meshStandardMaterial color={'orange'}/>
      <OrbitControls/>
    </mesh>
  )
}