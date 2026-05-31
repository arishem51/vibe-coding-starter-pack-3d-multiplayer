import { useEffect } from "react";
import { queueMove } from "./usePlayerState";
import { getConn } from "../connection";

export default function useEventListeners(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      let dir: "forward" | "backward" | "left" | "right" | null = null;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") dir = "forward";
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") dir = "backward";
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") dir = "left";
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") dir = "right";

      if (!dir) return;
      const target = queueMove(dir);
      if (target) {
        // Send target position immediately on key press instead of waiting for animation + 20Hz interval
        getConn()?.reducers.updatePosition({ x: target.tile, z: target.row });
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);
}
