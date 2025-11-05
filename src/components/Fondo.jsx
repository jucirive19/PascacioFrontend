  import { useGLTF } from "@react-three/drei";
  import { Canvas, useFrame } from "@react-three/fiber";
  import { useRef } from "react"
  const Scene = () => {
    const sky = useGLTF("/models/sky.glb");
    const skyRef = useRef()
    useFrame((state, delta) => {
      if (skyRef.current) {
        skyRef.current.rotation.y += delta * 0.1; // Ajusta la velocidad cambiando el 0.1
      }
    })
    return (
        <group>
            <primitive 
                object={sky.scene} 
                ref={skyRef}
                scale={2}    
                position={[44, 1, 32]} 
            />
        </group>
    );
  }
  const Fondo = () => {
      return (
          <Canvas shadows>
              <Scene />
              <ambientLight intensity={0.5} />
              <directionalLight
                  position={[10, 10, 5]}
                  intensity={1}
                  castShadow
              />
          </Canvas>
      );
  }
  // Precargar el modelo del cielo
  useGLTF.preload("/models/sky.glb")
  export default Fondo;




//import { useGLTF } from "@react-three/drei"
//import { Canvas, useFrame } from "@react-three/fiber"
//import { forwardRef, useRef } from "react";
//
//const Scene = forwardRef((props, ref) => {
//  const map = useGLTF("models/fondo.glb");
//  const sky = useGLTF("/models/sky.glb");
//  const skyRef = useRef();
//
//  // Aplicar sombras a los materiales del mapa
//  if (map.scene) {
//      map.scene.traverse((child) => {
//          if (child.isMesh) {
//              child.castShadow = true;
//              child.receiveShadow = true;
//          }
//      });
//  }
//
//  // Añadir animación de rotación solo al cielo
//  useFrame((state, delta) => {
//    // Rotar el cielo lentamente
//    if (skyRef.current) {
//      skyRef.current.rotation.y += delta * 0.1; // Ajusta la velocidad cambiando el 0.1
//    }
//  });
//
//  return (
//      <group>
//          <primitive 
//              object={map.scene} 
//              ref={ref} 
//              position={[90, -2, -55]} 
//          />
//          <primitive 
//              object={sky.scene} 
//              ref={skyRef}
//              scale={2}    
//              position={[44, 1, 32]} 
//          />
//      </group>
//  );
//});
//
//const Fondo = () => {
//    return (
//        <Canvas shadows>
//            <Scene />
//            <ambientLight intensity={0.5} />
//            <directionalLight
//                position={[10, 10, 5]}
//                intensity={1}
//                castShadow
//            />
//        </Canvas>
//    );
//};
//
//Scene.displayName = 'Scene';
//
//// Precargar ambos modelos
//useGLTF.preload("models/fondo.glb");
//useGLTF.preload("/models/sky.glb");
//
//export default Fondo;