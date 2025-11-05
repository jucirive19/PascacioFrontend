import { Environment } from "@react-three/drei";
import { useEffect, useState, useRef } from "react";
import nipplejs from 'nipplejs';
import { Map } from "./Map";
import { CharacterController } from "./CharacterController";

export const Experience = () => {
    const [mapScene, setMapScene] = useState(null);
    const mapRef = useRef();
    const joystickRef = useRef(null);
    const joystickStateRef = useRef({
        angle: 0,
        isPressed: false
    });

    const playerState = {
        id: 'player1',
        setState: (key, value) => {
            playerState[key] = value;
        },
        profile: {
            color: 'blue'
        }
    };

    const playerJoystick = {
        angle: () => joystickStateRef.current.angle,
        isJoystickPressed: () => joystickStateRef.current.isPressed
    };

    useEffect(() => {
        // Crear joystick en todos los dispositivos para pruebas
        // const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) || 
        //                 window.innerWidth <= 768 || 
        //                 'ontouchstart' in window;

        // if (!isMobile) {
        //     return; // No crear joystick en desktop
        // }

        // Crear contenedor del joystick
        const joystickContainer = document.createElement('div');
        joystickContainer.id = 'joystick-container';
        joystickContainer.className = 'joystick-mobile-only';
        document.body.appendChild(joystickContainer);

        // Crear joystick con configuración mejorada
        const joystick = nipplejs.create({
            zone: joystickContainer,
            mode: 'static',
            position: { left: '50%', top: '50%' },
            color: 'rgba(255,255,255,0.7)', 
            size: 120,
            threshold: 0.1,
            fadeTime: 250,
            multitouch: false,
            maxNumberOfNipples: 1,
            dataOnly: false,
            restOpacity: 0.7,
            catchDistance: 200
        });

        // Eventos del joystick
        joystick.on('start', () => {
            joystickStateRef.current = {
                angle: 0,
                isPressed: true
            };
        });

        joystick.on('move', (evt, data) => {
            if (data && data.angle && typeof data.angle.radian === 'number') {
                joystickStateRef.current = {
                    angle: data.angle.radian,
                    isPressed: true
                };
            }
        });

        joystick.on('end', () => {
            joystickStateRef.current = {
                angle: 0,
                isPressed: false
            };
        });

        joystickRef.current = joystick;

        // Cleanup mejorado
        return () => {
            try {
                if (joystickRef.current) {
                    joystickRef.current.destroy();
                    joystickRef.current = null;
                }
                const container = document.getElementById('joystick-container');
                if (container && container.parentNode) {
                    container.parentNode.removeChild(container);
                }
            } catch (error) {
                console.warn('Error during joystick cleanup:', error);
            }
        };
    }, []);

    const handleMapSceneReady = (scene) => {
        setMapScene(scene);
    };

    return (
        <>
            
            
            <Map onSceneReady={handleMapSceneReady} ref={mapRef} />
            
            <CharacterController
                position={[0, 0, 0]}
                state={playerState}
                joystick={playerJoystick}
                isUser={true}
                scene={mapScene}
                
            />
            
            <Environment preset="sunset" />
        </>
    );
};