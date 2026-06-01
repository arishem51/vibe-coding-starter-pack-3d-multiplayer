import { useState, useRef, useMemo } from "react";
import * as THREE from "three";
import { useThree, useFrame } from "@react-three/fiber";
import { Grass } from "./Grass";
import { Road } from "./Road";
import { Vehicle } from "./Vehicle";
import { getRowType, getCarDirection, getCarSpeed, getCarSpacing, minTileIndex, maxTileIndex, tileSize } from "../constants";

const CAR_COLORS = [0xbdb638, 0x78b14b, 0xa52523, 0x4488cc, 0xdd7722];

function getRowLayout(rowIndex: number) {
  if (getRowType(rowIndex) !== "road") return null;
  const dir = getCarDirection(rowIndex);
  const spacing = getCarSpacing(rowIndex);
  const color = CAR_COLORS[rowIndex % CAR_COLORS.length];
  const cars: { tileIndex: number; color: number }[] = [];
  for (let t = minTileIndex; t <= maxTileIndex; t += spacing) {
    cars.push({ tileIndex: t, color });
  }
  return { dir, cars };
}

interface Props {
  currentRow: number;
  onCarHit: () => void;
  shieldActive: boolean;
  startedAtMs: number;
}

export function Map({ currentRow, onCarHit, shieldActive, startedAtMs }: Props) {
  const { camera } = useThree();
  const [firstRow, setFirstRow] = useState(0);
  const [lastRow, setLastRow] = useState(currentRow + 20);
  const prevFirst = useRef(-1);
  const prevLast = useRef(-1);
  const frustum = useMemo(() => new THREE.Frustum(), []);
  const matrix = useMemo(() => new THREE.Matrix4(), []);
  const pt = useMemo(() => new THREE.Vector3(), []);

  useFrame(() => {
    matrix.multiplyMatrices(camera.projectionMatrix, camera.matrixWorldInverse);
    frustum.setFromProjectionMatrix(matrix);

    // Scan backward from currentRow to find first visible row
    let first = currentRow;
    for (let r = currentRow; r >= Math.max(0, currentRow - 35); r--) {
      pt.set(0, r * tileSize, 0);
      if (frustum.containsPoint(pt)) first = r;
      else break;
    }

    // Scan forward from currentRow to find last visible row
    let last = currentRow;
    for (let r = currentRow; r <= currentRow + 35; r++) {
      pt.set(0, r * tileSize, 0);
      if (frustum.containsPoint(pt)) last = r;
      else break;
    }

    // 1-row padding so rows don't pop in/out at the exact edge
    first = Math.max(0, first - 1);
    last = last + 1;

    if (first !== prevFirst.current || last !== prevLast.current) {
      prevFirst.current = first;
      prevLast.current = last;
      setFirstRow(first);
      setLastRow(last);
    }
  });

  return (
    <>
      {Array.from({ length: lastRow - firstRow + 1 }, (_, i) => {
        const rowIndex = firstRow + i;
        const type = getRowType(rowIndex);

        if (type === "safe") {
          return <Grass key={rowIndex} rowIndex={rowIndex} />;
        }

        const layout = getRowLayout(rowIndex);
        if (!layout) return <Grass key={rowIndex} rowIndex={rowIndex} />;

        return (
          <Road key={rowIndex} rowIndex={rowIndex}>
            {layout.cars.map((car, ci) => (
              <Vehicle
                key={ci}
                rowIndex={rowIndex}
                initialTileIndex={car.tileIndex}
                direction={layout.dir as 1 | -1}
                speed={getCarSpeed(rowIndex)}
                color={car.color}
                onHit={onCarHit}
                shieldActive={shieldActive}
                startedAtMs={startedAtMs}
              />
            ))}
          </Road>
        );
      })}
    </>
  );
}
