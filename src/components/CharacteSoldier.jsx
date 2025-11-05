import React, { useRef, useEffect } from 'react'
import { useGLTF, useAnimations } from '@react-three/drei'

export function CharacterSoldier({ animation = 'Idle', ...props }) {
  const group = useRef()
  const { nodes, materials, animations } = useGLTF('/models/Character.gltf')
  const { actions, names } = useAnimations(animations, group)
  
  useEffect(() => {
    Object.values(actions).forEach((action) => {
      if (action.isRunning()) {
        action.fadeOut(0.2);
      }
    });

    if (actions[animation]) {
      actions[animation]
        .reset()
        .fadeIn(0.2)
        
        .play();
    } else {
      if (actions['Idle']) {
        actions['Idle']
          .reset()
          .fadeIn(0.2)
          .play();
      }
    }

   
  }, [actions, animation]);

  return (
    <group ref={group} {...props} dispose={null}>
      <group name="Scene">
        <group
          name="Idle"
          position={[0.184, -0.046, -0.18]}
          rotation={[Math.PI / 2, 0, 0]}
          scale={0.001}>
          <skinnedMesh
            name="boca"
            geometry={nodes.boca.geometry}
            material={materials.Mouth_Mat}
            skeleton={nodes.boca.skeleton}
          />
          <skinnedMesh
            name="camisa"
            geometry={nodes.camisa.geometry}
            material={materials.ShirtAI_Mat}
            skeleton={nodes.camisa.skeleton}
          />
          <skinnedMesh
            name="cejas"
            geometry={nodes.cejas.geometry}
            material={materials.EyebrowsAI_Mat}
            skeleton={nodes.cejas.skeleton}
          />
          <skinnedMesh
            name="cuerpo"
            geometry={nodes.cuerpo.geometry}
            material={materials.SkinAr_Mat}
            skeleton={nodes.cuerpo.skeleton}
          />
          <skinnedMesh
            name="ojos"
            geometry={nodes.ojos.geometry}
            material={materials.Eyes_Mat}
            skeleton={nodes.ojos.skeleton}
          />
          <skinnedMesh
            name="pelo"
            geometry={nodes.pelo.geometry}
            material={materials.HairAI_Mat}
            skeleton={nodes.pelo.skeleton}
          />
          <skinnedMesh
            name="short"
            geometry={nodes.short.geometry}
            material={materials.PantsAI_Mat}
            skeleton={nodes.short.skeleton}
          />
          <primitive object={nodes.mixamorigHips} />
        </group>
      </group>
    </group>
  )
}

useGLTF.preload('/models/Character.gltf')
