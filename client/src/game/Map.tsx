import { Grass } from "./Grass";
import { Road } from "./Road";
import { Vehicle } from "./Vehicle";
import { getRowType, getCarDirection, getCarSpeed, getCarSpacing, NUM_ROWS, minTileIndex, maxTileIndex, tileSize } from "../constants";

interface Props {
  onCarHit: () => void;
  shieldActive: boolean;
}

// Pre-generate car layouts per road row (stable across renders)
const rowLayouts = Array.from({ length: NUM_ROWS }, (_, i) => {
  if (getRowType(i) !== "road") return null;
  const dir = getCarDirection(i);
  const spacing = getCarSpacing(i);
  const color = [0xbdb638, 0x78b14b, 0xa52523, 0x4488cc, 0xdd7722][i % 5];
  const cars = [];
  for (let t = minTileIndex; t <= maxTileIndex; t += spacing) {
    cars.push({ tileIndex: t, color });
  }
  return { dir, cars };
});

export function Map({ onCarHit, shieldActive }: Props) {
  return (
    <>
      <Grass rowIndex={0} />
      {Array.from({ length: NUM_ROWS }, (_, i) => {
        const rowIndex = i + 1;
        const type = getRowType(rowIndex);

        if (type === "safe") {
          return <Grass key={rowIndex} rowIndex={rowIndex} />;
        }

        const layout = rowLayouts[rowIndex];
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
              />
            ))}
          </Road>
        );
      })}
    </>
  );
}
