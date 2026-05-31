import { LivesDisplay } from "./LivesDisplay";
import { AliveCount } from "./AliveCount";
import { QuizPopup } from "./QuizPopup";
import { PlayerData } from "../types";

interface Props {
  myPlayer: PlayerData | null;
  onBonusAnswer: (correct: boolean) => void;
}

export function HUD({ myPlayer, onBonusAnswer }: Props) {
  if (!myPlayer) return null;

  const hasBonus = myPlayer.bonusQuestionPending;

  return (
    <>
      {/* Top bar */}
      <div style={{
        position: "fixed", top: 0, left: 0, right: 0,
        display: "flex", justifyContent: "space-between", alignItems: "center",
        padding: "12px 20px", pointerEvents: "none",
        background: "linear-gradient(to bottom, rgba(0,0,0,0.6), transparent)",
      }}>
        <LivesDisplay lives={myPlayer.lives} />
        <AliveCount />
        <div style={{ color: "white", fontWeight: "bold", textShadow: "0 1px 3px #000" }}>
          ⭐ {myPlayer.score}
        </div>
      </div>

      {/* Character skill info */}
      <div style={{
        position: "fixed", bottom: 20, left: 20, pointerEvents: "none",
      }}>
        {myPlayer.characterType === "white" && (
          <div style={{ color: "white", background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: 8, fontSize: 14 }}>
            🔫 Đạn: {myPlayer.ammo}/5 &nbsp;
            <span style={{ fontSize: 11, color: "#aaa" }}>[Space] bắn</span>
          </div>
        )}
        {myPlayer.characterType === "black" && (
          <div style={{ color: "white", background: "rgba(0,0,0,0.5)", padding: "6px 12px", borderRadius: 8, fontSize: 14 }}>
            🛡 Khiên: {myPlayer.shieldActive ? "⚡ ĐANG BẬT" : myPlayer.shieldCooldown ? "⏳ hồi chiêu" : "✅ sẵn sàng"}
            <span style={{ fontSize: 11, color: "#aaa" }}> &nbsp;[F] bật</span>
          </div>
        )}
      </div>

      {/* Bonus quiz popup */}
      {hasBonus && <QuizPopup isBonus timeLimit={20} onAnswer={onBonusAnswer} />}
    </>
  );
}
