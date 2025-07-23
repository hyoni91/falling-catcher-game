// アイテムの生成・移動・判定を行うカスタムフック

import { useEffect, useRef } from "react";

// update関数を受け取り、ゲームループを実行するカスタムフック
// dtは前回の更新からの経過時間を表す -> void 
export function useGameLoop(update:(dt:number)=> void){

    // フレームごとの参照を保持するためのuseRefフック
    // frameRefは現在のフレームIDを保持し、lastTimeRefは前回の更新時の時間を保持する
    // performance.now()は現在の時間をミリ秒単位で取得する
    const frameRef = useRef<number>(undefined);
    const lastTimeRef = useRef<number>(performance.now());

    const loop = (now:number) => {
        const dt = now - lastTimeRef.current; // 前回の更新からの経過時間を計算
        lastTimeRef.current = now; // 現在の時間を更新
        update(dt); // 更新関数を呼び出す
        frameRef.current = requestAnimationFrame(loop); // 次のフレームをリクエスト
    }

    useEffect(() => {
        frameRef.current = requestAnimationFrame(loop); // 初回のループを開始
        return () => {
            if (frameRef.current) {
                cancelAnimationFrame(frameRef.current); // コンポーネントがアンマウントされたときにループを停止
            }
        };
    }, []);
    }
