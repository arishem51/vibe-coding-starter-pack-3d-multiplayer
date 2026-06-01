import { useState, useCallback } from "react";
import { Canvas } from "@react-three/fiber";
import { Map } from "./Map";
import { LocalPlayer } from "./LocalPlayer";
import { RemotePlayer } from "./RemotePlayer";
import { ProjectileDot } from "./ProjectileDot";
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
  const [currentRow, setCurrentRow] = useState(0);
  const players = useGameStore((s) => s.players);
  const projectiles = useGameStore((s) => s.projectiles);
  const room = useGameStore((s) => s.room);
  const startedAtMs = room?.startedAt ? Number(room.startedAt / 1000n) : Date.now();
  const roomCode = room?.roomCode ?? null;
  const remotePlayers = [...players.values()].filter(
    (p) => p.identity.toHexString() !== myIdentityHex && p.roomCode === roomCode
  );

  return (
    <Canvas
      orthographic
      camera={{ up: [0, 0, 1], position: [300, -300, 300] }}
      style={{ width: "100vw", height: "100vh" }}
    >
      <ambientLight intensity={0.8} />
      <directionalLight position={[-100, -100, 200]} intensity={1} />

      <Map currentRow={currentRow} onCarHit={onCarHit} shieldActive={shieldActive} startedAtMs={startedAtMs} />

      <LocalPlayer
        characterType={characterType}
        shieldActive={shieldActive}
        onCrossedCarRoad={onCrossedCarRoad}
        onPositionUpdate={useCallback((tile: number, row: number) => {
          setCurrentRow(row);
          onPositionUpdate(tile, row);
        }, [onPositionUpdate])}
      />

      {remotePlayers.map((p) => (
        <RemotePlayer key={p.identity.toHexString()} player={p} />
      ))}

      {[...projectiles.values()].filter((proj) => proj.roomCode === roomCode).map((proj) => (
        <ProjectileDot key={String(proj.projectileId)} projectile={proj} />
      ))}
    </Canvas>
  );
}
