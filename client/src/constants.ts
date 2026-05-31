export const tileSize = 42;
export const minTileIndex = -30;
export const maxTileIndex = 30;
export const tilesPerRow = maxTileIndex - minTileIndex + 1;

export const DB_HOST = `${window.location.hostname}:3000`;
export const DB_NAME = "spst-crossy";

// Map row types: 0=safe, 1=road
// Pattern repeats: safe, road, road, safe, road, road, road, safe...
const ROW_PATTERN = [0, 1, 1, 0, 1, 1, 1, 0, 1, 1, 0, 1, 1, 1, 1, 0];

export function getRowType(rowIndex: number): "safe" | "road" {
  if (rowIndex <= 0) return "safe";
  return ROW_PATTERN[rowIndex % ROW_PATTERN.length] === 0 ? "safe" : "road";
}

export function getCarDirection(rowIndex: number): 1 | -1 {
  return rowIndex % 3 === 0 ? 1 : -1;
}

export function getCarSpeed(rowIndex: number): number {
  const base = 80 + (rowIndex % 5) * 30;
  return base;
}

export function getCarSpacing(rowIndex: number): number {
  return 6 + (rowIndex % 4) * 2;
}

export const NUM_ROWS = 60;
