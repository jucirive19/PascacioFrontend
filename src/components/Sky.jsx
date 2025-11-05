import { useGLTF } from "@react-three/drei";

export function Sky() {
  const { scene } = useGLTF("/models/sky.glb"); // Asumiendo que el modelo está en public/models
  
  return (
    <primitive 
      object={scene} 
      scale={1.5}     // Ajusta la escala según necesites
      position={[231, 200, 43]} // Ajusta la posición si es necesario
    />
  );
}

useGLTF.preload("/models/sky.glb");