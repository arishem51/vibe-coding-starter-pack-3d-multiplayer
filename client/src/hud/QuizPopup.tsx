import { useState, useEffect, useRef } from "react";
import { Question, getRandomQuestion } from "../data/questions";

interface Props {
  isBonus?: boolean;
  timeLimit?: number;
  onAnswer: (correct: boolean) => void;
}

export function QuizPopup({ isBonus = false, timeLimit = 15, onAnswer }: Props) {
  const [question] = useState<Question>(() => getRandomQuestion());
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(timeLimit);
  const answered = useRef(false);

  useEffect(() => {
    if (timeLeft <= 0) {
      if (!answered.current) {
        answered.current = true;
        onAnswer(false);
      }
      return;
    }
    const t = setTimeout(() => setTimeLeft((v) => v - 1), 1000);
    return () => clearTimeout(t);
  }, [timeLeft, onAnswer]);

  function handleSelect(idx: number) {
    if (answered.current || selected !== null) return;
    setSelected(idx);
    answered.current = true;
    setTimeout(() => onAnswer(idx === question.correctIndex), 800);
  }

  const timerColor = timeLeft <= 5 ? "#ff4444" : timeLeft <= 10 ? "#ffaa00" : "#44ff88";

  return (
    <div style={{
      position: "fixed", inset: 0, display: "flex", alignItems: "center", justifyContent: "center",
      background: "rgba(0,0,0,0.7)", zIndex: 100,
    }}>
      <div style={{
        background: isBonus ? "#1a1200" : "#0a0a1a",
        border: `2px solid ${isBonus ? "#ffcc00" : "#ff4444"}`,
        borderRadius: 12, padding: 32, maxWidth: 480, width: "90%",
        boxShadow: `0 0 40px ${isBonus ? "#ffcc0066" : "#ff444466"}`,
      }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
          <h2 style={{ margin: 0, color: isBonus ? "#ffcc00" : "#ff4444", fontSize: 18 }}>
            {isBonus ? "🎯 Cơ hội thưởng điểm!" : "⚠️ Bạn bị xe đụng!"}
          </h2>
          <span style={{ color: timerColor, fontWeight: "bold", fontSize: 20 }}>⏱ {timeLeft}s</span>
        </div>

        <p style={{ color: "#ccc", marginBottom: 4, fontSize: 12 }}>
          {isBonus ? "Trả lời đúng để nhận thưởng" : "Trả lời đúng để sống sót"}
        </p>

        <p style={{ color: "white", fontSize: 16, marginBottom: 20, lineHeight: 1.5 }}>
          {question.question}
        </p>

        <div style={{ display: "flex", flexDirection: "column", gap: 10 }}>
          {question.options.map((opt, i) => {
            let bg = "#1e1e2e";
            if (selected !== null) {
              if (i === question.correctIndex) bg = "#1a4a1a";
              else if (i === selected && selected !== question.correctIndex) bg = "#4a1a1a";
            }
            const label = ["A", "B", "C", "D"][i];
            return (
              <button
                key={i}
                onClick={() => handleSelect(i)}
                style={{
                  background: bg, border: "1px solid #444", borderRadius: 8,
                  padding: "10px 16px", color: "white", cursor: "pointer",
                  textAlign: "left", fontSize: 14, transition: "background 0.2s",
                }}
              >
                <strong>[{label}]</strong> {opt}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
}
