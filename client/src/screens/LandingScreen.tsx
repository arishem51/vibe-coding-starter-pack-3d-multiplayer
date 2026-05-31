interface Props {
  onCreateRoom: () => void;
  onJoinRoom: () => void;
}

export function LandingScreen({ onCreateRoom, onJoinRoom }: Props) {
  return (
    <div style={overlay}>
      <div style={card}>
        <h1 style={{ color: "#fff", fontSize: 32, marginBottom: 8, textAlign: "center" }}>
          🎮 SPST Crossy Road
        </h1>
        <p style={{ color: "#aaa", textAlign: "center", marginBottom: 32, fontSize: 14 }}>
          Sinh tồn bằng tri thức
        </p>
        <button style={{ ...btn, background: "#4a90e2" }} onClick={onCreateRoom}>
          🏠 Tạo phòng (Admin)
        </button>
        <button style={{ ...btn, background: "#2e7d32", marginTop: 12 }} onClick={onJoinRoom}>
          🚪 Vào phòng (Player)
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
  padding: 40, width: 320, display: "flex", flexDirection: "column",
};

const btn: React.CSSProperties = {
  padding: "14px 20px", border: "none", borderRadius: 8, color: "white",
  fontSize: 16, fontWeight: "bold", cursor: "pointer",
};
