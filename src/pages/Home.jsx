import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Canvas } from "@react-three/fiber";
import { Experience } from "../components/Experience.jsx"
import { Sky } from "../components/Sky";  
import { SoftShadows } from "@react-three/drei";
import { Suspense } from "react";
import { Physics } from "@react-three/rapier";
import { Leaderboard } from "../components/Leadeboard";

function Home() {
  const navigate = useNavigate();

  useEffect(() => {
    // Verificar si hay un usuario registrado
    const registeredUser = sessionStorage.getItem('registeredUser');
    const username = sessionStorage.getItem('username');

    // Si no hay usuario registrado, redirigir a Creacion
    if (!registeredUser || !username) {
      navigate('/creacion', { replace: true });
      return;
    }
  }, [navigate]);

  return (
    <>
      <Leaderboard />
      <Canvas shadows camera={{ position: [0, 30, 0], fov: 30 }}>
        <SoftShadows size={[42]} />
        <Suspense>
          <Sky /> 
          <Physics>
            <Experience />
          </Physics>
        </Suspense>
      </Canvas>
    </>
  );
}

export default Home;