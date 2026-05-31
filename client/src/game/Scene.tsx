import { Canvas } from "@react-three/fiber";
import { Map } from "./Map";
import { LocalPlayer } from "./LocalPlayer";
import { RemotePlayer } from "./RemotePlayer";
import { useGameStore } from "../stores/gameStore";

interface Props {
  myIdentityHex: string;
  shieldActive: boolean;
  characterType: string;
  onCarHit: () => void;
  onCrossedCarRoad: (from: number, to: number) => void;
  onPositionUpdate: (x: number, z: number) => void;
}

export function Scene({
  myIdentityHex,
  shieldActive,
  characterType,
  onCarHit,
  onCrossedCarRoad,
  onPositionUpdate,
}: Props) {
  const players = useGameStore((s) => s.players);
  const remotePlayers = [...players.values()].filter(
    (p) => p.identity.toHexString() !== myIdentityHex
  );

  return (
    <Canvas
      orthographic
      camera={{ up: [0, 0, 1], position: [300, -300, 300] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[-100, -100, 200]} intensity={1} />

      <Map onCarHit={onCarHit} shieldActive={shieldActive} />

      <LocalPlayer
        characterType={characterType}
        shieldActive={shieldActive}
        onCrossedCarRoad={onCrossedCarRoad}
        onPositionUpdate={onPositionUpdate}
      />

      {remotePlayers.map((p) => (
        <RemotePlayer key={p.identity.toHexString()} player={p} />
      ))}
    </Canvas>
  );
}
