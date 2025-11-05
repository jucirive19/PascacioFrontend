import { useGLTF } from "@react-three/drei"
import { RigidBody } from "@react-three/rapier";
import { useEffect } from "react"
import { forwardRef } from "react";

export const Map = forwardRef(({ onSceneReady }, ref) => {
    const map = useGLTF("models/ma.glb");

    useEffect(() => {
        if (map.scene) {
            map.scene.traverse((child) => {
                if (child.isMesh) {
                    child.castShadow = true;
                    child.receiveShadow = true;
                }
            });

            map.scene.traverse((object) => {
            });
        
            onSceneReady(map.scene);
        }
    }, [map.scene, onSceneReady]);

    return (
        <RigidBody colliders="trimesh" type="fixed">
            <primitive object={map.scene} ref={ref} />
        </RigidBody>  
    );
});


Map.displayName = 'Map';

useGLTF.preload("models/ma.glb");