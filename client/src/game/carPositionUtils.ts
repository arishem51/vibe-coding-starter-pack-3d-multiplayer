import { tileSize, minTileIndex, maxTileIndex, getRowType, getCarDirection, getCarSpeed, getCarSpacing } from "../constants";

const begin = (minTileIndex - 3) * tileSize;
const end = (maxTileIndex + 3) * tileSize;
const range = end - begin;

export function getCarX3dAtTime(
  initialTileIndex: number,
  direction: 1 | -1,
  speed: number,
  elapsedS: number
): number {
  const initialX = initialTileIndex * tileSize;
  const traveled = (speed * elapsedS) % range;
  if (direction === 1) {
    return begin + ((initialX - begin + traveled) % range);
  } else {
    return end - ((end - initialX + traveled) % range);
  }
}

const CAR_HALF_WIDTH = 30; // boxGeometry args[0]=60 / 2
const PROJ_RADIUS = 5;
const HIT_THRESHOLD = CAR_HALF_WIDTH + PROJ_RADIUS;

export function projectileHitsCar(
  projPosX: number,  // tile units
  projPosZ: number,  // row units
  startedAtMs: number
): boolean {
  const rowIndex = Math.round(projPosZ);
  if (getRowType(rowIndex) !== "road") return false;

  const projX3d = projPosX * tileSize;
  const elapsedS = (Date.now() - startedAtMs) / 1000;
  const dir = getCarDirection(rowIndex) as 1 | -1;
  const speed = getCarSpeed(rowIndex);
  const spacing = getCarSpacing(rowIndex);

  for (let t = minTileIndex; t <= maxTileIndex; t += spacing) {
    const carX = getCarX3dAtTime(t, dir, speed, elapsedS);
    if (Math.abs(projX3d - carX) < HIT_THRESHOLD) return true;
  }
  return false;
}
