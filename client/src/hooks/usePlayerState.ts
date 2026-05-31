import { getRowType, minTileIndex, maxTileIndex } from "../constants";

// Module-level mutable state (matches tutorial pattern)
export const playerState = {
  currentRow: 0,
  currentTile: 0,
  movesQueue: [] as Array<"forward" | "backward" | "left" | "right">,
  ref: null as THREE.Group | null,
  blocked: false, // true when in_quiz, eliminated
};

// Avoid importing Three at module level — use type only
import type * as THREE from "three";

export function queueMove(dir: "forward" | "backward" | "left" | "right") {
  if (playerState.blocked) return;

  const finalRow =
    dir === "forward"
      ? playerState.currentRow + playerState.movesQueue.filter((m) => m === "forward").length -
        playerState.movesQueue.filter((m) => m === "backward").length + 1
      : dir === "backward"
      ? playerState.currentRow + playerState.movesQueue.filter((m) => m === "forward").length -
        playerState.movesQueue.filter((m) => m === "backward").length - 1
      : playerState.currentRow;

  const finalTile =
    dir === "left"
      ? playerState.currentTile - 1 - playerState.movesQueue.filter((m) => m === "right").length +
        playerState.movesQueue.filter((m) => m === "left").length
      : dir === "right"
      ? playerState.currentTile + 1 + playerState.movesQueue.filter((m) => m === "right").length -
        playerState.movesQueue.filter((m) => m === "left").length
      : playerState.currentTile;

  // Boundary check
  if (finalRow < 0) return;
  if (finalTile < minTileIndex || finalTile > maxTileIndex) return;

  playerState.movesQueue.push(dir);
}

export function stepCompleted(
  onCrossedCarRoad?: (fromRow: number, toRow: number) => void
) {
  const dir = playerState.movesQueue.shift();
  const prevRow = playerState.currentRow;

  if (dir === "forward") playerState.currentRow += 1;
  if (dir === "backward") playerState.currentRow -= 1;
  if (dir === "left") playerState.currentTile -= 1;
  if (dir === "right") playerState.currentTile += 1;

  if (onCrossedCarRoad) {
    const fromType = getRowType(prevRow);
    const toType = getRowType(playerState.currentRow);
    if (fromType === "road" && toType === "safe") {
      onCrossedCarRoad(prevRow, playerState.currentRow);
    }
  }
}

export function setPlayerRef(ref: THREE.Group) {
  playerState.ref = ref;
}
