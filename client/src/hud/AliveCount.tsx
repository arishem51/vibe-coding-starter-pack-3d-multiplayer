import { useGameStore } from "../stores/gameStore";

export function AliveCount() {
  const players = useGameStore((s) => s.players);
  const roomCode = useGameStore((s) => s.roomCode);
  const count = [...players.values()].filter(
    (p) => p.roomCode === roomCode && (p.status === "alive" || p.status === "in_quiz") && !p.isAdmin
  ).length;

  return (
    <div style={{ color: "white", fontWeight: "bold", fontSize: 16, textShadow: "0 1px 3px #000" }}>
      Còn {count} người
    </div>
  );
}
