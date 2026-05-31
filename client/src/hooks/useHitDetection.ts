import * as THREE from "three";
import { useFrame } from "@react-three/fiber";
import { useRef } from "react";
import { playerState } from "./usePlayerState";

export default function useHitDetection(
  vehicleRef: React.RefObject<THREE.Group>,
  rowIndex: number,
  onHit: () => void,
  shieldActive: boolean
) {
  const hitCooldown = useRef(false);

  useFrame(() => {
    if (!vehicleRef.current || !playerState.ref) return;
    if (hitCooldown.current) return;

    // Only check nearby rows for performance
    const playerRow = playerState.currentRow;
    if (Math.abs(rowIndex - playerRow) > 1) return;

    const vBox = new THREE.Box3().setFromObject(vehicleRef.current);
    const pBox = new THREE.Box3().setFromObject(playerState.ref);

    if (pBox.intersectsBox(vBox)) {
      if (shieldActive) return; // Shield blocks hit
      hitCooldown.current = true;
      onHit();
      // Reset cooldown after 2s to prevent spam
      setTimeout(() => { hitCooldown.current = false; }, 2000);
    }
  });
}
