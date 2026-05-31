import { useState } from "react";

interface Props {
  onSubmit: (displayName: string) => void;
  roomCode: string | null;
  onGoLobby: () => void;
  onBack: () => void;
}

export function CreateRoomScreen({ onSubmit, roomCode, onGoLobby, onBack }: Props) {
  const [name, setName] = useState("");

  return (
    <div style={overlay}>
      <div style={card}>
        <button onClick={onBack} style={backBtn}>← Quay lại</button>
        <h2 style={{ color: "#fff", marginBottom: 24 }}>Tạo phòng mới</h2>

        {!roomCode ? (
          <>
            <label style={label}>Tên của bạn</label>
            <input
              style={input}
              value={name}
              onChange={(e) => setName(e.target.value)}
              placeholder="Nhập tên..."
              onKeyDown={(e) => e.key === "Enter" && name.trim() && onSubmit(name.trim())}
            />
            <button
              style={{ ...btn, marginTop: 20, opacity: name.trim() ? 1 : 0.5 }}
              disabled={!name.trim()}
              onClick={() => onSubmit(name.trim())}
            >
              Tạo phòng
            </button>
          </>
        ) : (
          <>
            <div style={{ textAlign: "center", margin: "20px 0" }}>
              <p style={{ color: "#aaa", marginBottom: 8 }}>Mã phòng:</p>
              <div style={{
                fontSize: 36, fontWeight: "bold", color: "#4a90e2",
                letterSpacing: 8, fontFamily: "monospace",
              }}>
                {roomCode}
              </div>
              <p style={{ color: "#666", fontSize: 12, marginTop: 8 }}>
                Chia sẻ mã này cho lớp
              </p>
            </div>
            <button style={btn} onClick={onGoLobby}>
              Vào phòng chờ →
            </button>
          </>
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
  padding: 40, width: 340, position: "relative",
};
const label: React.CSSProperties = { color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" };
const input: React.CSSProperties = {
  width: "100%", padding: "10px 12px", background: "#0d1117", border: "1px solid #30363d",
  borderRadius: 6, color: "white", fontSize: 15, boxSizing: "border-box",
};
const btn: React.CSSProperties = {
  width: "100%", padding: "14px 20px", background: "#4a90e2", border: "none",
  borderRadius: 8, color: "white", fontSize: 15, fontWeight: "bold", cursor: "pointer",
};
const backBtn: React.CSSProperties = {
  background: "none", border: "none", color: "#aaa", cursor: "pointer",
  fontSize: 13, marginBottom: 16, padding: 0,
};
