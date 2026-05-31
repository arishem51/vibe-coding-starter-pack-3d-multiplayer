import { useRef } from "react";
import * as THREE from "three";
import { tileSize } from "../constants";
import useVehicleAnimation from "../hooks/useVehicleAnimation";
import useHitDetection from "../hooks/useHitDetection";

interface Props {
  rowIndex: number;
  initialTileIndex: number;
  direction: 1 | -1;
  speed: number;
  color: number;
  onHit: () => void;
  shieldActive: boolean;
}

export function Vehicle({ rowIndex, initialTileIndex, direction, speed, color, onHit, shieldActive }: Props) {
  const ref = useRef<THREE.Group>(null!);
  useVehicleAnimation(ref, direction, speed);
  useHitDetection(ref, rowIndex, onHit, shieldActive);

  return (
    <group
      ref={ref}
      position-x={initialTileIndex * tileSize}
      rotation-z={direction === 1 ? 0 : Math.PI}
    >
      {/* Car body */}
      <mesh position={[0, 0, 12]}>
        <boxGeometry args={[60, 30, 15]} />
        <meshLambertMaterial color={color} />
      </mesh>
      {/* Cabin */}
      <mesh position={[-6, 0, 25.5]}>
        <boxGeometry args={[33, 24, 12]} />
        <meshLambertMaterial color={0xffffff} />
      </mesh>
      {/* Wheels */}
      <mesh position={[-18, 0, 6]}>
        <boxGeometry args={[12, 33, 12]} />
        <meshLambertMaterial color={0x222222} />
      </mesh>
      <mesh position={[18, 0, 6]}>
        <boxGeometry args={[12, 33, 12]} />
        <meshLambertMaterial color={0x222222} />
      </mesh>
    </group>
  );
}
