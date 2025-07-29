// 入力を監視するカスタムフック（判定用）

import { useEffect } from "react";


type inputHandler = () => void;

export default function useInput(onInput: inputHandler) {
  // キーボード入力を監視するためのイベントリスナーを設定
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.code === 'Space') { // スペースキーが押されたとき
        onInput(); // 入力ハンドラーを呼び出す
      }
    };
  
    window.addEventListener('keydown', handleKeyDown);

    // クリーンアップ関数でイベントリスナーを削除
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [onInput]); // onInputが変更されたときに再実行

}