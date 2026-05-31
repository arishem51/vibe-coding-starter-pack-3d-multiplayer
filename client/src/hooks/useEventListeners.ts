import { useEffect } from "react";
import { queueMove } from "./usePlayerState";

export default function useEventListeners(active: boolean) {
  useEffect(() => {
    if (!active) return;

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.repeat) return;
      if (e.key === "ArrowUp" || e.key === "w" || e.key === "W") queueMove("forward");
      else if (e.key === "ArrowDown" || e.key === "s" || e.key === "S") queueMove("backward");
      else if (e.key === "ArrowLeft" || e.key === "a" || e.key === "A") queueMove("left");
      else if (e.key === "ArrowRight" || e.key === "d" || e.key === "D") queueMove("right");
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [active]);
}
