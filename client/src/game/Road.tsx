import { tilesPerRow, tileSize } from "../constants";

interface Props {
  rowIndex: number;
  children?: React.ReactNode;
}

export function Road({ rowIndex, children }: Props) {
  return (
    <group position-y={rowIndex * tileSize}>
      <mesh>
        <planeGeometry args={[tilesPerRow * tileSize, tileSize]} />
        <meshLambertMaterial color={0x454a59} />
      </mesh>
      {/* Road markings */}
      <mesh position={[0, 0, 0.5]}>
        <planeGeometry args={[tilesPerRow * tileSize, 2]} />
        <meshLambertMaterial color={0xffffff} transparent opacity={0.15} />
      </mesh>
      {children}
    </group>
  );
}
