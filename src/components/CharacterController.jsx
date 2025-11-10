import { useFrame } from '@react-three/fiber';
import { RigidBody, CapsuleCollider } from '@react-three/rapier';
import { useRef, useState, useEffect, useCallback, useMemo } from 'react';
import { CharacterSoldier } from '../components/CharacteSoldier.jsx';
import { CameraControls, Html } from "@react-three/drei";
import { Vector3 } from 'three';
import { useNavigate, useLocation } from 'react-router-dom';
import { SpawnPopup, getSpawnPoints } from './spawnConfig';
import { MessagePopup, getMessagePoints } from './messageConfig';
import { useUser } from '../hooks/useUser';

const MOVEMENT_SPEED = 350;
const DETECTION_RADIUS = 8;

const CAMERA_CONFIG = {
    distance: {
        desktop: { y: 40, z: 45 },
        mobile: { y: 33, z: 25 },
    },
    follow: {
        smoothTime: 0.25,
        smoothTimeRotation: 0.3,
        offset: 1.5,
    },
    limits: {
        maxDistance: 25,
        minDistance: 5,
        maxPolarAngle: Math.PI / 2.1,
        minPolarAngle: Math.PI / 6,
        minAzimuthAngle: -Math.PI,
        maxAzimuthAngle: Math.PI,
    },
    controls: {
        dragToOffset: true,
        mouseButtons: { left: 1, middle: 2, right: 0, wheel: 4 },
    }
};

export const CharacterController = ({ 
    state, 
    joystick, 
    isUser,
    scene,
    onSpawnAction,
    ...props 
}) => {
    const { userId } = useUser();
    const group = useRef();
    const character = useRef();
    const rigidbody = useRef();
    const controls = useRef();
    const [animation, setAnimation] = useState("Idle");
    const [activeSpawn, setActiveSpawn] = useState(null);
    const [activeMessage, setActiveMessage] = useState(null);
    const [keysPressed, setKeysPressed] = useState({
        w: false,
        a: false,
        s: false,
        d: false
    });
    const navigate = useNavigate();
    const location = useLocation();

    const [spawnPoints, setSpawnPoints] = useState([]);
    const [messagePoints, setMessagePoints] = useState([]);
    const [shownMessages, setShownMessages] = useState(new Set());

    // Memoized camera settings based on screen size
    const cameraSettings = useMemo(() => 
        window.innerWidth < 1024 
            ? CAMERA_CONFIG.distance.mobile 
            : CAMERA_CONFIG.distance.desktop, 
        []
    );

    // Optimized point detection logic
    const findNearestPoint = useCallback((points, positionGetter) => {
        if (!rigidbody.current || points.length === 0) return null;
    
        // Usar distancia al cuadrado para evitar calculos costosos de raíz cuadrada
        const playerPosition = positionGetter();
        return points.reduce((nearest, point) => {
            const distanceSq = new Vector3(
                playerPosition.x - point.position.x,
                playerPosition.y - point.position.y,
                playerPosition.z - point.position.z
            ).lengthSq();
    
            return distanceSq < DETECTION_RADIUS * DETECTION_RADIUS 
                && (!nearest || distanceSq < nearest.distanceSq) 
                ? { point, distanceSq } 
                : nearest;
        }, null);
    }, []);

    // Initialize spawn and message points
    useEffect(() => {
        if (scene) {
            const spawns = getSpawnPoints(scene);
            const messages = getMessagePoints(scene);
            setSpawnPoints(spawns);
            setMessagePoints(messages);

            // Restore last spawn position
            const lastSpawnData = localStorage.getItem('lastSpawnData');
            if (lastSpawnData && rigidbody.current && location.state?.fromSpawn) {
                const { position } = JSON.parse(lastSpawnData);
                rigidbody.current.setTranslation(position);
            }
        }
    }, [scene, location]);

    // Keyboard controls for desktop
    useEffect(() => {
        const handleKeyDown = (event) => {
            const key = event.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                event.preventDefault();
                setKeysPressed(prev => ({ ...prev, [key]: true }));
            }
        };

        const handleKeyUp = (event) => {
            const key = event.key.toLowerCase();
            if (['w', 'a', 's', 'd'].includes(key)) {
                event.preventDefault();
                setKeysPressed(prev => ({ ...prev, [key]: false }));
            }
        };

        // Add event listeners
        window.addEventListener('keydown', handleKeyDown);
        window.addEventListener('keyup', handleKeyUp);

        // Cleanup
        return () => {
            window.removeEventListener('keydown', handleKeyDown);
            window.removeEventListener('keyup', handleKeyUp);
        };
    }, []);

    // Memoized action handlers
    const handleSpawnAction = useCallback((action) => {
        if (action && rigidbody.current && activeSpawn) {
            const playerPosition = rigidbody.current.translation();
            const spawnData = {
                position: {
                    x: playerPosition.x,
                    y: playerPosition.y,
                    z: playerPosition.z
                },
                spawnId: activeSpawn.id,
                userId: userId // Incluir el ID del usuario si está disponible
            };
            
            console.log('🎮 [CharacterController] Accediendo a spawn con ID del usuario:', {
                userId: userId,
                spawnId: activeSpawn.id,
                spawnData: spawnData
            });
            
            localStorage.setItem('lastSpawnData', JSON.stringify(spawnData));
            navigate(action);
        }
    }, [activeSpawn, navigate, userId]);

    const handleMessageClose = useCallback(() => {
        if (activeMessage) {
            setShownMessages(prev => new Set([...prev, activeMessage.id]));
            setActiveMessage(null);
        }
    }, [activeMessage]);

    const handleFormSubmit = useCallback(async (formData) => {
        try {
            // Obtener URL del backend desde variables de entorno
            const backendUrl = import.meta.env.MODE === 'development' 
                ? import.meta.env.VITE_BACKEND_URL_DEVELOPMENT || 'http://localhost:3000'
                : import.meta.env.VITE_API_URL_PRODUCTION_1 || 'http://localhost:3000';
            
            const response = await fetch(`${backendUrl}/api/feedback`, {
                method: 'POST',
                mode: 'cors',
                credentials: 'include',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    feedback_text: formData.feedback_text,
                    messageId: activeMessage.id,
                    timestamp: new Date().toISOString()
                })
            });
    
            if (!response.ok) {
                throw new Error('Failed to submit form');
            }
    
            handleMessageClose();
        } catch (error) {
            console.error('Error submitting form:', error);
        }
    }, [activeMessage, handleMessageClose]);

    useFrame((_, delta) => {
        if (!rigidbody.current) return;

        // Camera following logic
        if (isUser && controls.current) {
            const playerWorldPos = rigidbody.current.translation();
            controls.current.setLookAt(
                playerWorldPos.x,
                playerWorldPos.y + cameraSettings.y,
                playerWorldPos.z + cameraSettings.z,
                playerWorldPos.x,
                playerWorldPos.y + CAMERA_CONFIG.follow.offset,
                playerWorldPos.z,
                true
            );
        }

        // Spawn and message detection
        const nearestSpawn = findNearestPoint(
            spawnPoints, 
            () => rigidbody.current.translation()
        );

        const nearestMessage = findNearestPoint(
            messagePoints.filter(msg => !shownMessages.has(msg.id)), 
            () => rigidbody.current.translation()
        );

        // Update active spawn and message states
        setActiveSpawn(nearestSpawn?.point || null);
        setActiveMessage(nearestMessage?.point || null);

        // Movement logic - Joystick (mobile) or Keyboard (desktop)
        let movementAngle = 0;
        let isMoving = false;

        // Check joystick input (mobile)
        const joystickAngle = joystick.angle();
        if (joystick.isJoystickPressed() && joystickAngle !== undefined && joystickAngle !== null) {
            // Ajustar el ángulo del joystick: rotar +π/2 para corregir la orientación
            // nipplejs usa 0° = arriba, pero necesitamos 0° = adelante (eje Z positivo)
            // Se invierte completamente (horizontal y vertical) agregando π
            movementAngle = joystickAngle + Math.PI / 2;
            isMoving = true;
        }
        
        // Check keyboard input (desktop) - WASD controls
        else {
            let moveX = 0;
            let moveZ = 0;

            if (keysPressed.w) moveZ -= 1; // Forward
            if (keysPressed.s) moveZ += 1; // Backward
            if (keysPressed.a) moveX -= 1; // Left
            if (keysPressed.d) moveX += 1; // Right

            // Debug: Log key states
            if (keysPressed.w || keysPressed.s || keysPressed.a || keysPressed.d) {
                console.log('Keys pressed:', { w: keysPressed.w, a: keysPressed.a, s: keysPressed.s, d: keysPressed.d });
                console.log('Movement vector:', { moveX, moveZ });
            }

            // Calculate movement angle from keyboard input
            if (moveX !== 0 || moveZ !== 0) {
                movementAngle = Math.atan2(moveX, moveZ);
                isMoving = true;
                console.log('Movement angle:', movementAngle, 'Moving:', isMoving);
            }
        }

        // Apply movement - cambiar condición para permitir movimiento cuando isMoving es true
        // incluso si el ángulo es 0 (movimiento hacia adelante/atrás)
        if (isMoving) {
            setAnimation("Run");
            character.current.rotation.y = movementAngle;

            const impulse = {
                x: Math.sin(movementAngle) * MOVEMENT_SPEED * delta,
                y: 0,
                z: Math.cos(movementAngle) * MOVEMENT_SPEED * delta
            };

            rigidbody.current.applyImpulse(impulse, true);
        } else {
            setAnimation("Idle");
        }
    });

    return (
        <group ref={group} {...props}>
            {/* Camera Controls */}
            {isUser && (
                <CameraControls 
                    ref={controls}
                    {...CAMERA_CONFIG.limits}
                    smoothTime={CAMERA_CONFIG.follow.smoothTime}
                    smoothTimeRotation={CAMERA_CONFIG.follow.smoothTimeRotation}
                    dragToOffset={CAMERA_CONFIG.controls.dragToOffset}
                    mouseButtons={CAMERA_CONFIG.controls.mouseButtons}
                />
            )}

            {/* Keyboard Controls Indicator - Only on Desktop */}
            {isUser && (
                <Html
                    position={[0, 3, 0]}
                    center
                    distanceFactor={10}
                    occlude
                >
                    <div className="keyboard-controls-indicator">
                        <div className="text-white text-sm font-bold bg-black/50 px-3 py-1 rounded-lg backdrop-blur-sm">
                            WASD para mover
                        </div>
                    </div>
                </Html>
            )}

            {/* Character Body */}
            <RigidBody 
                ref={rigidbody}
                colliders={false}
                linearDamping={12}
                lockRotations
            >
                <group ref={character}>
                    <CharacterSoldier 
                        color={state.profile?.color}
                        animation={animation}
                    />
                </group>
                <CapsuleCollider args={[0.7, 0.6]} position={[0, 1.28, 0]} />
            </RigidBody>

            {/* Spawn Popup */}
            {activeSpawn && (
                <Html
                    position={[
                        rigidbody.current?.translation().x || 0,
                        (rigidbody.current?.translation().y || 0) + 2,
                        rigidbody.current?.translation().z || 0
                    ]}
                    center
                >
                    <SpawnPopup
                        title={activeSpawn.title}
                        description={activeSpawn.description}
                        onAction={() => handleSpawnAction(activeSpawn.action)}
                    />
                </Html>
            )}

            {/* Message Popup */}
            {activeMessage && !activeSpawn && (
                <Html
                    position={[
                        rigidbody.current?.translation().x || 0,
                        (rigidbody.current?.translation().y || 0) + 2,
                        rigidbody.current?.translation().z || 0
                    ]}
                    center
                >
                    <MessagePopup
                        title={activeMessage.title}
                        message={activeMessage.message}
                        description={activeMessage.description}
                        type={activeMessage.type}
                        formFields={activeMessage.formFields}
                        onClose={handleMessageClose}
                        onSubmit={handleFormSubmit}
                    />
                </Html>
            )}
        </group>
    );
};