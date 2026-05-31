interface Props { lives: number }

export function LivesDisplay({ lives }: Props) {
  return (
    <div style={{ display: "flex", gap: 4, fontSize: 24 }}>
      {Array.from({ length: 3 }, (_, i) => (
        <span key={i} style={{ opacity: i < lives ? 1 : 0.25 }}>❤️</span>
      ))}
    </div>
  );
}
