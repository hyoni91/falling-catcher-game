

interface ScoreBoardProps {
    score: number; // 現在のスコア
    missCount: number; // ミスのカウント
    timeLeft: number; // 残り時間
}


export default function ScoreBoard({score, missCount, timeLeft}: ScoreBoardProps) {

    return(
        <div
        style={{
            position: 'absolute',
            top: 20,
            left: 15,
            color: 'black',
            fontSize: '16px',
            display: 'flex',
            gap: '20px',
            zIndex: 200,
      }}>
            <div>Score: {score}</div>
            <div>Miss: {missCount}</div>
            <div>Time Left: {timeLeft}s</div>
        </div>
    )
}
