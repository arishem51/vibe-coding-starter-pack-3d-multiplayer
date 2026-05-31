import { tilesPerRow, tileSize } from "../constants";

interface Props {
  rowIndex: number;
  children?: React.ReactNode;
}

export function Grass({ rowIndex, children }: Props) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh>
        <boxGeometry args={[tilesPerRow * tileSize, tileSize, 3]} />
        <meshLambertMaterial color={0x91c95f} />
      </mesh>
      {children}
    </group>
  );
}
