// src/components/Laptop.jsx
import React from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, useGLTF } from '@react-three/drei';
import { useNavigate } from 'react-router-dom';
//import laptop from '../assets/laptop'; Relative path to the model
import '../styles/Laptop.css';
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader';
import { useLoader } from '@react-three/fiber';
import laptopModel from '../assets/laptop/scene.gltf';



const Model = (props) => {
  const gltf = useLoader(GLTFLoader, '/laptop/scene.gltf');
  return <primitive object={gltf.scene} {...props} />;
};

const Laptop = () => {
  const navigate = useNavigate();

  return (
    <div className="laptop-container">
      <Canvas style={{ height: '40vh', width: '100%' }}>
        <ambientLight intensity={0.5} />
        <pointLight position={[10, 10, 10]} />
        <Model scale={[1.5, 1.5, 1.5]} position={[0, -1.5, 0]} />
        <OrbitControls />
      </Canvas>
      <div className="laptop-screen">
        <button className="button sign-up" onClick={() => navigate('/signup')}>
          Sign up
        </button>
        <button className="button sign-in" onClick={() => navigate('/signin')}>
          Sign in
        </button>
      </div>
    </div>
  );
};

export default Laptop;
