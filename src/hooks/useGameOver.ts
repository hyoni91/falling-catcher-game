import { useCallback, useEffect } from "react";

interface GameOverState {
    timeLeft: { timeLeft: number; reset: () => void, stop: () => void };
    missCount: number;
    score: number;
    thresholdMiss : number;
    thresholdTime: number;
    onReset: () => void;
    gameState: string; // Add gameState to the interface
}

export function useGameOver({ 
    timeLeft, missCount, score, thresholdMiss, thresholdTime, onReset, gameState
}: GameOverState){
    const checkGameOver = useCallback(()=>{
        if (timeLeft.timeLeft <= thresholdTime || missCount >= thresholdMiss) {
            alert(`Game Over! Your score: ${score}`);
            timeLeft.stop(); // タイマーを停止
            onReset(); // ゲームの状態をリセット
            
        }
    }, [timeLeft, thresholdTime, missCount, thresholdMiss, score, onReset]);

    useEffect(() => {
      if (gameState === 'Playing') {
        checkGameOver();
      }
    }, [checkGameOver, gameState]);

    return { checkGameOver };  // ゲームオーバーをチェックする関数を返す
}