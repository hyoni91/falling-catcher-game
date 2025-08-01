
import {  useEffect, useRef, useState } from 'react';
import './App.css'
import GameArea from './components/GameArea'
import { useGameLoop } from './hooks/useGameLoop';
import Item from './components/Item';
import CatchZone from './components/CatchZone';
import useInput from './hooks/useInput';
import ScoreBoard from './components/ScoreBoard';
import { useTimer } from './hooks/useTimer';
import { useGameOver } from './hooks/useGameOver';
import { useCatch } from './hooks/useCatch';
import { useSpawnAndPhysics } from './hooks/useSpawnAndPhysics';
import type { ItemType } from './types';

// 定数の定義
const BOX_SIZE = 500; 
const ITEM_SIZE = 20;
const SPAWN_INTERVAL = 1000; // ms 1秒ごとにアイテムを生成
const MISS_COUNT_THRESHOLD = 10; // ミスカウントの閾値

// キャッチゾーンのY座標
const GAME_AREA_HEIGHT = 700;
const CATCH_ZONE_HEIGHT = 50;

function App() {
  
  const [items, setItems] = useState<ItemType[]>([]);
  const [score, setScore] = useState(0); 
  const [missCount, setMissCount] = useState(0); 
  const nextId = useRef(0);
  const spawnTimer = useRef(0); // アイテム生成のタイマー(next idを生成する間の時間)
  const timeLeft = useTimer(60); 
  const CatchZoneY = GAME_AREA_HEIGHT - CATCH_ZONE_HEIGHT; 


    // ゲームオーバーの状態を管理するカスタムフックを使用
    const { checkGameOver } = useGameOver({
      timeLife: timeLeft,
      missCount,
      score,
      thresholdMiss: MISS_COUNT_THRESHOLD,
      thresholdTime: 0, // タイマーの閾値は0に設定
      onReset: () => {
        setItems([]);
        setScore(0);
        setMissCount(0);
        nextId.current = 0;
        spawnTimer.current = 0;
        timeLeft.reset();
      }
    })

    useEffect(()=>{
      checkGameOver(); // 初期状態でゲームオーバーをチェック
    },[checkGameOver, timeLeft.timeLeft, missCount]);

    const { update, applyPhysics } = useSpawnAndPhysics({
    spawnInterval: SPAWN_INTERVAL,
    maxX: BOX_SIZE,
    itemSize: ITEM_SIZE,
    gameAreaHeight: GAME_AREA_HEIGHT,
    onMiss: count => setMissCount(m => m + count),
    setItems,
  });

  useGameLoop(dt => {
      update(dt);
      setItems(items => applyPhysics(items, dt)); // アイテムの物理演算を適用
    });

  const catchHandler = useCatch({
    items,
    itemSize: ITEM_SIZE,
    CatchZoneY,
    onHit: (id, scoreDelta) => {
      setScore(s => s + scoreDelta); 
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // キャッチしたアイテムを削除
    },
    onMiss: (id) => {
      setMissCount(m => m + 1); 
      setItems(prevItems => prevItems.filter(item => item.id !== id)); // ミスしたアイテムを削除
    }
  });

  useInput(catchHandler); 

  return (
    <>
      <GameArea 
        width={BOX_SIZE} 
        height={GAME_AREA_HEIGHT}
      >
        <h1>ゲームエリア</h1>
         <CatchZone y={CatchZoneY} height={CATCH_ZONE_HEIGHT} />

        {items.map(item => (
          <Item key={item.id} x={item.x} y={item.y} size={ITEM_SIZE} />
        ))}
      </GameArea>
      <ScoreBoard 
        score={score}
        missCount={missCount}
        timeLeft={timeLeft.timeLeft}
      />
    </>
  )
}

export default App
