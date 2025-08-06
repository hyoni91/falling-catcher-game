

interface ScoreBoardProps {
    score: number; // 現在のスコア
    missCount: number; // ミスのカウント
    timeLeft: number; // 残り時間
}


export default function ScoreBoard({score, missCount, timeLeft}: ScoreBoardProps) {

    return(
        <div className="score-board">
            <div>Score: {score}</div>
            <div>Miss: {missCount}</div>
            <div>Time Left: {timeLeft}s</div>
        </div>
    )
}
