import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { playerState, stepCompleted } from "./usePlayerState";
import { tileSize } from "../constants";

export default function usePlayerAnimation(
  ref: React.RefObject<THREE.Group>,
  onCrossedCarRoad?: (from: number, to: number) => void
) {
  const moveClock = new THREE.Clock(false);

  useFrame(() => {
    if (!ref.current) return;
    if (!playerState.movesQueue.length) return;

    const player = ref.current;
    if (!moveClock.running) moveClock.start();

    const stepTime = 0.18;
    const progress = Math.min(1, moveClock.getElapsedTime() / stepTime);

    // Target position based on queued move
    const dir = playerState.movesQueue[0];
    const startX = playerState.currentTile * tileSize;
    const startY = playerState.currentRow * tileSize;
    let endX = startX;
    let endY = startY;

    if (dir === "left") endX -= tileSize;
    if (dir === "right") endX += tileSize;
    if (dir === "forward") endY += tileSize;
    if (dir === "backward") endY -= tileSize;

    player.position.x = THREE.MathUtils.lerp(startX, endX, progress);
    player.position.y = THREE.MathUtils.lerp(startY, endY, progress);
    // Hop bounce on the body mesh (child[0])
    if (player.children[0]) {
      player.children[0].position.z = Math.sin(progress * Math.PI) * 8 + 10;
    }

    if (progress >= 1) {
      stepCompleted(onCrossedCarRoad);
      moveClock.stop();
    }
  });
}
