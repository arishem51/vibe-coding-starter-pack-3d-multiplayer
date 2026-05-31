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

const OPPOSITE: Record<string, string> = {
  left: "right", right: "left",
  forward: "backward", backward: "forward",
};
const MAX_QUEUE = 2;

export function queueMove(dir: "forward" | "backward" | "left" | "right"): { tile: number; row: number } | null {
  if (playerState.blocked) return null;

  const qLen = playerState.movesQueue.length;
  if (qLen >= MAX_QUEUE) {
    // Allow 1 extra slot only if it's an opposite direction to the last queued move
    const lastDir = playerState.movesQueue[qLen - 1];
    if (qLen >= MAX_QUEUE + 1 || OPPOSITE[lastDir] !== dir) return null;
  }

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
  if (finalRow < 0) return null;
  if (finalTile < minTileIndex || finalTile > maxTileIndex) return null;

  playerState.movesQueue.push(dir);
  return { tile: finalTile, row: finalRow };
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
