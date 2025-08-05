import { useCallback, useEffect } from "react";

interface GameOverState {
    timeLeft: { timeLeft: number; reset: () => void };
    missCount: number;
    score: number;
    thresholdMiss : number;
    thresholdTime: number;
    onReset: () => void;
}

export function useGameOver({ 
    timeLeft, missCount, score, thresholdMiss, thresholdTime, onReset 
}: GameOverState){
    const checkGameOver = useCallback(()=>{
        if (timeLeft.timeLeft <= thresholdTime || missCount >= thresholdMiss) {
            alert(`Game Over! Your score: ${score}`);
            timeLeft.reset(); // タイマーをリセット
            onReset(); // ゲームの状態をリセット
  
        }
    }, [timeLeft, thresholdTime, missCount, thresholdMiss, score, onReset]);

    useEffect(() => {
    checkGameOver();
  }, [checkGameOver]);

    return { checkGameOver };  // ゲームオーバーをチェックする関数を返す
}