import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import '../styles/Laptop.css';

function LaptopModel() {
  const { scene } = useGLTF('src/assets/laptop/scene.gltf');

  return <primitive object={scene} scale={0.5} />;  
}

function Laptop() {
  return (
    <Canvas>
      <ambientLight intensity={0.5} />
      <spotLight position={[10, 15, 10]} angle={0.3} penumbra={1} />
      <LaptopModel />
      <OrbitControls />
    </Canvas>
  );
}

export default Laptop;
