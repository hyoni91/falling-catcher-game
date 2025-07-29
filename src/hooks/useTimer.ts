
// 60秒カウントダウンタイマー

import { useCallback, useEffect, useState } from "react";


export function useTimer(initialSeconds: number) {
    const [timeLeft, setTimeLeft] = useState(initialSeconds);  

    useEffect(()=>{

        if (timeLeft <= 0) return; 

        const timer = setInterval(() => {
            setTimeLeft(prev => {
                if (prev <= 1) {
                    clearInterval(timer); // タイマーをクリア
                    return 0; // 0秒に設定
                }
                return prev - 1; // 1秒減らす
            });
        }, 1000); // 1秒ごとに実行

        return () => clearInterval(timer); // クリーンアップ関数でタイマーをクリア
    },[timeLeft]) // 初期秒数が変更されたときに再実行

    const reset = useCallback(() => { 
        setTimeLeft(initialSeconds);
    }, [initialSeconds]);

  return { timeLeft, reset };
}