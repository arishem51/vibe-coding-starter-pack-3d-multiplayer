/**
 * GameScene.tsx — React Three Fiber Canvas containing the 3D game world.
 * Renders sky, lighting, ground plane, grid, and all Player entities.
 * Debug helpers (light/shadow camera) toggle with isDebugPanelVisible.
 */

import React, { useRef } from 'react';
import { Canvas, useFrame } from '@react-three/fiber';
import { Box, Plane, Grid, Sky } from '@react-three/drei';
import * as THREE from 'three';
import { DirectionalLightHelper, CameraHelper } from 'three'; // Import the helper
// Import generated types
import { PlayerData, InputState } from '../generated/types';
import { Identity } from 'spacetimedb';
import { Player } from './Player';

interface GameSceneProps {
  players: ReadonlyMap<string, PlayerData>;
  localPlayerIdentity: Identity | null;
  onPlayerRotation?: (rotation: THREE.Euler) => void;
  currentInputRef?: React.MutableRefObject<InputState>;
  isDebugPanelVisible?: boolean;
}

// Ground plane and grid that follow the local player on Z so the ground appears infinite
function FollowGround({ localPlayerZ }: { localPlayerZ: React.MutableRefObject<number> }) {
  const groupRef = useRef<THREE.Group>(null!);

  useFrame(() => {
    if (groupRef.current) groupRef.current.position.z = localPlayerZ.current;
  });

  return (
    <group ref={groupRef}>
      <Plane
        args={[200, 200]}
        rotation={[-Math.PI / 2, 0, 0]}
        position={[0, -0.001, 0]}
        receiveShadow
      >
        <meshStandardMaterial color="#606060" />
      </Plane>
      <Grid
        position={[0, 0, 0]}
        args={[200, 200]}
        cellSize={2}
        cellThickness={1}
        cellColor={new THREE.Color('#888888')}
      />
    </group>
  );
}

export const GameScene: React.FC<GameSceneProps> = ({
  players,
  localPlayerIdentity,
  onPlayerRotation,
  currentInputRef,
  isDebugPanelVisible = false
}) => {
  const directionalLightRef = useRef<THREE.DirectionalLight>(null!);
  const localPlayerZRef = useRef<number>(0); 

  return (
    <Canvas 
      camera={{ position: [0, 10, 20], fov: 60 }} 
      style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', zIndex: 1 }} 
      shadows // Enable shadows
    >
      {/* Remove solid color background */}
      {/* <color attach="background" args={['#add8e6']} /> */}
      
      {/* Add Sky component */}
      <Sky distance={450000} sunPosition={[5, 1, 8]} inclination={0} azimuth={0.25} />

      {/* Ambient light for general scene illumination */}
      <ambientLight intensity={0.5} />
      
      {/* Main directional light with improved shadow settings */}
      <directionalLight 
        ref={directionalLightRef} // Assign ref
        position={[15, 20, 10]} 
        intensity={2.5} 
        castShadow 
        shadow-mapSize-width={2048} // Increased resolution
        shadow-mapSize-height={2048} // Increased resolution
        shadow-bias={-0.0001} // Made bias less negative (closer to 0)
        shadow-camera-left={-30} // Wider frustum
        shadow-camera-right={30}
        shadow-camera-top={30}
        shadow-camera-bottom={-30}
        shadow-camera-near={0.1} // Closer near plane
        shadow-camera-far={100} // Further far plane
      />

      {/* Conditionally render Light and Shadow Camera Helpers */}
      {isDebugPanelVisible && directionalLightRef.current && (
        <>
          <primitive object={new DirectionalLightHelper(directionalLightRef.current, 5)} />
          {/* Add CameraHelper for the shadow camera */}
          <primitive object={new CameraHelper(directionalLightRef.current.shadow.camera)} /> 
        </>
      )}
      
      <FollowGround localPlayerZ={localPlayerZRef} />

      {/* Render Players */}
      {Array.from(players.values()).map((player) => {
        const isLocal = localPlayerIdentity?.toHexString() === player.identity.toHexString();
        if (isLocal) localPlayerZRef.current = player.position.z;
        return (
          <Player
            key={player.identity.toHexString()}
            playerData={player}
            isLocalPlayer={isLocal}
            onRotationChange={isLocal ? onPlayerRotation : undefined}
            currentInputRef={isLocal ? currentInputRef : undefined}
            isDebugArrowVisible={isLocal ? isDebugPanelVisible : false}
            isDebugPanelVisible={isDebugPanelVisible}
          />
        );
      })}

      {/* Remove OrbitControls as we're using our own camera controls */}
    </Canvas>
  );
};
