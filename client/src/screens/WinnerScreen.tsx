import { useGameStore } from "../stores/gameStore";

interface Props {
  onPlayAgain: () => void;
}

export function WinnerScreen({ onPlayAgain }: Props) {
  const players = useGameStore((s) => s.players);
  const roomCode = useGameStore((s) => s.roomCode);
  const myIdentityHex = useGameStore((s) => s.myIdentityHex);

  const sorted = [...players.values()]
    .filter((p) => p.roomCode === roomCode && !p.isAdmin)
    .sort((a, b) => b.score - a.score || b.lives - a.lives);

  const winner = sorted.find((p) => p.status !== "eliminated") ?? sorted[0];
  const me = myIdentityHex ? players.get(myIdentityHex) : undefined;
  const isAdmin = me?.isAdmin ?? false;
  const myRank = me ? sorted.findIndex((p) => p.identity.toHexString() === myIdentityHex) + 1 : 0;

  return (
    <div style={overlay}>
      <div style={{ ...card, maxWidth: isAdmin ? 440 : 360 }}>
        {/* Header */}
        <div style={{ textAlign: "center", marginBottom: 24 }}>
          <div style={{ fontSize: 44, marginBottom: 8 }}>🏆</div>
          <h2 style={{ color: "#ffcc00", margin: 0, fontSize: 22 }}>Kết thúc</h2>
          {winner && (
            <div style={{ color: "white", fontSize: 26, fontWeight: "bold", marginTop: 6 }}>
              {winner.displayName}
            </div>
          )}
        </div>

        {isAdmin ? (
          /* Admin: full leaderboard with scroll */
          <div style={{ marginBottom: 20 }}>
            <div style={{ color: "#aaa", fontSize: 12, marginBottom: 8 }}>Bảng xếp hạng</div>
            <div style={{ maxHeight: 360, overflowY: "auto", paddingRight: 4 }}>
              {sorted.map((p, i) => (
                <div
                  key={p.identity.toHexString()}
                  style={{
                    display: "flex", justifyContent: "space-between", alignItems: "center",
                    padding: "8px 12px",
                    background: i === 0 ? "#1a1500" : "#0d1117",
                    borderRadius: 6, marginBottom: 4,
                    border: i === 0 ? "1px solid #ffcc0040" : "none",
                  }}
                >
                  <span style={{ color: i === 0 ? "#ffcc00" : "#aaa", width: 28, fontWeight: i === 0 ? "bold" : "normal" }}>
                    {i + 1}.
                  </span>
                  <span style={{ color: "white", flex: 1, fontSize: 14 }}>
                    {p.characterType === "white" ? "⬜" : "⬛"} {p.displayName}
                  </span>
                  <span style={{ color: "#aaa", fontSize: 12 }}>
                    {p.status === "eliminated" ? "💀" : `❤️ ${p.lives}`}&nbsp; ⭐{p.score}
                  </span>
                </div>
              ))}
            </div>
          </div>
        ) : (
          /* Player: just their rank and score */
          <div style={{
            background: "#0d1117", borderRadius: 10, padding: "20px 24px",
            marginBottom: 20, textAlign: "center",
          }}>
            {myRank > 0 ? (
              <>
                <div style={{ color: "#aaa", fontSize: 13, marginBottom: 6 }}>Kết quả của bạn</div>
                <div style={{ color: myRank === 1 ? "#ffcc00" : "white", fontSize: 36, fontWeight: "bold" }}>
                  #{myRank}
                </div>
                <div style={{ color: "#aaa", fontSize: 14, marginTop: 4 }}>
                  ⭐ {me?.score ?? 0} điểm
                  {me?.status !== "eliminated" && me && <>&nbsp; ❤️ {me.lives}</>}
                  {me?.status === "eliminated" && <>&nbsp; 💀</>}
                </div>
              </>
            ) : (
              <div style={{ color: "#aaa" }}>Không tìm thấy dữ liệu</div>
            )}
          </div>
        )}

        <button
          onClick={onPlayAgain}
          style={{
            width: "100%", padding: 13, background: "#4a90e2", border: "none",
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
  padding: 32, width: "90%",
};
