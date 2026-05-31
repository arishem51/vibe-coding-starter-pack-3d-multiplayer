import { useState } from "react";

interface Props {
  onSubmit: (roomCode: string, playerName: string) => void;
  error: string | null;
  onBack: () => void;
}

export function JoinRoomScreen({ onSubmit, error, onBack }: Props) {
  const [code, setCode] = useState("");
  const [name, setName] = useState("");

  const canSubmit = code.trim().length === 5 && name.trim().length > 0;

  return (
    <div style={overlay}>
      <div style={card}>
        <button onClick={onBack} style={backBtn}>← Quay lại</button>
        <h2 style={{ color: "#fff", marginBottom: 24 }}>Vào phòng</h2>

        <label style={label}>Mã phòng (5 ký tự)</label>
        <input
          style={input}
          value={code}
          onChange={(e) => setCode(e.target.value.toUpperCase().slice(0, 5))}
          placeholder="VD: A7K2Q"
          maxLength={5}
        />

        <label style={{ ...label, marginTop: 16 }}>Tên của bạn</label>
        <input
          style={input}
          value={name}
          onChange={(e) => setName(e.target.value)}
          placeholder="Nhập tên..."
          onKeyDown={(e) => e.key === "Enter" && canSubmit && onSubmit(code.trim(), name.trim())}
        />

        {error && <p style={{ color: "#ff4444", fontSize: 13, marginTop: 10 }}>⚠️ {error}</p>}

        <button
          style={{ ...btn, marginTop: 20, opacity: canSubmit ? 1 : 0.5 }}
          disabled={!canSubmit}
          onClick={() => onSubmit(code.trim(), name.trim())}
        >
          Vào phòng
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
  padding: 40, width: 340, position: "relative",
};
const label: React.CSSProperties = { color: "#aaa", fontSize: 13, marginBottom: 6, display: "block" };
const input: React.CSSProperties = {
  width: "100%", padding: "10px 12px", background: "#0d1117", border: "1px solid #30363d",
  borderRadius: 6, color: "white", fontSize: 15, boxSizing: "border-box",
};
const btn: React.CSSProperties = {
  width: "100%", padding: "14px 20px", background: "#2e7d32", border: "none",
  borderRadius: 8, color: "white", fontSize: 15, fontWeight: "bold", cursor: "pointer",
};
const backBtn: React.CSSProperties = {
  background: "none", border: "none", color: "#aaa", cursor: "pointer",
  fontSize: 13, marginBottom: 16, padding: 0,
};
