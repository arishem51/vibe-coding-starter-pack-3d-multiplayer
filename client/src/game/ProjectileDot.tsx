import { tileSize } from "../constants";
import { Projectile } from "../types";

interface Props {
  projectile: Projectile;
}

export function ProjectileDot({ projectile }: Props) {
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
