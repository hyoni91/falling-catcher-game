// ゲームキャンバスのコンポーネント

import React from 'react';
import styles from './GameArea.module.css';

interface GameAreaProps {
    width: number;
    height: number;
    children?: React.ReactNode; // 子要素を受け入れる
}

export default function GameArea({ width, height, children }: GameAreaProps) {
  

  return (
    <div className={styles.gameArea} style={{ width, height }}>
      {children}
    </div>
  );
}

