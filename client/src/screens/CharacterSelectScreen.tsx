import { useState } from "react";

interface Props {
  onSelect: (type: "white" | "black") => void;
}

export function CharacterSelectScreen({ onSelect }: Props) {
  const [hovered, setHovered] = useState<string | null>(null);

  const chars = [
    {
      id: "white" as const,
      emoji: "⬜",
      name: "Xạ Thủ",
      color: "#ffffff",
      desc: ["Passive: +1 đạn mỗi 5s (tối đa 5)", "Skill [Space]: Bắn đạn theo trục", "Trúng → đẩy target 1 ô"],
    },
    {
      id: "black" as const,
      emoji: "⬛",
      name: "Hộ Vệ",
      color: "#888888",
      desc: ["Passive: +7s quiz khi bị xe đụng", "Skill [F]: Bật khiên 3s (hồi 9s)", "Khiên → phản xe & đạn"],
    },
  ];

  return (
    <div style={overlay}>
      <div style={card}>
        <h2 style={{ color: "#fff", marginBottom: 8, textAlign: "center" }}>Chọn nhân vật</h2>
        <p style={{ color: "#666", fontSize: 13, textAlign: "center", marginBottom: 28 }}>
          Admin là Ghost — không thể thắng
        </p>
        <div style={{ display: "flex", gap: 16 }}>
          {chars.map((c) => (
            <button
              key={c.id}
              onClick={() => onSelect(c.id)}
              onMouseEnter={() => setHovered(c.id)}
              onMouseLeave={() => setHovered(null)}
              style={{
                flex: 1, background: hovered === c.id ? "#1e2a3a" : "#161b22",
                border: `2px solid ${hovered === c.id ? "#4a90e2" : "#30363d"}`,
                borderRadius: 12, padding: 20, cursor: "pointer",
                transition: "all 0.15s", textAlign: "center",
              }}
            >
              <div style={{ fontSize: 40, marginBottom: 8 }}>{c.emoji}</div>
              <div style={{ color: "#fff", fontWeight: "bold", fontSize: 16, marginBottom: 12 }}>
                {c.name}
              </div>
              {c.desc.map((d, i) => (
                <p key={i} style={{ color: "#aaa", fontSize: 12, margin: "4px 0", textAlign: "left" }}>
                  • {d}
                </p>
              ))}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

const overlay: React.CSSProperties = {
  position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
  background: "#0d1117",
};
const card: React.CSSProperties = {
  background: "#161b22", border: "1px solid #30363d", borderRadius: 12, padding: 40, maxWidth: 520,
};
