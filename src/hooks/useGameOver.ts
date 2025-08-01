import { useCallback } from "react";

interface GameOverState {
    timeLife: { timeLeft: number; reset: () => void };
    missCount: number;
    score: number;
    thresholdMiss : number;
    thresholdTime: number;
    onReset: () => void;
}

export function useGameOver({ 
    timeLife, missCount, score, thresholdMiss, thresholdTime, onReset 
}: GameOverState){
    const checkGameOver = useCallback(()=>{
        if (timeLife.timeLeft <= thresholdTime || missCount >= thresholdMiss) {
            alert(`Game Over! Your score: ${score}`);
            timeLife.reset(); // タイマーをリセット
            onReset(); // ゲームの状態をリセット
  
        }
    }, [timeLife, thresholdTime, missCount, thresholdMiss, score, onReset]);

    return { checkGameOver };  // ゲームオーバーをチェックする関数を返す
}