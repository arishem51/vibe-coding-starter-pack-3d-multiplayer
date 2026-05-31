import { useGameStore } from "../stores/gameStore";

interface Props {
  onPlayAgain: () => void;
}

export function WinnerScreen({ onPlayAgain }: Props) {
  const players = useGameStore((s) => s.players);
  const roomCode = useGameStore((s) => s.roomCode);

  const sorted = [...players.values()]
    .filter((p) => p.roomCode === roomCode && !p.isAdmin)
    .sort((a, b) => b.score - a.score || b.lives - a.lives);

  const winner = sorted.find((p) => p.status !== "eliminated") ?? sorted[0];

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={{ textAlign: "center", marginBottom: 28 }}>
          <div style={{ fontSize: 48, marginBottom: 12 }}>🏆</div>
          <h2 style={{ color: "#ffcc00", margin: 0, fontSize: 24 }}>Người thắng</h2>
          {winner && (
            <div style={{ color: "white", fontSize: 28, fontWeight: "bold", marginTop: 8 }}>
              {winner.display_name}
            </div>
          )}
        </div>

        <div style={{ marginBottom: 24 }}>
          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 10 }}>Bảng xếp hạng:</div>
          {sorted.map((p, i) => (
            <div
              key={p.identity.toHexString()}
              style={{
                display: "flex", justifyContent: "space-between", alignItems: "center",
                padding: "8px 12px", background: i === 0 ? "#1a1500" : "#0d1117",
                borderRadius: 6, marginBottom: 4,
                border: i === 0 ? "1px solid #ffcc0040" : "none",
              }}
            >
              <span style={{ color: "#aaa", width: 24 }}>{i + 1}.</span>
              <span style={{ color: "white", flex: 1 }}>
                {p.characterType === "white" ? "⬜" : "⬛"} {p.displayName}
              </span>
              <span style={{ color: "#aaa", fontSize: 12 }}>
                {p.status === "eliminated" ? "💀" : `❤️ ${p.lives}`} &nbsp; ⭐{p.score}
              </span>
            </div>
          ))}
        </div>

        <button
          onClick={onPlayAgain}
          style={{
            width: "100%", padding: 14, background: "#4a90e2", border: "none",
            borderRadius: 8, color: "white", fontSize: 15, fontWeight: "bold", cursor: "pointer",
          }}
        >
          🔄 Chơi lại
        </button>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "#0d1117",
};
const card: React.CSSProperties = {
  background: "#161b22", border: "1px solid #30363d", borderRadius: 12,
  padding: 32, width: 380,
};
