
// components/GameOverOverlay.tsx
import React from "react";

interface Props {
  score: number;
  missCount: number;
}

export function GameOverOverlay({
  score,
  missCount,
}: Props) {
  return (
    <div className="game-over-overlay">
      <p>🎮 Game Over 🎮</p>
      <p>Score: {score}</p>
      <p>Misses: {missCount}</p>
    </div>
  );
}
