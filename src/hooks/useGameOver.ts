import { useCallback, useEffect } from "react";

interface GameOverState {
    timeLeft: { timeLeft: number; reset: () => void, stop: () => void };
    missCount: number;
    thresholdMiss : number;
    thresholdTime: number;
    onReset: () => void;
    gameState: string; // Add gameState to the interface
}

export function useGameOver({ 
    timeLeft, missCount, thresholdMiss, thresholdTime, onReset, gameState
}: GameOverState){
    const checkGameOver = useCallback(()=>{
        if (timeLeft.timeLeft <= thresholdTime || missCount >= thresholdMiss) {
            timeLeft.stop(); // タイマーを停止
            onReset(); // ゲームの状態をリセット
            
        }
    }, [timeLeft, thresholdTime, missCount, thresholdMiss, onReset]);

    useEffect(() => {
      if (gameState === 'Playing') {
        checkGameOver();
      }
    }, [checkGameOver, gameState]);

    return { checkGameOver };  // ゲームオーバーをチェックする関数を返す
}