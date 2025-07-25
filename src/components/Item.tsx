// 画面に落ちてくるアイテムを表すコンポーネント
import React from 'react';


interface ItemProps {
  x: number; // アイテムのX座標
  y: number; // アイテムのY座標
  size: number; // アイテムのサイズ
}

export default function Item({ x, y, size }: ItemProps) {
  return (
    <div
      style={{
        position: 'absolute',
        top: y,
        left: x,
        width: size,
        height: size,
        backgroundColor: 'red',     // イメージの代わりに赤い四角形を使用（変更可能）
        borderRadius: '50%',        // 丸い形
      }}
    />
    );
}

