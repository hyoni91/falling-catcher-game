// ゲームキャンバスのコンポーネント

import React from 'react';
import styles from './GameArea.module.css';

interface GameAreaProps {
    width: number;
    height: number;
    children?: React.ReactNode; // 子要素を受け入れる
    tabIndex?: number; // キーボードフォーカスを受け入れるための属性
    onKeyDown?: (event: React.KeyboardEvent) => void; // キーボードイベントハンドラ
}

export default function GameArea({ width, height, children, onKeyDown, tabIndex }: GameAreaProps) {
  return (
    <div className={styles.gameArea} style={{ width, height }} onKeyDown={onKeyDown} tabIndex={tabIndex}>
      {children}
    </div>
  );
}

