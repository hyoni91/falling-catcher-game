

export function HowToStart({ setShowHowToStart }: { setShowHowToStart: (show: boolean) => void }) {
  return (
    <div className="how-to-start">
      <h1>How to Play</h1>
        <p>Falling items are caught by space-bar on the Catch Zone.</p>
        <p>Perfect: ±10px → 100 points</p>
        <p>Good: ±20px → 50 points</p>
        <p>Miss: Others → Miss Count +1</p>
        <p>Game Over when timer reaches 0 or miss count reaches 10</p>
      <button onClick={() => setShowHowToStart(false)}>Go to Play!</button>
    </div>
  );
}