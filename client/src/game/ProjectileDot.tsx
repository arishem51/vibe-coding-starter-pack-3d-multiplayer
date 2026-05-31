import { useRef } from "react";
import { useFrame } from "@react-three/fiber";
import { tileSize } from "../constants";
import { Projectile } from "../types";
import { projectileHitsCar } from "./carPositionUtils";
import { getConn } from "../connection";
import { useGameStore } from "../stores/gameStore";

interface Props {
  projectile: Projectile;
}

export function ProjectileDot({ projectile }: Props) {
  const destroyed = useRef(false);
  const startedAtMs = useGameStore(
    (s) => s.room?.startedAt ? Number(s.room.startedAt / 1000n) : Date.now()
  );

  useFrame(() => {
    if (destroyed.current) return;
    if (projectileHitsCar(projectile.posX, projectile.posZ, startedAtMs)) {
      destroyed.current = true;
      getConn()?.reducers.destroyProjectile({ projectileId: projectile.projectileId });
    }
  });

  return (
    <mesh
      position-x={projectile.posX * tileSize}
      position-y={projectile.posZ * tileSize}
      position-z={14}
    >
      <sphereGeometry args={[5, 8, 8]} />
      <meshLambertMaterial color={0xffffff} emissive={0xffffff} emissiveIntensity={0.8} />
    </mesh>
  );
}
