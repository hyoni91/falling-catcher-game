// ゲームキャンバスのコンポーネント

import React, { useEffect, useRef } from 'react';
import styles from './GameArea.module.css';


interface GameAreaProps {
  width: number;
  height: number;
  children?: React.ReactNode;
  tabIndex?: number;
  onKeyDown?: (event: React.KeyboardEvent) => void;
}


export default function GameArea({ 
  width, height, children, onKeyDown, tabIndex = 0
}: GameAreaProps) {

  const containerRef = useRef<HTMLDivElement>(null);

  // マウント時に自動で .focus()
  useEffect(() => {
    containerRef.current?.focus();
  }, []);


  return (
    <div 
      className={styles.gameArea} 
      ref={containerRef} 
      style={{ width, height }} 
      onKeyDown={onKeyDown} 
      tabIndex={tabIndex}
    >
      {children}
    </div>
  );
}

