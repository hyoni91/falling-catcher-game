
/**
 * useGameLoop : アイテムの生成・移動・判定を行うカスタムフック
 * @param update - フレームごとに呼び出される更新関数
 * このフックは、ゲームのループを管理し、指定された更新関数をフレームごとに呼び出します。   
 * useGameLoopは、requestAnimationFrameを使用して、ブラウザの描画タイミングに合わせて更新を行います。
 * @returns void
 */


import { useEffect, useRef } from "react";

export function useGameLoop(update: (dt: number) => void){
    const frameRef = useRef<number>(undefined); // requestAnimationFrameのIDを保持
    const lastTimeRef = useRef<number>(performance.now()); // 前回のフレームの時間を保持
    const updateRef = useRef(update); // update関数を保持するためのref

    // updateが変わるたびにrefに最新の関数を保存
    useEffect(() => {
        updateRef.current = update;
    }, [update]);

    const loop = (now: number) => {
        const dt = now - lastTimeRef.current;
        lastTimeRef.current = now;
        updateRef.current(dt); // 最新のupdate関数を呼び出す
        frameRef.current = requestAnimationFrame(loop);
    };

    useEffect(() => {
        frameRef.current = requestAnimationFrame(loop);
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current);
            }
        };
    }, []);
}
