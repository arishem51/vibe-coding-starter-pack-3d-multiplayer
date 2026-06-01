import { tileSize } from "../constants";
import { PlayerData } from "../types";

interface Props {
  player: PlayerData;
}

const CHAR_COLORS: Record<string, number> = {
  white: 0xffffff,
  black: 0x222222,
};

export function RemotePlayer({ player }: Props) {
  const color = CHAR_COLORS[player.characterType] ?? 0xffffff;
  const opacity = player.isAdmin ? 0.55 : 0.35;
  const isEliminated = player.status === "eliminated";

  if (isEliminated) return null;

  return (
    <group
      position-x={player.posX * tileSize}
      position-y={player.posZ * tileSize}
    >
      {/* Body */}
      <mesh position={[0, 0, 10]}>
        <boxGeometry args={[15, 15, 20]} />
        <meshLambertMaterial color={color} transparent opacity={opacity} />
      </mesh>
      {/* Shield aura for Black */}
      {player.shieldActive && (
        <mesh position={[0, 0, 10]}>
          <boxGeometry args={[22, 22, 28]} />
          <meshLambertMaterial color={0x4499ff} transparent opacity={0.25} />
        </mesh>
      )}
      {/* Name tag (simple box above) */}
      <mesh position={[0, 0, 30]}>
        <boxGeometry args={[1, 1, 1]} />
        <meshLambertMaterial color={color} transparent opacity={0} />
      </mesh>
    </group>
  );
}
