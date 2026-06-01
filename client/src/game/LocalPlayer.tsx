import { useRef, useEffect } from "react";
import { useThree } from "@react-three/fiber";
import * as THREE from "three";
import { tileSize } from "../constants";
import { setPlayerRef, playerState } from "../hooks/usePlayerState";
import usePlayerAnimation from "../hooks/usePlayerAnimation";

interface Props {
  characterType: string;
  shieldActive: boolean;
  onCrossedCarRoad?: (from: number, to: number) => void;
  onPositionUpdate?: (x: number, z: number) => void;
}

const CHAR_COLORS: Record<string, number> = {
  white: 0xffffff,
  black: 0x222222,
};

export function LocalPlayer({ characterType, shieldActive, onCrossedCarRoad, onPositionUpdate }: Props) {
  const ref = useRef<THREE.Group>(null!);
  const camera = useThree((s) => s.camera);

  usePlayerAnimation(ref, (from, to) => {
    onCrossedCarRoad?.(from, to);
    onPositionUpdate?.(playerState.currentTile, playerState.currentRow);
  });

  useEffect(() => {
    if (!ref.current) return;
    camera.position.set(300, -300, 300);
    ref.current.add(camera);
    setPlayerRef(ref.current);
    return () => {
      ref.current?.remove(camera);
    };
  }, [camera]);

  const color = CHAR_COLORS[characterType] ?? 0xffffff;

  return (
    <group ref={ref} position-x={playerState.currentTile * tileSize} position-y={playerState.currentRow * tileSize}>
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[15, 15, 20]} />
        <meshLambertMaterial color={color} flatShading />
      </mesh>
      {/* Shield aura */}
      {shieldActive && (
        <mesh position={[0, 0, 10]}>
          <boxGeometry args={[22, 22, 28]} />
          <meshLambertMaterial color={0x4499ff} transparent opacity={0.3} />
        </mesh>
      )}
    </group>
  );
}
