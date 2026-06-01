import { useRef, useEffect } from "react";
import { useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { tileSize } from "../constants";
import { Projectile } from "../types";

const SERVER_TICK_S = 0.3; // must match server ProjectileTickSchedule interval

interface Props {
  projectile: Projectile;
}

export function ProjectileDot({ projectile }: Props) {
  const ref = useRef<THREE.Mesh>(null!);
  // On mount: predict first tick immediately so bullet moves right away from player position
  const fromY = useRef(projectile.posZ * tileSize);
  const toY = useRef((projectile.posZ + projectile.direction) * tileSize);
  const elapsed = useRef(0);

  useEffect(() => {
    fromY.current = ref.current ? ref.current.position.y : projectile.posZ * tileSize;
    toY.current = projectile.posZ * tileSize;
    elapsed.current = 0;
  }, [projectile.posZ, projectile.direction]);

  useFrame((_, delta) => {
    if (!ref.current) return;
    elapsed.current = Math.min(elapsed.current + delta, SERVER_TICK_S);
    const t = elapsed.current / SERVER_TICK_S;
    ref.current.position.x = projectile.posX * tileSize;
    ref.current.position.y = THREE.MathUtils.lerp(fromY.current, toY.current, t);
  });

  return (
    <mesh ref={ref} position={[projectile.posX * tileSize, projectile.posZ * tileSize, 14]}>
      <sphereGeometry args={[5, 8, 8]} />
      <meshLambertMaterial color={0xffffff} emissive={0xffffff} emissiveIntensity={0.8} />
    </mesh>
  );
}
