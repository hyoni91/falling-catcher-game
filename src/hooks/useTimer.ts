// src/hooks/useTimer.ts
import { useCallback, useEffect, useRef, useState } from 'react';

export function useTimer(initialSeconds: number, enabled = true) {
  const [timeLeft, setTimeLeft] = useState(initialSeconds);
  const timerId = useRef<number | null>(null);

  useEffect(() => {
    if (!enabled) return;      // ビ活性化時は登録しない

    // すでにインターバルが登録されている場合はスキップ
    if (timerId.current !== null) return;

    timerId.current = window.setInterval(() => {
      setTimeLeft(prev => {
        if (prev <= 1) {
          // 0秒到達時のクリーンアップ
          clearInterval(timerId.current!);
          timerId.current = null;
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    // コンポーネントのアンマウントまたはenabledの変更時にクリーンアップ
    return () => {
      if (timerId.current !== null) {
        clearInterval(timerId.current);
        timerId.current = null;
      }
    };
  }, [enabled]);  

  const reset = useCallback(() => {
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  const stop = useCallback(() => {
    if (timerId.current !== null) {
      clearInterval(timerId.current);
      timerId.current = null;
    }
    setTimeLeft(initialSeconds);
  }, [initialSeconds]);

  return { timeLeft, reset, stop };
}
