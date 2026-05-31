import { useGameStore } from "../stores/gameStore";

interface Props {
  isAdmin: boolean;
  roomCode: string;
  onStart: () => void;
  onForceEnd: () => void;
}

export function LobbyScreen({ isAdmin, roomCode, onStart, onForceEnd }: Props) {
  const players = useGameStore((s) => s.players);
  const roomPlayers = [...players.values()].filter((p) => p.roomCode === roomCode);

  return (
    <div style={overlay}>
      <div style={card}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 4 }}>
          <h2 style={{ color: "#fff", margin: 0 }}>Phòng chờ</h2>
          <div style={{ fontFamily: "monospace", fontSize: 24, color: "#4a90e2", fontWeight: "bold", letterSpacing: 4 }}>
            {roomCode}
          </div>
        </div>
        <p style={{ color: "#666", fontSize: 13, marginBottom: 20 }}>
          {isAdmin ? "Bạn là Admin (Ghost)" : "Đang chờ host bắt đầu..."}
        </p>

        <div style={{ marginBottom: 20 }}>
          <div style={{ color: "#aaa", fontSize: 13, marginBottom: 8 }}>
            Người chơi ({roomPlayers.length}/30):
          </div>
          <div style={{ maxHeight: 280, overflowY: "auto", display: "flex", flexDirection: "column", gap: 6 }}>
            {roomPlayers.map((p) => (
              <div
                key={p.identity.toHexString()}
                style={{
                  padding: "8px 12px", background: "#0d1117", borderRadius: 6,
                  display: "flex", justifyContent: "space-between", alignItems: "center",
                }}
              >
                <span style={{ color: "white", fontSize: 14 }}>
                  {p.isAdmin ? "👻" : p.characterType === "white" ? "⬜" : "⬛"} {p.displayName}
                  {p.isAdmin && <span style={{ color: "#aaa", fontSize: 11 }}> (Admin)</span>}
                </span>
              </div>
            ))}
          </div>
        </div>

        {isAdmin && (
          <button
            style={{
              width: "100%", padding: "14px", background: "#2e7d32", border: "none",
              borderRadius: 8, color: "white", fontSize: 16, fontWeight: "bold", cursor: "pointer",
            }}
            onClick={onStart}
          >
            🚀 Bắt đầu ngay!
          </button>
        )}
        {isAdmin && (
          <button
            onClick={onForceEnd}
            style={{
              width: "100%", padding: "10px", background: "none", border: "1px solid #444",
              borderRadius: 8, color: "#888", fontSize: 13, cursor: "pointer", marginTop: 8,
            }}
          >
            Kết thúc ngay
          </button>
        )}
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
