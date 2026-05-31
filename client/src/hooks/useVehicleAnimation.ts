import { useFrame } from "@react-three/fiber";
import { tileSize, minTileIndex, maxTileIndex } from "../constants";
import * as THREE from "three";

const begin = (minTileIndex - 3) * tileSize;
const end = (maxTileIndex + 3) * tileSize;
const range = end - begin;

export default function useVehicleAnimation(
  ref: React.RefObject<THREE.Group>,
  direction: 1 | -1,
  speed: number,
  initialX: number,
  startedAtMs: number
) {
  useFrame(() => {
    if (!ref.current) return;
    const elapsed = (Date.now() - startedAtMs) / 1000;
    const traveled = (speed * elapsed) % range;

    let pos: number;
    if (direction === 1) {
      pos = begin + ((initialX - begin + traveled) % range);
    } else {
      pos = end - ((end - initialX + traveled) % range);
    }
    ref.current.position.x = pos;
  });
}
