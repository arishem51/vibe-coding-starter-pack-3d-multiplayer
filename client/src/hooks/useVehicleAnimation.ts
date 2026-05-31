import { useFrame } from "@react-three/fiber";
import { tileSize, minTileIndex, maxTileIndex } from "../constants";
import * as THREE from "three";

export default function useVehicleAnimation(
  ref: React.RefObject<THREE.Group>,
  direction: 1 | -1,
  speed: number
) {
  useFrame((_state, delta) => {
    if (!ref.current) return;
    const v = ref.current;
    const begin = (minTileIndex - 3) * tileSize;
    const end = (maxTileIndex + 3) * tileSize;

    if (direction === 1) {
      v.position.x = v.position.x > end ? begin : v.position.x + speed * delta;
    } else {
      v.position.x = v.position.x < begin ? end : v.position.x - speed * delta;
    }
  });
}
